#!/usr/bin/env bash
# Copy application *data* from your local Postgres into the Postgres container on a Droplet
# via SSH + `docker exec -i`.
#
# Assumptions (important):
# - Local and Droplet schemas already match (same `prisma migrate deploy` baseline).
# - `_prisma_migrations` stays on Droplet untouched; row data moves for all other public tables.
# - Droplet Postgres must be reachable FROM THE DROPLET HOST as localhost (Docker Postgres).
#
# Prerequisites (Mac/Linux):
#   - `pg_dump` in PATH (`brew install libpq && brew link --force libpq` on macOS often).
#   - SSH key login as root (or edit SSH_USER below).
#
# When host `pg_dump localhost:5432` hits the wrong Postgres (common on macOS —
# IPv4 vs IPv6 or another daemon), skip TCP and dump from inside compose:
#
#   export LOCAL_PG_CONTAINER=postgres-local
#   Optional: LOCAL_PG_USER=admin LOCAL_PG_DB=mydb
#
# Typical usage FROM YOUR MACHINE (never commit URLs with passwords):
#
#   export DROPLET_HOST=139.59.0.32
#   export SSH_KEY="$HOME/.ssh/digitalocean_key"
#   export LOCAL_DATABASE_URL="postgresql://admin:admin123@127.0.0.1:5432/mydb"
#
# Optional local dump source (recommended on macOS Docker Desktop):
#   export LOCAL_PG_CONTAINER=postgres-local
#   LOCAL_PG_USER=admin
#   LOCAL_PG_DB=mydb
#
#   export SSH_USER=root
#   export REMOTE_CONTAINER=postgres-local
#   export REMOTE_DB_USER=admin
#   export REMOTE_DB_NAME=mydb
#
#   chmod +x backend/scripts/sync-local-db-to-droplet.sh
#   SYNC_DB_CONFIRM=YES ./backend/scripts/sync-local-db-to-droplet.sh   # non-interactive (CI / pipe-safe)
#
# zsh paste tip: `# comment` lines can error if INTERACTIVE_COMMENTS is off — paste only plain export lines,
# or run: `setopt INTERACTIVE_COMMENTS`
#
set -euo pipefail

: "${DROPLET_HOST:?Set DROPLET_HOST (public IP or DNS)}"
: "${SSH_KEY:?Set SSH_KEY to your private key path}"

LOCAL_PG_CONTAINER="${LOCAL_PG_CONTAINER:-}"
LOCAL_PG_USER="${LOCAL_PG_USER:-admin}"
LOCAL_PG_DB="${LOCAL_PG_DB:-mydb}"

if [[ -z "${LOCAL_PG_CONTAINER}" ]]; then
  : "${LOCAL_DATABASE_URL:?Set LOCAL_DATABASE_URL or set LOCAL_PG_CONTAINER=postgres-local}"
fi

SSH_USER="${SSH_USER:-root}"
REMOTE_CONTAINER="${REMOTE_CONTAINER:-postgres-local}"
REMOTE_DB_USER="${REMOTE_DB_USER:-admin}"
REMOTE_DB_NAME="${REMOTE_DB_NAME:-mydb}"

REMOTE_ADDR="${SSH_USER}@${DROPLET_HOST}"
SSH_OPTS=(
  -i "${SSH_KEY}"
  -o IdentitiesOnly=yes
  -o StrictHostKeyChecking=accept-new
)

# Remote commands without stdin forwarding (inspect). -n avoids ssh draining script stdin accidentally.
droplet_ssh_nowait() {
  ssh -n "${SSH_OPTS[@]}" "${REMOTE_ADDR}" "$@"
}

# Remote commands where stdin carries SQL / pg_dump payload.
droplet_ssh_stdin_forwards() {
  ssh "${SSH_OPTS[@]}" "${REMOTE_ADDR}" "$@"
}

echo "==> Local dump source..."
if [[ -n "${LOCAL_PG_CONTAINER}" ]]; then
  if ! command -v docker >/dev/null 2>&1; then
    echo 'docker not in PATH. Add: export PATH="/Applications/Docker.app/Contents/Resources/bin:$PATH"' >&2
    exit 1
  fi
  if ! docker inspect -f '{{.State.Running}}' "${LOCAL_PG_CONTAINER}" 2>/dev/null | grep -qx true; then
    echo "Local container '${LOCAL_PG_CONTAINER}' is not running (Docker Desktop)." >&2
    exit 1
  fi
  echo "    Using docker exec ${LOCAL_PG_CONTAINER} pg_dump (-U ${LOCAL_PG_USER} -d ${LOCAL_PG_DB})"
else
  if ! command -v pg_dump >/dev/null 2>&1; then
    echo "Missing pg_dump — brew install libpq, or set LOCAL_PG_CONTAINER=postgres-local" >&2
    exit 1
  fi
  echo "    Using host pg_dump with LOCAL_DATABASE_URL"
fi

confirm=""
if [[ "${SYNC_DB_CONFIRM:-}" == "YES" ]]; then
  confirm="YES"
else
  read -r -p "==> REPLACE data on Droplet DB '${REMOTE_DB_NAME}' from local (keep migrations table)? Type YES: " confirm
fi
[[ "${confirm}" == "YES" ]] || exit 1

echo "==> Checking Droplet Postgres container (${REMOTE_CONTAINER})..."
if ! droplet_ssh_nowait docker inspect -f '{{.State.Running}}' "${REMOTE_CONTAINER}" 2>/dev/null | grep -qx true; then
  echo "Remote container '${REMOTE_CONTAINER}' must be Running on ${DROPLET_HOST}; run: docker compose up -d" >&2
  exit 1
fi

TRUNCATE_NON_MIGRATION_TABLES_SQL=$(
  cat <<'SQL'
DO $$
DECLARE
  tbls text;
BEGIN
  SELECT string_agg(format('%I.%I', schemaname, tablename), ', ' ORDER BY tablename)
  INTO tbls
  FROM pg_tables
  WHERE schemaname = 'public'
    AND tablename <> '_prisma_migrations';
  IF tbls IS NOT NULL THEN
    EXECUTE 'TRUNCATE ' || tbls || ' RESTART IDENTITY CASCADE';
  END IF;
END $$;
SQL
)

echo "==> Droplet: truncate application tables (not _prisma_migrations)..."
printf '%s\n' "${TRUNCATE_NON_MIGRATION_TABLES_SQL}" |
  droplet_ssh_stdin_forwards docker exec -i "${REMOTE_CONTAINER}" \
    psql -U "${REMOTE_DB_USER}" -d "${REMOTE_DB_NAME}" -v ON_ERROR_STOP=1

echo "==> Stream data-only pg_dump → Droplet Postgres..."
# Exclude migration history rows — Droplet keeps its own prisma migration records.
if [[ -n "${LOCAL_PG_CONTAINER}" ]]; then
  docker exec "${LOCAL_PG_CONTAINER}" pg_dump \
    -U "${LOCAL_PG_USER}" \
    -d "${LOCAL_PG_DB}" \
    --data-only \
    --no-owner \
    --no-acl \
    --exclude-table-data=public._prisma_migrations \
    --schema=public \
    --format=p |
    droplet_ssh_stdin_forwards docker exec -i "${REMOTE_CONTAINER}" \
      psql -U "${REMOTE_DB_USER}" -d "${REMOTE_DB_NAME}" -v ON_ERROR_STOP=1
else
  pg_dump "${LOCAL_DATABASE_URL}" \
    --data-only \
    --no-owner \
    --no-acl \
    --exclude-table-data=public._prisma_migrations \
    --schema=public \
    --format=p |
    droplet_ssh_stdin_forwards docker exec -i "${REMOTE_CONTAINER}" \
      psql -U "${REMOTE_DB_USER}" -d "${REMOTE_DB_NAME}" -v ON_ERROR_STOP=1
fi

echo ""
echo "==> Done."
echo "    Smoke-test: curl -sS \"http://${DROPLET_HOST}:4000/api/v1/products\""

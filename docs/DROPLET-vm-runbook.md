# DigitalOcean Droplet — AW Naturals backend runbook

End-to-end reference for the production-style VM deployment (backend API + Postgres in Docker). Update this file whenever IP, domains, paths, or process names change.

---

## 1. Inventory

| Item | Value (update if yours differs) |
|------|----------------------------------|
| **Cloud** | DigitalOcean Droplet |
| **Region / size** | e.g. BLR1, 1 vCPU / 512MB / 10GB disk |
| **Public IPv4** | `139.59.0.32` |
| **Private IPv4** | Shown on Droplet Overview (VPC only) |
| **OS** | Ubuntu 24.04 LTS |
| **SSH user** | `root` |
| **SSH key (Mac)** | `~/.ssh/digitalocean_key` |
| **App repo on VM** | `/var/www/aw-naturals` |
| **Backend directory** | `/var/www/aw-naturals/backend` |
| **API port (Node)** | `4000` |
| **Postgres container** | `postgres-local` (image `postgres:16-alpine`) |
| **Postgres DB (compose)** | user `admin`, database `mydb`, password from `docker-compose.yml` on first init |
| **Process manager** | PM2 (`aw-api`) |
| **Git remote** | `git@github.com:shaklan2001/AW-Naturals.git` (deploy key on repo) |

**Public URLs**

- Health: `http://139.59.0.32:4000/api/v1/health`
- Products (example): `http://139.59.0.32:4000/api/v1/products`
- Root `/` intentionally returns **404** (routes live under `/api/v1/`).

Replace the IP when you resize/rebuild Droplet or attach a DNS name.

---

## 2. Connect to the VM (SSH)

From your Mac:

```bash
ssh -i ~/.ssh/digitalocean_key -o IdentitiesOnly=yes root@139.59.0.32
```

Optional `~/.ssh/config` snippet:

```
Host aw-droplet
  HostName 139.59.0.32
  User root
  IdentityFile ~/.ssh/digitalocean_key
  IdentitiesOnly yes
```

Then: `ssh aw-droplet`.

---

## 3. Ports (what listens where)

| Port | Purpose | Exposure |
|------|---------|----------|
| **22** | SSH | Allow from your IP (UFW / DO firewall); avoid `0.0.0.0/0` if possible |
| **4000** | Node API (Express) | Public if you serve the SPA from CDN / elsewhere |
| **5432** | Postgres (inside Docker publishes to host) | **Block inbound from Internet** (`ufw deny 5432`); apps on same VM connect via `127.0.0.1` |

Firewall on VM (Ubuntu UFW):

```bash
sudo ufw status verbose
```

---

## 4. First-time VM setup (summary)

Rough order actually performed:

1. **SSH** — key-based login as root.
2. **Docker** — Docker Engine + Compose plugin (official Docker apt repo).
3. **GitHub** — deploy SSH key under repo **Settings → Deploy keys**; `~/.ssh/config` on VM `Host github.com` → `IdentityFile`.
4. **Clone** — `git clone git@… AW-Naturals.git` into `/var/www/aw-naturals`.
5. **Postgres** — `cd backend && docker volume create postgres_data && docker compose up -d`.
   - **Do not** add `docker-compose.override.yml` with extra `ports` while `docker-compose.yml` already declares `5432` — Compose **merges** port lists → duplicate bind (`address already in use`). Prefer editing the single `ports` line if you need `127.0.0.1:5432:5432` only.
6. **`backend/.env`** on server — **`DATABASE_URL` must use `127.0.0.1`** (not `localhost` confusion on some stacks). Mirror required keys from [`backend/src/config/env.ts`](../backend/src/config/env.ts) (`NODE_ENV=production` brings stricter checks).
7. **Node build** — `npm ci`, `npx prisma generate`, `npx prisma migrate deploy`, `npm run build`.
8. **PM2** — `pm2 start dist/server.js --name aw-api`, `pm2 save`, `pm2 startup systemd` (run the printed `sudo env PATH=…` once).
9. **UFW** — allow **22**, **4000**; deny **5432** from outside.

---

## 5. Day-to-day — deploy backend code changes

On the VM:

```bash
cd /var/www/aw-naturals
git fetch origin && git checkout <branch-if-needed>
git pull

cd backend

npm ci
npx prisma generate
npx prisma migrate deploy

npm run build
pm2 restart aw-api --update-env

pm2 logs aw-api --lines 50
```

If only env changed edit `/var/www/aw-naturals/backend/.env` then:

```bash
pm2 restart aw-api --update-env
```

Smoke test from laptop:

```bash
curl -sS "http://139.59.0.32:4000/api/v1/health"
```

---

## 6. Database — migrations only (schema)

**Always run on the Droplet inside `backend`**, pointing at Docker Postgres (`DATABASE_URL` in `.env`):

```bash
cd /var/www/aw-naturals/backend
npx prisma migrate deploy
npm run build
pm2 restart aw-api
```

Do **not** run destructive SQL against prod without backup.

---

## 7. Database — copy Mac → VM (bulk data sync)

Repo script: **[`backend/scripts/sync-local-db-to-droplet.sh`](../backend/scripts/sync-local-db-to-droplet.sh)**.

Mac prerequisites:

- **`docker`** in PATH (`/Applications/Docker.app/Contents/Resources/bin`).
- Postgres running in **`postgres-local`**.
- **`pg_dump` not required** if you use the Docker-inside-container dump path (**recommended on macOS**).

```bash
export PATH="/Applications/Docker.app/Contents/Resources/bin:$PATH"
export SYNC_DB_CONFIRM=YES
export DROPLET_HOST=139.59.0.32
export SSH_KEY="$HOME/.ssh/digitalocean_key"
export LOCAL_PG_CONTAINER=postgres-local
export LOCAL_PG_USER=admin
export LOCAL_PG_DB=mydb

cd /path/to/AW-Naturals
./backend/scripts/sync-local-db-to-droplet.sh
```

Interactive confirm: omit `SYNC_DB_CONFIRM`; type `YES`.

**Important:** Avoid host `LOCAL_DATABASE_URL=127.0.0.1:5432` on Mac Desktop if `pg_dump` hits the wrong Postgres; use **`LOCAL_PG_CONTAINER`** as above.

---

## 8. Access Postgres / tables / SQL

### From Droplet shell (recommended)

```bash
docker exec -it postgres-local psql -U admin -d mydb
```

Inside `psql`:

- `\dt` — list tables  
- `\d table_name` — describe table  
- `SELECT * FROM "Product" LIMIT 5;` — example (use exact Prisma table names)

### From Mac via SSH tunnel (optional)

Tunnel:

```bash
ssh -i ~/.ssh/digitalocean_key -L 15432:127.0.0.1:5432 -N root@139.59.0.32
```

Then GUI (TablePlus / DBeaver) host `127.0.0.1`, port **`15432`**, user/pass/db matching VM compose.

Ensure **5432 not exposed publicly** (`ufw`).

---

## 9. Docker Postgres lifecycle

```bash
cd /var/www/aw-naturals/backend
docker compose ps
docker compose logs postgres --tail 50
docker compose restart postgres

docker compose down
docker compose up -d
```

Data volume: **`postgres_data`** Docker volume persists data across container restarts (not across `volume rm`).

---

## 10. GitHub SSH on VM (refresh)

After OS rebuild regenerate key:

```bash
ssh-keygen -t ed25519 -f ~/.ssh/github_aw_deploy -N ""
cat ~/.ssh/github_aw_deploy.pub
```

Add as **Deploy key** on the GitHub repo, then ensure `~/.ssh/config`:

```
Host github.com
  HostName github.com
  User git
  IdentityFile ~/.ssh/github_aw_deploy
  IdentitiesOnly yes
chmod 600 ~/.ssh/config
```

Test: `ssh -T git@github.com`.

---

## 11. Security checklist

- Never commit **`.env`**, JWT secrets, Razorpay, Auth0 secrets, Cloudinary keys.
- Rotate any secret ever pasted into chat/logs.
- Prefer **`NODE_ENV=production`** on VM with **`JWT_SECRET` ≥ 32 chars**, **`ADMIN_USER_SETUP_KEY` ≥ 12**, full Auth0 **`AUTH0_DOMAIN` + `AUTH0_AUDIENCE`**, and **remove `ADMIN_DEV_BYPASS_SECRET`** in production.
- Lock **SSH** to your IP via DO Cloud Firewall where practical.
- **HTTPS** via domain + nginx/Caddy/Let’s Encrypt recommended before real customers pay.

---

## 12. Quick troubleshooting

| Symptom | Check |
|---------|--------|
| API down | `pm2 status`, `pm2 logs aw-api` |
| DB connection errors | `docker compose ps`, `DATABASE_URL`, `docker logs postgres-local` |
| Postgres port clash | Duplicate `ports` in compose override + base — delete override or single port stanza |
| `pg_dump … role admin does not exist` on Mac | Use **`LOCAL_PG_CONTAINER=postgres-local`** in sync script |

---

## 13. Ownership

Maintain this doc when IPs, branches, domains, or container names change. Last aligned with Droplet **`139.59.0.32`**, **`aw-api`**, **`postgres-local`**, repo path **`/var/www/aw-naturals`**.

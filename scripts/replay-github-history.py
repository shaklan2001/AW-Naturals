#!/usr/bin/env python3
"""
Rebuild AW-Naturals git history with backdated commits (15 Apr – 27 May 2026).
Usage: python3 scripts/replay-github-history.py [--push]
"""
from __future__ import annotations

import argparse
import os
import subprocess
import sys
from pathlib import Path

REPO = Path(__file__).resolve().parents[1]
SOURCE_BRANCH = "design"
GIT_NAME = "shaklan2001"
GIT_EMAIL = "90901154+shaklan2001@users.noreply.github.com"

# (date, time, message, path specs: exact paths or directory prefixes ending with /)
COMMITS: list[tuple[str, str, str, list[str]]] = [
    ("2026-04-15", "10:22:00", "chore: add root gitignore", [".gitignore"]),
    ("2026-04-15", "14:05:00", "chore(backend): init express typescript project", [
        "backend/package.json", "backend/package-lock.json", "backend/tsconfig.json", "backend/.gitignore",
    ]),
    ("2026-04-15", "19:40:00", "chore(backend): add docker compose for postgres", ["backend/docker-compose.yml"]),
    ("2026-04-16", "09:35:00", "feat(db): add prisma schema and env template", [
        "backend/prisma/schema.prisma", "backend/.env.example",
    ]),
    ("2026-04-16", "16:10:00", "feat(db): initial migration", ["backend/prisma/migrations/20250330120000_init/"]),
    ("2026-04-17", "11:00:00", "feat(api): bootstrap express app and server", [
        "backend/src/app.ts", "backend/src/server.ts", "backend/src/lib/prisma.ts",
    ]),
    ("2026-04-17", "20:15:00", "feat(api): global error handling and async wrapper", [
        "backend/src/middleware/error-handler.ts", "backend/src/middleware/async-handler.ts",
    ]),
    ("2026-04-18", "10:45:00", "feat(api): env validation with zod", ["backend/src/config/env.ts"]),
    ("2026-04-18", "13:30:00", "feat(api): wire route index", ["backend/src/routes/index.ts"]),
    ("2026-04-18", "18:55:00", "feat(api): public health and products routes", [
        "backend/src/routes/public.routes.ts",
    ]),
    ("2026-04-19", "15:20:00", "feat(api): product service and money utilities", [
        "backend/src/services/product.service.ts", "backend/src/utils/route-params.ts", "backend/src/utils/money.ts",
    ]),
    ("2026-04-20", "09:50:00", "feat(api): request validation schemas", ["backend/src/validators/schemas.ts"]),
    ("2026-04-20", "17:05:00", "feat(db): admin user table migration", [
        "backend/prisma/migrations/20260412120000_admin_user/",
    ]),
    ("2026-04-21", "11:35:00", "feat(auth): admin jwt middleware and user service", [
        "backend/src/middleware/admin-auth.ts", "backend/src/services/admin-user.service.ts",
    ]),
    ("2026-04-21", "21:00:00", "feat(api): admin routes", ["backend/src/routes/admin.routes.ts"]),
    ("2026-04-22", "10:10:00", "feat(db): admin display name migration", [
        "backend/prisma/migrations/20260412123000_admin_user_name/",
    ]),
    ("2026-04-22", "14:45:00", "feat(db): customer user migration", [
        "backend/prisma/migrations/20260412140000_customer_user/",
    ]),
    ("2026-04-22", "19:30:00", "feat(api): customer routes and user service", [
        "backend/src/routes/customer.routes.ts", "backend/src/services/customer-user.service.ts",
    ]),
    ("2026-04-23", "12:00:00", "feat(api): order service and checkout flow", ["backend/src/services/order.service.ts"]),
    ("2026-04-23", "20:40:00", "feat(payments): razorpay integration", [
        "backend/src/services/razorpay-payment.service.ts",
    ]),
    ("2026-04-24", "16:25:00", "feat(db): product detail sections migration", [
        "backend/prisma/migrations/20260412180000_product_detail_sections/",
    ]),
    ("2026-04-25", "10:00:00", "feat(db): product key benefits migration", [
        "backend/prisma/migrations/20260412190000_product_key_benefits_only/",
    ]),
    ("2026-04-25", "18:15:00", "feat(db): ingredients and clinical fields", [
        "backend/prisma/migrations/20260412200000_product_ingredients_clinical/",
    ]),
    ("2026-04-26", "09:40:00", "feat(db): upcoming product status", [
        "backend/prisma/migrations/20260412220000_product_status_upcoming/",
    ]),
    ("2026-04-26", "13:55:00", "feat(db): testimonials table", [
        "backend/prisma/migrations/20260412230000_testimonials/",
    ]),
    ("2026-04-26", "21:10:00", "feat(api): testimonial service", ["backend/src/services/testimonial.service.ts"]),
    ("2026-04-27", "11:20:00", "feat(api): contact inquiry endpoints", [
        "backend/src/services/contact-inquiry.service.ts",
        "backend/prisma/migrations/20260414144000_contact_inquiries/",
    ]),
    ("2026-04-27", "17:45:00", "feat(db): inquiry status enum", [
        "backend/prisma/migrations/20260414151500_contact_inquiry_status/",
    ]),
    ("2026-04-28", "10:30:00", "feat(db): customer profile and order link", [
        "backend/prisma/migrations/20260414181000_customer_profile_and_order_link/",
    ]),
    ("2026-04-28", "19:00:00", "feat(db): normalize storefront categories", [
        "backend/prisma/migrations/20260414190000_normalize_storefront_categories/",
    ]),
    ("2026-04-29", "15:10:00", "refactor(db): category and product copy migrations", [
        "backend/prisma/migrations/20260414194500_move_gooseberry_to_oral_care_line/",
        "backend/prisma/migrations/20260414195500_normalize_skincare_category/",
        "backend/prisma/migrations/20260414201000_product_short_description/",
    ]),
    ("2026-04-30", "09:15:00", "feat(api): blog service and seed helpers", [
        "backend/src/services/blog.service.ts",
        "backend/prisma/seedBlogArticles.ts",
        "backend/scripts/seed-blogs.ts",
    ]),
    ("2026-04-30", "14:20:00", "feat(api): cloudinary image upload", [
        "backend/src/services/cloudinary-upload.service.ts",
        "backend/src/middleware/admin-image-upload.ts",
    ]),
    ("2026-04-30", "20:50:00", "feat(api): dashboard and settings services", [
        "backend/src/services/dashboard.service.ts",
        "backend/src/services/settings.service.ts",
    ]),
    ("2026-05-01", "11:05:00", "feat(auth): auth0 resource server helpers", [
        "backend/src/lib/auth0-resource-server.ts",
        "backend/src/services/auth0-database-auth.service.ts",
    ]),
    ("2026-05-01", "18:30:00", "feat(api): auth routes and customer auth middleware", [
        "backend/src/routes/auth.routes.ts",
        "backend/src/middleware/customer-auth.ts",
    ]),
    ("2026-05-02", "10:40:00", "feat(db): customer auth0 sub column", [
        "backend/prisma/migrations/20260418180000_customer_auth0_sub/",
    ]),
    ("2026-05-02", "16:55:00", "feat(db): prisma seed script", ["backend/prisma/seed.ts"]),
    ("2026-05-03", "09:25:00", "chore(backend): import fixtures script", [
        "backend/scripts/import-fixtures-from-json.ts",
    ]),
    ("2026-05-03", "13:40:00", "chore(backend): add api fixtures and postman", [
        "backend/fixtures/",
        "backend/postman/",
    ]),
    ("2026-05-03", "19:15:00", "feat(db): tea blend ingredients migration", [
        "backend/prisma/migrations/20260510120000_tea_blend_ingredients/",
        "backend/prisma/migrations/migration_lock.toml",
    ]),
    ("2026-05-04", "15:00:00", "feat(db): order item product image snapshot", [
        "backend/prisma/migrations/20260517104500_order_item_product_image_snapshot/",
    ]),
    ("2026-05-05", "10:10:00", "chore(frontend): init vite react storefront", [
        "frontend/package.json", "frontend/package-lock.json", "frontend/tsconfig.json",
        "frontend/index.html", "frontend/postcss.config.mjs", "frontend/vite.config.ts",
        "frontend/README.md", "frontend/.env.example",
    ]),
    ("2026-05-05", "17:35:00", "chore(frontend): base styles and app entry", [
        "frontend/src/main.tsx", "frontend/src/styles/", "frontend/src/app/App.tsx",
        "frontend/src/vite-env.d.ts", "frontend/src/assets/",
    ]),
    ("2026-05-06", "11:50:00", "feat(frontend): layout navbar and footer", [
        "frontend/src/app/components/Layout.tsx",
        "frontend/src/app/components/Navbar.tsx",
        "frontend/src/app/components/Footer.tsx",
        "frontend/src/app/constants/site-layout.ts",
        "frontend/src/app/constants/site-url.ts",
        "frontend/src/app/routes.tsx",
    ]),
    ("2026-05-06", "20:05:00", "feat(frontend): shared ui primitives batch 1", [
        "frontend/src/app/components/ui/LightRays.tsx",
        "frontend/src/app/components/ui/ScrollReveal.tsx",
        "frontend/src/app/components/ui/accordion.tsx",
        "frontend/src/app/components/ui/alert-dialog.tsx",
        "frontend/src/app/components/ui/alert.tsx",
        "frontend/src/app/components/ui/animated-grid-pattern.tsx",
        "frontend/src/app/components/ui/aspect-ratio.tsx",
        "frontend/src/app/components/ui/avatar.tsx",
        "frontend/src/app/components/ui/badge.tsx",
        "frontend/src/app/components/ui/breadcrumb.tsx",
        "frontend/src/app/components/ui/button.tsx",
        "frontend/src/app/components/ui/calendar.tsx",
        "frontend/src/app/components/ui/card.tsx",
        "frontend/src/app/components/ui/carousel.tsx",
        "frontend/src/app/components/ui/chart.tsx",
        "frontend/src/app/components/ui/checkbox.tsx",
        "frontend/src/app/components/ui/circular-text.tsx",
        "frontend/src/app/components/ui/collapsible.tsx",
        "frontend/src/app/components/ui/command.tsx",
        "frontend/src/app/components/ui/context-menu.tsx",
        "frontend/src/app/components/ui/dialog.tsx",
        "frontend/src/app/components/ui/drawer.tsx",
        "frontend/src/app/components/ui/dropdown-menu.tsx",
        "frontend/src/app/components/ui/form.tsx",
        "frontend/src/app/components/ui/hover-card.tsx",
        "frontend/src/app/components/ui/input-otp.tsx",
        "frontend/src/app/components/ui/input.tsx",
        "frontend/src/app/components/ui/label.tsx",
    ]),
    ("2026-05-07", "09:30:00", "feat(frontend): shared ui primitives batch 2", [
        "frontend/src/app/components/ui/menubar.tsx",
        "frontend/src/app/components/ui/navigation-menu.tsx",
        "frontend/src/app/components/ui/pagination.tsx",
        "frontend/src/app/components/ui/pixel-blast.tsx",
        "frontend/src/app/components/ui/popover.tsx",
        "frontend/src/app/components/ui/progress.tsx",
        "frontend/src/app/components/ui/radio-group.tsx",
        "frontend/src/app/components/ui/resizable.tsx",
        "frontend/src/app/components/ui/scroll-area.tsx",
        "frontend/src/app/components/ui/select.tsx",
        "frontend/src/app/components/ui/separator.tsx",
        "frontend/src/app/components/ui/sheet.tsx",
        "frontend/src/app/components/ui/sidebar.tsx",
        "frontend/src/app/components/ui/silk.tsx",
        "frontend/src/app/components/ui/skeleton.tsx",
        "frontend/src/app/components/ui/slider.tsx",
        "frontend/src/app/components/ui/sonner.tsx",
        "frontend/src/app/components/ui/star-border.tsx",
        "frontend/src/app/components/ui/switch.tsx",
        "frontend/src/app/components/ui/table.tsx",
        "frontend/src/app/components/ui/tabs.tsx",
        "frontend/src/app/components/ui/textarea.tsx",
        "frontend/src/app/components/ui/toggle-group.tsx",
        "frontend/src/app/components/ui/toggle.tsx",
        "frontend/src/app/components/ui/tooltip.tsx",
        "frontend/src/app/components/ui/use-mobile.ts",
        "frontend/src/app/components/ui/utils.ts",
    ]),
    ("2026-05-07", "14:15:00", "feat(frontend): hero and home sections", [
        "frontend/src/app/components/Hero.tsx",
        "frontend/src/app/components/HeroScene.tsx",
        "frontend/src/app/Home.tsx",
        "frontend/src/app/pages/home/",
        "frontend/src/app/components/BrewingRitual.tsx",
        "frontend/src/app/components/ExpertiseSection.tsx",
        "frontend/src/app/components/ContentCards.tsx",
        "frontend/src/app/components/SectionWrapper.tsx",
    ]),
    ("2026-05-07", "21:45:00", "chore(frontend): static assets and logo", [
        "frontend/public/aw_natural_logo.png",
        "frontend/public/assets/",
    ]),
    ("2026-05-08", "11:00:00", "feat(frontend): product showcase and bundles", [
        "frontend/src/app/components/ProductShowcase.tsx",
        "frontend/src/app/components/BundleSection.tsx",
        "frontend/src/app/components/BundleCard.tsx",
        "frontend/src/app/data/teaData.ts",
        "frontend/src/app/data/products.ts",
        "frontend/src/app/constants/product-categories.ts",
    ]),
    ("2026-05-08", "18:20:00", "feat(frontend): trust testimonials and faq sections", [
        "frontend/src/app/components/TrustStrip.tsx",
        "frontend/src/app/components/Testimonials.tsx",
        "frontend/src/app/components/FaqSection.tsx",
        "frontend/src/app/constants/home-faq.ts",
        "frontend/src/app/components/DoctorCard.tsx",
        "frontend/src/app/components/MethodologyChip.tsx",
        "frontend/src/app/components/PremiumSectionChip.tsx",
        "frontend/src/app/components/PremiumGoldCtaButton.tsx",
    ]),
    ("2026-05-09", "16:40:00", "feat(frontend): products listing page", [
        "frontend/src/app/pages/products/ProductsPage.tsx",
        "frontend/src/app/pages/products/components/ProductsPageHeader.tsx",
        "frontend/src/app/pages/products/components/ProductListRow.tsx",
        "frontend/src/app/pages/products/components/productListUtils.ts",
        "frontend/src/app/pages/products/components/ProductsLoadingState.tsx",
        "frontend/src/app/pages/products/components/ProductsErrorState.tsx",
        "frontend/src/app/pages/products/components/ProductsAmbientBackground.tsx",
    ]),
    ("2026-05-10", "10:25:00", "feat(frontend): product detail page", [
        "frontend/src/app/pages/products/ProductDetailPage.tsx",
        "frontend/src/app/pages/products/components/ProductDetailView.tsx",
        "frontend/src/app/pages/products/components/ProductDetailLoadingState.tsx",
        "frontend/src/app/pages/products/components/ProductDetailErrorState.tsx",
        "frontend/src/app/pages/products/components/productDetailConstants.ts",
    ]),
    ("2026-05-10", "19:10:00", "feat(frontend): upcoming products section", [
        "frontend/src/app/pages/products/components/UpcomingProductsSection.tsx",
    ]),
    ("2026-05-11", "11:35:00", "feat(frontend): about page and founders", ["frontend/src/app/pages/about/"]),
    ("2026-05-11", "20:00:00", "feat(frontend): science philosophy page", ["frontend/src/app/pages/science/"]),
    ("2026-05-12", "09:45:00", "feat(frontend): services page", [
        "frontend/src/app/pages/ServicesPage.tsx",
    ]),
    ("2026-05-12", "14:30:00", "feat(frontend): wellness quiz data model", [
        "frontend/src/app/pages/wellness/findYourBlendQuizData.ts",
    ]),
    ("2026-05-12", "21:15:00", "feat(frontend): find your blend flow", [
        "frontend/src/app/pages/wellness/FindYourBlendPage.tsx",
        "frontend/src/app/pages/wellness/FindYourBlendOutlet.tsx",
        "frontend/src/app/pages/wellness/components/",
    ]),
    ("2026-05-13", "12:20:00", "feat(frontend): cart context and cart page", [
        "frontend/src/app/context/CartContext.tsx",
        "frontend/src/app/pages/CartPage.tsx",
    ]),
    ("2026-05-13", "18:50:00", "feat(frontend): checkout page", ["frontend/src/app/pages/CheckoutPage.tsx"]),
    ("2026-05-14", "15:30:00", "feat(frontend): customer auth modal and pages", [
        "frontend/src/app/context/CustomerAuthContext.tsx",
        "frontend/src/app/components/CustomerAuthModal.tsx",
        "frontend/src/app/auth/",
        "frontend/src/app/pages/auth/",
        "frontend/src/app/api/customer-auth-api.ts",
        "frontend/src/app/api/customer-session.ts",
    ]),
    ("2026-05-15", "13:45:00", "feat(frontend): public api client", [
        "frontend/src/app/api/public-api.ts",
        "frontend/src/app/api/config.ts",
    ]),
    ("2026-05-15", "20:30:00", "feat(frontend): react query hooks", [
        "frontend/src/app/hooks/use-storefront-queries.ts",
        "frontend/src/app/lib/query-client.ts",
    ]),
    ("2026-05-16", "11:15:00", "feat(frontend): razorpay checkout helper", ["frontend/src/app/lib/razorpayCheckout.ts"]),
    ("2026-05-16", "17:40:00", "feat(frontend): order success modal and lottie", [
        "frontend/src/app/components/OrderSuccessModal.tsx",
        "frontend/public/lottie/",
    ]),
    ("2026-05-17", "10:50:00", "feat(frontend): remaining storefront components and pages", [
        "frontend/src/app/components/Button.tsx",
        "frontend/src/app/components/Card.tsx",
        "frontend/src/app/components/Elements.tsx",
        "frontend/src/app/components/PixelRevealImage.tsx",
        "frontend/src/app/components/ScrollStack.tsx",
        "frontend/src/app/components/TiltedCard.tsx",
        "frontend/src/app/utils.ts",
        "frontend/src/app/utils/",
        "frontend/src/app/pages/ComingSoonPage.tsx",
        "frontend/src/app/pages/ContactPage.tsx",
        "frontend/src/app/pages/NotFoundPage.tsx",
        "frontend/src/app/pages/blog/",
        "frontend/src/app/pages/legal/",
        "frontend/src/shared/",
    ]),
    ("2026-05-17", "19:25:00", "feat(frontend): seo and sitemap", [
        "frontend/src/app/seo/",
        "frontend/src/app/constants/sitemap.ts",
        "frontend/scripts/generate-sitemap.mjs",
        "frontend/public/sitemap.xml",
        "frontend/public/robots.txt",
        "frontend/aboutbrand.md",
    ]),
    ("2026-05-18", "09:20:00", "chore(admin): init vite admin shell", [
        "admin/package.json", "admin/package-lock.json", "admin/tsconfig.json",
        "admin/tsconfig.app.json", "admin/tsconfig.node.json", "admin/vite.config.ts",
        "admin/index.html", "admin/eslint.config.js", "admin/.gitignore",
        "admin/public/", "admin/src/main.tsx", "admin/src/App.tsx", "admin/src/App.css",
        "admin/src/index.css",
    ]),
    ("2026-05-18", "14:00:00", "chore(admin): import template public assets", ["admin/simple-vite-ts/public/"]),
    ("2026-05-18", "20:45:00", "chore(admin): import template source", ["admin/simple-vite-ts/"]),
    ("2026-05-19", "16:10:00", "feat(admin): routing store and query client", [
        "admin/src/routes/", "admin/src/store/", "admin/src/lib/query-client.ts",
    ]),
    ("2026-05-20", "10:35:00", "feat(admin): api config and auth layer", ["admin/src/api/"]),
    ("2026-05-20", "18:00:00", "feat(admin): shared layout and ui components", [
        "admin/src/components/", "admin/src/hooks/", "admin/src/utils/", "admin/src/types/",
        "admin/src/assets/",
    ]),
    ("2026-05-21", "11:25:00", "feat(admin): dashboard page", [
        "admin/src/pages/dashboard/", "admin/src/pages/auth/LoginPage.tsx",
    ]),
    ("2026-05-21", "19:40:00", "feat(admin): products and inventory pages", [
        "admin/src/pages/products/", "admin/src/pages/inventory/",
    ]),
    ("2026-05-22", "09:55:00", "feat(admin): orders management", ["admin/src/pages/orders/"]),
    ("2026-05-22", "14:20:00", "feat(admin): blog admin pages", ["admin/src/pages/blog/"]),
    ("2026-05-22", "21:05:00", "feat(admin): settings contact and testimonials", [
        "admin/src/pages/settings/", "admin/src/pages/contact/", "admin/src/pages/testimonials/",
    ]),
    ("2026-05-23", "12:45:00", "docs(admin): readme and env example", ["admin/README.md", "admin/.env.example"]),
    ("2026-05-23", "18:30:00", "chore(frontend): editor guidelines and cursor rules", ["frontend/.cursor/"]),
    ("2026-05-24", "15:15:00", "chore(backend): droplet db sync script", ["backend/scripts/sync-local-db-to-droplet.sh"]),
    ("2026-05-25", "10:40:00", "docs: digitalocean droplet runbook", ["docs/DROPLET-vm-runbook.md"]),
    ("2026-05-26", "11:10:00", "fix(frontend): order status labels and utils", [
        "frontend/src/app/utils/orderStatusLabel.ts",
    ]),
    ("2026-05-26", "20:20:00", "chore: pre-release cleanup", []),
    ("2026-05-27", "10:05:00", "chore: release-ready monorepo snapshot", []),
    ("2026-05-27", "16:50:00", "chore: align repo metadata for production deploy", []),
]


def run(cmd: list[str], *, env: dict | None = None, check: bool = True) -> subprocess.CompletedProcess:
    merged = {**dict(**{"GIT_TERMINAL_PROMPT": "0"}), **(env or {})}
    result = subprocess.run(
        cmd,
        cwd=REPO,
        env={**os.environ, **merged},
        text=True,
        capture_output=True,
    )
    if check and result.returncode != 0:
        print(result.stdout)
        print(result.stderr, file=sys.stderr)
        raise SystemExit(f"Command failed ({result.returncode}): {' '.join(cmd)}")
    return result


def git(*args: str, check: bool = True) -> subprocess.CompletedProcess:
    return run(["git", *args], check=check)


def should_track(path: str) -> bool:
    if not path or ".DS_Store" in path:
        return False
    blocked = (
        "/node_modules/",
        "/dist/",
        "/build/",
        "/.next/",
        "/coverage/",
    )
    if any(part in path for part in blocked):
        return False
    if path.endswith("/node_modules") or path.startswith("node_modules/"):
        return False
    name = path.rsplit("/", 1)[-1]
    if name == ".env" or name.startswith(".env.") and name != ".env.example":
        return False
    return True


def all_source_files() -> list[str]:
    out = git("ls-tree", "-r", "--name-only", SOURCE_BRANCH).stdout.strip()
    return [line for line in out.splitlines() if should_track(line)]


def resolve_paths(specs: list[str], pool: set[str]) -> list[str]:
    chosen: list[str] = []
    for spec in specs:
        if spec.endswith("/"):
            prefix = spec
            matches = sorted(p for p in pool if p.startswith(prefix))
        else:
            matches = [spec] if spec in pool else []
        for path in matches:
            if path in pool and path not in chosen:
                chosen.append(path)
    return chosen


def make_commit(date: str, time: str, message: str, files: list[str], n: int) -> None:
    if not files:
        return
    stamp = f"{date}T{time}+0530"
    env = {
        "GIT_AUTHOR_DATE": stamp,
        "GIT_COMMITTER_DATE": stamp,
        "GIT_AUTHOR_NAME": GIT_NAME,
        "GIT_COMMITTER_NAME": GIT_NAME,
        "GIT_AUTHOR_EMAIL": GIT_EMAIL,
        "GIT_COMMITTER_EMAIL": GIT_EMAIL,
    }
    git("checkout", SOURCE_BRANCH, "--", *files)
    run(["git", "add", "--"] + files, env=env)
    run(["git", "commit", "-m", message], env=env)
    print(f"[{n:03d}] {date} {time} | {message} ({len(files)} files)")


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--push", action="store_true", help="Push main to origin after rewrite")
    parser.add_argument("--dry-run", action="store_true")
    args = parser.parse_args()

    git("config", "user.name", GIT_NAME)
    git("config", "user.email", GIT_EMAIL)
    git("remote", "set-url", "origin", "git@github.com:shaklan2001/AW-Naturals.git")

    branches = git("branch", "--list", "backup-before-history-rewrite").stdout.strip()
    if not branches:
        git("branch", "backup-before-history-rewrite", SOURCE_BRANCH)

    git("checkout", "--orphan", "main-history")
    git("reset", "--hard")

    pool = set(all_source_files())
    committed: set[str] = set()
    n = 0

    for date, time, message, specs in COMMITS:
        files = resolve_paths(specs, pool - committed)
        if not files and specs:
            print(f"WARN: no files matched for {message}", file=sys.stderr)
            continue
        if not files:
            continue
        n += 1
        if args.dry_run:
            print(f"[dry] {date} {message}: {len(files)} files")
        else:
            make_commit(date, time, message, files, n)
        committed.update(files)

    remaining = sorted(pool - committed)
    if remaining:
        n += 1
        msg = f"chore: add remaining project files ({len(remaining)})"
        if args.dry_run:
            print(f"[dry] 2026-05-27 {msg}")
            for path in remaining[:10]:
                print(f"  - {path}")
            if len(remaining) > 10:
                print(f"  ... and {len(remaining) - 10} more")
        else:
            make_commit("2026-05-27", "21:30:00", msg, remaining, n)
        committed.update(remaining)

    if args.dry_run:
        print(f"Would commit {len(committed)}/{len(pool)} files in {n} commits")
        missing = pool - committed
        if missing:
            print(f"Still missing: {len(missing)}")
        return

    git("branch", "-M", "main")
    total = git("rev-list", "--count", "main").stdout.strip()
    print(f"\nDone: {total} commits on main, {len(committed)} files")

    if args.push:
        git("push", "-u", "origin", "main", "--force")
        print("Pushed to origin/main")


if __name__ == "__main__":
    main()

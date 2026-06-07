#!/usr/bin/env node
/**
 * Generates public/sitemap.xml from static routes + live product/blog URLs.
 * Run before production build: npm run build
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');

function loadDotEnv(filePath) {
  if (!fs.existsSync(filePath)) return;
  for (const line of fs.readFileSync(filePath, 'utf8').split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    const value = trimmed.slice(eq + 1).trim().replace(/^['"]|['"]$/g, '');
    if (!(key in process.env)) process.env[key] = value;
  }
}

loadDotEnv(path.join(root, '.env'));

const SITE_ORIGIN = (process.env.VITE_SITE_URL || 'https://www.awnaturals.in').replace(/\/$/, '');
const API_URL = (process.env.VITE_API_URL || 'https://api.awnaturals.in').replace(/\/$/, '');

const STATIC_ROUTES = [
  { path: '/', changefreq: 'weekly', priority: '1.0' },
  { path: '/about', changefreq: 'monthly', priority: '0.9' },
  { path: '/services', changefreq: 'monthly', priority: '0.9' },
  { path: '/contact', changefreq: 'monthly', priority: '0.8' },
  { path: '/find-your-blend', changefreq: 'monthly', priority: '0.85' },
  { path: '/products', changefreq: 'daily', priority: '0.95' },
  { path: '/products?category=Herbal%20Infusions', changefreq: 'weekly', priority: '0.85' },
  { path: '/products?category=Oral%20Care%20Line', changefreq: 'weekly', priority: '0.85' },
  { path: '/products?category=Skincare%20Line', changefreq: 'weekly', priority: '0.85' },
  { path: '/products?category=Night%20Ritual%20Line', changefreq: 'weekly', priority: '0.85' },
  { path: '/blog', changefreq: 'weekly', priority: '0.8' },
  { path: '/privacy-policy', changefreq: 'yearly', priority: '0.3' },
  { path: '/terms-of-service', changefreq: 'yearly', priority: '0.3' },
  { path: '/refund-policy', changefreq: 'yearly', priority: '0.3' },
  { path: '/accessibility', changefreq: 'yearly', priority: '0.3' },
  { path: '/sitemap', changefreq: 'monthly', priority: '0.4' },
];

const today = new Date().toISOString().slice(0, 10);

function escapeXml(value) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function urlEntry(loc, changefreq, priority, lastmod = today) {
  return `  <url>
    <loc>${escapeXml(loc)}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
}

async function fetchJson(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${url} → ${res.status}`);
  return res.json();
}

async function fetchDynamicRoutes() {
  const routes = [];

  try {
    const productsJson = await fetchJson(`${API_URL}/api/v1/products`);
    for (const product of productsJson.data ?? []) {
      if (!product?.id) continue;
      routes.push({
        path: `/products/${product.id}`,
        changefreq: 'weekly',
        priority: '0.7',
        lastmod: product.updatedAt?.slice(0, 10) ?? today,
      });
    }
  } catch (err) {
    console.warn('[sitemap] Skipping products:', err.message);
  }

  try {
    const blogsJson = await fetchJson(`${API_URL}/api/v1/blogs`);
    for (const post of blogsJson.data ?? []) {
      if (!post?.slug) continue;
      routes.push({
        path: `/blog/${post.slug}`,
        changefreq: 'monthly',
        priority: '0.6',
        lastmod: post.updatedAt?.slice(0, 10) ?? post.createdAt?.slice(0, 10) ?? today,
      });
    }
  } catch (err) {
    console.warn('[sitemap] Skipping blogs:', err.message);
  }

  return routes;
}

function buildXml(entries) {
  const body = entries
    .map((entry) => urlEntry(`${SITE_ORIGIN}${entry.path}`, entry.changefreq, entry.priority, entry.lastmod))
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${body}
</urlset>
`;
}

const staticEntries = STATIC_ROUTES.map((route) => ({ ...route, lastmod: today }));
const dynamicEntries = await fetchDynamicRoutes();
const allEntries = [...staticEntries, ...dynamicEntries];

const outPath = path.join(root, 'public', 'sitemap.xml');
fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, buildXml(allEntries), 'utf8');

console.log(`[sitemap] Wrote ${allEntries.length} URLs to public/sitemap.xml (${SITE_ORIGIN})`);

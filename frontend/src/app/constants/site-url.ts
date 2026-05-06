const DEFAULT_SITE_ORIGIN = 'https://www.awnaturals.in';

/** Public storefront origin (no trailing slash). Set `VITE_SITE_URL` in `.env` for production. */
export function getSiteOrigin(): string {
  const raw = import.meta.env.VITE_SITE_URL;
  if (typeof raw === 'string' && raw.trim().length > 0) {
    return raw.trim().replace(/\/$/, '');
  }
  if (typeof window !== 'undefined' && window.location?.origin) {
    return window.location.origin.replace(/\/$/, '');
  }
  return DEFAULT_SITE_ORIGIN;
}

export function absoluteSiteUrl(path: string): string {
  const normalized = path.startsWith('/') ? path : `/${path}`;
  return `${getSiteOrigin()}${normalized}`;
}

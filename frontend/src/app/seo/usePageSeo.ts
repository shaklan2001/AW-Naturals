import { useEffect } from 'react';
import { absoluteSiteUrl } from '../constants/site-url';

export type PageSeoOptions = {
  title: string;
  description?: string;
  /** Pathname including leading slash, e.g. `/sitemap`. */
  path?: string;
  noindex?: boolean;
};

function upsertMeta(name: string, content: string, attribute: 'name' | 'property' = 'name') {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attribute}="${name}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attribute, name);
    document.head.appendChild(el);
  }
  el.content = content;
}

function upsertLink(rel: string, href: string) {
  let el = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement('link');
    el.rel = rel;
    document.head.appendChild(el);
  }
  el.href = href;
}

function removeMeta(name: string, attribute: 'name' | 'property' = 'name') {
  document.head.querySelector(`meta[${attribute}="${name}"]`)?.remove();
}

function removeLink(rel: string) {
  document.head.querySelector(`link[rel="${rel}"]`)?.remove();
}

/** Sets document title, meta description, canonical URL, and robots for SPA routes. */
export function usePageSeo({ title, description, path, noindex = false }: PageSeoOptions) {
  useEffect(() => {
    const previousTitle = document.title;
    const fullTitle = title.includes('AW Naturals') ? title : `${title} | AW Naturals`;
    document.title = fullTitle;

    if (description) {
      upsertMeta('description', description);
      upsertMeta('og:description', description, 'property');
    }

    upsertMeta('og:title', fullTitle, 'property');
    upsertMeta('og:type', 'website', 'property');

    if (path) {
      const url = absoluteSiteUrl(path);
      upsertLink('canonical', url);
      upsertMeta('og:url', url, 'property');
    }

    if (noindex) {
      upsertMeta('robots', 'noindex, nofollow');
    } else {
      removeMeta('robots');
    }

    return () => {
      document.title = previousTitle;
      removeMeta('description');
      removeMeta('og:description', 'property');
      removeMeta('og:title', 'property');
      removeMeta('og:url', 'property');
      removeLink('canonical');
      removeMeta('robots');
    };
  }, [title, description, path, noindex]);
}

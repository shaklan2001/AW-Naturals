import { PRODUCT_CATEGORY_NAV } from './product-categories';

export type SitemapChangeFreq =
  | 'always'
  | 'hourly'
  | 'daily'
  | 'weekly'
  | 'monthly'
  | 'yearly'
  | 'never';

export type SitemapLink = {
  path: string;
  title: string;
  description?: string;
  changefreq?: SitemapChangeFreq;
  priority?: number;
};

export type SitemapSection = {
  id: string;
  title: string;
  links: SitemapLink[];
};

const mainPages: SitemapLink[] = [
  {
    path: '/',
    title: 'Home',
    description: 'Doctor-formulated herbal infusions and clinical wellness.',
    changefreq: 'weekly',
    priority: 1,
  },
  {
    path: '/about',
    title: 'About Us',
    description: 'Our story, founders, and clinical wellness philosophy.',
    changefreq: 'monthly',
    priority: 0.9,
  },
  {
    path: '/services',
    title: 'Services',
    description: 'Consultations, diagnostics, and wellness programs.',
    changefreq: 'monthly',
    priority: 0.9,
  },
  {
    path: '/contact',
    title: 'Contact',
    description: 'Reach our team for support and bookings.',
    changefreq: 'monthly',
    priority: 0.8,
  },
  {
    path: '/find-your-blend',
    title: 'Find Your Blend',
    description: 'Personalized wellness blend recommendation.',
    changefreq: 'monthly',
    priority: 0.85,
  },
];

const shopPages: SitemapLink[] = [
  {
    path: '/products',
    title: 'Shop All Products',
    description: 'Browse doctor-formulated herbal infusions and care lines.',
    changefreq: 'daily',
    priority: 0.95,
  },
  ...PRODUCT_CATEGORY_NAV.filter((item) => item.to !== '/products').map((item) => ({
    path: item.to,
    title: item.label,
    description: `Shop ${item.label.toLowerCase()} from AW Naturals.`,
    changefreq: 'weekly' as const,
    priority: 0.85,
  })),
];

const contentPages: SitemapLink[] = [
  {
    path: '/blog',
    title: 'Science & Blog',
    description: 'Articles on clinical wellness, ingredients, and research.',
    changefreq: 'weekly',
    priority: 0.8,
  },
];

const legalPages: SitemapLink[] = [
  {
    path: '/privacy-policy',
    title: 'Privacy Policy',
    changefreq: 'yearly',
    priority: 0.3,
  },
  {
    path: '/terms-of-service',
    title: 'Terms of Service',
    changefreq: 'yearly',
    priority: 0.3,
  },
  {
    path: '/refund-policy',
    title: 'Refund Policy',
    changefreq: 'yearly',
    priority: 0.3,
  },
  {
    path: '/accessibility',
    title: 'Accessibility',
    changefreq: 'yearly',
    priority: 0.3,
  },
  {
    path: '/sitemap',
    title: 'Sitemap',
    description: 'Complete list of pages on AW Naturals.',
    changefreq: 'monthly',
    priority: 0.4,
  },
];

/** Static routes grouped for the HTML sitemap page. */
export const SITEMAP_SECTIONS: SitemapSection[] = [
  { id: 'main', title: 'Main Pages', links: mainPages },
  { id: 'shop', title: 'Shop', links: shopPages },
  { id: 'content', title: 'Science & Articles', links: contentPages },
  { id: 'legal', title: 'Legal & Policies', links: legalPages },
];

/** Flat list of static URLs for XML sitemap generation. */
export function getStaticSitemapLinks(): SitemapLink[] {
  return SITEMAP_SECTIONS.flatMap((section) => section.links);
}

export type AdminSearchRoute = {
  title: string;
  path: string;
  /** Extra tokens matched by search (lowercase). */
  keywords?: string;
};

/** Routes surfaced in the header command palette (Minimal-style ⌘K search). */
export const ADMIN_SEARCH_ROUTES: AdminSearchRoute[] = [
  { title: "Dashboard", path: "/dashboard", keywords: "overview home stats" },
  { title: "Products", path: "/products", keywords: "catalog items sku inventory" },
  { title: "Inventory", path: "/inventory", keywords: "stock warehouse" },
  { title: "Orders", path: "/orders", keywords: "sales customers shipping" },
  { title: "Blog", path: "/blog", keywords: "posts articles content" },
  { title: "Reviews", path: "/testimonials", keywords: "testimonials quotes homepage carousel" },
  { title: "Contact Leads", path: "/contact-inquiries", keywords: "contact form inquiries issues support" },
  { title: "Settings", path: "/settings", keywords: "api account preferences" },
];

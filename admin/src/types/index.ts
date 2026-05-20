// ─── Product ────────────────────────────────────────────────────────────────
export interface Product {
  id: string;
  name: string;
  shortDescription?: string;
  description: string;
  /** Short benefit line; synced with storefront. */
  benefit?: string | null;
  price: number;
  category: string;
  stock: number;
  status: "active" | "draft" | "archived" | "upcoming";
  images: string[];
  /** Product detail — bullet pointers (admin: one line each). */
  keyBenefitsPoints?: string[];
  /** Ingredient tags (admin: one per line). */
  ingredientsPoints?: string[];
  clinicalNote?: string | null;
  showClinicalNote?: boolean;
  createdAt: string;
  updatedAt?: string;
}

// ─── Order ───────────────────────────────────────────────────────────────────
export type OrderStatus =
  | "pending"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled";

export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  customerName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  pincode: string;
  items: OrderItem[];
  total: number;
  status: OrderStatus;
  paymentMethod: string;
  createdAt: string;
  updatedAt: string;
}

// ─── Testimonials (homepage carousel) ───────────────────────────────────────
export interface Testimonial {
  id: string;
  quote: string;
  authorName: string;
  authorTitle: string;
  published: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

// ─── Blog ────────────────────────────────────────────────────────────────────
export interface Blog {
  id: string;
  title: string;
  slug: string;
  author: string;
  category: string;
  coverImage: string;
  content: string; // HTML string from TipTap
  seoTitle: string;
  seoDescription: string;
  status: "published" | "draft";
  createdAt: string;
  updatedAt: string;
}

// ─── Settings ─────────────────────────────────────────────────────────────────
export interface AdminProfile {
  name: string;
  email: string;
  avatar: string;
  role: string;
}

export interface WebsiteSettings {
  siteName: string;
  siteUrl: string;
  logo: string;
  tagline: string;
  socialLinks: {
    instagram: string;
    facebook: string;
    twitter: string;
    youtube: string;
  };
}

// ─── Dashboard ───────────────────────────────────────────────────────────────
export interface DashboardStats {
  totalOrders: number;
  totalProducts: number;
  totalBlogs: number;
  revenue: number;
  lowInventory: number;
  publishedBlogs: number;
  activeProducts: number;
}

export interface ContactInquiry {
  id: string;
  name: string;
  phone: string;
  email: string;
  issue: string;
  status: "pending" | "in_progress" | "contacted";
  createdAt: string;
  updatedAt: string;
}

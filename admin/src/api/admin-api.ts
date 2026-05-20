import { getAdminAccessToken, getApiBaseUrl } from "./config";
import type {
  Blog,
  ContactInquiry,
  DashboardStats,
  Order,
  OrderStatus,
  Product,
  Testimonial,
} from "@/types";

type ApiEnvelope<T> = { data: T };

function wrapFetchError(err: unknown): Error {
  if (err instanceof TypeError && String(err.message).toLowerCase().includes("fetch")) {
    const base = getApiBaseUrl();
    return new Error(
      `Cannot reach the API at ${base}. Start the backend from the repo root: cd backend && npm run dev (needs Docker for Postgres, or set DATABASE_URL).`
    );
  }
  return err instanceof Error ? err : new Error(String(err));
}

/** Display hint — keep in sync with backend default `UPLOAD_MAX_IMAGE_MB`. */
export const ADMIN_UPLOAD_MAX_MB = 5;

async function parseResponse<T>(res: Response): Promise<T> {
  const text = await res.text();
  const body = text ? (JSON.parse(text) as unknown) : null;
  if (!res.ok) {
    const err = body as { error?: string } | null;
    throw new Error(err?.error ?? `${res.status} ${res.statusText}`);
  }
  if (res.status === 204) return undefined as T;
  return body as T;
}

function adminHeaders(): HeadersInit {
  const token = getAdminAccessToken();
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export async function adminGet<T>(path: string): Promise<T> {
  let res: Response;
  try {
    res = await fetch(`${getApiBaseUrl()}${path}`, {
      headers: adminHeaders(),
    });
  } catch (e) {
    throw wrapFetchError(e);
  }
  const json = await parseResponse<ApiEnvelope<T>>(res);
  return json.data;
}

export async function adminPost<T, B = unknown>(path: string, body: B): Promise<T> {
  let res: Response;
  try {
    res = await fetch(`${getApiBaseUrl()}${path}`, {
      method: "POST",
      headers: adminHeaders(),
      body: JSON.stringify(body),
    });
  } catch (e) {
    throw wrapFetchError(e);
  }
  const json = await parseResponse<ApiEnvelope<T>>(res);
  return json.data;
}

export async function adminPatch<T, B = unknown>(path: string, body: B): Promise<T> {
  let res: Response;
  try {
    res = await fetch(`${getApiBaseUrl()}${path}`, {
      method: "PATCH",
      headers: adminHeaders(),
      body: JSON.stringify(body),
    });
  } catch (e) {
    throw wrapFetchError(e);
  }
  const json = await parseResponse<ApiEnvelope<T>>(res);
  return json.data;
}

/** Multipart upload to Cloudinary (admin JWT). Returns HTTPS URL for DB fields. */
export async function adminUploadImage(file: File): Promise<{ url: string; publicId?: string }> {
  const form = new FormData();
  form.append("file", file);
  const token = getAdminAccessToken();
  let res: Response;
  try {
    res = await fetch(`${getApiBaseUrl()}/api/v1/admin/uploads/image`, {
      method: "POST",
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: form,
    });
  } catch (e) {
    throw wrapFetchError(e);
  }
  const text = await res.text();
  const body = text ? (JSON.parse(text) as unknown) : null;
  if (!res.ok) {
    const err = body as { error?: string } | null;
    throw new Error(err?.error ?? `${res.status} ${res.statusText}`);
  }
  const json = body as { data: { url: string; publicId?: string } };
  return json.data;
}

export async function adminDelete(path: string): Promise<void> {
  let res: Response;
  try {
    res = await fetch(`${getApiBaseUrl()}${path}`, {
      method: "DELETE",
      headers: adminHeaders(),
    });
  } catch (e) {
    throw wrapFetchError(e);
  }
  await parseResponse<unknown>(res);
}

export async function fetchDashboardStats() {
  return adminGet<DashboardStats>("/api/v1/admin/dashboard/stats");
}

export async function fetchAdminContactInquiries() {
  return adminGet<ContactInquiry[]>("/api/v1/admin/contact-inquiries");
}

export async function patchAdminContactInquiryStatus(
  id: string,
  status: ContactInquiry["status"]
) {
  return adminPatch<ContactInquiry, { status: ContactInquiry["status"] }>(
    `/api/v1/admin/contact-inquiries/${encodeURIComponent(id)}/status`,
    { status }
  );
}

export async function fetchAdminProducts() {
  return adminGet<Product[]>("/api/v1/admin/products");
}

export async function fetchAdminProduct(id: string) {
  return adminGet<Product>(`/api/v1/admin/products/${encodeURIComponent(id)}`);
}

export type CreateProductInput = {
  name: string;
  shortDescription?: string;
  description: string;
  benefit?: string;
  price: number;
  category: string;
  stock: number;
  status: Product["status"];
  images: string[];
  keyBenefitsPoints?: string[];
  ingredientsPoints?: string[];
  clinicalNote?: string;
  showClinicalNote?: boolean;
};

export async function createAdminProduct(body: CreateProductInput) {
  return adminPost<Product, CreateProductInput>("/api/v1/admin/products", body);
}

export type PatchProductBody = Partial<Omit<CreateProductInput, "clinicalNote">> & {
  benefit?: string | null;
  clinicalNote?: string | null;
};

export async function patchAdminProduct(id: string, body: PatchProductBody) {
  return adminPatch<Product, PatchProductBody>(
    `/api/v1/admin/products/${encodeURIComponent(id)}`,
    body
  );
}

export async function deleteAdminProduct(id: string) {
  await adminDelete(`/api/v1/admin/products/${encodeURIComponent(id)}`);
}

export async function fetchAdminOrders() {
  return adminGet<Order[]>("/api/v1/admin/orders");
}

export async function fetchAdminOrder(id: string) {
  return adminGet<Order>(`/api/v1/admin/orders/${encodeURIComponent(id)}`);
}

export async function patchOrderStatus(id: string, status: OrderStatus) {
  return adminPatch<Order, { status: OrderStatus }>(
    `/api/v1/admin/orders/${encodeURIComponent(id)}/status`,
    { status }
  );
}

export async function fetchAdminBlogs() {
  return adminGet<Blog[]>("/api/v1/admin/blogs");
}

export async function fetchAdminBlog(id: string) {
  return adminGet<Blog>(`/api/v1/admin/blogs/${encodeURIComponent(id)}`);
}

export type CreateBlogInput = Omit<Blog, "id" | "createdAt" | "updatedAt">;

export async function createAdminBlog(body: CreateBlogInput) {
  return adminPost<Blog, CreateBlogInput>("/api/v1/admin/blogs", body);
}

export async function patchAdminBlog(id: string, body: Partial<CreateBlogInput>) {
  return adminPatch<Blog, Partial<CreateBlogInput>>(
    `/api/v1/admin/blogs/${encodeURIComponent(id)}`,
    body
  );
}

export async function deleteAdminBlog(id: string) {
  await adminDelete(`/api/v1/admin/blogs/${encodeURIComponent(id)}`);
}

export async function fetchAdminTestimonials() {
  return adminGet<Testimonial[]>("/api/v1/admin/testimonials");
}

export type CreateTestimonialInput = {
  quote: string;
  authorName: string;
  authorTitle: string;
  published?: boolean;
  sortOrder?: number;
};

export async function createAdminTestimonial(body: CreateTestimonialInput) {
  return adminPost<Testimonial, CreateTestimonialInput>("/api/v1/admin/testimonials", body);
}

export async function patchAdminTestimonial(id: string, body: Partial<CreateTestimonialInput>) {
  return adminPatch<Testimonial, Partial<CreateTestimonialInput>>(
    `/api/v1/admin/testimonials/${encodeURIComponent(id)}`,
    body
  );
}

export async function deleteAdminTestimonial(id: string) {
  await adminDelete(`/api/v1/admin/testimonials/${encodeURIComponent(id)}`);
}

export type SiteSettingsApi = {
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
  updatedAt: string;
};

export async function fetchSiteSettings() {
  return adminGet<SiteSettingsApi>("/api/v1/admin/settings/site");
}

export async function patchSiteSettings(body: {
  siteName?: string;
  siteUrl?: string;
  logo?: string;
  tagline?: string;
  socialLinks?: Partial<SiteSettingsApi["socialLinks"]>;
}) {
  return adminPatch<SiteSettingsApi, typeof body>("/api/v1/admin/settings/site", body);
}

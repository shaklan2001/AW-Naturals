import { getApiBaseUrl } from "./config";
import { getCustomerAccessToken } from "./customer-session";

async function parseJson<T>(res: Response): Promise<T> {
  const text = await res.text();
  const data = text ? (JSON.parse(text) as unknown) : null;
  if (!res.ok) {
    const err = data as { error?: string } | null;
    throw new Error(err?.error ?? res.statusText);
  }
  return data as T;
}

export type StorefrontProduct = {
  id: string;
  name: string;
  shortDescription?: string;
  benefit: string;
  description: string;
  price: number;
  image: string;
  images?: string[];
  category?: string;
  stock?: number;
  keyBenefitsPoints?: string[];
  ingredientsPoints?: string[];
  clinicalNote?: string | null;
  showClinicalNote?: boolean;
  /** Present on API catalog: `active` is purchasable; `upcoming` is visible but not for sale yet. */
  status?: "active" | "upcoming";
};

export type BlogListItem = {
  id: string;
  title: string;
  slug: string;
  author: string;
  category: string;
  coverImage: string;
  seoTitle: string;
  seoDescription: string;
  status: string;
  createdAt: string;
  updatedAt: string;
};

export type BlogDetail = BlogListItem & { content: string };

/** Homepage testimonial carousel (`GET /testimonials`). */
export type TestimonialPublic = {
  id: string;
  quote: string;
  name: string;
  title: string;
};

export type CreateOrderInput = {
  customerName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  pincode: string;
  paymentMethod: string;
  items: Array<{ productId: string; quantity: number }>;
};

export type CreateContactInquiryInput = {
  name: string;
  phone: string;
  email: string;
  issue: string;
};

export async function fetchProducts(category?: string): Promise<StorefrontProduct[]> {
  const qs = category && category !== "all" ? `?category=${encodeURIComponent(category)}` : "";
  const res = await fetch(`${getApiBaseUrl()}/api/v1/products${qs}`);
  const json = await parseJson<{ data: StorefrontProduct[] }>(res);
  return json.data;
}

export async function fetchProduct(id: string): Promise<StorefrontProduct> {
  const res = await fetch(`${getApiBaseUrl()}/api/v1/products/${encodeURIComponent(id)}`);
  const json = await parseJson<{ data: StorefrontProduct }>(res);
  return json.data;
}

export async function fetchPublishedBlogs(): Promise<BlogListItem[]> {
  const res = await fetch(`${getApiBaseUrl()}/api/v1/blogs`);
  const json = await parseJson<{ data: BlogListItem[] }>(res);
  return json.data;
}

export async function fetchBlogBySlug(slug: string): Promise<BlogDetail> {
  const res = await fetch(
    `${getApiBaseUrl()}/api/v1/blogs/slug/${encodeURIComponent(slug)}`
  );
  const json = await parseJson<{ data: BlogDetail }>(res);
  return json.data;
}

export async function fetchPublishedTestimonials(): Promise<TestimonialPublic[]> {
  const res = await fetch(`${getApiBaseUrl()}/api/v1/testimonials`);
  const json = await parseJson<{ data: TestimonialPublic[] }>(res);
  return json.data;
}

export async function createOrder(body: CreateOrderInput): Promise<{ id: string }> {
  const res = await fetch(`${getApiBaseUrl()}/api/v1/orders`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const json = await parseJson<{ data: { id: string } }>(res);
  return json.data;
}

export async function createContactInquiry(
  body: CreateContactInquiryInput
): Promise<{ id: string }> {
  const res = await fetch(`${getApiBaseUrl()}/api/v1/contact-inquiries`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const json = await parseJson<{ data: { id: string } }>(res);
  return json.data;
}

export type RazorpayCheckoutPayload = Omit<CreateOrderInput, "paymentMethod">;

export type RazorpayOrderResponse = {
  keyId: string;
  orderId: string;
  amount: number;
  currency: string;
};

export async function createRazorpayCheckoutOrder(
  body: RazorpayCheckoutPayload
): Promise<RazorpayOrderResponse> {
  const token = getCustomerAccessToken();
  const res = await fetch(`${getApiBaseUrl()}/api/v1/payments/razorpay/order`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(body),
  });
  const json = await parseJson<{ data: RazorpayOrderResponse }>(res);
  return json.data;
}

export type RazorpayVerifyPayload = RazorpayCheckoutPayload & {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
};

export async function verifyRazorpayPayment(body: RazorpayVerifyPayload): Promise<{ id: string }> {
  const token = getCustomerAccessToken();
  const res = await fetch(`${getApiBaseUrl()}/api/v1/payments/razorpay/verify`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(body),
  });
  const json = await parseJson<{ data: { id: string } }>(res);
  return json.data;
}

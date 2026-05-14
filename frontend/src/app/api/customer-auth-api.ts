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

export async function registerCustomer(body: {
  name: string;
  email: string;
  password: string;
}): Promise<{ id: string; name: string; email: string; createdAt: string }> {
  const res = await fetch(`${getApiBaseUrl()}/api/v1/auth/customer/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const json = await parseJson<{ data: { id: string; name: string; email: string; createdAt: string } }>(res);
  return json.data;
}

export async function loginCustomer(
  email: string,
  password: string
): Promise<{ accessToken: string; user: { id: string; name: string; email: string; emailVerified?: boolean } }> {
  const res = await fetch(`${getApiBaseUrl()}/api/v1/auth/customer/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  const json = await parseJson<{
    data: { accessToken: string; user: { id: string; name: string; email: string } };
  }>(res);
  return json.data;
}

function customerAuthHeaders(): HeadersInit {
  const token = getCustomerAccessToken();
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export type CustomerProfileApi = {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  pincode: string;
  emailVerified: boolean;
  createdAt: string;
  updatedAt: string;
};

export type CustomerOrderApi = {
  id: string;
  customerName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  pincode: string;
  items: Array<{
    productId: string;
    productName: string;
    quantity: number;
    price: number;
    /** First product image URL/path from catalog, or null if missing */
    productImage: string | null;
  }>;
  total: number;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  paymentMethod: string;
  createdAt: string;
  updatedAt: string;
};

export async function fetchCustomerProfile(): Promise<CustomerProfileApi> {
  const res = await fetch(`${getApiBaseUrl()}/api/v1/customer/me`, {
    headers: customerAuthHeaders(),
  });
  const json = await parseJson<{ data: CustomerProfileApi }>(res);
  return json.data;
}

export async function patchCustomerProfile(body: Partial<CustomerProfileApi>): Promise<CustomerProfileApi> {
  const res = await fetch(`${getApiBaseUrl()}/api/v1/customer/me`, {
    method: "PATCH",
    headers: customerAuthHeaders(),
    body: JSON.stringify(body),
  });
  const json = await parseJson<{ data: CustomerProfileApi }>(res);
  return json.data;
}

export async function fetchCustomerOrders(): Promise<CustomerOrderApi[]> {
  const res = await fetch(`${getApiBaseUrl()}/api/v1/customer/orders`, {
    headers: customerAuthHeaders(),
  });
  const json = await parseJson<{ data: CustomerOrderApi[] }>(res);
  return json.data;
}

export async function changeCustomerPassword(body: {
  currentPassword: string;
  newPassword: string;
}): Promise<{ ok: boolean }> {
  const res = await fetch(`${getApiBaseUrl()}/api/v1/customer/change-password`, {
    method: "PATCH",
    headers: customerAuthHeaders(),
    body: JSON.stringify(body),
  });
  const json = await parseJson<{ data: { ok: boolean } }>(res);
  return json.data;
}

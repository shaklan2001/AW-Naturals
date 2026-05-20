import { getApiBaseUrl } from "./config";

type LoginResponse = {
  accessToken: string;
  user: { id: string; name: string; email: string; role: string };
};

export async function loginAdmin(email: string, password: string): Promise<LoginResponse> {
  const res = await fetch(`${getApiBaseUrl()}/api/v1/auth/admin/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  const text = await res.text();
  const body = text ? (JSON.parse(text) as unknown) : null;
  if (!res.ok) {
    const err = body as { error?: string } | null;
    throw new Error(err?.error ?? `${res.status} ${res.statusText}`);
  }
  return (body as { data: LoginResponse }).data;
}

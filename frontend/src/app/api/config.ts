export function getApiBaseUrl(): string {
  const v = import.meta.env.VITE_API_URL;
  if (typeof v === "string" && v.length > 0) return v.replace(/\/$/, "");
  return "http://localhost:4000";
}

export const CUSTOMER_TOKEN_KEY = "aw-customer-token";
export const CUSTOMER_USER_KEY = "aw-customer-user";

export function getCustomerAccessToken(): string | null {
  return localStorage.getItem(CUSTOMER_TOKEN_KEY);
}

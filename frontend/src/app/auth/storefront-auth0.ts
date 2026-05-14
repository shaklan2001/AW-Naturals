/** Storefront uses Auth0-issued API tokens (login is embedded via backend; no hosted redirect). */
export function isStorefrontAuth0Enabled(): boolean {
  return Boolean(
    import.meta.env.VITE_AUTH0_DOMAIN &&
      import.meta.env.VITE_AUTH0_CLIENT_ID &&
      import.meta.env.VITE_AUTH0_AUDIENCE
  );
}

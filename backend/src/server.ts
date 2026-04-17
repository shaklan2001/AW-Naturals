import { createApp } from "./app.js";
import { env } from "./config/env.js";

const app = createApp();

app.listen(env.PORT, () => {
  console.log(`API listening on http://localhost:${env.PORT}`);
  console.log(`Public: http://localhost:${env.PORT}/api/v1/*`);
  if (env.NODE_ENV !== "production" && env.AUTH0_DOMAIN && env.AUTH0_ROPG_CLIENT_ID) {
    console.log(`Auth0:  domain=${env.AUTH0_DOMAIN} audience=${env.AUTH0_AUDIENCE || "(unset)"}`);
  }
  const adminHint =
    env.NODE_ENV !== "production" && env.ADMIN_DEV_BYPASS_SECRET.length > 0
      ? "login JWT, Bearer ADMIN_DEV_BYPASS_SECRET (dev), or Auth0 JWT"
      : "login JWT or Auth0 JWT";
  console.log(`Admin:  http://localhost:${env.PORT}/api/v1/admin/* (${adminHint})`);
  console.log(
    `Auth:   http://localhost:${env.PORT}/api/v1/auth/admin/* | customer/register | customer/login`
  );
});

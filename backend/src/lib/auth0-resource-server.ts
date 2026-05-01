import type { RequestHandler } from "express";
import { auth } from "express-oauth2-jwt-bearer";
import { env } from "../config/env.js";

let cached: RequestHandler | null | undefined;

/**
 * Validates Auth0-issued access tokens for this API (RS256, audience, issuer).
 * Shared by admin routes and storefront customer routes.
 */
export function getAuth0AccessTokenValidator(): RequestHandler | null {
  if (cached !== undefined) return cached;
  if (!env.AUTH0_DOMAIN || !env.AUTH0_AUDIENCE) {
    cached = null;
    return null;
  }
  cached = auth({
    audience: env.AUTH0_AUDIENCE,
    issuerBaseURL: `https://${env.AUTH0_DOMAIN}/`,
    tokenSigningAlg: "RS256",
  });
  return cached;
}

import type { RequestHandler } from "express";
import jwt from "jsonwebtoken";
import { getAuth0AccessTokenValidator } from "../lib/auth0-resource-server.js";
import { env } from "../config/env.js";

const jwtAuth: RequestHandler | null = getAuth0AccessTokenValidator();

function tryAppSignedAdminToken(authorization: string | undefined): boolean {
  if (!authorization?.startsWith("Bearer ")) return false;
  const token = authorization.slice("Bearer ".length).trim();
  if (!token || token.split(".").length !== 3) return false;
  try {
    const decoded = jwt.verify(token, env.JWT_SECRET) as jwt.JwtPayload;
    if (decoded.typ !== "admin" || typeof decoded.sub !== "string") return false;
    return true;
  } catch {
    return false;
  }
}

export const requireAdminAuth: RequestHandler = (req, res, next) => {
  const authorization = req.headers.authorization;

  const bypass = env.ADMIN_DEV_BYPASS_SECRET;
  if (bypass.length > 0 && env.NODE_ENV !== "production") {
    if (authorization === `Bearer ${bypass}`) {
      return next();
    }
  }

  if (tryAppSignedAdminToken(authorization)) {
    return next();
  }

  if (jwtAuth) {
    return jwtAuth(req, res, next);
  }

  res.status(401).json({
    error:
      "Admin authentication required. Use an Auth0 access token (same API audience), sign in with email/password on the login page, or in non-production the configured dev bypass bearer.",
  });
};

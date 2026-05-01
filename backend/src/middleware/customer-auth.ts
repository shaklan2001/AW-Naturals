import type { Request, RequestHandler } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { getAuth0AccessTokenValidator } from "../lib/auth0-resource-server.js";
import { HttpError } from "./error-handler.js";
import * as customerUserService from "../services/customer-user.service.js";

export type CustomerJwtPayload = {
  sub: string;
  typ: "customer";
  email: string;
  name: string;
};

export type AuthenticatedCustomer = {
  id: string;
  email: string;
  name: string;
};

function parseBearer(authorization: string | undefined): string | null {
  if (!authorization?.startsWith("Bearer ")) return null;
  const token = authorization.slice("Bearer ".length).trim();
  return token || null;
}

export function parseCustomerFromAuthorizationHeader(
  authorization: string | undefined
): AuthenticatedCustomer | null {
  const token = parseBearer(authorization);
  if (!token || token.split(".").length !== 3) return null;
  try {
    const decoded = jwt.verify(token, env.JWT_SECRET) as CustomerJwtPayload;
    if (decoded.typ !== "customer" || typeof decoded.sub !== "string") return null;
    if (typeof decoded.email !== "string" || typeof decoded.name !== "string") return null;
    return {
      id: decoded.sub,
      email: decoded.email,
      name: decoded.name,
    };
  } catch {
    return null;
  }
}

const auth0Validator = getAuth0AccessTokenValidator();

/** Used by public routes when an optional Bearer token is present. */
export async function getOptionalCustomer(req: Request): Promise<AuthenticatedCustomer | null> {
  const legacy = parseCustomerFromAuthorizationHeader(req.headers.authorization);
  if (legacy) return legacy;
  if (!auth0Validator) return null;
  if (!parseBearer(req.headers.authorization)) return null;

  return new Promise((resolve) => {
    const res = req.res;
    if (!res) {
      resolve(null);
      return;
    }
    auth0Validator(req, res, async (err?: unknown) => {
      if (err || !req.auth?.payload?.sub) {
        resolve(null);
        return;
      }
      try {
        const row = await customerUserService.findOrCreateCustomerFromAuth0(req.auth.payload);
        resolve(row);
      } catch {
        resolve(null);
      }
    });
  });
}

export const requireCustomerAuth: RequestHandler = (req, res, next) => {
  if (!parseBearer(req.headers.authorization)) {
    res.status(401).json({ error: "Customer authentication required." });
    return;
  }

  const legacy = parseCustomerFromAuthorizationHeader(req.headers.authorization);
  if (legacy) {
    (req as Request & { customer?: AuthenticatedCustomer }).customer = legacy;
    next();
    return;
  }

  if (!auth0Validator) {
    res.status(401).json({ error: "Customer authentication required." });
    return;
  }

  auth0Validator(req, res, async (err?: unknown) => {
    if (err || !req.auth?.payload) {
      res.status(401).json({ error: "Customer authentication required." });
      return;
    }
    try {
      const row = await customerUserService.findOrCreateCustomerFromAuth0(req.auth.payload);
      (req as Request & { customer?: AuthenticatedCustomer }).customer = row;
      next();
    } catch (e) {
      if (e instanceof HttpError) {
        res.status(e.status).json({ error: e.message });
        return;
      }
      const message = e instanceof Error ? e.message : "Could not resolve customer.";
      res.status(500).json({ error: message });
    }
  });
};

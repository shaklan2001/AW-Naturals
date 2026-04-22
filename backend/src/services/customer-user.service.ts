import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import type { JwtPayload } from "jsonwebtoken";
import { prisma } from "../lib/prisma.js";
import { HttpError } from "../middleware/error-handler.js";
import { env } from "../config/env.js";

const SALT_ROUNDS = 10;
const TOKEN_EXPIRES = "30d";

function displayNameFromAuth0Payload(payload: JwtPayload, emailFallback: string): string {
  const rec = payload as Record<string, unknown>;
  const um = rec.user_metadata;
  if (um && typeof um === "object" && um !== null) {
    const n = (um as Record<string, unknown>).name;
    if (typeof n === "string" && n.trim()) return n.trim();
  }
  const given = typeof rec.given_name === "string" ? rec.given_name : "";
  const family = typeof rec.family_name === "string" ? rec.family_name : "";
  if (typeof payload.name === "string" && payload.name.trim()) return payload.name.trim();
  const joined = `${given} ${family}`.trim();
  if (joined) return joined;
  const local = emailFallback.split("@")[0];
  return local || "Customer";
}

/** Map Auth0 access token to a DB row (create on first login). */
export async function findOrCreateCustomerFromAuth0(
  payload: JwtPayload
): Promise<{ id: string; email: string; name: string }> {
  const sub = typeof payload.sub === "string" ? payload.sub : "";
  if (!sub) throw new HttpError(401, "Invalid access token");

  const bySub = await prisma.customerUser.findUnique({ where: { auth0Sub: sub } });
  if (bySub) {
    return { id: bySub.id, email: bySub.email, name: bySub.name };
  }

  const emailClaim =
    typeof payload.email === "string" && payload.email.trim()
      ? payload.email.trim().toLowerCase()
      : "";

  if (!emailClaim) {
    throw new HttpError(
      403,
      "Your access token does not include an email. In Auth0, request scope `openid profile email` for the SPA and add an API Action or RBAC setting so the email claim is present on access tokens for this API audience."
    );
  }

  const nameFromClaim = displayNameFromAuth0Payload(payload, emailClaim);

  const existingEmail = await prisma.customerUser.findUnique({ where: { email: emailClaim } });
  if (existingEmail) {
    if (existingEmail.auth0Sub && existingEmail.auth0Sub !== sub) {
      throw new HttpError(409, "This email is linked to another login account.");
    }
    const updated = await prisma.customerUser.update({
      where: { id: existingEmail.id },
      data: { auth0Sub: sub, emailVerified: true },
      select: { id: true, email: true, name: true },
    });
    return updated;
  }

  const created = await prisma.customerUser.create({
    data: {
      auth0Sub: sub,
      email: emailClaim,
      name: nameFromClaim,
      passwordHash: null,
      emailVerified: true,
    },
    select: { id: true, email: true, name: true },
  });
  return created;
}

export async function createCustomerUser(input: { name: string; email: string; password: string }) {
  const name = input.name.trim();
  const email = input.email.trim().toLowerCase();
  if (!name) throw new HttpError(400, "Name is required");
  if (!email) throw new HttpError(400, "Email is required");

  const existing = await prisma.customerUser.findUnique({ where: { email } });
  if (existing) throw new HttpError(409, "An account with this email already exists");

  const passwordHash = await bcrypt.hash(input.password, SALT_ROUNDS);
  const user = await prisma.customerUser.create({
    data: { name, email, passwordHash, emailVerified: false },
    select: { id: true, name: true, email: true, createdAt: true, emailVerified: true },
  });
  return user;
}

export async function loginCustomerUser(email: string, password: string) {
  const normalized = email.trim().toLowerCase();
  const user = await prisma.customerUser.findUnique({ where: { email: normalized } });
  if (!user) throw new HttpError(401, "Invalid email or password");

  if (!user.passwordHash) {
    throw new HttpError(
      401,
      "This account uses Auth0 sign-in. Use “Continue with email” (or your Auth0 login) instead of password here."
    );
  }

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) throw new HttpError(401, "Invalid email or password");

  const payload = {
    sub: user.id,
    typ: "customer" as const,
    email: user.email,
    name: user.name,
  };

  const accessToken = jwt.sign(payload, env.JWT_SECRET, { expiresIn: TOKEN_EXPIRES });
  return {
    accessToken,
    user: { id: user.id, name: user.name, email: user.email, emailVerified: user.emailVerified },
  };
}

export async function getCustomerProfile(customerId: string) {
  const user = await prisma.customerUser.findUnique({
    where: { id: customerId },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      address: true,
      city: true,
      pincode: true,
      emailVerified: true,
      createdAt: true,
      updatedAt: true,
    },
  });
  if (!user) throw new HttpError(404, "Customer not found");
  return user;
}

export async function updateCustomerProfile(
  customerId: string,
  body: {
    name?: string;
    email?: string;
    phone?: string;
    address?: string;
    city?: string;
    pincode?: string;
  }
) {
  const existing = await prisma.customerUser.findUnique({ where: { id: customerId } });
  if (!existing) throw new HttpError(404, "Customer not found");

  const nextEmail = body.email?.trim().toLowerCase();
  if (nextEmail && nextEmail !== existing.email) {
    const duplicate = await prisma.customerUser.findUnique({ where: { email: nextEmail } });
    if (duplicate) throw new HttpError(409, "This email is already in use");
  }

  const updated = await prisma.customerUser.update({
    where: { id: customerId },
    data: {
      ...(body.name != null ? { name: body.name.trim() } : {}),
      ...(nextEmail != null ? { email: nextEmail, emailVerified: false } : {}),
      ...(body.phone != null ? { phone: body.phone.trim() } : {}),
      ...(body.address != null ? { address: body.address.trim() } : {}),
      ...(body.city != null ? { city: body.city.trim() } : {}),
      ...(body.pincode != null ? { pincode: body.pincode.trim() } : {}),
    },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      address: true,
      city: true,
      pincode: true,
      emailVerified: true,
      createdAt: true,
      updatedAt: true,
    },
  });
  return updated;
}

export async function changeCustomerPassword(customerId: string, currentPassword: string, newPassword: string) {
  const user = await prisma.customerUser.findUnique({ where: { id: customerId } });
  if (!user) throw new HttpError(404, "Customer not found");
  if (!user.passwordHash) {
    throw new HttpError(
      400,
      "Password is managed by Auth0. Change it in your Auth0 account / Universal Login settings."
    );
  }
  const ok = await bcrypt.compare(currentPassword, user.passwordHash);
  if (!ok) throw new HttpError(400, "Current password is incorrect");
  const passwordHash = await bcrypt.hash(newPassword, SALT_ROUNDS);
  await prisma.customerUser.update({
    where: { id: customerId },
    data: { passwordHash },
  });
  return { ok: true };
}

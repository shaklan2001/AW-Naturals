import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { prisma } from "../lib/prisma.js";
import { HttpError } from "../middleware/error-handler.js";
import { env } from "../config/env.js";

const SALT_ROUNDS = 10;
const TOKEN_EXPIRES = "7d";

export async function createAdminUser(input: {
  name: string;
  email: string;
  password: string;
  role?: "super_admin" | "admin";
}) {
  const name = input.name.trim();
  const email = input.email.trim().toLowerCase();
  if (email.length === 0) throw new HttpError(400, "Email is required");

  const existing = await prisma.adminUser.findUnique({ where: { email } });
  if (existing) throw new HttpError(409, "An admin with this email already exists");

  const passwordHash = await bcrypt.hash(input.password, SALT_ROUNDS);
  const user = await prisma.adminUser.create({
    data: {
      name,
      email,
      passwordHash,
      role: input.role ?? "admin",
    },
    select: { id: true, name: true, email: true, role: true, createdAt: true },
  });
  return user;
}

export async function loginAdminUser(email: string, password: string) {
  const normalized = email.trim().toLowerCase();
  const user = await prisma.adminUser.findUnique({ where: { email: normalized } });
  if (!user) throw new HttpError(401, "Invalid email or password");

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) throw new HttpError(401, "Invalid email or password");

  const payload = {
    sub: user.id,
    typ: "admin" as const,
    email: user.email,
    name: user.name,
    role: user.role,
  };

  const accessToken = jwt.sign(payload, env.JWT_SECRET, { expiresIn: TOKEN_EXPIRES });
  return {
    accessToken,
    user: { id: user.id, name: user.name, email: user.email, role: user.role },
  };
}

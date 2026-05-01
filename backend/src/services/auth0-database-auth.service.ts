import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { HttpError } from "../middleware/error-handler.js";
import * as customerUserService from "./customer-user.service.js";

const tokenUrl = () => `https://${env.AUTH0_DOMAIN}/oauth/token`;
const signupUrl = () => `https://${env.AUTH0_DOMAIN}/dbconnections/signup`;

export function isAuth0EmbeddedDatabaseConfigured(): boolean {
  return Boolean(
    env.AUTH0_DOMAIN &&
      env.AUTH0_AUDIENCE &&
      env.AUTH0_ROPG_CLIENT_ID &&
      env.AUTH0_ROPG_CLIENT_SECRET
  );
}

function connectionName(): string {
  return env.AUTH0_DATABASE_REALM || "Username-Password-Authentication";
}

type TokenResponse = {
  access_token?: string;
  id_token?: string;
  expires_in?: number;
  token_type?: string;
  error?: string;
  error_description?: string;
};

async function postToken(body: Record<string, unknown>): Promise<TokenResponse> {
  const res = await fetch(tokenUrl(), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return (await res.json()) as TokenResponse;
}

/**
 * Resource Owner Password Grant (server-side) for Auth0 Database users.
 */
export async function exchangeAuth0DatabasePassword(
  email: string,
  password: string
): Promise<{ accessToken: string; idToken?: string; expiresIn?: number }> {
  if (!isAuth0EmbeddedDatabaseConfigured()) {
    throw new HttpError(500, "Auth0 embedded login is not configured on the server.");
  }

  const common = {
    username: email.trim(),
    password,
    audience: env.AUTH0_AUDIENCE,
    client_id: env.AUTH0_ROPG_CLIENT_ID,
    client_secret: env.AUTH0_ROPG_CLIENT_SECRET,
    scope: "openid profile email offline_access",
  };

  let data = await postToken({
    grant_type: "http://auth0.com/oauth/grant-type/password-realm",
    ...common,
    realm: connectionName(),
  });

  const desc = typeof data.error_description === "string" ? data.error_description : "";
  const passwordRealmDisallowed =
    !data.access_token &&
    (data.error === "unsupported_grant_type" ||
      /password-realm/i.test(desc) ||
      (/not allowed for the client/i.test(desc) && /grant/i.test(desc)));

  if (passwordRealmDisallowed) {
    data = await postToken({
      grant_type: "password",
      ...common,
    });
  }

  if (data.error) {
    let msg =
      typeof data.error_description === "string" && data.error_description.length > 0
        ? data.error_description
        : data.error === "invalid_grant"
          ? "Invalid email or password."
          : data.error ?? "Auth0 token request failed.";
    if (/invalid audience/i.test(msg)) {
      msg += " If you just changed AUTH0_AUDIENCE in .env, restart the API process (tsx watch does not reload env files).";
    }
    throw new HttpError(401, msg);
  }
  if (!data.access_token) {
    throw new HttpError(502, "Auth0 did not return an access token.");
  }
  return {
    accessToken: data.access_token,
    idToken: data.id_token,
    expiresIn: data.expires_in,
  };
}

function mergeJwtPayloads(accessToken: string, idToken?: string): jwt.JwtPayload {
  const access = jwt.decode(accessToken) as jwt.JwtPayload | null;
  const id = idToken ? (jwt.decode(idToken) as jwt.JwtPayload | null) : null;
  return { ...(id ?? {}), ...(access ?? {}) } as jwt.JwtPayload;
}

export async function loginCustomerWithAuth0EmbeddedPassword(
  email: string,
  password: string
): Promise<{ accessToken: string; user: { id: string; name: string; email: string; emailVerified: boolean } }> {
  const { accessToken, idToken } = await exchangeAuth0DatabasePassword(email, password);
  const payload = mergeJwtPayloads(accessToken, idToken);
  const row = await customerUserService.findOrCreateCustomerFromAuth0(payload);
  return {
    accessToken,
    user: {
      id: row.id,
      name: row.name,
      email: row.email,
      emailVerified: true,
    },
  };
}

/** Auth0 Authentication API — creates a user in the Database connection (no redirect). */
export async function signupAuth0DatabaseUser(input: {
  name: string;
  email: string;
  password: string;
}): Promise<void> {
  if (!isAuth0EmbeddedDatabaseConfigured()) {
    throw new HttpError(500, "Auth0 embedded signup is not configured on the server.");
  }
  const email = input.email.trim().toLowerCase();
  const name = input.name.trim();
  if (!email || !name) throw new HttpError(400, "Name and email are required.");

  const res = await fetch(signupUrl(), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      client_id: env.AUTH0_ROPG_CLIENT_ID,
      email,
      password: input.password,
      connection: connectionName(),
      name,
      user_metadata: { name },
    }),
  });

  const data = (await res.json()) as {
    code?: string;
    description?: string;
    message?: string;
    name?: string;
    error?: string;
    error_description?: string;
  };

  if (!res.ok) {
    const pick = (v: unknown) => (typeof v === "string" ? v.trim() : "");
    const code = pick(data.code);
    let msg =
      pick(data.description) ||
      pick(data.error_description) ||
      pick(data.message) ||
      pick(data.error) ||
      pick(data.name) ||
      `Sign up failed (${res.status})`;

    const combined = `${msg} ${code}`.toLowerCase();
    if (
      res.status === 400 &&
      (code === "user_exists" || combined.includes("already exists") || combined.includes("user already"))
    ) {
      throw new HttpError(409, "An account with this email already exists.");
    }

    if (res.status === 400 && code === "invalid_signup" && /^invalid sign up$/i.test(pick(data.description))) {
      throw new HttpError(
        409,
        "This email is already registered. Use “Sign in”, or try a different email."
      );
    }

    if (/^invalid sign up$/i.test(msg)) {
      msg =
        "Auth0 could not create this account. Check: password meets your Auth0 password policy (Dashboard → Security → Password Complexity); the database connection allows sign-ups; this application is enabled on that connection (Authentication → Database → connection → Applications); and AUTH0_DATABASE_REALM matches the connection name.";
    }

    throw new HttpError(res.status === 400 ? 400 : 502, msg);
  }
}

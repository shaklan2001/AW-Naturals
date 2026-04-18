import "dotenv/config";
import { z } from "zod";

const DEFAULT_DEV_ADMIN_BYPASS = "local-dev-admin-token";
const DEFAULT_DEV_JWT_SECRET = "dev-only-change-me-admin-jwt-secret-min-32-chars!!";
const DEFAULT_DEV_ADMIN_USER_SETUP_KEY = "postman-admin-user-setup-key";

const schema = z
  .object({
    NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
    PORT: z.coerce.number().default(4000),
    DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),
    CORS_ORIGINS: z
      .string()
      .default(
        "http://localhost:5173,http://localhost:5174,http://127.0.0.1:5173,http://127.0.0.1:5174"
      )
      .transform((s) =>
        s
          .split(",")
          .map((o) => o.trim())
          .filter(Boolean)
      ),
    AUTH0_DOMAIN: z.string().default("").transform((s) => s.trim()),
    AUTH0_AUDIENCE: z.string().default("").transform((s) => s.trim()),
    /** Regular Web App / confidential client — Password grant + dbconnections/signup (server only). */
    AUTH0_ROPG_CLIENT_ID: z.string().default("").transform((s) => s.trim()),
    AUTH0_ROPG_CLIENT_SECRET: z.string().default("").transform((s) => s.trim()),
    /** Auth0 Database connection name (default Username-Password-Authentication). */
    AUTH0_DATABASE_REALM: z.string().default("").transform((s) => s.trim()),
    ADMIN_DEV_BYPASS_SECRET: z.string().default("").transform((s) => s.trim()),
    JWT_SECRET: z.string().default("").transform((s) => s.trim()),
    ADMIN_USER_SETUP_KEY: z.string().default("").transform((s) => s.trim()),
    /** Cloudinary — required for POST /admin/uploads/image (optional in dev until you configure). */
    CLOUDINARY_CLOUD_NAME: z.string().default("").transform((s) => s.trim()),
    CLOUDINARY_API_KEY: z.string().default("").transform((s) => s.trim()),
    CLOUDINARY_API_SECRET: z.string().default("").transform((s) => s.trim()),
    CLOUDINARY_UPLOAD_FOLDER: z.string().default("aw-naturals").transform((s) => s.trim() || "aw-naturals"),
    /** Max size for admin image uploads (JPEG/PNG only). */
    UPLOAD_MAX_IMAGE_MB: z.coerce.number().min(1).max(20).default(5),
  })
  .superRefine((data, ctx) => {
    const auth0Configured = data.AUTH0_DOMAIN.length > 0 && data.AUTH0_AUDIENCE.length > 0;
    const devBypass = data.ADMIN_DEV_BYPASS_SECRET.length > 0;
    if (data.NODE_ENV === "production") {
      if (!auth0Configured) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "AUTH0_DOMAIN and AUTH0_AUDIENCE are required in production.",
          path: ["AUTH0_DOMAIN"],
        });
      }
      if (devBypass) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "ADMIN_DEV_BYPASS_SECRET must not be set in production.",
          path: ["ADMIN_DEV_BYPASS_SECRET"],
        });
      }
      if (data.JWT_SECRET.length < 32) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "JWT_SECRET must be at least 32 characters (used to sign admin login tokens).",
          path: ["JWT_SECRET"],
        });
      }
      if (data.ADMIN_USER_SETUP_KEY.length < 12) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message:
            "ADMIN_USER_SETUP_KEY must be at least 12 characters (required header for POST /auth/admin/register).",
          path: ["ADMIN_USER_SETUP_KEY"],
        });
      }
    }
  })
  .transform((data) => ({
    ...data,
    UPLOAD_MAX_IMAGE_BYTES: Math.round(data.UPLOAD_MAX_IMAGE_MB * 1024 * 1024),
    ADMIN_DEV_BYPASS_SECRET:
      data.ADMIN_DEV_BYPASS_SECRET.length > 0
        ? data.ADMIN_DEV_BYPASS_SECRET
        : data.NODE_ENV !== "production"
          ? DEFAULT_DEV_ADMIN_BYPASS
          : "",
    JWT_SECRET:
      data.JWT_SECRET.length > 0
        ? data.JWT_SECRET
        : data.NODE_ENV !== "production"
          ? DEFAULT_DEV_JWT_SECRET
          : "",
    ADMIN_USER_SETUP_KEY:
      data.ADMIN_USER_SETUP_KEY.length > 0
        ? data.ADMIN_USER_SETUP_KEY
        : data.NODE_ENV !== "production"
          ? DEFAULT_DEV_ADMIN_USER_SETUP_KEY
          : "",
  }));

export type Env = z.infer<typeof schema>;

export const env: Env = schema.parse(process.env);

import { Router } from "express";
import { asyncHandler } from "../middleware/async-handler.js";
import { HttpError } from "../middleware/error-handler.js";
import {
  loginAdminUserSchema,
  loginCustomerUserSchema,
  registerAdminUserSchema,
  registerCustomerUserSchema,
} from "../validators/schemas.js";
import * as adminUserService from "../services/admin-user.service.js";
import * as auth0DatabaseAuth from "../services/auth0-database-auth.service.js";
import * as customerUserService from "../services/customer-user.service.js";
import { env } from "../config/env.js";

export const authRouter = Router();

authRouter.post(
  "/admin/register",
  asyncHandler(async (req, res) => {
    const headerKey = req.get("x-admin-setup-key");
    if (!headerKey || headerKey !== env.ADMIN_USER_SETUP_KEY) {
      throw new HttpError(
        403,
        "Invalid or missing X-Admin-Setup-Key header (must match ADMIN_USER_SETUP_KEY in the API .env)."
      );
    }

    const body = registerAdminUserSchema.parse(req.body);
    const user = await adminUserService.createAdminUser(body);
    res.status(201).json({ data: user });
  })
);

authRouter.post(
  "/admin/login",
  asyncHandler(async (req, res) => {
    const body = loginAdminUserSchema.parse(req.body);
    const result = await adminUserService.loginAdminUser(body.email, body.password);
    res.json({ data: result });
  })
);

authRouter.post(
  "/customer/register",
  asyncHandler(async (req, res) => {
    const body = registerCustomerUserSchema.parse(req.body);
    if (auth0DatabaseAuth.isAuth0EmbeddedDatabaseConfigured()) {
      await auth0DatabaseAuth.signupAuth0DatabaseUser(body);
      res.status(201).json({
        data: {
          id: "pending",
          name: body.name.trim(),
          email: body.email.trim().toLowerCase(),
          createdAt: new Date().toISOString(),
          emailVerified: false,
        },
      });
      return;
    }
    const user = await customerUserService.createCustomerUser(body);
    res.status(201).json({ data: user });
  })
);

authRouter.post(
  "/customer/login",
  asyncHandler(async (req, res) => {
    const body = loginCustomerUserSchema.parse(req.body);
    if (auth0DatabaseAuth.isAuth0EmbeddedDatabaseConfigured()) {
      const result = await auth0DatabaseAuth.loginCustomerWithAuth0EmbeddedPassword(body.email, body.password);
      res.json({ data: result });
      return;
    }
    const result = await customerUserService.loginCustomerUser(body.email, body.password);
    res.json({ data: result });
  })
);

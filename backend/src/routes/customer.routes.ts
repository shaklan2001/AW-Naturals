import { Router } from "express";
import { asyncHandler } from "../middleware/async-handler.js";
import { requireCustomerAuth, type AuthenticatedCustomer } from "../middleware/customer-auth.js";
import {
  changeCustomerPasswordSchema,
  updateCustomerProfileSchema,
} from "../validators/schemas.js";
import * as customerUserService from "../services/customer-user.service.js";
import * as orderService from "../services/order.service.js";

export const customerRouter = Router();

customerRouter.use(requireCustomerAuth);

function currentCustomer(req: unknown): AuthenticatedCustomer {
  const customer = (req as { customer?: AuthenticatedCustomer }).customer;
  if (!customer) {
    throw new Error("Customer context missing");
  }
  return customer;
}

customerRouter.get(
  "/me",
  asyncHandler(async (req, res) => {
    const customer = currentCustomer(req);
    const data = await customerUserService.getCustomerProfile(customer.id);
    res.json({ data });
  })
);

customerRouter.patch(
  "/me",
  asyncHandler(async (req, res) => {
    const customer = currentCustomer(req);
    const body = updateCustomerProfileSchema.parse(req.body);
    const data = await customerUserService.updateCustomerProfile(customer.id, body);
    res.json({ data });
  })
);

customerRouter.patch(
  "/change-password",
  asyncHandler(async (req, res) => {
    const customer = currentCustomer(req);
    const body = changeCustomerPasswordSchema.parse(req.body);
    const data = await customerUserService.changeCustomerPassword(
      customer.id,
      body.currentPassword,
      body.newPassword
    );
    res.json({ data });
  })
);

customerRouter.get(
  "/orders",
  asyncHandler(async (req, res) => {
    const customer = currentCustomer(req);
    const data = await orderService.listOrdersForCustomer(customer);
    res.json({ data });
  })
);

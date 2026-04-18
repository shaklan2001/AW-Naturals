import { Router } from "express";
import { asyncHandler } from "../middleware/async-handler.js";
import {
  createContactInquirySchema,
  createOrderSchema,
  razorpayCheckoutBodySchema,
  razorpayVerifyBodySchema,
} from "../validators/schemas.js";
import { mustParam } from "../utils/route-params.js";
import * as productService from "../services/product.service.js";
import * as blogService from "../services/blog.service.js";
import * as testimonialService from "../services/testimonial.service.js";
import * as orderService from "../services/order.service.js";
import * as razorpayPaymentService from "../services/razorpay-payment.service.js";
import * as contactInquiryService from "../services/contact-inquiry.service.js";
import { getOptionalCustomer } from "../middleware/customer-auth.js";

export const publicRouter = Router();

publicRouter.get(
  "/health",
  asyncHandler(async (_req, res) => {
    res.json({ ok: true, service: "aw-naturals-api" });
  })
);

publicRouter.get(
  "/products",
  asyncHandler(async (req, res) => {
    const category = typeof req.query.category === "string" ? req.query.category : undefined;
    const data = await productService.listProductsPublic(category);
    res.json({ data });
  })
);

publicRouter.get(
  "/products/:id",
  asyncHandler(async (req, res) => {
    const data = await productService.getProductPublic(mustParam(req.params.id, "id"));
    res.json({ data });
  })
);

publicRouter.get(
  "/blogs",
  asyncHandler(async (_req, res) => {
    const data = await blogService.listBlogsPublic();
    res.json({ data });
  })
);

publicRouter.get(
  "/blogs/slug/:slug",
  asyncHandler(async (req, res) => {
    const data = await blogService.getBlogBySlugPublic(mustParam(req.params.slug, "slug"));
    res.json({ data });
  })
);

publicRouter.get(
  "/testimonials",
  asyncHandler(async (_req, res) => {
    const data = await testimonialService.listTestimonialsPublic();
    res.json({ data });
  })
);

publicRouter.post(
  "/contact-inquiries",
  asyncHandler(async (req, res) => {
    const body = createContactInquirySchema.parse(req.body);
    const data = await contactInquiryService.createContactInquiry(body);
    res.status(201).json({ data });
  })
);

publicRouter.post(
  "/orders",
  asyncHandler(async (req, res) => {
    const body = createOrderSchema.parse(req.body);
    const customer = await getOptionalCustomer(req);
    const data = await orderService.createOrderFromCheckout({
      ...body,
      customerUserId: customer?.id,
    });
    res.status(201).json({ data });
  })
);

/** Creates a Razorpay Order; amount is computed from DB (never trust client totals). */
publicRouter.post(
  "/payments/razorpay/order",
  asyncHandler(async (req, res) => {
    const body = razorpayCheckoutBodySchema.parse(req.body);
    const customer = await getOptionalCustomer(req);
    const data = await razorpayPaymentService.createRazorpayOrderForCheckout({
      ...body,
      customerUserId: customer?.id,
    });
    res.status(201).json({ data });
  })
);

/** Verifies Razorpay signature + order amount, then creates the store order. */
publicRouter.post(
  "/payments/razorpay/verify",
  asyncHandler(async (req, res) => {
    const body = razorpayVerifyBodySchema.parse(req.body);
    const customer = await getOptionalCustomer(req);
    const data = await razorpayPaymentService.verifyRazorpayAndCreateOrder({
      ...body,
      customerUserId: customer?.id,
    });
    res.status(201).json({ data });
  })
);

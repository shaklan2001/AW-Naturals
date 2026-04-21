import { Router } from "express";
import { requireAdminAuth } from "../middleware/admin-auth.js";
import { asyncHandler } from "../middleware/async-handler.js";
import { HttpError } from "../middleware/error-handler.js";
import { adminImageUpload } from "../middleware/admin-image-upload.js";
import { isCloudinaryConfigured, uploadAdminImageBuffer } from "../services/cloudinary-upload.service.js";
import {
  createBlogSchema,
  createProductSchema,
  createTestimonialSchema,
  updateBlogSchema,
  updateOrderStatusSchema,
  updateProductSchema,
  updateSiteSettingsSchema,
  updateContactInquiryStatusSchema,
  updateTestimonialSchema,
} from "../validators/schemas.js";
import * as productService from "../services/product.service.js";
import * as blogService from "../services/blog.service.js";
import * as orderService from "../services/order.service.js";
import * as settingsService from "../services/settings.service.js";
import * as dashboardService from "../services/dashboard.service.js";
import * as testimonialService from "../services/testimonial.service.js";
import * as contactInquiryService from "../services/contact-inquiry.service.js";
import { mustParam } from "../utils/route-params.js";

export const adminRouter = Router();

adminRouter.use(requireAdminAuth);

adminRouter.post(
  "/uploads/image",
  adminImageUpload,
  asyncHandler(async (req, res) => {
    if (!isCloudinaryConfigured()) {
      throw new HttpError(
        503,
        "Image upload is not configured. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET on the API server."
      );
    }
    const file = req.file;
    if (!file?.buffer) {
      throw new HttpError(400, 'Missing image file. Send multipart/form-data with field name "file".');
    }
    const { url, publicId } = await uploadAdminImageBuffer(file.buffer, file.originalname);
    res.status(201).json({ data: { url, publicId } });
  })
);

adminRouter.get(
  "/dashboard/stats",
  asyncHandler(async (_req, res) => {
    const data = await dashboardService.getDashboardStats();
    res.json({ data });
  })
);

adminRouter.get(
  "/products",
  asyncHandler(async (_req, res) => {
    const data = await productService.listProductsAdmin();
    res.json({ data });
  })
);

adminRouter.get(
  "/products/:id",
  asyncHandler(async (req, res) => {
    const data = await productService.getProductAdmin(mustParam(req.params.id, "id"));
    res.json({ data });
  })
);

adminRouter.post(
  "/products",
  asyncHandler(async (req, res) => {
    const body = createProductSchema.parse(req.body);
    const data = await productService.createProductAdmin(body);
    res.status(201).json({ data });
  })
);

adminRouter.patch(
  "/products/:id",
  asyncHandler(async (req, res) => {
    const body = updateProductSchema.parse(req.body);
    const data = await productService.updateProductAdmin(mustParam(req.params.id, "id"), body);
    res.json({ data });
  })
);

adminRouter.delete(
  "/products/:id",
  asyncHandler(async (req, res) => {
    await productService.deleteProductAdmin(mustParam(req.params.id, "id"));
    res.status(204).send();
  })
);

adminRouter.get(
  "/orders",
  asyncHandler(async (_req, res) => {
    const data = await orderService.listOrdersAdmin();
    res.json({ data });
  })
);

adminRouter.get(
  "/orders/:id",
  asyncHandler(async (req, res) => {
    const data = await orderService.getOrderAdmin(mustParam(req.params.id, "id"));
    res.json({ data });
  })
);

adminRouter.patch(
  "/orders/:id/status",
  asyncHandler(async (req, res) => {
    const body = updateOrderStatusSchema.parse(req.body);
    const data = await orderService.updateOrderStatusAdmin(
      mustParam(req.params.id, "id"),
      body.status
    );
    res.json({ data });
  })
);

adminRouter.get(
  "/blogs",
  asyncHandler(async (_req, res) => {
    const data = await blogService.listBlogsAdmin();
    res.json({ data });
  })
);

adminRouter.get(
  "/blogs/:id",
  asyncHandler(async (req, res) => {
    const data = await blogService.getBlogAdmin(mustParam(req.params.id, "id"));
    res.json({ data });
  })
);

adminRouter.post(
  "/blogs",
  asyncHandler(async (req, res) => {
    const body = createBlogSchema.parse(req.body);
    const data = await blogService.createBlogAdmin(body);
    res.status(201).json({ data });
  })
);

adminRouter.patch(
  "/blogs/:id",
  asyncHandler(async (req, res) => {
    const body = updateBlogSchema.parse(req.body);
    const data = await blogService.updateBlogAdmin(mustParam(req.params.id, "id"), body);
    res.json({ data });
  })
);

adminRouter.delete(
  "/blogs/:id",
  asyncHandler(async (req, res) => {
    await blogService.deleteBlogAdmin(mustParam(req.params.id, "id"));
    res.status(204).send();
  })
);

adminRouter.get(
  "/testimonials",
  asyncHandler(async (_req, res) => {
    const data = await testimonialService.listTestimonialsAdmin();
    res.json({ data });
  })
);

adminRouter.post(
  "/testimonials",
  asyncHandler(async (req, res) => {
    const body = createTestimonialSchema.parse(req.body);
    const data = await testimonialService.createTestimonialAdmin(body);
    res.status(201).json({ data });
  })
);

adminRouter.patch(
  "/testimonials/:id",
  asyncHandler(async (req, res) => {
    const body = updateTestimonialSchema.parse(req.body);
    const data = await testimonialService.updateTestimonialAdmin(mustParam(req.params.id, "id"), body);
    res.json({ data });
  })
);

adminRouter.delete(
  "/testimonials/:id",
  asyncHandler(async (req, res) => {
    await testimonialService.deleteTestimonialAdmin(mustParam(req.params.id, "id"));
    res.status(204).send();
  })
);

adminRouter.get(
  "/contact-inquiries",
  asyncHandler(async (_req, res) => {
    const data = await contactInquiryService.listContactInquiriesAdmin();
    res.json({ data });
  })
);

adminRouter.patch(
  "/contact-inquiries/:id/status",
  asyncHandler(async (req, res) => {
    const body = updateContactInquiryStatusSchema.parse(req.body);
    const data = await contactInquiryService.updateContactInquiryStatusAdmin(
      mustParam(req.params.id, "id"),
      body.status
    );
    res.json({ data });
  })
);

adminRouter.get(
  "/settings/site",
  asyncHandler(async (_req, res) => {
    const data = await settingsService.getSiteSettings();
    res.json({ data });
  })
);

adminRouter.patch(
  "/settings/site",
  asyncHandler(async (req, res) => {
    const body = updateSiteSettingsSchema.parse(req.body);
    const data = await settingsService.updateSiteSettings({
      ...body,
      socialLinks: body.socialLinks,
    });
    res.json({ data });
  })
);

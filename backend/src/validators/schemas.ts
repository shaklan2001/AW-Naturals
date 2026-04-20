import { z } from "zod";

const orderStatusZod = z.enum([
  "pending",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
]);

const productStatusZod = z.enum(["active", "draft", "archived", "upcoming"]);

const blogStatusZod = z.enum(["published", "draft"]);
const contactInquiryStatusZod = z.enum(["pending", "in_progress", "contacted"]);

export const createOrderSchema = z.object({
  customerName: z.string().min(1),
  email: z.string().email(),
  phone: z.string().min(5),
  address: z.string().min(1),
  city: z.string().min(1),
  pincode: z.string().min(3),
  paymentMethod: z.string().min(1),
  items: z
    .array(
      z.object({
        productId: z.string().min(1),
        quantity: z.coerce.number().int().positive(),
      })
    )
    .min(1),
});

export const createContactInquirySchema = z.object({
  name: z.string().trim().min(2, "Name is required").max(120),
  phone: z.string().trim().min(7, "Phone number is required").max(24),
  email: z.string().trim().email("Valid email is required"),
  issue: z.string().trim().min(10, "Please describe your query").max(2000),
});

export const updateContactInquiryStatusSchema = z.object({
  status: contactInquiryStatusZod,
});

/** Checkout payload without payment (used to open Razorpay order). */
export const razorpayCheckoutBodySchema = createOrderSchema.omit({ paymentMethod: true });

export const razorpayVerifyBodySchema = razorpayCheckoutBodySchema.extend({
  razorpay_order_id: z.string().min(1),
  razorpay_payment_id: z.string().min(1),
  razorpay_signature: z.string().min(1),
});

export const updateOrderStatusSchema = z.object({
  status: orderStatusZod,
});

const stringArrayField = z
  .array(z.string())
  .optional()
  .default([])
  .transform((arr) => arr.map((s) => s.trim()).filter(Boolean));

export const createProductSchema = z.object({
  name: z.string().min(2),
  shortDescription: z.string().min(8).max(220).optional(),
  description: z.string().min(1),
  benefit: z.string().optional(),
  price: z.coerce.number().positive(),
  category: z.string().min(1),
  stock: z.coerce.number().int().min(0),
  status: productStatusZod,
  images: z.array(z.string().min(1)).default([]),
  keyBenefitsPoints: stringArrayField,
  ingredientsPoints: stringArrayField,
  clinicalNote: z.string().optional(),
  showClinicalNote: z.boolean().optional().default(false),
});

/** PATCH accepts null on benefit / clinicalNote to clear text. */
export const updateProductSchema = createProductSchema.partial().extend({
  benefit: z.string().nullish(),
  clinicalNote: z.string().nullish(),
});

export const createBlogSchema = z.object({
  title: z.string().min(2),
  slug: z
    .string()
    .min(2)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be URL-safe"),
  author: z.string().min(1),
  category: z.string().min(1),
  coverImage: z.string().min(1),
  content: z.string().min(1),
  seoTitle: z.string().min(1),
  seoDescription: z.string().min(1),
  status: blogStatusZod,
});

export const updateBlogSchema = createBlogSchema.partial();

/** Testimonials — short copy so homepage cards stay readable (admin + API enforced). */
export const createTestimonialSchema = z.object({
  quote: z.string().trim().min(12, "Quote is too short").max(300, "Quote must be at most 300 characters"),
  authorName: z.string().trim().min(1).max(72, "Name at most 72 characters"),
  authorTitle: z.string().trim().min(1).max(72, "Title at most 72 characters"),
  published: z.boolean().optional().default(false),
  sortOrder: z.coerce.number().int().min(0).max(999).optional().default(0),
});

export const updateTestimonialSchema = createTestimonialSchema.partial();

export const registerAdminUserSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(120),
  email: z.string().email(),
  password: z.string().min(8, "Password must be at least 8 characters"),
  role: z.enum(["super_admin", "admin"]).optional(),
});

export const loginAdminUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1, "Password is required"),
});

export const registerCustomerUserSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(120),
  email: z.string().email(),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const loginCustomerUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1, "Password is required"),
});

export const updateCustomerProfileSchema = z.object({
  name: z.string().trim().min(1).max(120).optional(),
  email: z.string().trim().email().optional(),
  phone: z.string().trim().max(24).optional(),
  address: z.string().trim().max(300).optional(),
  city: z.string().trim().max(120).optional(),
  pincode: z.string().trim().max(24).optional(),
});

export const changeCustomerPasswordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string().min(8, "New password must be at least 8 characters"),
});

export const updateSiteSettingsSchema = z.object({
  siteName: z.string().min(1).optional(),
  siteUrl: z.string().min(1).optional(),
  logo: z.string().optional(),
  tagline: z.string().min(1).optional(),
  socialLinks: z
    .object({
      instagram: z.string().optional(),
      facebook: z.string().optional(),
      twitter: z.string().optional(),
      youtube: z.string().optional(),
    })
    .optional(),
});

import { randomBytes } from "node:crypto";
import { ProductStatus, type Prisma } from "@prisma/client";
import { prisma } from "../lib/prisma.js";
import { HttpError } from "../middleware/error-handler.js";
import { toNumber } from "../utils/money.js";

/** Prisma `OrderStatus` values without importing `@prisma/client` enums. */
export type OrderStatusValue =
  | "pending"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled";

const orderIncludeItemsWithProduct = {
  items: {
    include: {
      product: { select: { images: true } },
    },
  },
} satisfies Prisma.OrderInclude;

function mapOrderItem(i: {
  productId: string | null;
  productName: string;
  quantity: number;
  price: unknown;
  productImageSnapshot?: string | null;
  product?: { images: string[] } | null;
}) {
  const fromSnapshot =
    typeof i.productImageSnapshot === "string" && i.productImageSnapshot.trim().length > 0
      ? i.productImageSnapshot.trim()
      : null;
  const fromProduct = i.product?.images?.find((u) => typeof u === "string" && u.trim().length > 0)?.trim();
  return {
    productId: i.productId ?? "",
    productName: i.productName,
    quantity: i.quantity,
    price: toNumber(i.price),
    productImage: fromSnapshot ?? fromProduct ?? null,
  };
}

function mapOrder(o: {
  id: string;
  orderNumber: string;
  customerName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  pincode: string;
  total: unknown;
  status: string;
  paymentMethod: string;
  createdAt: Date;
  updatedAt: Date;
  items: Array<{
    productId: string | null;
    productName: string;
    quantity: number;
    price: unknown;
    productImageSnapshot?: string | null;
    product?: { images: string[] } | null;
  }>;
}) {
  return {
    id: o.orderNumber,
    customerName: o.customerName,
    email: o.email,
    phone: o.phone,
    address: o.address,
    city: o.city,
    pincode: o.pincode,
    items: o.items.map(mapOrderItem),
    total: toNumber(o.total),
    status: o.status,
    paymentMethod: o.paymentMethod,
    createdAt: o.createdAt.toISOString().slice(0, 10),
    updatedAt: o.updatedAt.toISOString().slice(0, 10),
  };
}

function nextOrderNumber(): string {
  return `ORD-${randomBytes(3).toString("hex").toUpperCase()}`;
}

export type CheckoutLine = {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  /** First catalog image at checkout — shown in Order History */
  productImageSnapshot: string | null;
};

/** Validates cart lines against DB (active + stock). Used for checkout and Razorpay amount. */
export async function buildCheckoutLines(
  tx: Prisma.TransactionClient,
  items: Array<{ productId: string; quantity: number }>
): Promise<CheckoutLine[]> {
  const lines: CheckoutLine[] = [];

  for (const line of items) {
    const p = await tx.product.findUnique({ where: { id: line.productId } });
    if (!p || p.status !== ProductStatus.active) {
      throw new HttpError(400, `Invalid or unavailable product: ${line.productId}`);
    }
    if (p.stock < line.quantity) {
      throw new HttpError(400, `Insufficient stock for ${p.name}`);
    }
    lines.push({
      productId: p.id,
      productName: p.name,
      quantity: line.quantity,
      unitPrice: toNumber(p.price),
      productImageSnapshot:
        Array.isArray(p.images) && p.images.length > 0 && typeof p.images[0] === "string" && p.images[0].trim()
          ? p.images[0].trim()
          : null,
    });
  }

  return lines;
}

export async function computeCheckoutTotals(items: Array<{ productId: string; quantity: number }>) {
  return prisma.$transaction(async (tx: Prisma.TransactionClient) => {
    const lines = await buildCheckoutLines(tx, items);
    const totalInr = lines.reduce((sum, l) => sum + l.unitPrice * l.quantity, 0);
    const amountPaise = Math.max(100, Math.round(totalInr * 100));
    return { lines, totalInr, amountPaise };
  });
}

export async function createOrderFromCheckout(input: {
  customerUserId?: string;
  customerName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  pincode: string;
  paymentMethod: string;
  items: Array<{ productId: string; quantity: number }>;
}) {
  return prisma.$transaction(async (tx: Prisma.TransactionClient) => {
    const lines = await buildCheckoutLines(tx, input.items);

    const total = lines.reduce((sum, l) => sum + l.unitPrice * l.quantity, 0);

    const order = await tx.order.create({
      data: {
        orderNumber: nextOrderNumber(),
        customerUserId: input.customerUserId,
        customerName: input.customerName,
        email: input.email,
        phone: input.phone,
        address: input.address,
        city: input.city,
        pincode: input.pincode,
        total,
        paymentMethod: input.paymentMethod,
        items: {
          create: lines.map((l) => ({
            productId: l.productId,
            productName: l.productName,
            quantity: l.quantity,
            price: l.unitPrice,
            productImageSnapshot: l.productImageSnapshot,
          })),
        },
      },
      include: orderIncludeItemsWithProduct,
    });

    for (const l of lines) {
      await tx.product.update({
        where: { id: l.productId },
        data: { stock: { decrement: l.quantity } },
      });
    }

    return mapOrder(order);
  });
}

export async function listOrdersForCustomer(customer: { id: string; email: string }) {
  const rows = await prisma.order.findMany({
    where: {
      OR: [{ customerUserId: customer.id }, { email: customer.email }],
    },
    orderBy: { createdAt: "desc" },
    include: orderIncludeItemsWithProduct,
  });
  return rows.map(mapOrder);
}

export async function listOrdersAdmin() {
  const rows = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    include: orderIncludeItemsWithProduct,
  });
  return rows.map(mapOrder);
}

export async function getOrderAdmin(id: string) {
  const o = await prisma.order.findFirst({
    where: { OR: [{ id }, { orderNumber: id }] },
    include: orderIncludeItemsWithProduct,
  });
  if (!o) throw new HttpError(404, "Order not found");
  return mapOrder(o);
}

export async function updateOrderStatusAdmin(id: string, status: OrderStatusValue) {
  const existing = await prisma.order.findFirst({
    where: { OR: [{ id }, { orderNumber: id }] },
  });
  if (!existing) throw new HttpError(404, "Order not found");
  const o = await prisma.order.update({
    where: { id: existing.id },
    data: { status },
    include: orderIncludeItemsWithProduct,
  });
  return mapOrder(o);
}

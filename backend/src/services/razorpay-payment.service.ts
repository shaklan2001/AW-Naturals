import { createHmac, timingSafeEqual } from "node:crypto";
import { HttpError } from "../middleware/error-handler.js";
import { computeCheckoutTotals, createOrderFromCheckout } from "./order.service.js";

function getRazorpayCredentials(): { keyId: string; keySecret: string } {
  const keyId = process.env.RAZORPAY_KEY_ID?.trim();
  const keySecret = process.env.RAZORPAY_KEY_SECRET?.trim();
  if (!keyId || !keySecret) {
    throw new HttpError(503, "Razorpay is not configured on the server.");
  }
  return { keyId, keySecret };
}

function basicAuthHeader(keyId: string, keySecret: string): string {
  return `Basic ${Buffer.from(`${keyId}:${keySecret}`).toString("base64")}`;
}

type RazorpayOrderApi = { id: string; amount: number; currency: string; status: string };

async function razorpayFetch<T>(
  path: string,
  init: { method: "GET" | "POST"; body?: string }
): Promise<T> {
  const { keyId, keySecret } = getRazorpayCredentials();
  const headers: Record<string, string> = {
    Authorization: basicAuthHeader(keyId, keySecret),
  };
  if (init.body != null) {
    headers["Content-Type"] = "application/json";
  }
  const res = await fetch(`https://api.razorpay.com/v1${path}`, {
    method: init.method,
    headers,
    body: init.body,
  });
  const text = await res.text();
  const data = text ? (JSON.parse(text) as unknown) : null;
  if (!res.ok) {
    const err = data as { error?: { description?: string; code?: string } } | null;
    const msg = err?.error?.description ?? `Razorpay API error (${res.status})`;
    throw new HttpError(502, msg);
  }
  return data as T;
}

export async function createRazorpayOrderForCheckout(input: {
  customerUserId?: string;
  customerName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  pincode: string;
  items: Array<{ productId: string; quantity: number }>;
}): Promise<{ keyId: string; orderId: string; amount: number; currency: string }> {
  const { keyId } = getRazorpayCredentials();
  const { amountPaise } = await computeCheckoutTotals(input.items);

  const receipt = `aw_${Date.now().toString(36)}`;
  const order = await razorpayFetch<RazorpayOrderApi>("/orders", {
    method: "POST",
    body: JSON.stringify({
      amount: amountPaise,
      currency: "INR",
      receipt,
      notes: {
        email: input.email.slice(0, 200),
      },
    }),
  });

  if (Number(order.amount) !== amountPaise || order.currency !== "INR") {
    throw new HttpError(500, "Unexpected Razorpay order response.");
  }

  return {
    keyId,
    orderId: order.id,
    amount: order.amount,
    currency: order.currency,
  };
}

function verifySignature(orderId: string, paymentId: string, signature: string, secret: string): boolean {
  const body = `${orderId}|${paymentId}`;
  const expected = createHmac("sha256", secret).update(body).digest("hex");
  try {
    const a = Buffer.from(expected, "utf8");
    const b = Buffer.from(signature, "utf8");
    return a.length === b.length && timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

export async function verifyRazorpayAndCreateOrder(input: {
  customerUserId?: string;
  customerName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  pincode: string;
  items: Array<{ productId: string; quantity: number }>;
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}) {
  const { keySecret } = getRazorpayCredentials();

  if (
    !verifySignature(
      input.razorpay_order_id,
      input.razorpay_payment_id,
      input.razorpay_signature,
      keySecret
    )
  ) {
    throw new HttpError(400, "Invalid payment signature.");
  }

  const rzOrder = await razorpayFetch<RazorpayOrderApi>(
    `/orders/${encodeURIComponent(input.razorpay_order_id)}`,
    { method: "GET" }
  );

  const { amountPaise } = await computeCheckoutTotals(input.items);
  const rzAmount = Number(rzOrder.amount);
  if (Number.isNaN(rzAmount) || rzAmount !== amountPaise) {
    throw new HttpError(400, "Payment amount does not match the current cart. Please start checkout again.");
  }

  return createOrderFromCheckout({
    customerUserId: input.customerUserId,
    customerName: input.customerName,
    email: input.email,
    phone: input.phone,
    address: input.address,
    city: input.city,
    pincode: input.pincode,
    paymentMethod: "Razorpay",
    items: input.items,
  });
}

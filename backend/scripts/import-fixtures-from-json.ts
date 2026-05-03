/**
 * Loads fixtures/playground-data.json (or path arg) into PostgreSQL via Prisma.
 * PostgreSQL has no single "import this JSON into many tables" — this script is the bridge.
 *
 * Usage:
 *   npx tsx scripts/import-fixtures-from-json.ts [path/to.json] [--wipe]
 *
 * Supports:
 *   - Legacy: root has siteSettings, products, blogs, orders
 *   - Combined: root has "database": { siteSettings, products, blogs, orders } (see fixtures/all-apis-and-database.json)
 *
 * --wipe  Deletes existing orders, order lines, blogs, products (not migrations), then imports.
 */

import "dotenv/config";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import {
  PrismaClient,
  ProductStatus,
  BlogStatus,
  OrderStatus,
  type Prisma,
} from "@prisma/client";

const prisma = new PrismaClient();

type FixtureFile = {
  _meta?: unknown;
  siteSettings: {
    id: string;
    siteName: string;
    siteUrl: string;
    logo?: string;
    tagline: string;
    socialLinks: {
      instagram?: string;
      facebook?: string;
      twitter?: string;
      youtube?: string;
    };
  };
  products: Array<{
    id: string;
    name: string;
    description: string;
    benefit?: string | null;
    price: number;
    category: string;
    stock: number;
    status: keyof typeof ProductStatus;
    images: string[];
  }>;
  blogs: Array<{
    id: string;
    title: string;
    slug: string;
    author: string;
    category: string;
    coverImage: string;
    content: string;
    seoTitle: string;
    seoDescription: string;
    status: keyof typeof BlogStatus;
  }>;
  orders: Array<{
    orderNumber: string;
    customerName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    pincode: string;
    status: keyof typeof OrderStatus;
    paymentMethod: string;
    items: Array<{
      productId: string;
      productName: string;
      quantity: number;
      price: number;
    }>;
  }>;
};

function parseArgs() {
  const args = process.argv.slice(2);
  const wipe = args.includes("--wipe");
  const pathArg = args.find((a) => !a.startsWith("--"));
  return {
    wipe,
    file: resolve(process.cwd(), pathArg ?? "fixtures/all-apis-and-database.json"),
  };
}

function extractFixture(
  parsed: unknown
): FixtureFile {
  if (parsed === null || typeof parsed !== "object") {
    throw new Error("Invalid JSON: expected object");
  }
  const root = parsed as Record<string, unknown>;
  if (
    "database" in root &&
    root.database !== null &&
    typeof root.database === "object"
  ) {
    const d = root.database as Record<string, unknown>;
    return {
      siteSettings: d.siteSettings as FixtureFile["siteSettings"],
      products: d.products as FixtureFile["products"],
      blogs: d.blogs as FixtureFile["blogs"],
      orders: d.orders as FixtureFile["orders"],
    };
  }
  return parsed as FixtureFile;
}

function orderTotal(items: FixtureFile["orders"][0]["items"]) {
  return items.reduce((s, i) => s + i.price * i.quantity, 0);
}

async function main() {
  const { wipe, file } = parseArgs();
  const raw = extractFixture(JSON.parse(readFileSync(file, "utf8")));

  await prisma.$transaction(async (tx) => {
    if (wipe) {
      await tx.orderItem.deleteMany();
      await tx.order.deleteMany();
      await tx.blog.deleteMany();
      await tx.product.deleteMany();
    }

    const s = raw.siteSettings;
    await tx.siteSettings.upsert({
      where: { id: s.id },
      create: {
        id: s.id,
        siteName: s.siteName,
        siteUrl: s.siteUrl,
        logo: s.logo ?? "",
        tagline: s.tagline,
        instagram: s.socialLinks.instagram ?? "",
        facebook: s.socialLinks.facebook ?? "",
        twitter: s.socialLinks.twitter ?? "",
        youtube: s.socialLinks.youtube ?? "",
      },
      update: {
        siteName: s.siteName,
        siteUrl: s.siteUrl,
        logo: s.logo ?? "",
        tagline: s.tagline,
        instagram: s.socialLinks.instagram ?? "",
        facebook: s.socialLinks.facebook ?? "",
        twitter: s.socialLinks.twitter ?? "",
        youtube: s.socialLinks.youtube ?? "",
      },
    });

    for (const p of raw.products) {
      await tx.product.upsert({
        where: { id: p.id },
        create: {
          id: p.id,
          name: p.name,
          description: p.description,
          benefit: p.benefit ?? null,
          price: p.price,
          category: p.category,
          stock: p.stock,
          status: ProductStatus[p.status],
          images: p.images,
        },
        update: {
          name: p.name,
          description: p.description,
          benefit: p.benefit ?? null,
          price: p.price,
          category: p.category,
          stock: p.stock,
          status: ProductStatus[p.status],
          images: p.images,
        },
      });
    }

    for (const b of raw.blogs) {
      await tx.blog.upsert({
        where: { id: b.id },
        create: {
          id: b.id,
          title: b.title,
          slug: b.slug,
          author: b.author,
          category: b.category,
          coverImage: b.coverImage,
          content: b.content,
          seoTitle: b.seoTitle,
          seoDescription: b.seoDescription,
          status: BlogStatus[b.status],
        },
        update: {
          title: b.title,
          slug: b.slug,
          author: b.author,
          category: b.category,
          coverImage: b.coverImage,
          content: b.content,
          seoTitle: b.seoTitle,
          seoDescription: b.seoDescription,
          status: BlogStatus[b.status],
        },
      });
    }

    for (const o of raw.orders) {
      const total = orderTotal(o.items);
      const createData: Prisma.OrderCreateInput = {
        orderNumber: o.orderNumber,
        customerName: o.customerName,
        email: o.email,
        phone: o.phone,
        address: o.address,
        city: o.city,
        pincode: o.pincode,
        total,
        status: OrderStatus[o.status],
        paymentMethod: o.paymentMethod,
        items: {
          create: o.items.map((i) => ({
            productId: i.productId,
            productName: i.productName,
            quantity: i.quantity,
            price: i.price,
          })),
        },
      };

      const existing = await tx.order.findUnique({
        where: { orderNumber: o.orderNumber },
      });
      if (existing) {
        await tx.orderItem.deleteMany({ where: { orderId: existing.id } });
        await tx.order.delete({ where: { id: existing.id } });
      }
      await tx.order.create({ data: createData });
    }
  });

  console.log(`Imported fixtures from ${file}${wipe ? " (wiped orders/products/blogs first)" : ""}`);
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });

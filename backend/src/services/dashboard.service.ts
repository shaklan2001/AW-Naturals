import { prisma } from "../lib/prisma.js";
import { toNumber } from "../utils/money.js";

export async function getDashboardStats() {
  const [totalOrders, totalProducts, totalBlogs, deliveredOrders, lowStockCount] = await Promise.all([
    prisma.order.count(),
    prisma.product.count(),
    prisma.blog.count(),
    prisma.order.findMany({
      where: { status: "delivered" },
      select: { total: true },
    }),
    prisma.product.count({
      where: { stock: { lte: 10 }, status: "active" },
    }),
  ]);

  const revenue = deliveredOrders.reduce(
    (sum: number, o: { total: unknown }) => sum + toNumber(o.total),
    0
  );

  return {
    totalOrders,
    totalProducts,
    totalBlogs,
    revenue,
    lowInventory: lowStockCount,
    publishedBlogs: await prisma.blog.count({ where: { status: "published" } }),
    activeProducts: await prisma.product.count({ where: { status: "active" } }),
  };
}

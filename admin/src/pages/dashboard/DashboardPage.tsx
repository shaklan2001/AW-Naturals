import { Link } from "react-router-dom";
import {
  ShoppingCart,
  ShoppingBag,
  BookOpen,
  DollarSign,
  AlertTriangle,
  ArrowUpRight,
  TrendingUp,
  ClipboardList,
  PenSquare,
} from "lucide-react";
import { StatMiniChart } from "./StatMiniChart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAdminBlogs, useAdminOrders, useDashboardStats } from "@/hooks/use-admin-queries";
import { useAdminStore } from "@/store/useAdminStore";
import { formatCurrency, formatDate } from "@/utils/cn";

const statusVariant = (status: string) => {
  const map: Record<string, "default" | "secondary" | "destructive" | "success" | "warning" | "outline"> = {
    pending: "warning",
    processing: "default",
    shipped: "secondary",
    delivered: "success",
    cancelled: "destructive",
  };
  return map[status] ?? "secondary";
};

export function DashboardPage() {
  const profileName = useAdminStore((s) => s.profile.name);
  const statsQ = useDashboardStats();
  const ordersQ = useAdminOrders();
  const blogsQ = useAdminBlogs();

  const statsData = statsQ.data;
  const orders = ordersQ.data ?? [];
  const blogs = blogsQ.data ?? [];

  const recentOrders = [...orders]
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .slice(0, 5);
  const recentBlogs = [...blogs]
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .slice(0, 3);

  const pendingCount = orders.filter((o) => o.status === "pending").length;

  const stats = statsData
    ? [
        {
          title: "Total orders",
          value: statsData.totalOrders,
          icon: ShoppingCart,
          sub: `${pendingCount} pending`,
          color: "text-[#2065d1]",
          stroke: "#2065D1",
          bg: "bg-[rgba(32,101,209,0.08)]",
          trend: "+12%",
          sparkTrend: "up" as const,
        },
        {
          title: "Total products",
          value: statsData.totalProducts,
          icon: ShoppingBag,
          sub: `${statsData.activeProducts} active`,
          color: "text-[#7635dc]",
          stroke: "#7635DC",
          bg: "bg-[rgba(118,53,220,0.08)]",
          trend: "+4%",
          sparkTrend: "up" as const,
        },
        {
          title: "Total blogs",
          value: statsData.totalBlogs,
          icon: BookOpen,
          sub: `${statsData.publishedBlogs} published`,
          color: "text-[#b76e00]",
          stroke: "#B76E00",
          bg: "bg-[rgba(183,110,0,0.08)]",
          trend: "+2",
          sparkTrend: "flat" as const,
        },
        {
          title: "Revenue",
          value: formatCurrency(statsData.revenue),
          icon: DollarSign,
          sub: "From delivered orders",
          color: "text-[#00a76f]",
          stroke: "#00A76F",
          bg: "bg-[rgba(0,167,111,0.08)]",
          trend: "+18%",
          sparkTrend: "up" as const,
        },
        {
          title: "Low inventory",
          value: statsData.lowInventory,
          icon: AlertTriangle,
          sub: "Active products ≤ 10 units",
          color: "text-[#ff5630]",
          stroke: "#FF5630",
          bg: "bg-[rgba(255,86,48,0.08)]",
          trend: "Alert",
          sparkTrend: "down" as const,
        },
      ]
    : [];

  if (statsQ.isLoading || ordersQ.isLoading || blogsQ.isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 w-64 max-w-full rounded-lg bg-[rgba(145,158,171,0.16)]" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-28 rounded-2xl bg-[rgba(145,158,171,0.12)]" />
          ))}
        </div>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="h-64 rounded-2xl bg-[rgba(145,158,171,0.12)] lg:col-span-2" />
          <div className="h-64 rounded-2xl bg-[rgba(145,158,171,0.12)]" />
        </div>
      </div>
    );
  }

  if (statsQ.isError) {
    return (
      <div className="rounded-2xl border border-[rgba(255,86,48,0.24)] bg-[rgba(255,86,48,0.06)] px-4 py-3 text-sm text-[#b71d18]">
        {statsQ.error.message} Sign in again with email and password, or paste a valid bearer under Settings → API
        access.
      </div>
    );
  }

  const lowKey = "Low inventory";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-[#212b36]">
          Welcome back{profileName ? `, ${profileName.split(" ")[0]}` : ""}
        </h1>
        <p className="mt-1 text-sm text-[#637381]">Here is what is happening across your store today.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <Card key={s.title} className="transition-shadow hover:shadow-[var(--minimal-shadow-card)]">
              <CardContent className="pb-5 pt-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold uppercase tracking-wide text-[#637381]">{s.title}</p>
                    <p className="mt-1 text-2xl font-bold tracking-tight text-[#212b36]">{s.value}</p>
                    <p className="mt-1 text-xs text-[#919eab]">{s.sub}</p>
                  </div>
                  <div className="flex shrink-0 flex-col items-end gap-2">
                    <div
                      className={`rounded-xl bg-[radial-gradient(rgba(145,158,171,0.14)_1px,transparent_1px)] bg-[length:10px_10px] p-2.5 ${s.bg}`}
                    >
                      <Icon className={`h-5 w-5 ${s.color}`} />
                    </div>
                    <StatMiniChart color={s.stroke} seriesKey={s.title} trend={s.sparkTrend} />
                  </div>
                </div>
                <div className="mt-3 flex items-center gap-1 border-t border-[rgba(145,158,171,0.12)] pt-3">
                  {s.title !== lowKey ? (
                    <TrendingUp className="h-3 w-3 text-[#00a76f]" />
                  ) : (
                    <AlertTriangle className="h-3 w-3 text-[#ff5630]" />
                  )}
                  <span
                    className={`text-xs font-semibold ${s.title !== lowKey ? "text-[#00a76f]" : "text-[#ff5630]"}`}
                  >
                    {s.trend}
                  </span>
                  {s.title !== lowKey && <span className="text-xs text-[#919eab]">vs last month</span>}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between gap-3">
              <CardTitle>Recent orders</CardTitle>
              <Link
                to="/orders"
                className="flex items-center gap-1 text-xs font-semibold text-[#00a76f] hover:text-[#007867]"
              >
                View all <ArrowUpRight className="h-3 w-3" />
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentOrders.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-[rgba(145,158,171,0.28)] bg-[rgba(145,158,171,0.04)] px-5 py-8 text-center">
                  <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-[rgba(145,158,171,0.14)]">
                    <ClipboardList className="h-5 w-5 text-[#637381]" />
                  </div>
                  <p className="text-sm font-semibold text-[#212b36]">No orders yet</p>
                  <p className="mt-1 text-xs text-[#919eab]">
                    New customer orders will appear here automatically.
                  </p>
                  <Link
                    to="/products"
                    className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-[#00a76f] hover:text-[#007867]"
                  >
                    Add products to start selling <ArrowUpRight className="h-3 w-3" />
                  </Link>
                </div>
              ) : (
                recentOrders.map((order) => (
                  <div
                    key={order.id}
                    className="flex items-center justify-between border-b border-[rgba(145,158,171,0.12)] py-2 last:border-0"
                  >
                    <div className="min-w-0">
                      <div className="truncate text-sm font-semibold text-[#212b36]">{order.customerName}</div>
                      <div className="text-xs text-[#919eab]">
                        {order.id} · {formatDate(order.createdAt)}
                      </div>
                    </div>
                    <div className="flex shrink-0 items-center gap-3">
                      <Badge variant={statusVariant(order.status)} className="capitalize">
                        {order.status}
                      </Badge>
                      <span className="text-sm font-bold text-[#212b36]">{formatCurrency(order.total)}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between gap-3">
              <CardTitle>Recent blogs</CardTitle>
              <Link
                to="/blog"
                className="flex items-center gap-1 text-xs font-semibold text-[#00a76f] hover:text-[#007867]"
              >
                View all <ArrowUpRight className="h-3 w-3" />
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentBlogs.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-[rgba(145,158,171,0.28)] bg-[rgba(145,158,171,0.04)] px-5 py-8 text-center">
                  <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-[rgba(145,158,171,0.14)]">
                    <PenSquare className="h-5 w-5 text-[#637381]" />
                  </div>
                  <p className="text-sm font-semibold text-[#212b36]">No blog posts yet</p>
                  <p className="mt-1 text-xs text-[#919eab]">Publish your first article to fill this panel.</p>
                </div>
              ) : (
                recentBlogs.map((blog) => (
                  <div key={blog.id} className="flex gap-3">
                    <img
                      src={blog.coverImage}
                      alt={blog.title}
                      className="h-12 w-12 shrink-0 rounded-xl object-cover ring-1 ring-[rgba(145,158,171,0.12)]"
                      onError={(e) => {
                        e.currentTarget.src = "https://via.placeholder.com/48";
                      }}
                    />
                    <div className="min-w-0">
                      <div className="truncate text-sm font-semibold text-[#212b36]">{blog.title}</div>
                      <div className="mt-0.5 text-xs text-[#919eab]">
                        {blog.author} · {formatDate(blog.createdAt)}
                      </div>
                      <Badge
                        variant={blog.status === "published" ? "success" : "secondary"}
                        className="mt-1 capitalize"
                      >
                        {blog.status}
                      </Badge>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

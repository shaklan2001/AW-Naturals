import { useEffect, useState } from "react";
import { Package } from "lucide-react";
import { SectionWrapper } from "../../components/SectionWrapper";
import { GlassCard } from "@/shared/components/GlassCard";
import { Button } from "../../components/ui/button";
import { fetchCustomerOrders, type CustomerOrderApi } from "../../api/customer-auth-api";
import { useCustomerAuth } from "../../context/CustomerAuthContext";
import { formatOrderStatusLabel } from "../../utils/orderStatusLabel";

const inrFormatter = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 });

const dateFormatter = new Intl.DateTimeFormat("en-IN", {
  day: "numeric",
  month: "short",
  year: "numeric",
});

export function OrderHistoryPage() {
  const { isAuthenticated, openAuthModal } = useCustomerAuth();
  const [orders, setOrders] = useState<CustomerOrderApi[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      setLoading(false);
      return;
    }
    setLoading(true);
    (async () => {
      try {
        const data = await fetchCustomerOrders();
        setOrders(data);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Could not load orders");
      } finally {
        setLoading(false);
      }
    })();
  }, [isAuthenticated]);

  return (
    <div className="min-h-screen bg-[#0B0B0B] pb-20 pt-28 text-[#F5F5DC]">
      <SectionWrapper className="max-w-5xl">
        <h1 className="mb-6 font-['Gloock'] text-4xl tracking-tight">Order History</h1>
        <GlassCard className="p-7 md:p-9" hoverEffect={false}>
          {!isAuthenticated ? (
            <div className="text-center">
              <p className="font-['Inter'] text-[#0b0b0b]/80">
                Sign in to see orders linked to your account. Guest checkout orders may not appear here.
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-3">
                <Button
                  type="button"
                  className="rounded-full bg-gradient-to-r from-[#D4AF37] to-[#b8860b] px-8 text-[#0b0b0b]"
                  onClick={() => openAuthModal("login")}
                >
                  Sign in
                </Button>
              </div>
            </div>
          ) : null}
          {isAuthenticated && loading ? <p className="text-[#0b0b0b]/70">Loading your orders...</p> : null}
          {isAuthenticated && error ? <p className="text-red-700">{error}</p> : null}
          {isAuthenticated && !loading && !error && orders.length === 0 ? (
            <p className="text-[#0b0b0b]/70">No orders yet. Your placed orders will appear here.</p>
          ) : null}
          {isAuthenticated && !loading && !error && orders.length > 0 ? (
            <div className="space-y-5">
              {orders.map((order) => {
                const orderDate = (() => {
                  try {
                    return dateFormatter.format(new Date(`${order.createdAt}T12:00:00`));
                  } catch {
                    return order.createdAt;
                  }
                })();
                return (
                  <div
                    key={order.id}
                    className="rounded-2xl border border-[rgba(180,155,80,0.28)] bg-white/35 p-4 text-[#0b0b0b] md:p-5"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <p className="font-['Inter'] text-sm font-semibold tracking-tight">{order.id}</p>
                        <p className="mt-0.5 font-['Inter'] text-xs text-[#0b0b0b]/60">{orderDate}</p>
                      </div>
                      <span className="rounded-full bg-[#fff4d8] px-3 py-1.5 font-['Inter'] text-xs font-medium text-[#0b0b0b]">
                        {formatOrderStatusLabel(order.status)}
                      </span>
                    </div>
                    <ul className="mt-4 space-y-3 border-t border-[#0b0b0b]/[0.08] pt-4">
                      {order.items.map((item) => (
                        <li
                          key={`${order.id}-${item.productId}-${item.productName}`}
                          className="flex items-center gap-3 text-sm"
                        >
                          {item.productImage ? (
                            <img
                              src={item.productImage}
                              alt={item.productName}
                              className="h-16 w-16 shrink-0 rounded-xl object-cover ring-1 ring-[#0b0b0b]/10"
                            />
                          ) : (
                            <div
                              className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-[#0b0b0b]/[0.06] text-[#0b0b0b]/35 ring-1 ring-[#0b0b0b]/10"
                              aria-hidden
                            >
                              <Package className="h-6 w-6" strokeWidth={1.25} />
                            </div>
                          )}
                          <div className="min-w-0 flex-1">
                            <p className="font-['Inter'] font-medium leading-snug text-[#0b0b0b]">
                              {item.productName}
                            </p>
                            <p className="mt-0.5 font-['Inter'] text-xs text-[#0b0b0b]/55">
                              Qty {item.quantity} · {inrFormatter.format(item.price)} each
                            </p>
                          </div>
                        </li>
                      ))}
                    </ul>
                    <p className="mt-4 border-t border-[#0b0b0b]/[0.08] pt-3 text-right font-['Inter'] text-sm font-semibold">
                      Total {inrFormatter.format(order.total)}
                    </p>
                  </div>
                );
              })}
            </div>
          ) : null}
        </GlassCard>
      </SectionWrapper>
    </div>
  );
}

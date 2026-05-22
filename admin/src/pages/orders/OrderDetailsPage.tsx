import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, MapPin, Phone, Mail, CreditCard, Package, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAdminOrder, useUpdateOrderStatus } from "@/hooks/use-admin-queries";
import { formatCurrency, formatDate } from "@/utils/cn";
import type { OrderStatus } from "@/types";

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

const TIMELINE: OrderStatus[] = ["pending", "processing", "shipped", "delivered"];

export function OrderDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const orderQ = useAdminOrder(id);
  const updateStatus = useUpdateOrderStatus();

  const order = orderQ.data;

  if (orderQ.isLoading) {
    return (
      <div className="flex items-center gap-2 text-gray-500 text-sm py-24 justify-center">
        <Loader2 className="w-5 h-5 animate-spin" /> Loading order…
      </div>
    );
  }

  if (orderQ.isError || !order) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <Package className="w-12 h-12 text-gray-300" />
        <p className="text-gray-500">{orderQ.isError ? orderQ.error.message : "Order not found"}</p>
        <Button variant="outline" onClick={() => navigate("/orders")}>
          Go back
        </Button>
      </div>
    );
  }

  const timelineIndex = TIMELINE.indexOf(order.status as OrderStatus);

  return (
    <div className="space-y-5 max-w-4xl">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate("/orders")}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div>
          <h2 className="text-xl font-bold tracking-tight text-[#212b36]">Order {order.id}</h2>
          <p className="text-sm text-gray-400">Placed on {formatDate(order.createdAt)}</p>
        </div>
        <div className="ml-auto">
          <Badge variant={statusVariant(order.status)} className="capitalize text-sm px-3 py-1">
            {order.status}
          </Badge>
        </div>
      </div>

      {order.status !== "cancelled" && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Order Timeline</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-0">
              {TIMELINE.map((step, i) => (
                <div key={step} className="flex items-center flex-1">
                  <div className="flex flex-col items-center gap-1">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${i <= timelineIndex ? "bg-green-500 text-white" : "bg-gray-100 text-gray-400"}`}
                    >
                      {i + 1}
                    </div>
                    <span className="text-xs capitalize text-gray-500">{step}</span>
                  </div>
                  {i < TIMELINE.length - 1 && (
                    <div
                      className={`h-1 flex-1 mx-1 rounded transition-colors ${i < timelineIndex ? "bg-green-400" : "bg-gray-100"}`}
                    />
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Customer</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-2 text-sm">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white font-bold text-xs">
                {order.customerName[0]}
              </div>
              <span className="font-medium text-gray-900">{order.customerName}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Mail className="w-3.5 h-3.5" /> {order.email}
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Phone className="w-3.5 h-3.5" /> {order.phone}
            </div>
            <div className="flex items-start gap-2 text-sm text-gray-500">
              <MapPin className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
              <span>
                {order.address}, {order.city} - {order.pincode}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Payment</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-2 text-sm">
              <CreditCard className="w-4 h-4 text-gray-400" />
              <span className="text-gray-700">{order.paymentMethod}</span>
            </div>
            <div className="pt-2 border-t border-gray-50">
              <div className="flex justify-between text-sm text-gray-500">
                <span>Subtotal</span>
                <span>{formatCurrency(order.total)}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-500 mt-1">
                <span>Shipping</span>
                <span>Free</span>
              </div>
              <div className="flex justify-between text-base font-bold text-gray-900 mt-2 pt-2 border-t border-gray-50">
                <span>Total</span>
                <span>{formatCurrency(order.total)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Update Status</CardTitle>
          </CardHeader>
          <CardContent>
            <Select
              value={order.status}
              disabled={updateStatus.isPending}
              onValueChange={(v) => updateStatus.mutate({ id: order.id, status: v as OrderStatus })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
                <SelectItem value="shipped">Shipped</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Order Items</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {order.items.map((item, i) => (
              <div
                key={i}
                className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0"
              >
                <div>
                  <div className="text-sm font-medium text-gray-900">{item.productName}</div>
                  <div className="text-xs text-gray-400">
                    Qty: {item.quantity} × {formatCurrency(item.price)}
                  </div>
                </div>
                <span className="font-semibold text-gray-900">
                  {formatCurrency(item.price * item.quantity)}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

import { useNavigate } from "react-router-dom";
import { type ColumnDef } from "@tanstack/react-table";
import { Eye, Loader2 } from "lucide-react";
import { DataTable } from "@/components/tables/DataTable";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAdminOrders } from "@/hooks/use-admin-queries";
import { formatCurrency, formatDate } from "@/utils/cn";
import type { Order } from "@/types";

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

export function OrdersPage() {
  const { data: orders = [], isLoading, isError, error, refetch } = useAdminOrders();
  const navigate = useNavigate();

  const columns: ColumnDef<Order>[] = [
    {
      accessorKey: "id",
      header: "Order ID",
      cell: ({ row }) => (
        <span className="font-mono text-xs text-gray-700">{row.original.id}</span>
      ),
    },
    {
      accessorKey: "customerName",
      header: "Customer",
      cell: ({ row }) => (
        <div>
          <div className="font-medium text-gray-900 text-sm">{row.original.customerName}</div>
          <div className="text-xs text-gray-400">{row.original.email}</div>
        </div>
      ),
    },
    {
      id: "product",
      header: "Items",
      cell: ({ row }) => (
        <div className="text-sm text-gray-700">
          {row.original.items.map((i, idx) => (
            <div key={idx}>
              {i.productName} × {i.quantity}
            </div>
          ))}
        </div>
      ),
    },
    {
      accessorKey: "total",
      header: "Amount",
      cell: ({ row }) => (
        <span className="font-semibold text-gray-900">{formatCurrency(row.original.total)}</span>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <Badge variant={statusVariant(row.original.status)} className="capitalize">
          {row.original.status}
        </Badge>
      ),
    },
    {
      accessorKey: "createdAt",
      header: "Date",
      cell: ({ row }) => <span className="text-xs text-gray-400">{formatDate(row.original.createdAt)}</span>,
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <Button variant="ghost" size="icon" onClick={() => navigate(`/orders/${row.original.id}`)}>
          <Eye className="w-4 h-4 text-gray-500" />
        </Button>
      ),
    },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 text-gray-500 text-sm py-12 justify-center">
        <Loader2 className="w-5 h-5 animate-spin" /> Loading orders…
      </div>
    );
  }

  if (isError) {
    return (
      <div className="space-y-3">
        <p className="text-sm text-red-600">{error.message}</p>
        <Button variant="outline" size="sm" onClick={() => refetch()}>
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-bold tracking-tight text-[#212b36]">Orders</h2>
        <p className="text-sm text-gray-500">{orders.length} total orders</p>
      </div>
      <DataTable
        columns={columns}
        data={orders}
        searchKey="customerName"
        searchPlaceholder="Search by customer..."
      />
    </div>
  );
}

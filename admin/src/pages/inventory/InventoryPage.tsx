import { type ColumnDef } from "@tanstack/react-table";
import { Minus, Plus, AlertTriangle, Package, Loader2 } from "lucide-react";
import { DataTable } from "@/components/tables/DataTable";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAdminProducts, useUpdateProduct } from "@/hooks/use-admin-queries";
import type { Product } from "@/types";

export function InventoryPage() {
  const { data: products = [], isLoading, isError, error, refetch } = useAdminProducts();
  const updateProduct = useUpdateProduct();

  const lowStock = products.filter((p) => p.stock <= 10).length;
  const outOfStock = products.filter((p) => p.stock === 0).length;

  const adj = (id: string, delta: number) => {
    const current = products.find((p) => p.id === id)?.stock ?? 0;
    const newVal = Math.max(0, current + delta);
    updateProduct.mutate({ id, body: { stock: newVal } });
  };

  const columns: ColumnDef<Product>[] = [
    {
      accessorKey: "name",
      header: "Product",
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          {row.original.images[0] ? (
            <img
              src={row.original.images[0]}
              alt={row.original.name}
              className="w-9 h-9 rounded-lg object-cover border border-gray-100"
            />
          ) : (
            <div className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center">
              <Package className="w-4 h-4 text-gray-400" />
            </div>
          )}
          <div>
            <div className="font-medium text-sm text-gray-900">{row.original.name}</div>
            <div className="text-xs text-gray-400">{row.original.category}</div>
          </div>
        </div>
      ),
    },
    {
      accessorKey: "stock",
      header: "Stock",
      cell: ({ row }) => {
        const s = row.original.stock;
        return (
          <div className="flex items-center gap-2">
            {s === 0 && <AlertTriangle className="w-3.5 h-3.5 text-red-500" />}
            <span
              className={`text-sm font-semibold ${s === 0 ? "text-red-600" : s <= 10 ? "text-amber-600" : "text-gray-900"}`}
            >
              {s} units
            </span>
          </div>
        );
      },
    },
    {
      id: "status",
      header: "Health",
      cell: ({ row }) => {
        const s = row.original.stock;
        if (s === 0) return <Badge variant="destructive">Out of Stock</Badge>;
        if (s <= 10) return <Badge variant="warning">Low Stock</Badge>;
        return <Badge variant="success">In Stock</Badge>;
      },
    },
    {
      id: "adjust",
      header: "Adjust",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            className="h-7 w-7"
            disabled={updateProduct.isPending}
            onClick={() => adj(row.original.id, -1)}
          >
            <Minus className="h-3 w-3" />
          </Button>
          <span className="text-sm font-medium w-8 text-center">{row.original.stock}</span>
          <Button
            variant="outline"
            size="icon"
            className="h-7 w-7"
            disabled={updateProduct.isPending}
            onClick={() => adj(row.original.id, 1)}
          >
            <Plus className="h-3 w-3" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="h-7 text-xs"
            disabled={updateProduct.isPending}
            onClick={() => adj(row.original.id, 10)}
          >
            +10
          </Button>
        </div>
      ),
    },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 text-gray-500 text-sm py-12 justify-center">
        <Loader2 className="w-5 h-5 animate-spin" /> Loading inventory…
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
        <h2 className="text-xl font-bold tracking-tight text-[#212b36]">Inventory</h2>
        <p className="text-sm text-gray-500">Manage stock levels for all products</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-5">
            <div className="text-2xl font-bold text-gray-900">{products.length}</div>
            <div className="text-sm text-gray-500 mt-1">Total Products</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-5">
            <div className="text-2xl font-bold text-amber-600">{lowStock}</div>
            <div className="text-sm text-gray-500 mt-1">Low Stock (≤ 10)</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-5">
            <div className="text-2xl font-bold text-red-600">{outOfStock}</div>
            <div className="text-sm text-gray-500 mt-1">Out of Stock</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Stock Management</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={products}
            searchKey="name"
            searchPlaceholder="Search products..."
            enableSorting={false}
            getRowId={(p) => p.id}
          />
        </CardContent>
      </Card>
    </div>
  );
}

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod/v4";
import { type ColumnDef } from "@tanstack/react-table";
import { Pencil, Trash2, Plus, Package, Loader2 } from "lucide-react";
import { DataTable } from "@/components/tables/DataTable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  useAdminProducts,
  useCreateProduct,
  useDeleteProduct,
  useUpdateProduct,
} from "@/hooks/use-admin-queries";
import { AdminImageUploadField } from "@/components/forms/AdminImageUploadField";
import { formatCurrency } from "@/utils/cn";
import type { CreateProductInput, PatchProductBody } from "@/api/admin-api";
import type { Product } from "@/types";

function linesToPoints(raw: string | undefined): string[] {
  return (raw ?? "")
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);
}

function pointsToLines(arr: string[] | undefined | null): string {
  return (arr ?? []).join("\n");
}

/** Flatten stored points (may include newline-separated legacy rows) for comma-separated editing. */
function pointsToIngredientsCsv(arr: string[] | undefined | null): string {
  const parts: string[] = [];
  for (const item of arr ?? []) {
    parts.push(...item.split("\n").map((s) => s.trim()).filter(Boolean));
  }
  return parts.join(", ");
}

function commaToIngredients(raw: string | undefined): string[] {
  return (raw ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

const schema = z.object({
  name: z.string().min(2, "Name is required"),
  shortDescription: z.string().min(8, "Short description is required"),
  description: z.string().min(10, "Description is required"),
  benefit: z.string().optional(),
  price: z.number().min(1, "Price must be > 0"),
  category: z.string().min(1, "Category required"),
  stock: z.number().min(0),
  status: z.enum(["active", "draft", "archived", "upcoming"]),
  images: z.string().optional(),
  keyBenefitsLines: z.string().optional(),
  ingredientsCsv: z.string().optional(),
  clinicalNote: z.string().optional(),
  showClinicalNote: z.boolean().optional(),
});

type FormValues = z.infer<typeof schema>;

export function ProductsPage() {
  const { data: products = [], isLoading, isError, error, refetch } = useAdminProducts();
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();
  const deleteProduct = useDeleteProduct();

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { status: "active", stock: 0, showClinicalNote: false },
  });

  const statusValue = watch("status");

  const openAdd = () => {
    setEditing(null);
    reset({
      status: "active",
      stock: 0,
      name: "",
      shortDescription: "",
      description: "",
      benefit: "",
      price: 0,
      category: "",
      images: "",
      keyBenefitsLines: "",
      ingredientsCsv: "",
      clinicalNote: "",
      showClinicalNote: false,
    });
    setOpen(true);
  };

  const openEdit = (p: Product) => {
    setEditing(p);
    reset({
      name: p.name,
      shortDescription: p.shortDescription ?? "",
      description: p.description,
      benefit: p.benefit ?? "",
      price: p.price,
      category: p.category,
      stock: p.stock,
      status: p.status,
      images: p.images[0] ?? "",
      keyBenefitsLines: pointsToLines(p.keyBenefitsPoints),
      ingredientsCsv: pointsToIngredientsCsv(p.ingredientsPoints),
      clinicalNote: p.clinicalNote ?? "",
      showClinicalNote: p.showClinicalNote ?? false,
    });
    setOpen(true);
  };

  const onSubmit = async (data: FormValues) => {
    const images = data.images?.trim() ? [data.images.trim()] : [];
    const keyBenefitsPoints = linesToPoints(data.keyBenefitsLines);
    const ingredientsPoints = commaToIngredients(data.ingredientsCsv);
    const showClinicalNote = Boolean(data.showClinicalNote);
    const payload: CreateProductInput = {
      name: data.name,
      shortDescription: data.shortDescription,
      description: data.description,
      benefit: data.benefit?.trim() || undefined,
      price: data.price,
      category: data.category,
      stock: data.stock,
      status: data.status,
      images,
      keyBenefitsPoints,
      ingredientsPoints,
      clinicalNote: data.clinicalNote?.trim() || undefined,
      showClinicalNote,
    };
    try {
      if (editing) {
        const editBody: PatchProductBody = {
          ...payload,
          keyBenefitsPoints,
          ingredientsPoints,
          clinicalNote: data.clinicalNote?.trim() ? data.clinicalNote.trim() : null,
          showClinicalNote,
        };
        await updateProduct.mutateAsync({ id: editing.id, body: editBody });
      } else {
        await createProduct.mutateAsync(payload);
      }
      setOpen(false);
    } catch {
      /* toast could go here */
    }
  };

  const statusVariant = (status: string) => {
    if (status === "active") return "success";
    if (status === "draft") return "warning";
    if (status === "upcoming") return "default";
    return "secondary";
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
            <div className="font-medium text-gray-900 text-sm">{row.original.name}</div>
            <div className="text-xs text-gray-400">{row.original.category}</div>
          </div>
        </div>
      ),
    },
    {
      accessorKey: "price",
      header: "Price",
      cell: ({ row }) => <span className="font-medium">{formatCurrency(row.original.price)}</span>,
    },
    {
      accessorKey: "stock",
      header: "Stock",
      cell: ({ row }) => (
        <span
          className={`font-medium ${row.original.stock === 0 ? "text-red-600" : row.original.stock <= 10 ? "text-amber-600" : "text-gray-900"}`}
        >
          {row.original.stock === 0 ? "Out of stock" : row.original.stock}
        </span>
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
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => openEdit(row.original)}>
            <Pencil className="w-4 h-4 text-gray-500" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => setDeleteId(row.original.id)}>
            <Trash2 className="w-4 h-4 text-red-400" />
          </Button>
        </div>
      ),
    },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 text-gray-500 text-sm py-12 justify-center">
        <Loader2 className="w-5 h-5 animate-spin" /> Loading products…
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

  const saving = createProduct.isPending || updateProduct.isPending;

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-[#212b36]">Products</h2>
          <p className="text-sm text-gray-500">{products.length} total products</p>
        </div>
        <Button onClick={openAdd}>
          <Plus className="w-4 h-4 mr-2" /> Add Product
        </Button>
      </div>

      <DataTable columns={columns} data={products} searchKey="name" searchPlaceholder="Search products..." />

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[90vh] max-w-4xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Product" : "Add New Product"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2 space-y-1">
                <Label>Name</Label>
                <Input {...register("name")} placeholder="Product name" />
                {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
              </div>
              <div className="col-span-2 space-y-1">
                <Label>Short description (card)</Label>
                <Textarea
                  {...register("shortDescription")}
                  placeholder="Compact product line used on list cards"
                  rows={2}
                />
                {errors.shortDescription && (
                  <p className="text-xs text-red-500">{errors.shortDescription.message}</p>
                )}
              </div>
              <div className="col-span-2 space-y-1">
                <Label>Long description (detail page)</Label>
                <Textarea {...register("description")} placeholder="Full product description" rows={4} />
                {errors.description && (
                  <p className="text-xs text-red-500">{errors.description.message}</p>
                )}
              </div>
              <div className="col-span-2 space-y-1">
                <Label>Benefit badge (optional)</Label>
                <Input {...register("benefit")} placeholder="Short label on the product image, e.g. Deep Sleep" />
              </div>
              <div className="col-span-2 space-y-1">
                <Label>Key benefits</Label>
                <p className="text-xs leading-relaxed text-[#637381]">
                  One bullet per line. Shown on the product page as checklist pointers.
                </p>
                <Textarea
                  {...register("keyBenefitsLines")}
                  placeholder={"Supports mental clarity\nGentle daily ritual"}
                  rows={5}
                  className="mt-1 font-mono text-[13px] leading-relaxed"
                />
              </div>
              <div className="col-span-2 space-y-1">
                <Label>Ingredients</Label>
                <p className="text-xs leading-relaxed text-[#637381]">
                  Comma-separated ingredients. Shown as tags on the product page.
                </p>
                <Input
                  {...register("ingredientsCsv")}
                  placeholder="German chamomile, Lemon balm, Passionflower"
                  className="mt-1 font-mono text-[13px]"
                />
              </div>
              <div className="col-span-2 space-y-1">
                <Label>Clinical note</Label>
                <p className="text-xs leading-relaxed text-[#637381]">
                  Optional disclaimer text. It appears on the site only if you turn on “Show on product page” below.
                </p>
                <Textarea
                  {...register("clinicalNote")}
                  placeholder="Clinical or regulatory-style note for customers…"
                  rows={3}
                  className="mt-1 text-[13px] leading-relaxed"
                />
              </div>
              <div className="col-span-2 flex items-center gap-3 rounded-xl border border-[rgba(145,158,171,0.16)] bg-[#f4f6f8]/80 px-3 py-2.5">
                <input
                  id="showClinicalNote"
                  type="checkbox"
                  className="h-4 w-4 shrink-0 rounded border-[rgba(145,158,171,0.4)] text-[#00a76f] focus:ring-[#00a76f]/30"
                  {...register("showClinicalNote")}
                />
                <Label htmlFor="showClinicalNote" className="cursor-pointer font-normal leading-snug text-[#212b36]">
                  Show clinical note on product page
                </Label>
              </div>
              <div className="space-y-1">
                <Label>Price (₹)</Label>
                <Input type="number" {...register("price", { valueAsNumber: true })} placeholder="0" />
                {errors.price && <p className="text-xs text-red-500">{errors.price.message}</p>}
              </div>
              <div className="space-y-1">
                <Label>Stock</Label>
                <Input type="number" {...register("stock", { valueAsNumber: true })} placeholder="0" />
              </div>
              <div className="space-y-1">
                <Label>Category</Label>
                <Input {...register("category")} placeholder="e.g. Herbal Tea" />
                {errors.category && <p className="text-xs text-red-500">{errors.category.message}</p>}
              </div>
              <div className="space-y-1">
                <Label>Status</Label>
                <Select
                  value={statusValue}
                  onValueChange={(v) => setValue("status", v as FormValues["status"])}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="upcoming">Upcoming</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="archived">Archived</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="col-span-2 space-y-2">
                <Label>Product image</Label>
                <AdminImageUploadField
                  value={watch("images") ?? ""}
                  onUrlChange={(url) => setValue("images", url, { shouldDirty: true })}
                  disabled={saving}
                />
                <Input {...register("images")} placeholder="https://... (or upload above)" />
              </div>
              {watch("images")?.trim() && (
                <div className="col-span-2">
                  <img
                    src={watch("images")}
                    alt="Preview"
                    className="h-32 rounded-lg object-cover w-full"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                </div>
              )}
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={saving}>
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving…
                  </>
                ) : editing ? (
                  "Update"
                ) : (
                  "Save Product"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Delete Product</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-gray-500">Are you sure? This action cannot be undone.</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteId(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              disabled={deleteProduct.isPending}
              onClick={async () => {
                if (!deleteId) return;
                try {
                  await deleteProduct.mutateAsync(deleteId);
                } finally {
                  setDeleteId(null);
                }
              }}
            >
              {deleteProduct.isPending ? "Deleting…" : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

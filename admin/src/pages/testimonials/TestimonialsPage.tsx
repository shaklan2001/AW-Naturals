import { useEffect, useState } from "react";
import { type ColumnDef } from "@tanstack/react-table";
import { Loader2, Pencil, Plus, Trash2 } from "lucide-react";
import { DataTable } from "@/components/tables/DataTable";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  useAdminTestimonials,
  useCreateTestimonial,
  useDeleteTestimonial,
  useUpdateTestimonial,
} from "@/hooks/use-admin-queries";
import type { Testimonial } from "@/types";
import type { CreateTestimonialInput } from "@/api/admin-api";

const QUOTE_MAX = 300;
const NAME_MAX = 72;
const TITLE_MAX = 72;
const PUBLIC_CAP = 12;

const emptyForm: CreateTestimonialInput = {
  quote: "",
  authorName: "",
  authorTitle: "",
  published: false,
  sortOrder: 0,
};

export function TestimonialsPage() {
  const { data: rows = [], isLoading, isError, error, refetch } = useAdminTestimonials();
  const createT = useCreateTestimonial();
  const updateT = useUpdateTestimonial();
  const deleteT = useDeleteTestimonial();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Testimonial | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [form, setForm] = useState<CreateTestimonialInput>(emptyForm);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    if (!dialogOpen) {
      setFormError(null);
      return;
    }
    if (editing) {
      setForm({
        quote: editing.quote,
        authorName: editing.authorName,
        authorTitle: editing.authorTitle,
        published: editing.published,
        sortOrder: editing.sortOrder,
      });
    } else {
      setForm(emptyForm);
    }
  }, [dialogOpen, editing]);

  const publishedCount = rows.filter((r) => r.published).length;

  const openAdd = () => {
    setEditing(null);
    setDialogOpen(true);
  };

  const openEdit = (t: Testimonial) => {
    setEditing(t);
    setDialogOpen(true);
  };

  const handleSave = async () => {
    setFormError(null);
    const q = form.quote.trim();
    const n = form.authorName.trim();
    const t = form.authorTitle.trim();
    if (q.length < 12) {
      setFormError("Quote should be at least 12 characters.");
      return;
    }
    if (q.length > QUOTE_MAX) {
      setFormError(`Quote must be at most ${QUOTE_MAX} characters.`);
      return;
    }
    if (!n || n.length > NAME_MAX) {
      setFormError(`Name is required (max ${NAME_MAX} characters).`);
      return;
    }
    if (!t || t.length > TITLE_MAX) {
      setFormError(`Title/role is required (max ${TITLE_MAX} characters).`);
      return;
    }
    const payload: CreateTestimonialInput = {
      quote: q,
      authorName: n,
      authorTitle: t,
      published: form.published ?? false,
      sortOrder: Number.isFinite(Number(form.sortOrder)) ? Number(form.sortOrder) : 0,
    };
    try {
      if (editing) {
        await updateT.mutateAsync({ id: editing.id, body: payload });
      } else {
        await createT.mutateAsync(payload);
      }
      setDialogOpen(false);
      setEditing(null);
    } catch (e) {
      setFormError(e instanceof Error ? e.message : "Save failed");
    }
  };

  const columns: ColumnDef<Testimonial>[] = [
    {
      accessorKey: "quote",
      header: "Quote",
      cell: ({ row }) => (
        <p className="max-w-md text-sm text-gray-800 line-clamp-2" title={row.original.quote}>
          {row.original.quote}
        </p>
      ),
    },
    {
      accessorKey: "authorName",
      header: "Name",
      cell: ({ row }) => <span className="text-sm font-medium text-gray-900">{row.original.authorName}</span>,
    },
    {
      accessorKey: "authorTitle",
      header: "Title",
      cell: ({ row }) => (
        <span className="text-xs uppercase tracking-wide text-gray-500">{row.original.authorTitle}</span>
      ),
    },
    {
      accessorKey: "sortOrder",
      header: "Order",
      cell: ({ row }) => <span className="text-sm text-gray-600">{row.original.sortOrder}</span>,
    },
    {
      accessorKey: "published",
      header: "Status",
      cell: ({ row }) => (
        <Badge variant={row.original.published ? "success" : "secondary"}>
          {row.original.published ? "Live on site" : "Draft"}
        </Badge>
      ),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" title="Edit" onClick={() => openEdit(row.original)}>
            <Pencil className="h-4 w-4 text-gray-500" />
          </Button>
          <Button variant="ghost" size="icon" title="Delete" onClick={() => setDeleteId(row.original.id)}>
            <Trash2 className="h-4 w-4 text-red-400" />
          </Button>
        </div>
      ),
    },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center gap-2 py-12 text-sm text-gray-500">
        <Loader2 className="h-5 w-5 animate-spin" />
        Loading testimonials…
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

  const saving = createT.isPending || updateT.isPending;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-[#212b36]">Testimonials</h2>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            Control which quotes appear on the homepage carousel. Only rows marked{" "}
            <span className="font-medium text-gray-700">Live on site</span> are shown; the storefront loads at most{" "}
            <span className="font-medium text-gray-700">{PUBLIC_CAP}</span> published items, ordered by{" "}
            <span className="font-medium text-gray-700">Order</span> (lower first). Keep quotes under {QUOTE_MAX}{" "}
            characters so cards do not overflow.
          </p>
          <p className="mt-2 text-xs text-gray-400">
            Currently <span className="font-semibold text-gray-600">{publishedCount}</span> published
            {publishedCount > PUBLIC_CAP ? (
              <span className="text-amber-600"> — only the first {PUBLIC_CAP} by sort order appear on the site.</span>
            ) : null}
          </p>
        </div>
        <Button onClick={openAdd} className="shrink-0">
          <Plus className="mr-2 h-4 w-4" />
          Add testimonial
        </Button>
      </div>

      <DataTable columns={columns} data={rows} enableSorting={false} getRowId={(r) => r.id} />

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-h-[90vh] max-w-lg overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit testimonial" : "New testimonial"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1">
              <Label htmlFor="tq">Quote</Label>
              <Textarea
                id="tq"
                value={form.quote}
                onChange={(e) => setForm((f) => ({ ...f, quote: e.target.value }))}
                maxLength={QUOTE_MAX}
                rows={5}
                placeholder="Short testimonial (12–300 characters)"
                className="resize-y"
              />
              <p className="text-xs text-gray-400">
                {form.quote.length}/{QUOTE_MAX} — shorter copy keeps the homepage layout stable.
              </p>
            </div>
            <div className="space-y-1">
              <Label htmlFor="tn">Display name</Label>
              <Input
                id="tn"
                value={form.authorName}
                onChange={(e) => setForm((f) => ({ ...f, authorName: e.target.value }))}
                maxLength={NAME_MAX}
                placeholder="e.g. Dr. James Chen"
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="tt">Title / role</Label>
              <Input
                id="tt"
                value={form.authorTitle}
                onChange={(e) => setForm((f) => ({ ...f, authorTitle: e.target.value }))}
                maxLength={TITLE_MAX}
                placeholder="e.g. Clinical Nutritionist"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label htmlFor="ts">Sort order</Label>
                <Input
                  id="ts"
                  type="number"
                  min={0}
                  max={999}
                  value={form.sortOrder ?? 0}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, sortOrder: parseInt(e.target.value, 10) || 0 }))
                  }
                />
              </div>
              <div className="flex flex-col justify-end gap-2 pb-1">
                <label className="flex cursor-pointer items-center gap-2 text-sm text-gray-700">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300"
                    checked={form.published ?? false}
                    onChange={(e) => setForm((f) => ({ ...f, published: e.target.checked }))}
                  />
                  Published (visible on storefront)
                </label>
              </div>
            </div>
            {formError ? <p className="text-sm text-red-600">{formError}</p> : null}
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button type="button" disabled={saving} onClick={() => void handleSave()}>
              {saving ? "Saving…" : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!deleteId} onOpenChange={(o) => !o && setDeleteId(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Delete testimonial?</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-gray-600">This cannot be undone.</p>
          <DialogFooter className="gap-2">
            <Button type="button" variant="outline" onClick={() => setDeleteId(null)}>
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              disabled={deleteT.isPending}
              onClick={async () => {
                if (!deleteId) return;
                try {
                  await deleteT.mutateAsync(deleteId);
                } finally {
                  setDeleteId(null);
                }
              }}
            >
              {deleteT.isPending ? "Deleting…" : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

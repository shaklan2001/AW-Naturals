import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { type ColumnDef } from "@tanstack/react-table";
import { Plus, Pencil, Trash2, Loader2 } from "lucide-react";
import { DataTable } from "@/components/tables/DataTable";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { useAdminBlogs, useDeleteBlog } from "@/hooks/use-admin-queries";
import { formatDate } from "@/utils/cn";
import type { Blog } from "@/types";

export function BlogListPage() {
  const { data: blogs = [], isLoading, isError, error, refetch } = useAdminBlogs();
  const deleteBlog = useDeleteBlog();
  const navigate = useNavigate();
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const columns: ColumnDef<Blog>[] = [
    {
      accessorKey: "title",
      header: "Post",
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <img
            src={row.original.coverImage}
            alt={row.original.title}
            className="w-12 h-12 rounded-lg object-cover border border-gray-100 flex-shrink-0"
            onError={(e) => {
              e.currentTarget.style.display = "none";
            }}
          />
          <div className="min-w-0">
            <div className="font-medium text-sm text-gray-900 truncate max-w-xs">{row.original.title}</div>
            <div className="text-xs text-gray-400 mt-0.5">/{row.original.slug}</div>
          </div>
        </div>
      ),
    },
    {
      accessorKey: "author",
      header: "Author",
      cell: ({ row }) => <span className="text-sm text-gray-700">{row.original.author}</span>,
    },
    {
      accessorKey: "category",
      header: "Category",
      cell: ({ row }) => (
        <Badge variant="outline" className="capitalize">
          {row.original.category}
        </Badge>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <Badge variant={row.original.status === "published" ? "success" : "secondary"} className="capitalize">
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
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            title="Edit"
            onClick={() => navigate(`/blog/edit/${row.original.id}`)}
          >
            <Pencil className="w-4 h-4 text-gray-500" />
          </Button>
          <Button variant="ghost" size="icon" title="Delete" onClick={() => setDeleteId(row.original.id)}>
            <Trash2 className="w-4 h-4 text-red-400" />
          </Button>
        </div>
      ),
    },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 text-gray-500 text-sm py-12 justify-center">
        <Loader2 className="w-5 h-5 animate-spin" /> Loading posts…
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
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-[#212b36]">Blog posts</h2>
          <p className="text-sm text-gray-500">{blogs.length} total posts</p>
        </div>
        <Button onClick={() => navigate("/blog/new")}>
          <Plus className="w-4 h-4 mr-2" /> New Post
        </Button>
      </div>

      <DataTable columns={columns} data={blogs} searchKey="title" searchPlaceholder="Search posts..." />

      <Dialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Delete Blog Post</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-gray-500">Are you sure? This action cannot be undone.</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteId(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              disabled={deleteBlog.isPending}
              onClick={async () => {
                if (!deleteId) return;
                try {
                  await deleteBlog.mutateAsync(deleteId);
                } finally {
                  setDeleteId(null);
                }
              }}
            >
              {deleteBlog.isPending ? "Deleting…" : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

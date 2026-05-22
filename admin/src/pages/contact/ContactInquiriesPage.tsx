import { type ColumnDef } from "@tanstack/react-table";
import { Loader2 } from "lucide-react";
import { DataTable } from "@/components/tables/DataTable";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  useAdminContactInquiries,
  useUpdateContactInquiryStatus,
} from "@/hooks/use-admin-queries";
import { formatDate } from "@/utils/cn";
import type { ContactInquiry } from "@/types";

export function ContactInquiriesPage() {
  const { data: inquiries = [], isLoading, isError, error, refetch } = useAdminContactInquiries();
  const updateStatus = useUpdateContactInquiryStatus();
  const normalizeStatus = (status: string | undefined): ContactInquiry["status"] => {
    if (status === "pending" || status === "in_progress" || status === "contacted") {
      return status;
    }
    return "pending";
  };

  const statusVariant = (status: ContactInquiry["status"]) => {
    if (status === "pending") return "warning";
    if (status === "in_progress") return "default";
    return "success";
  };

  const columns: ColumnDef<ContactInquiry>[] = [
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => (
        <div>
          <div className="font-medium text-gray-900 text-sm">{row.original.name}</div>
          <div className="text-xs text-gray-500">{row.original.email}</div>
        </div>
      ),
    },
    {
      accessorKey: "phone",
      header: "Phone",
      cell: ({ row }) => <span className="text-sm text-gray-700">{row.original.phone}</span>,
    },
    {
      accessorKey: "issue",
      header: "Issue",
      cell: ({ row }) => (
        <p className="max-w-xl whitespace-pre-wrap text-sm leading-relaxed text-gray-700">
          {row.original.issue}
        </p>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <Badge variant={statusVariant(normalizeStatus(row.original.status))} className="capitalize">
          {normalizeStatus(row.original.status).replace("_", " ")}
        </Badge>
      ),
    },
    {
      accessorKey: "createdAt",
      header: "Created",
      cell: ({ row }) => <span className="text-xs text-gray-500">{formatDate(row.original.createdAt)}</span>,
    },
    {
      id: "actions",
      header: "Action",
      cell: ({ row }) => (
        // Legacy rows may come without status from stale API responses; default them to pending.
        <select
          value={normalizeStatus(row.original.status)}
          disabled={updateStatus.isPending}
          onChange={(event) => {
            void updateStatus.mutateAsync({
              id: row.original.id,
              status: event.target.value as ContactInquiry["status"],
            });
          }}
          className="h-9 min-w-[138px] rounded-md border border-gray-200 bg-white px-2 text-xs font-medium text-gray-700"
        >
          <option value="pending">Pending</option>
          <option value="in_progress">In Progress</option>
          <option value="contacted">Contacted</option>
        </select>
      ),
    },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 py-12 justify-center text-sm text-gray-500">
        <Loader2 className="h-5 w-5 animate-spin" /> Loading contact inquiries...
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
        <h2 className="text-xl font-bold tracking-tight text-[#212b36]">Contact Inquiries</h2>
        <p className="text-sm text-gray-500">
          {inquiries.length} total messages · track each lead as Pending, In Progress, or Contacted
        </p>
      </div>
      {updateStatus.isError ? <p className="text-sm text-red-600">{updateStatus.error.message}</p> : null}
      <DataTable
        columns={columns}
        data={inquiries}
        searchKey="name"
        searchPlaceholder="Search by name..."
      />
    </div>
  );
}

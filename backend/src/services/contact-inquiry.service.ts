import { prisma } from "../lib/prisma.js";
import { HttpError } from "../middleware/error-handler.js";

function mapContactInquiry(row: {
  id: string;
  name: string;
  phone: string;
  email: string;
  issue: string;
  status: "pending" | "in_progress" | "contacted";
  createdAt: Date;
  updatedAt: Date;
}) {
  return {
    id: row.id,
    name: row.name,
    phone: row.phone,
    email: row.email,
    issue: row.issue,
    status: row.status,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}

export async function createContactInquiry(input: {
  name: string;
  phone: string;
  email: string;
  issue: string;
}) {
  const row = await prisma.contactInquiry.create({
    data: {
      name: input.name,
      phone: input.phone,
      email: input.email,
      issue: input.issue,
    },
  });
  return mapContactInquiry(row);
}

export async function listContactInquiriesAdmin() {
  const rows = await prisma.contactInquiry.findMany({
    orderBy: { createdAt: "desc" },
  });
  return rows.map(mapContactInquiry);
}

export async function updateContactInquiryStatusAdmin(
  id: string,
  status: "pending" | "in_progress" | "contacted"
) {
  const existing = await prisma.contactInquiry.findUnique({ where: { id } });
  if (!existing) throw new HttpError(404, "Contact inquiry not found");
  const row = await prisma.contactInquiry.update({
    where: { id },
    data: { status },
  });
  return mapContactInquiry(row);
}

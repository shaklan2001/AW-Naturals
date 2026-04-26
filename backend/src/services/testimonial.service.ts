import { prisma } from "../lib/prisma.js";
import { HttpError } from "../middleware/error-handler.js";

/** Max items returned on storefront (keeps carousel performant). */
export const TESTIMONIALS_PUBLIC_LIMIT = 12;

type TestimonialRow = {
  id: string;
  quote: string;
  authorName: string;
  authorTitle: string;
  published: boolean;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
};

function mapPublic(t: Pick<TestimonialRow, "id" | "quote" | "authorName" | "authorTitle">) {
  return {
    id: t.id,
    quote: t.quote,
    name: t.authorName,
    title: t.authorTitle,
  };
}

function mapAdmin(t: TestimonialRow) {
  return {
    id: t.id,
    quote: t.quote,
    authorName: t.authorName,
    authorTitle: t.authorTitle,
    published: t.published,
    sortOrder: t.sortOrder,
    createdAt: t.createdAt.toISOString(),
    updatedAt: t.updatedAt.toISOString(),
  };
}

export async function listTestimonialsPublic() {
  const rows = await prisma.testimonial.findMany({
    where: { published: true },
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
    take: TESTIMONIALS_PUBLIC_LIMIT,
  });
  return rows.map(mapPublic);
}

export async function listTestimonialsAdmin() {
  const rows = await prisma.testimonial.findMany({
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
  });
  return rows.map(mapAdmin);
}

export async function createTestimonialAdmin(data: {
  quote: string;
  authorName: string;
  authorTitle: string;
  published: boolean;
  sortOrder: number;
}) {
  const t = await prisma.testimonial.create({ data });
  return mapAdmin(t);
}

export async function updateTestimonialAdmin(
  id: string,
  data: Partial<{
    quote: string;
    authorName: string;
    authorTitle: string;
    published: boolean;
    sortOrder: number;
  }>
) {
  try {
    const t = await prisma.testimonial.update({ where: { id }, data });
    return mapAdmin(t);
  } catch {
    throw new HttpError(404, "Testimonial not found");
  }
}

export async function deleteTestimonialAdmin(id: string) {
  try {
    await prisma.testimonial.delete({ where: { id } });
  } catch {
    throw new HttpError(404, "Testimonial not found");
  }
}

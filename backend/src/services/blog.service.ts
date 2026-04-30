import { prisma } from "../lib/prisma.js";
import { HttpError } from "../middleware/error-handler.js";

/** Matches Prisma schema enum `BlogStatus` without importing generated enum (IDE/tsc friendly). */
type BlogStatusValue = "published" | "draft";

/** Row shape for `prisma.blog` results — avoids `import type { Blog }` when tooling omits Prisma exports. */
type BlogRow = {
  id: string;
  title: string;
  slug: string;
  author: string;
  category: string;
  coverImage: string;
  content: string;
  seoTitle: string;
  seoDescription: string;
  status: BlogStatusValue;
  createdAt: Date;
  updatedAt: Date;
};

function mapBlogList(b: BlogRow) {
  return {
    id: b.id,
    title: b.title,
    slug: b.slug,
    author: b.author,
    category: b.category,
    coverImage: b.coverImage,
    seoTitle: b.seoTitle,
    seoDescription: b.seoDescription,
    status: b.status,
    createdAt: b.createdAt.toISOString().slice(0, 10),
    updatedAt: b.updatedAt.toISOString().slice(0, 10),
  };
}

function mapBlogDetail(b: BlogRow) {
  return {
    ...mapBlogList(b),
    content: b.content,
  };
}

export async function listBlogsPublic() {
  const rows = await prisma.blog.findMany({
    where: { status: "published" },
    orderBy: { createdAt: "desc" },
  });
  return rows.map(mapBlogList);
}

export async function getBlogBySlugPublic(slug: string) {
  const b = await prisma.blog.findFirst({
    where: { slug, status: "published" },
  });
  if (!b) throw new HttpError(404, "Post not found");
  return mapBlogDetail(b);
}

export async function listBlogsAdmin() {
  const rows = await prisma.blog.findMany({ orderBy: { createdAt: "desc" } });
  return rows.map(mapBlogDetail);
}

export async function getBlogAdmin(id: string) {
  const b = await prisma.blog.findUnique({ where: { id } });
  if (!b) throw new HttpError(404, "Post not found");
  return mapBlogDetail(b);
}

export async function createBlogAdmin(data: {
  title: string;
  slug: string;
  author: string;
  category: string;
  coverImage: string;
  content: string;
  seoTitle: string;
  seoDescription: string;
  status: BlogStatusValue;
}) {
  try {
    const b = await prisma.blog.create({ data });
    return mapBlogDetail(b);
  } catch {
    throw new HttpError(409, "Slug already exists");
  }
}

export async function updateBlogAdmin(
  id: string,
  data: Partial<{
    title: string;
    slug: string;
    author: string;
    category: string;
    coverImage: string;
    content: string;
    seoTitle: string;
    seoDescription: string;
    status: BlogStatusValue;
  }>
) {
  try {
    const b = await prisma.blog.update({ where: { id }, data });
    return mapBlogDetail(b);
  } catch {
    throw new HttpError(404, "Post not found");
  }
}

export async function deleteBlogAdmin(id: string) {
  try {
    await prisma.blog.delete({ where: { id } });
  } catch {
    throw new HttpError(404, "Post not found");
  }
}

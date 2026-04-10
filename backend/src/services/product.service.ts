import { ProductStatus, type Prisma, type Product } from "@prisma/client";
import { prisma } from "../lib/prisma.js";
import { HttpError } from "../middleware/error-handler.js";
import { toNumber } from "../utils/money.js";

function optionalText(s: string | undefined | null): string | null {
  if (s === null || s === undefined) return null;
  const t = String(s).trim();
  return t.length > 0 ? t : null;
}

export function mapProductPublic(p: Product) {
  const image = p.images[0] ?? "";
  return {
    id: p.id,
    name: p.name,
    shortDescription: optionalText(p.shortDescription) ?? undefined,
    benefit: optionalText(p.benefit) ?? undefined,
    description: p.description,
    price: toNumber(p.price),
    image,
    images: p.images,
    category: p.category,
    stock: p.stock,
    status: p.status,
    keyBenefitsPoints: p.keyBenefitsPoints ?? [],
    ingredientsPoints: p.ingredientsPoints ?? [],
    clinicalNote: p.clinicalNote ?? null,
    showClinicalNote: p.showClinicalNote ?? false,
  };
}

export function mapProductAdmin(p: Product) {
  return {
    id: p.id,
    name: p.name,
    shortDescription: p.shortDescription?.trim() || p.description,
    description: p.description,
    benefit: p.benefit,
    price: toNumber(p.price),
    category: p.category,
    stock: p.stock,
    status: p.status,
    images: p.images,
    keyBenefitsPoints: p.keyBenefitsPoints ?? [],
    ingredientsPoints: p.ingredientsPoints ?? [],
    clinicalNote: p.clinicalNote ?? null,
    showClinicalNote: p.showClinicalNote ?? false,
    createdAt: p.createdAt.toISOString().slice(0, 10),
    updatedAt: p.updatedAt.toISOString().slice(0, 10),
  };
}

const storefrontVisibleStatuses: ProductStatus[] = [ProductStatus.active, ProductStatus.upcoming];

function storefrontCategoryVariants(category: string): string[] {
  const normalized = category.trim().toLowerCase();

  if (normalized === "herbal infusions" || normalized === "herbal infusion" || normalized === "herbal") {
    return ["Herbal Infusions", "Herbal Infusion", "Herbal Tea"];
  }

  if (
    normalized === "oral care line" ||
    normalized === "oral care" ||
    normalized === "oral-care" ||
    normalized === "oral"
  ) {
    return [
      "Oral Care Line",
      "Oral care line",
      "Oral Care",
      "oral-care",
      "Ayurvedic Ritual",
      "Ayurvedic ritual",
      "Oil Pulling",
    ];
  }

  if (
    normalized === "skincare line" ||
    normalized === "skin care line" ||
    normalized === "skincare" ||
    normalized === "skin care" ||
    normalized === "botanical skincare" ||
    normalized === "botanical skin care"
  ) {
    return [
      "Skincare Line",
      "Skin Care Line",
      "Skincare",
      "Skin Care",
      "Botanical Skincare",
      "Botanical Skin Care",
    ];
  }

  return [category.trim()];
}

export async function listProductsPublic(category?: string) {
  const normalizedCategory = category?.trim();
  const categoryVariants = normalizedCategory ? storefrontCategoryVariants(normalizedCategory) : [];
  const rows = await prisma.product.findMany({
    where: {
      status: { in: storefrontVisibleStatuses },
      ...(normalizedCategory
        ? {
            OR: categoryVariants.map((value) => ({
              category: {
                equals: value,
                mode: "insensitive",
              },
            })),
          }
        : {}),
    },
    orderBy: { createdAt: "desc" },
  });
  return rows.map(mapProductPublic);
}

export async function getProductPublic(id: string) {
  const p = await prisma.product.findFirst({
    where: { id, status: { in: storefrontVisibleStatuses } },
  });
  if (!p) throw new HttpError(404, "Product not found");
  return mapProductPublic(p);
}

export async function listProductsAdmin() {
  const rows = await prisma.product.findMany({ orderBy: { createdAt: "desc" } });
  return rows.map(mapProductAdmin);
}

export async function getProductAdmin(id: string) {
  const p = await prisma.product.findUnique({ where: { id } });
  if (!p) throw new HttpError(404, "Product not found");
  return mapProductAdmin(p);
}

export async function createProductAdmin(data: {
  name: string;
  shortDescription?: string;
  description: string;
  benefit?: string;
  price: number;
  category: string;
  stock: number;
  status: ProductStatus;
  images: string[];
  keyBenefitsPoints?: string[];
  ingredientsPoints?: string[];
  clinicalNote?: string;
  showClinicalNote?: boolean;
}) {
  const p = await prisma.product.create({
    data: {
      name: data.name,
      shortDescription: optionalText(data.shortDescription),
      description: data.description,
      benefit: data.benefit?.trim() ? data.benefit.trim() : null,
      price: data.price,
      category: data.category,
      stock: data.stock,
      status: data.status,
      images: data.images,
      keyBenefitsPoints: data.keyBenefitsPoints ?? [],
      ingredientsPoints: data.ingredientsPoints ?? [],
      clinicalNote: optionalText(data.clinicalNote),
      showClinicalNote: data.showClinicalNote ?? false,
    },
  });
  return mapProductAdmin(p);
}

export async function updateProductAdmin(
  id: string,
  data: Partial<{
    name: string;
    shortDescription: string | null;
    description: string;
    benefit: string | null;
    price: number;
    category: string;
    stock: number;
    status: ProductStatus;
    images: string[];
    keyBenefitsPoints: string[];
    ingredientsPoints: string[];
    clinicalNote: string | null;
    showClinicalNote: boolean;
  }>
) {
  const patch: Prisma.ProductUpdateInput = {};
  if (data.name !== undefined) patch.name = data.name;
  if (data.shortDescription !== undefined) patch.shortDescription = optionalText(data.shortDescription);
  if (data.description !== undefined) patch.description = data.description;
  if (data.benefit !== undefined) {
    patch.benefit =
      data.benefit === null || data.benefit === "" ? null : String(data.benefit).trim() || null;
  }
  if (data.price !== undefined) patch.price = data.price;
  if (data.category !== undefined) patch.category = data.category;
  if (data.stock !== undefined) patch.stock = data.stock;
  if (data.status !== undefined) patch.status = data.status;
  if (data.images !== undefined) patch.images = data.images;
  if (data.keyBenefitsPoints !== undefined) patch.keyBenefitsPoints = data.keyBenefitsPoints;
  if (data.ingredientsPoints !== undefined) patch.ingredientsPoints = data.ingredientsPoints;
  if (data.clinicalNote !== undefined) patch.clinicalNote = optionalText(data.clinicalNote);
  if (data.showClinicalNote !== undefined) patch.showClinicalNote = data.showClinicalNote;

  try {
    const p = await prisma.product.update({ where: { id }, data: patch });
    return mapProductAdmin(p);
  } catch {
    throw new HttpError(404, "Product not found");
  }
}

export async function deleteProductAdmin(id: string) {
  try {
    await prisma.product.delete({ where: { id } });
  } catch {
    throw new HttpError(404, "Product not found");
  }
}

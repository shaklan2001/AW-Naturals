import { PRODUCT_CATEGORY } from "./product-categories";

export type CategoryCopy = {
  chip: string;
  title: string;
  titleAccent?: string;
  description: string;
};

export type ProductShelfKey =
  | "herbalInfusions"
  | "skincareLine"
  | "oralCareLine"
  | "nightRitual";

export const PRODUCT_SHELF_COPY: Record<ProductShelfKey, CategoryCopy> = {
  herbalInfusions: {
    chip: "Herbal Infusions",
    title: "Premium",
    titleAccent: "Blends",
    description:
      "Doctor-formulated herbal infusions clinically calibrated to optimize metabolic vitality and restore systemic homeostasis.",
  },
  skincareLine: {
    chip: "Botanical Skincare",
    title: "Clinical",
    titleAccent: "Formulations",
    description:
      "Doctor-formulated, bio-active topical solutions engineered to restore the epidermal barrier, optimize cellular regeneration, and deliver timeless radiance.",
  },
  oralCareLine: {
    chip: "Microbiome Balancing",
    title: "Clinical",
    titleAccent: "Formulations",
    description:
      "Therapeutic oral formulations designed to optimize the oral microbiome, strengthen enamel integrity, and sustain long-term mucosal health naturally.",
  },
  nightRitual: {
    chip: "Circadian Renewal",
    title: "Clinical",
    titleAccent: "Formulations",
    description:
      "Synergistic evening formulations calibrated to reduce neuro-inflammation, alleviate systemic stress, and induce deep, restorative sleep architectures.",
  },
};

const SHOP_ALL_COPY: CategoryCopy = {
  chip: "Clinical Formulations",
  title: "Clinical",
  titleAccent: "Formulations",
  description:
    "Doctor-formulated daily rituals across skincare, oral care, and evening renewal — clinically calibrated for lasting well-being.",
};

const SHELF_ORDER: ProductShelfKey[] = [
  "herbalInfusions",
  "skincareLine",
  "oralCareLine",
  "nightRitual",
];

export function resolveProductShelf(product: {
  id: string;
  name: string;
  category?: string;
}): ProductShelfKey {
  const category = product.category?.trim().toLowerCase() ?? "";

  if (["herbal infusions", "herbal infusion", "herbal tea"].includes(category)) {
    return "herbalInfusions";
  }

  if (
    [
      "skincare line",
      "skin care line",
      "skincare",
      "skin care",
      "botanical skincare",
      "botanical skin care",
    ].includes(category)
  ) {
    return "skincareLine";
  }

  if (
    [
      "night ritual line",
      "night rituals",
      "night ritual",
      "the night ritual",
      "circadian renewal",
    ].includes(category)
  ) {
    return "nightRitual";
  }

  if (
    ["oral care line", "oral care", "oral-care", "ayurvedic ritual", "oil pulling"].includes(category)
  ) {
    return "oralCareLine";
  }

  return "oralCareLine";
}

export function getProductsPageHeaderCopy(selectedCategory: string): CategoryCopy {
  if (selectedCategory === PRODUCT_CATEGORY.all) {
    return SHOP_ALL_COPY;
  }

  if (selectedCategory === PRODUCT_CATEGORY.herbalInfusions) {
    return PRODUCT_SHELF_COPY.herbalInfusions;
  }

  if (selectedCategory === PRODUCT_CATEGORY.skincareLine) {
    return PRODUCT_SHELF_COPY.skincareLine;
  }

  if (selectedCategory === PRODUCT_CATEGORY.oralCareLine) {
    return PRODUCT_SHELF_COPY.oralCareLine;
  }

  if (selectedCategory === PRODUCT_CATEGORY.nightRitualLine) {
    return PRODUCT_SHELF_COPY.nightRitual;
  }

  return SHOP_ALL_COPY;
}

export function getProductShelfOrder(): ProductShelfKey[] {
  return SHELF_ORDER;
}

export function getProductShelfCopy(shelf: ProductShelfKey): CategoryCopy {
  return PRODUCT_SHELF_COPY[shelf];
}

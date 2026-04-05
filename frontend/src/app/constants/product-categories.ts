export const PRODUCT_CATEGORY = {
  all: "all",
  herbalInfusions: "Herbal Infusions",
  oralCareLine: "Oral Care Line",
  skincareLine: "Skincare Line",
  nightRitualLine: "Night Ritual Line",
} as const;

export type ProductCategoryFilter = (typeof PRODUCT_CATEGORY)[keyof typeof PRODUCT_CATEGORY];

export const PRODUCT_CATEGORY_NAV = [
  { label: "Shop all", value: PRODUCT_CATEGORY.all, to: "/products" },
  {
    label: "Herbal infusions",
    value: PRODUCT_CATEGORY.herbalInfusions,
    to: "/products?category=Herbal%20Infusions",
  },
  {
    label: "Advance Oral Care",
    value: PRODUCT_CATEGORY.oralCareLine,
    to: "/products?category=Oral%20Care%20Line",
  },
  {
    label: "Advance SkinCare",
    value: PRODUCT_CATEGORY.skincareLine,
    to: "/products?category=Skincare%20Line",
  },
  {
    label: "Night rituals",
    value: PRODUCT_CATEGORY.nightRitualLine,
    to: "/products?category=Night%20Ritual%20Line",
  },
] as const;

/** Nav filter value vs API/DB `product.category`. Mirrors backend `storefrontCategoryVariants`. */
export function productMatchesNavCategory(navCategory: string, productCategory: string | undefined): boolean {
  if (!productCategory?.trim()) return false;
  const nav = navCategory.trim().toLowerCase();
  const pc = productCategory.trim().toLowerCase();

  if (nav === "all" || navCategory === PRODUCT_CATEGORY.all) return true;

  if (nav === PRODUCT_CATEGORY.herbalInfusions.toLowerCase()) {
    return ["herbal infusions", "herbal infusion", "herbal tea"].includes(pc);
  }

  if (nav === PRODUCT_CATEGORY.oralCareLine.toLowerCase()) {
    return ["oral care line", "oral care", "oral-care", "ayurvedic ritual", "oil pulling"].includes(pc);
  }

  if (nav === PRODUCT_CATEGORY.skincareLine.toLowerCase()) {
    return [
      "skincare line",
      "skin care line",
      "skincare",
      "skin care",
      "botanical skincare",
      "botanical skin care",
    ].includes(pc);
  }

  if (nav === PRODUCT_CATEGORY.nightRitualLine.toLowerCase()) {
    return [
      "night ritual line",
      "night rituals",
      "night ritual",
      "the night ritual",
      "circadian renewal",
    ].includes(pc);
  }

  return pc === nav;
}

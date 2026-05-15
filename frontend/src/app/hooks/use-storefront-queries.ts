import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  createContactInquiry,
  createOrder,
  fetchBlogBySlug,
  fetchProduct,
  fetchProducts,
  fetchPublishedBlogs,
  fetchPublishedTestimonials,
  type CreateContactInquiryInput,
  type CreateOrderInput,
} from "../api/public-api";

export const storefrontKeys = {
  products: ["storefront", "products"] as const,
  productsByCategory: (category: string) => ["storefront", "products", category] as const,
  product: (id: string) => ["storefront", "product", id] as const,
  blogs: ["storefront", "blogs"] as const,
  blog: (slug: string) => ["storefront", "blog", slug] as const,
  testimonials: ["storefront", "testimonials"] as const,
};

export function useStorefrontProducts(category?: string) {
  return useQuery({
    queryKey: storefrontKeys.productsByCategory(category ?? "all"),
    queryFn: () => fetchProducts(category),
  });
}

export function useStorefrontProduct(id: string | undefined) {
  return useQuery({
    queryKey: storefrontKeys.product(id ?? ""),
    queryFn: () => fetchProduct(id!),
    enabled: !!id,
  });
}

export function usePublishedBlogs() {
  return useQuery({
    queryKey: storefrontKeys.blogs,
    queryFn: fetchPublishedBlogs,
  });
}

export function useBlogBySlug(slug: string | undefined) {
  return useQuery({
    queryKey: storefrontKeys.blog(slug ?? ""),
    queryFn: () => fetchBlogBySlug(slug!),
    enabled: !!slug,
  });
}

export function usePublishedTestimonials() {
  return useQuery({
    queryKey: storefrontKeys.testimonials,
    queryFn: fetchPublishedTestimonials,
  });
}

export function useCreateOrder() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: CreateOrderInput) => createOrder(body),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["storefront"] });
    },
  });
}

export function useCreateContactInquiry() {
  return useMutation({
    mutationFn: (body: CreateContactInquiryInput) => createContactInquiry(body),
  });
}

import {
  useMutation,
  useQuery,
  useQueryClient,
  type UseQueryOptions,
} from "@tanstack/react-query";
import {
  createAdminBlog,
  type CreateBlogInput,
  createAdminProduct,
  deleteAdminBlog,
  deleteAdminProduct,
  fetchAdminBlog,
  fetchAdminBlogs,
  fetchAdminOrder,
  fetchAdminOrders,
  fetchAdminContactInquiries,
  fetchAdminProduct,
  fetchAdminProducts,
  fetchDashboardStats,
  fetchSiteSettings,
  patchAdminBlog,
  patchAdminContactInquiryStatus,
  patchAdminProduct,
  patchOrderStatus,
  patchSiteSettings,
  createAdminTestimonial,
  deleteAdminTestimonial,
  fetchAdminTestimonials,
  patchAdminTestimonial,
  type CreateProductInput,
  type CreateTestimonialInput,
  type SiteSettingsApi,
} from "@/api/admin-api";
import type {
  Blog,
  ContactInquiry,
  DashboardStats,
  Order,
  OrderStatus,
  Product,
  Testimonial,
} from "@/types";

export const adminKeys = {
  all: ["admin"] as const,
  dashboard: () => [...adminKeys.all, "dashboard"] as const,
  products: () => [...adminKeys.all, "products"] as const,
  product: (id: string) => [...adminKeys.products(), id] as const,
  orders: () => [...adminKeys.all, "orders"] as const,
  order: (id: string) => [...adminKeys.orders(), id] as const,
  blogs: () => [...adminKeys.all, "blogs"] as const,
  blog: (id: string) => [...adminKeys.blogs(), id] as const,
  siteSettings: () => [...adminKeys.all, "settings", "site"] as const,
  testimonials: () => [...adminKeys.all, "testimonials"] as const,
  contactInquiries: () => [...adminKeys.all, "contact-inquiries"] as const,
};

export function useDashboardStats(
  options?: Omit<UseQueryOptions<DashboardStats, Error>, "queryKey" | "queryFn">
) {
  return useQuery({
    queryKey: adminKeys.dashboard(),
    queryFn: fetchDashboardStats,
    ...options,
  });
}

export function useAdminContactInquiries(
  options?: Omit<UseQueryOptions<ContactInquiry[], Error>, "queryKey" | "queryFn">
) {
  return useQuery({
    queryKey: adminKeys.contactInquiries(),
    queryFn: fetchAdminContactInquiries,
    ...options,
  });
}

export function useUpdateContactInquiryStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: ContactInquiry["status"] }) =>
      patchAdminContactInquiryStatus(id, status),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: adminKeys.contactInquiries() });
    },
  });
}

export function useAdminProducts(
  options?: Omit<UseQueryOptions<Product[], Error>, "queryKey" | "queryFn">
) {
  return useQuery({
    queryKey: adminKeys.products(),
    queryFn: fetchAdminProducts,
    ...options,
  });
}

export function useAdminProduct(
  id: string | undefined,
  options?: Omit<UseQueryOptions<Product, Error>, "queryKey" | "queryFn">
) {
  return useQuery({
    queryKey: adminKeys.product(id ?? ""),
    queryFn: () => fetchAdminProduct(id!),
    enabled: Boolean(id),
    ...options,
  });
}

export function useAdminOrders(
  options?: Omit<UseQueryOptions<Order[], Error>, "queryKey" | "queryFn">
) {
  return useQuery({
    queryKey: adminKeys.orders(),
    queryFn: fetchAdminOrders,
    ...options,
  });
}

export function useAdminOrder(
  id: string | undefined,
  options?: Omit<UseQueryOptions<Order, Error>, "queryKey" | "queryFn">
) {
  return useQuery({
    queryKey: adminKeys.order(id ?? ""),
    queryFn: () => fetchAdminOrder(id!),
    enabled: Boolean(id),
    ...options,
  });
}

export function useAdminBlogs(
  options?: Omit<UseQueryOptions<Blog[], Error>, "queryKey" | "queryFn">
) {
  return useQuery({
    queryKey: adminKeys.blogs(),
    queryFn: fetchAdminBlogs,
    ...options,
  });
}

export function useAdminBlog(
  id: string | undefined,
  options?: Omit<UseQueryOptions<Blog, Error>, "queryKey" | "queryFn">
) {
  return useQuery({
    queryKey: adminKeys.blog(id ?? ""),
    queryFn: () => fetchAdminBlog(id!),
    enabled: Boolean(id),
    ...options,
  });
}

export function useSiteSettings(
  options?: Omit<UseQueryOptions<SiteSettingsApi, Error>, "queryKey" | "queryFn">
) {
  return useQuery({
    queryKey: adminKeys.siteSettings(),
    queryFn: fetchSiteSettings,
    ...options,
  });
}

export function useCreateProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: CreateProductInput) => createAdminProduct(body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: adminKeys.products() });
      qc.invalidateQueries({ queryKey: adminKeys.dashboard() });
    },
  });
}

export function useUpdateProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, body }: { id: string; body: Parameters<typeof patchAdminProduct>[1] }) =>
      patchAdminProduct(id, body),
    onSuccess: (_data, { id }) => {
      qc.invalidateQueries({ queryKey: adminKeys.products() });
      qc.invalidateQueries({ queryKey: adminKeys.product(id) });
      qc.invalidateQueries({ queryKey: adminKeys.dashboard() });
    },
  });
}

export function useDeleteProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: deleteAdminProduct,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: adminKeys.products() });
      qc.invalidateQueries({ queryKey: adminKeys.dashboard() });
    },
  });
}

export function useUpdateOrderStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: OrderStatus }) =>
      patchOrderStatus(id, status),
    onSuccess: (_data, { id }) => {
      qc.invalidateQueries({ queryKey: adminKeys.orders() });
      qc.invalidateQueries({ queryKey: adminKeys.order(id) });
      qc.invalidateQueries({ queryKey: adminKeys.dashboard() });
    },
  });
}

export function useCreateBlog() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: CreateBlogInput) => createAdminBlog(body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: adminKeys.blogs() });
      qc.invalidateQueries({ queryKey: adminKeys.dashboard() });
    },
  });
}

export function useUpdateBlog() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, body }: { id: string; body: Partial<CreateBlogInput> }) =>
      patchAdminBlog(id, body),
    onSuccess: (_data, { id }) => {
      qc.invalidateQueries({ queryKey: adminKeys.blogs() });
      qc.invalidateQueries({ queryKey: adminKeys.blog(id) });
      qc.invalidateQueries({ queryKey: adminKeys.dashboard() });
    },
  });
}

export function useDeleteBlog() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: deleteAdminBlog,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: adminKeys.blogs() });
      qc.invalidateQueries({ queryKey: adminKeys.dashboard() });
    },
  });
}

export function usePatchSiteSettings() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: patchSiteSettings,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: adminKeys.siteSettings() });
    },
  });
}

export function useAdminTestimonials(
  options?: Omit<UseQueryOptions<Testimonial[], Error>, "queryKey" | "queryFn">
) {
  return useQuery({
    queryKey: adminKeys.testimonials(),
    queryFn: fetchAdminTestimonials,
    ...options,
  });
}

export function useCreateTestimonial() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: CreateTestimonialInput) => createAdminTestimonial(body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: adminKeys.testimonials() });
    },
  });
}

export function useUpdateTestimonial() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, body }: { id: string; body: Partial<CreateTestimonialInput> }) =>
      patchAdminTestimonial(id, body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: adminKeys.testimonials() });
    },
  });
}

export function useDeleteTestimonial() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: deleteAdminTestimonial,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: adminKeys.testimonials() });
    },
  });
}

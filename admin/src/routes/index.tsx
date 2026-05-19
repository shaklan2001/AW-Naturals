import { Routes, Route, Navigate } from "react-router-dom";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { LoginPage } from "@/pages/auth/LoginPage";
import { DashboardPage } from "@/pages/dashboard/DashboardPage";
import { ProductsPage } from "@/pages/products/ProductsPage";
import { InventoryPage } from "@/pages/inventory/InventoryPage";
import { OrdersPage } from "@/pages/orders/OrdersPage";
import { OrderDetailsPage } from "@/pages/orders/OrderDetailsPage";
import { BlogListPage } from "@/pages/blog/BlogListPage";
import { BlogEditorPage } from "@/pages/blog/BlogEditorPage";
import { SettingsPage } from "@/pages/settings/SettingsPage";
import { TestimonialsPage } from "@/pages/testimonials/TestimonialsPage";
import { ContactInquiriesPage } from "@/pages/contact/ContactInquiriesPage";

function RequireAuth({ children }: { children: React.ReactNode }) {
  const isAuth = localStorage.getItem("aw-admin-auth") === "true";
  return isAuth ? <>{children}</> : <Navigate to="/login" replace />;
}

export function AppRoutes() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/login" element={<LoginPage />} />

      {/* Redirect root */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />

      {/* Protected admin routes */}
      <Route
        element={
          <RequireAuth>
            <AdminLayout />
          </RequireAuth>
        }
      >
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/inventory" element={<InventoryPage />} />
        <Route path="/orders" element={<OrdersPage />} />
        <Route path="/orders/:id" element={<OrderDetailsPage />} />
        <Route path="/blog" element={<BlogListPage />} />
        <Route path="/blog/new" element={<BlogEditorPage />} />
        <Route path="/blog/edit/:id" element={<BlogEditorPage />} />
        <Route path="/testimonials" element={<TestimonialsPage />} />
        <Route path="/contact-inquiries" element={<ContactInquiriesPage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

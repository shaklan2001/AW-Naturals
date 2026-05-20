import { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { Navbar } from "./Navbar";
import { cn } from "@/utils/cn";

const TAB_TITLES: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/products": "Products",
  "/inventory": "Inventory",
  "/orders": "Orders",
  "/blog": "Blog",
  "/testimonials": "Reviews",
  "/settings": "Settings",
};

export function AdminLayout() {
  const { pathname } = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    let segment = "Admin";
    if (pathname.startsWith("/blog/new")) segment = "New blog post";
    else if (pathname.startsWith("/blog/edit/")) segment = "Edit blog post";
    else if (pathname.startsWith("/orders/") && pathname !== "/orders") segment = "Order details";
    else {
      const base = "/" + pathname.split("/").filter(Boolean)[0];
      segment = TAB_TITLES[base] ?? "Admin";
    }
    document.title = `${segment} · AW Naturals Admin`;
  }, [pathname]);

  return (
    <div className="flex min-h-screen bg-[#f4f6f8]">
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/30 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <Sidebar collapsed={collapsed} onToggle={() => setCollapsed((c) => !c)} />
      </div>

      {/* Mobile Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-40 lg:hidden transition-transform duration-300",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <Sidebar collapsed={false} onToggle={() => setMobileOpen(false)} />
      </div>

      {/* Main Content */}
      <main
        className={cn(
          "flex min-h-screen flex-1 flex-col transition-[margin] duration-300 ease-out",
          collapsed ? "lg:ml-[var(--minimal-nav-mini-w)]" : "lg:ml-[var(--minimal-nav-w)]"
        )}
      >
        <Navbar onMenuToggle={() => setMobileOpen(true)} />
        <div className="flex-1 p-6 pb-10 pt-2 page-enter md:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

import { NavLink } from "react-router-dom";
import { Icon } from "@iconify/react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/utils/cn";
import logo from "@/assets/aw_natural_logo.png";

const navItems = [
  { to: "/dashboard", label: "Dashboard", icon: "solar:widget-5-bold-duotone" as const },
  { to: "/products", label: "Products", icon: "solar:shop-bold-duotone" as const },
  { to: "/inventory", label: "Inventory", icon: "solar:box-bold-duotone" as const },
  { to: "/orders", label: "Orders", icon: "solar:cart-large-4-bold-duotone" as const },
  { to: "/blog", label: "Blog", icon: "solar:notebook-bold-duotone" as const },
  { to: "/testimonials", label: "Reviews", icon: "solar:chat-round-like-bold-duotone" as const },
  { to: "/contact-inquiries", label: "Contact Leads", icon: "solar:letter-bold-duotone" as const },
  { to: "/settings", label: "Settings", icon: "solar:settings-bold-duotone" as const },
];

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

/** Sidebar aligned with `admin/simple-vite-ts` nav — Iconify duotone icons, primary active pill. */
export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 flex h-full flex-col border-r border-dashed border-[rgba(145,158,171,0.2)] bg-[var(--minimal-paper)] transition-[width] duration-300 ease-out",
        collapsed ? "w-[var(--minimal-nav-mini-w)]" : "w-[var(--minimal-nav-w)]"
      )}
    >
      <div
        className={cn(
          "flex h-[var(--minimal-header-h)] items-center gap-3 border-b border-dashed border-[rgba(145,158,171,0.2)] px-4 pt-1",
          collapsed && "justify-center px-2"
        )}
      >
        <div className="h-10 w-10 shrink-0 overflow-hidden rounded-[var(--minimal-nav-radius)] shadow-[0_2px_8px_rgba(145,158,171,0.16)] ring-1 ring-[rgba(145,158,171,0.12)]">
          <img src={logo} alt="AW Naturals" className="h-full w-full object-cover" />
        </div>
        {!collapsed && (
          <div className="min-w-0 flex-1">
            <div className="truncate text-[15px] font-bold tracking-tight text-[#212b36]">AW Naturals</div>
            <div className="truncate text-xs font-medium text-[#637381]">Admin</div>
          </div>
        )}
      </div>

      <nav className="flex-1 space-y-0 overflow-y-auto px-3 py-4">
        {!collapsed && (
          <div className="mb-2 px-2">
            <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#919eab]">Overview</span>
          </div>
        )}
        {navItems.map(({ to, label, icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              cn(
                "group relative mb-1 flex min-h-[44px] items-center gap-3 rounded-[var(--minimal-nav-radius)] py-2 pl-3 pr-2 text-sm font-semibold capitalize tracking-tight transition-colors duration-150",
                isActive
                  ? "bg-[rgba(0,167,111,0.08)] text-[#00a76f] hover:bg-[rgba(0,167,111,0.14)]"
                  : "text-[#637381] hover:bg-[rgba(145,158,171,0.08)] hover:text-[#212b36]",
                collapsed ? "justify-center px-0" : ""
              )
            }
            title={collapsed ? label : undefined}
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <span
                    className="absolute right-0 top-1/2 hidden h-8 w-[3px] -translate-y-1/2 rounded-l-full bg-[#00a76f] lg:block"
                    aria-hidden
                  />
                )}
                <Icon
                  icon={icon}
                  width={24}
                  height={24}
                  className={cn(
                    "shrink-0 transition-colors",
                    isActive ? "text-[#00a76f]" : "text-[#919eab] group-hover:text-[#637381]"
                  )}
                />
                {!collapsed && <span className="truncate font-semibold">{label}</span>}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-dashed border-[rgba(145,158,171,0.2)] p-3">
        <button
          type="button"
          onClick={onToggle}
          className={cn(
            "flex w-full min-h-[44px] items-center gap-2 rounded-[var(--minimal-nav-radius)] py-2 text-sm font-semibold text-[#637381] transition-colors hover:bg-[rgba(145,158,171,0.08)] hover:text-[#212b36]",
            collapsed ? "justify-center px-0" : "px-3"
          )}
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" aria-hidden />
          ) : (
            <>
              <ChevronLeft className="h-4 w-4 shrink-0" aria-hidden />
              <span className="text-xs font-semibold uppercase tracking-wide text-[#919eab]">Collapse</span>
            </>
          )}
        </button>
      </div>
    </aside>
  );
}

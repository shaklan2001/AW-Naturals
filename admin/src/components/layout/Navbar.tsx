import { useLocation, useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react";
import { Menu, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAdminStore } from "@/store/useAdminStore";
import { AdminSearchbar } from "./AdminSearchbar";
import { NotificationsDrawer } from "./NotificationsDrawer";

const routeLabels: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/products": "Products",
  "/inventory": "Inventory",
  "/orders": "Orders",
  "/blog": "Blog",
  "/settings": "Settings",
};

interface NavbarProps {
  onMenuToggle: () => void;
}

/** Header aligned with `admin/simple-vite-ts` — search (⌘K), notifications badge, account. */
export function Navbar({ onMenuToggle }: NavbarProps) {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const profile = useAdminStore((s) => s.profile);

  const handleLogout = () => {
    localStorage.removeItem("aw-admin-auth");
    localStorage.removeItem("aw-admin-access-token");
    navigate("/login", { replace: true });
  };

  const basePath = "/" + pathname.split("/").filter(Boolean)[0];
  const pageLabel = routeLabels[basePath] ?? "Admin";

  return (
    <header className="sticky top-0 z-30 flex h-[var(--minimal-header-h)] items-center gap-2 border-b border-dashed border-[rgba(145,158,171,0.2)] bg-[rgba(255,255,255,0.88)] px-3 backdrop-blur-xl sm:gap-3 sm:px-4 md:gap-4 md:px-6 lg:px-8">
      <Button variant="ghost" size="icon" className="shrink-0 text-[#637381] lg:hidden" onClick={onMenuToggle}>
        <Menu className="h-5 w-5" />
      </Button>

      <div className="min-w-0 shrink-0 md:max-w-[200px] lg:max-w-[240px]">
        <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#919eab]">Overview</p>
        <h1 className="truncate text-lg font-bold capitalize tracking-tight text-[#212b36] sm:text-xl">{pageLabel}</h1>
      </div>

      <div className="mx-1 flex min-w-0 flex-1 justify-center md:mx-2">
        <AdminSearchbar />
      </div>

      <div className="ml-auto flex shrink-0 items-center gap-0.5 sm:gap-1">
        <NotificationsDrawer />

        <div className="mx-1 hidden h-8 w-px bg-[rgba(145,158,171,0.2)] sm:block" aria-hidden />

        <div className="flex items-center gap-2 pl-0.5 sm:gap-2.5 sm:pl-1">
          <div className="flex h-10 w-10 items-center justify-center rounded-[var(--minimal-nav-radius)] bg-[rgba(0,167,111,0.08)] text-[#00a76f] ring-1 ring-[rgba(0,167,111,0.16)]">
            <Icon icon="solar:user-bold-duotone" width={22} height={22} />
          </div>
          <div className="hidden leading-tight sm:block">
            <div className="max-w-[140px] truncate text-sm font-semibold text-[#212b36]">{profile.name}</div>
            <div className="max-w-[140px] truncate text-xs font-medium text-[#637381]">{profile.role}</div>
          </div>
        </div>

        <Button
          variant="ghost"
          size="icon"
          onClick={handleLogout}
          className="text-[#637381] hover:text-[#ff5630]"
          title="Log out"
        >
          <Icon icon="solar:logout-2-bold-duotone" width={22} height={22} />
        </Button>
      </div>
    </header>
  );
}

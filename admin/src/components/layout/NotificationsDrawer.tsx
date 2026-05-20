import { useCallback, useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { Link, useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react";
import { useAdminOrders } from "@/hooks/use-admin-queries";
import { formatCurrency, formatDate } from "@/utils/cn";

type TabKey = "all" | "unread" | "archived";

type Notif = {
  id: string;
  title: string;
  body: string;
  createdAt: string;
  isUnRead: boolean;
  isArchived: boolean;
};

export function NotificationsDrawer() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<TabKey>("all");
  const [readIds, setReadIds] = useState<Set<string>>(() => new Set());
  const [archivedIds, setArchivedIds] = useState<Set<string>>(() => new Set());

  const { data: orders = [] } = useAdminOrders();

  const fromOrders: Notif[] = useMemo(() => {
    const recent = [...orders].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 12);
    return recent.map((o) => ({
      id: o.id,
      title: `Order ${o.status === "pending" ? "awaiting review" : "update"}`,
      body: `${o.customerName} · ${formatCurrency(o.total)}`,
      createdAt: o.createdAt,
      isUnRead: o.status === "pending" || o.status === "processing",
      isArchived: false,
    }));
  }, [orders]);

  const staticTips: Notif[] = useMemo(
    () => [
      {
        id: "tip-products",
        title: "Tip",
        body: "Manage catalog and pricing under Products.",
        createdAt: new Date().toISOString(),
        isUnRead: false,
        isArchived: false,
      },
    ],
    []
  );

  const allItems = useMemo(() => [...fromOrders, ...staticTips], [fromOrders, staticTips]);

  const decorated = useMemo(() => {
    return allItems.map((n) => ({
      ...n,
      effectiveUnread: n.isUnRead && !readIds.has(n.id) && !archivedIds.has(n.id),
      effectiveArchived: archivedIds.has(n.id),
    }));
  }, [allItems, readIds, archivedIds]);

  const visible = useMemo(() => {
    if (tab === "unread") return decorated.filter((n) => n.effectiveUnread);
    if (tab === "archived") return decorated.filter((n) => n.effectiveArchived);
    return decorated.filter((n) => !n.effectiveArchived);
  }, [decorated, tab]);

  const totalUnRead = decorated.filter((n) => n.effectiveUnread).length;

  const counts = useMemo(() => {
    const all = decorated.filter((n) => !n.effectiveArchived).length;
    const unread = decorated.filter((n) => n.effectiveUnread).length;
    const archived = decorated.filter((n) => n.effectiveArchived).length;
    return { all, unread, archived };
  }, [decorated]);

  const markAllRead = useCallback(() => {
    setReadIds(new Set(decorated.map((n) => n.id)));
  }, [decorated]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  const tabClass = (key: TabKey) =>
    tab === key
      ? "bg-[#212b36] text-white shadow-sm"
      : "bg-[#f4f6f8] text-[#637381] hover:bg-[#eaeef2]";

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-[#637381] transition-colors hover:bg-[#f4f6f8] hover:text-[#212b36]"
        aria-label="Notifications"
      >
        <Icon icon="solar:bell-bing-bold-duotone" width={24} height={24} />
        {totalUnRead > 0 && (
          <span className="absolute right-1 top-1 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-[#ff5630] px-1 text-[10px] font-bold leading-none text-white ring-2 ring-white">
            {totalUnRead > 99 ? "99+" : totalUnRead}
          </span>
        )}
      </button>

      {open &&
        createPortal(
          <div
            className="fixed inset-0 z-[200] isolate"
            role="presentation"
            style={{ top: 0, left: 0, right: 0, bottom: 0 }}
          >
            <button
              type="button"
              className="absolute inset-0 bg-black/45 backdrop-blur-[3px]"
              aria-label="Close notifications"
              onClick={() => setOpen(false)}
            />
            <aside
              className="absolute right-0 top-0 z-[201] flex h-full w-full max-w-[420px] flex-col border-l border-[rgba(145,158,171,0.12)] bg-white shadow-[-16px_0_40px_rgba(22,28,36,0.14)] animate-in slide-in-from-right duration-200"
              role="dialog"
              aria-modal="true"
              aria-labelledby="notifications-drawer-title"
            >
            <div className="flex min-h-[68px] items-center gap-2 border-b border-[rgba(145,158,171,0.16)] pl-4 pr-2">
              <h2 id="notifications-drawer-title" className="flex-1 text-lg font-bold text-[#212b36]">
                Notifications
              </h2>
              {totalUnRead > 0 && (
                <button
                  type="button"
                  onClick={markAllRead}
                  className="flex h-10 w-10 items-center justify-center rounded-xl text-[#00a76f] transition-colors hover:bg-[rgba(0,167,111,0.08)]"
                  title="Mark all as read"
                >
                  <Icon icon="eva:done-all-fill" width={22} height={22} />
                </button>
              )}
            </div>

            <div className="flex items-center justify-between gap-2 border-b border-[rgba(145,158,171,0.16)] px-4 py-2">
              <div className="flex min-w-0 flex-1 gap-2 overflow-x-auto">
                {(
                  [
                    ["all", "All", counts.all],
                    ["unread", "Unread", counts.unread],
                    ["archived", "Archived", counts.archived],
                  ] as const
                ).map(([key, label, count]) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setTab(key)}
                    className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold transition-colors ${tabClass(key)}`}
                  >
                    {label}
                    <span
                      className={
                        tab === key
                          ? "rounded-md bg-white/20 px-1.5 py-0.5 text-[10px] text-white"
                          : "rounded-md bg-white/80 px-1.5 py-0.5 text-[10px] text-[#637381]"
                      }
                    >
                      {count}
                    </span>
                  </button>
                ))}
              </div>
              <button
                type="button"
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-[#637381] transition-colors hover:bg-[#f4f6f8]"
                title="Settings"
                onClick={() => {
                  setOpen(false);
                  navigate("/settings");
                }}
                aria-label="Open settings"
              >
                <Icon icon="solar:settings-bold-duotone" width={22} height={22} />
              </button>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto">
              {visible.length === 0 ? (
                <p className="px-6 py-12 text-center text-sm text-[#637381]">Nothing here yet.</p>
              ) : (
                <ul className="divide-y divide-[rgba(145,158,171,0.12)]">
                  {visible.map((n) => (
                    <li key={n.id}>
                      <div className="relative flex gap-3 px-4 py-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#f4f6f8]">
                          <Icon
                            icon={n.id.startsWith("tip") ? "solar:lightbulb-bolt-bold-duotone" : "solar:cart-large-4-bold-duotone"}
                            width={22}
                            className="text-[#00a76f]"
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-semibold text-[#212b36]">{n.title}</p>
                          <p className="mt-0.5 text-sm text-[#637381]">{n.body}</p>
                          <div className="mt-1 flex flex-wrap items-center gap-2">
                            <p className="text-xs text-[#919eab]">{formatDate(n.createdAt)} · Orders</p>
                            {!n.effectiveArchived && (
                              <button
                                type="button"
                                className="text-xs font-bold text-[#00a76f] hover:underline"
                                onClick={() =>
                                  setArchivedIds((prev) => {
                                    const next = new Set(prev);
                                    next.add(n.id);
                                    return next;
                                  })
                                }
                              >
                                Archive
                              </button>
                            )}
                          </div>
                        </div>
                        {n.effectiveUnread && (
                          <span
                            className="absolute right-5 top-5 h-2 w-2 shrink-0 rounded-full bg-[#00b8d9]"
                            aria-hidden
                          />
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="border-t border-[rgba(145,158,171,0.16)] p-3">
              <Link
                to="/orders"
                onClick={() => setOpen(false)}
                className="flex h-11 w-full items-center justify-center rounded-xl bg-[#212b36] text-sm font-bold text-white transition-colors hover:bg-[#161c24]"
              >
                View all
              </Link>
            </div>
          </aside>
        </div>,
          document.body
        )}
    </>
  );
}

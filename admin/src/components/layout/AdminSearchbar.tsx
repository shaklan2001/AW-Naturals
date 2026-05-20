import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ADMIN_SEARCH_ROUTES } from "./admin-search-routes";

function normalize(s: string) {
  return s.trim().toLowerCase();
}

export function AdminSearchbar() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = normalize(query);
    if (!q) return ADMIN_SEARCH_ROUTES;
    return ADMIN_SEARCH_ROUTES.filter((r) => {
      const hay = `${r.title} ${r.path} ${r.keywords ?? ""}`.toLowerCase();
      return hay.includes(q);
    });
  }, [query]);

  const handleOpenChange = useCallback((next: boolean) => {
    setOpen(next);
    if (!next) setQuery("");
  }, []);

  const go = useCallback(
    (path: string) => {
      navigate(path);
      handleOpenChange(false);
    },
    [navigate, handleOpenChange]
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      <button
        type="button"
        onClick={() => handleOpenChange(true)}
        className="hidden min-w-0 max-w-md flex-1 items-center gap-2 rounded-xl border border-transparent bg-[#f4f6f8] px-3 py-2 text-left text-sm text-[#919eab] transition-colors hover:border-[rgba(145,158,171,0.2)] hover:bg-[#eaeef2] md:flex"
        aria-label="Open search"
      >
        <Icon icon="eva:search-fill" width={20} height={20} className="shrink-0 text-[#919eab]" />
        <span className="min-w-0 flex-1 truncate font-medium">Search…</span>
        <kbd className="hidden shrink-0 rounded-md border border-[rgba(145,158,171,0.24)] bg-white px-1.5 py-0.5 font-mono text-[11px] font-semibold text-[#637381] shadow-sm sm:inline-block">
          ⌘K
        </kbd>
      </button>

      <button
        type="button"
        onClick={() => handleOpenChange(true)}
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-[#637381] transition-colors hover:bg-[#f4f6f8] md:hidden"
        aria-label="Open search"
      >
        <Icon icon="eva:search-fill" width={22} height={22} />
      </button>

      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="fixed left-1/2 top-[8%] z-50 flex max-h-[min(480px,72vh)] w-[calc(100%-2rem)] max-w-lg translate-x-[-50%] translate-y-0 flex-col gap-0 overflow-hidden rounded-2xl p-0 sm:top-[12%]">
          <DialogTitle className="sr-only">Search admin</DialogTitle>
          <DialogDescription className="sr-only">Jump to a page in the admin console.</DialogDescription>
          <div className="flex items-center gap-3 border-b border-[rgba(145,158,171,0.16)] px-4 py-3 pr-12">
            <Icon icon="eva:search-fill" width={22} height={22} className="shrink-0 text-[#919eab]" />
            <Input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search…"
              className="h-10 flex-1 border-0 bg-transparent p-0 text-base font-semibold text-[#212b36] shadow-none placeholder:text-[#919eab] focus-visible:ring-0"
            />
            <kbd className="shrink-0 rounded-md border border-[rgba(145,158,171,0.24)] bg-[#f4f6f8] px-2 py-1 font-mono text-[11px] font-semibold text-[#637381]">
              esc
            </kbd>
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto p-2">
            {filtered.length === 0 ? (
              <p className="px-3 py-10 text-center text-sm text-[#637381]">No results for “{query}”.</p>
            ) : (
              <ul className="space-y-0.5">
                {filtered.map((r) => (
                  <li key={r.path}>
                    <button
                      type="button"
                      onClick={() => go(r.path)}
                      className="flex w-full items-center rounded-xl px-3 py-2.5 text-left text-sm font-semibold text-[#212b36] transition-colors hover:bg-[rgba(0,167,111,0.08)] hover:text-[#00a76f]"
                    >
                      <span className="capitalize">{r.title}</span>
                      <span className="ml-auto truncate pl-2 text-xs font-medium text-[#919eab]">{r.path}</span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

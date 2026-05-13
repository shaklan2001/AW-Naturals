import { useEffect } from "react";
import { Link, useLocation, useNavigate, useSearchParams } from "react-router";
import { useCustomerAuth } from "../../context/CustomerAuthContext";
import { Button } from "../../components/ui/button";

function sanitizeReturnPath(raw: string | null): string {
  if (!raw || !raw.startsWith("/") || raw.startsWith("//")) return "/";
  return raw;
}

/** Bookmark-friendly login page — sign-in is optional; users can continue browsing. */
export function CustomerLoginPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { openAuthModal, isAuthenticated } = useCustomerAuth();
  const next = sanitizeReturnPath(searchParams.get("next"));
  const auth0Error =
    typeof (location.state as { auth0Error?: string } | null)?.auth0Error === "string"
      ? (location.state as { auth0Error: string }).auth0Error
      : null;

  useEffect(() => {
    if (isAuthenticated) {
      navigate(next, { replace: true });
    }
  }, [isAuthenticated, navigate, next]);

  if (isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-[calc(100svh-5rem)] bg-[#0B0B0B] px-4 pb-24 pt-28 text-[#F5F5DC] sm:px-6">
      <div className="mx-auto max-w-md rounded-[28px] border border-[#e8dcc8]/25 bg-[#FAF5EB] p-8 text-[#1f1c18] shadow-[0_28px_70px_-12px_rgba(0,0,0,0.45)] sm:p-10">
        <p className="text-center font-['Inter'] text-[10px] font-semibold uppercase tracking-[0.34em] text-[#9a7320]">
          Customer account
        </p>
        <h1 className="mt-3 text-center font-['Cormorant_Garamond',serif] font-semibold text-[2rem] tracking-tight md:text-[2.25rem]" style={{ fontWeight: 600 }}>
          Sign in
        </h1>
        <p className="mt-4 text-center font-['Inter'] text-sm leading-relaxed text-[#5c554c]">
          Signing in is optional. You can shop and browse without an account; sign in to save your profile and see order
          history in one place.
        </p>
        {auth0Error ? (
          <p className="mt-4 rounded-xl border border-red-200/90 bg-red-50/95 px-3 py-2 text-center text-sm text-red-900" role="alert">
            {auth0Error}
          </p>
        ) : null}
        <div className="mt-8 flex flex-col gap-3">
          <Button
            type="button"
            className="h-11 w-full rounded-full bg-[#D4AF37] font-semibold text-[#1a1815] shadow-[0_4px_14px_rgba(212,175,55,0.35)] hover:bg-[#c9a42f]"
            onClick={() => openAuthModal("login")}
          >
            Sign in
          </Button>
          <button
            type="button"
            className="h-11 w-full rounded-full border border-[#c9b89a] bg-white/70 font-['Inter'] text-sm font-medium text-[#3d382f] transition-colors hover:bg-white"
            onClick={() => navigate(next, { replace: true })}
          >
            Continue without signing in
          </button>
        </div>
        <p className="mt-6 text-center font-['Inter'] text-xs text-[#7a7268]">
          New here?{" "}
          <Link to={`/signup?next=${encodeURIComponent(next)}`} className="font-medium text-[#8a6a1c] underline underline-offset-4">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}

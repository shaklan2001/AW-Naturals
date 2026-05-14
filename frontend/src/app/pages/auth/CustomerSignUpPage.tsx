import { useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router";
import { useCustomerAuth } from "../../context/CustomerAuthContext";
import { Button } from "../../components/ui/button";

function sanitizeReturnPath(raw: string | null): string {
  if (!raw || !raw.startsWith("/") || raw.startsWith("//")) return "/";
  return raw;
}

export function CustomerSignUpPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { openAuthModal, isAuthenticated } = useCustomerAuth();
  const next = sanitizeReturnPath(searchParams.get("next"));

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
        <h1 className="mt-3 text-center font-['Gloock'] text-[2rem] tracking-tight md:text-[2.25rem]" style={{ fontWeight: 400 }}>
          Create an account
        </h1>
        <p className="mt-4 text-center font-['Inter'] text-sm leading-relaxed text-[#5c554c]">
          Accounts are optional. Create one when you want saved details and order history — or keep browsing as a guest.
        </p>
        <div className="mt-8 flex flex-col gap-3">
          <Button
            type="button"
            className="h-11 w-full rounded-full bg-[#D4AF37] font-semibold text-[#1a1815] shadow-[0_4px_14px_rgba(212,175,55,0.35)] hover:bg-[#c9a42f]"
            onClick={() => openAuthModal("signup")}
          >
            Create account
          </Button>
          <button
            type="button"
            className="h-11 w-full rounded-full border border-[#c9b89a] bg-white/70 font-['Inter'] text-sm font-medium text-[#3d382f] transition-colors hover:bg-white"
            onClick={() => navigate(next, { replace: true })}
          >
            Continue without an account
          </button>
        </div>
        <p className="mt-6 text-center font-['Inter'] text-xs text-[#7a7268]">
          Already have an account?{" "}
          <Link to={`/login?next=${encodeURIComponent(next)}`} className="font-medium text-[#8a6a1c] underline underline-offset-4">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}

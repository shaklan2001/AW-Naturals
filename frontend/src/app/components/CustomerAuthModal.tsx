import { useCallback, useEffect, useId, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "motion/react";
import { Mail, Lock, User, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { useCustomerAuth } from "../context/CustomerAuthContext";

const fieldClass =
  "border-[#d8ccb8] bg-white/90 pl-10 text-[#1f1c18] shadow-[inset_0_1px_2px_rgba(255,255,255,0.85)] placeholder:text-[#9a9185] focus-visible:border-[#b8963e] focus-visible:ring-[#D4AF37]/25";

function friendlyAuthMessage(raw: string): string {
  const t = raw.trim();
  if (/password-realm|not allowed for the client/i.test(t)) {
    return "This sign-in method is not enabled for the Auth0 application yet. Your developer can turn on the Password (Resource Owner) grant or allow the password-realm grant in the Auth0 dashboard.";
  }
  if (
    /login script|implement the login script|get user script|custom database|use my own database/i.test(
      t
    )
  ) {
    return "Auth0’s database connection is set to “custom” but the Login script is empty or not deployed. In Auth0: Authentication → Database → your connection → Custom Database → implement the Login (and Get User) scripts, or switch the connection to use Auth0’s built-in store instead of a custom DB.";
  }
  if (/invalid audience|password grant exchange/i.test(t)) {
    return "The API audience in server config does not match Auth0. In Auth0: APIs → your API → copy the Identifier exactly into backend AUTH0_AUDIENCE. Then Applications → your Regular Web App → APIs → authorize that API for Password grant.";
  }
  if (/invalid_grant|wrong email or password|invalid user|invalid credentials/i.test(t)) {
    return "Invalid email or password.";
  }
  return t || "Something went wrong. Please try again.";
}

export function CustomerAuthModal() {
  const { authModal, closeAuthModal, openAuthModal, login, register, usesAuth0 } = useCustomerAuth();
  const open = authModal !== null;
  const titleId = useId();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);

  const resetFields = useCallback(() => {
    setEmail("");
    setPassword("");
    setName("");
    setConfirm("");
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!open) {
      resetFields();
      return;
    }
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open, resetFields]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeAuthModal();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, closeAuthModal]);

  const handleBackdropPointerDown = (e: React.PointerEvent) => {
    if (e.target === e.currentTarget) closeAuthModal();
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      toast.success("Signed in", { description: "Welcome back!" });
      resetFields();
      closeAuthModal();
    } catch (err) {
      const raw = err instanceof Error ? err.message : "Sign-in failed.";
      const msg = friendlyAuthMessage(raw);
      toast.error("Sign-in failed", { description: msg, duration: 6500 });
    } finally {
      setLoading(false);
    }
  };

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 8) {
      toast.error("Check your password", {
        description: "Password must be at least 8 characters.",
        duration: 5000,
      });
      return;
    }
    if (password !== confirm) {
      toast.error("Passwords do not match", { duration: 5000 });
      return;
    }
    setLoading(true);
    try {
      await register(name, email, password);
      toast.success("Account created", { description: "You're signed in and ready to shop." });
      resetFields();
      closeAuthModal();
    } catch (err) {
      const raw = err instanceof Error ? err.message : "Could not create account.";
      const msg = friendlyAuthMessage(raw);
      toast.error("Could not create account", { description: msg, duration: 6500 });
    } finally {
      setLoading(false);
    }
  };

  const modal = (
    <AnimatePresence>
      {open && (
        <motion.div
          key="customer-auth-overlay"
          role="presentation"
          className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.22 }}
          onPointerDown={handleBackdropPointerDown}
        >
          {/* Glassmorphic blue-light scrim — page content stays half-visible, frosted */}
          <div
            className="absolute inset-0 bg-gradient-to-br from-sky-400/20 via-cyan-900/25 to-emerald-950/35 backdrop-blur-[10px] backdrop-saturate-[1.35] sm:backdrop-blur-[14px]"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_90%_55%_at_50%_-10%,rgba(186,230,253,0.35),transparent_52%)]"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_80%_100%,rgba(52,211,153,0.12),transparent_45%)]"
            aria-hidden
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            className="relative w-full max-w-[420px] overflow-hidden rounded-[28px] border border-[#e8dcc8] bg-[#FAF5EB] p-7 text-[#2a2620] shadow-[0_28px_70px_-12px_rgba(0,0,0,0.45),0_0_0_1px_rgba(212,175,55,0.22),inset_0_1px_0_rgba(255,255,255,0.75)] sm:p-9"
            initial={{ opacity: 0, y: 18, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 14, scale: 0.98 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            onPointerDown={(e) => e.stopPropagation()}
          >
            <div
              className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#D4AF37]/50 to-transparent"
              aria-hidden
            />
            <div
              className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-[#fef9ef] opacity-80 blur-2xl"
              aria-hidden
            />

            <button
              type="button"
              onClick={() => closeAuthModal()}
              className="absolute right-3 top-3 z-10 rounded-full p-2 text-[#6b645c] transition-colors hover:bg-black/[0.06] hover:text-[#1a1815]"
              aria-label="Close"
            >
              <X className="h-5 w-5" aria-hidden />
            </button>

            <p className="text-center font-['Inter'] text-[10px] font-semibold uppercase tracking-[0.34em] text-[#9a7320]">
              Customer account
            </p>
            <h2
              id={titleId}
              className="mt-3 text-center font-['Gloock'] text-[2rem] tracking-tight text-[#1f1c18] md:text-[2.25rem]"
              style={{ fontWeight: 400 }}
            >
              {authModal === "login" ? "Sign in" : "Sign up"}
            </h2>

            {usesAuth0 ? (
              <p className="mt-3 text-center font-['Inter'] text-sm leading-relaxed text-[#5c554c]">
                Use your email and password below. Auth0 checks credentials on our server — you stay in this UI.
              </p>
            ) : null}
            {authModal === "login" ? (
              <p className={`text-center font-['Inter'] text-sm text-[#5c554c] ${usesAuth0 ? "mt-2" : "mt-3"}`}>
                New here?{" "}
                <button
                  type="button"
                  onClick={() => {
                    openAuthModal("signup");
                  }}
                  className="font-medium text-[#8a6a1c] underline decoration-[#D4AF37]/45 underline-offset-4 transition-colors hover:text-[#6b5214]"
                >
                  Create an account
                </button>
              </p>
            ) : (
              <p className={`text-center font-['Inter'] text-sm text-[#5c554c] ${usesAuth0 ? "mt-2" : "mt-3"}`}>
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => {
                    openAuthModal("login");
                  }}
                  className="font-medium text-[#8a6a1c] underline decoration-[#D4AF37]/45 underline-offset-4 transition-colors hover:text-[#6b5214]"
                >
                  Sign in
                </button>
              </p>
            )}

            {authModal === "login" ? (
              <form
                onSubmit={handleLoginSubmit}
                className="mt-8 space-y-5 rounded-2xl border border-[#e3d6c4] bg-[#FFFDF9]/95 p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_12px_32px_-8px_rgba(45,35,20,0.08)] sm:p-8"
              >
                <div className="space-y-2">
                  <Label htmlFor="modal-cust-email" className="text-[#4a443c]">
                    Email
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9a9185]" aria-hidden />
                    <Input
                      id="modal-cust-email"
                      type="email"
                      autoComplete="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      autoFocus
                      className={fieldClass}
                      placeholder="you@example.com"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="modal-cust-pass" className="text-[#4a443c]">
                    Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9a9185]" aria-hidden />
                    <Input
                      id="modal-cust-pass"
                      type="password"
                      autoComplete="current-password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className={fieldClass}
                      placeholder="••••••••"
                    />
                  </div>
                </div>
                <Button
                  type="submit"
                  disabled={loading}
                  className="mt-2 h-11 w-full rounded-full bg-[#D4AF37] font-semibold text-[#1a1815] shadow-[0_4px_14px_rgba(212,175,55,0.35)] transition-all hover:bg-[#c9a42f] disabled:opacity-60"
                >
                  {loading ? "Signing in…" : "Sign in"}
                </Button>
              </form>
            ) : (
              <form
                onSubmit={handleSignupSubmit}
                className="mt-8 space-y-5 rounded-2xl border border-[#e3d6c4] bg-[#FFFDF9]/95 p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_12px_32px_-8px_rgba(45,35,20,0.08)] sm:p-8"
              >
                <div className="space-y-2">
                  <Label htmlFor="modal-su-name" className="text-[#4a443c]">
                    Full name
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9a9185]" aria-hidden />
                    <Input
                      id="modal-su-name"
                      autoComplete="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      autoFocus
                      className={fieldClass}
                      placeholder="Your name"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="modal-su-email" className="text-[#4a443c]">
                    Email
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9a9185]" aria-hidden />
                    <Input
                      id="modal-su-email"
                      type="email"
                      autoComplete="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className={fieldClass}
                      placeholder="you@example.com"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="modal-su-pass" className="text-[#4a443c]">
                    Password (min 8 characters)
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9a9185]" aria-hidden />
                    <Input
                      id="modal-su-pass"
                      type="password"
                      autoComplete="new-password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      minLength={8}
                      className={fieldClass}
                      placeholder="••••••••"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="modal-su-confirm" className="text-[#4a443c]">
                    Confirm password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9a9185]" aria-hidden />
                    <Input
                      id="modal-su-confirm"
                      type="password"
                      autoComplete="new-password"
                      value={confirm}
                      onChange={(e) => setConfirm(e.target.value)}
                      required
                      className={fieldClass}
                      placeholder="••••••••"
                    />
                  </div>
                </div>
                <Button
                  type="submit"
                  disabled={loading}
                  className="mt-2 h-11 w-full rounded-full bg-[#D4AF37] font-semibold text-[#1a1815] shadow-[0_4px_14px_rgba(212,175,55,0.35)] transition-all hover:bg-[#c9a42f] disabled:opacity-60"
                >
                  {loading ? "Creating account…" : "Create account"}
                </Button>
              </form>
            )}
            <button
              type="button"
              onClick={() => {
                closeAuthModal();
              }}
              className="mt-5 w-full text-center font-['Inter'] text-xs font-medium text-[#6b645c] underline-offset-4 hover:text-[#3d382f] hover:underline"
            >
              Not now — keep browsing
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  if (typeof document === "undefined") return null;
  return createPortal(modal, document.body);
}

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod/v4";
import { Eye, EyeOff, Lock, Mail, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import logo from "@/assets/aw_natural_logo.png";
import { loginAdmin } from "@/api/auth-api";
import { useAdminStore } from "@/store/useAdminStore";

const schema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(1, "Password is required"),
});

type FormValues = z.infer<typeof schema>;

/** Logo-adjacent forest + Minimal primary (same family as admin sidebar). */
const BRAND_DEEP = "#0f3d2c";
const BRAND_PRIMARY = "#00a76f";

function displayRole(role: string): string {
  if (role === "super_admin") return "Super Admin";
  if (role === "admin") return "Admin";
  return role;
}

export function LoginPage() {
  const navigate = useNavigate();
  const updateProfile = useAdminStore((s) => s.updateProfile);
  const [showPass, setShowPass] = useState(false);

  useEffect(() => {
    document.title = "Sign in · AW Naturals Admin";
  }, []);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormValues) => {
    setError("");
    setLoading(true);
    try {
      const result = await loginAdmin(data.email, data.password);
      localStorage.setItem("aw-admin-auth", "true");
      localStorage.setItem("aw-admin-access-token", result.accessToken);
      updateProfile({
        name: result.user.name || "Admin",
        email: result.user.email,
        role: displayRole(result.user.role),
        avatar: "",
      });
      navigate("/dashboard", { replace: true });
    } catch (e) {
      const message =
        e instanceof TypeError && String(e.message).toLowerCase().includes("fetch")
          ? "Cannot reach the API. Start the backend (cd backend && npm run dev)."
          : e instanceof Error
            ? e.message
            : "Sign-in failed.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#f4f6f8]">
      <div className="minimal-auth-pattern relative hidden w-[46%] flex-col justify-between p-12 lg:flex xl:w-[42%]">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white via-[rgba(0,167,111,0.07)] to-[rgba(15,61,44,0.1)]" />
        <div className="relative flex items-center gap-3">
          <div
            className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-full shadow-[0_8px_28px_rgba(15,61,44,0.35)] ring-2 ring-[rgba(0,167,111,0.45)]"
            style={{ backgroundColor: BRAND_DEEP }}
          >
            <img src={logo} alt="AW Naturals" className="h-full w-full object-cover" />
          </div>
          <div>
            <div className="text-lg font-bold tracking-tight text-[#212b36]">AW Naturals</div>
            <div className="text-xs font-semibold text-[#637381]">Admin console</div>
          </div>
        </div>

        <div className="relative max-w-md space-y-5">
          <p className="text-xs font-bold uppercase tracking-[0.2em]" style={{ color: BRAND_PRIMARY }}>
            Dashboard
          </p>
          <h1 className="text-4xl font-bold leading-[1.15] tracking-tight text-[#212b36] xl:text-[2.75rem]">
            Manage your business with clarity.
          </h1>
          <p className="text-base leading-relaxed text-[#637381]">
            Products, orders, inventory, and content — unified in a clean workspace inspired by modern admin design
            systems.
          </p>
          <div className="flex flex-wrap gap-2 pt-2">
            {["Analytics", "Catalog", "Orders", "Content"].map((f) => (
              <span
                key={f}
                className="rounded-full border border-[rgba(0,167,111,0.28)] bg-white/90 px-3.5 py-1.5 text-xs font-semibold shadow-sm backdrop-blur-sm"
                style={{ color: BRAND_DEEP }}
              >
                {f}
              </span>
            ))}
          </div>
        </div>

        <p className="relative text-xs font-medium text-[#919eab]">
          © {new Date().getFullYear()} AW Naturals. All rights reserved.
        </p>
      </div>

      <div className="flex flex-1 items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-[440px]">
          <div className="mb-8 flex items-center gap-3 lg:hidden">
            <div
              className="flex h-12 w-12 shrink-0 overflow-hidden rounded-full ring-2 ring-[rgba(0,167,111,0.45)] shadow-md"
              style={{ backgroundColor: BRAND_DEEP }}
            >
              <img src={logo} alt="AW Naturals" className="h-full w-full object-cover" />
            </div>
            <span className="text-lg font-bold text-[#212b36]">AW Naturals</span>
          </div>

          <div className="rounded-2xl border border-[rgba(145,158,171,0.2)] bg-white p-8 shadow-[0_0_2px_rgba(145,158,171,0.2),0_24px_48px_-12px_rgba(145,158,171,0.16)] sm:p-10">
            <div className="mb-8">
              <h2 className="text-2xl font-bold tracking-tight text-[#212b36]">Sign in</h2>
              <p className="mt-2 text-sm text-[#637381]">Use your admin email and password.</p>
            </div>

            {error && (
              <div
                className="mb-6 flex items-start gap-3 rounded-xl border border-[rgba(255,86,48,0.24)] bg-[rgba(255,86,48,0.06)] px-4 py-3 text-sm text-[#b71d18]"
                role="alert"
              >
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email">Email address</Label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-[#919eab]" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="hello@company.com"
                    {...register("email")}
                    className="pl-11"
                  />
                </div>
                {errors.email && <p className="text-xs font-medium text-[#ff5630]">{errors.email.message}</p>}
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <button
                    type="button"
                    className="text-xs font-semibold text-[#00a76f] hover:text-[#007867]"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-[#919eab]" />
                  <Input
                    id="password"
                    type={showPass ? "text" : "password"}
                    placeholder="••••••••"
                    {...register("password")}
                    className="pl-11 pr-11"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass((s) => !s)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#919eab] hover:text-[#637381]"
                    tabIndex={-1}
                    aria-label={showPass ? "Hide password" : "Show password"}
                  >
                    {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.password && <p className="text-xs font-medium text-[#ff5630]">{errors.password.message}</p>}
              </div>

              <Button type="submit" className="h-11 w-full text-[15px]" disabled={loading}>
                {loading ? (
                  <span className="flex items-center gap-2">
                    <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden>
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                    Signing in…
                  </span>
                ) : (
                  "Sign in"
                )}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

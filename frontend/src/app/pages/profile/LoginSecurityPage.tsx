import { FormEvent, useState } from "react";
import { SectionWrapper } from "../../components/SectionWrapper";
import { GlassCard } from "@/shared/components/GlassCard";
import { Button } from "../../components/ui/button";
import { useCustomerAuth } from "../../context/CustomerAuthContext";
import { changeCustomerPassword } from "../../api/customer-auth-api";

export function LoginSecurityPage() {
  const { isAuthenticated, user, openAuthModal } = useCustomerAuth();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    setError(null);
    setMessage(null);
    try {
      await changeCustomerPassword({ currentPassword, newPassword });
      setCurrentPassword("");
      setNewPassword("");
      setMessage("Password updated successfully.");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not update password");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0B0B] pb-20 pt-28 text-[#F5F5DC]">
      <SectionWrapper className="max-w-4xl">
        <h1 className="mb-6 font-['Gloock'] text-4xl tracking-tight">Login & Security</h1>
        <GlassCard className="p-7 md:p-9" hoverEffect={false}>
          {!isAuthenticated ? (
            <div className="text-center">
              <p className="font-['Inter'] text-[#0b0b0b]/80">
                Sign in to change a local password. If you use Auth0 (email code), manage your password or email in
                your Auth0 account settings.
              </p>
              <Button
                type="button"
                className="mt-6 rounded-full bg-gradient-to-r from-[#D4AF37] to-[#b8860b] px-8 text-[#0b0b0b]"
                onClick={() => openAuthModal("login")}
              >
                Sign in
              </Button>
            </div>
          ) : null}
          {isAuthenticated ? (
          <>
          <p className="mb-6 text-sm text-[#0b0b0b]/70">Logged in as {user?.email}</p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.14em] text-[#0b0b0b]/70">
                Current Password
              </label>
              <input
                type="password"
                value={currentPassword}
                onChange={(event) => setCurrentPassword(event.target.value)}
                required
                className="h-12 w-full rounded-xl border border-[rgba(180,155,80,0.28)] bg-white/40 px-4 text-[#0b0b0b] outline-none focus:border-[#b8860b]"
              />
            </div>
            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.14em] text-[#0b0b0b]/70">
                New Password
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(event) => setNewPassword(event.target.value)}
                minLength={8}
                required
                className="h-12 w-full rounded-xl border border-[rgba(180,155,80,0.28)] bg-white/40 px-4 text-[#0b0b0b] outline-none focus:border-[#b8860b]"
              />
            </div>
            {error ? <p className="text-sm text-red-700">{error}</p> : null}
            {message ? <p className="text-sm text-[#2f7d32]">{message}</p> : null}
            <button
              type="submit"
              disabled={saving}
              className="inline-flex h-11 items-center rounded-full bg-gradient-to-r from-[#D4AF37] to-[#b8860b] px-8 text-sm font-semibold text-[#0b0b0b] disabled:opacity-60"
            >
              {saving ? "Updating..." : "Change Password"}
            </button>
          </form>
          </>
          ) : null}
        </GlassCard>
      </SectionWrapper>
    </div>
  );
}

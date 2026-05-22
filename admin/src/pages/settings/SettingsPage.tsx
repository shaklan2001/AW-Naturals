import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod/v4";
import { useQueryClient } from "@tanstack/react-query";
import { Save, User, Globe, Lock, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { AdminImageUploadField } from "@/components/forms/AdminImageUploadField";
import { useAdminStore } from "@/store/useAdminStore";
import { adminKeys, usePatchSiteSettings, useSiteSettings } from "@/hooks/use-admin-queries";
import type { Blog, Order, Product } from "@/types";

const profileSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  role: z.string(),
});

const websiteSchema = z.object({
  siteName: z.string().min(2),
  siteUrl: z.string().url(),
  logo: z.string().optional(),
  tagline: z.string(),
  instagram: z.string(),
  facebook: z.string(),
  twitter: z.string(),
  youtube: z.string(),
});

const passwordSchema = z
  .object({
    current: z.string().min(6),
    newPass: z.string().min(8, "Minimum 8 characters"),
    confirm: z.string(),
  })
  .refine((d) => d.newPass === d.confirm, { message: "Passwords don't match", path: ["confirm"] });

export function SettingsPage() {
  const { profile, updateProfile } = useAdminStore();
  const [saved, setSaved] = useState<string | null>(null);
  const siteQ = useSiteSettings();
  const patchSite = usePatchSiteSettings();
  const qc = useQueryClient();

  const profileForm = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: { name: profile.name, email: profile.email, role: profile.role },
  });

  const websiteForm = useForm({
    resolver: zodResolver(websiteSchema),
    defaultValues: {
      siteName: "",
      siteUrl: "",
      logo: "",
      tagline: "",
      instagram: "",
      facebook: "",
      twitter: "",
      youtube: "",
    },
  });
  const logoUrl = websiteForm.watch("logo");

  useEffect(() => {
    if (siteQ.data) {
      websiteForm.reset({
        siteName: siteQ.data.siteName,
        siteUrl: siteQ.data.siteUrl,
        logo: siteQ.data.logo ?? "",
        tagline: siteQ.data.tagline,
        instagram: siteQ.data.socialLinks.instagram,
        facebook: siteQ.data.socialLinks.facebook,
        twitter: siteQ.data.socialLinks.twitter,
        youtube: siteQ.data.socialLinks.youtube,
      });
    }
  }, [siteQ.data, websiteForm]);

  const passwordForm = useForm({ resolver: zodResolver(passwordSchema) });

  const toast = (msg: string) => {
    setSaved(msg);
    setTimeout(() => setSaved(null), 2500);
  };

  if (siteQ.isLoading) {
    return (
      <div className="flex items-center gap-2 py-12 text-sm text-[#637381]">
        <Loader2 className="h-5 w-5 animate-spin" /> Loading settings…
      </div>
    );
  }

  if (siteQ.isError) {
    return (
      <div className="space-y-2 text-sm text-[#b71d18]">
        <p>{siteQ.error.message}</p>
        <Button variant="outline" size="sm" onClick={() => siteQ.refetch()}>
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl space-y-6">
      {saved && (
        <div
          className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-xl border border-[rgba(0,167,111,0.24)] bg-[#00a76f] px-4 py-3 text-sm font-semibold text-white shadow-[0_8px_24px_rgba(0,167,111,0.35)] animate-in slide-in-from-bottom-4"
          role="status"
        >
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/20 text-xs">✓</span>
          {saved}
        </div>
      )}

      <div>
        <h1 className="text-2xl font-bold tracking-tight text-[#212b36]">Settings</h1>
        <p className="mt-1 text-sm text-[#637381]">Profile, site details, and security for this admin session.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-4 h-4" /> Admin Profile
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={profileForm.handleSubmit((d) => {
              updateProfile(d);
              toast("Profile saved!");
            })}
            className="space-y-4"
          >
            <div className="mb-4 flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[rgba(0,167,111,0.12)] text-2xl font-bold text-[#00a76f] ring-2 ring-[rgba(0,167,111,0.2)]">
                {profile.name[0] ?? "?"}
              </div>
              <div>
                <div className="font-semibold text-[#212b36]">{profile.name}</div>
                <div className="text-sm text-[#919eab]">{profile.role}</div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label>Full Name</Label>
                <Input {...profileForm.register("name")} />
                {profileForm.formState.errors.name && (
                  <p className="text-xs text-red-500">{profileForm.formState.errors.name.message}</p>
                )}
              </div>
              <div className="space-y-1">
                <Label>Role</Label>
                <Input {...profileForm.register("role")} />
              </div>
              <div className="col-span-2 space-y-1">
                <Label>Email</Label>
                <Input {...profileForm.register("email")} type="email" />
                {profileForm.formState.errors.email && (
                  <p className="text-xs text-red-500">{profileForm.formState.errors.email.message}</p>
                )}
              </div>
            </div>
            <Button type="submit">
              <Save className="w-4 h-4 mr-2" /> Save Profile
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="w-4 h-4" /> Website Settings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={websiteForm.handleSubmit(async (d) => {
              try {
                await patchSite.mutateAsync({
                  siteName: d.siteName,
                  siteUrl: d.siteUrl,
                  logo: d.logo || undefined,
                  tagline: d.tagline,
                  socialLinks: {
                    instagram: d.instagram,
                    facebook: d.facebook,
                    twitter: d.twitter,
                    youtube: d.youtube,
                  },
                });
                toast("Website settings saved!");
              } catch (e) {
                toast(e instanceof Error ? e.message : "Save failed");
              }
            })}
            className="space-y-4"
          >
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label>Site Name</Label>
                <Input {...websiteForm.register("siteName")} />
              </div>
              <div className="space-y-1">
                <Label>Site URL</Label>
                <Input {...websiteForm.register("siteUrl")} />
              </div>
              <div className="col-span-2 space-y-2">
                <Label>Logo URL</Label>
                <AdminImageUploadField
                  value={logoUrl ?? ""}
                  onUrlChange={(url) => websiteForm.setValue("logo", url, { shouldDirty: true })}
                  disabled={patchSite.isPending}
                />
                <Input {...websiteForm.register("logo")} placeholder="https://... (or upload above)" />
              </div>
              <div className="col-span-2 space-y-1">
                <Label>Tagline</Label>
                <Input {...websiteForm.register("tagline")} />
              </div>
            </div>

            <div>
              <div className="mb-3 text-sm font-semibold text-[#212b36]">Social links</div>
              <div className="space-y-3">
                {(["instagram", "facebook", "twitter", "youtube"] as const).map((key) => (
                  <div key={key} className="space-y-1">
                    <Label className="capitalize">{key}</Label>
                    <Input {...websiteForm.register(key)} placeholder={`https://${key}.com/...`} />
                  </div>
                ))}
              </div>
            </div>
            <Button type="submit" disabled={patchSite.isPending}>
              {patchSite.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving…
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" /> Save Settings
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="w-4 h-4" /> Change Password
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={passwordForm.handleSubmit(() => {
              passwordForm.reset();
              toast("Password updated!");
            })}
            className="space-y-4"
          >
            <div className="space-y-1">
              <Label>Current Password</Label>
              <Input {...passwordForm.register("current")} type="password" placeholder="••••••••" />
            </div>
            <div className="space-y-1">
              <Label>New Password</Label>
              <Input {...passwordForm.register("newPass")} type="password" placeholder="••••••••" />
              {passwordForm.formState.errors.newPass && (
                <p className="text-xs text-red-500">{passwordForm.formState.errors.newPass.message}</p>
              )}
            </div>
            <div className="space-y-1">
              <Label>Confirm Password</Label>
              <Input {...passwordForm.register("confirm")} type="password" placeholder="••••••••" />
              {passwordForm.formState.errors.confirm && (
                <p className="text-xs text-red-500">{passwordForm.formState.errors.confirm.message}</p>
              )}
            </div>
            <Button type="submit">
              <Save className="w-4 h-4 mr-2" /> Update Password
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Export Data</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4 text-sm text-[#637381]">
            Download cached API data from this session (JSON). Open a page first so lists are loaded.
          </p>
          <div className="flex flex-wrap gap-3">
            {(["Products", "Orders", "Blogs"] as const).map((label) => (
              <Button
                key={label}
                variant="outline"
                onClick={() => {
                  const key =
                    label === "Products"
                      ? adminKeys.products()
                      : label === "Orders"
                        ? adminKeys.orders()
                        : adminKeys.blogs();
                  const data = (qc.getQueryData(key) ?? []) as Product[] | Order[] | Blog[];
                  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement("a");
                  a.href = url;
                  a.download = `${label.toLowerCase()}.json`;
                  a.click();
                  URL.revokeObjectURL(url);
                }}
              >
                Export {label}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

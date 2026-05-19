import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AdminProfile } from "@/types";

const MOCK_PROFILE: AdminProfile = {
  name: "Admin User",
  email: "admin@awnaturals.com",
  avatar: "",
  role: "Super Admin",
};

interface AdminStore {
  profile: AdminProfile;
  updateProfile: (data: Partial<AdminProfile>) => void;
}

/** Local-only admin profile; catalog, orders, blogs, and site settings load from the API + TanStack Query. */
export const useAdminStore = create<AdminStore>()(
  persist(
    (set) => ({
      profile: MOCK_PROFILE,
      updateProfile: (data) =>
        set((s) => ({ profile: { ...s.profile, ...data } })),
    }),
    { name: "aw-admin-store", partialize: (s) => ({ profile: s.profile }) }
  )
);

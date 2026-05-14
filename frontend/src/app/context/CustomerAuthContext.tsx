import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  fetchCustomerProfile,
  loginCustomer,
  patchCustomerProfile,
  registerCustomer,
} from "../api/customer-auth-api";
import { CUSTOMER_TOKEN_KEY, CUSTOMER_USER_KEY } from "../api/customer-session";
import { toast } from "sonner";
import { isStorefrontAuth0Enabled } from "../auth/storefront-auth0";

export type CustomerProfile = { id: string; email: string; name: string; emailVerified?: boolean };
export type CustomerDetails = {
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  address: string;
  city: string;
  pincode: string;
};

export type CustomerAuthModalMode = "login" | "signup";

type CustomerAuthContextValue = {
  user: CustomerProfile | null;
  token: string | null;
  isAuthenticated: boolean;
  /** True when storefront is wired for Auth0-issued API tokens (email/password via your API, no hosted redirect). */
  usesAuth0: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  authModal: CustomerAuthModalMode | null;
  openAuthModal: (mode: CustomerAuthModalMode) => void;
  closeAuthModal: () => void;
  customerDetails: CustomerDetails;
  updateCustomerDetails: (patch: Partial<CustomerDetails>) => void;
  saveCustomerDetails: () => Promise<void>;
};

const CustomerAuthContext = createContext<CustomerAuthContextValue | null>(null);

const DETAILS_KEY_PREFIX = "aw-customer-details:";

const EMPTY_DETAILS: CustomerDetails = {
  email: "",
  firstName: "",
  lastName: "",
  phone: "",
  address: "",
  city: "",
  pincode: "",
};

function splitName(name: string): { firstName: string; lastName: string } {
  const trimmed = name.trim();
  if (!trimmed) return { firstName: "", lastName: "" };
  const parts = trimmed.split(/\s+/);
  return {
    firstName: parts[0] ?? "",
    lastName: parts.slice(1).join(" "),
  };
}

function detailsStorageKey(userId: string): string {
  return `${DETAILS_KEY_PREFIX}${userId}`;
}

function readStoredDetails(user: CustomerProfile | null): CustomerDetails {
  if (!user) return { ...EMPTY_DETAILS };
  try {
    const raw = localStorage.getItem(detailsStorageKey(user.id));
    const parsed = raw ? (JSON.parse(raw) as Partial<CustomerDetails>) : null;
    const split = splitName(user.name);
    return {
      ...EMPTY_DETAILS,
      firstName: split.firstName,
      lastName: split.lastName,
      email: user.email,
      ...(parsed ?? {}),
    };
  } catch {
    const split = splitName(user.name);
    return {
      ...EMPTY_DETAILS,
      firstName: split.firstName,
      lastName: split.lastName,
      email: user.email,
    };
  }
}

function readStoredUser(): CustomerProfile | null {
  try {
    const raw = localStorage.getItem(CUSTOMER_USER_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as CustomerProfile;
  } catch {
    return null;
  }
}

export function CustomerAuthProvider({ children }: { children: ReactNode }) {
  const usesAuth0 = isStorefrontAuth0Enabled();

  const [token, setToken] = useState(() => localStorage.getItem(CUSTOMER_TOKEN_KEY));
  const [user, setUser] = useState<CustomerProfile | null>(() => readStoredUser());
  const [customerDetails, setCustomerDetails] = useState<CustomerDetails>(() =>
    readStoredDetails(readStoredUser())
  );
  const [authModal, setAuthModal] = useState<CustomerAuthModalMode | null>(null);

  const openAuthModal = useCallback((mode: CustomerAuthModalMode) => {
    setAuthModal(mode);
  }, []);

  const closeAuthModal = useCallback(() => {
    setAuthModal(null);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(CUSTOMER_TOKEN_KEY);
    localStorage.removeItem(CUSTOMER_USER_KEY);
    setToken(null);
    setUser(null);
    setCustomerDetails({ ...EMPTY_DETAILS });
    toast.success("Signed out", { description: "You have been logged out successfully." });
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const data = await loginCustomer(email, password);
    localStorage.setItem(CUSTOMER_TOKEN_KEY, data.accessToken);
    localStorage.setItem(CUSTOMER_USER_KEY, JSON.stringify(data.user));
    setToken(data.accessToken);
    setUser(data.user);
    const profile = await fetchCustomerProfile();
    const [firstName, ...rest] = profile.name.trim().split(/\s+/);
    setCustomerDetails({
      email: profile.email,
      firstName: firstName ?? "",
      lastName: rest.join(" "),
      phone: profile.phone ?? "",
      address: profile.address ?? "",
      city: profile.city ?? "",
      pincode: profile.pincode ?? "",
    });
  }, []);

  const register = useCallback(
    async (name: string, email: string, password: string) => {
      await registerCustomer({ name, email, password });
      await login(email, password);
    },
    [login]
  );

  useEffect(() => {
    if (!user) return;
    const payload: CustomerDetails = {
      ...customerDetails,
      email: user.email,
    };
    localStorage.setItem(detailsStorageKey(user.id), JSON.stringify(payload));
  }, [user, customerDetails]);

  const updateCustomerDetails = useCallback((patch: Partial<CustomerDetails>) => {
    setCustomerDetails((prev) => ({ ...prev, ...patch }));
  }, []);

  const saveCustomerDetails = useCallback(async () => {
    if (!user) return;
    const name = `${customerDetails.firstName} ${customerDetails.lastName}`.trim();
    const profile = await patchCustomerProfile({
      name,
      email: customerDetails.email,
      phone: customerDetails.phone,
      address: customerDetails.address,
      city: customerDetails.city,
      pincode: customerDetails.pincode,
    });
    const nextUser: CustomerProfile = {
      id: profile.id,
      name: profile.name,
      email: profile.email,
      emailVerified: profile.emailVerified,
    };
    localStorage.setItem(CUSTOMER_USER_KEY, JSON.stringify(nextUser));
    setUser(nextUser);
  }, [user, customerDetails]);

  const value = useMemo(
    (): CustomerAuthContextValue => ({
      user,
      token,
      isAuthenticated: Boolean(token && user),
      usesAuth0,
      login,
      register,
      logout,
      authModal,
      openAuthModal,
      closeAuthModal,
      customerDetails,
      updateCustomerDetails,
      saveCustomerDetails,
    }),
    [
      user,
      token,
      usesAuth0,
      login,
      register,
      logout,
      authModal,
      openAuthModal,
      closeAuthModal,
      customerDetails,
      updateCustomerDetails,
      saveCustomerDetails,
    ]
  );

  return <CustomerAuthContext.Provider value={value}>{children}</CustomerAuthContext.Provider>;
}

export function useCustomerAuth(): CustomerAuthContextValue {
  const ctx = useContext(CustomerAuthContext);
  if (!ctx) {
    throw new Error("useCustomerAuth must be used within CustomerAuthProvider");
  }
  return ctx;
}

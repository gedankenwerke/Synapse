import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import Cookies from "js-cookie";
import { LoginRequestUser } from "../services/authentication/types";

const COOKIE_NAME = "auth_token";
const REFRESH_COOKIE_NAME = "refresh_token";
const COOKIE_MAX_AGE_DAYS = 7;

interface AppState {
  colorScheme: "light" | "dark";
  toggleColorScheme: () => void;
  setColorScheme: (scheme: "light" | "dark") => void;

  user: LoginRequestUser | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isSuperAdmin: boolean;

  setLogin: (accessToken: string, refreshToken: string, user: LoginRequestUser) => void;
  setSuperAdmin: (value: boolean) => void;
  setLogout: () => void;
  updateToken: (accessToken: string, refreshToken?: string) => void;
}

const noopStorage = {
  getItem: () => null,
  setItem: () => {},
  removeItem: () => {},
};

function safeLocalStorage(): Storage {
  try {
    const storage = window.localStorage;
    const key = "__zustand_test__";
    storage.setItem(key, "1");
    storage.removeItem(key);
    return storage;
  } catch {
    return noopStorage as unknown as Storage;
  }
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      colorScheme: "light",
      toggleColorScheme: () =>
        set((state) => ({
          colorScheme: state.colorScheme === "light" ? "dark" : "light",
        })),
      setColorScheme: (scheme) => set({ colorScheme: scheme }),

      user: null,
      token: null,
      refreshToken: null,
      isAuthenticated: false,
      isSuperAdmin: false,

      setLogin: (accessToken, refreshToken, user) => {
        const isSecure = typeof window !== "undefined" && window.location.protocol === "https:";
        const cookieOpts = {
          path: "/",
          expires: COOKIE_MAX_AGE_DAYS,
          sameSite: "Strict" as const,
          ...(isSecure && { secure: true }),
        };
        Cookies.set(COOKIE_NAME, accessToken, cookieOpts);
        Cookies.set(REFRESH_COOKIE_NAME, refreshToken, cookieOpts);
        set({ token: accessToken, refreshToken, user, isAuthenticated: true });
      },
      setSuperAdmin: (value) => set({ isSuperAdmin: value }),
      setLogout: () => {
        Cookies.remove(COOKIE_NAME, { path: "/" });
        Cookies.remove(REFRESH_COOKIE_NAME, { path: "/" });
        set({ token: null, refreshToken: null, user: null, isAuthenticated: false, isSuperAdmin: false });
      },
      updateToken: (accessToken: string, refreshToken?: string) => {
        const isSecure = typeof window !== "undefined" && window.location.protocol === "https:";
        const cookieOpts = {
          path: "/",
          expires: COOKIE_MAX_AGE_DAYS,
          sameSite: "Strict" as const,
          ...(isSecure && { secure: true }),
        };
        Cookies.set(COOKIE_NAME, accessToken, cookieOpts);
        if (refreshToken) {
          Cookies.set(REFRESH_COOKIE_NAME, refreshToken, cookieOpts);
        }
        set({ token: accessToken, ...(refreshToken && { refreshToken }) });
      },
    }),
    {
      name: "app-store",
      storage: createJSONStorage(() => safeLocalStorage()),
      onRehydrateStorage: () => (state) => {
        // If rehydrated state claims authenticated but token is missing, force logout
        if (state && state.isAuthenticated && !state.token) {
          state.isAuthenticated = false;
          state.user = null;
        }
        // Clean up legacy _zugang key from previous versions
        try {
          localStorage.removeItem("_zugang");
        } catch {}
      },
    }
  )
);

// Listen for token refresh events from the axios interceptor
if (typeof window !== "undefined") {
  window.addEventListener("token-refreshed", ((e: CustomEvent) => {
    const detail = e.detail as { access_token: string; refresh_token?: string };
    useAppStore.getState().updateToken(detail.access_token, detail.refresh_token);
  }) as EventListener);

  window.addEventListener("token-refresh-failed", () => {
    useAppStore.getState().setLogout();
  });
}
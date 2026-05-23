"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, usePathname } from "@/navigation";
import { useAppStore, getLayer } from "@/store/useAppStore";
import { usePermissionStore } from "@/store/usePermissionStore";
import { authentication } from "@/services/authentication";
import type { UserRole } from "@/services/authentication/types";

interface AuthGuardResult {
  hydrated: boolean;
  verifying: boolean;
  allowed: boolean;
}

export function useAuthGuard(requiredLayer: UserRole): AuthGuardResult {
  const router = useRouter();
  const pathname = usePathname();
  const isAuthenticated = useAppStore((state) => state.isAuthenticated);
  const token = useAppStore((state) => state.token);
  const setLogout = useAppStore((state) => state.setLogout);
  const refreshAll = usePermissionStore((state) => state.refreshAll);
  const [hydrated, setHydrated] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const lastVerified = useRef<number>(0);

  // Hydration gate
  useEffect(() => {
    if (useAppStore.persist.hasHydrated()) {
      setHydrated(true);
      return;
    }
    const unsub = useAppStore.persist.onFinishHydration(() => setHydrated(true));
    const timeout = setTimeout(() => setHydrated(true), 2000);
    return () => { unsub(); clearTimeout(timeout); };
  }, []);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!hydrated) return;
    if (!isAuthenticated || !token) {
      setLogout();
      router.replace("/");
    }
  }, [hydrated, isAuthenticated, token, router, setLogout]);

  // Verify role matches the route group
  useEffect(() => {
    if (!hydrated || !isAuthenticated || !token) return;
    const layer = getLayer();
    if (layer !== requiredLayer) {
      router.replace(`/${layer}/dashboard`);
    }
  }, [hydrated, isAuthenticated, token, requiredLayer, router]);

  // Verify token with /me on mount
  useEffect(() => {
    if (!hydrated || !isAuthenticated || !token) return;
    const verify = async () => {
      lastVerified.current = Date.now();
      setVerifying(true);
      try {
        await authentication.me();
      } catch (err: any) {
        if (err?.status === 401) {
          setLogout();
          router.replace("/");
        }
      } finally {
        setVerifying(false);
      }
    };
    verify();
  }, [hydrated, isAuthenticated, token, router, setLogout]);

  // Refresh permissions on navigation
  useEffect(() => {
    if (!hydrated || !isAuthenticated || !token) return;
    refreshAll();
  }, [pathname, hydrated, isAuthenticated, token, refreshAll]);

  const allowed = hydrated && isAuthenticated && !!token && getLayer() === requiredLayer;

  return { hydrated, verifying, allowed };
}
"use client";

import { ReactNode, useEffect } from "react";
import { account } from "@/lib/appwrite";
import { useAuthStore } from "@/store/auth";

export function AuthProvider({ children }: { children: ReactNode }) {
  const login = useAuthStore((s) => s.login);
  const logout = useAuthStore((s) => s.logout);
  const setBooted = useAuthStore((s) => s.setBooted);

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      try {
        const u = await account.get();
        if (!mounted) return;

        login({
          id: u.$id,
          name: u.name,
          email: u.email,
          avatar: (u as any)?.prefs?.avatar,
        });
      } catch {
        if (!mounted) return;
        logout();
      } finally {
        if (mounted) setBooted(true);
      }
    };

    load();

    return () => {
      mounted = false;
    };
  }, [login, logout, setBooted]);

  return <>{children}</>;
}

// Yeh hook direct zustand se booted state le aayega
export function useAuthBoot() {
  return useAuthStore((s) => s.booted);
}

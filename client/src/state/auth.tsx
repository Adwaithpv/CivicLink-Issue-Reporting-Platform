import type { ReactNode } from "react";
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { apiFetch } from "../lib/api";
import type { PublicUser } from "../lib/types";

type AuthContextValue = {
  user: PublicUser | null;
  isLoading: boolean;
  refresh: () => Promise<void>;
  login: (email: string, password: string) => Promise<PublicUser>;
  register: (name: string, email: string, password: string) => Promise<PublicUser>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<PublicUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refresh = useCallback(async () => {
    const data = await apiFetch<{ user: PublicUser | null }>("/api/auth/me");
    setUser(data.user);
  }, []);

  useEffect(() => {
    (async () => {
      try {
        await refresh();
      } finally {
        setIsLoading(false);
      }
    })();
  }, [refresh]);

  const login = useCallback(async (email: string, password: string) => {
    const data = await apiFetch<{ user: PublicUser }>("/api/auth/login", {
      method: "POST",
      body: { email, password },
    });
    setUser(data.user);
    return data.user;
  }, []);

  const register = useCallback(async (name: string, email: string, password: string) => {
    const data = await apiFetch<{ user: PublicUser }>("/api/auth/register", {
      method: "POST",
      body: { name, email, password },
    });
    setUser(data.user);
    return data.user;
  }, []);

  const logout = useCallback(async () => {
    await apiFetch<{ ok: true }>("/api/auth/logout", { method: "POST" });
    setUser(null);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({ user, isLoading, refresh, login, register, logout }),
    [user, isLoading, refresh, login, register, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}


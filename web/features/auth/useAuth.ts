/* ================================================================== */
/*  PORTKEY — Auth Hook (Vertical Slice)                              */
/*  React Context provider for global authentication state.           */
/*  Co-located with auth feature — types, service, and hook together. */
/* ================================================================== */

"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import {
  login as apiLogin,
  register as apiRegister,
  logout as apiLogout,
  getCurrentUser,
} from "./service";
import { hasTokens, getCachedUser } from "@/lib/token-store";
import type { LoginRequest, RegisterRequest, User } from "./types";
import toast from "react-hot-toast";

// ── Context shape ──────────────────────────────────────────────

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  register: (payload: RegisterRequest) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ── Provider ───────────────────────────────────────────────────

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialization — validate stored tokens on mount
  useEffect(() => {
    async function initAuth() {
      if (!hasTokens()) {
        setIsLoading(false);
        return;
      }

      // Optimistic UI: load cached user from localStorage first
      const cached = getCachedUser();
      if (cached) setUser(cached);

      // Background refresh to ensure valid session with server
      try {
        const freshUser = await getCurrentUser();
        setUser(freshUser);
      } catch {
        apiLogout(); // Token invalid or expired — clear and redirect
      } finally {
        setIsLoading(false);
      }
    }

    initAuth();
  }, []);

  // ── Actions ─────────────────────────────────────────────────

  const login = async (credentials: LoginRequest) => {
    setIsLoading(true);
    try {
      const { user: newUser } = await apiLogin(credentials);
      setUser(newUser);
      router.push("/dashboard");
      toast.success("Welcome back!");
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (payload: RegisterRequest) => {
    setIsLoading(true);
    try {
      const { user: newUser } = await apiRegister(payload);
      setUser(newUser);
      router.push("/dashboard");
      toast.success("Account created successfully!");
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    apiLogout();
    toast.success("Logged out successfully");
  };

  const refreshUser = async () => {
    try {
      const freshUser = await getCurrentUser();
      setUser(freshUser);
    } catch {
      apiLogout();
    }
  };

  // ── Provide ─────────────────────────────────────────────────

  return React.createElement(
    AuthContext.Provider,
    {
      value: {
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        refreshUser,
      },
    },
    children
  );
}

// ── Hook helper ────────────────────────────────────────────────

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

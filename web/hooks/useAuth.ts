/* ================================================================== */
/*  PORTKEY — useAuth Hook                                             */
/*  React Context provider for global authentication state.            */
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
} from "@/services/auth-service";
import { hasTokens, getCachedUser } from "@/lib/token-store";
import type { LoginRequest, RegisterRequest, User } from "@/types";
import toast from "react-hot-toast";

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

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  /* ---------------------- Initialization ---------------------- */
  useEffect(() => {
    async function initAuth() {
      if (!hasTokens()) {
        setIsLoading(false);
        return;
      }

      // Optimistically load from localStorage first for fast UI
      const cached = getCachedUser();
      if (cached) setUser(cached);

      // Background refresh to ensure valid session
      try {
        const freshUser = await getCurrentUser();
        setUser(freshUser);
      } catch {
        apiLogout();
      } finally {
        setIsLoading(false);
      }
    }

    initAuth();
  }, []);

  /* ---------------------- Actions ---------------------- */
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

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
    refreshUser,
  };

  return React.createElement(
    AuthContext.Provider,
    { value },
    children
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

/* ================================================================== */
/*  PORTKEY — Auth Service                                             */
/*  Handles login, register, session validation, and logout.           */
/* ================================================================== */

import apiClient from "@/lib/api-client";
import { setTokens, setCachedUser, clearTokens } from "@/lib/token-store";
import type {
  ApiResponse,
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  User,
} from "@/types";

/**
 * Authenticate a user with email and password.
 * Stores tokens + user on success.
 */
export async function login(credentials: LoginRequest): Promise<AuthResponse> {
  const { data } = await apiClient.post<ApiResponse<AuthResponse>>(
    "/auth/login",
    credentials,
  );

  if (!data.success || !data.data) {
    throw new Error(data.error?.message ?? "Login failed");
  }

  const authData = data.data;
  setTokens({ accessToken: authData.accessToken, refreshToken: authData.refreshToken });
  setCachedUser(authData.user);

  return authData;
}

/**
 * Register a new broker account.
 * Automatically logs the user in on success.
 */
export async function register(payload: RegisterRequest): Promise<AuthResponse> {
  const { data } = await apiClient.post<ApiResponse<AuthResponse>>(
    "/auth/register",
    payload,
  );

  if (!data.success || !data.data) {
    throw new Error(data.error?.message ?? "Registration failed");
  }

  const authData = data.data;
  setTokens({ accessToken: authData.accessToken, refreshToken: authData.refreshToken });
  setCachedUser(authData.user);

  return authData;
}

/**
 * Fetch the currently authenticated user's profile.
 */
export async function getCurrentUser(): Promise<User> {
  const { data } = await apiClient.get<ApiResponse<User>>("/auth/me");

  if (!data.success || !data.data) {
    throw new Error(data.error?.message ?? "Session invalid");
  }

  setCachedUser(data.data);
  return data.data;
}

/**
 * Clear all tokens and redirect to login.
 */
export function logout(): void {
  clearTokens();
  if (typeof window !== "undefined") {
    window.location.href = "/login";
  }
}

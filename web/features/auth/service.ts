/* ================================================================== */
/*  PORTKEY — Auth Feature Service (Vertical Slice)                   */
/*  Handles login, register, session validation, and logout.          */
/*  Co-located with auth feature — types, service, and hook together. */
/* ================================================================== */

import apiClient from "@/lib/api-client";
import { setTokens, setCachedUser, clearTokens } from "@/lib/token-store";
import type { ApiResponse } from "@/features/shared/api-response";
import type { AuthResponse, LoginRequest, RegisterRequest, User } from "./types";

/**
 * Authenticate a user with email and password.
 * Stores JWT tokens and cached user on success.
 */
export async function login(credentials: LoginRequest): Promise<AuthResponse> {
  const { data } = await apiClient.post<ApiResponse<AuthResponse>>(
    "/auth/login",
    credentials
  );

  if (!data.success || !data.data) {
    throw new Error(data.error?.message ?? "Login failed");
  }

  // Persist tokens and user for session continuity
  setTokens({
    accessToken: data.data.accessToken,
    refreshToken: data.data.refreshToken,
  });
  setCachedUser(data.data.user);

  return data.data;
}

/**
 * Register a new broker account.
 * Automatically logs the user in on success.
 */
export async function register(payload: RegisterRequest): Promise<AuthResponse> {
  const { data } = await apiClient.post<ApiResponse<AuthResponse>>(
    "/auth/register",
    payload
  );

  if (!data.success || !data.data) {
    throw new Error(data.error?.message ?? "Registration failed");
  }

  // Persist tokens and user for session continuity
  setTokens({
    accessToken: data.data.accessToken,
    refreshToken: data.data.refreshToken,
  });
  setCachedUser(data.data.user);

  return data.data;
}

/**
 * Fetch the currently authenticated user's profile from the server.
 * Refreshes the cached user data on success.
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
 * Clear all tokens and redirect to the login page.
 * Used for explicit logout and session expiry handling.
 */
export function logout(): void {
  clearTokens();
  if (typeof window !== "undefined") {
    window.location.href = "/login";
  }
}

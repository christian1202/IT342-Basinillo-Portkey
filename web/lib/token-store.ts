/* ================================================================== */
/*  PORTKEY — Token Store                                              */
/*  Thin localStorage wrapper for JWT tokens and cached user data.     */
/*  All auth state reads/writes go through this module.                */
/* ================================================================== */

import type { AuthTokens, User } from "@/types";

const KEYS = {
  ACCESS_TOKEN: "portkey_access_token",
  REFRESH_TOKEN: "portkey_refresh_token",
  USER: "portkey_user",
} as const;

/* ----------------------------- Tokens -------------------------------- */

export function getAccessToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(KEYS.ACCESS_TOKEN);
}

export function getRefreshToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(KEYS.REFRESH_TOKEN);
}

export function setTokens({ accessToken, refreshToken }: AuthTokens): void {
  localStorage.setItem(KEYS.ACCESS_TOKEN, accessToken);
  localStorage.setItem(KEYS.REFRESH_TOKEN, refreshToken);
}

export function clearTokens(): void {
  localStorage.removeItem(KEYS.ACCESS_TOKEN);
  localStorage.removeItem(KEYS.REFRESH_TOKEN);
  localStorage.removeItem(KEYS.USER);
}

/* ------------------------------ User --------------------------------- */

export function getCachedUser(): User | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(KEYS.USER);
  if (!raw) return null;

  try {
    return JSON.parse(raw) as User;
  } catch {
    return null;
  }
}

export function setCachedUser(user: User): void {
  localStorage.setItem(KEYS.USER, JSON.stringify(user));
}

/* ----------------------------- Checks -------------------------------- */

export function hasTokens(): boolean {
  return !!getAccessToken();
}

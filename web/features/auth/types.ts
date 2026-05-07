import type { ApiResponse } from "@/features/shared/api-response";

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export enum Role { BROKER = "BROKER", ADMIN = "ADMIN" }
export enum Plan { FREE = "FREE", PRO = "PRO" }

export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: Role;
  plan: Plan;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface LoginRequest { email: string; password: string; }

export interface RegisterRequest { email: string; password: string; firstName: string; lastName: string; }

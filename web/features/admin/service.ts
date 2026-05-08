/* ================================================================== */
/*  PORTKEY — Admin Feature Service (Vertical Slice)                   */
/*  Admin-only endpoints for global oversight and user management.     */
/* ================================================================== */

import apiClient from "@/lib/api-client";
import type { ApiResponse } from "@/features/shared/api-response";
import type { User } from "@/features/auth/types";
import type { Shipment } from "@/features/shipments/types";

/**
 * Fetch ALL shipments across all brokers.
 * Requires ADMIN role — enforced by backend SecurityConfig.
 */
export async function getAllShipments(): Promise<Shipment[]> {
  const { data } = await apiClient.get<ApiResponse<Shipment[]>>(
    "/admin/shipments"
  );

  if (!data.success) {
    throw new Error(data.error?.message ?? "Failed to fetch all shipments");
  }

  return data.data ?? [];
}

/**
 * Fetch all registered user accounts.
 * Requires ADMIN role — enforced by backend SecurityConfig.
 */
export async function getAllUsers(): Promise<User[]> {
  const { data } = await apiClient.get<ApiResponse<User[]>>("/admin/users");

  if (!data.success) {
    throw new Error(data.error?.message ?? "Failed to fetch users");
  }

  return data.data ?? [];
}

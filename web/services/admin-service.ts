/* ================================================================== */
/*  PORTKEY — Admin Service                                            */
/*  Admin-only endpoints for global oversight and user management.     */
/* ================================================================== */

import apiClient from "@/lib/api-client";
import type { ApiResponse, Shipment, User } from "@/types";

/**
 * Fetch ALL shipments across all brokers (admin only).
 */
export async function getAllShipments(): Promise<Shipment[]> {
  const { data } = await apiClient.get<ApiResponse<Shipment[]>>(
    "/admin/shipments",
  );

  if (!data.success) {
    throw new Error(data.error?.message ?? "Failed to fetch all shipments");
  }

  return data.data ?? [];
}

/**
 * Fetch all user accounts (admin only).
 */
export async function getAllUsers(): Promise<User[]> {
  const { data } = await apiClient.get<ApiResponse<User[]>>("/admin/users");

  if (!data.success) {
    throw new Error(data.error?.message ?? "Failed to fetch users");
  }

  return data.data ?? [];
}

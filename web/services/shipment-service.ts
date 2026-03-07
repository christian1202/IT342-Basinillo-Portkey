/* ================================================================== */
/*  PORTKEY — Shipment Service                                         */
/*  CRUD operations and analysis for shipments.                        */
/* ================================================================== */

import apiClient from "@/lib/api-client";
import type {
  ApiResponse,
  Shipment,
  ShipmentAnalysis,
  ShipmentFilters,
  CreateShipmentRequest,
  UpdateShipmentStatusRequest,
} from "@/types";

/**
 * Fetch all shipments for the current user (broker sees own, admin sees all).
 * Accepts optional filters for status, lane, and keyword search.
 */
export async function getShipments(filters?: ShipmentFilters): Promise<Shipment[]> {
  const params = new URLSearchParams();
  if (filters?.status) params.set("status", filters.status);
  if (filters?.lane) params.set("lane", filters.lane);
  if (filters?.search) params.set("search", filters.search);

  const { data } = await apiClient.get<ApiResponse<Shipment[]>>(
    `/shipments?${params.toString()}`,
  );

  if (!data.success) {
    throw new Error(data.error?.message ?? "Failed to fetch shipments");
  }

  return data.data ?? [];
}

/**
 * Fetch a single shipment by ID (includes items and documents).
 */
export async function getShipmentById(id: number): Promise<Shipment> {
  const { data } = await apiClient.get<ApiResponse<Shipment>>(`/shipments/${id}`);

  if (!data.success || !data.data) {
    throw new Error(data.error?.message ?? "Shipment not found");
  }

  return data.data;
}

/**
 * Create a new shipment with vessel info and cargo items.
 */
export async function createShipment(payload: CreateShipmentRequest): Promise<Shipment> {
  const { data } = await apiClient.post<ApiResponse<Shipment>>("/shipments", payload);

  if (!data.success || !data.data) {
    throw new Error(data.error?.message ?? "Failed to create shipment");
  }

  return data.data;
}

/**
 * Advance a shipment through its lifecycle stages.
 */
export async function updateShipmentStatus(
  id: number,
): Promise<Shipment> {
  const { data } = await apiClient.patch<ApiResponse<Shipment>>(
    `/shipments/${id}/status`,
  );

  if (!data.success || !data.data) {
    throw new Error(data.error?.message ?? "Failed to update status");
  }

  return data.data;
}

/**
 * Update a shipment's editable fields.
 */
export async function updateShipment(
  id: number,
  payload: Partial<CreateShipmentRequest>,
): Promise<Shipment> {
  const { data } = await apiClient.put<ApiResponse<Shipment>>(
    `/shipments/${id}`,
    payload,
  );

  if (!data.success || !data.data) {
    throw new Error(data.error?.message ?? "Failed to update shipment");
  }

  return data.data;
}

/**
 * Soft-delete a shipment.
 */
export async function deleteShipment(id: number): Promise<void> {
  const { data } = await apiClient.delete<ApiResponse<null>>(`/shipments/${id}`);

  if (!data.success) {
    throw new Error(data.error?.message ?? "Failed to delete shipment");
  }
}

/**
 * Fetch aggregated shipment analysis for the dashboard stat cards.
 */
export async function getShipmentAnalysis(): Promise<ShipmentAnalysis> {
  const { data } = await apiClient.get<ApiResponse<ShipmentAnalysis>>(
    "/shipments/analysis",
  );

  if (!data.success || !data.data) {
    throw new Error(data.error?.message ?? "Failed to fetch analysis");
  }

  return data.data;
}

/* ================================================================== */
/*  PORTKEY — Shipments Feature Types (Vertical Slice)                 */
/*  All shipment-related domain models and API request/response shapes. */
/* ================================================================== */

// ── Enums ─────────────────────────────────────────────────────

export enum ShipmentStatus {
  ARRIVED = "ARRIVED",
  LODGED = "LODGED",
  ASSESSED = "ASSESSED",
  PAID = "PAID",
  RELEASED = "RELEASED",
}

export enum ShipmentLane {
  GREEN = "GREEN",
  YELLOW = "YELLOW",
  RED = "RED",
}

// ── Core Models ───────────────────────────────────────────────

export interface Shipment {
  id: number;
  userId: number;
  vesselName: string;
  voyageNumber: string;
  arrivalDate: string;
  portOfDischarge: string;
  clientName: string;
  containerNumbers: string;
  descriptionOfGoods: string;
  freeDays: number;
  doomsdayDate: string;
  status: ShipmentStatus;
  lane: ShipmentLane;
  entryNumber: string | null;
  orNumber: string | null;
  deletedAt: string | null;
  createdAt: string;
  items: ShipmentItem[];
}

export interface ShipmentItem {
  id: number;
  shipmentId: number;
  description: string;
  hsCode: string;
  quantity: number;
  declaredValue: number;
  currency: string;
  phpConvertedValue: number;
  exchangeRate: number;
  createdAt: string;
}

// ── Request DTOs ──────────────────────────────────────────────

export interface CreateShipmentRequest {
  vesselName: string;
  voyageNumber: string;
  arrivalDate: string;
  portOfDischarge: string;
  clientName: string;
  containerNumbers: string;
  descriptionOfGoods: string;
  freeDays: number;
  items: CreateShipmentItemRequest[];
}

export interface CreateShipmentItemRequest {
  description: string;
  hsCode: string;
  quantity: number;
  declaredValue: number;
  currency: string;
}

// ── Analysis ──────────────────────────────────────────────────

export interface ShipmentAnalysis {
  totalShipments: number;
  activeShipments: number;
  completedShipments: number;
  averageLeadTimeDays: number;
}

// ── Filters ───────────────────────────────────────────────────

export interface ShipmentFilters {
  status?: ShipmentStatus;
  lane?: ShipmentLane;
  search?: string;
}

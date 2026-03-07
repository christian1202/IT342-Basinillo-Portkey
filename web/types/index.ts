/* ================================================================== */
/*  PORTKEY — Type Definitions                                         */
/*  Single source of truth for all API contracts and domain models.    */
/* ================================================================== */

/* -------------------------------- Enums -------------------------------- */

export enum Role {
  BROKER = "BROKER",
  ADMIN = "ADMIN",
}

export enum Plan {
  FREE = "FREE",
  PRO = "PRO",
}

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

export enum DocumentType {
  BL = "BL",
  CI = "CI",
  PL = "PL",
  PERMIT = "PERMIT",
  OTHER = "OTHER",
}

/* ----------------------------- API Envelope ----------------------------- */

export interface ApiError {
  code: string;
  message: string;
  details: Record<string, string> | string | null;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T | null;
  error: ApiError | null;
  timestamp: string;
}

/* -------------------------------- Auth --------------------------------- */

export interface User {
  id: number;
  email: string;
  firstname: string;
  lastname: string;
  role: Role;
  plan: Plan;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstname: string;
  lastname: string;
}

/* ------------------------------ Shipment ------------------------------ */

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

export interface UpdateShipmentStatusRequest {
  status: ShipmentStatus;
}

/* ------------------------------ Document ------------------------------ */

export interface ShipmentDocument {
  id: number;
  shipmentId: number;
  fileName: string;
  fileUrl: string;
  type: DocumentType;
  sizeBytes: number;
  uploadedAt: string;
}

/* ------------------------------ Analysis ------------------------------ */

export interface ShipmentAnalysis {
  totalShipments: number;
  activeShipments: number;
  completedShipments: number;
  averageLeadTimeDays: number;
}

/* ----------------------------- Filters -------------------------------- */

export interface ShipmentFilters {
  status?: ShipmentStatus;
  lane?: ShipmentLane;
  search?: string;
}

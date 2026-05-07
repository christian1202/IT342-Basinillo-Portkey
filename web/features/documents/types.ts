/* ================================================================== */
/*  PORTKEY — Documents Feature Types (Vertical Slice)                 */
/*  Document models matching the backend Document entity and enums.    */
/* ================================================================== */

export enum DocumentType {
  BL = "BL",
  CI = "CI",
  PL = "PL",
  PERMIT = "PERMIT",
  OTHER = "OTHER",
}

export interface ShipmentDocument {
  id: number;
  shipmentId: number;
  fileName: string;
  fileUrl: string;
  type: DocumentType;
  sizeBytes: number;
  uploadedAt: string;
}
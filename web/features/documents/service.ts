/* ================================================================== */
/*  PORTKEY — Documents Feature Service (Vertical Slice)               */
/*  Upload and fetch shipment-related documents.                       */
/* ================================================================== */

import apiClient from "@/lib/api-client";
import type { ApiResponse } from "@/features/shared/api-response";
import type { ShipmentDocument, DocumentType } from "./types";

/**
 * Upload a document for a given shipment.
 */
export async function uploadDocument(
  shipmentId: number,
  file: File,
  type: DocumentType
): Promise<ShipmentDocument> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("type", type);

  const { data } = await apiClient.post<ApiResponse<ShipmentDocument>>(
    `/shipments/${shipmentId}/documents`,
    formData,
    {
      headers: { "Content-Type": "multipart/form-data" },
    }
  );

  if (!data.success || !data.data) {
    throw new Error(data.error?.message ?? "Failed to upload document");
  }

  return data.data;
}

/**
 * Fetch all documents for a given shipment.
 */
export async function getDocuments(
  shipmentId: number
): Promise<ShipmentDocument[]> {
  const { data } = await apiClient.get<ApiResponse<ShipmentDocument[]>>(
    `/shipments/${shipmentId}/documents`
  );

  if (!data.success) {
    throw new Error(data.error?.message ?? "Failed to fetch documents");
  }

  return data.data ?? [];
}
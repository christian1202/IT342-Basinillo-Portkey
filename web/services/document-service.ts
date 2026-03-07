/* ================================================================== */
/*  PORTKEY — Document Service                                         */
/*  Upload and list documents attached to shipments.                   */
/* ================================================================== */

import apiClient from "@/lib/api-client";
import type { ApiResponse, ShipmentDocument, DocumentType } from "@/types";

/**
 * Upload a document to a shipment's vault.
 * Uses multipart/form-data for file upload.
 */
export async function uploadDocument(
  shipmentId: number,
  file: File,
  documentType: DocumentType,
): Promise<ShipmentDocument> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("documentType", documentType);

  const { data } = await apiClient.post<ApiResponse<ShipmentDocument>>(
    `/shipments/${shipmentId}/documents`,
    formData,
    { headers: { "Content-Type": "multipart/form-data" } },
  );

  if (!data.success || !data.data) {
    throw new Error(data.error?.message ?? "Failed to upload document");
  }

  return data.data;
}

/**
 * List all documents attached to a shipment.
 * Includes presigned download URLs.
 */
export async function getDocuments(
  shipmentId: number,
): Promise<ShipmentDocument[]> {
  const { data } = await apiClient.get<ApiResponse<ShipmentDocument[]>>(
    `/shipments/${shipmentId}/documents`,
  );

  if (!data.success) {
    throw new Error(data.error?.message ?? "Failed to fetch documents");
  }

  return data.data ?? [];
}

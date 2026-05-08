/* ================================================================== */
/*  PORTKEY — Shipments Hook (Vertical Slice)                         */
/*  Manages shipment data fetching, filtering, and mutations.          */
/*  Co-located with shipments feature — types, service, hook together. */
/* ================================================================== */

"use client";

import { useState, useCallback } from "react";
import * as shipmentApi from "./service";
import type {
  Shipment,
  ShipmentFilters,
  CreateShipmentRequest,
  ShipmentAnalysis,
} from "./types";
import toast from "react-hot-toast";

/**
 * Hook providing complete shipment management for a single screen.
 * Includes list fetching, analysis, create/update/delete mutations.
 */
export function useShipments() {
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [analysis, setAnalysis] = useState<ShipmentAnalysis | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ── Fetch list ──────────────────────────────────────────────

  const fetchShipments = useCallback(async (filters?: ShipmentFilters) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await shipmentApi.getShipments(filters);
      setShipments(data);
    } catch (err: any) {
      const msg = err.message || "Failed to load shipments";
      setError(msg);
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // ── Fetch analysis ──────────────────────────────────────────

  const fetchAnalysis = useCallback(async () => {
    try {
      const data = await shipmentApi.getShipmentAnalysis();
      setAnalysis(data);
    } catch (err: any) {
      console.error("Analysis load failed:", err);
    }
  }, []);

  // ── Mutations ───────────────────────────────────────────────

  const createShipment = async (payload: CreateShipmentRequest) => {
    try {
      const newShipment = await shipmentApi.createShipment(payload);
      setShipments((prev) => [newShipment, ...prev]);
      toast.success("Shipment created successfully");
      return newShipment;
    } catch (err: any) {
      toast.error(err.message || "Failed to create shipment");
      throw err;
    }
  };

  const editShipment = async (
    id: number,
    payload: Partial<CreateShipmentRequest>
  ) => {
    try {
      const updated = await shipmentApi.updateShipment(id, payload);
      setShipments((prev) =>
        prev.map((s) => (s.id === id ? updated : s))
      );
      toast.success("Shipment updated successfully");
      return updated;
    } catch (err: any) {
      toast.error(err.message || "Failed to update shipment");
      throw err;
    }
  };

  const advanceStatus = async (id: number) => {
    try {
      const updated = await shipmentApi.advanceShipmentStatus(id);
      setShipments((prev) =>
        prev.map((s) => (s.id === id ? updated : s))
      );
      toast.success(`Shipment advanced to ${updated.status}`);
      return updated;
    } catch (err: any) {
      toast.error(err.message || "Failed to update status");
      throw err;
    }
  };

  const removeShipment = async (id: number) => {
    try {
      await shipmentApi.deleteShipment(id);
      setShipments((prev) => prev.filter((s) => s.id !== id));
      toast.success("Shipment deleted");
    } catch (err: any) {
      toast.error(err.message || "Failed to delete shipment");
      throw err;
    }
  };

  return {
    shipments,
    analysis,
    isLoading,
    error,
    fetchShipments,
    fetchAnalysis,
    createShipment,
    editShipment,
    advanceStatus,
    removeShipment,
  };
}

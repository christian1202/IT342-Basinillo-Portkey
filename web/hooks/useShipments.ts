/* ================================================================== */
/*  PORTKEY — useShipments Hook                                        */
/*  Manages shipment data fetching and mutations.                      */
/* ================================================================== */

"use client";

import { useState, useCallback } from "react";
import * as shipmentApi from "@/services/shipment-service";
import type {
  Shipment,
  ShipmentFilters,
  CreateShipmentRequest,
  UpdateShipmentStatusRequest,
  ShipmentAnalysis,
} from "@/types";
import toast from "react-hot-toast";

export function useShipments() {
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [analysis, setAnalysis] = useState<ShipmentAnalysis | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /* ---------------------- Fetch list ---------------------- */
  const fetchShipments = useCallback(async (filters?: ShipmentFilters) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await shipmentApi.getShipments(filters);
      setShipments(data);
    } catch (err: any) {
      setError(err.message || "Failed to load shipments");
      toast.error(err.message || "Failed to load shipments");
    } finally {
      setIsLoading(false);
    }
  }, []);

  /* ---------------------- Analysis ---------------------- */
  const fetchAnalysis = useCallback(async () => {
    try {
      const data = await shipmentApi.getShipmentAnalysis();
      setAnalysis(data);
    } catch (err: any) {
      console.error("Analysis load failed:", err);
    }
  }, []);

  /* ---------------------- Mutations ---------------------- */
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

  const editShipment = async (id: number, payload: Partial<CreateShipmentRequest>) => {
    try {
      const updated = await shipmentApi.updateShipment(id, payload);
      setShipments((prev) => prev.map((s) => (s.id === id ? updated : s)));
      toast.success("Shipment updated successfully");
      return updated;
    } catch (err: any) {
      toast.error(err.message || "Failed to update shipment");
      throw err;
    }
  };

  const advanceStatus = async (id: number) => {
    try {
      const updated = await shipmentApi.updateShipmentStatus(id);
      setShipments((prev) => prev.map((s) => (s.id === id ? updated : s)));
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

/* ================================================================== */
/*  PORTKEY — Admin Hook (Vertical Slice)                              */
/*  Provides admin-only data fetching for the admin dashboard.         */
/*  Co-located with admin feature — types, service, hook together.     */
/* ================================================================== */

"use client";

import { useState, useCallback } from "react";
import * as adminApi from "./service";
import type { User } from "@/features/auth/types";
import type { Shipment } from "@/features/shipments/types";
import toast from "react-hot-toast";

/**
 * Hook for admin dashboard data — all shipments and all users.
 * Only accessible to users with ADMIN role.
 */
export function useAdmin() {
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ── Fetch all data ──────────────────────────────────────────

  const fetchAllData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [allShipments, allUsers] = await Promise.all([
        adminApi.getAllShipments(),
        adminApi.getAllUsers(),
      ]);
      setShipments(allShipments);
      setUsers(allUsers);
    } catch (err: any) {
      const msg = err.message || "Failed to load admin data";
      setError(msg);
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // ── Fetch shipments only ────────────────────────────────────

  const fetchShipments = useCallback(async () => {
    try {
      const data = await adminApi.getAllShipments();
      setShipments(data);
    } catch (err: any) {
      toast.error(err.message || "Failed to load shipments");
    }
  }, []);

  // ── Fetch users only ────────────────────────────────────────

  const fetchUsers = useCallback(async () => {
    try {
      const data = await adminApi.getAllUsers();
      setUsers(data);
    } catch (err: any) {
      toast.error(err.message || "Failed to load users");
    }
  }, []);

  return {
    shipments,
    users,
    isLoading,
    error,
    fetchAllData,
    fetchShipments,
    fetchUsers,
  };
}

/* ================================================================== */
/*  PORTKEY — Demurrage Watch Hook (Vertical Slice)                    */
/*  Calculates the demurrage countdown based on arrival date.          */
/*  Co-located with shipments feature.                                 */
/* ================================================================== */

"use client";

import { useMemo } from "react";

export interface DemurrageStatus {
  daysRemaining: number;
  urgency: "SAFE" | "WARNING" | "CRITICAL";
  colorClass: string;
  bgClass: string;
  borderClass: string;
}

/**
 * Calculates demurrage countdown from the arrival date.
 * Used in the shipment detail page's Demurrage Watch widget.
 * Returns null if no arrival date is provided.
 */
export function useDemurrage(arrivalDate: string | undefined | null): DemurrageStatus | null {
  return useMemo(() => {
    if (!arrivalDate) return null;

    const now = new Date();
    const arrival = new Date(arrivalDate);
    
    // 30-day free period after arrival before penalties kick in
    const penaltyDate = new Date(arrival);
    penaltyDate.setDate(penaltyDate.getDate() + 30);

    const diffMs = penaltyDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

    let urgency: "SAFE" | "WARNING" | "CRITICAL";
    let colorClass: string;
    let bgClass: string;
    let borderClass: string;

    if (diffDays > 14) {
      urgency = "SAFE";
      colorClass = "text-emerald-600 dark:text-emerald-400";
      bgClass = "bg-emerald-50 dark:bg-emerald-950/30";
      borderClass = "border-emerald-200 dark:border-emerald-800";
    } else if (diffDays > 0) {
      urgency = "WARNING";
      colorClass = "text-amber-600 dark:text-amber-400";
      bgClass = "bg-amber-50 dark:bg-amber-950/30";
      borderClass = "border-amber-200 dark:border-amber-800";
    } else {
      urgency = "CRITICAL";
      colorClass = "text-red-600 dark:text-red-400";
      bgClass = "bg-red-50 dark:bg-red-950/30";
      borderClass = "border-red-200 dark:border-red-800";
    }

    // Ensure daysRemaining is never a paradox
    const daysRemaining = diffDays;

    return {
      daysRemaining,
      urgency,
      colorClass,
      bgClass,
      borderClass,
    };
  }, [arrivalDate]);
}
/* ================================================================== */
/*  PORTKEY — useDemurrage Hook                                        */
/*  Calculates demurrage urgency based on a doomsday date.             */
/* ================================================================== */

"use client";

import { useMemo } from "react";
import { differenceInDays, parseISO } from "date-fns";

export type UrgencyLevel = "SAFE" | "WARNING" | "CRITICAL" | "EXPIRED";

interface DemurrageStatus {
  daysRemaining: number;
  urgency: UrgencyLevel;
  colorClass: string;
  bgClass: string;
  borderClass: string;
}

export function useDemurrage(doomsdayDateString: string | null | undefined): DemurrageStatus | null {
  return useMemo(() => {
    if (!doomsdayDateString) return null;

    try {
      const doomsday = parseISO(doomsdayDateString);
      const today = new Date();
      // Reset hours to compare purely by days
      today.setHours(0, 0, 0, 0);

      const daysRemaining = differenceInDays(doomsday, today);

      let urgency: UrgencyLevel;
      let colorClass: string;
      let bgClass: string;
      let borderClass: string;

      if (daysRemaining < 0) {
        urgency = "EXPIRED";
        colorClass = "text-slate-500";
        bgClass = "bg-slate-100 dark:bg-slate-800";
        borderClass = "border-slate-300 dark:border-slate-600";
      } else if (daysRemaining <= 1) {
        urgency = "CRITICAL";
        colorClass = "text-red-600 dark:text-red-400";
        bgClass = "bg-red-50 dark:bg-red-950/30";
        borderClass = "border-red-200 dark:border-red-800/50";
      } else if (daysRemaining <= 3) {
        urgency = "WARNING";
        colorClass = "text-amber-600 dark:text-amber-500";
        bgClass = "bg-amber-50 dark:bg-amber-950/30";
        borderClass = "border-amber-200 dark:border-amber-800/50";
      } else {
        urgency = "SAFE";
        colorClass = "text-emerald-600 dark:text-emerald-400";
        bgClass = "bg-emerald-50 dark:bg-emerald-950/30";
        borderClass = "border-emerald-200 dark:border-emerald-800/50";
      }

      return {
        daysRemaining,
        urgency,
        colorClass,
        bgClass,
        borderClass,
      };
    } catch {
      return null;
    }
  }, [doomsdayDateString]);
}

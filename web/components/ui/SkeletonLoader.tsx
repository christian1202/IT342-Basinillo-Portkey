"use client";

import { RefreshCw } from "lucide-react";

/* ================================================================== */
/*  SkeletonLoader                                                     */
/*  Reusable loading skeleton with a configurable row count.           */
/*                                                                     */
/*  Usage:                                                             */
/*    <SkeletonLoader />           → 3 rows (default)                  */
/*    <SkeletonLoader rows={5} />  → 5 rows                           */
/* ================================================================== */

interface SkeletonLoaderProps {
  /** Number of skeleton rows to display (default: 3). */
  rows?: number;
}

export default function SkeletonLoader({
  rows = 3,
}: SkeletonLoaderProps): React.JSX.Element {
  return (
    <div role="status" aria-label="Loading content" className="space-y-4">
      {/* Spinner */}
      <div className="flex justify-center py-2">
        <RefreshCw className="h-6 w-6 animate-spin text-indigo-500" />
      </div>

      {/* Shimmer rows */}
      {Array.from({ length: rows }).map((_, index) => (
        <div key={index} className="animate-pulse space-y-2">
          <div className="h-4 w-3/4 rounded-lg bg-slate-200 dark:bg-slate-700" />
          <div className="h-3 w-1/2 rounded-lg bg-slate-200/70 dark:bg-slate-700/70" />
        </div>
      ))}

      <span className="sr-only">Loading…</span>
    </div>
  );
}

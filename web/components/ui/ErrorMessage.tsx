"use client";

import { AlertTriangle, RefreshCw } from "lucide-react";

/* ================================================================== */
/*  ErrorMessage                                                       */
/*  Reusable error banner with an optional retry callback.             */
/*                                                                     */
/*  Usage:                                                             */
/*    <ErrorMessage message="Something went wrong" />                  */
/*    <ErrorMessage message="..." onRetry={refetch} />                 */
/* ================================================================== */

interface ErrorMessageProps {
  /** The error description to display. */
  message: string;
  /** Optional callback invoked when the user clicks "Retry". */
  onRetry?: () => void;
}

export default function ErrorMessage({
  message,
  onRetry,
}: ErrorMessageProps): React.JSX.Element {
  return (
    <div
      role="alert"
      className="flex flex-col items-center gap-4 rounded-xl border border-red-200 bg-red-50 px-6 py-5 dark:border-red-800 dark:bg-red-950/50"
    >
      {/* Icon + Message */}
      <div className="flex items-center gap-3">
        <AlertTriangle className="h-5 w-5 shrink-0 text-red-500 dark:text-red-400" />
        <p className="text-sm font-medium text-red-700 dark:text-red-300">
          {message}
        </p>
      </div>

      {/* Retry button (only rendered when onRetry is provided) */}
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="inline-flex items-center gap-2 rounded-xl bg-red-100 px-4 py-2 text-sm font-semibold text-red-700 transition-colors hover:bg-red-200 dark:bg-red-900/40 dark:text-red-300 dark:hover:bg-red-900/60"
        >
          <RefreshCw className="h-4 w-4" />
          Retry
        </button>
      )}
    </div>
  );
}

"use client";

import { useEffect, useCallback } from "react";
import { X } from "lucide-react";

/* ================================================================== */
/*  Modal                                                              */
/*  Reusable overlay dialog with backdrop-click and Escape-to-close.   */
/*                                                                     */
/*  Usage:                                                             */
/*    <Modal isOpen={showForm} onClose={() => setShowForm(false)}      */
/*           title="Create Shipment">                                  */
/*      <ShipmentForm ... />                                           */
/*    </Modal>                                                         */
/* ================================================================== */

interface ModalProps {
  /** Controls visibility — renders nothing when false. */
  isOpen: boolean;
  /** Callback to close the modal (backdrop click, X, or Escape). */
  onClose: () => void;
  /** Title displayed in the modal header. */
  title: string;
  /** Content rendered inside the modal body. */
  children: React.ReactNode;
}

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
}: ModalProps): React.JSX.Element | null {
  /* ---- Close on Escape key ---- */
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    },
    [onClose],
  );

  useEffect(() => {
    if (!isOpen) return;
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, handleKeyDown]);

  /* ---- Prevent body scroll while open ---- */
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  /* ---- Don't render anything when closed ---- */
  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={title}
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
    >
      {/* ---- Backdrop (click to close) ---- */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* ---- Panel ---- */}
      <div className="relative w-full max-w-lg rounded-2xl border border-slate-200/60 bg-white p-6 shadow-2xl dark:border-slate-700/60 dark:bg-slate-900 sm:p-8">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-200"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        {children}
      </div>
    </div>
  );
}

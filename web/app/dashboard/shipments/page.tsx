"use client";

import { useEffect } from "react";
import { useShipments } from "@/hooks/useShipments";
import { ShipmentLane, ShipmentStatus } from "@/types";
import { format } from "date-fns";
import Link from "next/link";
import { Plus, Search, Filter, Ship, Plane, Package } from "lucide-react";

export default function ShipmentsListPage() {
  const { shipments, isLoading, error, fetchShipments } = useShipments();

  useEffect(() => {
    fetchShipments();
  }, [fetchShipments]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Shipment Declarations
          </h2>
          <p className="text-slate-500 dark:text-slate-400">
            Manage and track all container and airway bills.
          </p>
        </div>
        <Link
          href="/dashboard/shipments/new"
          className="inline-flex items-center justify-center rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-slate-950 sm:w-auto"
        >
          <Plus className="-ml-1 mr-2 h-4 w-4" />
          Declare Shipment
        </Link>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col gap-4 md:flex-row">
        <div className="relative flex-1">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <Search className="h-5 w-5 text-slate-400" />
          </div>
          <input
            type="text"
            className="block w-full rounded-xl border border-slate-300 bg-white py-2.5 pl-10 pr-3 text-sm placeholder-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-slate-800 dark:bg-slate-950 dark:text-white"
            placeholder="Search by Vessel or Client..."
          />
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300 dark:hover:bg-slate-900">
            <Filter className="h-4 w-4" />
            Lane
          </button>
           <button className="flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300 dark:hover:bg-slate-900">
            <Filter className="h-4 w-4" />
            Status
          </button>
        </div>
      </div>

       {/* List of Shipments */}
       <div className="rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-950 overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center text-slate-500 dark:text-slate-400">Loading shipments...</div>
        ) : error ? (
           <div className="p-12 text-center text-red-500">{error}</div>
        ) : shipments.length === 0 ? (
           <div className="p-12 text-center">
             <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-900">
               <Package className="h-8 w-8 text-slate-400" />
             </div>
             <h3 className="mt-4 text-lg font-medium text-slate-900 dark:text-white">No shipments found</h3>
             <p className="mt-1 text-slate-500 dark:text-slate-400">Get started by declaring a new shipment.</p>
           </div>
        ) : (
          <ul className="divide-y divide-slate-200 dark:divide-slate-800">
            {shipments.map((shipment) => (
              <li key={shipment.id}>
                <Link
                  href={`/dashboard/shipments/${shipment.id}`}
                  className="block p-4 sm:p-6 hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      {/* Icon based on Lane */}
                      <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${
                        shipment.lane === ShipmentLane.GREEN 
                          ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400" 
                          : shipment.lane === ShipmentLane.YELLOW 
                          ? "bg-amber-50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400"
                          : "bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400"
                      }`}>
                        {shipment.lane === ShipmentLane.GREEN ? <Ship className="h-6 w-6" /> : <Package className="h-6 w-6" />}
                      </div>
                      
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-semibold text-indigo-600 dark:text-indigo-400">
                            {shipment.vesselName} / {shipment.voyageNumber}
                          </p>
                          <span className="inline-flex rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-slate-800 dark:bg-slate-800 dark:text-slate-300">
                            {shipment.status.replace(/_/g, " ")}
                          </span>
                        </div>
                        <p className="mt-1 text-base font-medium text-slate-900 dark:text-white">
                          {shipment.clientName}
                        </p>
                      </div>
                    </div>

                    <div className="hidden text-right sm:block">
                      <p className="text-sm font-medium text-slate-900 dark:text-white">
                         PoD: {shipment.portOfDischarge}
                      </p>
                      <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                        ETA: {shipment.arrivalDate 
                            ? format(new Date(shipment.arrivalDate), "MMM dd, yyyy")
                            : "Pending"}
                      </p>
                    </div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
       </div>
    </div>
  );
}

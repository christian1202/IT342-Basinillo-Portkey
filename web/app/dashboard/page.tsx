"use client";

import { useShipments } from "@/hooks/useShipments";
import { format } from "date-fns";
import { ShipmentStatus, ShipmentLane } from "@/types";
import { Anchor, ArrowUpRight, Clock, MapPin, Package } from "lucide-react";

export default function DashboardOverview() {
  const { shipments, isLoading } = useShipments();

  // Mock stats since the backend analysis endpoint might not return all these yet
  const activeCount = shipments.filter(
    (s) => s.status !== ShipmentStatus.RELEASED
  ).length;
  const completedCount = shipments.filter(
    (s) => s.status === ShipmentStatus.RELEASED
  ).length;
  const seaFreightCount = shipments.filter(
    (s) => s.lane === ShipmentLane.GREEN || s.lane === ShipmentLane.YELLOW
  ).length;

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          Overview
        </h2>
        <p className="text-slate-500 dark:text-slate-400">
          Your active shipments and recent activity.
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400">Total Active</h3>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
              <Package className="h-5 w-5" />
            </div>
          </div>
          <p className="mt-4 text-3xl font-bold text-slate-900 dark:text-white">{activeCount}</p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400">Clearance Completed</h3>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400">
              <Anchor className="h-5 w-5" />
            </div>
          </div>
          <p className="mt-4 text-3xl font-bold text-slate-900 dark:text-white">{completedCount}</p>
        </div>

         <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400">Sea Freight</h3>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400">
              <MapPin className="h-5 w-5" />
            </div>
          </div>
          <p className="mt-4 text-3xl font-bold text-slate-900 dark:text-white">{seaFreightCount}</p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400">At Risk (Demurrage)</h3>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400">
              <Clock className="h-5 w-5" />
            </div>
          </div>
          <p className="mt-4 text-3xl font-bold text-slate-900 dark:text-white">0</p>
        </div>
      </div>

      {/* Recent Shipments Table */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-950">
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5 dark:border-slate-800">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Recent Shipments</h3>
          <button className="flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300">
            View all <ArrowUpRight className="ml-1 h-4 w-4" />
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600 dark:text-slate-400">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500 dark:bg-slate-900/50 dark:text-slate-400">
              <tr>
                <th className="px-6 py-4 font-medium">Vessel / Voyage</th>
                <th className="px-6 py-4 font-medium">Client</th>
                <th className="px-6 py-4 font-medium">PoD</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium">Arrival Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
               {isLoading ? (
                 <tr>
                   <td colSpan={5} className="px-6 py-8 text-center">Loading shipments...</td>
                 </tr>
               ) : shipments.length === 0 ? (
                 <tr>
                   <td colSpan={5} className="px-6 py-8 text-center">No active shipments found.</td>
                 </tr>
               ) : (
                 shipments.slice(0, 5).map((shipment) => (
                  <tr key={shipment.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/50">
                    <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">
                      {shipment.vesselName} / {shipment.voyageNumber}
                    </td>
                    <td className="px-6 py-4">{shipment.clientName}</td>
                    <td className="px-6 py-4">
                      {shipment.portOfDischarge}
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-800 dark:bg-slate-800 dark:text-slate-300">
                        {shipment.status.replace(/_/g, " ")}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {shipment.arrivalDate 
                        ? format(new Date(shipment.arrivalDate), "MMM dd, yyyy")
                        : "Pending"}
                    </td>
                  </tr>
                ))
               )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

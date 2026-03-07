"use client";

import { useEffect, useState } from "react";
import { useShipments } from "@/hooks/useShipments";
import { getShipmentById } from "@/services/shipment-service";
import { Shipment, ShipmentStatus } from "@/types";
import { format } from "date-fns";
import { useDemurrage } from "@/hooks/useDemurrage";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  ArrowLeft, 
  MapPin, 
  Clock, 
  Package, 
  AlertTriangle,
  FileText,
  Trash2
} from "lucide-react";
import SkeletonLoader from "@/components/ui/SkeletonLoader";
import Button from "@/components/ui/Button";

export default function ShipmentDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { advanceStatus, removeShipment } = useShipments();
  const [isAdvancing, setIsAdvancing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  
  const [shipment, setShipment] = useState<Shipment | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const demurrage = useDemurrage(shipment?.arrivalDate); // Using ETA as a mock doomsday for MVP, real app would use a specific clearance deadline

  const handleAdvance = async () => {
    setIsAdvancing(true);
    try {
      const updated = await advanceStatus(Number(params.id));
      setShipment(updated);
    } catch {} finally {
      setIsAdvancing(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to permanently delete this shipment? This action cannot be undone.")) {
      setIsDeleting(true);
      try {
        await removeShipment(Number(params.id));
        router.push("/dashboard/shipments");
      } catch {} finally {
        setIsDeleting(false);
      }
    }
  };

  useEffect(() => {
    async function fetchDetails() {
      try {
        const data = await getShipmentById(Number(params.id));
        setShipment(data);
      } catch (err: any) {
        setError(err.message || "Failed to load shipment details.");
      } finally {
        setIsLoading(false);
      }
    }
    fetchDetails();
  }, [params.id]);

  if (isLoading) {
    return <SkeletonLoader rows={6} />;
  }

  if (error || !shipment) {
    return (
      <div className="flex h-64 flex-col items-center justify-center rounded-xl border border-red-200 bg-red-50 text-red-600 dark:border-red-900/50 dark:bg-red-950/20 dark:text-red-400">
        <AlertTriangle className="mb-4 h-8 w-8 text-red-500" />
        <p className="font-medium">{error || "Shipment not found."}</p>
        <Link href="/dashboard/shipments" className="mt-4 underline hover:text-red-700">
          Go back to shipments
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
         <div className="flex items-center gap-4">
          <Link
            href="/dashboard/shipments"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-slate-500 shadow-sm transition-colors hover:bg-slate-50 hover:text-slate-900 dark:bg-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="flex items-center gap-3 text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              {shipment.vesselName} / {shipment.voyageNumber}
              <span className="inline-flex rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold uppercase tracking-wider text-slate-800 dark:bg-slate-800 dark:text-slate-300">
                {shipment.status.replace(/_/g, " ")}
              </span>
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Created on {format(new Date(shipment.createdAt), "MMMM dd, yyyy")}
            </p>
          </div>
        </div>

        <div className="flex gap-2">
           <Button variant="outline" className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 dark:border-red-900/50 dark:hover:bg-red-950/30" onClick={handleDelete} isLoading={isDeleting}>
             <Trash2 className="mr-2 h-4 w-4" />
             Delete
           </Button>
           <Link href={`/dashboard/shipments/${shipment.id}/edit`}>
             <Button variant="outline">Edit Details</Button>
           </Link>
           {shipment.status !== ShipmentStatus.RELEASED && shipment.status !== ShipmentStatus.PAID && (
             <Button onClick={handleAdvance} isLoading={isAdvancing}>Advance Status</Button>
           )}
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Left Column (2/3) - Main Details & Progress */}
        <div className="space-y-6 md:col-span-2">
          
          {/* Progress Tracker Widget */}
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
            <h3 className="mb-6 text-base font-semibold text-slate-900 dark:text-white">Clearance Progress</h3>
            
            {/* Simple CSS-based progress bar representation */}
            <div className="relative">
              <div className="absolute left-0 top-1/2 h-0.5 w-full -translate-y-1/2 bg-slate-200 dark:bg-slate-800"></div>
              
              <div className="relative flex justify-between">
                 {/* Step 1 */}
                <div className="flex flex-col items-center gap-2">
                  <div className={`z-10 flex h-6 w-6 items-center justify-center rounded-full box-content border-4 border-white dark:border-slate-950 bg-indigo-600 text-white`}>
                    <div className="h-2 w-2 rounded-full bg-white"></div>
                  </div>
                  <span className="text-xs font-medium text-slate-700 dark:text-slate-300">Lodged</span>
                </div>
                 {/* Step 2 */}
                <div className="flex flex-col items-center gap-2">
                  <div className={`z-10 flex h-6 w-6 items-center justify-center rounded-full box-content border-4 border-white dark:border-slate-950 ${shipment.status !== ShipmentStatus.LODGED ? 'bg-indigo-600' : 'bg-slate-200 dark:bg-slate-800'}`}>
                     {shipment.status !== ShipmentStatus.LODGED && <div className="h-2 w-2 rounded-full bg-white"></div>}
                  </div>
                  <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Assessed</span>
                </div>
                 {/* Step 3 */}
                <div className="flex flex-col items-center gap-2">
                  <div className={`z-10 flex h-6 w-6 items-center justify-center rounded-full box-content border-4 border-white dark:border-slate-950 ${shipment.status === ShipmentStatus.RELEASED || shipment.status === ShipmentStatus.PAID ? 'bg-indigo-600' : 'bg-slate-200 dark:bg-slate-800'}`}>
                    {(shipment.status === ShipmentStatus.RELEASED || shipment.status === ShipmentStatus.PAID) && <div className="h-2 w-2 rounded-full bg-white"></div>}
                  </div>
                  <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Paid & Released</span>
                </div>
              </div>
            </div>
          </div>

          {/* Cargo Specs */}
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
            <h3 className="mb-4 flex items-center gap-2 text-base font-semibold text-slate-900 dark:text-white">
              <Package className="h-5 w-5 text-indigo-500" />
              Cargo Description
            </h3>
            <p className="text-sm text-slate-700 dark:text-slate-300 whitespace-pre-wrap">
              {shipment.descriptionOfGoods}
            </p>
            
            <div className="mt-6 grid grid-cols-2 gap-4 rounded-lg bg-slate-50 p-4 dark:bg-slate-900/50 text-sm">
              <div>
                <span className="block text-slate-500 dark:text-slate-400">Client</span>
                <span className="font-medium text-slate-900 dark:text-white">{shipment.clientName}</span>
              </div>
              <div>
                <span className="block text-slate-500 dark:text-slate-400">Containers</span>
                <span className="font-medium text-slate-900 dark:text-white">{shipment.containerNumbers}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (1/3) - Sidebar Widget */}
        <div className="space-y-6">
          
          {/* Demurrage Watch */}
          <div className={`rounded-xl border p-6 shadow-sm transition-colors ${demurrage ? `${demurrage.bgClass} ${demurrage.borderClass}` : 'bg-white border-slate-200 dark:bg-slate-950 dark:border-slate-800'}`}>
             <h3 className="mb-4 flex items-center gap-2 text-base font-semibold text-slate-900 dark:text-white">
              <Clock className={`h-5 w-5 ${demurrage ? demurrage.colorClass : 'text-slate-400'}`} />
              Demurrage Watch
            </h3>
            
            {demurrage ? (
              <div className="text-center py-4">
                <div className={`text-5xl font-extrabold tracking-tight ${demurrage.colorClass} ${demurrage.urgency === 'CRITICAL' ? 'animate-pulse' : ''}`}>
                  {demurrage.daysRemaining > 0 ? demurrage.daysRemaining : 0}
                </div>
                <p className={`mt-2 text-sm font-medium ${demurrage.colorClass}`}>
                  {demurrage.daysRemaining > 0 ? "Days Until Penalties" : "Penalties Incurred"}
                </p>
              </div>
            ) : (
                <div className="text-center py-6 text-sm text-slate-500">
                  Setup arrival date to enable countdown
                </div>
            )}
          </div>

          {/* Route Info */}
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
             <h3 className="mb-4 flex items-center gap-2 text-base font-semibold text-slate-900 dark:text-white">
              <MapPin className="h-5 w-5 text-indigo-500" />
              Routing
            </h3>
            
            <div className="relative pl-6 before:absolute before:inset-y-2 before:left-[11px] before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800">
              <div className="relative mb-6">
                <div className="absolute -left-[29px] top-1.5 h-3 w-3 rounded-full border-2 border-indigo-600 bg-white dark:bg-slate-950"></div>
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wider dark:text-slate-400">Vessel</p>
                <p className="font-semibold text-slate-900 dark:text-white">{shipment.vesselName}</p>
              </div>
              
              <div className="relative">
                <div className="absolute -left-[29px] top-1.5 h-3 w-3 rounded-full border-2 border-indigo-600 bg-white dark:bg-slate-950"></div>
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wider dark:text-slate-400">PoD (Destination Port)</p>
                <p className="font-semibold text-slate-900 dark:text-white">{shipment.portOfDischarge}</p>
                <p className="text-sm mt-1 text-slate-500">
                  ETA: {shipment.arrivalDate ? format(new Date(shipment.arrivalDate), "MMM dd, yyyy") : "N/A"}
                </p>
              </div>
            </div>
          </div>

          {/* Document Vault Link */}
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
             <h3 className="mb-2 text-base font-semibold text-slate-900 dark:text-white">Document Vault</h3>
             <p className="text-sm text-slate-500 mb-4 dark:text-slate-400">
               Manage Proforma Invoices, BLs, and Permits securely in R2.
             </p>
             <Link
                href={`/dashboard/shipments/${shipment.id}/documents`}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-slate-100 px-4 py-2.5 text-sm font-medium text-slate-900 transition-colors hover:bg-slate-200 dark:bg-slate-900/80 dark:text-white dark:hover:bg-slate-800"
              >
                <FileText className="h-4 w-4" />
                Open Vault
              </Link>
          </div>

        </div>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useShipments } from "@/hooks/useShipments";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { ArrowLeft, Package, MapPin, Anchor, Plane } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";

export default function CreateShipmentPage() {
  const router = useRouter();
  const { createShipment } = useShipments();
  const [isLoading, setIsLoading] = useState(false);

  // Form State matching backend SDD
  const [vesselName, setVesselName] = useState("");
  const [voyageNumber, setVoyageNumber] = useState("");
  const [clientName, setClientName] = useState("");
  const [portOfDischarge, setPortOfDischarge] = useState("");
  const [arrivalDate, setArrivalDate] = useState("");
  const [containerNumbers, setContainerNumbers] = useState("");
  const [descriptionOfGoods, setDescriptionOfGoods] = useState("");
  const [freeDays, setFreeDays] = useState(7);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const newShipment = await createShipment({
        vesselName,
        voyageNumber,
        clientName,
        portOfDischarge,
        arrivalDate: arrivalDate ? new Date(arrivalDate).toISOString() : new Date().toISOString(),
        containerNumbers,
        descriptionOfGoods,
        freeDays,
        items: [], // Simplified for MVP form
      });

      toast.success("Shipment created successfully!");
      router.push(`/dashboard/shipments/${newShipment.id}`);
    } catch (error) {
       // Error handled by hook
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-8 flex items-center gap-4">
        <Link
          href="/dashboard/shipments"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-slate-500 shadow-sm transition-colors hover:bg-slate-50 hover:text-slate-900 dark:bg-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Declare New Shipment
          </h1>
          <p className="text-slate-500 dark:text-slate-400">
            Enter the details for the new cargo declaration.
          </p>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-6 md:p-8 shadow-sm dark:border-slate-800 dark:bg-slate-950">
        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* Section: Basic Info */}
          <div className="space-y-4">
            <h3 className="flex items-center gap-2 text-lg font-semibold text-slate-900 dark:text-white">
              <Package className="h-5 w-5 text-indigo-500" />
              General Details
            </h3>
            <div className="grid gap-4 md:grid-cols-2">
              <Input
                label="Client Name *"
                placeholder="Acme Corp"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                required
              />
               <Input
                label="Container Numbers *"
                placeholder="CONT123, CONT456"
                value={containerNumbers}
                onChange={(e) => setContainerNumbers(e.target.value)}
                required
              />
            </div>
          </div>

          <hr className="border-slate-200 dark:border-slate-800" />

          {/* Section: Routing */}
          <div className="space-y-4">
            <h3 className="flex items-center gap-2 text-lg font-semibold text-slate-900 dark:text-white">
              <Anchor className="h-5 w-5 text-indigo-500" />
              Vessel & Voyage
            </h3>

            <div className="grid gap-4 md:grid-cols-2">
              <Input
                label="Vessel Name *"
                placeholder="Ever Given"
                value={vesselName}
                onChange={(e) => setVesselName(e.target.value)}
                required
              />
               <Input
                label="Voyage Number *"
                placeholder="V.123W"
                value={voyageNumber}
                onChange={(e) => setVoyageNumber(e.target.value)}
                required
              />
              <Input
                label="Port of Discharge (PoD) *"
                placeholder="e.g. Manila (PHMNL)"
                value={portOfDischarge}
                onChange={(e) => setPortOfDischarge(e.target.value)}
                required
              />
              <Input
                label="Arrival Date *"
                type="date"
                value={arrivalDate}
                onChange={(e) => setArrivalDate(e.target.value)}
                required
              />
            </div>
          </div>

          <hr className="border-slate-200 dark:border-slate-800" />

           {/* Section: Cargo Specs */}
           <div className="space-y-4">
            <h3 className="flex items-center gap-2 text-lg font-semibold text-slate-900 dark:text-white">
               Cargo Specifications
            </h3>
            <div className="grid gap-4 md:grid-cols-2">
               <Input
                label="Free Days (Port Storage)"
                type="number"
                min={0}
                value={freeDays.toString()}
                onChange={(e) => setFreeDays(parseInt(e.target.value) || 0)}
              />
            </div>
            <div className="space-y-1">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                Description of Goods *
              </label>
              <textarea
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 placeholder-slate-400 transition-colors focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:placeholder-slate-500"
                rows={4}
                placeholder="Detailed description of the goods..."
                value={descriptionOfGoods}
                onChange={(e) => setDescriptionOfGoods(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <Button type="submit" isLoading={isLoading} className="w-full md:w-auto">
              Create Declaration
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

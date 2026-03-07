"use client";

import { useEffect, useState } from "react";
import { useShipments } from "@/hooks/useShipments";
import { uploadDocument, getDocuments } from "@/services/document-service";
import { ShipmentDocument as PortKeyDoc, DocumentType } from "@/types";
import { format } from "date-fns";
import Link from "next/link";
import { 
  ArrowLeft, 
  Upload, 
  FileText, 
  Download, 
  Trash2,
  File
} from "lucide-react";
import toast from "react-hot-toast";
import Button from "@/components/ui/Button";

export default function DocumentVaultPage({ params }: { params: { id: string } }) {
  const { shipments, fetchShipments } = useShipments();
  const shipment = shipments.find((s) => s.id === Number(params.id));
  
  const [documents, setDocuments] = useState<PortKeyDoc[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  
  // Upload Form State
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [docType, setDocType] = useState<DocumentType>(DocumentType.BL);

  useEffect(() => {
    if (!shipment) fetchShipments();
  }, [shipment, fetchShipments]);

  useEffect(() => {
    async function fetchDocs() {
      try {
        const docs = await getDocuments(Number(params.id));
        setDocuments(docs);
      } catch (err: any) {
        toast.error("Failed to load documents.");
      } finally {
        setIsLoading(false);
      }
    }
    fetchDocs();
  }, [params.id]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) return;

    setIsUploading(true);
    try {
      const newDoc = await uploadDocument(Number(params.id), selectedFile, docType);
      setDocuments([...documents, newDoc]);
      setSelectedFile(null); // reset
      toast.success("Document uploaded securely");
    } catch (err: any) {
      toast.error(err.message || "Upload failed");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href={`/dashboard/shipments/${params.id}`}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-slate-500 shadow-sm transition-colors hover:bg-slate-50 hover:text-slate-900 dark:bg-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Document Vault
          </h1>
          <p className="text-slate-500 dark:text-slate-400">
            {shipment ? `Shipment ${shipment.vesselName}/${shipment.voyageNumber}` : "Loading shipment..."}
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Upload Widget */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950 md:col-span-1 h-fit">
          <h3 className="mb-4 flex items-center gap-2 text-base font-semibold text-slate-900 dark:text-white">
            <Upload className="h-5 w-5 text-indigo-500" />
            Secure Upload
          </h3>
          
          <form onSubmit={handleUpload} className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
                Document Type
              </label>
              <select
                value={docType}
                onChange={(e) => setDocType(e.target.value as DocumentType)}
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-slate-800 dark:bg-slate-950 dark:text-white"
              >
                {Object.values(DocumentType).map((type) => (
                  <option key={type} value={type}>
                    {type.replace(/_/g, " ")}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
                File (PDF, JPG, PNG)
              </label>
              <input
                type="file"
                onChange={handleFileChange}
                accept=".pdf,.jpg,.jpeg,.png"
                className="block w-full text-sm text-slate-500 file:mr-4 file:rounded-full file:border-0 file:bg-indigo-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-indigo-700 hover:file:bg-indigo-100 dark:file:bg-indigo-900/30 dark:file:text-indigo-400"
                required
              />
            </div>

            <Button type="submit" isLoading={isUploading} className="w-full" disabled={!selectedFile}>
              Upload to Vault
            </Button>
          </form>
        </div>

        {/* Existing Documents */}
        <div className="rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-950 md:col-span-2">
          <div className="border-b border-slate-200 px-6 py-5 dark:border-slate-800">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Stored Documents</h3>
          </div>
          
          {isLoading ? (
            <div className="p-8 text-center text-slate-500">Decrypting vault...</div>
          ) : documents.length === 0 ? (
            <div className="p-12 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-slate-50 dark:bg-slate-900">
                <FileText className="h-8 w-8 text-slate-400" />
              </div>
              <p className="mt-4 font-medium text-slate-900 dark:text-white">Vault is empty</p>
              <p className="mt-1 text-sm text-slate-500">Upload clearance documents securely.</p>
            </div>
          ) : (
            <ul className="divide-y divide-slate-200 dark:divide-slate-800">
              {documents.map((doc) => (
                <li key={doc.id} className="flex items-center justify-between p-4 sm:px-6 hover:bg-slate-50 dark:hover:bg-slate-900/50">
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400">
                      <File className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-medium text-slate-900 dark:text-white">
                        {doc.fileName}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <span className="font-semibold uppercase text-indigo-500">
                           {doc.type.replace(/_/g, " ")}
                        </span>
                        <span>•</span>
                        <span>{format(new Date(doc.uploadedAt), "MMM dd, yyyy")}</span>
                        <span>•</span>
                        <span>{(doc.sizeBytes / 1024 / 1024).toFixed(2)} MB</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                     <a 
                       href={doc.fileUrl}
                       target="_blank"
                       rel="noopener noreferrer"
                       className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-indigo-600 dark:hover:bg-slate-800 dark:hover:text-indigo-400 transition-colors"
                       title="Download"
                     >
                       <Download className="h-5 w-5" />
                     </a>
                     {/* Delete stub */}
                     <button 
                       className="rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/30 dark:hover:text-red-400 transition-colors"
                       title="Delete"
                     >
                       <Trash2 className="h-5 w-5" />
                     </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

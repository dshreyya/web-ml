"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  CheckCircle2,
  XCircle,
  FileText,
  MapPin,
  Phone,
  User,
  ShieldCheck,
  ExternalLink,
  Loader2,
  AlertCircle,
} from "lucide-react";

import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { getSupabaseClient } from "@/lib/supabase";

interface FarmerProfile {
  id: string;
  user_id: string;
  full_name: string | null;
  phone: string | null;
  location: string | null;
  onboarding_status: string | null;
  created_at: string | null;
  updated_at?: string | null;
}

interface FarmerDocument {
  id: string;
  user_id: string;
  farmer_profile_id: string | null;
  document_type: string;
  document_url: string;
  document_name: string | null;
  status: string;
  rejection_reason: string | null;
  created_at: string;
  updated_at: string;
  reviewed_at: string | null;
}

const requiredDocuments = [
  {
    type: "GOVERNMENT_ID",
    label: "Government ID",
  },
  {
    type: "LAND_OWNERSHIP",
    label: "Land Ownership Document",
  },
  {
    type: "PROJECT_IMAGE",
    label: "Project / Mangrove Images",
  },
  {
    type: "GEOLOCATION_MAP",
    label: "Geolocation Map",
  },
];

export default function FarmerReviewPage() {
  const params = useParams();
  const router = useRouter();

  const applicationId = params?.applicationId as string;

  const [farmer, setFarmer] = useState<FarmerProfile | null>(null);
  const [documents, setDocuments] = useState<FarmerDocument[]>([]);

  const [loading, setLoading] = useState(true);
  const [documentsLoading, setDocumentsLoading] = useState(true);

  const [actionLoading, setActionLoading] = useState<
    "approve" | "reject" | null
  >(null);

  const [error, setError] = useState("");

  const [showRejectBox, setShowRejectBox] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");

  const [documentUrls, setDocumentUrls] = useState<Record<string, string>>(
    {}
  );

  useEffect(() => {
    if (!applicationId) return;

    loadFarmer();
  }, [applicationId]);

  const loadFarmer = async () => {
    const supabase = getSupabaseClient();

    if (!supabase) {
      setError("Supabase client is not available.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");

      const { data, error: farmerError } = await supabase
        .from("farmer_profiles")
        .select(
          `
            id,
            user_id,
            full_name,
            phone,
            location,
            onboarding_status,
            created_at,
            updated_at
          `
        )
        .eq("id", applicationId)
        .single();

      if (farmerError) {
        console.error("Farmer profile error:", farmerError);
        setError("Unable to load farmer details.");
        return;
      }

      setFarmer(data);

      await loadDocuments(data.id, data.user_id);
    } catch (err) {
      console.error("Farmer review loading error:", err);
      setError("Something went wrong while loading the farmer.");
    } finally {
      setLoading(false);
    }
  };

  const loadDocuments = async (profileId: string, userId: string) => {
    const supabase = getSupabaseClient();

    if (!supabase) {
      setDocumentsLoading(false);
      return;
    }

    try {
      setDocumentsLoading(true);

      const { data, error: documentsError } = await supabase
        .from("farmer_documents")
        .select(
          `
            id,
            user_id,
            farmer_profile_id,
            document_type,
            document_url,
            document_name,
            status,
            rejection_reason,
            created_at,
            updated_at,
            reviewed_at
          `
        )
        .eq("farmer_profile_id", profileId)
        .order("created_at", { ascending: false });

      let loadedDocuments = data || [];

      /*
       * Fallback:
       * If farmer_profile_id was not stored for older uploads,
       * find documents using user_id.
       */
      if (documentsError) {
        console.warn(
          "Could not load documents by farmer_profile_id:",
          documentsError
        );

        const { data: fallbackData, error: fallbackError } = await supabase
          .from("farmer_documents")
          .select(
            `
              id,
              user_id,
              farmer_profile_id,
              document_type,
              document_url,
              document_name,
              status,
              rejection_reason,
              created_at,
              updated_at,
              reviewed_at
            `
          )
          .eq("user_id", userId)
          .order("created_at", { ascending: false });

        if (fallbackError) {
          console.error("Fallback document query error:", fallbackError);
          setDocuments([]);
        } else {
          loadedDocuments = fallbackData || [];
        }
      }

      setDocuments(loadedDocuments);

      /*
       * Create signed URLs for the private Storage bucket.
       *
       * document_url contains the Storage path.
       */
      const urls: Record<string, string> = {};

      for (const document of loadedDocuments) {
        if (!document.document_url) continue;

        let storagePath = document.document_url;

/*
 * If document_url is a full Supabase Storage URL,
 * extract only the path inside the bucket.
 */
if (storagePath.includes("/storage/v1/object/")) {
  const marker = "/storage/v1/object/";

  const markerIndex = storagePath.indexOf(marker);

  if (markerIndex !== -1) {
    let path = storagePath.substring(markerIndex + marker.length);

    // Remove "public/" or "sign/" or "authenticated/" prefix
    path = path.replace(/^public\//, "");
    path = path.replace(/^sign\//, "");
    path = path.replace(/^authenticated\//, "");

    // Remove query parameters
    path = path.split("?")[0];

    storagePath = path;
  }
}

const { data: signedData, error: signedError } =
  await supabase.storage
    .from("farmer-documents")
    .createSignedUrl(storagePath, 60 * 60);

if (signedError) {
  console.error(
    "Signed URL error:",
    signedError,
    "Original:",
    document.document_url,
    "Storage path:",
    storagePath
  );
} else if (signedData?.signedUrl) {
  urls[document.id] = signedData.signedUrl;
}

        if (signedError) {
          console.error(
            `Could not create signed URL for ${document.document_name}:`,
            signedError
          );
          continue;
        }

        if (signedData?.signedUrl) {
          urls[document.id] = signedData.signedUrl;
        }
      }

      setDocumentUrls(urls);
    } catch (err) {
      console.error("Document loading error:", err);
      setDocuments([]);
    } finally {
      setDocumentsLoading(false);
    }
  };

  const approveFarmer = async () => {
    const supabase = getSupabaseClient();

    if (!supabase || !farmer) return;

    try {
      setActionLoading("approve");
      setError("");

      /*
       * First approve all submitted documents.
       */
      if (documents.length > 0) {
        const { error: documentsError } = await supabase
          .from("farmer_documents")
          .update({
            status: "APPROVED",
            rejection_reason: null,
            reviewed_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          })
          .eq("farmer_profile_id", farmer.id);

        if (documentsError) {
          throw documentsError;
        }
      }

      /*
       * Then approve the farmer profile.
       */
      const { error: farmerError } = await supabase
        .from("farmer_profiles")
        .update({
          onboarding_status: "APPROVED",
          updated_at: new Date().toISOString(),
        })
        .eq("id", farmer.id);

      if (farmerError) {
        throw farmerError;
      }

      setFarmer((previous) =>
        previous
          ? {
              ...previous,
              onboarding_status: "APPROVED",
            }
          : previous
      );

      setDocuments((previous) =>
        previous.map((document) => ({
          ...document,
          status: "APPROVED",
          rejection_reason: null,
          reviewed_at: new Date().toISOString(),
        }))
      );

      alert("Farmer approved successfully.");

      router.push("/admin/dashboard");
      router.refresh();
    } catch (err) {
      console.error("Approve farmer error:", err);
      setError("Failed to approve farmer. Please try again.");
    } finally {
      setActionLoading(null);
    }
  };

  const rejectFarmer = async () => {
    const supabase = getSupabaseClient();

    if (!supabase || !farmer) return;

    const reason = rejectionReason.trim();

    if (!reason) {
      setError("Please enter a rejection reason.");
      return;
    }

    try {
      setActionLoading("reject");
      setError("");

      /*
       * Reject all submitted documents.
       */
      if (documents.length > 0) {
        const { error: documentsError } = await supabase
          .from("farmer_documents")
          .update({
            status: "REJECTED",
            rejection_reason: reason,
            reviewed_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          })
          .eq("farmer_profile_id", farmer.id);

        if (documentsError) {
          throw documentsError;
        }
      }

      /*
       * IMPORTANT:
       * Also change farmer profile to REJECTED.
       */
      const { error: farmerError } = await supabase
        .from("farmer_profiles")
        .update({
          onboarding_status: "REJECTED",
          updated_at: new Date().toISOString(),
        })
        .eq("id", farmer.id);

      if (farmerError) {
        throw farmerError;
      }

      setFarmer((previous) =>
        previous
          ? {
              ...previous,
              onboarding_status: "REJECTED",
            }
          : previous
      );

      setDocuments((previous) =>
        previous.map((document) => ({
          ...document,
          status: "REJECTED",
          rejection_reason: reason,
          reviewed_at: new Date().toISOString(),
        }))
      );

      alert("Farmer rejected.");

      router.push("/admin/dashboard");
      router.refresh();
    } catch (err) {
      console.error("Reject farmer error:", err);
      setError("Failed to reject farmer. Please try again.");
    } finally {
      setActionLoading(null);
    }
  };

  const getDocumentLabel = (type: string) => {
    const found = requiredDocuments.find((doc) => doc.type === type);

    if (found) return found.label;

    return type
      .replaceAll("_", " ")
      .toLowerCase()
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  const getDocumentsForType = (type: string) => {
    return documents.filter((document) => document.document_type === type);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-sand-100 dark:bg-[#061418] text-ink dark:text-sand-100 flex flex-col">
        <Navbar />

        <main className="flex-1 flex items-center justify-center px-6 pt-24">
          <div className="text-center">
            <Loader2
              size={30}
              className="mx-auto mb-4 animate-spin text-mangrove-600"
            />

            <p className="text-sm text-ink-soft dark:text-sand-100/70">
              Loading farmer application...
            </p>
          </div>
        </main>

        <Footer />
      </div>
    );
  }

  if (!farmer) {
    return (
      <div className="min-h-screen bg-sand-100 dark:bg-[#061418] text-ink dark:text-sand-100 flex flex-col">
        <Navbar />

        <main className="flex-1 flex items-center justify-center px-6 pt-24">
          <div className="text-center max-w-md">
            <AlertCircle
              size={40}
              className="mx-auto mb-4 text-red-500"
            />

            <h1 className="text-xl font-semibold">
              Farmer Application Not Found
            </h1>

            <p className="mt-2 text-sm text-ink-soft dark:text-sand-100/60">
              {error || "The requested farmer application could not be found."}
            </p>

            <button
              type="button"
              onClick={() => router.push("/admin/dashboard")}
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-ocean-900 px-4 py-2.5 text-sm font-semibold text-sand-50"
            >
              <ArrowLeft size={15} />
              Back to Dashboard
            </button>
          </div>
        </main>

        <Footer />
      </div>
    );
  }

  const status = farmer.onboarding_status || "UNKNOWN";

  return (
    <div className="min-h-screen bg-sand-100 dark:bg-[#061418] text-ink dark:text-sand-100 flex flex-col relative overflow-x-hidden">
      <div className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2 h-[650px] w-[1100px] rounded-full bg-gradient-to-b from-ocean-300/20 via-mangrove-300/15 to-transparent blur-3xl opacity-70 dark:from-ocean-900/35 dark:via-mangrove-900/25" />

      <Navbar />

      <main className="relative z-10 flex-1 container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 pt-28 sm:pt-36 pb-16 space-y-8">
        {/* BACK BUTTON */}
        <button
          type="button"
          onClick={() => router.push("/admin/dashboard")}
          className="inline-flex items-center gap-2 text-sm font-medium text-ink-soft dark:text-sand-100/70 hover:text-ink dark:hover:text-sand-50 transition-colors"
        >
          <ArrowLeft size={16} />
          Back to Dashboard
        </button>

        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-[28px] border border-ocean-900/10 bg-white/80 dark:border-sand-100/10 dark:bg-[#0a232b]/80 backdrop-blur-md p-6 sm:p-8 shadow-soft"
        >
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-mangrove-500/15 text-mangrove-700 dark:bg-mangrove-500/20 dark:text-mangrove-300">
                  <ShieldCheck size={24} />
                </div>

                <div>
                  <p className="text-[11px] font-mono uppercase tracking-wider text-ink-soft dark:text-sand-100/60">
                    Farmer Verification
                  </p>

                  <h1 className="text-2xl sm:text-3xl font-display font-semibold text-ink dark:text-sand-50">
                    {farmer.full_name || "Unnamed Farmer"}
                  </h1>
                </div>
              </div>

              <p className="mt-4 text-xs font-mono text-ink-soft dark:text-sand-100/60">
                Application ID: {farmer.id}
              </p>
            </div>

            <div>
              <span
                className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-mono font-semibold border ${
                  status === "APPROVED"
                    ? "bg-emerald-500/10 text-emerald-700 border-emerald-500/20 dark:text-emerald-300"
                    : status === "REJECTED"
                      ? "bg-red-500/10 text-red-700 border-red-500/20 dark:text-red-300"
                      : "bg-amber-500/10 text-amber-700 border-amber-500/20 dark:text-amber-300"
                }`}
              >
                <span className="h-2 w-2 rounded-full bg-current" />
                {status.replaceAll("_", " ")}
              </span>
            </div>
          </div>
        </motion.div>

        {/* ERROR */}
        {error && (
          <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-4 flex items-start gap-3">
            <AlertCircle
              size={18}
              className="text-red-600 dark:text-red-400 shrink-0 mt-0.5"
            />

            <p className="text-sm text-red-700 dark:text-red-300">
              {error}
            </p>
          </div>
        )}

        {/* FARMER DETAILS */}
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-[28px] border border-ocean-900/10 bg-white/80 dark:border-sand-100/10 dark:bg-[#0a232b]/80 backdrop-blur-md p-6 sm:p-8 shadow-soft"
        >
          <div className="flex items-center gap-3 pb-5 border-b border-ocean-900/5 dark:border-sand-100/5">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-ocean-900/10 text-ocean-900 dark:bg-sand-100/10 dark:text-sand-50">
              <User size={19} />
            </div>

            <div>
              <h2 className="text-lg font-display font-semibold">
                Farmer Details
              </h2>

              <p className="text-xs text-ink-soft dark:text-sand-100/60">
                Information submitted during farmer onboarding
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-6">
            <div className="rounded-2xl bg-sand-50/70 dark:bg-[#071a20]/60 border border-ocean-900/5 dark:border-sand-100/5 p-4">
              <div className="text-[10px] uppercase tracking-wider font-mono text-ink-soft dark:text-sand-100/50">
                Full Name
              </div>

              <div className="mt-1 text-sm font-semibold">
                {farmer.full_name || "Not provided"}
              </div>
            </div>

            <div className="rounded-2xl bg-sand-50/70 dark:bg-[#071a20]/60 border border-ocean-900/5 dark:border-sand-100/5 p-4">
              <div className="flex items-center gap-2 text-[10px] uppercase tracking-wider font-mono text-ink-soft dark:text-sand-100/50">
                <Phone size={12} />
                Phone
              </div>

              <div className="mt-1 text-sm font-semibold">
                {farmer.phone || "Not provided"}
              </div>
            </div>

            <div className="rounded-2xl bg-sand-50/70 dark:bg-[#071a20]/60 border border-ocean-900/5 dark:border-sand-100/5 p-4">
              <div className="flex items-center gap-2 text-[10px] uppercase tracking-wider font-mono text-ink-soft dark:text-sand-100/50">
                <MapPin size={12} />
                Location
              </div>

              <div className="mt-1 text-sm font-semibold">
                {farmer.location || "Not provided"}
              </div>
            </div>

            <div className="rounded-2xl bg-sand-50/70 dark:bg-[#071a20]/60 border border-ocean-900/5 dark:border-sand-100/5 p-4">
              <div className="text-[10px] uppercase tracking-wider font-mono text-ink-soft dark:text-sand-100/50">
                Submitted On
              </div>

              <div className="mt-1 text-sm font-semibold">
                {farmer.created_at
                  ? new Date(farmer.created_at).toLocaleString()
                  : "Not available"}
              </div>
            </div>
          </div>
        </motion.section>

        {/* DOCUMENTS */}
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08 }}
          className="rounded-[28px] border border-ocean-900/10 bg-white/80 dark:border-sand-100/10 dark:bg-[#0a232b]/80 backdrop-blur-md p-6 sm:p-8 shadow-soft"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-ocean-900/5 dark:border-sand-100/5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-mangrove-500/15 text-mangrove-700 dark:bg-mangrove-500/20 dark:text-mangrove-300">
                <FileText size={19} />
              </div>

              <div>
                <h2 className="text-lg font-display font-semibold">
                  Verification Documents
                </h2>

                <p className="text-xs text-ink-soft dark:text-sand-100/60">
                  Review documents submitted by the farmer
                </p>
              </div>
            </div>

            <span className="text-xs font-mono px-3 py-1.5 rounded-full bg-sand-100 dark:bg-[#071a20]">
              {documents.length} Uploaded
            </span>
          </div>

          {documentsLoading ? (
            <div className="py-12 text-center">
              <Loader2
                size={25}
                className="mx-auto mb-3 animate-spin text-mangrove-600"
              />

              <p className="text-xs text-ink-soft dark:text-sand-100/60">
                Loading documents...
              </p>
            </div>
          ) : (
            <div className="mt-6 space-y-4">
              {requiredDocuments.map((required) => {
                const matchingDocuments = getDocumentsForType(required.type);

                return (
                  <div
                    key={required.type}
                    className="rounded-2xl border border-ocean-900/5 dark:border-sand-100/10 bg-sand-50/60 dark:bg-[#071a20]/50 p-4"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold">
                          {required.label}
                        </p>

                        <p className="text-[11px] font-mono text-ink-soft dark:text-sand-100/50 mt-1">
                          {required.type}
                        </p>
                      </div>

                      {matchingDocuments.length > 0 ? (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-1 text-[11px] font-mono text-emerald-700 dark:text-emerald-300">
                          <CheckCircle2 size={12} />
                          Uploaded
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-red-500/10 px-2.5 py-1 text-[11px] font-mono text-red-700 dark:text-red-300">
                          <XCircle size={12} />
                          Missing
                        </span>
                      )}
                    </div>

                    {matchingDocuments.length > 0 && (
                      <div className="mt-4 space-y-3">
                        {matchingDocuments.map((document) => (
                          <div
                            key={document.id}
                            className="rounded-xl border border-ocean-900/5 dark:border-sand-100/10 bg-white/70 dark:bg-[#0a232b]/60 p-3"
                          >
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                              <div className="min-w-0">
                                <p className="text-xs font-semibold truncate">
                                  {document.document_name ||
                                    getDocumentLabel(document.document_type)}
                                </p>

                                <p className="text-[10px] font-mono text-ink-soft dark:text-sand-100/50 mt-1">
                                  Status: {document.status}
                                </p>

                                {document.rejection_reason && (
                                  <p className="text-[11px] text-red-600 dark:text-red-300 mt-1">
                                    Reason: {document.rejection_reason}
                                  </p>
                                )}
                              </div>

                              {documentUrls[document.id] && (
                                <a
                                  href={documentUrls[document.id]}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-ocean-900 px-3.5 py-2 text-xs font-mono font-semibold text-sand-50 hover:bg-ocean-700 dark:bg-mangrove-500 dark:text-ink dark:hover:bg-mangrove-300 transition-colors shrink-0"
                                >
                                  <ExternalLink size={13} />
                                  Open Document
                                </a>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}

              {/* OTHER DOCUMENT TYPES */}
              {documents.filter(
                (document) =>
                  !requiredDocuments.some(
                    (required) =>
                      required.type === document.document_type
                  )
              ).length > 0 && (
                <div className="rounded-2xl border border-ocean-900/5 dark:border-sand-100/10 p-4">
                  <p className="text-sm font-semibold mb-4">
                    Other Submitted Documents
                  </p>

                  <div className="space-y-3">
                    {documents
                      .filter(
                        (document) =>
                          !requiredDocuments.some(
                            (required) =>
                              required.type === document.document_type
                          )
                      )
                      .map((document) => (
                        <div
                          key={document.id}
                          className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl bg-sand-50 dark:bg-[#071a20] p-3"
                        >
                          <div>
                            <p className="text-xs font-semibold">
                              {document.document_name ||
                                getDocumentLabel(document.document_type)}
                            </p>

                            <p className="text-[10px] font-mono text-ink-soft dark:text-sand-100/50">
                              {document.status}
                            </p>
                          </div>

                          {documentUrls[document.id] && (
                            <a
                              href={documentUrls[document.id]}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center justify-center gap-2 rounded-xl bg-ocean-900 px-3 py-2 text-xs font-mono font-semibold text-sand-50"
                            >
                              <ExternalLink size={13} />
                              Open
                            </a>
                          )}
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </motion.section>

        {/* VERIFICATION SUMMARY */}
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.12 }}
          className="rounded-[28px] border border-ocean-900/10 bg-white/80 dark:border-sand-100/10 dark:bg-[#0a232b]/80 backdrop-blur-md p-6 sm:p-8 shadow-soft"
        >
          <h2 className="text-lg font-display font-semibold">
            Verification Summary
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5">
            {requiredDocuments.map((required) => {
              const uploaded =
                getDocumentsForType(required.type).length > 0;

              return (
                <div
                  key={required.type}
                  className={`rounded-2xl border p-4 ${
                    uploaded
                      ? "border-emerald-500/20 bg-emerald-500/5"
                      : "border-red-500/20 bg-red-500/5"
                  }`}
                >
                  {uploaded ? (
                    <CheckCircle2
                      size={18}
                      className="text-emerald-600 mb-2"
                    />
                  ) : (
                    <XCircle
                      size={18}
                      className="text-red-600 mb-2"
                    />
                  )}

                  <p className="text-[11px] font-semibold leading-tight">
                    {required.label}
                  </p>

                  <p className="text-[10px] mt-1 text-ink-soft dark:text-sand-100/50">
                    {uploaded ? "Submitted" : "Missing"}
                  </p>
                </div>
              );
            })}
          </div>
        </motion.section>

        {/* REJECTION BOX */}
        {showRejectBox && (
          <motion.section
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="rounded-[28px] border border-red-500/20 bg-red-500/5 p-6 sm:p-8"
          >
            <h2 className="text-lg font-semibold text-red-700 dark:text-red-300">
              Reject Farmer Application
            </h2>

            <p className="text-xs text-red-700/70 dark:text-red-300/70 mt-1">
              Enter the reason why this farmer application is being rejected.
            </p>

            <textarea
              value={rejectionReason}
              onChange={(event) =>
                setRejectionReason(event.target.value)
              }
              rows={4}
              placeholder="Enter rejection reason..."
              className="mt-5 w-full rounded-2xl border border-red-500/20 bg-white/80 dark:bg-[#071a20] p-4 text-sm outline-none focus:ring-2 focus:ring-red-500/30 resize-none"
            />

            <div className="flex flex-col sm:flex-row gap-3 mt-4">
              <button
                type="button"
                onClick={rejectFarmer}
                disabled={actionLoading !== null}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 hover:bg-red-700 px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
              >
                {actionLoading === "reject" ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <XCircle size={16} />
                )}

                {actionLoading === "reject"
                  ? "Rejecting..."
                  : "Confirm Rejection"}
              </button>

              <button
                type="button"
                onClick={() => {
                  setShowRejectBox(false);
                  setRejectionReason("");
                  setError("");
                }}
                disabled={actionLoading !== null}
                className="rounded-xl border border-ocean-900/10 dark:border-sand-100/10 px-5 py-2.5 text-sm font-semibold"
              >
                Cancel
              </button>
            </div>
          </motion.section>
        )}

        {/* ACTIONS */}
        {status === "PENDING_VERIFICATION" && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.16 }}
            className="rounded-[28px] border border-ocean-900/10 bg-white/80 dark:border-sand-100/10 dark:bg-[#0a232b]/80 backdrop-blur-md p-6 sm:p-8 shadow-soft"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
              <div>
                <h2 className="text-lg font-display font-semibold">
                  Authority Decision
                </h2>

                <p className="text-xs text-ink-soft dark:text-sand-100/60 mt-1">
                  Verify the submitted information and documents before
                  approving this farmer.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={approveFarmer}
                  disabled={actionLoading !== null}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 px-5 py-3 text-sm font-semibold text-white shadow-sm transition-colors disabled:opacity-50"
                >
                  {actionLoading === "approve" ? (
                    <Loader2
                      size={16}
                      className="animate-spin"
                    />
                  ) : (
                    <CheckCircle2 size={16} />
                  )}

                  {actionLoading === "approve"
                    ? "Approving..."
                    : "Approve Farmer"}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setShowRejectBox(true);
                    setError("");
                  }}
                  disabled={actionLoading !== null}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-500/20 bg-red-500/5 hover:bg-red-500/10 px-5 py-3 text-sm font-semibold text-red-700 dark:text-red-300 transition-colors disabled:opacity-50"
                >
                  <XCircle size={16} />
                  Reject Farmer
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* ALREADY APPROVED / REJECTED */}
        {status !== "PENDING_VERIFICATION" && (
          <div
            className={`rounded-2xl border p-5 ${
              status === "APPROVED"
                ? "border-emerald-500/20 bg-emerald-500/5"
                : "border-red-500/20 bg-red-500/5"
            }`}
          >
            <div className="flex items-center gap-3">
              {status === "APPROVED" ? (
                <CheckCircle2
                  size={20}
                  className="text-emerald-600"
                />
              ) : (
                <XCircle size={20} className="text-red-600" />
              )}

              <div>
                <p className="text-sm font-semibold">
                  Application status: {status.replaceAll("_", " ")}
                </p>

                <p className="text-xs text-ink-soft dark:text-sand-100/60 mt-1">
                  This application has already been reviewed.
                </p>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
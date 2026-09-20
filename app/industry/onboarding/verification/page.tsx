"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  CheckCircle2,
  XCircle,
  AlertCircle,
  FileText,
  Loader2,
  ShieldCheck,
  RefreshCw,
  ArrowLeft,
  ExternalLink,
} from "lucide-react";

import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { getSupabaseClient } from "@/lib/supabase";

// ==========================================
// TYPES
// ==========================================

type OnboardingStatus =
  | "DRAFT"
  | "PENDING_DOCUMENTS"
  | "PENDING_VERIFICATION"
  | "APPROVED"
  | "REJECTED";

interface IndustryProfile {
  id: string;
  user_id: string;
  company_name: string | null;
  industry_type: string | null;
  facility_name: string | null;
  onboarding_status: OnboardingStatus;
  rejection_reason: string | null;
}

interface IndustryDocument {
  id: string;
  user_id: string;
  document_type: string;
  file_name: string;
  storage_path: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  rejection_reason: string | null;
  uploaded_at: string;
  reviewed_at: string | null;
}

// ==========================================
// DOCUMENT LABELS
// ==========================================

const documentLabels: Record<string, string> = {
  companyRegistration: "Company Registration Certificate",
  gstCertificate: "GST Certificate",
  pcbCertificate: "Pollution Control Board Certificate",
  environmentalClearance: "Environmental Clearance",
  carbonAuditReport: "Carbon Audit Report",
  esgReport: "ESG Report",
  authorizationLetter: "Authorization Letter",
  additionalDocs: "Additional Documents",
};

// ==========================================
// REQUIRED DOCUMENTS
// ==========================================

const REQUIRED_DOCUMENTS = [
  "companyRegistration",
  "gstCertificate",
  "pcbCertificate",
  "carbonAuditReport",
  "authorizationLetter",
];

// ==========================================
// MAIN PAGE
// ==========================================

export default function IndustryVerificationPage() {
  const router = useRouter();

  const [profile, setProfile] =
    useState<IndustryProfile | null>(null);

  const [documents, setDocuments] = useState<IndustryDocument[]>(
    []
  );

  const [loading, setLoading] = useState(true);

  const [refreshing, setRefreshing] = useState(false);

  const [error, setError] = useState("");

  // ==========================================
  // LOAD DATA
  // ==========================================

  useEffect(() => {
    loadVerificationStatus();
  }, []);

  const loadVerificationStatus = async (
    showRefreshLoader = false
  ) => {
    const supabase = getSupabaseClient();

    if (!supabase) {
      setError("Supabase client could not be initialized.");
      setLoading(false);
      return;
    }

    try {
      if (showRefreshLoader) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      // ==========================================
      // CHECK USER
      // ==========================================

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/login");
        return;
      }

      // ==========================================
      // LOAD INDUSTRY PROFILE
      // ==========================================

      const { data: profileData, error: profileError } =
        await supabase
          .from("industry_profiles")
          .select(
            `
              id,
              user_id,
              company_name,
              industry_type,
              facility_name,
              onboarding_status,
              rejection_reason
            `
          )
          .eq("user_id", user.id)
          .single();

      if (profileError) {
        console.error(profileError);

        setError(
          "Unable to load your industry verification details."
        );

        return;
      }

      const industryProfile =
        profileData as IndustryProfile;

      setProfile(industryProfile);

      // ==========================================
      // APPROVED
      // ==========================================

      if (industryProfile.onboarding_status === "APPROVED") {
        router.push("/industry/dashboard");
        return;
      }

      // ==========================================
      // LOAD DOCUMENTS
      // ==========================================

      const { data: documentData, error: documentError } =
        await supabase
          .from("industry_documents")
          .select("*")
          .eq("user_id", user.id)
          .order("uploaded_at", {
            ascending: false,
          });

      if (documentError) {
        console.error(documentError);

        setError(
          "Unable to load your submitted documents."
        );

        return;
      }

      setDocuments(
        (documentData || []) as IndustryDocument[]
      );
    } catch (err) {
      console.error(err);

      setError(
        "Something went wrong while checking your verification status."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // ==========================================
  // AUTO REFRESH
  // ==========================================

  useEffect(() => {
    if (!profile) return;

    if (
      profile.onboarding_status !==
      "PENDING_VERIFICATION"
    ) {
      return;
    }

    const interval = setInterval(() => {
      loadVerificationStatus(false);
    }, 10000);

    return () => {
      clearInterval(interval);
    };
  }, [profile?.onboarding_status]);

  // ==========================================
  // FIX & RESUBMIT
  // ==========================================

  const handleFixAndResubmit = () => {
    router.push("/industry/onboarding/documents");
  };

  // ==========================================
  // OPEN DOCUMENT
  // ==========================================

  const openDocument = async (storagePath: string) => {
    const supabase = getSupabaseClient();

    if (!supabase) {
      alert("Supabase client could not be initialized.");
      return;
    }

    try {
      const { data, error } = await supabase.storage
        .from("industry-documents")
        .createSignedUrl(storagePath, 300);

      if (error) {
        console.error(error);

        alert(
          "Unable to open this document. Please check Storage permissions."
        );

        return;
      }

      if (data?.signedUrl) {
        window.open(data.signedUrl, "_blank");
      }
    } catch (err) {
      console.error(err);

      alert("Unable to open document.");
    }
  };

  // ==========================================
  // REQUIRED DOCUMENT CHECK
  // ==========================================

  const hasRequiredDocuments = REQUIRED_DOCUMENTS.every(
    (requiredType) =>
      documents.some(
        (document) =>
          document.document_type === requiredType &&
          document.status !== "REJECTED"
      )
  );

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="min-h-screen bg-sand-100 dark:bg-[#061418] text-ink dark:text-sand-100">
        <Navbar />

        <main className="container mx-auto px-4 pt-32 pb-20 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <Loader2
              size={34}
              className="animate-spin text-mangrove-600"
            />

            <p className="text-sm text-ink-soft dark:text-sand-100/60">
              Checking your verification status...
            </p>
          </div>
        </main>

        <Footer />
      </div>
    );
  }

  // ==========================================
  // ERROR / PROFILE NOT FOUND
  // ==========================================

  if (!profile) {
    return (
      <div className="min-h-screen bg-sand-100 dark:bg-[#061418] text-ink dark:text-sand-100 flex flex-col">
        <Navbar />

        <main className="flex-1 container mx-auto px-4 pt-32 pb-20">
          <div className="max-w-xl mx-auto rounded-[28px] border border-red-500/20 bg-white/80 dark:bg-[#0a232b]/80 p-8 text-center">
            <AlertCircle
              size={40}
              className="mx-auto mb-4 text-red-500"
            />

            <h1 className="text-xl font-semibold">
              Verification Details Not Found
            </h1>

            <p className="mt-2 text-sm text-ink-soft dark:text-sand-100/60">
              {error ||
                "We could not find your industry profile."}
            </p>

            <button
              type="button"
              onClick={() =>
                router.push("/industry/onboarding")
              }
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-ocean-900 px-5 py-3 text-sm font-semibold text-sand-50"
            >
              <ArrowLeft size={16} />
              Back to Onboarding
            </button>
          </div>
        </main>

        <Footer />
      </div>
    );
  }

  // ==========================================
  // STATUS HELPERS
  // ==========================================

  const isPending =
    profile.onboarding_status ===
    "PENDING_VERIFICATION";

  const isRejected =
    profile.onboarding_status === "REJECTED";

  const rejectedDocuments = documents.filter(
    (document) => document.status === "REJECTED"
  );

  const approvedDocuments = documents.filter(
    (document) => document.status === "APPROVED"
  );

  const pendingDocuments = documents.filter(
    (document) => document.status === "PENDING"
  );

  // ==========================================
  // MAIN UI
  // ==========================================

  return (
    <div className="min-h-screen bg-sand-100 dark:bg-[#061418] text-ink dark:text-sand-100 flex flex-col">
      <Navbar />

      <main className="relative flex-1 container mx-auto px-4 sm:px-6 lg:px-8 pt-28 sm:pt-36 pb-16 max-w-6xl">
        {/* Ambient Background */}
        <div className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2 h-[600px] w-[1000px] rounded-full bg-gradient-to-b from-ocean-300/15 via-mangrove-300/10 to-transparent blur-3xl" />

        <div className="relative z-10 space-y-8">
          {/* ==========================================
              HEADER
          ========================================== */}

          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col sm:flex-row sm:items-center justify-between gap-5"
          >
            <div>
              <button
                type="button"
                onClick={() =>
                  router.push("/industry/onboarding")
                }
                className="inline-flex items-center gap-2 text-xs font-mono text-ink-soft dark:text-sand-100/60 hover:text-ink dark:hover:text-sand-50 transition-colors mb-4"
              >
                <ArrowLeft size={14} />
                Back to Onboarding
              </button>

              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-ocean-900/10 dark:bg-sand-100/10">
                  <ShieldCheck
                    size={25}
                    className="text-ocean-900 dark:text-sand-50"
                  />
                </div>

                <div>
                  <h1 className="text-2xl sm:text-3xl font-display font-semibold tracking-tight">
                    Industry Verification
                  </h1>

                  <p className="text-sm text-ink-soft dark:text-sand-100/60 mt-1">
                    Your company documents are being reviewed by
                    the Authority.
                  </p>
                </div>
              </div>
            </div>

            {/* Refresh */}
            <button
              type="button"
              disabled={refreshing}
              onClick={() =>
                loadVerificationStatus(true)
              }
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-ocean-900/10 dark:border-sand-100/10 bg-white/70 dark:bg-[#0a232b] px-4 py-2.5 text-xs font-semibold hover:bg-sand-100 dark:hover:bg-[#102d35] transition-colors disabled:opacity-50"
            >
              <RefreshCw
                size={14}
                className={
                  refreshing ? "animate-spin" : ""
                }
              />

              Refresh Status
            </button>
          </motion.div>

          {/* ==========================================
              ERROR
          ========================================== */}

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl border border-red-500/20 bg-red-500/10 p-4 flex items-center gap-3 text-sm text-red-700 dark:text-red-300"
            >
              <AlertCircle size={18} />

              <span>{error}</span>
            </motion.div>
          )}

          {/* ==========================================
              COMPANY SUMMARY
          ========================================== */}

          <motion.section
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-[28px] border border-ocean-900/10 bg-white/80 dark:border-sand-100/10 dark:bg-[#0a232b]/80 backdrop-blur-md p-6 sm:p-8 shadow-soft"
          >
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-mangrove-500/15">
                <ShieldCheck
                  size={23}
                  className="text-mangrove-700 dark:text-mangrove-300"
                />
              </div>

              <div className="min-w-0">
                <h2 className="text-xl font-display font-semibold">
                  {profile.company_name ||
                    "Industry Company"}
                </h2>

                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mt-2">
                  {profile.industry_type && (
                    <p className="text-xs text-ink-soft dark:text-sand-100/60">
                      Industry: {profile.industry_type}
                    </p>
                  )}

                  {profile.facility_name && (
                    <p className="text-xs text-ink-soft dark:text-sand-100/60">
                      Facility: {profile.facility_name}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </motion.section>

          {/* ==========================================
              PENDING VERIFICATION
          ========================================== */}

          {isPending && (
            <motion.section
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-[28px] border border-amber-500/20 bg-amber-500/5 p-6 sm:p-8"
            >
              <div className="flex flex-col sm:flex-row items-start gap-5">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-amber-500/10">
                  <AlertCircle
                    size={25}
                    className="text-amber-600 dark:text-amber-400"
                  />
                </div>

                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <h2 className="text-lg font-display font-semibold text-amber-800 dark:text-amber-300">
                        Verification Pending
                      </h2>

                      <p className="text-sm text-amber-700/80 dark:text-amber-300/70 mt-1">
                        Your application has been submitted
                        successfully and is currently being reviewed
                        by the Authority.
                      </p>
                    </div>

                    <span className="inline-flex items-center gap-2 rounded-full border border-amber-500/20 bg-amber-500/10 px-3 py-1.5 text-[10px] font-mono text-amber-700 dark:text-amber-300 shrink-0">
                      <Loader2
                        size={12}
                        className="animate-spin"
                      />
                      UNDER REVIEW
                    </span>
                  </div>

                  <div className="mt-5 rounded-2xl bg-white/50 dark:bg-[#071a20]/50 border border-amber-500/10 p-4">
                    <p className="text-xs text-amber-800/80 dark:text-amber-200/70">
                      This page automatically checks for updates.
                      You can also click <strong>Refresh Status</strong>{" "}
                      above to check manually.
                    </p>
                  </div>
                </div>
              </div>
            </motion.section>
          )}

          {/* ==========================================
              REJECTED
          ========================================== */}

          {isRejected && (
            <motion.section
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-[28px] border border-red-500/20 bg-red-500/5 p-6 sm:p-8"
            >
              <div className="flex flex-col sm:flex-row items-start gap-5">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-red-500/10">
                  <XCircle
                    size={25}
                    className="text-red-600 dark:text-red-400"
                  />
                </div>

                <div className="flex-1">
                  <h2 className="text-xl font-display font-semibold text-red-800 dark:text-red-300">
                    Application Rejected
                  </h2>

                  <p className="text-sm text-red-700/80 dark:text-red-300/70 mt-1">
                    The Authority has reviewed your application
                    and requested corrections.
                  </p>

                  {/* Profile-level rejection reason */}
                  {profile.rejection_reason && (
                    <div className="mt-5 rounded-2xl border border-red-500/15 bg-red-500/10 p-4">
                      <p className="text-[11px] font-mono uppercase tracking-wider font-semibold text-red-700 dark:text-red-300">
                        Authority Rejection Reason
                      </p>

                      <p className="mt-2 text-sm text-red-800/90 dark:text-red-200/90">
                        {profile.rejection_reason}
                      </p>
                    </div>
                  )}

                  <div className="mt-5">
                    <button
                      type="button"
                      onClick={handleFixAndResubmit}
                      className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 hover:bg-red-700 text-white px-6 py-3 text-sm font-semibold transition-colors"
                    >
                      <RefreshCw size={17} />
                      Fix & Resubmit
                    </button>
                  </div>

                  <p className="mt-3 text-[11px] text-red-700/60 dark:text-red-300/50">
                    You will be taken to the document upload page
                    where you can upload corrected documents.
                  </p>
                </div>
              </div>
            </motion.section>
          )}

          {/* ==========================================
              DOCUMENT SUMMARY
          ========================================== */}

          <motion.section
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="rounded-[28px] border border-ocean-900/10 bg-white/80 dark:border-sand-100/10 dark:bg-[#0a232b]/80 backdrop-blur-md p-6 sm:p-8 shadow-soft"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-ocean-900/5 dark:border-sand-100/5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-mangrove-500/15">
                  <FileText
                    size={20}
                    className="text-mangrove-700 dark:text-mangrove-300"
                  />
                </div>

                <div>
                  <h2 className="text-lg font-display font-semibold">
                    Document Verification
                  </h2>

                  <p className="text-xs text-ink-soft dark:text-sand-100/60">
                    Status of your submitted compliance documents
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <span className="text-[10px] font-mono px-2.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/15 text-emerald-700 dark:text-emerald-300">
                  {approvedDocuments.length} Approved
                </span>

                <span className="text-[10px] font-mono px-2.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/15 text-amber-700 dark:text-amber-300">
                  {pendingDocuments.length} Pending
                </span>

                <span className="text-[10px] font-mono px-2.5 py-1.5 rounded-full bg-red-500/10 border border-red-500/15 text-red-700 dark:text-red-300">
                  {rejectedDocuments.length} Rejected
                </span>
              </div>
            </div>

            {/* Required document warning */}
            {!hasRequiredDocuments && (
              <div className="mt-5 rounded-2xl border border-amber-500/20 bg-amber-500/10 p-4 flex items-start gap-3">
                <AlertCircle
                  size={18}
                  className="shrink-0 text-amber-600 dark:text-amber-400"
                />

                <div>
                  <p className="text-sm font-semibold text-amber-800 dark:text-amber-300">
                    Some required documents are missing or rejected.
                  </p>

                  <p className="text-xs text-amber-700/70 dark:text-amber-300/60 mt-1">
                    If your application was rejected, use the
                    Fix & Resubmit button to upload corrected
                    documents.
                  </p>
                </div>
              </div>
            )}

            {documents.length === 0 ? (
              <div className="py-12 text-center">
                <FileText
                  size={38}
                  className="mx-auto mb-3 text-ink-faint dark:text-sand-100/30"
                />

                <p className="text-sm font-medium">
                  No documents submitted
                </p>

                <p className="text-xs text-ink-soft dark:text-sand-100/50 mt-1">
                  No industry compliance documents were found.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                {documents.map((document) => (
                  <div
                    key={document.id}
                    className="rounded-2xl border border-ocean-900/10 dark:border-sand-100/10 bg-sand-50/60 dark:bg-[#071a20]/50 p-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3 min-w-0">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-ocean-900/10 dark:bg-sand-100/10">
                          <FileText
                            size={18}
                            className="text-ocean-900 dark:text-sand-50"
                          />
                        </div>

                        <div className="min-w-0">
                          <h3 className="text-sm font-semibold">
                            {documentLabels[
                              document.document_type
                            ] || document.document_type}
                          </h3>

                          <p className="text-[11px] text-ink-soft dark:text-sand-100/50 truncate mt-1">
                            {document.file_name}
                          </p>
                        </div>
                      </div>

                      <DocumentStatus
                        status={document.status}
                      />
                    </div>

                    {/* Rejection reason */}
                    {document.status === "REJECTED" &&
                      document.rejection_reason && (
                        <div className="mt-3 rounded-xl bg-red-500/10 border border-red-500/15 p-3">
                          <p className="text-[11px] font-medium text-red-700 dark:text-red-300">
                            Rejection Reason
                          </p>

                          <p className="text-xs text-red-700/80 dark:text-red-300/80 mt-1">
                            {document.rejection_reason}
                          </p>
                        </div>
                      )}

                    {/* Reviewed date */}
                    {document.reviewed_at && (
                      <p className="mt-3 text-[10px] font-mono text-ink-soft dark:text-sand-100/40">
                        Reviewed:{" "}
                        {new Date(
                          document.reviewed_at
                        ).toLocaleString()}
                      </p>
                    )}

                    {/* Open document */}
                    <button
                      type="button"
                      onClick={() =>
                        openDocument(document.storage_path)
                      }
                      className="mt-4 w-full inline-flex items-center justify-center gap-2 rounded-xl border border-ocean-900/10 dark:border-sand-100/10 bg-white/70 dark:bg-[#0a232b] px-4 py-2.5 text-xs font-semibold hover:bg-sand-100 dark:hover:bg-[#102d35] transition-colors"
                    >
                      <ExternalLink size={14} />
                      Open Document
                    </button>
                  </div>
                ))}
              </div>
            )}
          </motion.section>

          {/* ==========================================
              NEXT STEPS
          ========================================== */}

          {isPending && (
            <motion.section
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="rounded-[28px] border border-ocean-900/10 bg-white/80 dark:border-sand-100/10 dark:bg-[#0a232b]/80 backdrop-blur-md p-6 sm:p-8 shadow-soft"
            >
              <div className="flex items-center gap-3 pb-5 border-b border-ocean-900/5 dark:border-sand-100/5">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-ocean-900/10 dark:bg-sand-100/10">
                  <ShieldCheck
                    size={20}
                    className="text-ocean-900 dark:text-sand-50"
                  />
                </div>

                <div>
                  <h2 className="text-lg font-display font-semibold">
                    What happens next?
                  </h2>

                  <p className="text-xs text-ink-soft dark:text-sand-100/60">
                    Your Industry onboarding process
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                <StepCard
                  number="01"
                  title="Authority Review"
                  description="The Authority checks your company details and compliance documents."
                  active
                />

                <StepCard
                  number="02"
                  title="Application Decision"
                  description="Your application will be approved or returned for corrections."
                />

                <StepCard
                  number="03"
                  title="Industry Dashboard"
                  description="After approval, you can access the Industry dashboard and available platform features."
                />
              </div>
            </motion.section>
          )}

          {/* ==========================================
              REJECTED NEXT STEP
          ========================================== */}

          {isRejected && (
            <motion.section
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="rounded-[28px] border border-ocean-900/10 bg-white/80 dark:border-sand-100/10 dark:bg-[#0a232b]/80 backdrop-blur-md p-6 sm:p-8 shadow-soft"
            >
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-mangrove-500/15">
                  <RefreshCw
                    size={20}
                    className="text-mangrove-700 dark:text-mangrove-300"
                  />
                </div>

                <div>
                  <h2 className="text-lg font-display font-semibold">
                    Correct and Resubmit
                  </h2>

                  <p className="text-sm text-ink-soft dark:text-sand-100/60 mt-1">
                    Review the Authority's rejection reason, replace
                    the required documents if necessary, and submit
                    your application again for verification.
                  </p>
                </div>
              </div>
            </motion.section>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

// ==========================================
// DOCUMENT STATUS
// ==========================================

function DocumentStatus({
  status,
}: {
  status: "PENDING" | "APPROVED" | "REJECTED";
}) {
  if (status === "APPROVED") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1 text-[10px] font-mono text-emerald-700 dark:text-emerald-300 shrink-0">
        <CheckCircle2 size={11} />
        APPROVED
      </span>
    );
  }

  if (status === "REJECTED") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-red-500/20 bg-red-500/10 px-2.5 py-1 text-[10px] font-mono text-red-700 dark:text-red-300 shrink-0">
        <XCircle size={11} />
        REJECTED
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/20 bg-amber-500/10 px-2.5 py-1 text-[10px] font-mono text-amber-700 dark:text-amber-300 shrink-0">
      <AlertCircle size={11} />
      PENDING
    </span>
  );
}

// ==========================================
// STEP CARD
// ==========================================

function StepCard({
  number,
  title,
  description,
  active = false,
}: {
  number: string;
  title: string;
  description: string;
  active?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl border p-5 ${
        active
          ? "border-ocean-900/15 dark:border-sand-100/10 bg-ocean-900/5 dark:bg-sand-100/5"
          : "border-ocean-900/5 dark:border-sand-100/5 bg-sand-50/60 dark:bg-[#071a20]/50"
      }`}
    >
      <div className="flex items-center gap-3">
        <span className="text-[10px] font-mono text-ink-soft dark:text-sand-100/40">
          {number}
        </span>

        <h3 className="text-sm font-semibold">
          {title}
        </h3>
      </div>

      <p className="mt-3 text-xs leading-5 text-ink-soft dark:text-sand-100/55">
        {description}
      </p>
    </div>
  );
}
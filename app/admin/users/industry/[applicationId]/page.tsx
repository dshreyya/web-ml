"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Building2,
  CheckCircle2,
  XCircle,
  FileText,
  ExternalLink,
  Loader2,
  ShieldCheck,
  MapPin,
  Phone,
  Mail,
  Globe,
  User,
  BriefcaseBusiness,
  AlertCircle,
  RefreshCw,
} from "lucide-react";

import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { getSupabaseClient } from "@/lib/supabase";

// ==========================================
// TYPES
// ==========================================

interface IndustryProfile {
  id: string;
  user_id: string;
  company_name: string | null;
  industry_type: string | null;
  gst_number: string | null;
  cin_number: string | null;
  website: string | null;
  address_line1: string | null;
  address_line2: string | null;
  city: string | null;
  state: string | null;
  pincode: string | null;
  country: string | null;
  contact_name: string | null;
  contact_designation: string | null;
  contact_email: string | null;
  contact_phone: string | null;
  facility_name: string | null;
  latitude: number | null;
  longitude: number | null;
  annual_emissions: number | null;
  employee_count: number | null;
  onboarding_status: string;
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
// MAIN PAGE
// ==========================================

export default function IndustryApplicationReviewPage() {
  const router = useRouter();
  const params = useParams();

  const applicationId = params?.applicationId as string;

  const [profile, setProfile] = useState<IndustryProfile | null>(null);

  const [documents, setDocuments] = useState<IndustryDocument[]>([]);

  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [rejectMode, setRejectMode] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");

  // ==========================================
  // LOAD APPLICATION
  // ==========================================

  useEffect(() => {
    if (!applicationId) return;

    loadApplication();
  }, [applicationId]);

  const loadApplication = async () => {
    const supabase = getSupabaseClient();

    if (!supabase) {
      setError("Supabase client could not be initialized.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");

      // Check logged-in user
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError) {
        console.error(userError);
        setError("Unable to verify Authority login.");
        return;
      }

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
          .select("*")
          .eq("id", applicationId)
          .single();

      if (profileError) {
        console.error("PROFILE LOAD ERROR:", profileError);

        setError(
          `Unable to load industry application: ${profileError.message}`
        );

        return;
      }

      setProfile(profileData);

      if (profileData.rejection_reason) {
        setRejectionReason(profileData.rejection_reason);
      } else {
        setRejectionReason("");
      }

      // ==========================================
      // LOAD DOCUMENTS
      // ==========================================

      const { data: documentData, error: documentError } =
        await supabase
          .from("industry_documents")
          .select("*")
          .eq("user_id", profileData.user_id)
          .order("uploaded_at", {
            ascending: false,
          });

      if (documentError) {
        console.error("DOCUMENT LOAD ERROR:", documentError);

        setError(
          `Unable to load industry documents: ${documentError.message}`
        );

        return;
      }

      setDocuments(documentData || []);
    } catch (err) {
      console.error("LOAD APPLICATION ERROR:", err);

      setError("Something went wrong while loading the application.");
    } finally {
      setLoading(false);
    }
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
        console.error("SIGNED URL ERROR:", error);

        alert(
          `Unable to open this document.\n\n${error.message}`
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
  // APPROVE APPLICATION
  // ==========================================

  const approveApplication = async () => {
    const supabase = getSupabaseClient();

    if (!supabase || !profile) {
      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to approve this industry application?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setActionLoading(true);
      setError("");
      setSuccessMessage("");

      const reviewedAt = new Date().toISOString();

      // ==========================================
      // STEP 1: UPDATE PROFILE
      // ==========================================

      const { data: updatedProfile, error: profileError } =
        await supabase
          .from("industry_profiles")
          .update({
            onboarding_status: "APPROVED",
            rejection_reason: null,
            updated_at: reviewedAt,
          })
          .eq("id", profile.id)
          .select("*")
          .single();

      if (profileError) {
        console.error(
          "APPROVE PROFILE ERROR:",
          profileError
        );

        setError(
          `Approval failed: ${profileError.message}`
        );

        return;
      }

      // ==========================================
      // IMPORTANT DATABASE VERIFICATION
      // ==========================================

      if (
        !updatedProfile ||
        updatedProfile.onboarding_status !== "APPROVED"
      ) {
        console.error(
          "DATABASE DID NOT RETURN APPROVED PROFILE:",
          updatedProfile
        );

        setError(
          "The approval update was not confirmed by the database."
        );

        return;
      }

      console.log(
        "PROFILE SUCCESSFULLY APPROVED:",
        updatedProfile
      );

      // ==========================================
      // STEP 2: APPROVE PENDING DOCUMENTS
      // ==========================================

      const { data: updatedDocuments, error: documentsError } =
        await supabase
          .from("industry_documents")
          .update({
            status: "APPROVED",
            reviewed_at: reviewedAt,
            rejection_reason: null,
          })
          .eq("user_id", profile.user_id)
          .eq("status", "PENDING")
          .select("*");

      if (documentsError) {
        console.error(
          "DOCUMENT APPROVAL ERROR:",
          documentsError
        );

        setError(
          `Profile approved, but document approval failed: ${documentsError.message}`
        );

        // Reload actual database state
        await loadApplication();

        return;
      }

      console.log(
        "DOCUMENTS APPROVED:",
        updatedDocuments
      );

      // ==========================================
      // STEP 3: UPDATE LOCAL STATE
      // ==========================================

      setProfile(updatedProfile);

      setDocuments((previous) =>
        previous.map((document) => ({
          ...document,

          status:
            document.status === "PENDING"
              ? "APPROVED"
              : document.status,

          reviewed_at:
            document.status === "PENDING"
              ? reviewedAt
              : document.reviewed_at,

          rejection_reason:
            document.status === "PENDING"
              ? null
              : document.rejection_reason,
        }))
      );

      // ==========================================
      // SUCCESS
      // ==========================================

      setSuccessMessage(
        "Industry application approved successfully."
      );

      // ==========================================
      // GO BACK TO AUTHORITY DASHBOARD
      // ==========================================

      setTimeout(() => {
        router.push("/admin/dashboard");
        router.refresh();
      }, 1500);
    } catch (err) {
      console.error(
        "APPROVAL EXCEPTION:",
        err
      );

      setError(
        "Something went wrong while approving the application."
      );
    } finally {
      setActionLoading(false);
    }
  };

  // ==========================================
  // REJECT APPLICATION
  // ==========================================

  const rejectApplication = async () => {
    const supabase = getSupabaseClient();

    if (!supabase || !profile) {
      return;
    }

    if (!rejectionReason.trim()) {
      setError("Please enter a rejection reason.");
      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to reject this industry application?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setActionLoading(true);
      setError("");
      setSuccessMessage("");

      const trimmedReason = rejectionReason.trim();
      const reviewedAt = new Date().toISOString();

      // ==========================================
      // UPDATE PROFILE
      // ==========================================

      const { data: updatedProfile, error: profileError } =
        await supabase
          .from("industry_profiles")
          .update({
            onboarding_status: "REJECTED",
            rejection_reason: trimmedReason,
            updated_at: reviewedAt,
          })
          .eq("id", profile.id)
          .select("*")
          .single();

      if (profileError) {
        console.error(
          "REJECT PROFILE ERROR:",
          profileError
        );

        setError(
          `Rejection failed: ${profileError.message}`
        );

        return;
      }

      // ==========================================
      // VERIFY DATABASE UPDATE
      // ==========================================

      if (
        !updatedProfile ||
        updatedProfile.onboarding_status !== "REJECTED"
      ) {
        setError(
          "The rejection update was not confirmed by the database."
        );

        return;
      }

      // ==========================================
      // REJECT PENDING DOCUMENTS
      // ==========================================

      const { error: documentsError } =
        await supabase
          .from("industry_documents")
          .update({
            status: "REJECTED",
            rejection_reason: trimmedReason,
            reviewed_at: reviewedAt,
          })
          .eq("user_id", profile.user_id)
          .eq("status", "PENDING");

      if (documentsError) {
        console.error(
          "DOCUMENT REJECTION ERROR:",
          documentsError
        );

        setError(
          `Application rejected, but document status update failed: ${documentsError.message}`
        );

        await loadApplication();

        return;
      }

      // ==========================================
      // UPDATE LOCAL STATE
      // ==========================================

      setProfile(updatedProfile);

      setDocuments((previous) =>
        previous.map((document) => ({
          ...document,

          status:
            document.status === "PENDING"
              ? "REJECTED"
              : document.status,

          rejection_reason:
            document.status === "PENDING"
              ? trimmedReason
              : document.rejection_reason,

          reviewed_at:
            document.status === "PENDING"
              ? reviewedAt
              : document.reviewed_at,
        }))
      );

      setRejectMode(false);

      setSuccessMessage(
        "Industry application rejected. The applicant can now correct and resubmit the required documents."
      );

      setTimeout(() => {
        router.push("/admin/dashboard");
        router.refresh();
      }, 1800);
    } catch (err) {
      console.error(
        "REJECTION EXCEPTION:",
        err
      );

      setError(
        "Something went wrong while rejecting the application."
      );
    } finally {
      setActionLoading(false);
    }
  };

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
              size={32}
              className="animate-spin text-mangrove-600"
            />

            <p className="text-sm text-ink-soft dark:text-sand-100/60">
              Loading industry application...
            </p>
          </div>
        </main>

        <Footer />
      </div>
    );
  }

  // ==========================================
  // ERROR / NO PROFILE
  // ==========================================

  if (!profile) {
    return (
      <div className="min-h-screen bg-sand-100 dark:bg-[#061418] text-ink dark:text-sand-100">
        <Navbar />

        <main className="container mx-auto px-4 pt-32 pb-20">
          <div className="max-w-xl mx-auto rounded-[28px] border border-red-500/20 bg-white/80 dark:bg-[#0a232b]/80 p-8 text-center">
            <AlertCircle
              size={40}
              className="mx-auto mb-4 text-red-500"
            />

            <h1 className="text-xl font-semibold">
              Application Not Found
            </h1>

            <p className="mt-2 text-sm text-ink-soft dark:text-sand-100/60">
              {error ||
                "The requested industry application could not be found."}
            </p>

            <button
              type="button"
              onClick={() => router.push("/admin/dashboard")}
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-ocean-900 px-5 py-3 text-sm font-semibold text-sand-50"
            >
              <ArrowLeft size={16} />
              Back to Dashboard
            </button>
          </div>
        </main>

        <Footer />
      </div>
    );
  }

  // ==========================================
  // MAIN UI
  // ==========================================

  return (
    <div className="min-h-screen bg-sand-100 dark:bg-[#061418] text-ink dark:text-sand-100 flex flex-col">
      <Navbar />

      <main className="relative flex-1 container mx-auto px-4 sm:px-6 lg:px-8 pt-28 sm:pt-36 pb-16 max-w-7xl">
        {/* Ambient Background */}
        <div className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2 h-[600px] w-[1000px] rounded-full bg-gradient-to-b from-ocean-300/15 via-mangrove-300/10 to-transparent blur-3xl" />

        <div className="relative z-10 space-y-8">

          {/* ==========================================
              HEADER
          ========================================== */}

          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col md:flex-row md:items-center justify-between gap-5"
          >
            <div>
              <button
                type="button"
                onClick={() =>
                  router.push("/admin/dashboard")
                }
                className="inline-flex items-center gap-2 text-xs font-mono text-ink-soft dark:text-sand-100/60 hover:text-ink dark:hover:text-sand-50 transition-colors mb-4"
              >
                <ArrowLeft size={14} />
                Back to Authority Dashboard
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
                    Industry Application Review
                  </h1>

                  <p className="text-sm text-ink-soft dark:text-sand-100/60 mt-1">
                    Verify company information and submitted
                    compliance documents.
                  </p>
                </div>
              </div>
            </div>

            {/* STATUS */}

            <div>
              {profile.onboarding_status === "APPROVED" && (
                <span className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-4 py-2 text-xs font-mono text-emerald-700 dark:text-emerald-300">
                  <CheckCircle2 size={15} />
                  APPROVED
                </span>
              )}

              {profile.onboarding_status ===
                "PENDING_VERIFICATION" && (
                <span className="inline-flex items-center gap-2 rounded-full border border-amber-500/20 bg-amber-500/10 px-4 py-2 text-xs font-mono text-amber-700 dark:text-amber-300">
                  <AlertCircle size={15} />
                  PENDING VERIFICATION
                </span>
              )}

              {profile.onboarding_status === "REJECTED" && (
                <span className="inline-flex items-center gap-2 rounded-full border border-red-500/20 bg-red-500/10 px-4 py-2 text-xs font-mono text-red-700 dark:text-red-300">
                  <XCircle size={15} />
                  REJECTED
                </span>
              )}
            </div>
          </motion.div>

          {/* ==========================================
              SUCCESS
          ========================================== */}

          {successMessage && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-4 flex items-center gap-3 text-sm text-emerald-700 dark:text-emerald-300"
            >
              <CheckCircle2 size={18} />
              <span>{successMessage}</span>
            </motion.div>
          )}

          {/* ==========================================
              ERROR
          ========================================== */}

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl border border-red-500/20 bg-red-500/10 p-4 flex items-start gap-3 text-sm text-red-700 dark:text-red-300"
            >
              <AlertCircle
                size={18}
                className="shrink-0 mt-0.5"
              />

              <span>{error}</span>
            </motion.div>
          )}

          {/* ==========================================
              REJECTION REASON
          ========================================== */}

          {profile.onboarding_status === "REJECTED" &&
            profile.rejection_reason && (
              <motion.section
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-[28px] border border-red-500/20 bg-red-500/5 p-6 sm:p-8"
              >
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-red-500/10">
                    <XCircle
                      size={20}
                      className="text-red-600 dark:text-red-400"
                    />
                  </div>

                  <div>
                    <h2 className="text-lg font-semibold text-red-800 dark:text-red-300">
                      Application Rejection Reason
                    </h2>

                    <p className="mt-2 text-sm text-red-700/80 dark:text-red-300/80">
                      {profile.rejection_reason}
                    </p>
                  </div>
                </div>
              </motion.section>
            )}

          {/* ==========================================
              COMPANY INFORMATION
          ========================================== */}

          <motion.section
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-[28px] border border-ocean-900/10 bg-white/80 dark:border-sand-100/10 dark:bg-[#0a232b]/80 backdrop-blur-md p-6 sm:p-8 shadow-soft"
          >
            <div className="flex items-center gap-3 pb-5 border-b border-ocean-900/5 dark:border-sand-100/5">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-mangrove-500/15">
                <Building2
                  size={20}
                  className="text-mangrove-700 dark:text-mangrove-300"
                />
              </div>

              <div>
                <h2 className="text-lg font-display font-semibold">
                  Company Information
                </h2>

                <p className="text-xs text-ink-soft dark:text-sand-100/60">
                  Registered industry entity details
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-6">
              <InfoCard
                icon={<Building2 size={17} />}
                label="Company Name"
                value={profile.company_name}
              />

              <InfoCard
                icon={<BriefcaseBusiness size={17} />}
                label="Industry Type"
                value={profile.industry_type}
              />

              <InfoCard
                icon={<FileText size={17} />}
                label="GST Number"
                value={profile.gst_number}
                mono
              />

              <InfoCard
                icon={<FileText size={17} />}
                label="CIN Number"
                value={profile.cin_number}
                mono
              />

              <InfoCard
                icon={<Building2 size={17} />}
                label="Facility Name"
                value={profile.facility_name}
              />

              <InfoCard
                icon={<Globe size={17} />}
                label="Website"
                value={profile.website}
              />

              <InfoCard
                icon={<User size={17} />}
                label="Employee Count"
                value={
                  profile.employee_count !== null
                    ? String(profile.employee_count)
                    : null
                }
              />

              <InfoCard
                icon={<ShieldCheck size={17} />}
                label="Annual Emissions"
                value={
                  profile.annual_emissions !== null
                    ? `${profile.annual_emissions} tCO₂e`
                    : null
                }
              />
            </div>
          </motion.section>

          {/* ==========================================
              CONTACT INFORMATION
          ========================================== */}

          <motion.section
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="rounded-[28px] border border-ocean-900/10 bg-white/80 dark:border-sand-100/10 dark:bg-[#0a232b]/80 backdrop-blur-md p-6 sm:p-8 shadow-soft"
          >
            <div className="flex items-center gap-3 pb-5 border-b border-ocean-900/5 dark:border-sand-100/5">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-ocean-900/10 dark:bg-sand-100/10">
                <User
                  size={20}
                  className="text-ocean-900 dark:text-sand-50"
                />
              </div>

              <div>
                <h2 className="text-lg font-display font-semibold">
                  Contact & Location
                </h2>

                <p className="text-xs text-ink-soft dark:text-sand-100/60">
                  Authorized representative and registered facility
                  information
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-6">
              <InfoCard
                icon={<User size={17} />}
                label="Contact Person"
                value={profile.contact_name}
              />

              <InfoCard
                icon={<BriefcaseBusiness size={17} />}
                label="Designation"
                value={profile.contact_designation}
              />

              <InfoCard
                icon={<Mail size={17} />}
                label="Contact Email"
                value={profile.contact_email}
              />

              <InfoCard
                icon={<Phone size={17} />}
                label="Contact Phone"
                value={profile.contact_phone}
              />

              <InfoCard
                icon={<MapPin size={17} />}
                label="Address"
                value={
                  [
                    profile.address_line1,
                    profile.address_line2,
                    profile.city,
                    profile.state,
                    profile.pincode,
                    profile.country,
                  ]
                    .filter(Boolean)
                    .join(", ") || null
                }
              />

              <InfoCard
                icon={<MapPin size={17} />}
                label="Coordinates"
                value={
                  profile.latitude !== null &&
                  profile.longitude !== null
                    ? `${profile.latitude}, ${profile.longitude}`
                    : null
                }
                mono
              />
            </div>
          </motion.section>

          {/* ==========================================
              DOCUMENTS
          ========================================== */}

          <motion.section
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
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
                    Submitted Documents
                  </h2>

                  <p className="text-xs text-ink-soft dark:text-sand-100/60">
                    Open and verify the uploaded compliance files
                  </p>
                </div>
              </div>

              <span className="text-xs font-mono px-3 py-1.5 rounded-full bg-sand-100 dark:bg-[#071a20] border border-ocean-900/5 dark:border-sand-100/5">
                {documents.length} Documents
              </span>
            </div>

            {documents.length === 0 ? (
              <div className="py-10 text-center">
                <FileText
                  size={35}
                  className="mx-auto mb-3 text-ink-faint dark:text-sand-100/30"
                />

                <p className="text-sm font-medium">
                  No documents found
                </p>

                <p className="text-xs text-ink-soft dark:text-sand-100/50 mt-1">
                  This application has not uploaded any documents.
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
                          <h3 className="text-sm font-semibold truncate">
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

                    {document.reviewed_at && (
                      <p className="mt-3 text-[10px] font-mono text-ink-soft dark:text-sand-100/40">
                        Reviewed:{" "}
                        {new Date(
                          document.reviewed_at
                        ).toLocaleString()}
                      </p>
                    )}

                    <button
                      type="button"
                      onClick={() =>
                        openDocument(
                          document.storage_path
                        )
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
              REJECTION FORM
          ========================================== */}

          {rejectMode && (
            <motion.section
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-[28px] border border-red-500/20 bg-red-500/5 p-6 sm:p-8"
            >
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-red-500/10 shrink-0">
                  <XCircle
                    size={20}
                    className="text-red-600 dark:text-red-400"
                  />
                </div>

                <div className="flex-1">
                  <h2 className="text-lg font-semibold text-red-800 dark:text-red-300">
                    Reject Application
                  </h2>

                  <p className="text-xs text-red-700/70 dark:text-red-300/70 mt-1">
                    Enter the reason why this industry application is
                    being rejected.
                  </p>

                  <textarea
                    value={rejectionReason}
                    onChange={(event) =>
                      setRejectionReason(
                        event.target.value
                      )
                    }
                    rows={5}
                    placeholder="Example: GST certificate is invalid or the submitted environmental compliance document is incomplete."
                    className="mt-5 w-full rounded-2xl border border-red-500/20 bg-white/80 dark:bg-[#071a20] px-4 py-3 text-sm outline-none resize-none focus:ring-2 focus:ring-red-500/20"
                  />

                  <div className="flex flex-col sm:flex-row gap-3 mt-4">
                    <button
                      type="button"
                      disabled={actionLoading}
                      onClick={rejectApplication}
                      className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 hover:bg-red-700 text-white px-5 py-3 text-sm font-semibold transition-colors disabled:opacity-50"
                    >
                      {actionLoading ? (
                        <Loader2
                          size={16}
                          className="animate-spin"
                        />
                      ) : (
                        <XCircle size={16} />
                      )}

                      Confirm Rejection
                    </button>

                    <button
                      type="button"
                      disabled={actionLoading}
                      onClick={() => {
                        setRejectMode(false);
                        setRejectionReason("");
                        setError("");
                      }}
                      className="inline-flex items-center justify-center gap-2 rounded-xl border border-ocean-900/10 dark:border-sand-100/10 px-5 py-3 text-sm font-semibold hover:bg-sand-100 dark:hover:bg-[#102d35] transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </motion.section>
          )}

          {/* ==========================================
              APPROVE / REJECT ACTIONS
          ========================================== */}

          {profile.onboarding_status ===
            "PENDING_VERIFICATION" &&
            !rejectMode && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-[28px] border border-ocean-900/10 bg-white/80 dark:border-sand-100/10 dark:bg-[#0a232b]/80 backdrop-blur-md p-6 sm:p-8 shadow-soft"
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                  <div>
                    <h2 className="text-lg font-display font-semibold">
                      Authority Decision
                    </h2>

                    <p className="text-xs text-ink-soft dark:text-sand-100/60 mt-1">
                      Review all company information and documents
                      before making a decision.
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      type="button"
                      disabled={actionLoading}
                      onClick={() =>
                        setRejectMode(true)
                      }
                      className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 text-red-700 dark:text-red-300 hover:bg-red-500/15 px-6 py-3 text-sm font-semibold transition-colors disabled:opacity-50"
                    >
                      <XCircle size={17} />
                      Reject Application
                    </button>

                    <button
                      type="button"
                      disabled={actionLoading}
                      onClick={approveApplication}
                      className="inline-flex items-center justify-center gap-2 rounded-xl bg-mangrove-600 hover:bg-mangrove-700 text-white px-6 py-3 text-sm font-semibold transition-colors disabled:opacity-50"
                    >
                      {actionLoading ? (
                        <Loader2
                          size={17}
                          className="animate-spin"
                        />
                      ) : (
                        <CheckCircle2 size={17} />
                      )}

                      Approve Application
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

          {/* ==========================================
              APPROVED STATE
          ========================================== */}

          {profile.onboarding_status === "APPROVED" && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-[28px] border border-emerald-500/20 bg-emerald-500/5 p-6 sm:p-8"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10">
                  <CheckCircle2
                    size={25}
                    className="text-emerald-600 dark:text-emerald-400"
                  />
                </div>

                <div>
                  <h2 className="text-lg font-semibold text-emerald-800 dark:text-emerald-300">
                    Application Approved
                  </h2>

                  <p className="text-sm text-emerald-700/70 dark:text-emerald-300/70 mt-1">
                    This industry account has been successfully
                    approved.
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {/* ==========================================
              REFRESH
          ========================================== */}

          <div className="flex justify-center pb-5">
            <button
              type="button"
              disabled={loading || actionLoading}
              onClick={loadApplication}
              className="inline-flex items-center gap-2 rounded-xl border border-ocean-900/10 dark:border-sand-100/10 bg-white/70 dark:bg-[#0a232b] px-5 py-3 text-xs font-semibold hover:bg-sand-100 dark:hover:bg-[#102d35] transition-colors disabled:opacity-50"
            >
              <RefreshCw size={14} />
              Refresh Application
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

// ==========================================
// INFO CARD
// ==========================================

function InfoCard({
  icon,
  label,
  value,
  mono = false,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | null;
  mono?: boolean;
}) {
  return (
    <div className="rounded-2xl border border-ocean-900/5 dark:border-sand-100/5 bg-sand-50/60 dark:bg-[#071a20]/50 p-4">
      <div className="flex items-center gap-2 text-[11px] font-mono uppercase tracking-wider text-ink-soft dark:text-sand-100/50">
        {icon}

        <span>{label}</span>
      </div>

      <p
        className={`mt-2 text-sm font-medium text-ink dark:text-sand-50 break-words ${
          mono ? "font-mono text-xs" : ""
        }`}
      >
        {value || "Not provided"}
      </p>
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
"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  FileCheck,
  ShieldCheck,
  CheckCircle,
  FileText,
  Loader2,
  Edit3,
} from "lucide-react";

import { ThemeToggle } from "@/components/theme-toggle";
import { getSupabaseClient } from "@/lib/supabase";

interface IndustryProfile {
  company_name: string | null;
  cin_number: string | null;
  gst_number: string | null;
  industry_type: string | null;
}

interface IndustryDocument {
  id: string;
  document_type: string;
  file_name: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  uploaded_at: string | null;
}

const DOCUMENT_LABELS: Record<string, string> = {
  companyRegistration: "Company Registration Certificate",
  gstCertificate: "GST Certificate",
  pcbCertificate: "Pollution Control Board Certificate",
  environmentalClearance: "Environmental Clearance",
  carbonAuditReport: "Annual Carbon Audit Report",
  esgReport: "ESG / Sustainability Report",
  authorizationLetter: "Authorization Letter",
  additionalDocs: "Additional Document",
};

const REQUIRED_DOCUMENTS = [
  "companyRegistration",
  "gstCertificate",
  "pcbCertificate",
  "carbonAuditReport",
  "authorizationLetter",
];

export default function IndustryReviewPage() {
  const router = useRouter();

  const [profile, setProfile] = useState<IndustryProfile | null>(null);
  const [documents, setDocuments] = useState<IndustryDocument[]>([]);

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadReviewData = async () => {
      const supabase = getSupabaseClient();

      if (!supabase) {
        setError("Unable to connect to Supabase.");
        setIsLoading(false);
        return;
      }

      try {
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError || !user) {
          router.push("/login");
          return;
        }

        const [profileResult, documentsResult] = await Promise.all([
          supabase
            .from("industry_profiles")
            .select(
              "company_name, cin_number, gst_number, industry_type"
            )
            .eq("user_id", user.id)
            .maybeSingle(),

          supabase
            .from("industry_documents")
            .select(
              "id, document_type, file_name, status, uploaded_at"
            )
            .eq("user_id", user.id)
            .order("uploaded_at", { ascending: true }),
        ]);

        if (profileResult.error) {
          throw profileResult.error;
        }

        if (documentsResult.error) {
          throw documentsResult.error;
        }

        if (!profileResult.data) {
          setError(
            "Industry profile not found. Please complete your company profile first."
          );
          setIsLoading(false);
          return;
        }

        setProfile(profileResult.data);
        setDocuments(documentsResult.data || []);
      } catch (err) {
        console.error("Review page error:", err);

        setError(
          err instanceof Error
            ? err.message
            : "Failed to load your application details."
        );
      } finally {
        setIsLoading(false);
      }
    };

    loadReviewData();
  }, [router]);

  const hasAllRequiredDocuments = REQUIRED_DOCUMENTS.every((requiredType) =>
    documents.some(
      (document) =>
        document.document_type === requiredType &&
        document.status !== "REJECTED"
    )
  );

  const getDocumentLabel = (documentType: string) => {
    return DOCUMENT_LABELS[documentType] || "Document";
  };

  const getStatusStyle = (status: IndustryDocument["status"]) => {
    if (status === "APPROVED") {
      return "bg-emerald-500/10 text-emerald-600 border-emerald-500/20";
    }

    if (status === "REJECTED") {
      return "bg-red-500/10 text-red-600 border-red-500/20";
    }

    return "bg-amber-500/10 text-amber-600 border-amber-500/20";
  };

  const handleFinalSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!agreedToTerms) {
      setError(
        "Please confirm that all submitted details are accurate before proceeding."
      );
      return;
    }

    if (!profile) {
      setError("Company profile information is missing.");
      return;
    }

    if (!hasAllRequiredDocuments) {
      setError(
        "Please upload all required documents before submitting your application."
      );
      return;
    }

    const supabase = getSupabaseClient();

    if (!supabase) {
      setError("Unable to connect to Supabase.");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        router.push("/login");
        return;
      }

      const { error: updateError } = await supabase
        .from("industry_profiles")
        .update({
          onboarding_status: "PENDING_VERIFICATION",
          updated_at: new Date().toISOString(),
        })
        .eq("user_id", user.id);

      if (updateError) {
        throw updateError;
      }

      router.push("/industry/onboarding/verification");
    } catch (err) {
      console.error("Final submission error:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Failed to submit your application."
      );

      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="border-b border-border/60 bg-background/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <Link
            href="/industry/onboarding/documents"
            className="flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Documents
          </Link>

          <ThemeToggle />
        </div>
      </header>

      {/* Main */}
      <main className="mx-auto max-w-5xl px-6 py-10">
        {/* Step indicator */}
        <div className="mb-8 flex items-center justify-center">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
              03.5
            </div>

            <div>
              <p className="text-sm font-semibold">Final Review Step</p>
              <p className="text-xs text-muted-foreground">
                Confirm Application Details
              </p>
            </div>
          </div>
        </div>

        {/* Page heading */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10 text-center"
        >
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
            <ShieldCheck className="h-7 w-7 text-primary" />
          </div>

          <h1 className="text-3xl font-bold tracking-tight">
            Review Your Application
          </h1>

          <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
            Review your company information and uploaded documents before
            submitting your application for authority verification.
          </p>
        </motion.div>

        {/* Error */}
        {error && (
          <div className="mb-6 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        {isLoading ? (
          <div className="flex min-h-[300px] items-center justify-center">
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">
                Loading your application...
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Company Profile */}
            <motion.section
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl border border-border/60 bg-card p-6 shadow-sm"
            >
              <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10">
                    <Building2 className="h-5 w-5 text-primary" />
                  </div>

                  <div>
                    <h2 className="font-semibold">Company Profile</h2>
                    <p className="text-sm text-muted-foreground">
                      Your registered industry details
                    </p>
                  </div>
                </div>

                <Link
                  href="/industry/onboarding/profile"
                  className="flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm font-medium transition-colors hover:bg-muted"
                >
                  <Edit3 className="h-4 w-4" />
                  Edit
                </Link>
              </div>

              {profile && (
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <p className="mb-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      Company Name
                    </p>
                    <p className="font-medium">
                      {profile.company_name || "Not provided"}
                    </p>
                  </div>

                  <div>
                    <p className="mb-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      Registration / CIN
                    </p>
                    <p className="font-medium">
                      {profile.cin_number || "Not provided"}
                    </p>
                  </div>

                  <div>
                    <p className="mb-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      GST
                    </p>
                    <p className="font-medium">
                      {profile.gst_number || "Not provided"}
                    </p>
                  </div>

                  <div>
                    <p className="mb-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      Industry Sector
                    </p>
                    <p className="font-medium">
                      {profile.industry_type || "Not provided"}
                    </p>
                  </div>
                </div>
              )}
            </motion.section>

            {/* Documents */}
            <motion.section
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="rounded-2xl border border-border/60 bg-card p-6 shadow-sm"
            >
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10">
                  <FileCheck className="h-5 w-5 text-primary" />
                </div>

                <div>
                  <h2 className="font-semibold">
                    Uploaded Filings Summary
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Documents submitted for verification
                  </p>
                </div>
              </div>

              {documents.length === 0 ? (
                <div className="rounded-xl border border-dashed border-border p-8 text-center">
                  <FileText className="mx-auto mb-3 h-8 w-8 text-muted-foreground" />

                  <p className="font-medium">
                    No documents uploaded
                  </p>

                  <p className="mt-1 text-sm text-muted-foreground">
                    Please upload your required documents before continuing.
                  </p>

                  <Link
                    href="/industry/onboarding/documents"
                    className="mt-4 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
                  >
                    Upload Documents
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {documents.map((document) => (
                    <div
                      key={document.id}
                      className="flex items-center justify-between gap-4 rounded-xl border border-border/60 p-4"
                    >
                      <div className="flex min-w-0 items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted">
                          <FileText className="h-5 w-5 text-muted-foreground" />
                        </div>

                        <div className="min-w-0">
                          <p className="font-medium">
                            {getDocumentLabel(document.document_type)}
                          </p>

                          <p className="truncate text-sm text-muted-foreground">
                            {document.file_name}
                          </p>
                        </div>
                      </div>

                      <span
                        className={`shrink-0 rounded-full border px-3 py-1 text-xs font-medium ${getStatusStyle(
                          document.status
                        )}`}
                      >
                        {document.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {!hasAllRequiredDocuments && documents.length > 0 && (
                <div className="mt-5 rounded-xl border border-amber-500/20 bg-amber-500/10 p-4 text-sm text-amber-700">
                  Some required documents are missing or rejected. Please go
                  back to the Documents step and complete the required uploads.
                </div>
              )}
            </motion.section>

            {/* Ready for review */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-5"
            >
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-500/10">
                  <CheckCircle className="h-5 w-5 text-emerald-600" />
                </div>

                <div>
                  <h3 className="font-semibold">Ready for Review</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Once submitted, your application will be sent to the
                    Authority for verification. You will be able to track the
                    verification status from your Industry dashboard.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Final submit */}
            <form onSubmit={handleFinalSubmit}>
              <div className="rounded-2xl border border-border/60 bg-card p-6 shadow-sm">
                <label className="flex cursor-pointer items-start gap-3">
                  <input
                    type="checkbox"
                    checked={agreedToTerms}
                    onChange={(e) => {
                      setAgreedToTerms(e.target.checked);
                      if (e.target.checked) {
                        setError("");
                      }
                    }}
                    className="mt-1 h-4 w-4 rounded border-border"
                  />

                  <span className="text-sm leading-6 text-muted-foreground">
                    I confirm that all information and documents submitted in
                    this application are accurate and belong to the registered
                    industry entity.
                  </span>
                </label>

                <div className="mt-6 flex flex-col-reverse gap-3 border-t border-border/60 pt-6 sm:flex-row sm:items-center sm:justify-between">
                  <Link
                    href="/industry/onboarding/documents"
                    className="flex items-center justify-center gap-2 rounded-xl border border-border px-5 py-3 text-sm font-medium transition-colors hover:bg-muted"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Back
                  </Link>

                  <button
                    type="submit"
                    disabled={
                      isSubmitting ||
                      !agreedToTerms ||
                      !hasAllRequiredDocuments
                    }
                    className="flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        Submit for Verification
                        <ArrowRight className="h-4 w-4" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}
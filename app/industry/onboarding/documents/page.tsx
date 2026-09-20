"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  CheckCircle2,
  FileText,
  Loader2,
  Upload,
  X,
  AlertCircle,
} from "lucide-react";

import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { getSupabaseClient } from "@/lib/supabase";

// ======================================================
// TYPES
// ======================================================

type DocumentStatus =
  | "PENDING"
  | "APPROVED"
  | "REJECTED";

interface SavedDocument {
  id: string;
  document_type: string;
  file_name: string;
  storage_path: string;
  status: DocumentStatus;
  rejection_reason: string | null;
  uploaded_at: string;
}

interface DocumentField {
  key: string;
  title: string;
  description: string;
  required: boolean;
  accept: string;
  multiple?: boolean;
}

// ======================================================
// DOCUMENT CONFIGURATION
// ======================================================

const DOCUMENT_FIELDS: DocumentField[] = [
  {
    key: "companyRegistration",
    title: "Company Registration Certificate",
    description:
      "Certificate of incorporation or company registration document.",
    required: true,
    accept: ".pdf",
  },
  {
    key: "gstCertificate",
    title: "GST Certificate",
    description:
      "Valid GST registration certificate of the company.",
    required: true,
    accept: ".pdf",
  },
  {
    key: "pcbCertificate",
    title: "Pollution Control Board Certificate",
    description:
      "Valid pollution control board consent or certificate.",
    required: true,
    accept: ".pdf,.jpg,.jpeg,.png",
  },
  {
    key: "environmentalClearance",
    title: "Environmental Clearance",
    description:
      "Environmental clearance or related regulatory approval.",
    required: false,
    accept: ".pdf",
  },
  {
    key: "carbonAuditReport",
    title: "Carbon Audit Report",
    description:
      "Latest available carbon or emissions audit report.",
    required: true,
    accept: ".pdf",
  },
  {
    key: "esgReport",
    title: "ESG Report",
    description:
      "Company ESG or sustainability report, if available.",
    required: false,
    accept: ".pdf",
  },
  {
    key: "authorizationLetter",
    title: "Authorization Letter",
    description:
      "Authorized representative or company authorization letter.",
    required: true,
    accept: ".pdf",
  },
  {
    key: "additionalDocs",
    title: "Additional Documents",
    description:
      "Any other supporting documents relevant to your application.",
    required: false,
    accept: ".pdf,.jpg,.jpeg,.png,.zip",
    multiple: true,
  },
];

// ======================================================
// MAIN COMPONENT
// ======================================================

export default function IndustryDocumentsPage() {
  const router = useRouter();

  const [selectedFiles, setSelectedFiles] = useState<
    Record<string, File[]>
  >({});

  const [savedDocuments, setSavedDocuments] = useState<
    SavedDocument[]
  >([]);

  const [loading, setLoading] = useState(true);

  const [uploading, setUploading] = useState(false);

  const [error, setError] = useState("");

  const [successMessage, setSuccessMessage] =
    useState("");

  const [userId, setUserId] = useState("");

  // ======================================================
  // LOAD USER + SAVED DOCUMENTS
  // ======================================================

  useEffect(() => {
    loadDocuments();
  }, []);

  const loadDocuments = async () => {
    const supabase = getSupabaseClient();

    if (!supabase) {
      setError(
        "Supabase client could not be initialized."
      );
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");

      // ------------------------------------------
      // CURRENT USER
      // ------------------------------------------

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/login");
        return;
      }

      setUserId(user.id);

      // ------------------------------------------
      // PROFILE
      // ------------------------------------------

      const { data: profile, error: profileError } =
        await supabase
          .from("industry_profiles")
          .select(
            `
              id,
              onboarding_status,
              rejection_reason
            `
          )
          .eq("user_id", user.id)
          .single();

      if (profileError) {
        console.error(profileError);

        setError(
          "Please complete your Industry profile before uploading documents."
        );

        return;
      }

      // ------------------------------------------
      // DOCUMENTS
      // ------------------------------------------

      const { data: documents, error: documentsError } =
        await supabase
          .from("industry_documents")
          .select("*")
          .eq("user_id", user.id)
          .order("uploaded_at", {
            ascending: false,
          });

      if (documentsError) {
        console.error(documentsError);

        setError(
          "Unable to load your previously uploaded documents."
        );

        return;
      }

      setSavedDocuments(
        (documents || []) as SavedDocument[]
      );
    } catch (err) {
      console.error(err);

      setError(
        "Something went wrong while loading your documents."
      );
    } finally {
      setLoading(false);
    }
  };

  // ======================================================
  // GET LATEST DOCUMENT FOR EACH TYPE
  // ======================================================
  //
  // Important:
  // If an old document was REJECTED and the user uploads
  // a corrected version, both rows remain in the database.
  //
  // We always use the newest uploaded document for the UI.
  // This preserves the old record for audit/history.
  //
  // ======================================================

  const latestDocuments = useMemo(() => {
    const map: Record<string, SavedDocument> = {};

    for (const document of savedDocuments) {
      if (!map[document.document_type]) {
        map[document.document_type] = document;
      }
    }

    return map;
  }, [savedDocuments]);

  // ======================================================
  // FILE SELECTION
  // ======================================================

  const handleFileChange = (
    documentType: string,
    files: FileList | null,
    multiple = false
  ) => {
    if (!files) return;

    const fileArray = Array.from(files);

    if (fileArray.length === 0) return;

    setSelectedFiles((previous) => ({
      ...previous,
      [documentType]: multiple
        ? fileArray
        : [fileArray[0]],
    }));

    setError("");
    setSuccessMessage("");
  };

  // ======================================================
  // REMOVE SELECTED FILE
  // ======================================================

  const removeSelectedFile = (
    documentType: string,
    index: number
  ) => {
    setSelectedFiles((previous) => {
      const current = previous[documentType] || [];

      const updated = current.filter(
        (_, fileIndex) => fileIndex !== index
      );

      const next = {
        ...previous,
        [documentType]: updated,
      };

      if (updated.length === 0) {
        delete next[documentType];
      }

      return next;
    });
  };

  // ======================================================
  // VALIDATE REQUIRED DOCUMENTS
  // ======================================================

  const validateRequiredDocuments = () => {
    for (const field of DOCUMENT_FIELDS) {
      if (!field.required) continue;

      const selected =
        selectedFiles[field.key] || [];

      const latest = latestDocuments[field.key];

      // A required document is valid when:
      //
      // 1. User selected a new replacement file
      // OR
      // 2. Existing latest document is not rejected
      //
      if (
        selected.length === 0 &&
        (!latest || latest.status === "REJECTED")
      ) {
        return {
          valid: false,
          message: `Please upload ${field.title}.`,
        };
      }
    }

    return {
      valid: true,
      message: "",
    };
  };

  // ======================================================
  // UPLOAD ONE DOCUMENT
  // ======================================================

  const uploadDocument = async (
    documentType: string,
    file: File
  ) => {
    const supabase = getSupabaseClient();

    if (!supabase) {
      throw new Error(
        "Supabase client could not be initialized."
      );
    }

    if (!userId) {
      throw new Error("User session not found.");
    }

    // ------------------------------------------
    // SAFE FILE NAME
    // ------------------------------------------

    const safeFileName = file.name
      .replace(/[^a-zA-Z0-9._-]/g, "_");

    const timestamp = Date.now();

    const storagePath =
      `${userId}/${documentType}/${timestamp}-${safeFileName}`;

    // ------------------------------------------
    // UPLOAD TO STORAGE
    // ------------------------------------------

    const { error: uploadError } =
      await supabase.storage
        .from("industry-documents")
        .upload(storagePath, file, {
          cacheControl: "3600",
          upsert: false,
        });

    if (uploadError) {
      console.error(uploadError);

      throw new Error(
        `Failed to upload ${file.name}: ${uploadError.message}`
      );
    }

    // ------------------------------------------
    // INSERT NEW DATABASE RECORD
    // ------------------------------------------
    //
    // IMPORTANT:
    // We DO NOT update/delete the old rejected row.
    //
    // A new row is inserted with PENDING status.
    //
    // This gives us an audit history:
    //
    // Old document -> REJECTED
    // New document -> PENDING
    //
    // ------------------------------------------

    const { error: insertError } =
      await supabase
        .from("industry_documents")
        .insert({
          user_id: userId,
          document_type: documentType,
          file_name: file.name,
          storage_path: storagePath,
          status: "PENDING",
          rejection_reason: null,
        });

    if (insertError) {
      console.error(insertError);

      // ------------------------------------------
      // CLEAN UP STORAGE IF DB INSERT FAILS
      // ------------------------------------------

      await supabase.storage
        .from("industry-documents")
        .remove([storagePath]);

      throw new Error(
        `Failed to save ${file.name}: ${insertError.message}`
      );
    }

    return {
      documentType,
      fileName: file.name,
      storagePath,
    };
  };

  // ======================================================
  // UPLOAD ALL SELECTED FILES
  // ======================================================

  const uploadSelectedDocuments = async () => {
    const selectedEntries = Object.entries(
      selectedFiles
    );

    if (selectedEntries.length === 0) {
      return;
    }

    for (const [
      documentType,
      files,
    ] of selectedEntries) {
      for (const file of files) {
        await uploadDocument(
          documentType,
          file
        );
      }
    }
  };

  // ======================================================
  // SAVE PROGRESS
  // ======================================================

  const handleSaveProgress = async () => {
    const supabase = getSupabaseClient();

    if (!supabase) {
      setError(
        "Supabase client could not be initialized."
      );
      return;
    }

    try {
      setUploading(true);
      setError("");
      setSuccessMessage("");

      if (!userId) {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          router.push("/login");
          return;
        }

        setUserId(user.id);
      }

      // ------------------------------------------
      // UPLOAD SELECTED FILES
      // ------------------------------------------

      await uploadSelectedDocuments();

      // ------------------------------------------
      // UPDATE PROFILE STATUS
      // ------------------------------------------

      const { error: profileError } =
        await supabase
          .from("industry_profiles")
          .update({
            onboarding_status: "PENDING_DOCUMENTS",
          })
          .eq("user_id", userId);

      if (profileError) {
        console.error(profileError);

        throw new Error(
          "Documents uploaded, but profile status could not be updated."
        );
      }

      // ------------------------------------------
      // CLEAR LOCAL FILES
      // ------------------------------------------

      setSelectedFiles({});

      setSuccessMessage(
        "Your documents have been saved successfully."
      );

      await loadDocuments();
    } catch (err) {
      console.error(err);

      setError(
        err instanceof Error
          ? err.message
          : "Unable to save your documents."
      );
    } finally {
      setUploading(false);
    }
  };

  // ======================================================
  // FINAL SUBMIT
  // ======================================================

  const handleFinalSubmit = async () => {
    const supabase = getSupabaseClient();

    if (!supabase) {
      setError(
        "Supabase client could not be initialized."
      );
      return;
    }

    try {
      setUploading(true);
      setError("");
      setSuccessMessage("");

      // ------------------------------------------
      // VALIDATE
      // ------------------------------------------

      const validation =
        validateRequiredDocuments();

      if (!validation.valid) {
        setError(validation.message);
        setUploading(false);
        return;
      }

      // ------------------------------------------
      // UPLOAD NEW / REPLACEMENT FILES
      // ------------------------------------------

      await uploadSelectedDocuments();

      // ------------------------------------------
      // IMPORTANT
      // ------------------------------------------
      //
      // Reload documents AFTER upload so that a
      // replacement document is now considered
      // the latest document.
      //
      // ------------------------------------------

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/login");
        return;
      }

      // ------------------------------------------
      // FETCH LATEST DOCUMENTS DIRECTLY
      // ------------------------------------------

      const { data: freshDocuments, error: freshError } =
        await supabase
          .from("industry_documents")
          .select("*")
          .eq("user_id", user.id)
          .order("uploaded_at", {
            ascending: false,
          });

      if (freshError) {
        console.error(freshError);

        throw new Error(
          "Unable to verify the latest uploaded documents."
        );
      }

      const latestMap: Record<
        string,
        SavedDocument
      > = {};

      for (const document of (
        freshDocuments || []
      ) as SavedDocument[]) {
        if (!latestMap[document.document_type]) {
          latestMap[document.document_type] =
            document;
        }
      }

      // ------------------------------------------
      // CHECK REQUIRED DOCUMENTS AGAIN
      // ------------------------------------------

      for (const requiredType of REQUIRED_DOCUMENTS) {
        const document =
          latestMap[requiredType];

        if (
          !document ||
          document.status === "REJECTED"
        ) {
          const label =
            DOCUMENT_FIELDS.find(
              (field) =>
                field.key === requiredType
            )?.title || requiredType;

          throw new Error(
            `Please provide a valid ${label}.`
          );
        }
      }

      // ------------------------------------------
      // UPDATE PROFILE
      // ------------------------------------------

      const { error: updateError } =
        await supabase
          .from("industry_profiles")
          .update({
            onboarding_status:
              "PENDING_VERIFICATION",

            // Clear the previous profile-level
            // rejection reason when resubmitting.
            rejection_reason: null,
          })
          .eq("user_id", user.id);

      if (updateError) {
        console.error(updateError);

        throw new Error(
          "Documents are saved, but the application could not be submitted for verification."
        );
      }

      // ------------------------------------------
      // CLEAR LOCAL STATE
      // ------------------------------------------

      setSelectedFiles({});

      // ------------------------------------------
      // REDIRECT TO REVIEW
      // ------------------------------------------

      router.push(
        "/industry/onboarding/review"
      );
    } catch (err) {
      console.error(err);

      setError(
        err instanceof Error
          ? err.message
          : "Unable to submit your documents."
      );
    } finally {
      setUploading(false);
    }
  };

  // ======================================================
  // REQUIRED DOCUMENTS
  // ======================================================

  const REQUIRED_DOCUMENTS = [
    "companyRegistration",
    "gstCertificate",
    "pcbCertificate",
    "carbonAuditReport",
    "authorizationLetter",
  ];

  // ======================================================
  // LOADING
  // ======================================================

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
              Loading your documents...
            </p>
          </div>
        </main>

        <Footer />
      </div>
    );
  }

  // ======================================================
  // MAIN UI
  // ======================================================

  return (
    <div className="min-h-screen bg-sand-100 dark:bg-[#061418] text-ink dark:text-sand-100 flex flex-col">
      <Navbar />

      <main className="relative flex-1 container mx-auto px-4 sm:px-6 lg:px-8 pt-28 sm:pt-36 pb-16 max-w-6xl">
        {/* Background */}
        <div className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2 h-[600px] w-[1000px] rounded-full bg-gradient-to-b from-ocean-300/15 via-mangrove-300/10 to-transparent blur-3xl" />

        <div className="relative z-10 space-y-8">
          {/* ==================================================
              HEADER
          ================================================== */}

          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <button
              type="button"
              onClick={() =>
                router.push(
                  "/industry/onboarding"
                )
              }
              className="inline-flex items-center gap-2 text-xs font-mono text-ink-soft dark:text-sand-100/60 hover:text-ink dark:hover:text-sand-50 transition-colors mb-5"
            >
              <ArrowLeft size={14} />
              Back to Onboarding
            </button>

            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-ocean-900/10 dark:bg-sand-100/10">
                <FileText
                  size={25}
                  className="text-ocean-900 dark:text-sand-50"
                />
              </div>

              <div>
                <h1 className="text-2xl sm:text-3xl font-display font-semibold tracking-tight">
                  Compliance Documents
                </h1>

                <p className="mt-1 text-sm text-ink-soft dark:text-sand-100/60">
                  Upload the documents required to verify your
                  Industry account.
                </p>
              </div>
            </div>
          </motion.div>

          {/* ==================================================
              REJECTION NOTICE
          ================================================== */}

          {savedDocuments.some(
            (document) =>
              document.status === "REJECTED"
          ) && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-[24px] border border-red-500/20 bg-red-500/5 p-5 sm:p-6"
            >
              <div className="flex items-start gap-3">
                <AlertCircle
                  size={20}
                  className="shrink-0 text-red-600 dark:text-red-400"
                />

                <div>
                  <h2 className="text-sm font-semibold text-red-800 dark:text-red-300">
                    Some documents were rejected
                  </h2>

                  <p className="text-xs text-red-700/70 dark:text-red-300/60 mt-1">
                    Please review the rejection reasons below and
                    upload corrected documents. Your previous
                    rejected documents are kept as part of the
                    verification history.
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {/* ==================================================
              SUCCESS MESSAGE
          ================================================== */}

          {successMessage && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-4 flex items-center gap-3 text-sm text-emerald-700 dark:text-emerald-300"
            >
              <CheckCircle2 size={18} />
              <span>{successMessage}</span>
            </motion.div>
          )}

          {/* ==================================================
              ERROR MESSAGE
          ================================================== */}

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
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

          {/* ==================================================
              DOCUMENT LIST
          ================================================== */}

          <div className="space-y-5">
            {DOCUMENT_FIELDS.map(
              (field, index) => {
                const latest =
                  latestDocuments[field.key];

                const selected =
                  selectedFiles[field.key] || [];

                const isRejected =
                  latest?.status === "REJECTED";

                const isApproved =
                  latest?.status === "APPROVED";

                const isPending =
                  latest?.status === "PENDING";

                return (
                  <motion.section
                    key={field.key}
                    initial={{
                      opacity: 0,
                      y: 12,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    transition={{
                      delay: index * 0.03,
                    }}
                    className={`rounded-[24px] border bg-white/80 dark:bg-[#0a232b]/80 backdrop-blur-md p-5 sm:p-6 shadow-soft ${
                      isRejected
                        ? "border-red-500/20"
                        : "border-ocean-900/10 dark:border-sand-100/10"
                    }`}
                  >
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                      <div className="flex items-start gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-ocean-900/10 dark:bg-sand-100/10">
                          <FileText
                            size={18}
                            className="text-ocean-900 dark:text-sand-50"
                          />
                        </div>

                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <h2 className="text-sm font-semibold">
                              {field.title}
                            </h2>

                            {field.required && (
                              <span className="text-[9px] font-mono uppercase tracking-wider text-red-500">
                                Required
                              </span>
                            )}
                          </div>

                          <p className="mt-1 text-xs leading-5 text-ink-soft dark:text-sand-100/55 max-w-2xl">
                            {field.description}
                          </p>
                        </div>
                      </div>

                      {/* Existing status */}
                      {latest && (
                        <DocumentStatus
                          status={latest.status}
                        />
                      )}
                    </div>

                    {/* ==================================================
                        EXISTING DOCUMENT
                    ================================================== */}

                    {latest && (
                      <div className="mt-5 rounded-2xl border border-ocean-900/5 dark:border-sand-100/5 bg-sand-50/60 dark:bg-[#071a20]/50 p-4">
                        <div className="flex items-start justify-between gap-4">
                          <div className="min-w-0">
                            <p className="text-[10px] font-mono uppercase tracking-wider text-ink-soft dark:text-sand-100/40">
                              Latest Uploaded File
                            </p>

                            <p className="text-xs font-medium mt-1 truncate">
                              {latest.file_name}
                            </p>

                            <p className="text-[10px] text-ink-soft dark:text-sand-100/40 mt-1">
                              Uploaded{" "}
                              {new Date(
                                latest.uploaded_at
                              ).toLocaleString()}
                            </p>
                          </div>

                          {isApproved && (
                            <CheckCircle2
                              size={18}
                              className="shrink-0 text-emerald-500"
                            />
                          )}
                        </div>

                        {/* Rejection reason */}
                        {isRejected &&
                          latest.rejection_reason && (
                            <div className="mt-3 rounded-xl border border-red-500/15 bg-red-500/10 p-3">
                              <p className="text-[10px] font-mono uppercase tracking-wider font-semibold text-red-700 dark:text-red-300">
                                Authority Feedback
                              </p>

                              <p className="mt-1 text-xs leading-5 text-red-700/80 dark:text-red-300/80">
                                {
                                  latest.rejection_reason
                                }
                              </p>
                            </div>
                          )}

                        {/* Replacement notice */}
                        {isRejected && (
                          <div className="mt-3 flex items-center gap-2 text-[11px] text-red-700/70 dark:text-red-300/60">
                            <AlertCircle size={13} />

                            <span>
                              Upload a corrected version below
                              to replace this rejected document.
                            </span>
                          </div>
                        )}

                        {/* Pending notice */}
                        {isPending && (
                          <div className="mt-3 flex items-center gap-2 text-[11px] text-amber-700/70 dark:text-amber-300/60">
                            <Loader2
                              size={13}
                              className="animate-spin"
                            />

                            <span>
                              This document is waiting for Authority
                              review.
                            </span>
                          </div>
                        )}
                      </div>
                    )}

                    {/* ==================================================
                        SELECTED NEW FILES
                    ================================================== */}

                    {selected.length > 0 && (
                      <div className="mt-5 space-y-2">
                        <p className="text-[10px] font-mono uppercase tracking-wider text-ink-soft dark:text-sand-100/40">
                          New File{selected.length > 1 ? "s" : ""}
                        </p>

                        {selected.map(
                          (file, fileIndex) => (
                            <div
                              key={`${file.name}-${fileIndex}`}
                              className="flex items-center justify-between gap-3 rounded-xl border border-mangrove-500/20 bg-mangrove-500/5 px-3 py-2.5"
                            >
                              <div className="flex items-center gap-2 min-w-0">
                                <Upload
                                  size={14}
                                  className="shrink-0 text-mangrove-600"
                                />

                                <span className="text-xs truncate">
                                  {file.name}
                                </span>
                              </div>

                              <button
                                type="button"
                                onClick={() =>
                                  removeSelectedFile(
                                    field.key,
                                    fileIndex
                                  )
                                }
                                className="shrink-0 p-1 rounded-lg hover:bg-red-500/10 text-ink-soft hover:text-red-500 transition-colors"
                              >
                                <X size={14} />
                              </button>
                            </div>
                          )
                        )}
                      </div>
                    )}

                    {/* ==================================================
                        UPLOAD BUTTON
                    ================================================== */}

                    <div className="mt-5">
                      <label className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-ocean-900/15 dark:border-sand-100/15 bg-sand-50/50 dark:bg-[#071a20]/40 px-5 py-7 cursor-pointer hover:bg-sand-100 dark:hover:bg-[#102d35] transition-colors">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-ocean-900/10 dark:bg-sand-100/10">
                          <Upload
                            size={18}
                            className="text-ocean-900 dark:text-sand-50"
                          />
                        </div>

                        <span className="text-xs font-semibold">
                          {isRejected
                            ? "Upload Corrected Document"
                            : "Choose File"}
                        </span>

                        <span className="text-[10px] text-ink-soft dark:text-sand-100/45">
                          Accepted:{" "}
                          {field.accept
                            .replaceAll(
                              ".",
                              ""
                            )
                            .toUpperCase()
                            .split(",")
                            .join(", ")}
                        </span>

                        <input
                          type="file"
                          className="hidden"
                          accept={field.accept}
                          multiple={field.multiple}
                          onChange={(event) =>
                            handleFileChange(
                              field.key,
                              event.target.files,
                              field.multiple
                            )
                          }
                        />
                      </label>
                    </div>
                  </motion.section>
                );
              }
            )}
          </div>

          {/* ==================================================
              ACTIONS
          ================================================== */}

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-[24px] border border-ocean-900/10 dark:border-sand-100/10 bg-white/80 dark:bg-[#0a232b]/80 backdrop-blur-md p-5 sm:p-6"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
              <div>
                <p className="text-sm font-semibold">
                  Ready to continue?
                </p>

                <p className="text-xs text-ink-soft dark:text-sand-100/55 mt-1">
                  Save your progress or submit all required
                  documents for Authority verification.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  disabled={uploading}
                  onClick={handleSaveProgress}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-ocean-900/10 dark:border-sand-100/10 bg-white dark:bg-[#071a20] px-5 py-3 text-xs font-semibold hover:bg-sand-100 dark:hover:bg-[#102d35] transition-colors disabled:opacity-50"
                >
                  {uploading ? (
                    <Loader2
                      size={15}
                      className="animate-spin"
                    />
                  ) : (
                    <FileText size={15} />
                  )}

                  Save Progress
                </button>

                <button
                  type="button"
                  disabled={uploading}
                  onClick={handleFinalSubmit}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-ocean-900 px-5 py-3 text-xs font-semibold text-sand-50 hover:bg-ocean-800 transition-colors disabled:opacity-50"
                >
                  {uploading ? (
                    <Loader2
                      size={15}
                      className="animate-spin"
                    />
                  ) : (
                    <CheckCircle2 size={15} />
                  )}

                  Submit for Verification
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

// ======================================================
// DOCUMENT STATUS COMPONENT
// ======================================================

function DocumentStatus({
  status,
}: {
  status: DocumentStatus;
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
        <X size={11} />
        REJECTED
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/20 bg-amber-500/10 px-2.5 py-1 text-[10px] font-mono text-amber-700 dark:text-amber-300 shrink-0">
      <Loader2
        size={11}
        className="animate-spin"
      />
      PENDING
    </span>
  );
}
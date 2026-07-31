"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText,
  UploadCloud,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Save,
  Trash2,
  FileCheck,
  Building,
  ShieldCheck,
  Paperclip,
  Loader2,
} from "lucide-react";

import { ThemeToggle } from "@/components/theme-toggle";

interface DocumentField {
  id: string;
  label: string;
  description: string;
  required: boolean;
  accept: string;
  multiple?: boolean;
}

const DOCUMENT_FIELDS: DocumentField[] = [
  {
    id: "companyRegistration",
    label: "Company Registration Certificate",
    description: "Certificate of Incorporation or Registration document.",
    required: true,
    accept: ".pdf",
  },
  {
    id: "gstCertificate",
    label: "GST Certificate",
    description: "Valid GST Registration Certificate (Form GST REG-06).",
    required: true,
    accept: ".pdf",
  },
  {
    id: "pcbCertificate",
    label: "Pollution Control Board (PCB) Certificate",
    description: "Consent to Operate / Establish from State PCB.",
    required: true,
    accept: ".pdf,.jpg,.jpeg,.png",
  },
  {
    id: "environmentalClearance",
    label: "Environmental Clearance",
    description: "MoEFCC or SEIAA clearance letter (if applicable).",
    required: false,
    accept: ".pdf",
  },
  {
    id: "carbonAuditReport",
    label: "Annual Carbon Audit Report",
    description: "Third-party verified carbon emission audit.",
    required: true,
    accept: ".pdf",
  },
  {
    id: "esgReport",
    label: "ESG / Sustainability Report",
    description: "Latest annual ESG or sustainability disclosure.",
    required: false,
    accept: ".pdf",
  },
  {
    id: "authorizationLetter",
    label: "Authorization Letter",
    description: "Board resolution or legal authorization for representative.",
    required: true,
    accept: ".pdf",
  },
  {
    id: "additionalDocs",
    label: "Any Additional Documents",
    description: "Supporting telemetry diagrams, ISO certifications, etc.",
    required: false,
    accept: ".pdf,.jpg,.jpeg,.png,.zip",
    multiple: true,
  },
];

export default function DocumentUploadPage() {
  const router = useRouter();
  
  // State for single-file uploads
  const [files, setFiles] = useState<{ [key: string]: File | null }>({});
  // State for multi-file upload
  const [additionalFiles, setAdditionalFiles] = useState<File[]>([]);
  // UI States
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDraftSaved, setIsDraftSaved] = useState(false);

  // File Change Handler
  const handleFileChange = (fieldId: string, selectedFiles: FileList | null) => {
    if (!selectedFiles || selectedFiles.length === 0) return;

    if (fieldId === "additionalDocs") {
      const newFiles = Array.from(selectedFiles);
      setAdditionalFiles((prev) => [...prev, ...newFiles]);
    } else {
      const file = selectedFiles[0];
      // Size check (Max 15MB)
      if (file.size > 15 * 1024 * 1024) {
        setErrors((prev) => ({ ...prev, [fieldId]: "File size must be under 15MB" }));
        return;
      }
      setFiles((prev) => ({ ...prev, [fieldId]: file }));
      setErrors((prev) => {
        const newErr = { ...prev };
        delete newErr[fieldId];
        return newErr;
      });
    }
  };

  const removeFile = (fieldId: string) => {
    setFiles((prev) => ({ ...prev, [fieldId]: null }));
  };

  const removeAdditionalFile = (index: number) => {
    setAdditionalFiles((prev) => prev.filter((_, i) => i !== index));
  };

  // Calculate completion percentage
  const requiredFields = DOCUMENT_FIELDS.filter((f) => f.required);
  const completedRequired = requiredFields.filter((f) => !!files[f.id]).length;
  const progressPercentage = Math.round((completedRequired / requiredFields.length) * 100);

  // Form Submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { [key: string]: string } = {};

    // Validate required fields
    requiredFields.forEach((field) => {
      if (!files[field.id]) {
        newErrors[field.id] = `${field.label} is required`;
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      // Navigate to next step
      router.push("/industry/onboarding/review");
    }, 1500);
  };

  const handleSaveDraft = () => {
    setIsDraftSaved(true);
    setTimeout(() => setIsDraftSaved(false), 3000);
  };

  return (
    <div className="min-h-screen bg-sand-100 dark:bg-[#061418] text-ink dark:text-sand-100 flex flex-col justify-between relative overflow-x-hidden transition-colors">
      {/* Background Ambient Glow */}
      <div className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2 h-[600px] w-[900px] rounded-full bg-gradient-to-b from-ocean-300/15 via-mangrove-300/10 to-transparent blur-3xl opacity-70 dark:from-ocean-900/25 dark:via-mangrove-900/15" />

      {/* Header */}
      <header className="relative z-10 border-b border-ocean-900/5 dark:border-sand-100/5 bg-white/40 dark:bg-[#061418]/40 backdrop-blur-md">
        <div className="container-page section-pad flex h-20 items-center justify-between">
          <Link
            href="/industry/onboarding/profile"
            className="inline-flex items-center gap-2 text-sm font-medium text-ink/70 hover:text-ink dark:text-sand-100/70 dark:hover:text-sand-50 transition-colors"
          >
            <ArrowLeft size={16} />
            <span>Back to Profile</span>
          </Link>

          <div className="flex items-center gap-3">
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="relative z-10 flex-1 container-page section-pad py-10 max-w-5xl mx-auto">
        {/* Step Bar */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 rounded-2xl border border-ocean-900/10 bg-white/80 p-4 shadow-sm dark:border-sand-100/10 dark:bg-[#0a232b]/80 backdrop-blur-md flex flex-wrap items-center justify-between gap-4"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-ocean-900 text-sand-50 dark:bg-mangrove-500 dark:text-ink font-semibold text-sm shadow-sm">
              03
            </div>
            <div>
              <span className="font-mono text-[10px] uppercase tracking-wider text-mangrove-700 dark:text-mangrove-300 font-semibold block">
                Onboarding Step 3 of 4
              </span>
              <h2 className="text-base font-semibold text-ink dark:text-sand-50">
                Compliance & Regulatory Filings
              </h2>
            </div>
          </div>

          {/* Progress Pill */}
          <div className="flex items-center gap-3">
            <div className="text-right">
              <span className="text-xs font-mono font-medium text-ink/70 dark:text-sand-100/70">
                Required Uploads: {completedRequired}/{requiredFields.length}
              </span>
            </div>
            <div className="w-24 h-2 bg-sand-200 dark:bg-[#071a20] rounded-full overflow-hidden border border-ocean-900/10 dark:border-sand-100/10">
              <div
                className="h-full bg-mangrove-500 transition-all duration-300"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>
        </motion.div>

        {/* Page Titles */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="font-mono text-xs uppercase tracking-widest text-mangrove-700 dark:text-mangrove-300 font-medium">
            Verification Vault
          </span>
          <h1 className="mt-2 font-display text-3xl sm:text-4xl font-medium tracking-tight text-ink dark:text-sand-50">
            Upload Compliance Filings
          </h1>
          <p className="mt-2 text-sm text-ink-soft dark:text-sand-100/70 leading-relaxed">
            Submit required environmental permits, carbon audit certifications, and official corporate filings for automated regulatory verification.
          </p>
        </div>

        {/* Draft Notification Toast */}
        <AnimatePresence>
          {isDraftSaved && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mb-6 p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-500/20 text-emerald-800 dark:text-emerald-300 text-sm flex items-center gap-3 shadow-sm"
            >
              <CheckCircle2 size={18} className="text-emerald-600 dark:text-emerald-400" />
              <span>Draft files saved successfully. You can return to complete this step later.</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Form Container */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {DOCUMENT_FIELDS.map((field) => {
              const isMulti = field.multiple;
              const hasFile = isMulti ? additionalFiles.length > 0 : !!files[field.id];
              const fieldError = errors[field.id];

              return (
                <motion.div
                  key={field.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`relative rounded-2xl border p-5 transition-all bg-white/90 dark:bg-[#0a232b]/90 backdrop-blur-xl flex flex-col justify-between ${
                    fieldError
                      ? "border-red-400 dark:border-red-500/50"
                      : hasFile
                      ? "border-emerald-500/50 dark:border-emerald-500/30 bg-emerald-50/10 dark:bg-emerald-950/10"
                      : "border-ocean-900/10 dark:border-sand-100/10 hover:border-ocean-900/20 dark:hover:border-sand-100/20"
                  }`}
                >
                  <div>
                    {/* Card Header */}
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <FileCheck
                          size={18}
                          className={
                            hasFile
                              ? "text-emerald-600 dark:text-emerald-400"
                              : "text-ink-faint dark:text-sand-100/40"
                          }
                        />
                        <h3 className="font-medium text-sm text-ink dark:text-sand-50">
                          {field.label}
                        </h3>
                      </div>
                      <span
                        className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded-full border ${
                          field.required
                            ? "bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/20"
                            : "bg-sand-200/50 dark:bg-[#071a20] text-ink-soft dark:text-sand-100/50 border-transparent"
                        }`}
                      >
                        {field.required ? "Required" : "Optional"}
                      </span>
                    </div>

                    <p className="text-xs text-ink-soft dark:text-sand-100/60 mb-4 min-h-[32px]">
                      {field.description}
                    </p>
                  </div>

                  {/* Upload Dropzone / State View */}
                  <div>
                    {!isMulti ? (
                      /* SINGLE FILE DISPLAY OR INPUT */
                      files[field.id] ? (
                        <div className="flex items-center justify-between p-3 rounded-xl bg-sand-50 dark:bg-[#071a20] border border-ocean-900/10 dark:border-sand-100/10">
                          <div className="flex items-center gap-2.5 min-w-0">
                            <FileText size={18} className="text-ocean-900 dark:text-mangrove-300 shrink-0" />
                            <div className="truncate">
                              <p className="text-xs font-medium text-ink dark:text-sand-50 truncate">
                                {files[field.id]?.name}
                              </p>
                              <p className="text-[10px] text-ink-faint dark:text-sand-100/40 font-mono">
                                {((files[field.id]?.size || 0) / (1024 * 1024)).toFixed(2)} MB
                              </p>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeFile(field.id)}
                            className="p-1.5 rounded-lg text-ink-soft hover:text-red-500 dark:text-sand-100/60 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      ) : (
                        <label className="group flex flex-col items-center justify-center p-4 border-2 border-dashed border-ocean-900/15 dark:border-sand-100/15 hover:border-mangrove-500 dark:hover:border-mangrove-400 rounded-xl cursor-pointer bg-sand-50/40 dark:bg-[#071a20]/40 transition-colors">
                          <UploadCloud
                            size={22}
                            className="text-ink-faint group-hover:text-mangrove-600 dark:text-sand-100/40 dark:group-hover:text-mangrove-300 transition-colors mb-1"
                          />
                          <span className="text-xs font-medium text-ink/80 dark:text-sand-100/80">
                            Choose File <span className="text-ink-faint dark:text-sand-100/40 font-normal">or drop here</span>
                          </span>
                          <span className="text-[10px] font-mono text-ink-faint dark:text-sand-100/40 uppercase mt-1">
                            {field.accept.replace(/\./g, "").toUpperCase()} (Max 15MB)
                          </span>
                          <input
                            type="file"
                            accept={field.accept}
                            className="hidden"
                            onChange={(e) => handleFileChange(field.id, e.target.files)}
                          />
                        </label>
                      )
                    ) : (
                      /* MULTI-FILE DISPLAY OR INPUT */
                      <div className="space-y-3">
                        {additionalFiles.length > 0 && (
                          <div className="space-y-2 max-h-36 overflow-y-auto pr-1">
                            {additionalFiles.map((file, idx) => (
                              <div
                                key={idx}
                                className="flex items-center justify-between p-2.5 rounded-xl bg-sand-50 dark:bg-[#071a20] border border-ocean-900/10 dark:border-sand-100/10"
                              >
                                <div className="flex items-center gap-2 min-w-0">
                                  <Paperclip size={14} className="text-ocean-900 dark:text-mangrove-300 shrink-0" />
                                  <span className="text-xs text-ink dark:text-sand-50 truncate">
                                    {file.name}
                                  </span>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => removeAdditionalFile(idx)}
                                  className="text-ink-soft hover:text-red-500 dark:text-sand-100/60 dark:hover:text-red-400 p-1"
                                >
                                  <Trash2 size={14} />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}

                        <label className="group flex flex-col items-center justify-center p-3 border-2 border-dashed border-ocean-900/15 dark:border-sand-100/15 hover:border-mangrove-500 dark:hover:border-mangrove-400 rounded-xl cursor-pointer bg-sand-50/40 dark:bg-[#071a20]/40 transition-colors">
                          <span className="text-xs font-medium text-ink/80 dark:text-sand-100/80">
                            + Add Additional Document
                          </span>
                          <input
                            type="file"
                            multiple
                            accept={field.accept}
                            className="hidden"
                            onChange={(e) => handleFileChange(field.id, e.target.files)}
                          />
                        </label>
                      </div>
                    )}

                    {fieldError && (
                      <p className="mt-2 text-xs text-red-500 dark:text-red-400 font-medium flex items-center gap-1">
                        <AlertCircle size={14} />
                        {fieldError}
                      </p>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Action Bar */}
          <div className="rounded-2xl border border-ocean-900/10 bg-white/90 p-6 dark:border-sand-100/10 dark:bg-[#0a232b]/90 backdrop-blur-xl flex flex-col-reverse sm:flex-row items-center justify-between gap-4 mt-8 shadow-soft">
            <button
              type="button"
              onClick={handleSaveDraft}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border border-ocean-900/15 text-xs font-medium text-ink hover:bg-sand-50 dark:border-sand-100/15 dark:text-sand-50 dark:hover:bg-[#071a20] transition-colors"
            >
              <Save size={16} />
              <span>Save Progress</span>
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-2.5 rounded-xl bg-ocean-900 text-sand-50 hover:bg-ocean-800 dark:bg-mangrove-500 dark:text-ink dark:hover:bg-mangrove-400 text-sm font-semibold transition-all shadow-md disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span>Validating Files...</span>
                </>
              ) : (
                <>
                  <span>Save & Continue to Review</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
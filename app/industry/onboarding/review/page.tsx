"use client";

import React, { useState } from "react";
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
  Building,
  Mail,
  Phone,
  Globe,
  Loader2,
  Edit3,
} from "lucide-react";

import { ThemeToggle } from "@/components/theme-toggle";

export default function IndustryReviewPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [error, setError] = useState("");

  const handleFinalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreedToTerms) {
      setError("Please confirm that all submitted details are accurate before proceeding.");
      return;
    }

    setIsSubmitting(true);
    setError("");

    // Simulate final submission API call
    setTimeout(() => {
      setIsSubmitting(false);
      // Navigate to step 4 (Verification Status)
      router.push("/industry/onboarding/verification");
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-sand-100 dark:bg-[#061418] text-ink dark:text-sand-100 flex flex-col justify-between relative overflow-x-hidden transition-colors">
      {/* Background Ambient Glow */}
      <div className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2 h-[600px] w-[900px] rounded-full bg-gradient-to-b from-ocean-300/15 via-mangrove-300/10 to-transparent blur-3xl opacity-70 dark:from-ocean-900/25 dark:via-mangrove-900/15" />

      {/* Header */}
      <header className="relative z-10 border-b border-ocean-900/5 dark:border-sand-100/5 bg-white/40 dark:bg-[#061418]/40 backdrop-blur-md">
        <div className="container-page section-pad flex h-20 items-center justify-between">
          <Link
            href="/industry/onboarding/documents"
            className="inline-flex items-center gap-2 text-sm font-medium text-ink/70 hover:text-ink dark:text-sand-100/70 dark:hover:text-sand-50 transition-colors"
          >
            <ArrowLeft size={16} />
            <span>Back to Upload Filings</span>
          </Link>

          <div className="flex items-center gap-3">
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="relative z-10 flex-1 container-page section-pad py-10 max-w-4xl mx-auto">
        {/* Step Indicator Bar */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 rounded-2xl border border-ocean-900/10 bg-white/80 p-4 shadow-sm dark:border-sand-100/10 dark:bg-[#0a232b]/80 backdrop-blur-md flex flex-wrap items-center justify-between gap-4"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-ocean-900 text-sand-50 dark:bg-mangrove-500 dark:text-ink font-semibold text-sm shadow-sm">
              03.5
            </div>
            <div>
              <span className="font-mono text-[10px] uppercase tracking-wider text-mangrove-700 dark:text-mangrove-300 font-semibold block">
                Final Review Step
              </span>
              <h2 className="text-base font-semibold text-ink dark:text-sand-50">
                Confirm Application Details
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono text-ink-soft dark:text-sand-100/70">
            <ShieldCheck size={16} className="text-emerald-500" />
            <span>Ready for Review</span>
          </div>
        </motion.div>

        {/* Page Header */}
        <div className="text-center max-w-xl mx-auto mb-10">
          <span className="font-mono text-xs uppercase tracking-widest text-mangrove-700 dark:text-mangrove-300 font-medium">
            Step 3 of 4 Complete
          </span>
          <h1 className="mt-2 font-display text-3xl sm:text-4xl font-medium tracking-tight text-ink dark:text-sand-50">
            Review Your Compliance Dossier
          </h1>
          <p className="mt-2 text-sm text-ink-soft dark:text-sand-100/70 leading-relaxed">
            Please verify your business profile and uploaded compliance documents before submitting for regulatory clearance.
          </p>
        </div>

        {/* Review Sections */}
        <div className="space-y-6">
          {/* Company Profile Card */}
          <div className="rounded-2xl border border-ocean-900/10 bg-white/90 dark:border-sand-100/10 dark:bg-[#0a232b]/90 backdrop-blur-xl p-6 shadow-soft">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-ocean-900/5 dark:border-sand-100/5">
              <div className="flex items-center gap-2.5">
                <Building2 className="text-ocean-900 dark:text-mangrove-300" size={20} />
                <h3 className="font-semibold text-base text-ink dark:text-sand-50">Company Profile Overview</h3>
              </div>
              <Link
                href="/industry/onboarding/profile"
                className="inline-flex items-center gap-1 text-xs font-medium text-mangrove-700 hover:text-mangrove-800 dark:text-mangrove-300 dark:hover:text-mangrove-200"
              >
                <Edit3 size={14} />
                <span>Edit</span>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div>
                <span className="block text-ink-faint dark:text-sand-100/40 uppercase font-mono">Company Name</span>
                <span className="font-medium text-ink dark:text-sand-50 text-sm">Acme Climate Solutions Ltd.</span>
              </div>
              <div>
                <span className="block text-ink-faint dark:text-sand-100/40 uppercase font-mono">Registration / CIN</span>
                <span className="font-medium text-ink dark:text-sand-50 font-mono text-sm">U74999MH2024PTC123456</span>
              </div>
              <div>
                <span className="block text-ink-faint dark:text-sand-100/40 uppercase font-mono">GST Identification</span>
                <span className="font-medium text-ink dark:text-sand-50 font-mono text-sm">27AAAAA0000A1Z5</span>
              </div>
              <div>
                <span className="block text-ink-faint dark:text-sand-100/40 uppercase font-mono">Industry Sector</span>
                <span className="font-medium text-ink dark:text-sand-50 text-sm">Manufacturing & Power Generation</span>
              </div>
            </div>
          </div>

          {/* Uploaded Filings Summary Card */}
          <div className="rounded-2xl border border-ocean-900/10 bg-white/90 dark:border-sand-100/10 dark:bg-[#0a232b]/90 backdrop-blur-xl p-6 shadow-soft">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-ocean-900/5 dark:border-sand-100/5">
              <div className="flex items-center gap-2.5">
                <FileCheck className="text-ocean-900 dark:text-mangrove-300" size={20} />
                <h3 className="font-semibold text-base text-ink dark:text-sand-50">Uploaded Filings & Permits</h3>
              </div>
              <Link
                href="/industry/onboarding/documents"
                className="inline-flex items-center gap-1 text-xs font-medium text-mangrove-700 hover:text-mangrove-800 dark:text-mangrove-300 dark:hover:text-mangrove-200"
              >
                <Edit3 size={14} />
                <span>Edit Files</span>
              </Link>
            </div>

            <ul className="space-y-3">
              {[
                { title: "Company Registration Certificate", filename: "Certificate_of_Incorporation.pdf", status: "Uploaded" },
                { title: "GST Certificate", filename: "GST_REG_06_Acme.pdf", status: "Uploaded" },
                { title: "Pollution Control Board Certificate", filename: "PCB_ConsentToOperate_2026.pdf", status: "Uploaded" },
                { title: "Annual Carbon Audit Report", filename: "ISO_14064_Audit_Report.pdf", status: "Uploaded" },
                { title: "Authorization Letter", filename: "Board_Resolution_Auth.pdf", status: "Uploaded" },
              ].map((item, idx) => (
                <li
                  key={idx}
                  className="flex items-center justify-between p-3 rounded-xl bg-sand-50/70 dark:bg-[#071a20]/70 border border-ocean-900/5 dark:border-sand-100/5 text-xs"
                >
                  <div className="flex items-center gap-3">
                    <FileText size={16} className="text-mangrove-600 dark:text-mangrove-400" />
                    <div>
                      <span className="font-medium text-ink dark:text-sand-50 block">{item.title}</span>
                      <span className="text-ink-faint dark:text-sand-100/40 font-mono">{item.filename}</span>
                    </div>
                  </div>
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-mono bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20">
                    <CheckCircle size={12} />
                    <span>{item.status}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Acknowledgement Checkbox */}
          <form onSubmit={handleFinalSubmit} className="space-y-6">
            <div className="p-4 rounded-xl border border-ocean-900/10 bg-white/50 dark:border-sand-100/10 dark:bg-[#0a232b]/50 backdrop-blur-md">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreedToTerms}
                  onChange={(e) => setAgreedToTerms(e.target.checked)}
                  className="mt-0.5 rounded border-ocean-900/20 text-ocean-900 focus:ring-mangrove-500 dark:border-sand-100/20 dark:bg-[#071a20]"
                />
                <span className="text-xs text-ink-soft dark:text-sand-100/70 leading-relaxed">
                  I certify that the information provided and uploaded documents are legitimate, authentic, and compliant with local environmental regulatory standards.
                </span>
              </label>
              {error && <p className="mt-2 text-xs font-medium text-red-500">{error}</p>}
            </div>

            {/* Actions Bar */}
            <div className="rounded-2xl border border-ocean-900/10 bg-white/90 p-6 dark:border-sand-100/10 dark:bg-[#0a232b]/90 backdrop-blur-xl flex flex-col-reverse sm:flex-row items-center justify-between gap-4">
              <Link
                href="/industry/onboarding/documents"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border border-ocean-900/15 text-xs font-medium text-ink hover:bg-sand-50 dark:border-sand-100/15 dark:text-sand-50 dark:hover:bg-[#071a20] transition-colors"
              >
                <ArrowLeft size={16} />
                <span>Back to Files</span>
              </Link>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-2.5 rounded-xl bg-ocean-900 text-sand-50 hover:bg-ocean-800 dark:bg-mangrove-500 dark:text-ink dark:hover:bg-mangrove-400 text-sm font-semibold transition-all shadow-md disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    <span>Submitting Application...</span>
                  </>
                ) : (
                  <>
                    <span>Submit Compliance Dossier</span>
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
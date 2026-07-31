"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  ShieldCheck,
  Clock,
  Calendar,
  Hash,
  Bell,
  CheckCircle2,
  ArrowLeft,
  ArrowRight,
  Leaf,
  FileSearch,
  Sparkles,
  LayoutDashboard,
} from "lucide-react";

import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { ProgressBar } from "@/components/farmer/ProgressBar";

// Framer Motion Animation Variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.1,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 25 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
  },
};

export default function VerificationStatusPage() {
  const router = useRouter();

  // Generate today's date formatted nicely for the Submission Date card
  const todayFormatted = new Date().toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="min-h-screen bg-sand-100 dark:bg-[#061418] text-ink dark:text-sand-100 flex flex-col justify-between relative overflow-x-hidden transition-colors">
      {/* Background Ambient Subtle Glow */}
      <div className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2 h-[700px] w-[1000px] rounded-full bg-gradient-to-b from-ocean-300/15 via-mangrove-300/10 to-transparent blur-3xl opacity-70 dark:from-ocean-900/30 dark:via-mangrove-900/20" />

      {/* Global Navbar */}
      <Navbar />

      {/* Main Content Area */}
      <main className="relative z-10 flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-10 max-w-5xl">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-center space-y-4 mb-8"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/80 dark:bg-[#0a232b]/80 border border-ocean-900/10 dark:border-sand-100/10 shadow-sm backdrop-blur-md">
            <Leaf size={14} className="text-mangrove-600 dark:text-mangrove-400" />
            <span className="font-mono text-xs uppercase tracking-widest text-ink-soft dark:text-sand-100/80">
              Farmer Onboarding
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-display font-medium text-ink dark:text-sand-50 tracking-tight">
            Documents Submitted Successfully
          </h1>

          <p className="text-sm sm:text-base text-ink-soft dark:text-sand-100/70 max-w-xl mx-auto leading-relaxed">
            Your documents have been received successfully. Our verification team will review them within 24–48 hours before activating your Blue Carbon account.
          </p>
        </motion.div>

        {/* Progress Bar Container (Step 4 of 5) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="mb-10"
        >
          <ProgressBar
            currentStep={4}
            steps={[
              { id: 1, label: "Account" },
              { id: 2, label: "Profile" },
              { id: 3, label: "Documents" },
              { id: 4, label: "Verification" },
              { id: 5, label: "Dashboard" },
            ]}
          />
        </motion.div>

        {/* Main Content Stagger Wrapper */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-8"
        >
          {/* Main Verification Card */}
          <motion.div
            variants={cardVariants}
            className="rounded-[28px] border border-ocean-900/10 bg-white/80 dark:border-sand-100/10 dark:bg-[#0a232b]/80 backdrop-blur-md p-6 sm:p-10 shadow-soft text-center relative overflow-hidden"
          >
            {/* Soft Ambient Inner Radial Glow */}
            <div className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2 h-40 w-80 bg-mangrove-500/10 blur-3xl rounded-full" />

            {/* Success Icon */}
            <div className="relative z-10 flex justify-center mb-6">
              <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-mangrove-100 text-mangrove-700 dark:bg-mangrove-900/40 dark:text-mangrove-300 shadow-card border border-mangrove-500/20">
                <ShieldCheck size={44} strokeWidth={2.2} />
              </div>
            </div>

            {/* Status Header */}
            <div className="relative z-10 space-y-2 mb-8">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-mono font-medium bg-amber-500/10 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300 border border-amber-500/20">
                <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
                <span>🟡 Pending Verification</span>
              </div>
              <h2 className="font-display text-2xl sm:text-3xl font-medium text-ink dark:text-sand-50 pt-2">
                Verification Status
              </h2>
              <p className="text-sm text-ink-soft dark:text-sand-100/70 max-w-md mx-auto leading-relaxed">
                Your documents are waiting for review by our verification authority.
              </p>
            </div>

            {/* Information Grid (4 Small Cards) */}
            <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-left">
              {/* Card 1 — Estimated Review Time */}
              <div className="rounded-2xl border border-ocean-900/10 bg-sand-50/60 dark:border-sand-100/10 dark:bg-[#071a20]/60 p-4 flex items-center gap-3.5">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-ocean-900/10 text-ocean-900 dark:bg-mangrove-500/20 dark:text-mangrove-300 shrink-0">
                  <Clock size={20} />
                </div>
                <div>
                  <span className="block text-[11px] font-mono uppercase tracking-wider text-ink-soft dark:text-sand-100/60">
                    Est. Review Time
                  </span>
                  <span className="text-sm font-semibold text-ink dark:text-sand-50 font-mono">
                    24–48 Hours
                  </span>
                </div>
              </div>

              {/* Card 2 — Submission Date */}
              <div className="rounded-2xl border border-ocean-900/10 bg-sand-50/60 dark:border-sand-100/10 dark:bg-[#071a20]/60 p-4 flex items-center gap-3.5">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-mangrove-500/20 text-mangrove-800 dark:bg-mangrove-500/20 dark:text-mangrove-300 shrink-0">
                  <Calendar size={20} />
                </div>
                <div>
                  <span className="block text-[11px] font-mono uppercase tracking-wider text-ink-soft dark:text-sand-100/60">
                    Submission Date
                  </span>
                  <span className="text-sm font-semibold text-ink dark:text-sand-50 font-mono">
                    {todayFormatted}
                  </span>
                </div>
              </div>

              {/* Card 3 — Reference ID */}
              <div className="rounded-2xl border border-ocean-900/10 bg-sand-50/60 dark:border-sand-100/10 dark:bg-[#071a20]/60 p-4 flex items-center gap-3.5">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-ocean-900/10 text-ocean-900 dark:bg-mangrove-500/20 dark:text-mangrove-300 shrink-0">
                  <Hash size={20} />
                </div>
                <div>
                  <span className="block text-[11px] font-mono uppercase tracking-wider text-ink-soft dark:text-sand-100/60">
                    Reference ID
                  </span>
                  <span className="text-sm font-semibold text-ink dark:text-sand-50 font-mono">
                    BCN-2026-0001
                  </span>
                </div>
              </div>

              {/* Card 4 — Notification */}
              <div className="rounded-2xl border border-ocean-900/10 bg-sand-50/60 dark:border-sand-100/10 dark:bg-[#071a20]/60 p-4 flex items-center gap-3.5">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-mangrove-500/20 text-mangrove-800 dark:bg-mangrove-500/20 dark:text-mangrove-300 shrink-0">
                  <Bell size={20} />
                </div>
                <div>
                  <span className="block text-[11px] font-mono uppercase tracking-wider text-ink-soft dark:text-sand-100/60">
                    Notification
                  </span>
                  <span className="text-sm font-semibold text-ink dark:text-sand-50 font-mono">
                    Email + Dashboard
                  </span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Information Section Card — "What happens next?" */}
          <motion.div
            variants={cardVariants}
            className="rounded-[28px] border border-ocean-900/10 bg-white/80 dark:border-sand-100/10 dark:bg-[#0a232b]/80 backdrop-blur-md p-6 sm:p-8 shadow-soft"
          >
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-ocean-900/5 dark:border-sand-100/5">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-ocean-900/10 text-ocean-900 dark:bg-mangrove-500/20 dark:text-mangrove-300 shrink-0">
                <FileSearch size={22} />
              </div>
              <div>
                <h3 className="font-display text-xl sm:text-2xl font-medium text-ink dark:text-sand-50">
                  What happens next?
                </h3>
                <p className="text-xs sm:text-sm text-ink-soft dark:text-sand-100/70">
                  Review lifecycle and activation steps for your project developer profile.
                </p>
              </div>
            </div>

            {/* Checklist Items */}
            <ul className="space-y-4 text-sm text-ink dark:text-sand-100">
              <li className="flex items-start gap-3">
                <div className="mt-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-mangrove-500/20 text-mangrove-700 dark:text-mangrove-300 shrink-0">
                  <CheckCircle2 size={16} />
                </div>
                <span className="leading-relaxed">
                  <strong className="font-medium text-ink dark:text-sand-50">Verification Authority reviews documents:</strong> Your government ID and land ownership records undergo regional validation.
                </span>
              </li>

              <li className="flex items-start gap-3">
                <div className="mt-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-mangrove-500/20 text-mangrove-700 dark:text-mangrove-300 shrink-0">
                  <CheckCircle2 size={16} />
                </div>
                <span className="leading-relaxed">
                  <strong className="font-medium text-ink dark:text-sand-50">Project details are validated:</strong> Coastal mangrove boundaries, KML coordinates, and field photos are cross-referenced with satellite telemetry.
                </span>
              </li>

              <li className="flex items-start gap-3">
                <div className="mt-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-mangrove-500/20 text-mangrove-700 dark:text-mangrove-300 shrink-0">
                  <CheckCircle2 size={16} />
                </div>
                <span className="leading-relaxed">
                  <strong className="font-medium text-ink dark:text-sand-50">You receive email confirmation:</strong> Instant notification dispatch upon verification completion or if additional proof is requested.
                </span>
              </li>

              <li className="flex items-start gap-3">
                <div className="mt-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-mangrove-500/20 text-mangrove-700 dark:text-mangrove-300 shrink-0">
                  <CheckCircle2 size={16} />
                </div>
                <span className="leading-relaxed">
                  <strong className="font-medium text-ink dark:text-sand-50">Dashboard becomes fully active after approval:</strong> Full access to credit issuance tools, blockchain MRV registries, and satellite monitoring suite.
                </span>
              </li>
            </ul>
          </motion.div>

          {/* Bottom Navigation Buttons */}
          <motion.div
            variants={cardVariants}
            className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2"
          >
            <button
              type="button"
              onClick={() => router.push("/farmer/onboarding/documents")}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full border border-ocean-900/15 bg-white px-6 py-3.5 text-sm font-medium text-ink shadow-sm hover:bg-sand-50 transition-all dark:border-sand-100/15 dark:bg-[#0a232b] dark:text-sand-100 dark:hover:bg-[#071a20]"
            >
              <ArrowLeft size={16} />
              <span>Back</span>
            </button>

            <button
              type="button"
              onClick={() => router.push("/farmer/dashboard")}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-ocean-900 hover:bg-ocean-700 dark:bg-mangrove-500 dark:hover:bg-mangrove-300 dark:text-ink px-8 py-3.5 text-sm font-medium tracking-wide text-sand-50 shadow-md transition-all focus:outline-none focus:ring-2 focus:ring-mangrove-500"
            >
              <LayoutDashboard size={16} />
              <span>Go to Dashboard</span>
              <ArrowRight size={16} />
            </button>
          </motion.div>
        </motion.div>
      </main>

      {/* Global Footer */}
      <Footer />
    </div>
  );
}
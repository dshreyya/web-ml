"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Leaf,
  Coins,
  ShieldCheck,
  TrendingUp,
  Clock,
  CheckCircle2,
  Lock,
  PlusCircle,
  FileText,
  UserPen,
  HelpCircle,
  Bell,
  ArrowRight,
  Building2,
  Sparkles,
} from "lucide-react";

import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

// Motion Stagger Variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.05,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] },
  },
};

export default function FarmerDashboardPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-sand-100 dark:bg-[#061418] text-ink dark:text-sand-100 flex flex-col justify-between relative overflow-x-hidden transition-colors">
      {/* Background Ambient Glowing Gradients */}
      <div className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2 h-[600px] w-[1100px] rounded-full bg-gradient-to-b from-ocean-300/20 via-mangrove-300/15 to-transparent blur-3xl opacity-70 dark:from-ocean-900/35 dark:via-mangrove-900/25" />

      {/* Global Navbar */}
      <Navbar />

      {/* Main Content Area */}
      <main className="relative z-10 flex-1 container mx-auto px-4 sm:px-6 lg:px-8 pt-28 sm:pt-36 pb-16 max-w-7xl space-y-10">
        
        {/* HERO SECTION */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          className="relative overflow-hidden rounded-[32px] border border-ocean-900/10 bg-gradient-to-br from-white/90 via-sand-50/80 to-mangrove-500/15 dark:border-sand-100/10 dark:from-[#0a232b]/95 dark:via-[#071a20]/90 dark:to-mangrove-950/30 backdrop-blur-xl p-6 sm:p-10 shadow-card"
        >
          {/* Ambient Mesh & Grid Background */}
          <div className="pointer-events-none absolute -right-12 -top-12 h-72 w-72 rounded-full bg-gradient-to-br from-mangrove-400/25 via-ocean-500/20 to-transparent blur-3xl" />
          <div className="pointer-events-none absolute -left-12 -bottom-12 h-48 w-48 rounded-full bg-gradient-to-tr from-ocean-500/15 to-transparent blur-2xl" />

          <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
            
            {/* Left Hero Content */}
            <div className="space-y-4 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono font-medium bg-mangrove-500/15 text-mangrove-800 dark:bg-mangrove-500/20 dark:text-mangrove-300 border border-mangrove-500/20">
                <Leaf size={14} className="animate-pulse" />
                <span>Good Morning 👋</span>
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl font-display font-semibold text-ink dark:text-sand-50 tracking-tight leading-tight">
                Welcome back, Farmer
              </h1>

              <p className="text-sm sm:text-base text-ink-soft dark:text-sand-100/70 leading-relaxed font-normal">
                Manage your Blue Carbon restoration projects, monitor real-time verification telemetry, and track carbon credit issuance.
              </p>

              {/* Onboarding Progress Bar */}
              <div className="pt-2 max-w-md space-y-2">
                <div className="flex items-center justify-between text-xs font-mono text-ink-soft dark:text-sand-100/70">
                  <span className="uppercase tracking-wider">Onboarding Progress</span>
                  <span className="font-semibold text-mangrove-700 dark:text-mangrove-300">75% Completed</span>
                </div>
                <div className="h-2 w-full rounded-full bg-sand-200/80 dark:bg-[#071a20] overflow-hidden border border-ocean-900/5 dark:border-sand-100/5">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: "75%" }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="h-full bg-gradient-to-r from-mangrove-500 to-ocean-500 rounded-full"
                  />
                </div>
              </div>
            </div>

            {/* Right Hero Controls & Status */}
            <div className="flex flex-col sm:flex-row lg:flex-col items-start sm:items-center lg:items-end gap-4 w-full sm:w-auto shrink-0 pt-2 lg:pt-0">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-mono font-medium bg-amber-500/10 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300 border border-amber-500/20 shadow-sm">
                <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
                <span>Pending Verification</span>
              </div>

              <button
                type="button"
                onClick={() => router.push("/marketplace")}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-ocean-900 hover:bg-ocean-700 dark:bg-mangrove-500 dark:hover:bg-mangrove-300 dark:text-ink px-6 py-3.5 text-xs font-mono uppercase tracking-wider font-semibold text-sand-50 shadow-md transition-all focus:outline-none focus:ring-2 focus:ring-mangrove-500"
              >
                <span>View Marketplace</span>
                <ArrowRight size={15} />
              </button>
            </div>
          </div>
        </motion.div>

        {/* 4 STATISTIC CARDS */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6"
        >
          {/* Stat 1 — Projects */}
          <motion.div
            variants={itemVariants}
            whileHover={{ y: -3, transition: { duration: 0.2 } }}
            className="rounded-[24px] border border-ocean-900/10 bg-white/80 dark:border-sand-100/10 dark:bg-[#0a232b]/80 backdrop-blur-md p-5 sm:p-6 shadow-soft flex flex-col justify-between"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-[11px] font-mono uppercase tracking-wider text-ink-soft dark:text-sand-100/60 font-medium">
                Projects
              </span>
              <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-mangrove-500/15 text-mangrove-800 dark:bg-mangrove-500/20 dark:text-mangrove-300">
                <Leaf size={18} />
              </div>
            </div>
            <div>
              <div className="text-3xl font-display font-semibold text-ink dark:text-sand-50 font-mono tracking-tight">
                1
              </div>
              <div className="flex items-center gap-1.5 mt-1.5 text-xs text-mangrove-700 dark:text-mangrove-300 font-medium">
                <Sparkles size={13} />
                <span>Active Mangrove Site</span>
              </div>
            </div>
          </motion.div>

          {/* Stat 2 — Carbon Credits */}
          <motion.div
            variants={itemVariants}
            whileHover={{ y: -3, transition: { duration: 0.2 } }}
            className="rounded-[24px] border border-ocean-900/10 bg-white/80 dark:border-sand-100/10 dark:bg-[#0a232b]/80 backdrop-blur-md p-5 sm:p-6 shadow-soft flex flex-col justify-between"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-[11px] font-mono uppercase tracking-wider text-ink-soft dark:text-sand-100/60 font-medium">
                Carbon Credits
              </span>
              <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-ocean-900/10 text-ocean-900 dark:bg-mangrove-500/20 dark:text-mangrove-300">
                <Coins size={18} />
              </div>
            </div>
            <div>
              <div className="text-3xl font-display font-semibold text-ink dark:text-sand-50 font-mono tracking-tight">
                0
              </div>
              <p className="text-xs text-ink-soft dark:text-sand-100/60 mt-1.5">
                Available Tokens
              </p>
            </div>
          </motion.div>

          {/* Stat 3 — Verification Status */}
          <motion.div
            variants={itemVariants}
            whileHover={{ y: -3, transition: { duration: 0.2 } }}
            className="rounded-[24px] border border-ocean-900/10 bg-white/80 dark:border-sand-100/10 dark:bg-[#0a232b]/80 backdrop-blur-md p-5 sm:p-6 shadow-soft flex flex-col justify-between"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-[11px] font-mono uppercase tracking-wider text-ink-soft dark:text-sand-100/60 font-medium">
                Verification
              </span>
              <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-amber-500/15 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300">
                <ShieldCheck size={18} />
              </div>
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-mono font-medium bg-amber-500/10 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300 border border-amber-500/20 mb-1">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
                <span>Pending Review</span>
              </div>
              <p className="text-xs text-ink-soft dark:text-sand-100/60">
                Awaiting Regional Authority
              </p>
            </div>
          </motion.div>

          {/* Stat 4 — Estimated Value */}
          <motion.div
            variants={itemVariants}
            whileHover={{ y: -3, transition: { duration: 0.2 } }}
            className="rounded-[24px] border border-ocean-900/10 bg-white/80 dark:border-sand-100/10 dark:bg-[#0a232b]/80 backdrop-blur-md p-5 sm:p-6 shadow-soft flex flex-col justify-between"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-[11px] font-mono uppercase tracking-wider text-ink-soft dark:text-sand-100/60 font-medium">
                Est. Portfolio Value
              </span>
              <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-ocean-900/10 text-ocean-900 dark:bg-mangrove-500/20 dark:text-mangrove-300">
                <TrendingUp size={18} />
              </div>
            </div>
            <div>
              <div className="text-3xl font-display font-semibold text-ink dark:text-sand-50 font-mono tracking-tight">
                ₹0
              </div>
              <p className="text-xs text-ink-soft dark:text-sand-100/60 mt-1.5">
                Credits Not Issued Yet
              </p>
            </div>
          </motion.div>
        </motion.div>

        {/* 12-COLUMN DASHBOARD GRID */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 lg:grid-cols-12 gap-8"
        >
          {/* LEFT SIDEBAR (8 COLUMNS) */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* PROJECT OVERVIEW CARD */}
            <motion.div
              variants={itemVariants}
              className="rounded-[28px] border border-ocean-900/10 bg-white/80 dark:border-sand-100/10 dark:bg-[#0a232b]/80 backdrop-blur-md p-6 sm:p-8 shadow-soft"
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-5 mb-6 border-b border-ocean-900/5 dark:border-sand-100/5">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-mangrove-500/20 text-mangrove-800 dark:bg-mangrove-500/20 dark:text-mangrove-300 shrink-0">
                    <Building2 size={20} />
                  </div>
                  <div>
                    <h2 className="font-display text-lg font-semibold text-ink dark:text-sand-50 tracking-tight">
                      Primary Project Overview
                    </h2>
                    <p className="text-xs text-ink-soft dark:text-sand-100/70">
                      Registered blue carbon conservation plot & telemetry metadata
                    </p>
                  </div>
                </div>

                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-medium bg-amber-500/10 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300 border border-amber-500/20">
                  <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
                  <span>Pending Verification</span>
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                <div className="p-4 rounded-2xl bg-sand-50/70 dark:bg-[#071a20]/60 border border-ocean-900/5 dark:border-sand-100/5">
                  <span className="block text-[10px] font-mono uppercase tracking-wider text-ink-soft dark:text-sand-100/50">
                    Project Name
                  </span>
                  <span className="text-sm font-semibold text-ink dark:text-sand-50 block mt-1 truncate">
                    Mangrove Restoration
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-sand-50/70 dark:bg-[#071a20]/60 border border-ocean-900/5 dark:border-sand-100/5">
                  <span className="block text-[10px] font-mono uppercase tracking-wider text-ink-soft dark:text-sand-100/50">
                    Location / GPS
                  </span>
                  <span className="text-sm font-medium text-ink-faint dark:text-sand-100/40 block mt-1 truncate">
                    Not Available Yet
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-sand-50/70 dark:bg-[#071a20]/60 border border-ocean-900/5 dark:border-sand-100/5">
                  <span className="block text-[10px] font-mono uppercase tracking-wider text-ink-soft dark:text-sand-100/50">
                    Land Area
                  </span>
                  <span className="text-sm font-semibold text-ink-faint dark:text-sand-100/40 block mt-1 font-mono">
                    --
                  </span>
                </div>
              </div>

              {/* View Project Action Button */}
              <div className="flex justify-end pt-2 border-t border-ocean-900/5 dark:border-sand-100/5">
                <button
                  type="button"
                  onClick={() => router.push("/farmer/projects/primary-project")}
                  className="inline-flex items-center gap-2 rounded-full bg-ocean-900 hover:bg-ocean-700 dark:bg-mangrove-500 dark:hover:bg-mangrove-300 dark:text-ink px-5 py-2.5 text-xs font-mono uppercase tracking-wider font-semibold text-sand-50 shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-mangrove-500"
                >
                  <span>View Project</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </motion.div>

            {/* RECENT ACTIVITY TIMELINE */}
            <motion.div
              variants={itemVariants}
              className="rounded-[28px] border border-ocean-900/10 bg-white/80 dark:border-sand-100/10 dark:bg-[#0a232b]/80 backdrop-blur-md p-6 sm:p-7 shadow-soft"
            >
              <div className="flex items-center justify-between pb-4 mb-5 border-b border-ocean-900/5 dark:border-sand-100/5">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-ocean-900/10 text-ocean-900 dark:bg-mangrove-500/20 dark:text-mangrove-300 shrink-0">
                    <Clock size={20} />
                  </div>
                  <div>
                    <h2 className="font-display text-lg font-semibold text-ink dark:text-sand-50 tracking-tight">
                      Recent Activity
                    </h2>
                    <p className="text-xs text-ink-soft dark:text-sand-100/70">
                      Chronological audit log of onboarding events
                    </p>
                  </div>
                </div>
              </div>

              <div className="relative pl-6 space-y-4 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-sand-200 dark:before:bg-sand-100/10">
                {/* Activity 1 */}
                <div className="relative flex items-center justify-between gap-4">
                  <div className="absolute -left-6 top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-mangrove-500 text-ink text-xs">
                    <CheckCircle2 size={13} />
                  </div>
                  <div>
                    <h3 className="text-xs sm:text-sm font-medium text-ink dark:text-sand-50">
                      Account Created
                    </h3>
                    <p className="text-[11px] text-ink-soft dark:text-sand-100/60 mt-0.5">
                      Enterprise identity registered
                    </p>
                  </div>
                  <span className="text-[10px] font-mono text-mangrove-700 dark:text-mangrove-300 bg-mangrove-500/10 px-2.5 py-0.5 rounded-full shrink-0">
                    Completed
                  </span>
                </div>

                {/* Activity 2 */}
                <div className="relative flex items-center justify-between gap-4">
                  <div className="absolute -left-6 top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-mangrove-500 text-ink text-xs">
                    <CheckCircle2 size={13} />
                  </div>
                  <div>
                    <h3 className="text-xs sm:text-sm font-medium text-ink dark:text-sand-50">
                      Farmer Profile Submitted
                    </h3>
                    <p className="text-[11px] text-ink-soft dark:text-sand-100/60 mt-0.5">
                      Personal and land details recorded
                    </p>
                  </div>
                  <span className="text-[10px] font-mono text-mangrove-700 dark:text-mangrove-300 bg-mangrove-500/10 px-2.5 py-0.5 rounded-full shrink-0">
                    Completed
                  </span>
                </div>

                {/* Activity 3 */}
                <div className="relative flex items-center justify-between gap-4">
                  <div className="absolute -left-6 top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-mangrove-500 text-ink text-xs">
                    <CheckCircle2 size={13} />
                  </div>
                  <div>
                    <h3 className="text-xs sm:text-sm font-medium text-ink dark:text-sand-50">
                      Documents Uploaded
                    </h3>
                    <p className="text-[11px] text-ink-soft dark:text-sand-100/60 mt-0.5">
                      Identity & land proofs submitted
                    </p>
                  </div>
                  <span className="text-[10px] font-mono text-mangrove-700 dark:text-mangrove-300 bg-mangrove-500/10 px-2.5 py-0.5 rounded-full shrink-0">
                    Completed
                  </span>
                </div>

                {/* Activity 4 */}
                <div className="relative flex items-center justify-between gap-4">
                  <div className="absolute -left-6 top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-amber-500 text-ink text-xs ring-4 ring-amber-500/20">
                    <Clock size={11} />
                  </div>
                  <div>
                    <h3 className="text-xs sm:text-sm font-medium text-ink dark:text-sand-50">
                      Verification Pending
                    </h3>
                    <p className="text-[11px] text-ink-soft dark:text-sand-100/60 mt-0.5">
                      Document review in progress
                    </p>
                  </div>
                  <span className="text-[10px] font-mono text-amber-700 dark:text-amber-300 bg-amber-500/10 px-2.5 py-0.5 rounded-full shrink-0">
                    Current Stage
                  </span>
                </div>
              </div>
            </motion.div>

            {/* CARBON CREDITS EMPTY STATE */}
            <motion.div
              variants={itemVariants}
              className="rounded-[28px] border border-ocean-900/10 bg-white/80 dark:border-sand-100/10 dark:bg-[#0a232b]/80 backdrop-blur-md p-8 shadow-soft text-center overflow-hidden"
            >
              <div className="flex flex-col items-center justify-center space-y-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sand-100 dark:bg-[#071a20] text-ink-soft dark:text-sand-100/60 border border-ocean-900/5 dark:border-sand-100/5">
                  <Coins size={24} />
                </div>
                <h3 className="font-display text-base font-semibold text-ink dark:text-sand-50 tracking-tight">
                  No Carbon Credits Issued Yet
                </h3>
                <p className="text-xs text-ink-soft dark:text-sand-100/60 max-w-sm leading-relaxed">
                  Credits will automatically populate once regional authorities review and approve your satellite MRV telemetry.
                </p>
              </div>
            </motion.div>
          </div>

          {/* RIGHT SIDEBAR (4 COLUMNS) */}
          <div className="lg:col-span-4 space-y-8">
            
            {/* VERIFICATION PROGRESS CARD */}
            <motion.div
              variants={itemVariants}
              className="rounded-[28px] border border-ocean-900/10 bg-white/80 dark:border-sand-100/10 dark:bg-[#0a232b]/80 backdrop-blur-md p-6 shadow-soft space-y-5"
            >
              <div className="flex items-center gap-3 pb-3 border-b border-ocean-900/5 dark:border-sand-100/5">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-mangrove-500/20 text-mangrove-800 dark:bg-mangrove-500/20 dark:text-mangrove-300 shrink-0">
                  <ShieldCheck size={20} />
                </div>
                <div>
                  <h3 className="font-display text-base font-semibold text-ink dark:text-sand-50 tracking-tight">
                    Verification Journey
                  </h3>
                  <p className="text-xs text-ink-soft dark:text-sand-100/70">
                    Account activation checklist
                  </p>
                </div>
              </div>

              <div className="space-y-2.5 text-xs">
                <div className="flex items-center justify-between p-3 rounded-xl bg-sand-50/70 dark:bg-[#071a20]/60">
                  <span className="font-medium text-ink dark:text-sand-50">Account Created</span>
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-mangrove-500 text-ink text-[10px] font-bold">✓</span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-sand-50/70 dark:bg-[#071a20]/60">
                  <span className="font-medium text-ink dark:text-sand-50">Profile Completed</span>
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-mangrove-500 text-ink text-[10px] font-bold">✓</span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-sand-50/70 dark:bg-[#071a20]/60">
                  <span className="font-medium text-ink dark:text-sand-50">Documents Uploaded</span>
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-mangrove-500 text-ink text-[10px] font-bold">✓</span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-800 dark:text-amber-300">
                  <span className="font-medium">Verification</span>
                  <span className="animate-pulse font-mono text-xs">⏳</span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-sand-200/40 dark:bg-[#071a20]/30 opacity-50">
                  <span className="font-medium text-ink-faint dark:text-sand-100/40">Dashboard Active</span>
                  <Lock size={12} className="text-ink-faint dark:text-sand-100/40" />
                </div>
              </div>
            </motion.div>

            {/* QUICK ACTIONS WIDGET */}
            <motion.div
              variants={itemVariants}
              className="rounded-[28px] border border-ocean-900/10 bg-white/80 dark:border-sand-100/10 dark:bg-[#0a232b]/80 backdrop-blur-md p-6 shadow-soft space-y-4"
            >
              <h3 className="font-display text-base font-semibold text-ink dark:text-sand-50 tracking-tight">
                Quick Actions
              </h3>

              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-mangrove-500/20 bg-mangrove-500/10 hover:bg-mangrove-500/20 p-4 text-xs font-medium text-mangrove-900 dark:text-mangrove-300 shadow-sm transition-all group"
                >
                  <PlusCircle size={20} className="text-mangrove-700 dark:text-mangrove-300 group-hover:scale-110 transition-transform" />
                  <span className="text-[11px] font-semibold truncate">Register Project</span>
                </button>

                <button
                  type="button"
                  onClick={() => router.push("/farmer/onboarding/documents")}
                  className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-ocean-900/10 bg-sand-50/80 dark:border-sand-100/10 dark:bg-[#071a20]/80 p-4 text-xs font-medium text-ink dark:text-sand-50 shadow-sm hover:bg-white dark:hover:bg-[#082028] transition-all group"
                >
                  <FileText size={20} className="text-ocean-900 dark:text-sand-100 group-hover:scale-110 transition-transform" />
                  <span className="text-[11px] font-semibold truncate">Documents</span>
                </button>

                <button
                  type="button"
                  onClick={() => router.push("/farmer/profile")}
                  className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-ocean-900/10 bg-sand-50/80 dark:border-sand-100/10 dark:bg-[#071a20]/80 p-4 text-xs font-medium text-ink dark:text-sand-50 shadow-sm hover:bg-white dark:hover:bg-[#082028] transition-all group"
                >
                  <UserPen size={20} className="text-mangrove-600 dark:text-mangrove-400 group-hover:scale-110 transition-transform" />
                  <span className="text-[11px] font-semibold truncate">Edit Profile</span>
                </button>

                <button
                  type="button"
                  className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-ocean-900/10 bg-sand-50/80 dark:border-sand-100/10 dark:bg-[#071a20]/80 p-4 text-xs font-medium text-ink dark:text-sand-50 shadow-sm hover:bg-white dark:hover:bg-[#082028] transition-all group"
                >
                  <HelpCircle size={20} className="text-ocean-900 dark:text-sand-100 group-hover:scale-110 transition-transform" />
                  <span className="text-[11px] font-semibold truncate">Support</span>
                </button>
              </div>
            </motion.div>

            {/* NOTIFICATIONS WIDGET */}
            <motion.div
              variants={itemVariants}
              className="rounded-[28px] border border-ocean-900/10 bg-white/80 dark:border-sand-100/10 dark:bg-[#0a232b]/80 backdrop-blur-md p-6 shadow-soft space-y-3"
            >
              <div className="flex items-center gap-2.5 pb-2.5 border-b border-ocean-900/5 dark:border-sand-100/5">
                <Bell size={18} className="text-ocean-900 dark:text-sand-100" />
                <h3 className="font-display text-base font-semibold text-ink dark:text-sand-50 tracking-tight">
                  System Alerts
                </h3>
              </div>

              <ul className="space-y-2.5 text-xs text-ink-soft dark:text-sand-100/80">
                <li className="flex items-start gap-2">
                  <span className="text-mangrove-600 dark:text-mangrove-400 font-bold">•</span>
                  <span>Documents submitted successfully.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-ocean-900 dark:text-sand-100 font-bold">•</span>
                  <span>Verification usually takes 24–48 hrs.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-mangrove-600 dark:text-mangrove-400 font-bold">•</span>
                  <span>You&apos;ll receive an email once approved.</span>
                </li>
              </ul>
            </motion.div>

          </div>
        </motion.div>
      </main>

      {/* Global Footer */}
      <Footer />
    </div>
  );
}
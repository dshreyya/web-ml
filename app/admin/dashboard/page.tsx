"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  ShieldCheck,
  Users,
  Building2,
  Coins,
  ArrowRight,
  Clock,
  CheckCircle2,
  Check,
  X,
  Eye,
  FileText,
  Boxes,
  BarChart3,
  Settings,
  Activity,
  Database,
  HardDrive,
  ShoppingBag,
  Sparkles,
  Search,
  Filter,
  ChevronRight,
  UserCheck,
  AlertCircle,
  Zap,
} from "lucide-react";

import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

// Framer Motion Animation Stagger Variants
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

// Dummy Verification Queue Data
const verificationQueue = [
  {
    id: "BCN-F-1029",
    farmer: "Dr. Aris Thorne",
    email: "a.thorne@delta-ecolab.org",
    project: "Sundarbans Delta Mangrove Restoration",
    district: "South 24 Parganas, WB",
    area: "142 Hectares",
    submittedDate: "Today, 08:30 AM",
    status: "Pending Review",
    statusColor: "bg-amber-500/10 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300 border-amber-500/20",
  },
  {
    id: "BCN-F-1028",
    farmer: "Rajesh Kumar",
    email: "rajesh.k@coastal-greens.in",
    project: "Mahanadi Estuary Protection",
    district: "Kendrapara, Odisha",
    area: "85 Hectares",
    submittedDate: "Yesterday",
    status: "Under Audit",
    statusColor: "bg-blue-500/10 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300 border-blue-500/20",
  },
  {
    id: "BCN-F-1027",
    farmer: "Elena Vance",
    email: "elena@oceanic-carbon.io",
    project: "Pichavaram Tidal Forest Expansion",
    district: "Cuddalore, Tamil Nadu",
    area: "210 Hectares",
    submittedDate: "2 days ago",
    status: "Pending Review",
    statusColor: "bg-amber-500/10 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300 border-amber-500/20",
  },
  {
    id: "BCN-F-1026",
    farmer: "Siddharth Nair",
    email: "s.nair@kerala-backwaters.org",
    project: "Vembanad Blue Carbon Canopy",
    district: "Alappuzha, Kerala",
    area: "64 Hectares",
    submittedDate: "3 days ago",
    status: "Under Audit",
    statusColor: "bg-blue-500/10 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300 border-blue-500/20",
  },
];

// Dummy Activity Log
const recentActivities = [
  {
    id: 1,
    title: "Farmer Registered",
    desc: "Dr. Aris Thorne onboarded with 142Ha Sundarbans plot.",
    time: "12 mins ago",
    type: "user",
    badge: "New Developer",
  },
  {
    id: 2,
    title: "Documents Uploaded",
    desc: "KML boundary maps & land deeds submitted for BCN-F-1029.",
    time: "45 mins ago",
    type: "doc",
    badge: "Verification",
  },
  {
    id: 3,
    title: "Project Approved",
    desc: "Godavari Tidal Zone (BCN-F-1021) passed verifier satellite audit.",
    time: "2 hours ago",
    type: "check",
    badge: "Registry",
  },
  {
    id: 4,
    title: "Credits Issued",
    desc: "1,250 BCN-tCO2 tokens minted on Polygon for Godavari project.",
    time: "4 hours ago",
    type: "mint",
    badge: "Blockchain",
  },
  {
    id: 5,
    title: "Marketplace Purchase",
    desc: "Tata Steel Offset Fund purchased 500 Credits (₹1,750,000).",
    time: "6 hours ago",
    type: "buy",
    badge: "Transaction",
  },
];

export default function AdminDashboardPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-sand-100 dark:bg-[#061418] text-ink dark:text-sand-100 flex flex-col justify-between relative overflow-x-hidden transition-colors">
      {/* Background Ambient Glowing Blur Gradients */}
      <div className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2 h-[700px] w-[1200px] rounded-full bg-gradient-to-b from-ocean-300/20 via-mangrove-300/15 to-transparent blur-3xl opacity-75 dark:from-ocean-900/35 dark:via-mangrove-900/25" />

      {/* Global Navigation Bar */}
      <Navbar />

      {/* Main Container Area with offset padding to clear fixed navbar */}
      <main className="relative z-10 flex-1 container mx-auto px-4 sm:px-6 lg:px-8 pt-28 sm:pt-36 pb-16 max-w-7xl space-y-10">
        
        {/* 1. HERO BANNER — Enterprise Control Panel Header */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          className="relative overflow-hidden rounded-[32px] border border-ocean-900/10 bg-gradient-to-br from-white/90 via-sand-50/80 to-mangrove-500/15 dark:border-sand-100/10 dark:from-[#0a232b]/95 dark:via-[#071a20]/90 dark:to-mangrove-950/30 backdrop-blur-xl p-6 sm:p-10 shadow-card"
        >
          {/* Subtle Ambient Mesh Blobs */}
          <div className="pointer-events-none absolute -right-12 -top-12 h-72 w-72 rounded-full bg-gradient-to-br from-mangrove-400/25 via-ocean-500/20 to-transparent blur-3xl" />
          <div className="pointer-events-none absolute -left-12 -bottom-12 h-48 w-48 rounded-full bg-gradient-to-tr from-ocean-500/15 to-transparent blur-2xl" />

          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-3 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono font-medium bg-mangrove-500/15 text-mangrove-800 dark:bg-mangrove-500/20 dark:text-mangrove-300 border border-mangrove-500/20">
                <Sparkles size={14} className="animate-pulse" />
                <span>Registry Governance & Control</span>
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl font-display font-semibold text-ink dark:text-sand-50 tracking-tight leading-tight">
                Platform Administration
              </h1>

              <p className="text-sm sm:text-base text-ink-soft dark:text-sand-100/70 leading-relaxed font-normal">
                Monitor, verify and govern the BlueCarbon ecosystem from one centralized control panel.
              </p>
            </div>

            {/* System Health Badge */}
            <div className="flex items-center gap-3 shrink-0 pt-2 md:pt-0">
              <div className="inline-flex items-center gap-2.5 px-4 py-2.5 rounded-full text-xs font-mono font-medium bg-emerald-500/10 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300 border border-emerald-500/30 shadow-sm backdrop-blur-md">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
                </span>
                <span className="font-semibold uppercase tracking-wider">System Healthy</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* 2. ANALYTICS METRIC CARDS (4 Grid Items) */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6"
        >
          {/* Card 1 — Pending Verifications */}
          <motion.div
            variants={itemVariants}
            whileHover={{ y: -3, transition: { duration: 0.2 } }}
            className="rounded-[24px] border border-ocean-900/10 bg-white/80 dark:border-sand-100/10 dark:bg-[#0a232b]/80 backdrop-blur-md p-5 sm:p-6 shadow-soft flex flex-col justify-between"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-[11px] font-mono uppercase tracking-wider text-ink-soft dark:text-sand-100/60 font-medium">
                Pending Queue
              </span>
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-500/15 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300">
                <Clock size={20} />
              </div>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-display font-semibold text-ink dark:text-sand-50 font-mono tracking-tight">
                12
              </div>
              <p className="text-xs text-amber-700 dark:text-amber-300 mt-1.5 font-medium flex items-center gap-1">
                <AlertCircle size={13} />
                <span>Requires Regional Verifier Action</span>
              </p>
            </div>
          </motion.div>

          {/* Card 2 — Registered Farmers */}
          <motion.div
            variants={itemVariants}
            whileHover={{ y: -3, transition: { duration: 0.2 } }}
            className="rounded-[24px] border border-ocean-900/10 bg-white/80 dark:border-sand-100/10 dark:bg-[#0a232b]/80 backdrop-blur-md p-5 sm:p-6 shadow-soft flex flex-col justify-between"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-[11px] font-mono uppercase tracking-wider text-ink-soft dark:text-sand-100/60 font-medium">
                Registered Farmers
              </span>
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-mangrove-500/15 text-mangrove-800 dark:bg-mangrove-500/20 dark:text-mangrove-300">
                <Users size={20} />
              </div>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-display font-semibold text-ink dark:text-sand-50 font-mono tracking-tight">
                148
              </div>
              <p className="text-xs text-mangrove-700 dark:text-mangrove-300 mt-1.5 font-medium">
                +18 this month across 6 coastal states
              </p>
            </div>
          </motion.div>

          {/* Card 3 — Industry Buyers */}
          <motion.div
            variants={itemVariants}
            whileHover={{ y: -3, transition: { duration: 0.2 } }}
            className="rounded-[24px] border border-ocean-900/10 bg-white/80 dark:border-sand-100/10 dark:bg-[#0a232b]/80 backdrop-blur-md p-5 sm:p-6 shadow-soft flex flex-col justify-between"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-[11px] font-mono uppercase tracking-wider text-ink-soft dark:text-sand-100/60 font-medium">
                Industry Buyers
              </span>
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-ocean-900/10 text-ocean-900 dark:bg-sand-100/10 dark:text-sand-50">
                <Building2 size={20} />
              </div>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-display font-semibold text-ink dark:text-sand-50 font-mono tracking-tight">
                32
              </div>
              <p className="text-xs text-ink-soft dark:text-sand-100/60 mt-1.5">
                Corporate sustainability partners
              </p>
            </div>
          </motion.div>

          {/* Card 4 — Carbon Credits Issued */}
          <motion.div
            variants={itemVariants}
            whileHover={{ y: -3, transition: { duration: 0.2 } }}
            className="rounded-[24px] border border-ocean-900/10 bg-white/80 dark:border-sand-100/10 dark:bg-[#0a232b]/80 backdrop-blur-md p-5 sm:p-6 shadow-soft flex flex-col justify-between"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-[11px] font-mono uppercase tracking-wider text-ink-soft dark:text-sand-100/60 font-medium">
                Carbon Credits Issued
              </span>
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-mangrove-500/15 text-mangrove-800 dark:bg-mangrove-500/20 dark:text-mangrove-300">
                <Coins size={20} />
              </div>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-display font-semibold text-ink dark:text-sand-50 font-mono tracking-tight">
                12,450
              </div>
              <p className="text-xs text-mangrove-700 dark:text-mangrove-300 mt-1.5 font-medium">
                tCO2e Minted on Blockchain Registry
              </p>
            </div>
          </motion.div>
        </motion.div>

        {/* 3. VERIFICATION QUEUE (Main Action Table) */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="rounded-[28px] border border-ocean-900/10 bg-white/80 dark:border-sand-100/10 dark:bg-[#0a232b]/80 backdrop-blur-md p-6 sm:p-8 shadow-soft space-y-6"
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-ocean-900/5 dark:border-sand-100/5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-mangrove-500/20 text-mangrove-800 dark:bg-mangrove-500/20 dark:text-mangrove-300 shrink-0">
                <ShieldCheck size={20} />
              </div>
              <div>
                <h2 className="font-display text-lg font-semibold text-ink dark:text-sand-50 tracking-tight">
                  Verification Queue
                </h2>
                <p className="text-xs text-ink-soft dark:text-sand-100/70">
                  Review mangrove restoration projects submitted for satellite MRV validation
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-ink-soft dark:text-sand-100/60 bg-sand-100 dark:bg-[#071a20] px-3 py-1.5 rounded-full border border-ocean-900/5 dark:border-sand-100/5">
                Showing 4 Pending
              </span>
            </div>
          </div>

          {/* Table Element */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-ocean-900/5 dark:border-sand-100/5 text-[11px] font-mono uppercase tracking-wider text-ink-soft dark:text-sand-100/60">
                  <th className="py-3 px-4 font-medium">Farmer / Developer</th>
                  <th className="py-3 px-4 font-medium">Project Name & Area</th>
                  <th className="py-3 px-4 font-medium">District</th>
                  <th className="py-3 px-4 font-medium">Status</th>
                  <th className="py-3 px-4 font-medium text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ocean-900/5 dark:divide-sand-100/5 text-xs">
                {verificationQueue.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-sand-50/60 dark:hover:bg-[#071a20]/40 transition-colors group"
                  >
                    {/* Farmer Details */}
                    <td className="py-4 px-4">
                      <div className="font-semibold text-ink dark:text-sand-50">
                        {item.farmer}
                      </div>
                      <div className="text-[11px] font-mono text-ink-faint dark:text-sand-100/50">
                        {item.email}
                      </div>
                    </td>

                    {/* Project */}
                    <td className="py-4 px-4">
                      <div className="font-medium text-ink dark:text-sand-100 truncate max-w-xs">
                        {item.project}
                      </div>
                      <div className="text-[11px] font-mono text-mangrove-700 dark:text-mangrove-300">
                        {item.area}
                      </div>
                    </td>

                    {/* District */}
                    <td className="py-4 px-4 text-ink-soft dark:text-sand-100/80 font-medium">
                      {item.district}
                    </td>

                    {/* Status Badge */}
                    <td className="py-4 px-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono font-medium border ${item.statusColor}`}
                      >
                        <span className="h-1.5 w-1.5 rounded-full bg-current animate-pulse" />
                        {item.status}
                      </span>
                    </td>

                    {/* Action Button */}
                    <td className="py-4 px-4 text-right">
                      <button
                        type="button"
                        onClick={() => router.push("/admin/projects")}
                        className="inline-flex items-center gap-1.5 rounded-xl bg-ocean-900 hover:bg-ocean-700 dark:bg-mangrove-500 dark:hover:bg-mangrove-300 dark:text-ink px-3.5 py-2 text-xs font-mono font-semibold text-sand-50 shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-mangrove-500"
                      >
                        <span>Review</span>
                        <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* 4. QUICK ACTIONS GRID (6 Premium Cards) */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-4"
        >
          <div className="flex items-center gap-2 px-1">
            <Zap size={18} className="text-mangrove-600 dark:text-mangrove-400" />
            <h2 className="font-display text-lg font-semibold text-ink dark:text-sand-50 tracking-tight">
              Quick Administrative Actions
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {/* Card 1 — Approve Projects */}
            <motion.div
              variants={itemVariants}
              whileHover={{ y: -3 }}
              onClick={() => router.push("/admin/projects")}
              className="group rounded-[24px] border border-ocean-900/10 bg-white/80 dark:border-sand-100/10 dark:bg-[#0a232b]/80 backdrop-blur-md p-6 shadow-soft hover:bg-white dark:hover:bg-[#082028] transition-all cursor-pointer flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-mangrove-500/15 text-mangrove-800 dark:bg-mangrove-500/20 dark:text-mangrove-300">
                    <UserCheck size={22} />
                  </div>
                  <ChevronRight size={18} className="text-ink-faint group-hover:translate-x-1 transition-transform" />
                </div>
                <h3 className="font-display text-base font-semibold text-ink dark:text-sand-50">
                  Approve Projects
                </h3>
                <p className="text-xs text-ink-soft dark:text-sand-100/70 leading-relaxed">
                  Validate satellite boundary surveys, KML files, and issue verifier certificates.
                </p>
              </div>
            </motion.div>

            {/* Card 2 — Manage Users */}
            <motion.div
              variants={itemVariants}
              whileHover={{ y: -3 }}
              onClick={() => router.push("/admin/users")}
              className="group rounded-[24px] border border-ocean-900/10 bg-white/80 dark:border-sand-100/10 dark:bg-[#0a232b]/80 backdrop-blur-md p-6 shadow-soft hover:bg-white dark:hover:bg-[#082028] transition-all cursor-pointer flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-ocean-900/10 text-ocean-900 dark:bg-sand-100/10 dark:text-sand-50">
                    <Users size={22} />
                  </div>
                  <ChevronRight size={18} className="text-ink-faint group-hover:translate-x-1 transition-transform" />
                </div>
                <h3 className="font-display text-base font-semibold text-ink dark:text-sand-50">
                  Manage Users
                </h3>
                <p className="text-xs text-ink-soft dark:text-sand-100/70 leading-relaxed">
                  Audit permissions for farmers, corporate industry buyers, and verifiers.
                </p>
              </div>
            </motion.div>

            {/* Card 3 — Marketplace */}
            <motion.div
              variants={itemVariants}
              whileHover={{ y: -3 }}
              onClick={() => router.push("/admin/marketplace")}
              className="group rounded-[24px] border border-ocean-900/10 bg-white/80 dark:border-sand-100/10 dark:bg-[#0a232b]/80 backdrop-blur-md p-6 shadow-soft hover:bg-white dark:hover:bg-[#082028] transition-all cursor-pointer flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-mangrove-500/15 text-mangrove-800 dark:bg-mangrove-500/20 dark:text-mangrove-300">
                    <ShoppingBag size={22} />
                  </div>
                  <ChevronRight size={18} className="text-ink-faint group-hover:translate-x-1 transition-transform" />
                </div>
                <h3 className="font-display text-base font-semibold text-ink dark:text-sand-50">
                  Marketplace Governance
                </h3>
                <p className="text-xs text-ink-soft dark:text-sand-100/70 leading-relaxed">
                  Monitor carbon credit pricing, active buy offers, and trading volume.
                </p>
              </div>
            </motion.div>

            {/* Card 4 — Blockchain Audit */}
            <motion.div
              variants={itemVariants}
              whileHover={{ y: -3 }}
              onClick={() => router.push("/admin/blockchain")}
              className="group rounded-[24px] border border-ocean-900/10 bg-white/80 dark:border-sand-100/10 dark:bg-[#0a232b]/80 backdrop-blur-md p-6 shadow-soft hover:bg-white dark:hover:bg-[#082028] transition-all cursor-pointer flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-ocean-900/10 text-ocean-900 dark:bg-sand-100/10 dark:text-sand-50">
                    <Boxes size={22} />
                  </div>
                  <ChevronRight size={18} className="text-ink-faint group-hover:translate-x-1 transition-transform" />
                </div>
                <h3 className="font-display text-base font-semibold text-ink dark:text-sand-50">
                  Blockchain Audit
                </h3>
                <p className="text-xs text-ink-soft dark:text-sand-100/70 leading-relaxed">
                  Inspect Polygon smart contract minting logs and retirement receipts.
                </p>
              </div>
            </motion.div>

            {/* Card 5 — Reports */}
            <motion.div
              variants={itemVariants}
              whileHover={{ y: -3 }}
              onClick={() => router.push("/admin/reports")}
              className="group rounded-[24px] border border-ocean-900/10 bg-white/80 dark:border-sand-100/10 dark:bg-[#0a232b]/80 backdrop-blur-md p-6 shadow-soft hover:bg-white dark:hover:bg-[#082028] transition-all cursor-pointer flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-mangrove-500/15 text-mangrove-800 dark:bg-mangrove-500/20 dark:text-mangrove-300">
                    <BarChart3 size={22} />
                  </div>
                  <ChevronRight size={18} className="text-ink-faint group-hover:translate-x-1 transition-transform" />
                </div>
                <h3 className="font-display text-base font-semibold text-ink dark:text-sand-50">
                  Analytics & Reports
                </h3>
                <p className="text-xs text-ink-soft dark:text-sand-100/70 leading-relaxed">
                  Export national blue carbon sequestration metrics and ESG audit files.
                </p>
              </div>
            </motion.div>

            {/* Card 6 — Platform Settings */}
            <motion.div
              variants={itemVariants}
              whileHover={{ y: -3 }}
              onClick={() => router.push("/admin/settings")}
              className="group rounded-[24px] border border-ocean-900/10 bg-white/80 dark:border-sand-100/10 dark:bg-[#0a232b]/80 backdrop-blur-md p-6 shadow-soft hover:bg-white dark:hover:bg-[#082028] transition-all cursor-pointer flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-ocean-900/10 text-ocean-900 dark:bg-sand-100/10 dark:text-sand-50">
                    <Settings size={22} />
                  </div>
                  <ChevronRight size={18} className="text-ink-faint group-hover:translate-x-1 transition-transform" />
                </div>
                <h3 className="font-display text-base font-semibold text-ink dark:text-sand-50">
                  Platform Settings
                </h3>
                <p className="text-xs text-ink-soft dark:text-sand-100/70 leading-relaxed">
                  Configure API endpoints, satellite Sentinel keys, and RPC gateways.
                </p>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* 5 & 6. TWO-COLUMN GRID: RECENT ACTIVITY + PLATFORM HEALTH */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* LEFT: RECENT ACTIVITY TIMELINE (8 COLUMNS) */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="lg:col-span-8 rounded-[28px] border border-ocean-900/10 bg-white/80 dark:border-sand-100/10 dark:bg-[#0a232b]/80 backdrop-blur-md p-6 sm:p-8 shadow-soft space-y-6"
          >
            <div className="flex items-center justify-between pb-4 border-b border-ocean-900/5 dark:border-sand-100/5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-ocean-900/10 text-ocean-900 dark:bg-mangrove-500/20 dark:text-mangrove-300 shrink-0">
                  <Activity size={20} />
                </div>
                <div>
                  <h2 className="font-display text-lg font-semibold text-ink dark:text-sand-50 tracking-tight">
                    Recent Platform Activity
                  </h2>
                  <p className="text-xs text-ink-soft dark:text-sand-100/70">
                    System-wide audit trail across registry nodes
                  </p>
                </div>
              </div>
            </div>

            <div className="relative pl-6 space-y-5 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-sand-200 dark:before:bg-sand-100/10">
              {recentActivities.map((act) => (
                <div key={act.id} className="relative flex items-start justify-between gap-4">
                  <div className="absolute -left-6 top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-mangrove-500 text-ink text-xs font-bold">
                    ✓
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-xs sm:text-sm font-semibold text-ink dark:text-sand-50">
                        {act.title}
                      </h3>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-sand-100 dark:bg-[#071a20] border border-ocean-900/5 dark:border-sand-100/10 text-ink-soft dark:text-sand-100/60">
                        {act.badge}
                      </span>
                    </div>
                    <p className="text-xs text-ink-soft dark:text-sand-100/70 mt-0.5">
                      {act.desc}
                    </p>
                  </div>
                  <span className="text-[10px] font-mono text-ink-faint dark:text-sand-100/40 shrink-0">
                    {act.time}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* RIGHT: PLATFORM HEALTH MONITOR (4 COLUMNS) */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="lg:col-span-4 rounded-[28px] border border-ocean-900/10 bg-white/80 dark:border-sand-100/10 dark:bg-[#0a232b]/80 backdrop-blur-md p-6 sm:p-8 shadow-soft space-y-6"
          >
            <div className="flex items-center gap-3 pb-4 border-b border-ocean-900/5 dark:border-sand-100/5">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-mangrove-500/20 text-mangrove-800 dark:bg-mangrove-500/20 dark:text-mangrove-300 shrink-0">
                <Database size={20} />
              </div>
              <div>
                <h2 className="font-display text-lg font-semibold text-ink dark:text-sand-50 tracking-tight">
                  Infrastructure Health
                </h2>
                <p className="text-xs text-ink-soft dark:text-sand-100/70">
                  Node telemetry status
                </p>
              </div>
            </div>

            <div className="space-y-3.5">
              {/* Health Item 1 — Blockchain */}
              <div className="p-3.5 rounded-2xl bg-sand-50/70 dark:bg-[#071a20]/60 border border-ocean-900/5 dark:border-sand-100/5 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Boxes size={16} className="text-mangrove-600 dark:text-mangrove-400" />
                  <span className="text-xs font-semibold text-ink dark:text-sand-50">
                    Blockchain Node
                  </span>
                </div>
                <span className="inline-flex items-center gap-1.5 text-xs font-mono font-medium text-emerald-700 dark:text-emerald-300">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" />
                  <span>Healthy</span>
                </span>
              </div>

              {/* Health Item 2 — Database */}
              <div className="p-3.5 rounded-2xl bg-sand-50/70 dark:bg-[#071a20]/60 border border-ocean-900/5 dark:border-sand-100/5 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Database size={16} className="text-ocean-900 dark:text-sand-100" />
                  <span className="text-xs font-semibold text-ink dark:text-sand-50">
                    PostgreSQL Database
                  </span>
                </div>
                <span className="inline-flex items-center gap-1.5 text-xs font-mono font-medium text-emerald-700 dark:text-emerald-300">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" />
                  <span>Healthy</span>
                </span>
              </div>

              {/* Health Item 3 — Storage */}
              <div className="p-3.5 rounded-2xl bg-sand-50/70 dark:bg-[#071a20]/60 border border-ocean-900/5 dark:border-sand-100/5 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <HardDrive size={16} className="text-mangrove-600 dark:text-mangrove-400" />
                  <span className="text-xs font-semibold text-ink dark:text-sand-50">
                    Document Storage
                  </span>
                </div>
                <span className="inline-flex items-center gap-1.5 text-xs font-mono font-medium text-emerald-700 dark:text-emerald-300">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" />
                  <span>Healthy</span>
                </span>
              </div>

              {/* Health Item 4 — Marketplace */}
              <div className="p-3.5 rounded-2xl bg-sand-50/70 dark:bg-[#071a20]/60 border border-ocean-900/5 dark:border-sand-100/5 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <ShoppingBag size={16} className="text-ocean-900 dark:text-sand-100" />
                  <span className="text-xs font-semibold text-ink dark:text-sand-50">
                    Marketplace Engine
                  </span>
                </div>
                <span className="inline-flex items-center gap-1.5 text-xs font-mono font-medium text-emerald-700 dark:text-emerald-300">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" />
                  <span>Healthy</span>
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </main>

      {/* Global Navigation Footer */}
      <Footer />
    </div>
  );
}
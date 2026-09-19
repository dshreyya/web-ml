"use client";

import React, { useEffect, useState } from "react";
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
  Eye,
  Boxes,
  BarChart3,
  Settings,
  Activity,
  Database,
  HardDrive,
  ShoppingBag,
  Sparkles,
  ChevronRight,
  UserCheck,
  AlertCircle,
  Zap,
  Loader2,
} from "lucide-react";

import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { getSupabaseClient } from "@/lib/supabase";

// ==========================================
// TYPES
// ==========================================

interface IndustryApplication {
  id: string;
  user_id: string;
  company_name?: string | null;
  industry_type?: string | null;
  gst_number?: string | null;
  cin_number?: string | null;
  onboarding_status: string;
  created_at?: string;
  [key: string]: any;
}

interface FarmerApplication {
  id: string;
  user_id: string;
  full_name?: string | null;
  name?: string | null;
  farm_name?: string | null;
  farm?: string | null;
  district?: string | null;
  state?: string | null;
  total_area_hectares?: number | null;
  area_hectares?: number | null;
  onboarding_status: string;
  created_at?: string;
  [key: string]: any;
}

// ==========================================
// FRAMER MOTION VARIANTS
// ==========================================

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
    transition: {
      duration: 0.45,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

// ==========================================
// DUMMY ACTIVITY LOG
// ==========================================

const recentActivities = [
  {
    id: 1,
    title: "Farmer Registered",
    desc: "New mangrove restoration plot onboarded.",
    time: "12 mins ago",
    type: "user",
    badge: "New Developer",
  },
  {
    id: 2,
    title: "Documents Uploaded",
    desc: "KML boundary maps & land deeds submitted for verification.",
    time: "45 mins ago",
    type: "doc",
    badge: "Verification",
  },
  {
    id: 3,
    title: "Project Approved",
    desc: "Godavari Tidal Zone passed verifier satellite audit.",
    time: "2 hours ago",
    type: "check",
    badge: "Registry",
  },
  {
    id: 4,
    title: "Credits Issued",
    desc: "1,250 BCN-tCO2 tokens minted on Polygon.",
    time: "4 hours ago",
    type: "mint",
    badge: "Blockchain",
  },
  {
    id: 5,
    title: "Marketplace Purchase",
    desc: "Tata Steel Offset Fund purchased 500 Credits.",
    time: "6 hours ago",
    type: "buy",
    badge: "Transaction",
  },
];

// ==========================================
// MAIN ADMIN DASHBOARD
// ==========================================

export default function AdminDashboardPage() {
  const router = useRouter();

  const [industryApplications, setIndustryApplications] = useState<
    IndustryApplication[]
  >([]);
  const [industryLoading, setIndustryLoading] = useState(true);

  const [farmerApplications, setFarmerApplications] = useState<
    FarmerApplication[]
  >([]);
  const [farmerLoading, setFarmerLoading] = useState(true);
  const [approvingId, setApprovingId] = useState<string | null>(null);

  // ==========================================
  // LOAD APPLICATIONS FROM SUPABASE
  // ==========================================

  useEffect(() => {
    loadIndustryApplications();
    loadFarmerApplications();
  }, []);

  const loadIndustryApplications = async () => {
    const supabase = getSupabaseClient();
    if (!supabase) {
      setIndustryLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from("industry_profiles")
        .select("*")
        .eq("onboarding_status", "PENDING_VERIFICATION");

      if (error) {
        console.error("Industry application query error:", error);
      } else if (data) {
        setIndustryApplications(data);
      }
    } catch (error) {
      console.error("Industry application loading error:", error);
    } finally {
      setIndustryLoading(false);
    }
  };

  const loadFarmerApplications = async () => {
    const supabase = getSupabaseClient();
    if (!supabase) {
      setFarmerLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from("farmer_profiles")
        .select("*")
        .eq("onboarding_status", "PENDING_VERIFICATION");

      if (error) {
        console.error("Farmer application query error:", error);
      } else if (data) {
        setFarmerApplications(data);
      }
    } catch (error) {
      console.error("Farmer application loading error:", error);
    } finally {
      setFarmerLoading(false);
    }
  };

  const handleApproveFarmer = async (farmer: FarmerApplication) => {
    const supabase = getSupabaseClient();
    if (!supabase) return;

    const targetId = farmer.id || farmer.user_id;

    try {
      setApprovingId(targetId);

      let query = supabase
        .from("farmer_profiles")
        .update({ onboarding_status: "APPROVED" });

      if (farmer.id) {
        query = query.eq("id", farmer.id);
      } else {
        query = query.eq("user_id", farmer.user_id);
      }

      const { error } = await query;

      if (error) {
        throw error;
      }

      setFarmerApplications((prev) =>
        prev.filter((f) => (f.id || f.user_id) !== targetId)
      );
    } catch (err) {
      console.error("Failed to approve farmer:", err);
    } finally {
      setApprovingId(null);
    }
  };

  const totalPending = industryApplications.length + farmerApplications.length;

  return (
    <div className="min-h-screen bg-sand-100 dark:bg-[#061418] text-ink dark:text-sand-100 flex flex-col justify-between relative overflow-x-hidden transition-colors">
      <div className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2 h-[700px] w-[1200px] rounded-full bg-gradient-to-b from-ocean-300/20 via-mangrove-300/15 to-transparent blur-3xl opacity-75 dark:from-ocean-900/35 dark:via-mangrove-900/25" />

      <Navbar />

      <main className="relative z-10 flex-1 container mx-auto px-4 sm:px-6 lg:px-8 pt-28 sm:pt-36 pb-16 max-w-7xl space-y-10">
        {/* HERO BANNER */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
          className="relative overflow-hidden rounded-[32px] border border-ocean-900/10 bg-gradient-to-br from-white/90 via-sand-50/80 to-mangrove-500/15 dark:border-sand-100/10 dark:from-[#0a232b]/95 dark:via-[#071a20]/90 dark:to-mangrove-950/30 backdrop-blur-xl p-6 sm:p-10 shadow-card"
        >
          <div className="pointer-events-none absolute -right-12 -top-12 h-72 w-72 rounded-full bg-gradient-to-br from-mangrove-400/25 via-ocean-500/20 to-transparent blur-3xl" />
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

        {/* ANALYTICS CARDS */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6"
        >
          {/* Pending Queue */}
          <motion.div
            variants={itemVariants}
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
                {totalPending}
              </div>
              <p className="text-xs text-amber-700 dark:text-amber-300 mt-1.5 font-medium flex items-center gap-1">
                <AlertCircle size={13} />
                <span>Requires Regional Verifier Action</span>
              </p>
            </div>
          </motion.div>

          {/* Registered Farmers */}
          <motion.div
            variants={itemVariants}
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
                Active across 6 coastal states
              </p>
            </div>
          </motion.div>

          {/* Industry Buyers */}
          <motion.div
            variants={itemVariants}
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

          {/* Carbon Credits */}
          <motion.div
            variants={itemVariants}
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

        {/* FARMER VERIFICATION QUEUE (REAL SUPABASE DATA) */}
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
                  Farmer Verification Queue
                </h2>
                <p className="text-xs text-ink-soft dark:text-sand-100/70">
                  Review mangrove restoration profiles submitted for regional authority approval
                </p>
              </div>
            </div>

            <span className="text-xs font-mono text-ink-soft dark:text-sand-100/60 bg-sand-100 dark:bg-[#071a20] px-3 py-1.5 rounded-full border border-ocean-900/5 dark:border-sand-100/5">
              {farmerApplications.length} Pending
            </span>
          </div>

          {farmerLoading ? (
            <div className="py-10 text-center">
              <div className="mx-auto mb-3 h-6 w-6 animate-spin rounded-full border-2 border-ocean-900/20 border-t-ocean-900 dark:border-sand-100/20 dark:border-t-sand-100" />
              <p className="text-xs text-ink-soft dark:text-sand-100/60">
                Loading pending farmer applications...
              </p>
            </div>
          ) : farmerApplications.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-ocean-900/10 dark:border-sand-100/10 p-8 text-center">
              <CheckCircle2 className="mx-auto mb-3 h-8 w-8 text-emerald-600" />
              <h3 className="text-sm font-semibold text-ink dark:text-sand-50">
                No Pending Farmer Applications
              </h3>
              <p className="mt-1 text-xs text-ink-soft dark:text-sand-100/60">
                All submitted farmer applications have been verified.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-ocean-900/5 dark:border-sand-100/5 text-[11px] font-mono uppercase tracking-wider text-ink-soft dark:text-sand-100/60">
                    <th className="py-3 px-4 font-medium">Farmer / Farm Name</th>
                    <th className="py-3 px-4 font-medium">Location</th>
                    <th className="py-3 px-4 font-medium">Area (Hectares)</th>
                    <th className="py-3 px-4 font-medium">Status</th>
                    <th className="py-3 px-4 font-medium text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-ocean-900/5 dark:divide-sand-100/5 text-xs">
                  {farmerApplications.map((farmer, idx) => {
                    const farmerName = farmer.full_name || farmer.name || "Unnamed Farmer";
                    const farmName = farmer.farm_name || farmer.farm || "N/A";
                    const location = [farmer.district, farmer.state].filter(Boolean).join(", ") || "N/A";
                    const area = farmer.total_area_hectares ?? farmer.area_hectares;
                    const farmerId = farmer.id || farmer.user_id || `farmer-${idx}`;

                    return (
                      <tr
                        key={farmerId}
                        className="hover:bg-sand-50/60 dark:hover:bg-[#071a20]/40 transition-colors"
                      >
                        <td className="py-4 px-4">
                          <div className="font-semibold text-ink dark:text-sand-50">
                            {farmerName}
                          </div>
                          <div className="text-[11px] font-mono text-ink-faint dark:text-sand-100/50">
                            {farmName}
                          </div>
                        </td>

                        <td className="py-4 px-4 text-ink-soft dark:text-sand-100/80 font-medium">
                          {location}
                        </td>

                        <td className="py-4 px-4 font-mono text-mangrove-700 dark:text-mangrove-300 font-semibold">
                          {area ? `${area} Ha` : "N/A"}
                        </td>

                        <td className="py-4 px-4">
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono font-medium border bg-amber-500/10 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300 border-amber-500/20">
                            <span className="h-1.5 w-1.5 rounded-full bg-current animate-pulse" />
                            Pending Review
                          </span>
                        </td>

                        <td className="py-4 px-4 text-right">
                          <button
                            type="button"
                            onClick={() => handleApproveFarmer(farmer)}
                            disabled={approvingId === farmerId}
                            className="inline-flex items-center gap-1.5 rounded-xl bg-ocean-900 hover:bg-ocean-700 dark:bg-mangrove-500 dark:hover:bg-mangrove-300 dark:text-ink px-4 py-2 text-xs font-mono font-semibold text-sand-50 shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-mangrove-500 disabled:opacity-50"
                          >
                            {approvingId === farmerId ? (
                              <>
                                <Loader2 size={13} className="animate-spin" />
                                <span>Approving...</span>
                              </>
                            ) : (
                              <>
                                <CheckCircle2 size={13} />
                                <span>Approve Farmer</span>
                              </>
                            )}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>

        {/* INDUSTRY VERIFICATION QUEUE */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="rounded-[28px] border border-ocean-900/10 bg-white/80 dark:border-sand-100/10 dark:bg-[#0a232b]/80 backdrop-blur-md p-6 sm:p-8 shadow-soft space-y-6"
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-ocean-900/5 dark:border-sand-100/5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-ocean-900/10 text-ocean-900 dark:bg-sand-100/10 dark:text-sand-50 shrink-0">
                <Building2 size={20} />
              </div>
              <div>
                <h2 className="font-display text-lg font-semibold text-ink dark:text-sand-50 tracking-tight">
                  Industry Verification
                </h2>
                <p className="text-xs text-ink-soft dark:text-sand-100/70">
                  Review industry entities waiting for Authority approval
                </p>
              </div>
            </div>

            <span className="text-xs font-mono text-ink-soft dark:text-sand-100/60 bg-sand-100 dark:bg-[#071a20] px-3 py-1.5 rounded-full border border-ocean-900/5 dark:border-sand-100/5">
              {industryApplications.length} Pending
            </span>
          </div>

          {industryLoading ? (
            <div className="py-10 text-center">
              <div className="mx-auto mb-3 h-6 w-6 animate-spin rounded-full border-2 border-ocean-900/20 border-t-ocean-900 dark:border-sand-100/20 dark:border-t-sand-100" />
              <p className="text-xs text-ink-soft dark:text-sand-100/60">
                Loading industry applications...
              </p>
            </div>
          ) : industryApplications.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-ocean-900/10 dark:border-sand-100/10 p-8 text-center">
              <CheckCircle2 className="mx-auto mb-3 h-8 w-8 text-emerald-600" />
              <h3 className="text-sm font-semibold text-ink dark:text-sand-50">
                No Pending Industry Applications
              </h3>
              <p className="mt-1 text-xs text-ink-soft dark:text-sand-100/60">
                All submitted industry applications have been reviewed.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-ocean-900/5 dark:border-sand-100/5 text-[11px] font-mono uppercase tracking-wider text-ink-soft dark:text-sand-100/60">
                    <th className="py-3 px-4 font-medium">Company</th>
                    <th className="py-3 px-4 font-medium">Industry</th>
                    <th className="py-3 px-4 font-medium">GST / CIN</th>
                    <th className="py-3 px-4 font-medium">Status</th>
                    <th className="py-3 px-4 font-medium text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-ocean-900/5 dark:divide-sand-100/5 text-xs">
                  {industryApplications.map((industry) => (
                    <tr
                      key={industry.id || industry.user_id}
                      className="hover:bg-sand-50/60 dark:hover:bg-[#071a20]/40 transition-colors"
                    >
                      <td className="py-4 px-4">
                        <div className="font-semibold text-ink dark:text-sand-50">
                          {industry.company_name || "Unnamed Company"}
                        </div>
                        <div className="text-[11px] text-ink-faint dark:text-sand-100/50">
                          Application ID: {(industry.id || industry.user_id).slice(0, 8)}
                        </div>
                      </td>

                      <td className="py-4 px-4">
                        <span className="text-ink-soft dark:text-sand-100/80">
                          {industry.industry_type || "Not provided"}
                        </span>
                      </td>

                      <td className="py-4 px-4">
                        <div className="text-[11px] font-mono text-ink-soft dark:text-sand-100/70">
                          GST: {industry.gst_number || "N/A"}
                        </div>
                        <div className="text-[11px] font-mono text-ink-faint dark:text-sand-100/50 mt-1">
                          CIN: {industry.cin_number || "N/A"}
                        </div>
                      </td>

                      <td className="py-4 px-4">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono font-medium border bg-amber-500/10 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300 border-amber-500/20">
                          <span className="h-1.5 w-1.5 rounded-full bg-current animate-pulse" />
                          Pending Review
                        </span>
                      </td>

                      <td className="py-4 px-4 text-right">
                        <button
                          type="button"
                          onClick={() =>
                            router.push(`/admin/users/industry/${industry.id || industry.user_id}`)
                          }
                          className="inline-flex items-center gap-1.5 rounded-xl bg-ocean-900 hover:bg-ocean-700 dark:bg-mangrove-500 dark:hover:bg-mangrove-300 dark:text-ink px-3.5 py-2 text-xs font-mono font-semibold text-sand-50 shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-mangrove-500"
                        >
                          <Eye size={13} />
                          <span>Review</span>
                          <ArrowRight size={13} className="transition-transform" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>

        {/* QUICK ACTIONS */}
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
          </div>
        </motion.div>

        {/* ACTIVITY & INFRASTRUCTURE */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
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

      <Footer />
    </div>
  );
}
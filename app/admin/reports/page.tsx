"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  BarChart3,
  Download,
  FileSpreadsheet,
  Sparkles,
  Calendar,
  Filter,
  CheckCircle2,
  TrendingUp,
  Globe2,
  MapPin,
  Leaf,
} from "lucide-react";

import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

export default function AdminReportsPage() {
  const [startDate, setStartDate] = useState("2025-01-01");
  const [endDate, setEndDate] = useState("2026-08-01");
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);

  const handleExport = (reportType: string) => {
    setDownloadSuccess(`Generated and downloaded ${reportType} (${startDate} to ${endDate})`);
    setTimeout(() => setDownloadSuccess(null), 4000);
  };

  return (
    <div className="min-h-screen bg-sand-100 dark:bg-[#061418] text-ink dark:text-sand-100 flex flex-col justify-between relative overflow-x-hidden transition-colors">
      <div className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2 h-[700px] w-[1200px] rounded-full bg-gradient-to-b from-ocean-300/20 via-mangrove-300/15 to-transparent blur-3xl opacity-75 dark:from-ocean-900/35 dark:via-mangrove-900/25" />
      <Navbar />

      <main className="relative z-10 flex-1 container mx-auto px-4 sm:px-6 lg:px-8 pt-28 sm:pt-36 pb-16 max-w-7xl space-y-8">
        <Link
          href="/admin/dashboard"
          className="inline-flex items-center gap-2 text-xs font-mono font-medium text-ink-soft hover:text-ink dark:text-sand-100/70 dark:hover:text-sand-50 transition-colors"
        >
          <ArrowLeft size={16} />
          <span>Back to Admin Dashboard</span>
        </Link>

        {/* Hero Header */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-[32px] border border-ocean-900/10 bg-gradient-to-br from-white/90 via-sand-50/80 to-mangrove-500/15 dark:border-sand-100/10 dark:from-[#0a232b]/95 dark:via-[#071a20]/90 dark:to-mangrove-950/30 backdrop-blur-xl p-6 sm:p-8 shadow-card flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
        >
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-mono font-medium bg-mangrove-500/15 text-mangrove-800 dark:bg-mangrove-500/20 dark:text-mangrove-300 border border-mangrove-500/20 mb-2">
              <BarChart3 size={14} />
              <span>National Sequestration Registry</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-display font-semibold text-ink dark:text-sand-50 tracking-tight">
              Compliance & ESG Analytics Portal
            </h1>
            <p className="text-xs sm:text-sm text-ink-soft dark:text-sand-100/70 mt-1">
              Visualize blue carbon sequestration trajectories and export verified files for government and corporate compliance.
            </p>
          </div>

          {/* Date Filter */}
          <div className="flex flex-wrap items-center gap-3 bg-white/80 dark:bg-[#071a20]/80 p-3 rounded-2xl border border-ocean-900/10 dark:border-sand-100/10 text-xs font-mono shrink-0">
            <Calendar size={15} className="text-mangrove-700 dark:text-mangrove-300" />
            <div>
              <span className="text-[10px] text-ink-faint dark:text-sand-100/40 uppercase block">From</span>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="bg-transparent text-ink dark:text-sand-50 focus:outline-none"
              />
            </div>
            <span className="text-ink-faint">→</span>
            <div>
              <span className="text-[10px] text-ink-faint dark:text-sand-100/40 uppercase block">To</span>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="bg-transparent text-ink dark:text-sand-50 focus:outline-none"
              />
            </div>
          </div>
        </motion.div>

        {downloadSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-500/20 text-emerald-800 dark:text-emerald-300 text-xs font-mono flex items-center gap-2 shadow-sm"
          >
            <CheckCircle2 size={16} />
            <span>{downloadSuccess}</span>
          </motion.div>
        )}

        {/* SECTION 1: INTERACTIVE CHARTS & VISUALIZATIONS */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Sequestration Trajectory Chart (7 Cols) */}
          <div className="lg:col-span-7 rounded-[28px] border border-ocean-900/10 bg-white/80 dark:border-sand-100/10 dark:bg-[#0a232b]/80 backdrop-blur-md p-6 shadow-soft space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-display text-base font-semibold text-ink dark:text-sand-50">
                  Annual Sequestration Trajectory (tCO2e)
                </h3>
                <p className="text-xs text-ink-soft dark:text-sand-100/60">
                  Verified mangrove carbon storage yield over time
                </p>
              </div>
              <TrendingUp size={20} className="text-mangrove-600 dark:text-mangrove-400" />
            </div>

            {/* Visual Bar Chart Bar Heights */}
            <div className="h-48 flex items-end justify-between gap-3 pt-6 pb-2 border-b border-ocean-900/10 dark:border-sand-100/10">
              {[
                { year: "2022", val: "1,200", height: "30%" },
                { year: "2023", val: "3,400", height: "48%" },
                { year: "2024", val: "6,800", height: "65%" },
                { year: "2025", val: "9,500", height: "82%" },
                { year: "2026 (YTD)", val: "12,450", height: "100%" },
              ].map((item) => (
                <div key={item.year} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                  <span className="text-[10px] font-mono font-semibold text-mangrove-700 dark:text-mangrove-300 opacity-0 group-hover:opacity-100 transition-opacity">
                    {item.val}
                  </span>
                  <div
                    style={{ height: item.height }}
                    className="w-full max-w-[40px] rounded-t-xl bg-gradient-to-t from-ocean-900 to-mangrove-500 dark:from-ocean-800 dark:to-mangrove-400 opacity-90 group-hover:opacity-100 transition-all shadow-sm"
                  />
                  <span className="text-[11px] font-mono text-ink-soft dark:text-sand-100/70">{item.year}</span>
                </div>
              ))}
            </div>
          </div>

          {/* State-wise Mangrove Breakdown (5 Cols) */}
          <div className="lg:col-span-5 rounded-[28px] border border-ocean-900/10 bg-white/80 dark:border-sand-100/10 dark:bg-[#0a232b]/80 backdrop-blur-md p-6 shadow-soft space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-display text-base font-semibold text-ink dark:text-sand-50">
                  State-wise Coastal Coverage
                </h3>
                <p className="text-xs text-ink-soft dark:text-sand-100/60">
                  Hectares under active satellite monitoring
                </p>
              </div>
              <MapPin size={20} className="text-ocean-900 dark:text-sand-100" />
            </div>

            <div className="space-y-3.5 text-xs font-mono">
              {[
                { state: "West Bengal (Sundarbans)", ha: "1,420 Ha", pct: "40%" },
                { state: "Tamil Nadu (Pichavaram)", ha: "850 Ha", pct: "25%" },
                { state: "Odisha (Mahanadi)", ha: "640 Ha", pct: "18%" },
                { state: "Kerala (Vembanad)", ha: "420 Ha", pct: "12%" },
                { state: "Gujarat & Others", ha: "180 Ha", pct: "5%" },
              ].map((st) => (
                <div key={st.state} className="space-y-1">
                  <div className="flex justify-between font-semibold">
                    <span className="text-ink dark:text-sand-50 font-sans">{st.state}</span>
                    <span className="text-mangrove-700 dark:text-mangrove-300">{st.ha}</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-sand-200 dark:bg-[#071a20] overflow-hidden">
                    <div style={{ width: st.pct }} className="h-full rounded-full bg-mangrove-500" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* SECTION 2: EXPORT GENERATORS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="rounded-[28px] border border-ocean-900/10 bg-white/80 dark:border-sand-100/10 dark:bg-[#0a232b]/80 p-6 shadow-soft space-y-4">
            <div className="flex items-center gap-3">
              <FileSpreadsheet size={24} className="text-mangrove-600 dark:text-mangrove-400" />
              <div>
                <h3 className="font-display text-base font-semibold text-ink dark:text-sand-50">
                  National Mangrove Sequestration Summary
                </h3>
                <p className="text-xs text-ink-soft dark:text-sand-100/60">
                  Includes GIS plot coordinates, active hectare counts, and tCO2 calculations.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => handleExport("National Sequestration Summary (CSV)")}
              className="w-full inline-flex items-center justify-center gap-2 py-2.5 rounded-full bg-ocean-900 text-sand-50 dark:bg-mangrove-500 dark:text-ink font-mono text-xs font-semibold hover:opacity-90 shadow-sm transition-opacity"
            >
              <Download size={14} />
              <span>Export Compliance CSV File</span>
            </button>
          </div>

          <div className="rounded-[28px] border border-ocean-900/10 bg-white/80 dark:border-sand-100/10 dark:bg-[#0a232b]/80 p-6 shadow-soft space-y-4">
            <div className="flex items-center gap-3">
              <Sparkles size={24} className="text-ocean-900 dark:text-sand-100" />
              <div>
                <h3 className="font-display text-base font-semibold text-ink dark:text-sand-50">
                  UN SDG Impact & Additionality Report
                </h3>
                <p className="text-xs text-ink-soft dark:text-sand-100/60">
                  Verified metrics for SDG 13 (Climate Action) and SDG 14 (Life Below Water).
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => handleExport("UN SDG Impact Report (PDF)")}
              className="w-full inline-flex items-center justify-center gap-2 py-2.5 rounded-full bg-ocean-900 text-sand-50 dark:bg-mangrove-500 dark:text-ink font-mono text-xs font-semibold hover:opacity-90 shadow-sm transition-opacity"
            >
              <Download size={14} />
              <span>Export Compliance PDF Report</span>
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
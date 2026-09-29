"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";

import {
  ArrowLeft,
  Building2,
  MapPin,
  Maximize2,
  FileCheck2,
  BarChart3,
  Image as ImageIcon,
  TreePine,
  Sprout,
  Waves,
  Award,
  CheckCircle2,
  Download,
  ShieldCheck,
  Calendar,
  Coins,
  ExternalLink,
} from "lucide-react";

import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { getSupabaseClient } from "@/lib/supabase";

interface Project {
  id: string;
  project_id: string;
  farmer_id: string;
  project_name: string | null;
  location: string | null;
  state: string | null;
  area_ha: number | null;
  available_credits: number | null;
  credit_price: number | null;
  status: string | null;
  created_at: string | null;
  updated_at: string | null;
}

interface BaselineReport {
  id: string;
  project_id: string;
  farmer_id: string;
  status: string | null;
  images_processed: number | null;
  total_detections: number | null;
  total_area_m2: number | null;
  area_ha: number | null;
  agb_tC: number | null;
  bgb_tC: number | null;
  soc_tC: number | null;
  total_carbon_tC: number | null;
  total_co2e: number | null;
}

function formatNumber(
  value: number | null | undefined,
  decimals = 2
) {
  const number = Number(value ?? 0);

  return number.toLocaleString("en-IN", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

export default function IndustryProjectDetailsPage() {
  const router = useRouter();
  const params = useParams();

  const projectId = String(params.projectId);

  const [project, setProject] = useState<Project | null>(null);

  const [baselineReport, setBaselineReport] =
    useState<BaselineReport | null>(null);

  const [loading, setLoading] = useState(true);

  const [errorMessage, setErrorMessage] = useState("");

  const loadProject = async () => {
    setLoading(true);
    setErrorMessage("");

    try {
      const supabase = getSupabaseClient();

      if (!supabase) {
        throw new Error(
          "Supabase client is not available."
        );
      }

      /*
       * ============================================================
       * GET APPROVED PROJECT
       * ============================================================
       */

      const {
        data: projectData,
        error: projectError,
      } = await supabase
        .from("mangrove_projects")
        .select(
          `
          id,
          project_id,
          farmer_id,
          project_name,
          location,
          state,
          area_ha,
          available_credits,
          credit_price,
          status,
          created_at,
          updated_at
        `
        )
        .eq("project_id", projectId)
        .eq("status", "APPROVED")
        .maybeSingle();

      if (projectError) {
        console.error(
          "Project loading error:",
          projectError
        );

        throw new Error(
          "Unable to load the approved project."
        );
      }

      if (!projectData) {
        throw new Error(
          "This project is not available in the approved marketplace."
        );
      }

      setProject(projectData);

      /*
       * ============================================================
       * GET BASELINE REPORT
       * ============================================================
       */

      const {
        data: reportData,
        error: reportError,
      } = await supabase
        .from("baseline_reports")
        .select(
          `
          id,
          project_id,
          farmer_id,
          status,
          images_processed,
          total_detections,
          total_area_m2,
          area_ha,
          agb_tC,
          bgb_tC,
          soc_tC,
          total_carbon_tC,
          total_co2e
        `
        )
        .eq("project_id", projectData.project_id)
        .eq("farmer_id", projectData.farmer_id)
        .eq("status", "completed")
        .order("id", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (reportError) {
        console.error(
          "Baseline report loading error:",
          reportError
        );

        throw new Error(
          "Project loaded, but the baseline report could not be loaded."
        );
      }

      setBaselineReport(reportData ?? null);
    } catch (error) {
      console.error(
        "Industry project details error:",
        error
      );

      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Something went wrong while loading the project."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProject();
  }, [projectId]);

  /*
   * ============================================================
   * DOWNLOAD EXCEL REPORT
   * ============================================================
   */

  const handleDownloadReport = () => {
    window.location.href = "/api/aiml/report";
  };

  /*
   * ============================================================
   * BUY CREDITS
   * ============================================================
   */

  const handleBuyCredits = () => {
    router.push(
      `/industry/payment?project=${encodeURIComponent(
        projectId
      )}`
    );
  };

  /*
   * ============================================================
   * LOADING
   * ============================================================
   */

  if (loading) {
    return (
      <div className="min-h-screen bg-sand-50 dark:bg-[#071a20]">
        <Navbar />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">

          <div className="rounded-[28px] border border-ocean-900/10 bg-white/80 dark:border-sand-100/10 dark:bg-[#0a232b]/80 p-10 text-center shadow-soft">

            <div className="mx-auto h-8 w-8 rounded-full border-2 border-ocean-900/20 border-t-ocean-900 animate-spin dark:border-sand-100/20 dark:border-t-sand-100" />

            <p className="mt-4 text-sm text-ink-soft dark:text-sand-100/60">
              Loading approved project...
            </p>

          </div>

        </main>

        <Footer />
      </div>
    );
  }

  /*
   * ============================================================
   * ERROR
   * ============================================================
   */

  if (errorMessage || !project) {
    return (
      <div className="min-h-screen bg-sand-50 dark:bg-[#071a20]">
        <Navbar />

        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">

          <div className="rounded-[28px] border border-red-500/20 bg-red-500/5 dark:bg-red-500/10 p-8 text-center">

            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-500/10">

              <CheckCircle2
                size={24}
                className="text-red-600"
              />

            </div>

            <h1 className="mt-4 text-xl font-semibold text-ink dark:text-sand-50">
              Project Not Available
            </h1>

            <p className="mt-2 text-sm text-ink-soft dark:text-sand-100/60">
              {errorMessage ||
                "The requested project could not be found."}
            </p>

            <button
              type="button"
              onClick={() =>
                router.push("/industry/marketplace")
              }
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-ocean-900 px-5 py-3 text-sm font-medium text-sand-50 hover:opacity-90 transition-opacity dark:bg-mangrove-500 dark:text-ink"
            >
              <ArrowLeft size={16} />

              Back to Marketplace
            </button>

          </div>

        </main>

        <Footer />
      </div>
    );
  }

  /*
   * ============================================================
   * MAIN PAGE
   * ============================================================
   */

  return (
    <div className="min-h-screen bg-sand-50 dark:bg-[#071a20]">

      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* ================================================== */}
        {/* BACK */}
        {/* ================================================== */}

        <button
          type="button"
          onClick={() =>
            router.push("/industry/marketplace")
          }
          className="inline-flex items-center gap-2 mb-6 text-xs font-mono text-ink-soft dark:text-sand-100/60 hover:text-ink dark:hover:text-sand-50 transition-colors"
        >
          <ArrowLeft size={15} />

          Back to Marketplace
        </button>

        {/* ================================================== */}
        {/* HEADER */}
        {/* ================================================== */}

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="rounded-[28px] border border-ocean-900/10 bg-white/80 dark:border-sand-100/10 dark:bg-[#0a232b]/80 backdrop-blur-md p-6 sm:p-8 shadow-soft mb-8"
        >

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">

            <div>

              <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-wider text-mangrove-700 dark:text-mangrove-300">

                <Building2 size={14} />

                Authority Approved Project

              </div>

              <h1 className="mt-3 font-display text-2xl sm:text-3xl font-semibold text-ink dark:text-sand-50">

                {project.project_name ||
                  "Mangrove Restoration Project"}

              </h1>

              <div className="mt-3 flex flex-wrap items-center gap-3 text-xs font-mono text-ink-soft dark:text-sand-100/60">

                <span className="inline-flex items-center gap-1.5">
                  <FileCheck2 size={13} />

                  Project ID:

                  <span className="text-mangrove-700 dark:text-mangrove-300">
                    {project.project_id}
                  </span>
                </span>

                <span className="hidden sm:block">
                  •
                </span>

                <span className="inline-flex items-center gap-1.5">
                  <MapPin size={13} />

                  {project.location ||
                    "Blue Carbon Restoration Site"}
                </span>

              </div>

            </div>

            <div className="flex flex-col sm:flex-row gap-3">

              <div className="inline-flex items-center justify-center gap-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-4 py-2 text-xs font-mono text-emerald-700 dark:text-emerald-300">

                <CheckCircle2 size={14} />

                Authority Approved

              </div>

            </div>

          </div>

        </motion.div>

        {/* ================================================== */}
        {/* PROJECT INFORMATION */}
        {/* ================================================== */}

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
        >

          {/* AREA */}

          <div className="rounded-2xl border border-ocean-900/10 bg-white/80 dark:border-sand-100/10 dark:bg-[#0a232b]/80 p-5 shadow-soft">

            <div className="flex items-center gap-3">

              <div className="h-10 w-10 rounded-xl bg-mangrove-500/10 flex items-center justify-center">

                <Maximize2
                  size={18}
                  className="text-mangrove-700 dark:text-mangrove-300"
                />

              </div>

              <div>

                <span className="block text-[10px] uppercase tracking-wider text-ink-soft dark:text-sand-100/50">
                  Project Area
                </span>

                <span className="block mt-1 text-xl font-mono font-semibold text-ink dark:text-sand-50">
                  {formatNumber(project.area_ha, 4)}
                  {" "}
                  <span className="text-xs font-normal">
                    ha
                  </span>
                </span>

              </div>

            </div>

          </div>

          {/* AVAILABLE CREDITS */}

          <div className="rounded-2xl border border-ocean-900/10 bg-white/80 dark:border-sand-100/10 dark:bg-[#0a232b]/80 p-5 shadow-soft">

            <div className="flex items-center gap-3">

              <div className="h-10 w-10 rounded-xl bg-amber-500/10 flex items-center justify-center">

                <Coins
                  size={18}
                  className="text-amber-600 dark:text-amber-300"
                />

              </div>

              <div>

                <span className="block text-[10px] uppercase tracking-wider text-ink-soft dark:text-sand-100/50">
                  Available Credits
                </span>

                <span className="block mt-1 text-xl font-mono font-semibold text-ink dark:text-sand-50">
                  {formatNumber(
                    project.available_credits,
                    2
                  )}
                </span>

              </div>

            </div>

          </div>

          {/* PRICE */}

          <div className="rounded-2xl border border-ocean-900/10 bg-white/80 dark:border-sand-100/10 dark:bg-[#0a232b]/80 p-5 shadow-soft">

            <div className="flex items-center gap-3">

              <div className="h-10 w-10 rounded-xl bg-ocean-900/10 flex items-center justify-center">

                <Award
                  size={18}
                  className="text-ocean-900 dark:text-sand-100"
                />

              </div>

              <div>

                <span className="block text-[10px] uppercase tracking-wider text-ink-soft dark:text-sand-100/50">
                  Price / Credit
                </span>

                <span className="block mt-1 text-xl font-mono font-semibold text-ink dark:text-sand-50">
                  ₹{formatNumber(project.credit_price, 0)}
                </span>

              </div>

            </div>

          </div>

          {/* STATUS */}

          <div className="rounded-2xl border border-ocean-900/10 bg-white/80 dark:border-sand-100/10 dark:bg-[#0a232b]/80 p-5 shadow-soft">

            <div className="flex items-center gap-3">

              <div className="h-10 w-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">

                <ShieldCheck
                  size={18}
                  className="text-emerald-600 dark:text-emerald-300"
                />

              </div>

              <div>

                <span className="block text-[10px] uppercase tracking-wider text-ink-soft dark:text-sand-100/50">
                  Verification
                </span>

                <span className="block mt-1 text-sm font-semibold text-emerald-700 dark:text-emerald-300">
                  Approved
                </span>

              </div>

            </div>

          </div>

        </motion.div>

        {/* ================================================== */}
        {/* BASELINE REPORT */}
        {/* ================================================== */}

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="rounded-[28px] border border-ocean-900/10 bg-white/80 dark:border-sand-100/10 dark:bg-[#0a232b]/80 backdrop-blur-md p-6 sm:p-8 shadow-soft mb-8"
        >

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5 border-b border-ocean-900/5 dark:border-sand-100/5 pb-5">

            <div>

              <div className="flex items-center gap-2.5">

                <BarChart3
                  size={22}
                  className="text-mangrove-700 dark:text-mangrove-300"
                />

                <h2 className="font-display text-xl font-semibold text-ink dark:text-sand-50">
                  AI Baseline Report
                </h2>

              </div>

              <p className="mt-2 text-xs text-ink-soft dark:text-sand-100/60">
                Aggregated YOLOv8 analysis and baseline carbon assessment for this approved project.
              </p>

            </div>

            <button
              type="button"
              onClick={handleDownloadReport}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-ocean-900 px-5 py-3 text-xs font-mono font-semibold uppercase tracking-wider text-sand-50 hover:opacity-90 transition-opacity dark:bg-mangrove-500 dark:text-ink"
            >

              <Download size={15} />

              Download Excel Report

            </button>

          </div>

          {baselineReport ? (

            <div className="mt-6 space-y-6">

              {/* ================================================== */}
              {/* MAIN METRICS */}
              {/* ================================================== */}

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

                {/* IMAGES */}

                <div className="rounded-2xl bg-mangrove-500/10 border border-mangrove-500/20 p-5">

                  <div className="flex items-center gap-2">

                    <ImageIcon
                      size={16}
                      className="text-mangrove-700 dark:text-mangrove-300"
                    />

                    <span className="text-[10px] uppercase tracking-wider text-ink-soft dark:text-sand-100/50">
                      Images Processed
                    </span>

                  </div>

                  <div className="mt-2 text-2xl font-mono font-semibold text-ink dark:text-sand-50">
                    {formatNumber(
                      baselineReport.images_processed,
                      0
                    )}
                  </div>

                </div>

                {/* DETECTIONS */}

                <div className="rounded-2xl bg-emerald-500/10 border border-emerald-500/20 p-5">

                  <div className="flex items-center gap-2">

                    <TreePine
                      size={16}
                      className="text-emerald-700 dark:text-emerald-300"
                    />

                    <span className="text-[10px] uppercase tracking-wider text-ink-soft dark:text-sand-100/50">
                      Mangrove Detections
                    </span>

                  </div>

                  <div className="mt-2 text-2xl font-mono font-semibold text-ink dark:text-sand-50">
                    {formatNumber(
                      baselineReport.total_detections,
                      0
                    )}
                  </div>

                </div>

                {/* AREA */}

                <div className="rounded-2xl bg-ocean-900/5 border border-ocean-900/10 p-5 dark:bg-sand-100/5 dark:border-sand-100/10">

                  <div className="flex items-center gap-2">

                    <Maximize2
                      size={16}
                      className="text-ocean-900 dark:text-sand-100"
                    />

                    <span className="text-[10px] uppercase tracking-wider text-ink-soft dark:text-sand-100/50">
                      Detected Area
                    </span>

                  </div>

                  <div className="mt-2 text-2xl font-mono font-semibold text-ink dark:text-sand-50">
                    {formatNumber(
                      baselineReport.area_ha,
                      6
                    )}
                  </div>

                  <div className="text-xs text-ink-soft dark:text-sand-100/50">
                    hectares
                  </div>

                </div>

                {/* CO2 */}

                <div className="rounded-2xl bg-amber-500/10 border border-amber-500/20 p-5">

                  <div className="flex items-center gap-2">

                    <Waves
                      size={16}
                      className="text-amber-700 dark:text-amber-300"
                    />

                    <span className="text-[10px] uppercase tracking-wider text-ink-soft dark:text-sand-100/50">
                      CO₂ Equivalent
                    </span>

                  </div>

                  <div className="mt-2 text-2xl font-mono font-semibold text-ink dark:text-sand-50">
                    {formatNumber(
                      baselineReport.total_co2e,
                      4
                    )}
                  </div>

                  <div className="text-xs text-ink-soft dark:text-sand-100/50">
                    tCO₂e
                  </div>

                </div>

              </div>

              {/* ================================================== */}
              {/* CARBON BREAKDOWN */}
              {/* ================================================== */}

              <div>

                <div className="flex items-center gap-2 mb-4">

                  <Sprout
                    size={18}
                    className="text-mangrove-700 dark:text-mangrove-300"
                  />

                  <h3 className="text-sm font-semibold text-ink dark:text-sand-50">
                    Carbon Stock Breakdown
                  </h3>

                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

                  <div className="rounded-2xl border border-ocean-900/10 bg-sand-50/70 dark:bg-[#071a20]/60 dark:border-sand-100/10 p-5">

                    <span className="text-[10px] uppercase tracking-wider text-ink-soft dark:text-sand-100/50">
                      Above Ground Biomass
                    </span>

                    <div className="mt-2 text-xl font-mono font-semibold text-ink dark:text-sand-50">
                      {formatNumber(
                        baselineReport.agb_tC,
                        4
                      )}
                    </div>

                    <div className="text-xs text-ink-soft dark:text-sand-100/50">
                      tC
                    </div>

                  </div>

                  <div className="rounded-2xl border border-ocean-900/10 bg-sand-50/70 dark:bg-[#071a20]/60 dark:border-sand-100/10 p-5">

                    <span className="text-[10px] uppercase tracking-wider text-ink-soft dark:text-sand-100/50">
                      Below Ground Biomass
                    </span>

                    <div className="mt-2 text-xl font-mono font-semibold text-ink dark:text-sand-50">
                      {formatNumber(
                        baselineReport.bgb_tC,
                        4
                      )}
                    </div>

                    <div className="text-xs text-ink-soft dark:text-sand-100/50">
                      tC
                    </div>

                  </div>

                  <div className="rounded-2xl border border-ocean-900/10 bg-sand-50/70 dark:bg-[#071a20]/60 dark:border-sand-100/10 p-5">

                    <span className="text-[10px] uppercase tracking-wider text-ink-soft dark:text-sand-100/50">
                      Soil Organic Carbon
                    </span>

                    <div className="mt-2 text-xl font-mono font-semibold text-ink dark:text-sand-50">
                      {formatNumber(
                        baselineReport.soc_tC,
                        4
                      )}
                    </div>

                    <div className="text-xs text-ink-soft dark:text-sand-100/50">
                      tC
                    </div>

                  </div>

                  <div className="rounded-2xl border border-mangrove-500/20 bg-mangrove-500/10 p-5">

                    <span className="text-[10px] uppercase tracking-wider text-ink-soft dark:text-sand-100/50">
                      Total Carbon
                    </span>

                    <div className="mt-2 text-xl font-mono font-semibold text-mangrove-800 dark:text-mangrove-300">
                      {formatNumber(
                        baselineReport.total_carbon_tC,
                        4
                      )}
                    </div>

                    <div className="text-xs text-ink-soft dark:text-sand-100/50">
                      tC
                    </div>

                  </div>

                </div>

              </div>

              {/* ================================================== */}
              {/* REPORT STATUS */}
              {/* ================================================== */}

              <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-4">

                <div className="flex items-start gap-3">

                  <CheckCircle2
                    size={18}
                    className="mt-0.5 shrink-0 text-emerald-700 dark:text-emerald-300"
                  />

                  <div>

                    <p className="text-sm font-semibold text-emerald-800 dark:text-emerald-300">
                      Baseline Report Verified for Marketplace Review
                    </p>

                    <p className="mt-1 text-xs leading-relaxed text-emerald-800/70 dark:text-emerald-300/70">
                      The Industry user can review the aggregated AI baseline values and download the Excel report before proceeding with the credit purchase process.
                    </p>

                  </div>

                </div>

              </div>

            </div>

          ) : (

            <div className="mt-6 rounded-2xl border border-dashed border-ocean-900/10 dark:border-sand-100/10 p-10 text-center">

              <BarChart3
                size={28}
                className="mx-auto text-ink-soft dark:text-sand-100/40"
              />

              <p className="mt-3 text-sm font-medium text-ink dark:text-sand-50">
                Baseline report not available
              </p>

              <p className="mt-1 text-xs text-ink-soft dark:text-sand-100/60">
                No completed baseline report was found for this project.
              </p>

            </div>

          )}

        </motion.div>

        {/* ================================================== */}
        {/* PROJECT DETAILS + PURCHASE */}
        {/* ================================================== */}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* LEFT */}

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
            className="lg:col-span-2 rounded-[28px] border border-ocean-900/10 bg-white/80 dark:border-sand-100/10 dark:bg-[#0a232b]/80 backdrop-blur-md p-6 sm:p-8 shadow-soft"
          >

            <div className="flex items-center gap-2.5 pb-4 border-b border-ocean-900/5 dark:border-sand-100/5">

              <ShieldCheck
                size={20}
                className="text-mangrove-700 dark:text-mangrove-300"
              />

              <h2 className="font-display text-lg font-semibold text-ink dark:text-sand-50">
                Authority Verification
              </h2>

            </div>

            <div className="mt-5 space-y-4">

              <div className="flex items-start gap-3">

                <CheckCircle2
                  size={18}
                  className="mt-0.5 shrink-0 text-emerald-600"
                />

                <div>

                  <p className="text-sm font-medium text-ink dark:text-sand-50">
                    Project approved
                  </p>

                  <p className="text-xs mt-1 text-ink-soft dark:text-sand-100/60">
                    This project has completed the Authority approval step and is visible in the Industry Marketplace.
                  </p>

                </div>

              </div>

              <div className="flex items-start gap-3">

                <FileCheck2
                  size={18}
                  className="mt-0.5 shrink-0 text-mangrove-700 dark:text-mangrove-300"
                />

                <div>

                  <p className="text-sm font-medium text-ink dark:text-sand-50">
                    Baseline data available
                  </p>

                  <p className="text-xs mt-1 text-ink-soft dark:text-sand-100/60">
                    Industry can inspect the AI-generated baseline report before purchasing credits.
                  </p>

                </div>

              </div>

              <div className="flex items-start gap-3">

                <Calendar
                  size={18}
                  className="mt-0.5 shrink-0 text-ocean-900 dark:text-sand-100"
                />

                <div>

                  <p className="text-sm font-medium text-ink dark:text-sand-50">
                    Project Created
                  </p>

                  <p className="text-xs mt-1 text-ink-soft dark:text-sand-100/60">
                    {project.created_at
                      ? new Date(
                          project.created_at
                        ).toLocaleDateString(
                          "en-IN",
                          {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          }
                        )
                      : "Not available"}
                  </p>

                </div>

              </div>

            </div>

          </motion.div>

          {/* RIGHT PURCHASE CARD */}

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="rounded-[28px] border border-mangrove-500/20 bg-mangrove-500/10 dark:bg-mangrove-500/10 p-6 sm:p-8 shadow-soft"
          >

            <div className="flex items-center gap-2.5">

              <Coins
                size={20}
                className="text-amber-600 dark:text-amber-300"
              />

              <h2 className="font-display text-lg font-semibold text-ink dark:text-sand-50">
                Carbon Credits
              </h2>

            </div>

            <p className="mt-3 text-xs leading-relaxed text-ink-soft dark:text-sand-100/60">
              Purchase available credits from this Authority-approved project.
            </p>

            <div className="mt-6 space-y-4">

              <div className="rounded-2xl bg-white/70 dark:bg-[#071a20]/50 p-4">

                <span className="block text-[10px] uppercase tracking-wider text-ink-soft dark:text-sand-100/50">
                  Available
                </span>

                <span className="block mt-1 text-2xl font-mono font-semibold text-ink dark:text-sand-50">
                  {formatNumber(
                    project.available_credits,
                    2
                  )}
                </span>

                <span className="text-xs text-ink-soft dark:text-sand-100/50">
                  carbon credits
                </span>

              </div>

              <div className="rounded-2xl bg-white/70 dark:bg-[#071a20]/50 p-4">

                <span className="block text-[10px] uppercase tracking-wider text-ink-soft dark:text-sand-100/50">
                  Price per credit
                </span>

                <span className="block mt-1 text-2xl font-mono font-semibold text-ink dark:text-sand-50">
                  ₹{formatNumber(
                    project.credit_price,
                    0
                  )}
                </span>

              </div>

              <button
                type="button"
                onClick={handleBuyCredits}
                disabled={
                  Number(
                    project.available_credits ?? 0
                  ) <= 0
                }
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-ocean-900 px-5 py-3.5 text-xs font-mono font-semibold uppercase tracking-wider text-sand-50 hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed dark:bg-mangrove-500 dark:text-ink"
              >

                Buy Carbon Credits

                <ExternalLink size={15} />

              </button>

            </div>

          </motion.div>

        </div>

        {/* ================================================== */}
        {/* FOOTER NOTE */}
        {/* ================================================== */}

        <div className="mt-8 rounded-2xl border border-amber-500/20 bg-amber-500/10 p-4">

          <p className="text-xs leading-relaxed text-amber-800 dark:text-amber-300">

            <strong>Marketplace status:</strong>{" "}
            This project is shown here only because its status is
            {" "}
            <strong>APPROVED</strong>.
            {" "}
            The Industry user can review the baseline report and then continue to the purchase flow.

          </p>

        </div>

      </main>

      <Footer />

    </div>
  );
}
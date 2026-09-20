"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Building2,
  MapPin,
  Maximize2,
  Calendar,
  ShieldCheck,
  FileCheck2,
  Activity,
  Layers,
  Sparkles,
  FileText,
  Download,
  AlertCircle,
  BarChart3,
  Database,
  CheckCircle2,
  Satellite,
  Trees,
  Eye,
  Check,
  Clock,
  Coins,
  Lock,
  ArrowRight,
  Info,
  Store,
} from "lucide-react";

import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { getSupabaseClient } from "@/lib/supabase";
const AIML_API_URL = "/api/aiml";
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

export default function ProjectDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const projectId = params.projectId;

  // Tab Navigation State
  const [activeTab, setActiveTab] = useState<
    "overview" | "baseline" | "mrv" | "credits"
  >("overview");

  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisMessage, setAnalysisMessage] = useState("");
  const [analysisResult, setAnalysisResult] = useState<any>(null);

  const analyzeImage = async () => {
    if (!selectedImage) {
      setAnalysisMessage("Please select an image first.");
      return;
    }

    setIsAnalyzing(true);
    setAnalysisMessage("Uploading image and running YOLO analysis...");
    setAnalysisResult(null);

    try {
      const formData = new FormData();
      formData.append("file", selectedImage);

      const response = await fetch(`${AIML_API_URL}/predict`, {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || "AI analysis failed.");
      }

      setAnalysisResult(result);
      setAnalysisMessage(
        `Analysis complete. ${result.detection_count} mangrove detections found.`
      );
      window.location.href = "/api/aiml/report";

      try {
        const supabase = getSupabaseClient();
        const { data: sessionData } = await supabase.auth.getSession();
        const farmerId = sessionData.session?.user?.id ?? null;
        const detections = Array.isArray(result.detections) ? result.detections : [];
        const totalPixelArea = detections.reduce(
          (sum: number, detection: any) => sum + Number(detection.pixel_area || 0),
          0
        );

        const { data: report, error: reportError } = await supabase
          .from("baseline_reports")
          .insert({
            project_id: String(projectId),
            farmer_id: farmerId,
            status: "completed",
            images_processed: 1,
            total_detections: Number(result.detection_count || 0),
            total_area_m2: 0,
            area_ha: 0,
            agb_tC: 0,
            bgb_tC: 0,
            soc_tC: 0,
            total_carbon_tC: 0,
            total_co2e: 0,
          })
          .select("id")
          .single();

        if (reportError) {
          console.error("Supabase report save error:", reportError);
        } else {
          const { error: imageError } = await supabase
            .from("baseline_images")
            .insert({
              report_id: report.id,
              image_name: selectedImage.name,
              detection_count: Number(result.detection_count || 0),
              pixel_area: totalPixelArea,
              area_m2: 0,
              area_ha: 0,
              co2e: 0,
              detections_json: detections,
            });

          if (imageError) {
            console.error("Supabase image save error:", imageError);
          }
        }
      } catch (saveError) {
        console.error("Could not save AIML result to Supabase:", saveError);
      }
    } catch (error) {
      console.error("AIML analysis error:", error);
      setAnalysisMessage(
        error instanceof Error
          ? error.message
          : "Unable to connect to AIML API. Make sure the Python API is running."
      );
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-sand-100 dark:bg-[#061418] text-ink dark:text-sand-100 flex flex-col justify-between relative overflow-x-hidden transition-colors">
      {/* Background Ambient Glowing Gradients */}
      <div className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2 h-[600px] w-[1100px] rounded-full bg-gradient-to-b from-ocean-300/20 via-mangrove-300/15 to-transparent blur-3xl opacity-70 dark:from-ocean-900/35 dark:via-mangrove-900/25" />

      {/* Global Navbar */}
      <Navbar />

      {/* Main Content */}
      <main className="relative z-10 flex-1 container mx-auto px-4 sm:px-6 lg:px-8 pt-28 sm:pt-36 pb-16 max-w-7xl space-y-8">
        {/* Navigation Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <button
            type="button"
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-ink-soft dark:text-sand-100/70 hover:text-ink dark:hover:text-sand-50 transition-colors"
          >
            <ArrowLeft size={14} />
            <span>Back to Dashboard</span>
          </button>
        </motion.div>

        {/* HERO HEADER */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          className="relative overflow-hidden rounded-[32px] border border-ocean-900/10 bg-gradient-to-br from-white/90 via-sand-50/80 to-mangrove-500/15 dark:border-sand-100/10 dark:from-[#0a232b]/95 dark:via-[#071a20]/90 dark:to-mangrove-950/30 backdrop-blur-xl p-6 sm:p-10 shadow-card"
        >
          <div className="pointer-events-none absolute -right-12 -top-12 h-72 w-72 rounded-full bg-gradient-to-br from-mangrove-400/25 via-ocean-500/20 to-transparent blur-3xl" />

          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-mangrove-500/20 text-mangrove-800 dark:bg-mangrove-500/20 dark:text-mangrove-300 shrink-0 mt-1 sm:mt-0">
                <Building2 size={28} />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-2xl sm:text-3xl font-display font-semibold text-ink dark:text-sand-50">
                    Mangrove Restoration Project
                  </h1>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-medium bg-amber-500/10 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300 border border-amber-500/20">
                    <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
                    <span>Pending Verification</span>
                  </span>
                </div>
                <p className="text-xs font-mono text-ink-soft dark:text-sand-100/60">
                  Project ID: <span className="text-mangrove-700 dark:text-mangrove-300">{projectId}</span>
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* PROJECT NAVIGATION TABS */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex items-center gap-1.5 p-1.5 rounded-2xl bg-white/60 dark:bg-[#0a232b]/60 border border-ocean-900/10 dark:border-sand-100/10 backdrop-blur-md overflow-x-auto"
        >
          {[
            { id: "overview", label: "Overview" },
            { id: "baseline", label: "Baseline Report" },
            { id: "mrv", label: "MRV & Verification" },
            { id: "credits", label: "Credits" },
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`relative px-4 py-2.5 rounded-xl text-xs font-mono tracking-wider transition-all whitespace-nowrap ${
                  isActive
                    ? "bg-ocean-900 text-sand-50 dark:bg-mangrove-500 dark:text-ink font-semibold shadow-sm"
                    : "text-ink-soft dark:text-sand-100/70 hover:text-ink dark:hover:text-sand-50 hover:bg-sand-100/50 dark:hover:bg-[#071a20]/50"
                }`}
              >
                <span>{tab.label}</span>
              </button>
            );
          })}
        </motion.div>

        {/* TAB CONTENT SWITCHING */}
        {activeTab === "overview" && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 lg:grid-cols-12 gap-8"
          >
            {/* Main Info Column (8 Cols) */}
            <div className="lg:col-span-8 space-y-8">
              {/* Overview Metadata */}
              <motion.div
                variants={itemVariants}
                className="rounded-[28px] border border-ocean-900/10 bg-white/80 dark:border-sand-100/10 dark:bg-[#0a232b]/80 backdrop-blur-md p-6 sm:p-8 shadow-soft space-y-6"
              >
                <h2 className="font-display text-lg font-semibold text-ink dark:text-sand-50 tracking-tight border-b border-ocean-900/5 dark:border-sand-100/5 pb-4">
                  Plot Metadata & Field Telemetry
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl bg-sand-50/70 dark:bg-[#071a20]/60 border border-ocean-900/5 dark:border-sand-100/5 flex items-start gap-3">
                    <MapPin size={20} className="text-mangrove-600 dark:text-mangrove-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="block text-[10px] font-mono uppercase tracking-wider text-ink-soft dark:text-sand-100/50">
                        GPS Coordinates
                      </span>
                      <span className="text-sm font-medium text-ink-faint dark:text-sand-100/40 block mt-1">
                        Awaiting Satellite Calibration
                      </span>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-sand-50/70 dark:bg-[#071a20]/60 border border-ocean-900/5 dark:border-sand-100/5 flex items-start gap-3">
                    <Maximize2 size={20} className="text-mangrove-600 dark:text-mangrove-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="block text-[10px] font-mono uppercase tracking-wider text-ink-soft dark:text-sand-100/50">
                        Total Area
                      </span>
                      <span className="text-sm font-medium text-ink-faint dark:text-sand-100/40 block mt-1 font-mono">
                        -- Hectares
                      </span>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-sand-50/70 dark:bg-[#071a20]/60 border border-ocean-900/5 dark:border-sand-100/5 flex items-start gap-3">
                    <Calendar size={20} className="text-mangrove-600 dark:text-mangrove-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="block text-[10px] font-mono uppercase tracking-wider text-ink-soft dark:text-sand-100/50">
                        Registration Date
                      </span>
                      <span className="text-sm font-semibold text-ink dark:text-sand-50 block mt-1 font-mono">
                        Recently Submitted
                      </span>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-sand-50/70 dark:bg-[#071a20]/60 border border-ocean-900/5 dark:border-sand-100/5 flex items-start gap-3">
                    <Layers size={20} className="text-mangrove-600 dark:text-mangrove-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="block text-[10px] font-mono uppercase tracking-wider text-ink-soft dark:text-sand-100/50">
                        Ecosystem Type
                      </span>
                      <span className="text-sm font-semibold text-ink dark:text-sand-50 block mt-1">
                        Coastal Mangrove
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Satellite & MRV Monitoring Placeholder */}
              <motion.div
                variants={itemVariants}
                className="rounded-[28px] border border-ocean-900/10 bg-white/80 dark:border-sand-100/10 dark:bg-[#0a232b]/80 backdrop-blur-md p-6 sm:p-8 shadow-soft space-y-4"
              >
                <div className="flex items-center gap-3 border-b border-ocean-900/5 dark:border-sand-100/5 pb-4">
                  <Activity size={20} className="text-ocean-900 dark:text-sand-100" />
                  <h2 className="font-display text-lg font-semibold text-ink dark:text-sand-50 tracking-tight">
                    MRV Telemetry & Satellite Data
                  </h2>
                </div>

                <div className="p-8 text-center rounded-2xl border border-dashed border-ocean-900/10 dark:border-sand-100/10 bg-sand-50/50 dark:bg-[#071a20]/50 space-y-2">
                  <Sparkles size={24} className="mx-auto text-mangrove-600 dark:text-mangrove-400" />
                  <p className="text-sm font-medium text-ink dark:text-sand-50">
                    Telemetry Feed Initializing
                  </p>
                  <p className="text-xs text-ink-soft dark:text-sand-100/60 max-w-md mx-auto">
                    Remote sensing indices, biomass estimations, and drone imagery feeds will populate after site boundary verification.
                  </p>
                </div>
              </motion.div>
            </div>

            {/* Sidebar Column (4 Cols) */}
            <div className="lg:col-span-4 space-y-8">
              {/* Status Card */}
              <motion.div
                variants={itemVariants}
                className="rounded-[28px] border border-ocean-900/10 bg-white/80 dark:border-sand-100/10 dark:bg-[#0a232b]/80 backdrop-blur-md p-6 shadow-soft space-y-4"
              >
                <div className="flex items-center gap-2.5 pb-3 border-b border-ocean-900/5 dark:border-sand-100/5">
                  <ShieldCheck size={20} className="text-amber-600 dark:text-amber-400" />
                  <h3 className="font-display text-base font-semibold text-ink dark:text-sand-50 tracking-tight">
                    Verification Status
                  </h3>
                </div>

                <p className="text-xs text-ink-soft dark:text-sand-100/70 leading-relaxed">
                  Your project application and land ownership proofs are currently under review by regional forest and carbon auditors.
                </p>

                <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs font-mono text-amber-800 dark:text-amber-300">
                  Current Stage: Regional Audit
                </div>
              </motion.div>

              {/* Document Checklist */}
              <motion.div
                variants={itemVariants}
                className="rounded-[28px] border border-ocean-900/10 bg-white/80 dark:border-sand-100/10 dark:bg-[#0a232b]/80 backdrop-blur-md p-6 shadow-soft space-y-4"
              >
                <div className="flex items-center gap-2.5 pb-3 border-b border-ocean-900/5 dark:border-sand-100/5">
                  <FileCheck2 size={20} className="text-mangrove-600 dark:text-mangrove-400" />
                  <h3 className="font-display text-base font-semibold text-ink dark:text-sand-50 tracking-tight">
                    Linked Documents
                  </h3>
                </div>

                <ul className="space-y-2 text-xs text-ink-soft dark:text-sand-100/80 font-mono">
                  <li className="flex items-center justify-between p-2.5 rounded-lg bg-sand-50/70 dark:bg-[#071a20]/60">
                    <span>Land Title Deed</span>
                    <span className="text-mangrove-700 dark:text-mangrove-300 font-bold">✓ Attached</span>
                  </li>
                  <li className="flex items-center justify-between p-2.5 rounded-lg bg-sand-50/70 dark:bg-[#071a20]/60">
                    <span>Farmer Identity Verification</span>
                    <span className="text-mangrove-700 dark:text-mangrove-300 font-bold">✓ Verified</span>
                  </li>
                </ul>
              </motion.div>
            </div>
          </motion.div>
        )}

        {/* BASELINE REPORT TAB CONTENT */}
        {activeTab === "baseline" && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-8"
          >
            {/* Header / Demo Notice Banner */}
            <motion.div
              variants={itemVariants}
              className="flex items-center justify-between flex-wrap gap-4 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-800 dark:text-amber-300"
            >
              <div className="flex items-center gap-2">
                <AlertCircle size={16} className="shrink-0" />
                <span>
                  <strong>Demo / Sample Data Notice:</strong> Carbon values and survey metrics below are prototype placeholders for assessment setup.
                </span>
              </div>
              <button
                type="button"
                onClick={() => alert("Downloading Baseline Report (Demo PDF)...")}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-ocean-900 text-sand-50 dark:bg-mangrove-500 dark:text-ink font-mono text-[11px] font-semibold uppercase tracking-wider hover:opacity-90 transition-opacity"
              >
                <Download size={13} />
                <span>Download Baseline Report (PDF)</span>
              </button>
            </motion.div>

            {/* Baseline Summary Cards */}
            <motion.div
              variants={containerVariants}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
            >
              <motion.div
                variants={itemVariants}
                className="p-5 rounded-2xl bg-white/80 dark:bg-[#0a232b]/80 border border-ocean-900/10 dark:border-sand-100/10 shadow-soft"
              >
                <span className="block text-[10px] font-mono uppercase tracking-wider text-ink-soft dark:text-sand-100/50">
                  Baseline Carbon Stock
                </span>
                <span className="text-2xl font-display font-semibold text-ink dark:text-sand-50 block mt-1 font-mono">
                  1,200 <span className="text-xs text-ink-soft font-normal">tCO₂e</span>
                </span>
                <span className="inline-block mt-2 px-2 py-0.5 rounded text-[10px] font-mono bg-mangrove-500/10 text-mangrove-700 dark:text-mangrove-300 border border-mangrove-500/20">
                  Demo / Sample Data
                </span>
              </motion.div>

              <motion.div
                variants={itemVariants}
                className="p-5 rounded-2xl bg-white/80 dark:bg-[#0a232b]/80 border border-ocean-900/10 dark:border-sand-100/10 shadow-soft"
              >
                <span className="block text-[10px] font-mono uppercase tracking-wider text-ink-soft dark:text-sand-100/50">
                  Baseline Date
                </span>
                <span className="text-xl font-display font-semibold text-ink dark:text-sand-50 block mt-1">
                  January 2025
                </span>
                <span className="block text-[10px] font-mono text-ink-soft dark:text-sand-100/60 mt-2">
                  Reference Period
                </span>
              </motion.div>

              <motion.div
                variants={itemVariants}
                className="p-5 rounded-2xl bg-white/80 dark:bg-[#0a232b]/80 border border-ocean-900/10 dark:border-sand-100/10 shadow-soft"
              >
                <span className="block text-[10px] font-mono uppercase tracking-wider text-ink-soft dark:text-sand-100/50">
                  Verification Status
                </span>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono font-medium bg-amber-500/10 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300 border border-amber-500/20 mt-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
                  <span>Pending Verification</span>
                </div>
              </motion.div>

              <motion.div
                variants={itemVariants}
                className="p-5 rounded-2xl bg-white/80 dark:bg-[#0a232b]/80 border border-ocean-900/10 dark:border-sand-100/10 shadow-soft"
              >
                <span className="block text-[10px] font-mono uppercase tracking-wider text-ink-soft dark:text-sand-100/50">
                  Methodology
                </span>
                <span className="text-sm font-semibold text-ink dark:text-sand-50 block mt-1">
                  BlueCarbon Nexus Assessment
                </span>
                <span className="block text-[10px] font-mono text-ink-soft dark:text-sand-100/60 mt-2">
                  Prototype Framework
                </span>
              </motion.div>
            </motion.div>

            {/* AIML BASELINE ANALYSIS */}
            <motion.div
              variants={itemVariants}
              className="rounded-[28px] border border-ocean-900/10 bg-white/80 dark:border-sand-100/10 dark:bg-[#0a232b]/80 backdrop-blur-md p-6 sm:p-8 shadow-soft"
            >
              <div className="flex items-center gap-2.5 pb-3 border-b border-ocean-900/5 dark:border-sand-100/5">
                <Trees size={20} className="text-mangrove-600 dark:text-mangrove-400" />
                <h3 className="font-display text-base font-semibold text-ink dark:text-sand-50 tracking-tight">
                  AI Mangrove Baseline Analysis
                </h3>
              </div>

              <div className="mt-5 space-y-4">
                <p className="text-xs text-ink-soft dark:text-sand-100/60">
                  Upload a mangrove image to run the BlueCarbon Nexus YOLO detection model.
                </p>

                <input
                  type="file"
                  accept="image/*"
                  onChange={(event) => {
                    setSelectedImage(event.target.files?.[0] || null);
                    setAnalysisMessage("");
                    setAnalysisResult(null);
                  }}
                  className="block w-full text-sm text-ink-soft dark:text-sand-100/60 file:mr-4 file:rounded-xl file:border-0 file:px-4 file:py-2 file:bg-mangrove-500/10 file:text-mangrove-700 dark:file:text-mangrove-300 file:font-medium"
                />

                {selectedImage && (
                  <p className="text-xs font-mono text-ink-soft dark:text-sand-100/60">
                    Selected: {selectedImage.name}
                  </p>
                )}

                <button
                  type="button"
                  onClick={analyzeImage}
                  disabled={!selectedImage || isAnalyzing}
                  className="inline-flex items-center gap-2 rounded-xl px-5 py-3 bg-mangrove-600 text-white text-xs font-mono font-medium hover:bg-mangrove-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Sparkles size={15} />
                  {isAnalyzing ? "Analyzing..." : "Analyze with AI"}
                </button>

                {analysisMessage && (
                  <div className="rounded-xl bg-sand-50/70 dark:bg-[#071a20]/60 p-4 text-xs font-mono text-ink-soft dark:text-sand-100/70">
                    {analysisMessage}
                  </div>
                )}

                {analysisResult && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="p-4 rounded-xl bg-mangrove-500/10 border border-mangrove-500/20">
                      <span className="block text-[10px] uppercase tracking-wider text-ink-soft dark:text-sand-100/50">Mangrove Detections</span>
                      <span className="block mt-1 text-2xl font-mono font-semibold text-ink dark:text-sand-50">{analysisResult.detection_count}</span>
                    </div>
                    <div className="p-4 rounded-xl bg-sand-50/70 dark:bg-[#071a20]/60 border border-ocean-900/5 dark:border-sand-100/5">
                      <span className="block text-[10px] uppercase tracking-wider text-ink-soft dark:text-sand-100/50">Image</span>
                      <span className="block mt-1 text-sm font-medium truncate text-ink dark:text-sand-50">{analysisResult.filename}</span>
                    </div>
                    <div className="p-4 rounded-xl bg-sand-50/70 dark:bg-[#071a20]/60 border border-ocean-900/5 dark:border-sand-100/5">
                      <span className="block text-[10px] uppercase tracking-wider text-ink-soft dark:text-sand-100/50">Model</span>
                      <span className="block mt-1 text-sm font-medium text-ink dark:text-sand-50">YOLOv8</span>
                    </div>
                  </div>
                )}

                <div className="rounded-xl border border-amber-500/20 bg-amber-500/10 p-4 text-[11px] leading-relaxed text-amber-800 dark:text-amber-300">
                  AI detections are real model output. Physical area, biomass, carbon stock, and CO₂e are not calculated yet because image-to-ground calibration and the approved carbon methodology still need to be connected.
                </div>
              </div>
            </motion.div>

            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Left Column (7 Cols) */}
              <div className="lg:col-span-7 space-y-8">
                {/* Project Details */}
                <motion.div
                  variants={itemVariants}
                  className="rounded-[28px] border border-ocean-900/10 bg-white/80 dark:border-sand-100/10 dark:bg-[#0a232b]/80 backdrop-blur-md p-6 sm:p-8 shadow-soft space-y-4"
                >
                  <div className="flex items-center gap-2.5 pb-3 border-b border-ocean-900/5 dark:border-sand-100/5">
                    <Building2 size={20} className="text-mangrove-600 dark:text-mangrove-400" />
                    <h3 className="font-display text-base font-semibold text-ink dark:text-sand-50 tracking-tight">
                      Project Details
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="p-3 rounded-xl bg-sand-50/70 dark:bg-[#071a20]/60">
                      <span className="block font-mono text-[10px] uppercase text-ink-soft dark:text-sand-100/50">Project Name</span>
                      <span className="font-medium text-ink dark:text-sand-50 block mt-0.5">Mangrove Restoration Project</span>
                    </div>

                    <div className="p-3 rounded-xl bg-sand-50/70 dark:bg-[#071a20]/60">
                      <span className="block font-mono text-[10px] uppercase text-ink-soft dark:text-sand-100/50">Project ID</span>
                      <span className="font-mono font-medium text-mangrove-700 dark:text-mangrove-300 block mt-0.5">{projectId}</span>
                    </div>

                    <div className="p-3 rounded-xl bg-sand-50/70 dark:bg-[#071a20]/60">
                      <span className="block font-mono text-[10px] uppercase text-ink-soft dark:text-sand-100/50">Location</span>
                      <span className="font-medium text-ink-faint dark:text-sand-100/40 block mt-0.5">Awaiting Satellite Calibration</span>
                    </div>

                    <div className="p-3 rounded-xl bg-sand-50/70 dark:bg-[#071a20]/60">
                      <span className="block font-mono text-[10px] uppercase text-ink-soft dark:text-sand-100/50">Area</span>
                      <span className="font-mono font-medium text-ink-faint dark:text-sand-100/40 block mt-0.5">-- hectares</span>
                    </div>

                    <div className="p-3 rounded-xl bg-sand-50/70 dark:bg-[#071a20]/60 sm:col-span-2">
                      <span className="block font-mono text-[10px] uppercase text-ink-soft dark:text-sand-100/50">Ecosystem Type</span>
                      <span className="font-medium text-ink dark:text-sand-50 block mt-0.5">Coastal Mangrove</span>
                    </div>
                  </div>
                </motion.div>

                {/* Data Sources */}
                <motion.div
                  variants={itemVariants}
                  className="rounded-[28px] border border-ocean-900/10 bg-white/80 dark:border-sand-100/10 dark:bg-[#0a232b]/80 backdrop-blur-md p-6 sm:p-8 shadow-soft space-y-4"
                >
                  <div className="flex items-center gap-2.5 pb-3 border-b border-ocean-900/5 dark:border-sand-100/5">
                    <Database size={20} className="text-ocean-900 dark:text-sand-100" />
                    <h3 className="font-display text-base font-semibold text-ink dark:text-sand-50 tracking-tight">
                      Data Sources Status
                    </h3>
                  </div>

                  <div className="space-y-2.5 text-xs font-mono">
                    <div className="flex items-center justify-between p-3 rounded-xl bg-sand-50/70 dark:bg-[#071a20]/60">
                      <span>Drone Survey</span>
                      <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-700 dark:text-amber-300">Pending</span>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-xl bg-sand-50/70 dark:bg-[#071a20]/60">
                      <span>Field Survey</span>
                      <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-700 dark:text-amber-300">Pending</span>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-xl bg-sand-50/70 dark:bg-[#071a20]/60">
                      <span>Satellite Data</span>
                      <span className="px-2 py-0.5 rounded bg-sand-200/50 dark:bg-sand-100/10 text-ink-soft dark:text-sand-100/60">Awaiting Calibration</span>
                    </div>
                  </div>
                </motion.div>

                {/* Methodology Statement */}
                <motion.div
                  variants={itemVariants}
                  className="rounded-[28px] border border-ocean-900/10 bg-white/80 dark:border-sand-100/10 dark:bg-[#0a232b]/80 backdrop-blur-md p-6 sm:p-8 shadow-soft space-y-3"
                >
                  <div className="flex items-center gap-2 pb-2 border-b border-ocean-900/5 dark:border-sand-100/5">
                    <FileText size={18} className="text-mangrove-600 dark:text-mangrove-400" />
                    <h3 className="font-display text-base font-semibold text-ink dark:text-sand-50 tracking-tight">
                      Methodology Statement
                    </h3>
                  </div>
                  <p className="text-xs text-ink-soft dark:text-sand-100/70 leading-relaxed">
                    Baseline carbon assessment estimates the initial carbon stock of the mangrove project using available field, drone, and satellite observations. This prototype demonstrates how baseline information can be recorded before ongoing MRV monitoring.
                  </p>
                </motion.div>
              </div>

              {/* Right Column (5 Cols) */}
              <div className="lg:col-span-5 space-y-8">
                {/* Carbon Results (Demo Data) */}
                <motion.div
                  variants={itemVariants}
                  className="rounded-[28px] border border-ocean-900/10 bg-white/80 dark:border-sand-100/10 dark:bg-[#0a232b]/80 backdrop-blur-md p-6 shadow-soft space-y-4"
                >
                  <div className="flex items-center justify-between pb-3 border-b border-ocean-900/5 dark:border-sand-100/5">
                    <div className="flex items-center gap-2">
                      <BarChart3 size={20} className="text-mangrove-600 dark:text-mangrove-400" />
                      <h3 className="font-display text-base font-semibold text-ink dark:text-sand-50 tracking-tight">
                        Carbon Results
                      </h3>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-mangrove-500/10 text-mangrove-700 dark:text-mangrove-300">
                      DEMO DATA
                    </span>
                  </div>

                  <div className="space-y-3 text-xs">
                    <div className="flex items-center justify-between p-3 rounded-xl bg-sand-50/70 dark:bg-[#071a20]/60">
                      <span className="text-ink-soft dark:text-sand-100/70">Above-ground biomass</span>
                      <span className="font-mono font-semibold text-ink dark:text-sand-50">800 tonnes</span>
                    </div>

                    <div className="flex items-center justify-between p-3 rounded-xl bg-sand-50/70 dark:bg-[#071a20]/60">
                      <span className="text-ink-soft dark:text-sand-100/70">Below-ground biomass</span>
                      <span className="font-mono font-semibold text-ink dark:text-sand-50">400 tonnes</span>
                    </div>

                    <div className="flex items-center justify-between p-3 rounded-xl bg-sand-50/70 dark:bg-[#071a20]/60 border border-ocean-900/5 dark:border-sand-100/5">
                      <span className="font-medium text-ink dark:text-sand-50">Total biomass</span>
                      <span className="font-mono font-bold text-ink dark:text-sand-50">1,200 tonnes</span>
                    </div>

                    <div className="flex items-center justify-between p-3.5 rounded-xl bg-mangrove-500/15 border border-mangrove-500/20 text-mangrove-900 dark:text-mangrove-200">
                      <span className="font-semibold">Estimated carbon stock</span>
                      <span className="font-mono font-bold text-sm">1,200 tCO₂e</span>
                    </div>
                  </div>
                </motion.div>

                {/* Baseline Verification Status */}
                <motion.div
                  variants={itemVariants}
                  className="rounded-[28px] border border-ocean-900/10 bg-white/80 dark:border-sand-100/10 dark:bg-[#0a232b]/80 backdrop-blur-md p-6 shadow-soft space-y-4"
                >
                  <div className="flex items-center gap-2.5 pb-3 border-b border-ocean-900/5 dark:border-sand-100/5">
                    <CheckCircle2 size={20} className="text-amber-600 dark:text-amber-400" />
                    <h3 className="font-display text-base font-semibold text-ink dark:text-sand-50 tracking-tight">
                      Verification Info
                    </h3>
                  </div>

                  <div className="space-y-3 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-ink-soft dark:text-sand-100/60">Status:</span>
                      <span className="font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-700 dark:text-amber-300 font-medium">
                        Pending Verification
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-ink-soft dark:text-sand-100/60">Verified By:</span>
                      <span className="font-medium text-ink dark:text-sand-50">Not yet verified</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-ink-soft dark:text-sand-100/60">Verification Date:</span>
                      <span className="font-mono text-ink-faint dark:text-sand-100/40">Not available</span>
                    </div>

                    <div className="p-3 rounded-xl bg-sand-50/80 dark:bg-[#071a20]/80 border border-ocean-900/5 dark:border-sand-100/5 text-ink-soft dark:text-sand-100/70 italic leading-relaxed text-[11px]">
                      &quot;Baseline report will be reviewed during the project verification process.&quot;
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        )}

        {/* STEP 3: MRV & VERIFICATION TAB CONTENT */}
        {activeTab === "mrv" && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-8"
          >
            {/* 1. Monitoring Status Banner Card */}
            <motion.div
              variants={itemVariants}
              className="rounded-[28px] border border-ocean-900/10 bg-white/80 dark:border-sand-100/10 dark:bg-[#0a232b]/80 backdrop-blur-md p-6 sm:p-8 shadow-soft flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
            >
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <Activity size={22} className="text-mangrove-600 dark:text-mangrove-400" />
                  <h2 className="font-display text-xl font-semibold text-ink dark:text-sand-50 tracking-tight">
                    MRV & Verification
                  </h2>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-medium bg-emerald-500/10 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300 border border-emerald-500/20">
                    <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span>🟢 Monitoring Active</span>
                  </span>
                </div>
                <p className="text-xs text-ink-soft dark:text-sand-100/60">
                  Continuous environmental monitoring and verification status for site telemetry.
                </p>
              </div>

              <div className="flex items-center gap-6 text-xs font-mono border-t md:border-t-0 md:border-l border-ocean-900/5 dark:border-sand-100/5 pt-4 md:pt-0 md:pl-6">
                <div>
                  <span className="block text-[10px] uppercase text-ink-soft dark:text-sand-100/50">Last Monitoring</span>
                  <span className="font-medium text-ink dark:text-sand-50">15 Aug 2026</span>
                </div>
                <div>
                  <span className="block text-[10px] uppercase text-ink-soft dark:text-sand-100/50">Next Monitoring</span>
                  <span className="font-medium text-mangrove-700 dark:text-mangrove-300">15 Nov 2026</span>
                </div>
              </div>
            </motion.div>

            {/* 2. Data Sources (3 Cards) */}
            <div className="space-y-4">
              <h3 className="font-display text-base font-semibold text-ink dark:text-sand-50 tracking-tight">
                Data Sources
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Drone Survey */}
                <motion.div
                  variants={itemVariants}
                  className="p-5 rounded-2xl bg-white/80 dark:bg-[#0a232b]/80 border border-ocean-900/10 dark:border-sand-100/10 shadow-soft space-y-4 flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-2xl">🚁</span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20 font-medium">
                        Available
                      </span>
                    </div>
                    <h4 className="font-display text-sm font-semibold text-ink dark:text-sand-50">
                      Drone Survey
                    </h4>
                    <p className="text-xs text-ink-soft dark:text-sand-100/60">
                      High-resolution canopy photography and site orthomosaics.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => alert("Viewing Demo Drone Imagery Evidence...")}
                    className="inline-flex items-center gap-1.5 w-full justify-center px-3 py-2 rounded-xl bg-sand-50 dark:bg-[#071a20] border border-ocean-900/10 dark:border-sand-100/10 text-ink dark:text-sand-100 text-xs font-mono hover:bg-sand-100 dark:hover:bg-[#0a232b] transition-colors"
                  >
                    <Eye size={13} />
                    <span>View Evidence (Demo)</span>
                  </button>
                </motion.div>

                {/* Satellite Data */}
                <motion.div
                  variants={itemVariants}
                  className="p-5 rounded-2xl bg-white/80 dark:bg-[#0a232b]/80 border border-ocean-900/10 dark:border-sand-100/10 shadow-soft space-y-4 flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Satellite size={24} className="text-ocean-900 dark:text-sand-100" />
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20 font-medium">
                        Available
                      </span>
                    </div>
                    <h4 className="font-display text-sm font-semibold text-ink dark:text-sand-50">
                      Satellite Data
                    </h4>
                    <p className="text-xs text-ink-soft dark:text-sand-100/60">
                      Multispectral canopy density and area observations.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => alert("Viewing Demo Satellite Calibration Feed...")}
                    className="inline-flex items-center gap-1.5 w-full justify-center px-3 py-2 rounded-xl bg-sand-50 dark:bg-[#071a20] border border-ocean-900/10 dark:border-sand-100/10 text-ink dark:text-sand-100 text-xs font-mono hover:bg-sand-100 dark:hover:bg-[#0a232b] transition-colors"
                  >
                    <Eye size={13} />
                    <span>View Evidence (Demo)</span>
                  </button>
                </motion.div>

                {/* Field Survey */}
                <motion.div
                  variants={itemVariants}
                  className="p-5 rounded-2xl bg-white/80 dark:bg-[#0a232b]/80 border border-ocean-900/10 dark:border-sand-100/10 shadow-soft space-y-4 flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Trees size={24} className="text-mangrove-600 dark:text-mangrove-400" />
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20 font-medium">
                        Completed
                      </span>
                    </div>
                    <h4 className="font-display text-sm font-semibold text-ink dark:text-sand-50">
                      Field Survey
                    </h4>
                    <p className="text-xs text-ink-soft dark:text-sand-100/60">
                      On-ground plot measurements, species verification, and soil samples.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => alert("Viewing Demo Field Survey Notes...")}
                    className="inline-flex items-center gap-1.5 w-full justify-center px-3 py-2 rounded-xl bg-sand-50 dark:bg-[#071a20] border border-ocean-900/10 dark:border-sand-100/10 text-ink dark:text-sand-100 text-xs font-mono hover:bg-sand-100 dark:hover:bg-[#0a232b] transition-colors"
                  >
                    <Eye size={13} />
                    <span>View Evidence (Demo)</span>
                  </button>
                </motion.div>
              </div>
            </div>

            {/* 3. Latest Monitoring Results */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-display text-base font-semibold text-ink dark:text-sand-50 tracking-tight">
                  Latest Monitoring Results
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-mangrove-500/10 text-mangrove-700 dark:text-mangrove-300 border border-mangrove-500/20">
                  Demo / Sample Data
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <motion.div
                  variants={itemVariants}
                  className="p-5 rounded-2xl bg-white/80 dark:bg-[#0a232b]/80 border border-ocean-900/10 dark:border-sand-100/10 shadow-soft"
                >
                  <span className="block text-[10px] font-mono uppercase tracking-wider text-ink-soft dark:text-sand-100/50">
                    Mangrove Area
                  </span>
                  <span className="text-2xl font-display font-semibold text-ink dark:text-sand-50 block mt-1 font-mono">
                    10.2 <span className="text-xs text-ink-soft font-normal">ha</span>
                  </span>
                </motion.div>

                <motion.div
                  variants={itemVariants}
                  className="p-5 rounded-2xl bg-white/80 dark:bg-[#0a232b]/80 border border-ocean-900/10 dark:border-sand-100/10 shadow-soft"
                >
                  <span className="block text-[10px] font-mono uppercase tracking-wider text-ink-soft dark:text-sand-100/50">
                    Biomass Estimate
                  </span>
                  <span className="text-2xl font-display font-semibold text-ink dark:text-sand-50 block mt-1 font-mono">
                    1,350 <span className="text-xs text-ink-soft font-normal">tonnes</span>
                  </span>
                </motion.div>

                <motion.div
                  variants={itemVariants}
                  className="p-5 rounded-2xl bg-white/80 dark:bg-[#0a232b]/80 border border-ocean-900/10 dark:border-sand-100/10 shadow-soft"
                >
                  <span className="block text-[10px] font-mono uppercase tracking-wider text-ink-soft dark:text-sand-100/50">
                    Carbon Stock
                  </span>
                  <span className="text-2xl font-display font-semibold text-mangrove-700 dark:text-mangrove-300 block mt-1 font-mono">
                    1,420 <span className="text-xs text-ink-soft font-normal">tCO₂e</span>
                  </span>
                </motion.div>
              </div>
            </div>

            {/* 4. Verification Progress & Explanation */}
            <motion.div
              variants={itemVariants}
              className="rounded-[28px] border border-ocean-900/10 bg-white/80 dark:border-sand-100/10 dark:bg-[#0a232b]/80 backdrop-blur-md p-6 sm:p-8 shadow-soft space-y-6"
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-ocean-900/5 dark:border-sand-100/5 pb-4">
                <div className="flex items-center gap-2.5">
                  <ShieldCheck size={20} className="text-amber-600 dark:text-amber-400" />
                  <h3 className="font-display text-base font-semibold text-ink dark:text-sand-50 tracking-tight">
                    Verification
                  </h3>
                </div>

                <div className="flex items-center gap-3">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-medium bg-amber-500/10 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300 border border-amber-500/20">
                    <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
                    <span>🟡 Under Review</span>
                  </span>
                  <span className="text-xs font-mono text-ink-soft dark:text-sand-100/50">
                    Last Updated: 15 Sep 2026
                  </span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-sand-50/70 dark:bg-[#071a20]/60 border border-ocean-900/5 dark:border-sand-100/5 text-xs text-ink-soft dark:text-sand-100/70 leading-relaxed">
                Your monitoring data is being reviewed as part of the project verification process.
              </div>

              {/* Step Progress Indicator */}
              <div className="space-y-3 pt-2">
                <span className="block text-[10px] font-mono uppercase tracking-wider text-ink-soft dark:text-sand-100/50">
                  Verification Roadmap
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
                  {/* Step 1 */}
                  <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
                    <Check size={14} className="shrink-0" />
                    <div className="truncate">
                      <span className="block text-[9px] opacity-70">Step 1</span>
                      <span className="font-medium">Data Collection</span>
                    </div>
                  </div>

                  {/* Step 2 */}
                  <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
                    <Check size={14} className="shrink-0" />
                    <div className="truncate">
                      <span className="block text-[9px] opacity-70">Step 2</span>
                      <span className="font-medium">MRV Review</span>
                    </div>
                  </div>

                  {/* Step 3 (Current) */}
                  <div className="p-3 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-800 dark:text-amber-300 flex items-center gap-2 ring-1 ring-amber-500/30">
                    <Clock size={14} className="shrink-0 animate-spin" />
                    <div className="truncate">
                      <span className="block text-[9px] opacity-70">Step 3 (Active)</span>
                      <span className="font-bold">Regional Audit</span>
                    </div>
                  </div>

                  {/* Step 4 */}
                  <div className="p-3 rounded-xl bg-sand-50/50 dark:bg-[#071a20]/40 border border-ocean-900/5 dark:border-sand-100/5 text-ink-faint dark:text-sand-100/40 flex items-center gap-2">
                    <div className="h-3.5 w-3.5 rounded-full border border-current shrink-0" />
                    <div className="truncate">
                      <span className="block text-[9px] opacity-70">Step 4</span>
                      <span className="font-medium">Verified</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* STEP 4: CREDITS TAB CONTENT */}
        {activeTab === "credits" && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-8"
          >
            {/* 1. Prominent Carbon Credit Status Card */}
            <motion.div
              variants={itemVariants}
              className="rounded-[28px] border border-ocean-900/10 bg-white/80 dark:border-sand-100/10 dark:bg-[#0a232b]/80 backdrop-blur-md p-6 sm:p-8 shadow-soft space-y-6"
            >
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border-b border-ocean-900/5 dark:border-sand-100/5 pb-6">
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <Coins size={24} className="text-amber-600 dark:text-amber-400" />
                    <h2 className="font-display text-xl font-semibold text-ink dark:text-sand-50 tracking-tight">
                      Carbon Credits
                    </h2>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-medium bg-amber-500/10 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300 border border-amber-500/20">
                      <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
                      <span>🟡 Not Yet Issued</span>
                    </span>
                  </div>
                  <p className="text-xs text-ink-soft dark:text-sand-100/60 max-w-xl">
                    Carbon credits will be issued after the project completes the required monitoring and verification process.
                  </p>
                </div>

                <div className="flex items-center gap-4 w-full md:w-auto">
                  <button
                    type="button"
                    onClick={() => router.push("/farmer/marketplace")}
                    className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-ocean-900 text-sand-50 dark:bg-mangrove-500 dark:text-ink font-mono text-xs font-semibold uppercase tracking-wider hover:opacity-90 transition-opacity shadow-sm w-full md:w-auto"
                  >
                    <Store size={15} />
                    <span>View Marketplace</span>
                  </button>
                </div>
              </div>

              {/* Credit Counters */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-5 rounded-2xl bg-sand-50/70 dark:bg-[#071a20]/60 border border-ocean-900/5 dark:border-sand-100/5 flex items-center justify-between">
                  <div>
                    <span className="block text-[10px] font-mono uppercase tracking-wider text-ink-soft dark:text-sand-100/50">
                      Available Credits
                    </span>
                    <span className="text-3xl font-display font-semibold text-ink dark:text-sand-50 block mt-1 font-mono">
                      0
                    </span>
                  </div>
                  <Lock size={20} className="text-ink-faint dark:text-sand-100/30" />
                </div>

                <div className="p-5 rounded-2xl bg-sand-50/70 dark:bg-[#071a20]/60 border border-ocean-900/5 dark:border-sand-100/5 flex items-center justify-between">
                  <div>
                    <span className="block text-[10px] font-mono uppercase tracking-wider text-ink-soft dark:text-sand-100/50">
                      Issued Credits
                    </span>
                    <span className="text-3xl font-display font-semibold text-ink dark:text-sand-50 block mt-1 font-mono">
                      0
                    </span>
                  </div>
                  <Lock size={20} className="text-ink-faint dark:text-sand-100/30" />
                </div>
              </div>
            </motion.div>

            {/* 2. Credit Issuance Journey Progress Flow */}
            <motion.div
              variants={itemVariants}
              className="rounded-[28px] border border-ocean-900/10 bg-white/80 dark:border-sand-100/10 dark:bg-[#0a232b]/80 backdrop-blur-md p-6 sm:p-8 shadow-soft space-y-4"
            >
              <h3 className="font-display text-base font-semibold text-ink dark:text-sand-50 tracking-tight">
                Credit Issuance Journey
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs font-mono pt-2">
                {/* Step 1 */}
                <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-800 dark:text-emerald-300 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Check size={16} className="shrink-0" />
                    <div>
                      <span className="block text-[9px] opacity-70">Step 1</span>
                      <span className="font-semibold">MRV Monitoring</span>
                    </div>
                  </div>
                  <ArrowRight size={14} className="hidden sm:block opacity-40" />
                </div>

                {/* Step 2 */}
                <div className="p-4 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-800 dark:text-amber-300 flex items-center justify-between ring-1 ring-amber-500/30">
                  <div className="flex items-center gap-2">
                    <Clock size={16} className="shrink-0 animate-spin" />
                    <div>
                      <span className="block text-[9px] opacity-70">Step 2 (Active)</span>
                      <span className="font-bold">Verification</span>
                    </div>
                  </div>
                  <ArrowRight size={14} className="hidden sm:block opacity-40" />
                </div>

                {/* Step 3 */}
                <div className="p-4 rounded-2xl bg-sand-50/50 dark:bg-[#071a20]/40 border border-ocean-900/5 dark:border-sand-100/5 text-ink-faint dark:text-sand-100/40 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Lock size={15} className="shrink-0 opacity-60" />
                    <div>
                      <span className="block text-[9px] opacity-70">Step 3</span>
                      <span className="font-medium">Credit Issuance</span>
                    </div>
                  </div>
                  <ArrowRight size={14} className="hidden sm:block opacity-40" />
                </div>

                {/* Step 4 */}
                <div className="p-4 rounded-2xl bg-sand-50/50 dark:bg-[#071a20]/40 border border-ocean-900/5 dark:border-sand-100/5 text-ink-faint dark:text-sand-100/40 flex items-center gap-2">
                  <Lock size={15} className="shrink-0 opacity-60" />
                  <div>
                    <span className="block text-[9px] opacity-70">Step 4</span>
                    <span className="font-medium">Marketplace</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Grid Layout: Credit Details vs What Happens Next */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Credit Details (7 Cols) */}
              <motion.div
                variants={itemVariants}
                className="lg:col-span-7 rounded-[28px] border border-ocean-900/10 bg-white/80 dark:border-sand-100/10 dark:bg-[#0a232b]/80 backdrop-blur-md p-6 sm:p-8 shadow-soft space-y-4"
              >
                <div className="flex items-center gap-2.5 pb-3 border-b border-ocean-900/5 dark:border-sand-100/5">
                  <Building2 size={20} className="text-mangrove-600 dark:text-mangrove-400" />
                  <h3 className="font-display text-base font-semibold text-ink dark:text-sand-50 tracking-tight">
                    Credit Details
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
                  <div className="p-3 rounded-xl bg-sand-50/70 dark:bg-[#071a20]/60">
                    <span className="block text-[10px] uppercase text-ink-soft dark:text-sand-100/50">Project</span>
                    <span className="font-sans font-medium text-ink dark:text-sand-50 block mt-0.5">Mangrove Restoration Project</span>
                  </div>

                  <div className="p-3 rounded-xl bg-sand-50/70 dark:bg-[#071a20]/60">
                    <span className="block text-[10px] uppercase text-ink-soft dark:text-sand-100/50">Project ID</span>
                    <span className="font-medium text-mangrove-700 dark:text-mangrove-300 block mt-0.5">{projectId}</span>
                  </div>

                  <div className="p-3 rounded-xl bg-sand-50/70 dark:bg-[#071a20]/60">
                    <span className="block text-[10px] uppercase text-ink-soft dark:text-sand-100/50">Ecosystem</span>
                    <span className="font-sans font-medium text-ink dark:text-sand-50 block mt-0.5">Coastal Mangrove</span>
                  </div>

                  <div className="p-3 rounded-xl bg-sand-50/70 dark:bg-[#071a20]/60">
                    <span className="block text-[10px] uppercase text-ink-soft dark:text-sand-100/50">Verification Status</span>
                    <span className="font-medium text-amber-700 dark:text-amber-300 block mt-0.5">Pending Verification</span>
                  </div>

                  <div className="p-3 rounded-xl bg-sand-50/70 dark:bg-[#071a20]/60">
                    <span className="block text-[10px] uppercase text-ink-soft dark:text-sand-100/50">Credits Issued</span>
                    <span className="font-bold text-ink dark:text-sand-50 block mt-0.5">0</span>
                  </div>

                  <div className="p-3 rounded-xl bg-sand-50/70 dark:bg-[#071a20]/60">
                    <span className="block text-[10px] uppercase text-ink-soft dark:text-sand-100/50">Credit Type</span>
                    <span className="font-sans font-medium text-ink dark:text-sand-50 block mt-0.5">Carbon Credits</span>
                  </div>
                </div>
              </motion.div>

              {/* What Happens Next? (5 Cols) */}
              <motion.div
                variants={itemVariants}
                className="lg:col-span-5 rounded-[28px] border border-ocean-900/10 bg-white/80 dark:border-sand-100/10 dark:bg-[#0a232b]/80 backdrop-blur-md p-6 sm:p-8 shadow-soft space-y-4"
              >
                <div className="flex items-center gap-2.5 pb-3 border-b border-ocean-900/5 dark:border-sand-100/5">
                  <Info size={20} className="text-ocean-900 dark:text-sand-100" />
                  <h3 className="font-display text-base font-semibold text-ink dark:text-sand-50 tracking-tight">
                    What happens next?
                  </h3>
                </div>

                <p className="text-xs text-ink-soft dark:text-sand-100/70 leading-relaxed">
                  Once MRV data is reviewed and the project is verified, eligible carbon credits can be recorded and made available for the marketplace.
                </p>

                <div className="p-4 rounded-xl bg-sand-50/70 dark:bg-[#071a20]/60 border border-ocean-900/5 dark:border-sand-100/5 text-xs text-ink-soft dark:text-sand-100/60 italic leading-relaxed">
                  &quot;You will receive a notification as soon as regional auditors finalize the site verification assessment.&quot;
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </main>

      {/* Global Footer */}
      <Footer />
    </div>
  );
}
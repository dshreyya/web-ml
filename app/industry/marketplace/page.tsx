"use client";

import {
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";

import {
  CheckCircle2,
  Leaf,
  MapPin,
  Coins,
  ArrowRight,
  Loader2,
  AlertCircle,
  ShieldCheck,
  X,
  BarChart3,
  Image as ImageIcon,
  TreePine,
  Sprout,
  Waves,
  Award,
  FileCheck2,
  Download,
} from "lucide-react";

import { getSupabaseClient } from "@/lib/supabase";

interface Project {
  id: string;
  project_id: string;
  farmer_id: string;
  project_name: string;
  location: string | null;
  state: string | null;
  area_ha: number | null;
  available_credits: number | null;
  credit_price: number | null;
  status: string;
  created_at: string;
  updated_at: string;
}

interface BaselineReport {
  id: string;
  project_id: string;
  farmer_id: string;
  status: string;
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
  decimals = 4
) {
  return Number(value ?? 0).toLocaleString("en-IN", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

export default function IndustryMarketplacePage() {
  const router = useRouter();

  const [projects, setProjects] =
    useState<Project[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  /* ==========================================================
     BASELINE REPORT MODAL
     ========================================================== */

  const [selectedProject, setSelectedProject] =
    useState<Project | null>(null);

  const [baselineReport, setBaselineReport] =
    useState<BaselineReport | null>(null);

  const [reportLoading, setReportLoading] =
    useState(false);

  const [reportError, setReportError] =
    useState("");

  /*
   * ==========================================================
   * LOAD MARKETPLACE PROJECTS
   * ==========================================================
   *
   * Farmer
   *      ↓
   * PENDING_VERIFICATION
   *      ↓
   * Authority Review
   *      ↓
   * APPROVED
   *      ↓
   * Industry Marketplace
   *
   * Only APPROVED projects with available credits
   * are displayed here.
   */

  useEffect(() => {
    const loadProjects = async () => {
      try {
        setLoading(true);
        setError("");

        const supabase =
          getSupabaseClient();

        if (!supabase) {
          setError(
            "Unable to connect to Supabase."
          );
          return;
        }

        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          router.replace("/login");
          return;
        }

        /*
         * ======================================================
         * LOAD ONLY APPROVED PROJECTS
         * ======================================================
         */

        const {
          data,
          error: projectError,
        } = await supabase
          .from("mangrove_projects")
          .select(`
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
          `)
          .eq("status", "APPROVED")
          .gt("available_credits", 0)
          .order("created_at", {
            ascending: false,
          });

        if (projectError) {
          console.error(
            "Marketplace error:",
            projectError
          );

          setError(
            projectError.message
          );

          return;
        }

        setProjects(
          (data || []) as Project[]
        );
      } catch (err) {
        console.error(
          "Marketplace loading error:",
          err
        );

        setError(
          "Unable to load marketplace projects."
        );
      } finally {
        setLoading(false);
      }
    };

    loadProjects();
  }, [router]);

  /*
   * ==========================================================
   * BUY CREDITS
   * ==========================================================
   */

  const handleBuy = (
    project: Project
  ) => {
    router.push(
      `/industry/payment?project=${encodeURIComponent(
        project.project_id
      )}`
    );
  };

  /*
   * ==========================================================
   * VIEW PROJECT + LOAD BASELINE REPORT
   * ==========================================================
   */

  const handleViewProject = async (
    project: Project
  ) => {
    setSelectedProject(project);

    setBaselineReport(null);

    setReportError("");

    setReportLoading(true);

    try {
      const supabase =
        getSupabaseClient();

      if (!supabase) {
        setReportError(
          "Unable to connect to Supabase."
        );

        return;
      }

      /*
       * ======================================================
       * LOAD BASELINE REPORT FOR THIS PROJECT
       * ======================================================
       */

      const {
        data,
        error: baselineError,
      } = await supabase
        .from("baseline_reports")
        .select(`
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
        `)
        .eq(
          "project_id",
          project.project_id
        )
        .eq(
          "farmer_id",
          project.farmer_id
        )
        .eq(
          "status",
          "completed"
        )
        .order("id", {
          ascending: false,
        })
        .limit(1);

      if (baselineError) {
        console.error(
          "Baseline report error:",
          baselineError
        );

        setReportError(
          baselineError.message
        );

        return;
      }

      const report =
        data && data.length > 0
          ? (data[0] as BaselineReport)
          : null;

      if (!report) {
        setReportError(
          "Baseline report is not available for this project."
        );

        return;
      }

      setBaselineReport(report);
    } catch (err) {
      console.error(
        "Baseline report loading error:",
        err
      );

      setReportError(
        err instanceof Error
          ? err.message
          : "Unable to load baseline report."
      );
    } finally {
      setReportLoading(false);
    }
  };

  /*
   * ==========================================================
   * DOWNLOAD BASELINE EXCEL REPORT
   * ==========================================================
   */

  const handleDownloadReport = () => {
    window.location.href =
      "/api/aiml/report";
  };

  /*
   * ==========================================================
   * CLOSE REPORT
   * ==========================================================
   */

  const closeReport = () => {
    setSelectedProject(null);

    setBaselineReport(null);

    setReportError("");

    setReportLoading(false);
  };

  return (
    <main className="min-h-screen bg-sand-50 dark:bg-[#06171d]">

      <section className="mx-auto max-w-7xl px-6 pt-12 pb-8">

        {/* ================================================== */}
        {/* HEADER */}
        {/* ================================================== */}

        <div className="mb-8">

          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-mangrove-600/20 bg-mangrove-50 px-4 py-2 font-mono text-xs text-mangrove-700 dark:bg-mangrove-900/20 dark:text-mangrove-300">

            <Leaf size={15} />

            BLUE CARBON PROJECTS

          </div>

          <h1 className="font-display text-5xl font-semibold text-ink dark:text-sand-50">

            Blue Carbon Marketplace

          </h1>

          <p className="mt-4 max-w-2xl text-base text-ink-soft dark:text-sand-200/70">

            Explore verified mangrove restoration projects
            and purchase blockchain-backed carbon credits.

          </p>

        </div>

        {/* ================================================== */}
        {/* LOADING */}
        {/* ================================================== */}

        {loading && (
          <div className="flex min-h-[300px] items-center justify-center">

            <div className="flex items-center gap-3 text-sm text-ink-soft dark:text-sand-200/70">

              <Loader2
                size={20}
                className="animate-spin"
              />

              Loading approved marketplace projects...

            </div>

          </div>
        )}

        {/* ================================================== */}
        {/* ERROR */}
        {/* ================================================== */}

        {!loading && error && (
          <div className="rounded-[28px] border border-red-500/20 bg-red-50 p-6 dark:bg-red-950/20">

            <div className="flex items-start gap-3">

              <AlertCircle
                size={20}
                className="mt-0.5 text-red-600 dark:text-red-400"
              />

              <div>

                <h2 className="font-semibold text-red-800 dark:text-red-300">

                  Unable to load marketplace

                </h2>

                <p className="mt-1 text-sm text-red-700 dark:text-red-300/80">

                  {error}

                </p>

              </div>

            </div>

          </div>
        )}

        {/* ================================================== */}
        {/* NO PROJECTS */}
        {/* ================================================== */}

        {!loading &&
          !error &&
          projects.length === 0 && (
            <div className="rounded-[28px] border border-ocean-900/10 bg-white p-10 text-center shadow-card dark:border-sand-100/10 dark:bg-[#0a2027]">

              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-mangrove-100 text-mangrove-700 dark:bg-mangrove-900/30 dark:text-mangrove-300">

                <Leaf size={25} />

              </div>

              <h2 className="mt-5 font-display text-2xl font-semibold text-ink dark:text-sand-50">

                No verified projects available

              </h2>

              <p className="mx-auto mt-3 max-w-md text-sm text-ink-soft dark:text-sand-200/70">

                Farmer projects will appear here only after
                they complete baseline analysis and receive
                Authority approval.

              </p>

            </div>
          )}

        {/* ================================================== */}
        {/* PROJECTS */}
        {/* ================================================== */}

        {!loading &&
          !error &&
          projects.length > 0 && (
            <div className="grid gap-6 md:grid-cols-2">

              {projects.map(
                (project) => (

                  <div
                    key={project.id}
                    className="rounded-[28px] border border-ocean-900/10 bg-white p-6 shadow-card dark:border-sand-100/10 dark:bg-[#0a2027]"
                  >

                    {/* ======================================== */}
                    {/* ICON + STATUS */}
                    {/* ======================================== */}

                    <div className="mb-5 flex items-center justify-between">

                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-mangrove-100 text-mangrove-700 dark:bg-mangrove-900/30 dark:text-mangrove-300">

                        <Leaf size={23} />

                      </div>

                      <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300">

                        <ShieldCheck size={13} />

                        Authority Approved

                      </span>

                    </div>

                    {/* ======================================== */}
                    {/* PROJECT NAME */}
                    {/* ======================================== */}

                    <h2 className="font-display text-2xl font-semibold text-ink dark:text-sand-50">

                      {project.project_name}

                    </h2>

                    {/* ======================================== */}
                    {/* PROJECT ID */}
                    {/* ======================================== */}

                    <p className="mt-2 font-mono text-xs text-ink-soft dark:text-sand-200/50">

                      Project ID:{" "}
                      {project.project_id}

                    </p>

                    {/* ======================================== */}
                    {/* LOCATION */}
                    {/* ======================================== */}

                    <div className="mt-3 flex items-center gap-2 text-sm text-ink-soft dark:text-sand-200/70">

                      <MapPin size={16} />

                      {project.location ||
                        project.state ||
                        "Location not available"}

                    </div>

                    {/* ======================================== */}
                    {/* DETAILS */}
                    {/* ======================================== */}

                    <div className="mt-6 grid grid-cols-3 gap-3">

                      {/* AREA */}

                      <div className="rounded-2xl bg-sand-50 p-4 dark:bg-[#071a20]">

                        <p className="text-xs text-ink-soft dark:text-sand-200/60">

                          Area

                        </p>

                        <p className="mt-1 font-semibold text-ink dark:text-sand-50">

                          {formatNumber(
                            project.area_ha,
                            4
                          )}{" "}
                          ha

                        </p>

                      </div>

                      {/* CREDITS */}

                      <div className="rounded-2xl bg-sand-50 p-4 dark:bg-[#071a20]">

                        <p className="text-xs text-ink-soft dark:text-sand-200/60">

                          Credits

                        </p>

                        <p className="mt-1 font-semibold text-ink dark:text-sand-50">

                          {formatNumber(
                            project.available_credits,
                            2
                          )}

                        </p>

                      </div>

                      {/* PRICE */}

                      <div className="rounded-2xl bg-sand-50 p-4 dark:bg-[#071a20]">

                        <p className="text-xs text-ink-soft dark:text-sand-200/60">

                          Price

                        </p>

                        <p className="mt-1 font-semibold text-ink dark:text-sand-50">

                          ₹
                          {formatNumber(
                            project.credit_price,
                            0
                          )}

                        </p>

                      </div>

                    </div>

                    {/* ======================================== */}
                    {/* APPROVAL INFO */}
                    {/* ======================================== */}

                    <div className="mt-5 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-3">

                      <div className="flex items-start gap-2">

                        <ShieldCheck
                          size={15}
                          className="mt-0.5 shrink-0 text-emerald-700 dark:text-emerald-300"
                        />

                        <p className="text-xs leading-relaxed text-emerald-800 dark:text-emerald-300">

                          This project has been approved by
                          the Authority and is eligible for
                          marketplace purchase.

                        </p>

                      </div>

                    </div>

                    {/* ======================================== */}
                    {/* BUTTONS */}
                    {/* ======================================== */}

                    <div className="mt-6 flex gap-3">

                      <button
                        type="button"
                        onClick={() =>
                          handleViewProject(
                            project
                          )
                        }
                        className="flex flex-1 items-center justify-center gap-2 rounded-2xl border border-ocean-900/10 px-4 py-3 text-sm font-semibold text-ink transition hover:bg-sand-50 dark:border-sand-100/10 dark:text-sand-50 dark:hover:bg-[#071a20]"
                      >

                        <FileCheck2 size={16} />

                        View Project

                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          handleBuy(project)
                        }
                        className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-ocean-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-ocean-800"
                      >

                        <Coins size={17} />

                        Buy Credits

                        <ArrowRight size={16} />

                      </button>

                    </div>

                  </div>

                )
              )}

            </div>
          )}

      </section>

      {/* ================================================== */}
      {/* BASELINE REPORT MODAL */}
      {/* ================================================== */}

      {selectedProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">

          {/* BACKDROP */}

          <button
            type="button"
            aria-label="Close baseline report"
            onClick={closeReport}
            className="absolute inset-0 cursor-default bg-black/50 backdrop-blur-sm"
          />

          {/* MODAL */}

          <div className="relative max-h-[90vh] w-full max-w-5xl overflow-y-auto rounded-[28px] border border-ocean-900/10 bg-sand-50 shadow-2xl dark:border-sand-100/10 dark:bg-[#071a20]">

            {/* ==================================================
                MODAL HEADER
               ================================================== */}

            <div className="sticky top-0 z-10 border-b border-ocean-900/10 bg-sand-50/95 p-5 backdrop-blur-md dark:border-sand-100/10 dark:bg-[#071a20]/95 sm:p-6">

              <div className="flex items-start justify-between gap-4">

                <div>

                  <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-emerald-100 px-3 py-1.5 text-xs font-semibold text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300">

                    <ShieldCheck size={14} />

                    Authority Approved

                  </div>

                  <h2 className="font-display text-2xl font-semibold text-ink dark:text-sand-50">

                    {selectedProject.project_name}

                  </h2>

                  <p className="mt-1 font-mono text-xs text-ink-soft dark:text-sand-200/50">

                    Project ID:{" "}
                    {selectedProject.project_id}

                  </p>

                </div>

                <button
                  type="button"
                  onClick={closeReport}
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-ocean-900/10 text-ink-soft hover:bg-sand-100 dark:border-sand-100/10 dark:text-sand-100/60 dark:hover:bg-[#0a232b]"
                >

                  <X size={18} />

                </button>

              </div>

            </div>

            {/* ==================================================
                MODAL CONTENT
               ================================================== */}

            <div className="space-y-6 p-5 sm:p-6">

              {/* PROJECT INFO */}

              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">

                <div className="rounded-2xl border border-ocean-900/10 bg-white p-5 dark:border-sand-100/10 dark:bg-[#0a2027]">

                  <div className="flex items-center gap-2 text-xs text-ink-soft dark:text-sand-200/60">

                    <MapPin size={15} />

                    Location

                  </div>

                  <p className="mt-2 text-sm font-semibold text-ink dark:text-sand-50">

                    {selectedProject.location ||
                      selectedProject.state ||
                      "Location not available"}

                  </p>

                </div>

                <div className="rounded-2xl border border-ocean-900/10 bg-white p-5 dark:border-sand-100/10 dark:bg-[#0a2027]">

                  <div className="flex items-center gap-2 text-xs text-ink-soft dark:text-sand-200/60">

                    <Leaf size={15} />

                    Project Area

                  </div>

                  <p className="mt-2 font-mono text-lg font-semibold text-ink dark:text-sand-50">

                    {formatNumber(
                      selectedProject.area_ha,
                      6
                    )}{" "}
                    ha

                  </p>

                </div>

                <div className="rounded-2xl border border-ocean-900/10 bg-white p-5 dark:border-sand-100/10 dark:bg-[#0a2027]">

                  <div className="flex items-center gap-2 text-xs text-ink-soft dark:text-sand-200/60">

                    <Coins size={15} />

                    Available Credits

                  </div>

                  <p className="mt-2 font-mono text-lg font-semibold text-ink dark:text-sand-50">

                    {formatNumber(
                      selectedProject.available_credits,
                      4
                    )}

                  </p>

                </div>

              </div>

              {/* ==================================================
                  BASELINE REPORT
                 ================================================== */}

              <div className="rounded-[28px] border border-ocean-900/10 bg-white p-6 dark:border-sand-100/10 dark:bg-[#0a2027] sm:p-8">

                {/* REPORT HEADER */}

                <div className="flex flex-col gap-4 border-b border-ocean-900/10 pb-4 dark:border-sand-100/10 sm:flex-row sm:items-center sm:justify-between">

                  <div className="flex items-center gap-2.5">

                    <BarChart3
                      size={21}
                      className="text-mangrove-600 dark:text-mangrove-400"
                    />

                    <div>

                      <h3 className="font-display text-lg font-semibold text-ink dark:text-sand-50">

                        AI Baseline Report

                      </h3>

                      <p className="mt-1 text-xs text-ink-soft dark:text-sand-200/60">

                        BlueCarbon Nexus YOLOv8 + IPCC-based
                        carbon assessment

                      </p>

                    </div>

                  </div>

                  {/* ==================================================
                      DOWNLOAD EXCEL BUTTON
                     ================================================== */}

                  <button
                    type="button"
                    onClick={
                      handleDownloadReport
                    }
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-ocean-900 px-5 py-3 text-xs font-semibold text-white transition hover:bg-ocean-800 dark:bg-mangrove-500 dark:text-ink dark:hover:bg-mangrove-400"
                  >

                    <Download size={16} />

                    Download Excel Report

                  </button>

                </div>

                {/* REPORT LOADING */}

                {reportLoading && (
                  <div className="flex min-h-[240px] items-center justify-center">

                    <div className="flex items-center gap-3 text-sm text-ink-soft dark:text-sand-200/70">

                      <Loader2
                        size={20}
                        className="animate-spin"
                      />

                      Loading baseline report...

                    </div>

                  </div>
                )}

                {/* REPORT ERROR */}

                {!reportLoading &&
                  reportError && (
                    <div className="mt-6 rounded-2xl border border-amber-500/20 bg-amber-500/10 p-5">

                      <div className="flex items-start gap-3">

                        <AlertCircle
                          size={18}
                          className="mt-0.5 text-amber-700 dark:text-amber-300"
                        />

                        <div>

                          <h4 className="text-sm font-semibold text-amber-800 dark:text-amber-300">

                            Baseline report unavailable

                          </h4>

                          <p className="mt-1 text-xs leading-relaxed text-amber-700 dark:text-amber-300/70">

                            {reportError}

                          </p>

                        </div>

                      </div>

                    </div>
                  )}

                {/* REPORT */}

                {!reportLoading &&
                  !reportError &&
                  baselineReport && (
                    <div className="mt-6">

                      {/* ==================================================
                          TOP METRICS
                         ================================================== */}

                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">

                        {/* IMAGES */}

                        <ReportMetric
                          icon={
                            <ImageIcon
                              size={18}
                            />
                          }
                          label="Images Processed"
                          value={formatNumber(
                            baselineReport.images_processed,
                            0
                          )}
                        />

                        {/* DETECTIONS */}

                        <ReportMetric
                          icon={
                            <TreePine
                              size={18}
                            />
                          }
                          label="Mangrove Detections"
                          value={formatNumber(
                            baselineReport.total_detections,
                            0
                          )}
                        />

                        {/* AREA */}

                        <ReportMetric
                          icon={
                            <MapPin
                              size={18}
                            />
                          }
                          label="Detected Area"
                          value={`${formatNumber(
                            baselineReport.area_ha,
                            6
                          )} ha`}
                        />

                        {/* CO2E */}

                        <ReportMetric
                          icon={
                            <Waves
                              size={18}
                            />
                          }
                          label="CO₂ Equivalent"
                          value={`${formatNumber(
                            baselineReport.total_co2e,
                            4
                          )} tCO₂e`}
                        />

                      </div>

                      {/* ==================================================
                          CARBON BREAKDOWN
                         ================================================== */}

                      <div className="mt-8">

                        <div className="flex items-center gap-2">

                          <Award
                            size={19}
                            className="text-mangrove-600 dark:text-mangrove-400"
                          />

                          <h4 className="font-display text-base font-semibold text-ink dark:text-sand-50">

                            Carbon Breakdown

                          </h4>

                        </div>

                        <div className="mt-4 space-y-3">

                          <CarbonRow
                            label="Above-ground carbon"
                            value={`${formatNumber(
                              baselineReport.agb_tC,
                              4
                            )} tC`}
                          />

                          <CarbonRow
                            label="Below-ground carbon"
                            value={`${formatNumber(
                              baselineReport.bgb_tC,
                              4
                            )} tC`}
                          />

                          <CarbonRow
                            label="Soil organic carbon"
                            value={`${formatNumber(
                              baselineReport.soc_tC,
                              4
                            )} tC`}
                          />

                          <CarbonRow
                            label="Total Carbon"
                            value={`${formatNumber(
                              baselineReport.total_carbon_tC,
                              4
                            )} tC`}
                            highlighted
                          />

                          <CarbonRow
                            label="CO₂ Equivalent"
                            value={`${formatNumber(
                              baselineReport.total_co2e,
                              4
                            )} tCO₂e`}
                            highlighted
                          />

                        </div>

                      </div>

                      {/* ==================================================
                          REPORT STATUS
                         ================================================== */}

                      <div className="mt-8 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-4">

                        <div className="flex items-start gap-3">

                          <CheckCircle2
                            size={18}
                            className="mt-0.5 shrink-0 text-emerald-700 dark:text-emerald-300"
                          />

                          <div>

                            <h4 className="text-sm font-semibold text-emerald-800 dark:text-emerald-300">

                              Verified Project Baseline

                            </h4>

                            <p className="mt-1 text-xs leading-relaxed text-emerald-700 dark:text-emerald-300/70">

                              This baseline report belongs to
                              the approved project and can be
                              reviewed before purchasing carbon
                              credits.

                            </p>

                          </div>

                        </div>

                      </div>

                      {/* ==================================================
                          METHODOLOGY
                         ================================================== */}

                      <div className="mt-6 rounded-2xl border border-ocean-900/10 bg-sand-50 p-5 dark:border-sand-100/10 dark:bg-[#071a20]">

                        <div className="flex items-center gap-2">

                          <Sprout
                            size={18}
                            className="text-mangrove-600 dark:text-mangrove-400"
                          />

                          <h4 className="font-display text-base font-semibold text-ink dark:text-sand-50">

                            Methodology

                          </h4>

                        </div>

                        <p className="mt-3 text-xs leading-relaxed text-ink-soft dark:text-sand-200/70">

                          The baseline dataset was processed using
                          the BlueCarbon Nexus YOLOv8 mangrove
                          detection pipeline. Carbon estimation uses
                          the IPCC-based methodology stored with the
                          baseline assessment.

                        </p>

                      </div>

                    </div>
                  )}

              </div>

              {/* ==================================================
                  BUY BUTTON
                 ================================================== */}

              <div className="flex justify-end">

                <button
                  type="button"
                  onClick={() =>
                    handleBuy(
                      selectedProject
                    )
                  }
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-ocean-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-ocean-800 dark:bg-mangrove-500 dark:text-ink"
                >

                  <Coins size={17} />

                  Buy Credits

                  <ArrowRight size={16} />

                </button>

              </div>

            </div>

          </div>

        </div>
      )}

    </main>
  );
}

/* ============================================================
   REPORT METRIC
   ============================================================ */

function ReportMetric({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl bg-sand-50 p-5 dark:bg-[#071a20]">

      <div className="flex items-center gap-2 text-xs text-ink-soft dark:text-sand-200/60">

        <span className="text-mangrove-600 dark:text-mangrove-400">

          {icon}

        </span>

        {label}

      </div>

      <p className="mt-2 font-mono text-xl font-semibold text-ink dark:text-sand-50">

        {value}

      </p>

    </div>
  );
}

/* ============================================================
   CARBON ROW
   ============================================================ */

function CarbonRow({
  label,
  value,
  highlighted = false,
}: {
  label: string;
  value: string;
  highlighted?: boolean;
}) {
  return (
    <div
      className={`flex items-center justify-between gap-4 rounded-xl p-4 ${
        highlighted
          ? "border border-mangrove-500/20 bg-mangrove-500/10"
          : "bg-sand-50 dark:bg-[#071a20]"
      }`}
    >

      <span
        className={`text-sm ${
          highlighted
            ? "font-semibold text-mangrove-900 dark:text-mangrove-200"
            : "text-ink-soft dark:text-sand-100/70"
        }`}
      >
        {label}
      </span>

      <span
        className={`font-mono text-sm ${
          highlighted
            ? "font-bold text-mangrove-800 dark:text-mangrove-200"
            : "font-semibold text-ink dark:text-sand-50"
        }`}
      >
        {value}
      </span>

    </div>
  );
}
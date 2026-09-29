"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  CheckCircle2,
  XCircle,
  Eye,
  FileCheck,
  MapPin,
  Calendar,
  Layers,
  Search,
  Filter,
  Globe,
  AlertTriangle,
  Award,
  Send,
  Building2,
  Leaf,
  RefreshCw,
  Clock,
  User,
  Coins,
} from "lucide-react";

import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { getSupabaseClient } from "@/lib/supabase";

/* ============================================================
   DATABASE STATUS
   ============================================================ */

type DatabaseProjectStatus =
  | "DRAFT"
  | "PENDING"
  | "PENDING_VERIFICATION"
  | "APPROVED"
  | "REJECTED";

/* ============================================================
   UI FILTER
   ============================================================ */

type FilterTab =
  | "All"
  | "Pending Review"
  | "Approved"
  | "Rejected";

/* ============================================================
   PROJECT TYPE
   ============================================================ */

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
  status: DatabaseProjectStatus;
  created_at: string | null;
  updated_at: string | null;
}

/* ============================================================
   BASELINE REPORT TYPE
   ============================================================ */

interface BaselineReport {
  id?: string;
  project_id?: string;
  farmer_id?: string;
  status?: string;
  images_processed?: number;
  total_detections?: number;
  total_area_m2?: number;
  area_ha?: number;
  agb_tC?: number;
  bgb_tC?: number;
  soc_tC?: number;
  total_carbon_tC?: number;
  total_co2e?: number;
}

/* ============================================================
   HELPERS
   ============================================================ */

function getStatusLabel(
  status: DatabaseProjectStatus
): string {
  switch (status) {
    case "PENDING_VERIFICATION":
      return "Pending Review";

    case "APPROVED":
      return "Approved";

    case "REJECTED":
      return "Rejected";

    case "DRAFT":
      return "Draft";

    case "PENDING":
      return "Pending";

    default:
      return status;
  }
}

function formatNumber(
  value: number | null | undefined,
  digits = 2
) {
  return Number(value ?? 0).toLocaleString(
    "en-IN",
    {
      minimumFractionDigits: digits,
      maximumFractionDigits: digits,
    }
  );
}

function formatDate(
  value: string | null | undefined
) {
  if (!value) {
    return "Not available";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Not available";
  }

  return date.toLocaleDateString(
    "en-IN",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }
  );
}

/* ============================================================
   PAGE
   ============================================================ */

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<Project[]>(
    []
  );

  const [activeTab, setActiveTab] =
    useState<FilterTab>("All");

  const [searchQuery, setSearchQuery] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  const [refreshing, setRefreshing] =
    useState(false);

  const [actionLoading, setActionLoading] =
    useState<string | null>(null);

  const [message, setMessage] =
    useState("");

  const [errorMessage, setErrorMessage] =
    useState("");

  const [selectedProject, setSelectedProject] =
    useState<Project | null>(null);

  const [baselineReport, setBaselineReport] =
    useState<BaselineReport | null>(null);

  const [reportLoading, setReportLoading] =
    useState(false);

  const supabase =
    getSupabaseClient();

  /* ==========================================================
     FETCH PROJECTS
     ========================================================== */

  const fetchProjects = async (
    showRefreshLoader = false
  ) => {
    if (!supabase) {
      setErrorMessage(
        "Supabase client is not available."
      );
      setLoading(false);
      return;
    }

    if (showRefreshLoader) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    setErrorMessage("");

    try {
      /* --------------------------------------------------------
         CHECK AUTHENTICATED USER
         -------------------------------------------------------- */

      const {
        data: sessionData,
        error: sessionError,
      } =
        await supabase.auth.getSession();

      if (sessionError) {
        throw new Error(
          sessionError.message
        );
      }

      const user =
        sessionData.session?.user;

      if (!user) {
        throw new Error(
          "Authority session not found. Please login again."
        );
      }

      /* --------------------------------------------------------
         OPTIONAL ROLE CHECK

         Your project currently uses admin as Authority role.
         authority is also accepted.
         -------------------------------------------------------- */

      const role =
        user.user_metadata?.role ??
        user.app_metadata?.role ??
        null;

      if (
        role &&
        role !== "admin" &&
        role !== "authority"
      ) {
        throw new Error(
          "You are not authorized to access the Authority project review page."
        );
      }

      /* --------------------------------------------------------
         GET PROJECTS
         -------------------------------------------------------- */

      const {
        data,
        error,
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
        .in(
          "status",
          [
            "PENDING_VERIFICATION",
            "APPROVED",
            "REJECTED",
          ]
        )
        .order(
          "created_at",
          {
            ascending: false,
          }
        );

      if (error) {
        throw new Error(
          error.message
        );
      }

      setProjects(
        (data ?? []) as Project[]
      );
    } catch (error) {
      console.error(
        "Authority project fetch error:",
        error
      );

      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Unable to load projects."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  /* ==========================================================
     INITIAL LOAD
     ========================================================== */

  useEffect(() => {
    fetchProjects();
  }, []);

  /* ==========================================================
     COUNTS
     ========================================================== */

  const counts = useMemo(() => {
    return {
      all: projects.length,

      pending: projects.filter(
        (project) =>
          project.status ===
          "PENDING_VERIFICATION"
      ).length,

      approved: projects.filter(
        (project) =>
          project.status ===
          "APPROVED"
      ).length,

      rejected: projects.filter(
        (project) =>
          project.status ===
          "REJECTED"
      ).length,
    };
  }, [projects]);

  /* ==========================================================
     FILTERED PROJECTS
     ========================================================== */

  const filteredProjects =
    useMemo(() => {
      const query =
        searchQuery
          .trim()
          .toLowerCase();

      return projects.filter(
        (project) => {
          /* ----------------------------------------------------
             TAB FILTER
             ---------------------------------------------------- */

          if (
            activeTab ===
            "Pending Review" &&
            project.status !==
              "PENDING_VERIFICATION"
          ) {
            return false;
          }

          if (
            activeTab === "Approved" &&
            project.status !==
              "APPROVED"
          ) {
            return false;
          }

          if (
            activeTab === "Rejected" &&
            project.status !==
              "REJECTED"
          ) {
            return false;
          }

          /* ----------------------------------------------------
             SEARCH
             ---------------------------------------------------- */

          if (!query) {
            return true;
          }

          const searchableText = [
            project.project_id,
            project.project_name,
            project.location ?? "",
            project.state ?? "",
            project.farmer_id,
            project.status,
          ]
            .join(" ")
            .toLowerCase();

          return searchableText.includes(
            query
          );
        }
      );
    }, [
      projects,
      activeTab,
      searchQuery,
    ]);

  /* ==========================================================
     LOAD BASELINE REPORT
     ========================================================== */

  const openProject = async (
    project: Project
  ) => {
    setSelectedProject(project);
    setBaselineReport(null);
    setReportLoading(true);
    setErrorMessage("");

    if (!supabase) {
      setReportLoading(false);
      return;
    }

    try {
      const {
        data,
        error,
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
        .eq(
          "project_id",
          project.project_id
        )
        .eq(
          "farmer_id",
          project.farmer_id
        )
        .order(
          "id",
          {
            ascending: false,
          }
        )
        .limit(1)
        .maybeSingle();

      if (error) {
        console.error(
          "Baseline report fetch error:",
          error
        );
      } else {
        setBaselineReport(
          data as BaselineReport | null
        );
      }
    } catch (error) {
      console.error(
        "Baseline report error:",
        error
      );
    } finally {
      setReportLoading(false);
    }
  };

  /* ==========================================================
     APPROVE PROJECT
     ========================================================== */

  const handleApprove = async (
    project: Project
  ) => {
    if (!supabase) {
      setErrorMessage(
        "Supabase client is not available."
      );
      return;
    }

    if (
      project.status !==
      "PENDING_VERIFICATION"
    ) {
      return;
    }

    const confirmed =
      window.confirm(
        `Approve project "${project.project_name}"?`
      );

    if (!confirmed) {
      return;
    }

    setActionLoading(project.id);
    setMessage("");
    setErrorMessage("");

    try {
      const {
        error,
      } = await supabase
        .from("mangrove_projects")
        .update({
          status: "APPROVED",
          updated_at:
            new Date().toISOString(),
        })
        .eq(
          "id",
          project.id
        )
        .eq(
          "status",
          "PENDING_VERIFICATION"
        );

      if (error) {
        throw new Error(
          error.message
        );
      }

      setProjects(
        (previous) =>
          previous.map(
            (item) =>
              item.id ===
              project.id
                ? {
                    ...item,
                    status:
                      "APPROVED",
                    updated_at:
                      new Date().toISOString(),
                  }
                : item
          )
      );

      setSelectedProject(
        (previous) =>
          previous?.id ===
          project.id
            ? {
                ...previous,
                status:
                  "APPROVED",
                updated_at:
                  new Date().toISOString(),
              }
            : previous
      );

      setMessage(
        `Project ${project.project_id} approved successfully. It can now appear in the Industry Marketplace.`
      );
    } catch (error) {
      console.error(
        "Approve project error:",
        error
      );

      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Unable to approve project."
      );
    } finally {
      setActionLoading(null);
    }
  };

  /* ==========================================================
     REJECT PROJECT
     ========================================================== */

  const handleReject = async (
    project: Project
  ) => {
    if (!supabase) {
      setErrorMessage(
        "Supabase client is not available."
      );
      return;
    }

    if (
      project.status !==
      "PENDING_VERIFICATION"
    ) {
      return;
    }

    const confirmed =
      window.confirm(
        `Reject project "${project.project_name}"?`
      );

    if (!confirmed) {
      return;
    }

    setActionLoading(project.id);
    setMessage("");
    setErrorMessage("");

    try {
      /*
       * NOTE:
       * The current mangrove_projects schema provided
       * contains status but does not include a
       * rejection_reason column.
       *
       * Therefore only the status is stored here.
       */

      const {
        error,
      } = await supabase
        .from("mangrove_projects")
        .update({
          status: "REJECTED",
          updated_at:
            new Date().toISOString(),
        })
        .eq(
          "id",
          project.id
        )
        .eq(
          "status",
          "PENDING_VERIFICATION"
        );

      if (error) {
        throw new Error(
          error.message
        );
      }

      setProjects(
        (previous) =>
          previous.map(
            (item) =>
              item.id ===
              project.id
                ? {
                    ...item,
                    status:
                      "REJECTED",
                    updated_at:
                      new Date().toISOString(),
                  }
                : item
          )
      );

      setSelectedProject(
        (previous) =>
          previous?.id ===
          project.id
            ? {
                ...previous,
                status:
                  "REJECTED",
                updated_at:
                  new Date().toISOString(),
              }
            : previous
      );

      setMessage(
        `Project ${project.project_id} has been rejected.`
      );
    } catch (error) {
      console.error(
        "Reject project error:",
        error
      );

      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Unable to reject project."
      );
    } finally {
      setActionLoading(null);
    }
  };

  /* ==========================================================
     STATUS STYLE
     ========================================================== */

  const getStatusClasses = (
    status: DatabaseProjectStatus
  ) => {
    switch (status) {
      case "APPROVED":
        return {
          wrapper:
            "bg-emerald-500/10 border-emerald-500/20 text-emerald-700 dark:text-emerald-300",
          dot:
            "bg-emerald-500",
        };

      case "REJECTED":
        return {
          wrapper:
            "bg-red-500/10 border-red-500/20 text-red-700 dark:text-red-300",
          dot:
            "bg-red-500",
        };

      case "PENDING_VERIFICATION":
        return {
          wrapper:
            "bg-amber-500/10 border-amber-500/20 text-amber-700 dark:text-amber-300",
          dot:
            "bg-amber-500",
        };

      default:
        return {
          wrapper:
            "bg-sand-100/70 border-ocean-900/10 text-ink-soft dark:bg-[#071a20]/50 dark:border-sand-100/10 dark:text-sand-100/60",
          dot:
            "bg-gray-400",
        };
    }
  };

  /* ==========================================================
     LOADING
     ========================================================== */

  if (loading) {
    return (
      <div className="min-h-screen bg-sand-50 dark:bg-[#071a20]">
        <Navbar />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="rounded-[28px] border border-ocean-900/10 bg-white/80 dark:border-sand-100/10 dark:bg-[#0a232b]/80 p-10 text-center">
            <RefreshCw
              size={28}
              className="mx-auto animate-spin text-mangrove-600"
            />

            <p className="mt-4 text-sm font-medium text-ink dark:text-sand-50">
              Loading Authority project reviews...
            </p>

            <p className="mt-2 text-xs text-ink-soft dark:text-sand-100/60">
              Fetching projects submitted for verification.
            </p>
          </div>
        </main>

        <Footer />
      </div>
    );
  }

  /* ==========================================================
     MAIN UI
     ========================================================== */

  return (
    <div className="min-h-screen bg-sand-50 dark:bg-[#071a20]">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* ==================================================
            BACK
           ================================================== */}

        <Link
          href="/admin/dashboard"
          className="inline-flex items-center gap-2 mb-6 text-xs font-mono text-ink-soft dark:text-sand-100/60 hover:text-ink dark:hover:text-sand-50 transition-colors"
        >
          <ArrowLeft size={15} />

          <span>
            Back to Authority Dashboard
          </span>
        </Link>

        {/* ==================================================
            HEADER
           ================================================== */}

        <motion.div
          initial={{
            opacity: 0,
            y: 12,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.45,
          }}
          className="rounded-[28px] border border-ocean-900/10 bg-white/80 dark:border-sand-100/10 dark:bg-[#0a232b]/80 backdrop-blur-md p-6 sm:p-8 shadow-soft mb-8"
        >
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-[10px] uppercase tracking-wider font-mono text-mangrove-700 dark:text-mangrove-300">
                <ShieldCheckIcon />

                <span>
                  Authority Verification
                </span>
              </div>

              <h1 className="font-display text-2xl sm:text-3xl font-semibold text-ink dark:text-sand-50 tracking-tight">
                Mangrove Project Review
              </h1>

              <p className="text-sm text-ink-soft dark:text-sand-100/60 max-w-2xl leading-relaxed">
                Review AI baseline results and project
                information submitted by farmers before
                making the project available to industry
                buyers.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() =>
                  fetchProjects(true)
                }
                disabled={refreshing}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-ocean-900/10 dark:border-sand-100/10 bg-sand-50/70 dark:bg-[#071a20]/60 text-ink dark:text-sand-100 text-xs font-mono hover:bg-sand-100 dark:hover:bg-[#0a232b] transition-colors disabled:opacity-50"
              >
                <RefreshCw
                  size={14}
                  className={
                    refreshing
                      ? "animate-spin"
                      : ""
                  }
                />

                Refresh
              </button>
            </div>
          </div>
        </motion.div>

        {/* ==================================================
            ALERTS
           ================================================== */}

        {message && (
          <motion.div
            initial={{
              opacity: 0,
              y: 8,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            className="mb-6 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-xs text-emerald-800 dark:text-emerald-300"
          >
            <div className="flex items-center gap-2">
              <CheckCircle2
                size={16}
              />

              <span>
                {message}
              </span>
            </div>
          </motion.div>
        )}

        {errorMessage && (
          <motion.div
            initial={{
              opacity: 0,
              y: 8,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            className="mb-6 rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-xs text-red-800 dark:text-red-300"
          >
            <div className="flex items-center gap-2">
              <AlertTriangle
                size={16}
              />

              <span>
                {errorMessage}
              </span>
            </div>
          </motion.div>
        )}

        {/* ==================================================
            SUMMARY CARDS
           ================================================== */}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <SummaryCard
            label="Total Projects"
            value={counts.all}
            icon={
              <Layers size={20} />
            }
          />

          <SummaryCard
            label="Pending Review"
            value={counts.pending}
            icon={
              <Clock size={20} />
            }
          />

          <SummaryCard
            label="Approved"
            value={counts.approved}
            icon={
              <CheckCircle2
                size={20}
              />
            }
          />

          <SummaryCard
            label="Rejected"
            value={counts.rejected}
            icon={
              <XCircle size={20} />
            }
          />
        </div>

        {/* ==================================================
            FILTER / SEARCH
           ================================================== */}

        <motion.div
          initial={{
            opacity: 0,
            y: 8,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.35,
          }}
          className="rounded-[28px] border border-ocean-900/10 bg-white/80 dark:border-sand-100/10 dark:bg-[#0a232b]/80 backdrop-blur-md p-5 sm:p-6 shadow-soft mb-6"
        >
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            {/* SEARCH */}

            <div className="relative w-full lg:max-w-md">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-soft dark:text-sand-100/40"
              />

              <input
                type="text"
                value={searchQuery}
                onChange={(event) =>
                  setSearchQuery(
                    event.target.value
                  )
                }
                placeholder="Search project, farmer ID, location..."
                className="w-full rounded-xl border border-ocean-900/10 dark:border-sand-100/10 bg-sand-50/70 dark:bg-[#071a20]/60 py-3 pl-10 pr-4 text-xs text-ink dark:text-sand-50 outline-none focus:border-mangrove-500/50"
              />
            </div>

            {/* FILTERS */}

            <div className="flex items-center gap-2 overflow-x-auto">
              <div className="flex items-center gap-1.5 text-ink-soft dark:text-sand-100/50 mr-1">
                <Filter size={14} />
              </div>

              {(
                [
                  "All",
                  "Pending Review",
                  "Approved",
                  "Rejected",
                ] as FilterTab[]
              ).map((tab) => {
                const active =
                  activeTab === tab;

                let count = counts.all;

                if (
                  tab ===
                  "Pending Review"
                ) {
                  count =
                    counts.pending;
                }

                if (
                  tab === "Approved"
                ) {
                  count =
                    counts.approved;
                }

                if (
                  tab === "Rejected"
                ) {
                  count =
                    counts.rejected;
                }

                return (
                  <button
                    key={tab}
                    type="button"
                    onClick={() =>
                      setActiveTab(tab)
                    }
                    className={`whitespace-nowrap px-3 py-2 rounded-xl text-xs font-mono transition-colors ${
                      active
                        ? "bg-ocean-900 text-sand-50 dark:bg-mangrove-500 dark:text-ink font-semibold"
                        : "text-ink-soft dark:text-sand-100/70 hover:bg-sand-100/60 dark:hover:bg-[#071a20]/50"
                    }`}
                  >
                    {tab}
                    <span className="ml-1.5 opacity-60">
                      ({count})
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </motion.div>

        {/* ==================================================
            PROJECT LIST
           ================================================== */}

        {filteredProjects.length ===
        0 ? (
          <motion.div
            initial={{
              opacity: 0,
              y: 8,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            className="rounded-[28px] border border-ocean-900/10 bg-white/80 dark:border-sand-100/10 dark:bg-[#0a232b]/80 backdrop-blur-md p-12 text-center shadow-soft"
          >
            <Leaf
              size={32}
              className="mx-auto text-mangrove-600 dark:text-mangrove-400"
            />

            <h3 className="mt-4 font-display text-lg font-semibold text-ink dark:text-sand-50">
              No projects found
            </h3>

            <p className="mt-2 text-xs text-ink-soft dark:text-sand-100/60">
              No projects match the selected filter
              or search.
            </p>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {filteredProjects.map(
              (project, index) => {
                const statusStyle =
                  getStatusClasses(
                    project.status
                  );

                const isPending =
                  project.status ===
                  "PENDING_VERIFICATION";

                const isActing =
                  actionLoading ===
                  project.id;

                return (
                  <motion.div
                    key={project.id}
                    initial={{
                      opacity: 0,
                      y: 12,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    transition={{
                      duration: 0.35,
                      delay:
                        index * 0.03,
                    }}
                    className="rounded-[28px] border border-ocean-900/10 bg-white/80 dark:border-sand-100/10 dark:bg-[#0a232b]/80 backdrop-blur-md p-5 sm:p-6 shadow-soft"
                  >
                    <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6">
                      {/* LEFT */}

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2 mb-3">
                          <span className="text-[10px] font-mono uppercase tracking-wider text-mangrove-700 dark:text-mangrove-300">
                            Project
                          </span>

                          <span className="text-[10px] font-mono text-ink-soft dark:text-sand-100/40">
                            •
                          </span>

                          <span className="text-[10px] font-mono text-ink-soft dark:text-sand-100/60">
                            {project.project_id}
                          </span>
                        </div>

                        <div className="flex items-start gap-3">
                          <div className="h-11 w-11 shrink-0 rounded-xl bg-mangrove-500/10 border border-mangrove-500/20 flex items-center justify-center">
                            <Building2
                              size={20}
                              className="text-mangrove-600 dark:text-mangrove-400"
                            />
                          </div>

                          <div className="min-w-0">
                            <h2 className="font-display text-lg font-semibold text-ink dark:text-sand-50 truncate">
                              {project.project_name ||
                                "Mangrove Restoration Project"}
                            </h2>

                            <div className="flex flex-wrap items-center gap-3 mt-1.5 text-xs text-ink-soft dark:text-sand-100/60">
                              <span className="inline-flex items-center gap-1.5">
                                <MapPin
                                  size={13}
                                />

                                {project.location ||
                                  "Location not available"}
                              </span>

                              {project.state && (
                                <span>
                                  • {project.state}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* METADATA */}

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-5">
                          <MiniInfo
                            icon={
                              <User
                                size={14}
                              />
                            }
                            label="Farmer ID"
                            value={`${project.farmer_id.slice(
                              0,
                              8
                            )}...`}
                          />

                          <MiniInfo
                            icon={
                              <Layers
                                size={14}
                              />
                            }
                            label="Area"
                            value={`${formatNumber(
                              project.area_ha,
                              4
                            )} ha`}
                          />

                          <MiniInfo
                            icon={
                              <Coins
                                size={14}
                              />
                            }
                            label="Credits"
                            value={formatNumber(
                              project.available_credits,
                              2
                            )}
                          />

                          <MiniInfo
                            icon={
                              <Calendar
                                size={14}
                              />
                            }
                            label="Submitted"
                            value={formatDate(
                              project.created_at
                            )}
                          />
                        </div>
                      </div>

                      {/* RIGHT */}

                      <div className="xl:w-[280px] shrink-0 space-y-3">
                        <div className="flex items-center justify-between gap-3">
                          <span className="text-[10px] uppercase tracking-wider font-mono text-ink-soft dark:text-sand-100/50">
                            Verification Status
                          </span>

                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[10px] font-mono ${statusStyle.wrapper}`}
                          >
                            <span
                              className={`h-1.5 w-1.5 rounded-full ${statusStyle.dot}`}
                            />

                            {getStatusLabel(
                              project.status
                            )}
                          </span>
                        </div>

                        <button
                          type="button"
                          onClick={() =>
                            openProject(
                              project
                            )
                          }
                          className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-ocean-900/10 dark:border-sand-100/10 bg-sand-50/70 dark:bg-[#071a20]/60 text-ink dark:text-sand-100 text-xs font-mono hover:bg-sand-100 dark:hover:bg-[#0a232b] transition-colors"
                        >
                          <Eye
                            size={14}
                          />

                          Review Project
                        </button>

                        {isPending && (
                          <div className="grid grid-cols-2 gap-2">
                            <button
                              type="button"
                              disabled={
                                isActing
                              }
                              onClick={() =>
                                handleApprove(
                                  project
                                )
                              }
                              className="inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-emerald-600 text-white text-xs font-mono font-semibold hover:bg-emerald-700 transition-colors disabled:opacity-50"
                            >
                              <CheckCircle2
                                size={14}
                              />

                              {isActing
                                ? "Saving..."
                                : "Approve"}
                            </button>

                            <button
                              type="button"
                              disabled={
                                isActing
                              }
                              onClick={() =>
                                handleReject(
                                  project
                                )
                              }
                              className="inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-red-600 text-white text-xs font-mono font-semibold hover:bg-red-700 transition-colors disabled:opacity-50"
                            >
                              <XCircle
                                size={14}
                              />

                              Reject
                            </button>
                          </div>
                        )}

                        {!isPending &&
                          project.status ===
                            "APPROVED" && (
                            <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/20 px-3 py-2 text-[10px] font-mono text-emerald-800 dark:text-emerald-300">
                              This project has been approved and
                              may be displayed in the Industry
                              Marketplace.
                            </div>
                          )}

                        {!isPending &&
                          project.status ===
                            "REJECTED" && (
                            <div className="rounded-xl bg-red-500/10 border border-red-500/20 px-3 py-2 text-[10px] font-mono text-red-800 dark:text-red-300">
                              This project was rejected during
                              Authority verification.
                            </div>
                          )}
                      </div>
                    </div>
                  </motion.div>
                );
              }
            )}
          </div>
        )}

        {/* ==================================================
            REVIEW MODAL
           ================================================== */}

        {selectedProject && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* BACKDROP */}

            <button
              type="button"
              aria-label="Close project review"
              onClick={() => {
                setSelectedProject(
                  null
                );
                setBaselineReport(
                  null
                );
              }}
              className="absolute inset-0 bg-black/50 backdrop-blur-sm cursor-default"
            />

            {/* MODAL */}

            <motion.div
              initial={{
                opacity: 0,
                scale: 0.98,
                y: 10,
              }}
              animate={{
                opacity: 1,
                scale: 1,
                y: 0,
              }}
              className="relative w-full max-w-5xl max-h-[90vh] overflow-y-auto rounded-[28px] border border-ocean-900/10 dark:border-sand-100/10 bg-sand-50 dark:bg-[#071a20] shadow-2xl"
            >
              <div className="sticky top-0 z-10 bg-sand-50/95 dark:bg-[#071a20]/95 backdrop-blur-md border-b border-ocean-900/10 dark:border-sand-100/10 p-5 sm:p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="text-[10px] uppercase tracking-wider font-mono text-mangrove-700 dark:text-mangrove-300">
                      Authority Project Review
                    </div>

                    <h2 className="font-display text-xl sm:text-2xl font-semibold text-ink dark:text-sand-50 mt-1">
                      {selectedProject.project_name}
                    </h2>

                    <div className="flex flex-wrap items-center gap-3 mt-2 text-xs font-mono text-ink-soft dark:text-sand-100/60">
                      <span>
                        Project ID:{" "}
                        <span className="text-mangrove-700 dark:text-mangrove-300">
                          {selectedProject.project_id}
                        </span>
                      </span>

                      <span>
                        •
                      </span>

                      <span>
                        Submitted:{" "}
                        {formatDate(
                          selectedProject.created_at
                        )}
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setSelectedProject(
                        null
                      );
                      setBaselineReport(
                        null
                      );
                    }}
                    className="h-9 w-9 rounded-xl border border-ocean-900/10 dark:border-sand-100/10 flex items-center justify-center text-ink-soft dark:text-sand-100/60 hover:bg-sand-100 dark:hover:bg-[#0a232b]"
                  >
                    <XCircle
                      size={18}
                    />
                  </button>
                </div>
              </div>

              <div className="p-5 sm:p-6 space-y-6">
                {/* PROJECT INFORMATION */}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <ReviewCard
                    title="Project Information"
                    icon={
                      <Building2
                        size={18}
                      />
                    }
                  >
                    <ReviewRow
                      label="Project ID"
                      value={
                        selectedProject.project_id
                      }
                    />

                    <ReviewRow
                      label="Farmer ID"
                      value={
                        selectedProject.farmer_id
                      }
                    />

                    <ReviewRow
                      label="Project Name"
                      value={
                        selectedProject.project_name
                      }
                    />

                    <ReviewRow
                      label="Location"
                      value={
                        selectedProject.location ||
                        "Not available"
                      }
                    />

                    <ReviewRow
                      label="State"
                      value={
                        selectedProject.state ||
                        "Not available"
                      }
                    />

                    <ReviewRow
                      label="Submission Date"
                      value={formatDate(
                        selectedProject.created_at
                      )}
                    />
                  </ReviewCard>

                  <ReviewCard
                    title="Carbon Information"
                    icon={
                      <Leaf
                        size={18}
                      />
                    }
                  >
                    <ReviewRow
                      label="Mangrove Area"
                      value={`${formatNumber(
                        selectedProject.area_ha,
                        6
                      )} ha`}
                    />

                    <ReviewRow
                      label="Available Credits"
                      value={formatNumber(
                        selectedProject.available_credits,
                        4
                      )}
                    />

                    <ReviewRow
                      label="Credit Price"
                      value={`₹${formatNumber(
                        selectedProject.credit_price,
                        2
                      )}`}
                    />

                    <ReviewRow
                      label="Current Status"
                      value={getStatusLabel(
                        selectedProject.status
                      )}
                    />

                    <ReviewRow
                      label="Last Updated"
                      value={formatDate(
                        selectedProject.updated_at
                      )}
                    />
                  </ReviewCard>
                </div>

                {/* BASELINE */}

                <ReviewCard
                  title="AI Baseline Report"
                  icon={
                    <Award
                      size={18}
                    />
                  }
                >
                  {reportLoading ? (
                    <div className="py-8 text-center">
                      <RefreshCw
                        size={22}
                        className="mx-auto animate-spin text-mangrove-600"
                      />

                      <p className="mt-3 text-xs text-ink-soft dark:text-sand-100/60">
                        Loading baseline report...
                      </p>
                    </div>
                  ) : baselineReport ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                      <ReportMetric
                        label="Images Processed"
                        value={formatNumber(
                          baselineReport.images_processed,
                          0
                        )}
                      />

                      <ReportMetric
                        label="Mangrove Detections"
                        value={formatNumber(
                          baselineReport.total_detections,
                          0
                        )}
                      />

                      <ReportMetric
                        label="Detected Area"
                        value={`${formatNumber(
                          baselineReport.area_ha,
                          6
                        )} ha`}
                      />

                      <ReportMetric
                        label="CO₂ Equivalent"
                        value={`${formatNumber(
                          baselineReport.total_co2e,
                          4
                        )} tCO₂e`}
                      />

                      <ReportMetric
                        label="Above-ground Carbon"
                        value={`${formatNumber(
                          baselineReport.agb_tC,
                          4
                        )} tC`}
                      />

                      <ReportMetric
                        label="Below-ground Carbon"
                        value={`${formatNumber(
                          baselineReport.bgb_tC,
                          4
                        )} tC`}
                      />

                      <ReportMetric
                        label="Soil Organic Carbon"
                        value={`${formatNumber(
                          baselineReport.soc_tC,
                          4
                        )} tC`}
                      />

                      <ReportMetric
                        label="Total Carbon"
                        value={`${formatNumber(
                          baselineReport.total_carbon_tC,
                          4
                        )} tC`}
                      />
                    </div>
                  ) : (
                    <div className="rounded-xl border border-amber-500/20 bg-amber-500/10 p-4">
                      <div className="flex items-center gap-2 text-xs text-amber-800 dark:text-amber-300">
                        <AlertTriangle
                          size={15}
                        />

                        <span>
                          No baseline report was found for
                          this project.
                        </span>
                      </div>
                    </div>
                  )}
                </ReviewCard>

                {/* VERIFICATION NOTICE */}

                <div className="rounded-2xl border border-ocean-900/10 bg-white/70 dark:border-sand-100/10 dark:bg-[#0a232b]/70 p-5">
                  <div className="flex items-start gap-3">
                    <FileCheck
                      size={20}
                      className="text-mangrove-600 dark:text-mangrove-400 shrink-0"
                    />

                    <div>
                      <h3 className="text-sm font-semibold text-ink dark:text-sand-50">
                        Verification Decision
                      </h3>

                      <p className="text-xs text-ink-soft dark:text-sand-100/60 mt-1 leading-relaxed">
                        Review the project information and
                        AI baseline values before approving or
                        rejecting the project. Only approved
                        projects should become eligible for
                        the Industry Marketplace.
                      </p>
                    </div>
                  </div>
                </div>

                {/* ACTIONS */}

                {selectedProject.status ===
                  "PENDING_VERIFICATION" && (
                  <div className="flex flex-col sm:flex-row gap-3 sm:justify-end">
                    <button
                      type="button"
                      disabled={
                        actionLoading ===
                        selectedProject.id
                      }
                      onClick={() =>
                        handleReject(
                          selectedProject
                        )
                      }
                      className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-red-500/20 bg-red-500/10 text-red-700 dark:text-red-300 text-xs font-mono font-semibold hover:bg-red-500/15 transition-colors disabled:opacity-50"
                    >
                      <XCircle
                        size={15}
                      />

                      Reject Project
                    </button>

                    <button
                      type="button"
                      disabled={
                        actionLoading ===
                        selectedProject.id
                      }
                      onClick={() =>
                        handleApprove(
                          selectedProject
                        )
                      }
                      className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-mangrove-600 text-white text-xs font-mono font-semibold hover:bg-mangrove-700 transition-colors disabled:opacity-50"
                    >
                      <CheckCircle2
                        size={15}
                      />

                      {actionLoading ===
                      selectedProject.id
                        ? "Saving..."
                        : "Approve Project"}
                    </button>
                  </div>
                )}

                {selectedProject.status ===
                  "APPROVED" && (
                  <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-4">
                    <div className="flex items-center gap-2 text-xs text-emerald-800 dark:text-emerald-300">
                      <CheckCircle2
                        size={16}
                      />

                      <span>
                        This project has already been
                        approved and is eligible for
                        Industry Marketplace visibility.
                      </span>
                    </div>
                  </div>
                )}

                {selectedProject.status ===
                  "REJECTED" && (
                  <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-4">
                    <div className="flex items-center gap-2 text-xs text-red-800 dark:text-red-300">
                      <XCircle
                        size={16}
                      />

                      <span>
                        This project has been rejected.
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* MODAL FOOTER */}

              <div className="border-t border-ocean-900/10 dark:border-sand-100/10 p-5 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="text-[10px] font-mono text-ink-soft dark:text-sand-100/40">
                  Authority Verification Module
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setSelectedProject(
                      null
                    );
                    setBaselineReport(
                      null
                    );
                  }}
                  className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-ocean-900 text-sand-50 dark:bg-mangrove-500 dark:text-ink text-xs font-mono font-semibold hover:opacity-90 transition-opacity"
                >
                  <Send
                    size={13}
                  />

                  Close Review
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

/* ============================================================
   SUMMARY CARD
   ============================================================ */

function SummaryCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 8,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      className="p-5 rounded-2xl bg-white/80 dark:bg-[#0a232b]/80 border border-ocean-900/10 dark:border-sand-100/10 shadow-soft"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <span className="block text-[10px] font-mono uppercase tracking-wider text-ink-soft dark:text-sand-100/50">
            {label}
          </span>

          <span className="text-3xl font-display font-semibold text-ink dark:text-sand-50 block mt-1 font-mono">
            {value.toLocaleString(
              "en-IN"
            )}
          </span>
        </div>

        <div className="h-10 w-10 rounded-xl bg-mangrove-500/10 border border-mangrove-500/20 flex items-center justify-center text-mangrove-600 dark:text-mangrove-400">
          {icon}
        </div>
      </div>
    </motion.div>
  );
}

/* ============================================================
   MINI INFO
   ============================================================ */

function MiniInfo({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="p-3 rounded-xl bg-sand-50/70 dark:bg-[#071a20]/60 border border-ocean-900/5 dark:border-sand-100/5">
      <div className="flex items-center gap-1.5 text-[10px] uppercase font-mono text-ink-soft dark:text-sand-100/50">
        {icon}

        <span>
          {label}
        </span>
      </div>

      <span className="block mt-1 text-xs font-medium text-ink dark:text-sand-50 truncate">
        {value}
      </span>
    </div>
  );
}

/* ============================================================
   REVIEW CARD
   ============================================================ */

function ReviewCard({
  title,
  icon,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-ocean-900/10 bg-white/70 dark:border-sand-100/10 dark:bg-[#0a232b]/70 p-5">
      <div className="flex items-center gap-2.5 pb-3 border-b border-ocean-900/5 dark:border-sand-100/5">
        <span className="text-mangrove-600 dark:text-mangrove-400">
          {icon}
        </span>

        <h3 className="font-display text-sm font-semibold text-ink dark:text-sand-50">
          {title}
        </h3>
      </div>

      <div className="mt-4 space-y-2">
        {children}
      </div>
    </div>
  );
}

/* ============================================================
   REVIEW ROW
   ============================================================ */

function ReviewRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 p-3 rounded-xl bg-sand-50/70 dark:bg-[#071a20]/60">
      <span className="text-[10px] uppercase font-mono text-ink-soft dark:text-sand-100/50">
        {label}
      </span>

      <span className="text-xs font-medium text-ink dark:text-sand-50 sm:text-right break-all">
        {value}
      </span>
    </div>
  );
}

/* ============================================================
   REPORT METRIC
   ============================================================ */

function ReportMetric({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="p-4 rounded-xl bg-sand-50/70 dark:bg-[#071a20]/60 border border-ocean-900/5 dark:border-sand-100/5">
      <span className="block text-[10px] uppercase tracking-wider font-mono text-ink-soft dark:text-sand-100/50">
        {label}
      </span>

      <span className="block mt-1 text-sm font-semibold font-mono text-ink dark:text-sand-50">
        {value}
      </span>
    </div>
  );
}

/* ============================================================
   SHIELD ICON
   ============================================================ */

function ShieldCheckIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M20 13c0 5-3.5 7.5-8 8.5-4.5-1-8-3.5-8-8.5V6l8-3 8 3v7Z" />

      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}
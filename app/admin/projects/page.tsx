"use client";

import React, { useState } from "react";
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
  Sparkles,
  Search,
  Filter,
  Globe,
  AlertTriangle,
  Award,
  Send,
  Building2,
  Leaf,
  Layers3,
} from "lucide-react";

import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

type ProjectStatus = "Pending Review" | "Under Audit" | "Approved" | "Rejected";
type FilterTab = "All" | ProjectStatus;

interface Project {
  id: string;
  name: string;
  farmer: string;
  email: string;
  location: string;
  coordinates: string;
  area: string;
  estCredits: string;
  status: ProjectStatus;
  kmlUploaded: boolean;
  deedVerified: boolean;
  canopyDensity: string;
  submittedDate: string;
  rejectionReason?: string;
}

const projectsData: Project[] = [
  {
    id: "BCN-P-901",
    name: "Sundarbans Delta Mangrove Restoration",
    farmer: "Dr. Aris Thorne",
    email: "a.thorne@delta-ecolab.org",
    location: "South 24 Parganas, West Bengal",
    coordinates: "21.9497° N, 88.9007° E",
    area: "142 Hectares",
    estCredits: "1,420 tCO2e/yr",
    status: "Pending Review",
    kmlUploaded: true,
    deedVerified: true,
    canopyDensity: "78.4%",
    submittedDate: "Today, 08:30 AM",
  },
  {
    id: "BCN-P-902",
    name: "Mahanadi Estuary Protection",
    farmer: "Rajesh Kumar",
    email: "rajesh.k@coastal-greens.in",
    location: "Kendrapara, Odisha",
    coordinates: "20.5000° N, 86.4167° E",
    area: "85 Hectares",
    estCredits: "850 tCO2e/yr",
    status: "Under Audit",
    kmlUploaded: true,
    deedVerified: true,
    canopyDensity: "64.2%",
    submittedDate: "Yesterday",
  },
  {
    id: "BCN-P-903",
    name: "Pichavaram Tidal Forest Expansion",
    farmer: "Elena Vance",
    email: "elena@oceanic-carbon.io",
    location: "Cuddalore, Tamil Nadu",
    coordinates: "11.4322° N, 79.7820° E",
    area: "210 Hectares",
    estCredits: "2,100 tCO2e/yr",
    status: "Approved",
    kmlUploaded: true,
    deedVerified: true,
    canopyDensity: "89.1%",
    submittedDate: "15 Jan 2026",
  },
  {
    id: "BCN-P-904",
    name: "Vembanad Blue Carbon Canopy",
    farmer: "Siddharth Nair",
    email: "s.nair@kerala-backwaters.org",
    location: "Alappuzha, Kerala",
    coordinates: "09.4981° N, 76.3388° E",
    area: "64 Hectares",
    estCredits: "640 tCO2e/yr",
    status: "Rejected",
    kmlUploaded: true,
    deedVerified: false,
    canopyDensity: "42.0%",
    submittedDate: "10 Jan 2026",
    rejectionReason: "Land possession deed flagged boundary overlap with protected national forest reserve.",
  },
];

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<Project[]>(projectsData);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [activeTab, setActiveTab] = useState<FilterTab>("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [rejectionInput, setRejectionInput] = useState("");
  const [showRejectForm, setShowRejectForm] = useState(false);

  // Approve Handler
  const handleApprove = (id: string) => {
    setProjects((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: "Approved" } : p))
    );
    setSelectedProject(null);
    setShowRejectForm(false);
  };

  // Reject Handler
  const handleConfirmReject = (id: string) => {
    if (!rejectionInput.trim()) return;
    setProjects((prev) =>
      prev.map((p) =>
        p.id === id
          ? { ...p, status: "Rejected", rejectionReason: rejectionInput }
          : p
      )
    );
    setSelectedProject(null);
    setShowRejectForm(false);
    setRejectionInput("");
  };

  // Filtered List
  const filteredProjects = projects.filter((p) => {
    const matchesStatus = activeTab === "All" || p.status === activeTab;
    const matchesSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.farmer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.id.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-sand-100 dark:bg-[#061418] text-ink dark:text-sand-100 flex flex-col justify-between relative overflow-x-hidden transition-colors">
      {/* Background Glow */}
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

        {/* Hero Banner */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-[32px] border border-ocean-900/10 bg-gradient-to-br from-white/90 via-sand-50/80 to-mangrove-500/15 dark:border-sand-100/10 dark:from-[#0a232b]/95 dark:via-[#071a20]/90 dark:to-mangrove-950/30 backdrop-blur-xl p-6 sm:p-8 shadow-card flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
        >
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-mono font-medium bg-mangrove-500/15 text-mangrove-800 dark:bg-mangrove-500/20 dark:text-mangrove-300 border border-mangrove-500/20 mb-2">
              <Sparkles size={14} />
              <span>MRV & Verification Engine</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-display font-semibold text-ink dark:text-sand-50 tracking-tight">
              Project Approval Portal
            </h1>
            <p className="text-xs sm:text-sm text-ink-soft dark:text-sand-100/70 mt-1">
              Inspect satellite boundary surveys, canopy density ratios, land deeds, and issue verifiable carbon credit tokens.
            </p>
          </div>

          <div className="relative w-full md:w-72 shrink-0">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-faint dark:text-sand-100/40" />
            <input
              type="text"
              placeholder="Search projects or farmers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-full border border-ocean-900/15 bg-white/80 dark:bg-[#071a20]/80 pl-10 pr-4 py-2.5 text-xs text-ink dark:text-sand-50 placeholder:text-ink-faint focus:outline-none focus:ring-2 focus:ring-mangrove-500"
            />
          </div>
        </motion.div>

        {/* Filter Bar */}
        <div className="flex items-center justify-between gap-4 border-b border-ocean-900/10 dark:border-sand-100/10 pb-4 overflow-x-auto">
          <div className="flex items-center gap-2 bg-white/80 dark:bg-[#071a20]/80 p-1.5 rounded-full border border-ocean-900/10 dark:border-sand-100/10 text-xs font-mono shrink-0">
            {(["All", "Pending Review", "Under Audit", "Approved", "Rejected"] as FilterTab[]).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-1.5 rounded-full transition-all ${
                  activeTab === tab
                    ? "bg-ocean-900 text-sand-50 dark:bg-mangrove-500 dark:text-ink font-semibold shadow-sm"
                    : "text-ink-soft dark:text-sand-100/70 hover:text-ink"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <span className="text-xs font-mono text-ink-soft dark:text-sand-100/60 shrink-0">
            Showing {filteredProjects.length} Projects
          </span>
        </div>

        {/* Main Projects Table */}
        <div className="rounded-[28px] border border-ocean-900/10 bg-white/80 dark:border-sand-100/10 dark:bg-[#0a232b]/80 backdrop-blur-md p-6 shadow-soft">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-ocean-900/5 dark:border-sand-100/5 text-[11px] font-mono uppercase tracking-wider text-ink-soft dark:text-sand-100/60">
                  <th className="py-3 px-4">Project ID</th>
                  <th className="py-3 px-4">Project & Developer</th>
                  <th className="py-3 px-4">District</th>
                  <th className="py-3 px-4">Area & Canopy</th>
                  <th className="py-3 px-4">Est. Sequestration</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ocean-900/5 dark:divide-sand-100/5 text-xs">
                {filteredProjects.map((p) => (
                  <tr key={p.id} className="hover:bg-sand-50/60 dark:hover:bg-[#071a20]/40 transition-colors">
                    <td className="py-4 px-4 font-mono font-semibold text-ink dark:text-sand-50">{p.id}</td>
                    
                    <td className="py-4 px-4">
                      <div className="font-semibold text-ink dark:text-sand-50">{p.name}</div>
                      <div className="text-[11px] text-ink-soft dark:text-sand-100/60 font-mono">{p.farmer}</div>
                    </td>

                    <td className="py-4 px-4 text-ink-soft dark:text-sand-100/80 font-medium">{p.location}</td>

                    <td className="py-4 px-4 font-mono">
                      <div className="text-mangrove-700 dark:text-mangrove-300 font-semibold">{p.area}</div>
                      <div className="text-[10px] text-ink-faint dark:text-sand-100/50">Canopy: {p.canopyDensity}</div>
                    </td>

                    <td className="py-4 px-4 font-mono text-ocean-900 dark:text-sand-100 font-semibold">{p.estCredits}</td>

                    <td className="py-4 px-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-mono font-medium border ${
                          p.status === "Approved"
                            ? "bg-emerald-500/10 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300 border-emerald-500/20"
                            : p.status === "Rejected"
                            ? "bg-red-500/10 text-red-700 dark:bg-red-500/20 dark:text-red-300 border-red-500/20"
                            : p.status === "Under Audit"
                            ? "bg-blue-500/10 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300 border-blue-500/20"
                            : "bg-amber-500/10 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300 border-amber-500/20"
                        }`}
                      >
                        {p.status}
                      </span>
                    </td>

                    <td className="py-4 px-4 text-right">
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedProject(p);
                          setShowRejectForm(false);
                        }}
                        className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-xl bg-ocean-900 text-sand-50 dark:bg-mangrove-500 dark:text-ink text-xs font-mono font-semibold hover:opacity-90 transition-opacity"
                      >
                        <Eye size={13} />
                        <span>Inspect GIS</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Detailed Verification Inspection Modal */}
        {selectedProject && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white dark:bg-[#0a232b] rounded-[28px] border border-ocean-900/10 dark:border-sand-100/10 p-6 max-w-2xl w-full space-y-6 shadow-card max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between border-b border-ocean-900/5 dark:border-sand-100/5 pb-4">
                <div>
                  <h3 className="font-display text-lg font-semibold text-ink dark:text-sand-50">
                    Satellite GIS & Land Audit Detail
                  </h3>
                  <p className="text-xs font-mono text-ink-soft dark:text-sand-100/60">
                    {selectedProject.id} • Submitted {selectedProject.submittedDate}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedProject(null)}
                  className="text-ink-soft dark:text-sand-100/60 hover:text-ink dark:hover:text-sand-50 text-sm font-mono"
                >
                  ✕
                </button>
              </div>

              {/* GIS Satellite Overlay Simulation Viewport */}
              <div className="relative h-48 rounded-2xl bg-[#061418] border border-ocean-900/20 overflow-hidden flex items-center justify-center p-4">
                <div className="absolute inset-0 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:16px_16px] opacity-20" />
                
                <div className="relative z-10 text-center space-y-2">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-mono text-[11px]">
                    <Globe size={13} className="animate-pulse" />
                    <span>Copernicus Sentinel-2 Live Telemetry Overlay</span>
                  </div>
                  <p className="text-xs font-mono text-sand-100/80">
                    Coordinates: {selectedProject.coordinates}
                  </p>
                  <p className="text-[11px] font-mono text-mangrove-300">
                    Canopy Vegetation Index (NDVI): {selectedProject.canopyDensity}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="font-mono text-ink-soft dark:text-sand-100/50 uppercase text-[10px]">
                    Project Title
                  </span>
                  <p className="font-semibold text-ink dark:text-sand-50 text-sm">
                    {selectedProject.name}
                  </p>
                </div>

                <div>
                  <span className="font-mono text-ink-soft dark:text-sand-100/50 uppercase text-[10px]">
                    Developer
                  </span>
                  <p className="font-medium text-ink dark:text-sand-50">
                    {selectedProject.farmer} ({selectedProject.email})
                  </p>
                </div>

                <div>
                  <span className="font-mono text-ink-soft dark:text-sand-100/50 uppercase text-[10px]">
                    Plot Area & Location
                  </span>
                  <p className="font-mono text-mangrove-700 dark:text-mangrove-300 font-semibold">
                    {selectedProject.area} • {selectedProject.location}
                  </p>
                </div>

                <div>
                  <span className="font-mono text-ink-soft dark:text-sand-100/50 uppercase text-[10px]">
                    Est. Carbon Sequestration
                  </span>
                  <p className="font-mono text-ocean-900 dark:text-sand-100 font-semibold">
                    {selectedProject.estCredits}
                  </p>
                </div>
              </div>

              {/* Document Check Badges */}
              <div className="p-4 rounded-2xl bg-sand-50 dark:bg-[#071a20] space-y-2 border border-ocean-900/5 dark:border-sand-100/5 text-xs">
                <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-300 font-medium">
                  <FileCheck size={16} />
                  <span>KML Polygon Boundary File Attached & Verified</span>
                </div>
                <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-300 font-medium">
                  <CheckCircle2 size={16} />
                  <span>Land Registry Deed Authenticated</span>
                </div>
              </div>

              {selectedProject.rejectionReason && (
                <div className="p-4 rounded-2xl bg-red-50 dark:bg-red-950/40 border border-red-500/20 text-red-800 dark:text-red-300 text-xs space-y-1">
                  <span className="font-mono font-semibold uppercase text-[10px]">Rejection Feedback Remarks</span>
                  <p>{selectedProject.rejectionReason}</p>
                </div>
              )}

              {/* Rejection Remarks Input Form */}
              {showRejectForm && (
                <div className="space-y-3 pt-2">
                  <label className="block text-xs font-mono uppercase text-ink-soft dark:text-sand-100/70">
                    Specify Rejection Reason / Remarks *
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Provide specific feedback for the developer (e.g. boundary overlap, insufficient canopy density)..."
                    value={rejectionInput}
                    onChange={(e) => setRejectionInput(e.target.value)}
                    className="w-full rounded-xl border border-ocean-900/15 bg-sand-50/50 dark:bg-[#071a20]/60 dark:border-sand-100/15 p-3 text-xs text-ink dark:text-sand-50 focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                  <button
                    type="button"
                    onClick={() => handleConfirmReject(selectedProject.id)}
                    disabled={!rejectionInput.trim()}
                    className="w-full inline-flex items-center justify-center gap-2 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-mono text-xs font-semibold disabled:opacity-50 transition-colors"
                  >
                    <Send size={14} />
                    <span>Submit Formal Rejection</span>
                  </button>
                </div>
              )}

              {/* Modal Control Actions */}
              {!showRejectForm && (
                <div className="flex items-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => handleApprove(selectedProject.id)}
                    className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-xs font-semibold shadow-sm transition-colors"
                  >
                    <Award size={15} />
                    <span>Issue Verifier Cert & Approve</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowRejectForm(true)}
                    className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 rounded-full bg-red-600 hover:bg-red-500 text-white font-mono text-xs font-semibold shadow-sm transition-colors"
                  >
                    <XCircle size={15} />
                    <span>Reject Project</span>
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
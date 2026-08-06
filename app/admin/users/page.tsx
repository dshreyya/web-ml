"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Users,
  Shield,
  UserCheck,
  Building2,
  Leaf,
  Search,
  Lock,
  Unlock,
  Eye,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileText,
  Wallet,
  Sparkles,
  UserX,
  Mail,
  Phone,
  Calendar,
} from "lucide-react";

import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

type RoleFilter = "All" | "Farmer" | "Buyer" | "Verifier";

interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: "Farmer" | "Buyer" | "Verifier";
  status: "Active" | "Pending KYC" | "Suspended";
  joined: string;
  walletAddress: string;
  kycVerified: boolean;
  projectsOrPurchases: string;
  location: string;
  docSummary: string;
}

const usersData: UserProfile[] = [
  {
    id: "USR-1001",
    name: "Dr. Aris Thorne",
    email: "a.thorne@delta-ecolab.org",
    phone: "+91 98201 12345",
    role: "Farmer",
    status: "Active",
    joined: "12 Jan 2026",
    walletAddress: "0x71C...89A2",
    kycVerified: true,
    projectsOrPurchases: "142 Ha (Sundarbans Delta)",
    location: "South 24 Parganas, WB",
    docSummary: "Aadhaar, Land Deed KML & GIS Polygon",
  },
  {
    id: "USR-1002",
    name: "Apex Energy Corp",
    email: "esg@apexenergy.com",
    phone: "+91 98110 54321",
    role: "Buyer",
    status: "Active",
    joined: "02 Feb 2026",
    walletAddress: "0x3F2...4B11",
    kycVerified: true,
    projectsOrPurchases: "2,500 tCO2e Purchased",
    location: "Navi Mumbai, MH",
    docSummary: "GSTIN (27AAAAA0000A1Z5) & Corporate CIN",
  },
  {
    id: "USR-1003",
    name: "Regional Verifier Authority",
    email: "audit@mrv-authority.gov.in",
    phone: "+91 94330 99887",
    role: "Verifier",
    status: "Active",
    joined: "15 Nov 2025",
    walletAddress: "0x9E1...00CC",
    kycVerified: true,
    projectsOrPurchases: "18 Projects Audited",
    location: "Kolkata, WB",
    docSummary: "Government Verifier Accreditation Cert",
  },
  {
    id: "USR-1004",
    name: "Rajesh Kumar",
    email: "rajesh.k@coastal-greens.in",
    phone: "+91 97441 22334",
    role: "Farmer",
    status: "Pending KYC",
    joined: "01 Mar 2026",
    walletAddress: "0x1A4...77D2",
    kycVerified: false,
    projectsOrPurchases: "85 Ha (Mahanadi Estuary)",
    location: "Kendrapara, Odisha",
    docSummary: "Land Possession Cert (Verification Pending)",
  },
  {
    id: "USR-1005",
    name: "Tata Steel Offset Fund",
    email: "carbon@tatasteel.com",
    phone: "+91 98300 11223",
    role: "Buyer",
    status: "Active",
    joined: "18 Feb 2026",
    walletAddress: "0x88B...9911",
    kycVerified: true,
    projectsOrPurchases: "5,000 tCO2e Reserved",
    location: "Jamshedpur, JH",
    docSummary: "GSTIN & Corporate ESG Filing Docs",
  },
  {
    id: "USR-1006",
    name: "Siddharth Nair",
    email: "s.nair@kerala-backwaters.org",
    phone: "+91 98470 33445",
    role: "Farmer",
    status: "Suspended",
    joined: "20 Jan 2026",
    walletAddress: "0x22C...55EE",
    kycVerified: false,
    projectsOrPurchases: "64 Ha (Vembanad Canopy)",
    location: "Alappuzha, Kerala",
    docSummary: "Boundary Dispute Flagged by Local Registry",
  },
];

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserProfile[]>(usersData);
  const [activeRole, setActiveRole] = useState<RoleFilter>("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);

  // Toggle Account Suspension / Activation
  const toggleUserStatus = (id: string) => {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === id) {
          const nextStatus = u.status === "Suspended" ? "Active" : "Suspended";
          return { ...u, status: nextStatus };
        }
        return u;
      })
    );
    if (selectedUser && selectedUser.id === id) {
      setSelectedUser((prev) =>
        prev
          ? {
              ...prev,
              status: prev.status === "Suspended" ? "Active" : "Suspended",
            }
          : null
      );
    }
  };

  // Filtered User Set
  const filteredUsers = users.filter((u) => {
    const matchesRole = activeRole === "All" || u.role === activeRole;
    const matchesSearch =
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.walletAddress.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesRole && matchesSearch;
  });

  // Summary Metrics
  const totalUsers = users.length;
  const totalFarmers = users.filter((u) => u.role === "Farmer").length;
  const totalBuyers = users.filter((u) => u.role === "Buyer").length;
  const pendingKyc = users.filter((u) => u.status === "Pending KYC").length;

  return (
    <div className="min-h-screen bg-sand-100 dark:bg-[#061418] text-ink dark:text-sand-100 flex flex-col justify-between relative overflow-x-hidden transition-colors">
      {/* Background Ambient Glowing Blur Gradients */}
      <div className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2 h-[700px] w-[1200px] rounded-full bg-gradient-to-b from-ocean-300/20 via-mangrove-300/15 to-transparent blur-3xl opacity-75 dark:from-ocean-900/35 dark:via-mangrove-900/25" />

      {/* Global Navigation Bar */}
      <Navbar />

      {/* Main Container Area */}
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
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-mono font-medium bg-ocean-900/10 text-ocean-900 dark:bg-sand-100/10 dark:text-sand-50 border border-ocean-900/15 mb-2">
              <Users size={14} />
              <span>Identity & Governance Portal</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-display font-semibold text-ink dark:text-sand-50 tracking-tight">
              Manage Platform Users & Access
            </h1>
            <p className="text-xs sm:text-sm text-ink-soft dark:text-sand-100/70 mt-1">
              Audit permissions, inspect KYC credentials, and manage Polygon wallet authorizations across farmers, buyers, and verifiers.
            </p>
          </div>

          <div className="relative w-full md:w-72 shrink-0">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-faint dark:text-sand-100/40" />
            <input
              type="text"
              placeholder="Search user, email, wallet..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-full border border-ocean-900/15 bg-white/80 dark:bg-[#071a20]/80 pl-10 pr-4 py-2.5 text-xs text-ink dark:text-sand-50 placeholder:text-ink-faint focus:outline-none focus:ring-2 focus:ring-mangrove-500"
            />
          </div>
        </motion.div>

        {/* Overview Stat Badges */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div className="rounded-[24px] border border-ocean-900/10 bg-white/80 dark:border-sand-100/10 dark:bg-[#0a232b]/80 p-5 shadow-soft flex items-center justify-between">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-ink-soft dark:text-sand-100/60 font-medium">
                Total Users
              </span>
              <div className="text-2xl font-display font-semibold font-mono text-ink dark:text-sand-50 mt-1">
                {totalUsers}
              </div>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-ocean-900/10 text-ocean-900 dark:bg-sand-100/10 dark:text-sand-50">
              <Users size={20} />
            </div>
          </div>

          <div className="rounded-[24px] border border-ocean-900/10 bg-white/80 dark:border-sand-100/10 dark:bg-[#0a232b]/80 p-5 shadow-soft flex items-center justify-between">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-ink-soft dark:text-sand-100/60 font-medium">
                Registered Farmers
              </span>
              <div className="text-2xl font-display font-semibold font-mono text-mangrove-700 dark:text-mangrove-300 mt-1">
                {totalFarmers}
              </div>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-mangrove-500/15 text-mangrove-800 dark:bg-mangrove-500/20 dark:text-mangrove-300">
              <Leaf size={20} />
            </div>
          </div>

          <div className="rounded-[24px] border border-ocean-900/10 bg-white/80 dark:border-sand-100/10 dark:bg-[#0a232b]/80 p-5 shadow-soft flex items-center justify-between">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-ink-soft dark:text-sand-100/60 font-medium">
                Corporate Buyers
              </span>
              <div className="text-2xl font-display font-semibold font-mono text-ocean-900 dark:text-sand-100 mt-1">
                {totalBuyers}
              </div>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-ocean-900/10 text-ocean-900 dark:bg-sand-100/10 dark:text-sand-50">
              <Building2 size={20} />
            </div>
          </div>

          <div className="rounded-[24px] border border-ocean-900/10 bg-white/80 dark:border-sand-100/10 dark:bg-[#0a232b]/80 p-5 shadow-soft flex items-center justify-between">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-ink-soft dark:text-sand-100/60 font-medium">
                Pending KYC Action
              </span>
              <div className="text-2xl font-display font-semibold font-mono text-amber-600 dark:text-amber-400 mt-1">
                {pendingKyc}
              </div>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-500/15 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300">
              <Clock size={20} />
            </div>
          </div>
        </div>

        {/* Role Pills Filter Bar */}
        <div className="flex items-center justify-between gap-4 border-b border-ocean-900/10 dark:border-sand-100/10 pb-4">
          <div className="flex items-center gap-2 bg-white/80 dark:bg-[#071a20]/80 p-1.5 rounded-full border border-ocean-900/10 dark:border-sand-100/10 text-xs font-mono">
            {(["All", "Farmer", "Buyer", "Verifier"] as RoleFilter[]).map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setActiveRole(r)}
                className={`px-4 py-1.5 rounded-full transition-all ${
                  activeRole === r
                    ? "bg-ocean-900 text-sand-50 dark:bg-mangrove-500 dark:text-ink font-semibold shadow-sm"
                    : "text-ink-soft dark:text-sand-100/70 hover:text-ink"
                }`}
              >
                {r === "All" ? "All Profiles" : `${r}s`}
              </button>
            ))}
          </div>

          <span className="text-xs font-mono text-ink-soft dark:text-sand-100/60">
            Showing {filteredUsers.length} Users
          </span>
        </div>

        {/* Main Users Table */}
        <div className="rounded-[28px] border border-ocean-900/10 bg-white/80 dark:border-sand-100/10 dark:bg-[#0a232b]/80 backdrop-blur-md p-6 shadow-soft">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-ocean-900/5 dark:border-sand-100/5 text-[11px] font-mono uppercase tracking-wider text-ink-soft dark:text-sand-100/60">
                  <th className="py-3 px-4">User ID</th>
                  <th className="py-3 px-4">Name & Entity</th>
                  <th className="py-3 px-4">Role</th>
                  <th className="py-3 px-4">Wallet Address</th>
                  <th className="py-3 px-4">KYC / Docs</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ocean-900/5 dark:divide-sand-100/5 text-xs">
                {filteredUsers.map((u) => (
                  <tr
                    key={u.id}
                    className="hover:bg-sand-50/60 dark:hover:bg-[#071a20]/40 transition-colors"
                  >
                    <td className="py-4 px-4 font-mono font-semibold text-ink dark:text-sand-50">
                      {u.id}
                    </td>

                    <td className="py-4 px-4">
                      <div className="font-semibold text-ink dark:text-sand-50">
                        {u.name}
                      </div>
                      <div className="text-[11px] font-mono text-ink-faint dark:text-sand-100/50">
                        {u.email}
                      </div>
                    </td>

                    <td className="py-4 px-4 font-mono">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-sand-100 dark:bg-[#071a20] border border-ocean-900/5 dark:border-sand-100/10 font-medium">
                        {u.role === "Farmer" && <Leaf size={12} className="text-mangrove-600 dark:text-mangrove-400" />}
                        {u.role === "Buyer" && <Building2 size={12} className="text-ocean-900 dark:text-sand-100" />}
                        {u.role === "Verifier" && <Shield size={12} className="text-amber-600 dark:text-amber-400" />}
                        <span>{u.role}</span>
                      </span>
                    </td>

                    <td className="py-4 px-4 font-mono text-ink-soft dark:text-sand-100/80">
                      <span className="inline-flex items-center gap-1.5 bg-sand-50 dark:bg-[#071a20] px-2.5 py-1 rounded-xl border border-ocean-900/5 dark:border-sand-100/5">
                        <Wallet size={12} className="text-mangrove-700 dark:text-mangrove-300" />
                        <span>{u.walletAddress}</span>
                      </span>
                    </td>

                    <td className="py-4 px-4 font-mono">
                      {u.kycVerified ? (
                        <span className="inline-flex items-center gap-1 text-emerald-700 dark:text-emerald-300 font-medium">
                          <CheckCircle2 size={13} />
                          <span>Verified</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-amber-700 dark:text-amber-300 font-medium">
                          <AlertCircle size={13} />
                          <span>Pending</span>
                        </span>
                      )}
                    </td>

                    <td className="py-4 px-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-mono font-medium border ${
                          u.status === "Active"
                            ? "bg-emerald-500/10 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300 border-emerald-500/20"
                            : u.status === "Suspended"
                            ? "bg-red-500/10 text-red-700 dark:bg-red-500/20 dark:text-red-300 border-red-500/20"
                            : "bg-amber-500/10 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300 border-amber-500/20"
                        }`}
                      >
                        {u.status}
                      </span>
                    </td>

                    <td className="py-4 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => setSelectedUser(u)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-ocean-900 text-sand-50 dark:bg-mangrove-500 dark:text-ink text-xs font-mono font-semibold hover:opacity-90 transition-opacity"
                        >
                          <Eye size={13} />
                          <span>Inspect</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => toggleUserStatus(u.id)}
                          className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-mono font-semibold transition-colors ${
                            u.status === "Active"
                              ? "bg-red-500/10 text-red-700 dark:text-red-300 hover:bg-red-500/20"
                              : "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-500/20"
                          }`}
                        >
                          {u.status === "Active" ? <Lock size={12} /> : <Unlock size={12} />}
                          <span>{u.status === "Active" ? "Suspend" : "Activate"}</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Detailed User Inspection Modal */}
        {selectedUser && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white dark:bg-[#0a232b] rounded-[28px] border border-ocean-900/10 dark:border-sand-100/10 p-6 max-w-xl w-full space-y-6 shadow-card"
            >
              <div className="flex items-center justify-between border-b border-ocean-900/5 dark:border-sand-100/5 pb-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-ocean-900/10 text-ocean-900 dark:bg-mangrove-500/20 dark:text-mangrove-300">
                    <UserCheck size={20} />
                  </div>
                  <div>
                    <h3 className="font-display text-lg font-semibold text-ink dark:text-sand-50">
                      User Profile & Identity Audit
                    </h3>
                    <p className="text-xs text-ink-soft dark:text-sand-100/60 font-mono">
                      {selectedUser.id}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedUser(null)}
                  className="text-ink-soft dark:text-sand-100/60 hover:text-ink dark:hover:text-sand-50 text-sm font-mono"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4 text-xs">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="font-mono text-ink-soft dark:text-sand-100/50 uppercase text-[10px]">
                      Full Name / Entity
                    </span>
                    <p className="text-sm font-semibold text-ink dark:text-sand-50">
                      {selectedUser.name}
                    </p>
                  </div>

                  <div>
                    <span className="font-mono text-ink-soft dark:text-sand-100/50 uppercase text-[10px]">
                      Platform Role
                    </span>
                    <p className="font-semibold text-mangrove-700 dark:text-mangrove-300">
                      {selectedUser.role}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="font-mono text-ink-soft dark:text-sand-100/50 uppercase text-[10px]">
                      Email Address
                    </span>
                    <p className="font-mono text-ink dark:text-sand-50 flex items-center gap-1 mt-0.5">
                      <Mail size={12} />
                      {selectedUser.email}
                    </p>
                  </div>

                  <div>
                    <span className="font-mono text-ink-soft dark:text-sand-100/50 uppercase text-[10px]">
                      Phone Contact
                    </span>
                    <p className="font-mono text-ink dark:text-sand-50 flex items-center gap-1 mt-0.5">
                      <Phone size={12} />
                      {selectedUser.phone}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="font-mono text-ink-soft dark:text-sand-100/50 uppercase text-[10px]">
                      Region / District
                    </span>
                    <p className="font-medium text-ink dark:text-sand-50 mt-0.5">
                      {selectedUser.location}
                    </p>
                  </div>

                  <div>
                    <span className="font-mono text-ink-soft dark:text-sand-100/50 uppercase text-[10px]">
                      Date Registered
                    </span>
                    <p className="font-mono text-ink dark:text-sand-50 flex items-center gap-1 mt-0.5">
                      <Calendar size={12} />
                      {selectedUser.joined}
                    </p>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-sand-50 dark:bg-[#071a20] space-y-2 border border-ocean-900/5 dark:border-sand-100/5">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] uppercase text-ink-soft dark:text-sand-100/60 font-semibold">
                      Connected Web3 Wallet
                    </span>
                    <span className="font-mono text-[10px] text-mangrove-700 dark:text-mangrove-300 font-semibold">
                      Polygon Mainnet
                    </span>
                  </div>
                  <p className="font-mono text-xs font-semibold text-ink dark:text-sand-50">
                    {selectedUser.walletAddress}
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-sand-50 dark:bg-[#071a20] space-y-2 border border-ocean-900/5 dark:border-sand-100/5">
                  <span className="font-mono text-[10px] uppercase text-ink-soft dark:text-sand-100/60 font-semibold block">
                    KYC & Document Verification Summary
                  </span>
                  <div className="flex items-center gap-2 text-ink dark:text-sand-50 font-medium">
                    <FileText size={15} className="text-mangrove-600 dark:text-mangrove-400" />
                    <span>{selectedUser.docSummary}</span>
                  </div>
                </div>
              </div>

              {/* Modal Action Controls */}
              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => toggleUserStatus(selectedUser.id)}
                  className={`flex-1 py-2.5 rounded-full font-mono text-xs font-semibold text-white shadow-sm transition-colors ${
                    selectedUser.status === "Active"
                      ? "bg-red-600 hover:bg-red-500"
                      : "bg-emerald-600 hover:bg-emerald-500"
                  }`}
                >
                  {selectedUser.status === "Active"
                    ? "Suspend User Account"
                    : "Activate Account"}
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedUser(null)}
                  className="px-5 py-2.5 rounded-full border border-ocean-900/15 dark:border-sand-100/15 text-xs font-mono font-medium text-ink dark:text-sand-100 hover:bg-sand-50 dark:hover:bg-[#071a20]"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </main>

      {/* Global Navigation Footer */}
      <Footer />
    </div>
  );
}
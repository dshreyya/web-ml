"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Settings,
  Save,
  Key,
  Globe,
  CheckCircle2,
  Sliders,
  ShieldAlert,
  Coins,
  BellRing,
  Lock,
  Database,
  Layers,
  Sparkles,
  Server,
  Percent,
  Clock,
  Eye,
  EyeOff,
} from "lucide-react";

import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

type TabType = "general" | "mrv" | "marketplace" | "security";

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState<TabType>("general");
  const [saved, setSaved] = useState(false);
  const [showKeys, setShowKeys] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    // General / API
    sentinelApiKey: "sentinel_live_key_998124001928x7q",
    planetScopeKey: "ps_api_live_883900192410",
    polygonRpc: "https://polygon-mainnet.g.alchemy.com/v2/demo-key",
    ipfsGateway: "https://ipfs.io/ipfs/",
    supabaseBucketUrl: "https://ihjtbwlrdkezosolwqaz.supabase.co/storage/v1/object/public/farmer-documents",

    // MRV & Verification
    canopyThreshold: "65",
    ndviSensitivity: "0.45",
    bufferPoolRatio: "15",
    verifierSlaDays: "7",
    aiConfidenceMin: "85",

    // Marketplace & Fees
    tradingFeePercent: "1.5",
    mintingFeePerCredit: "25",
    currencyDefault: "INR",
    payoutGateway: "Razorpay Route (Escrow Node)",

    // Security & Notifications
    sessionTimeoutMins: "60",
    require2FA: true,
    webhookUrl: "https://hooks.slack.com/services/T000/B000/XXXX",
  });

  const handleChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

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
              <Settings size={14} />
              <span>Platform Infrastructure Config</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-display font-semibold text-ink dark:text-sand-50 tracking-tight">
              Platform Settings & Parameters
            </h1>
            <p className="text-xs sm:text-sm text-ink-soft dark:text-sand-100/70 mt-1">
              Govern satellite API keys, MRV verification thresholds, marketplace commission rates, and system webhooks.
            </p>
          </div>

          <button
            onClick={handleSave}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-ocean-900 text-sand-50 dark:bg-mangrove-500 dark:text-ink text-xs font-mono font-semibold hover:opacity-90 shadow-md transition-all shrink-0"
          >
            <Save size={15} />
            <span>Save All Configurations</span>
          </button>
        </motion.div>

        {/* Saved Success Banner */}
        {saved && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-500/20 text-emerald-800 dark:text-emerald-300 text-xs font-mono flex items-center gap-2 shadow-sm"
          >
            <CheckCircle2 size={16} />
            <span>Settings successfully synced and deployed across active node instances!</span>
          </motion.div>
        )}

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-ocean-900/10 dark:border-sand-100/10">
          <button
            type="button"
            onClick={() => setActiveTab("general")}
            className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl font-mono text-xs font-semibold transition-all shrink-0 ${
              activeTab === "general"
                ? "bg-ocean-900 text-sand-50 dark:bg-mangrove-500 dark:text-ink shadow-sm"
                : "bg-white/60 dark:bg-[#0a232b]/60 text-ink-soft dark:text-sand-100/70 hover:bg-white dark:hover:bg-[#082028]"
            }`}
          >
            <Key size={14} />
            <span>API Keys & RPC</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("mrv")}
            className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl font-mono text-xs font-semibold transition-all shrink-0 ${
              activeTab === "mrv"
                ? "bg-ocean-900 text-sand-50 dark:bg-mangrove-500 dark:text-ink shadow-sm"
                : "bg-white/60 dark:bg-[#0a232b]/60 text-ink-soft dark:text-sand-100/70 hover:bg-white dark:hover:bg-[#082028]"
            }`}
          >
            <Sliders size={14} />
            <span>MRV & Verification Rules</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("marketplace")}
            className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl font-mono text-xs font-semibold transition-all shrink-0 ${
              activeTab === "marketplace"
                ? "bg-ocean-900 text-sand-50 dark:bg-mangrove-500 dark:text-ink shadow-sm"
                : "bg-white/60 dark:bg-[#0a232b]/60 text-ink-soft dark:text-sand-100/70 hover:bg-white dark:hover:bg-[#082028]"
            }`}
          >
            <Coins size={14} />
            <span>Marketplace & Fees</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("security")}
            className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl font-mono text-xs font-semibold transition-all shrink-0 ${
              activeTab === "security"
                ? "bg-ocean-900 text-sand-50 dark:bg-mangrove-500 dark:text-ink shadow-sm"
                : "bg-white/60 dark:bg-[#0a232b]/60 text-ink-soft dark:text-sand-100/70 hover:bg-white dark:hover:bg-[#082028]"
            }`}
          >
            <Lock size={14} />
            <span>Security & Notifications</span>
          </button>
        </div>

        {/* Tab 1: API Keys & RPC */}
        {activeTab === "general" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="rounded-[28px] border border-ocean-900/10 bg-white/80 dark:border-sand-100/10 dark:bg-[#0a232b]/80 backdrop-blur-md p-6 sm:p-8 shadow-soft space-y-6"
          >
            <div className="flex items-center justify-between pb-4 border-b border-ocean-900/5 dark:border-sand-100/5">
              <div>
                <h3 className="font-display text-base font-semibold text-ink dark:text-sand-50">
                  External Data & Blockchain Gateways
                </h3>
                <p className="text-xs text-ink-soft dark:text-sand-100/70">
                  Manage connection strings for satellite GIS feeds, RPC nodes, and storage backends.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowKeys(!showKeys)}
                className="inline-flex items-center gap-1.5 text-xs font-mono text-mangrove-700 dark:text-mangrove-300 hover:underline"
              >
                {showKeys ? <EyeOff size={14} /> : <Eye size={14} />}
                <span>{showKeys ? "Mask Secrets" : "Show Secrets"}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-ink-soft dark:text-sand-100/70 mb-2">
                  Copernicus Sentinel-2 API Key
                </label>
                <input
                  type={showKeys ? "text" : "password"}
                  value={formData.sentinelApiKey}
                  onChange={(e) => handleChange("sentinelApiKey", e.target.value)}
                  className="w-full rounded-xl border border-ocean-900/15 bg-sand-50/50 dark:bg-[#071a20]/60 dark:border-sand-100/15 px-4 py-2.5 text-xs text-ink dark:text-sand-50 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-ink-soft dark:text-sand-100/70 mb-2">
                  PlanetScope High-Res GIS API Key
                </label>
                <input
                  type={showKeys ? "text" : "password"}
                  value={formData.planetScopeKey}
                  onChange={(e) => handleChange("planetScopeKey", e.target.value)}
                  className="w-full rounded-xl border border-ocean-900/15 bg-sand-50/50 dark:bg-[#071a20]/60 dark:border-sand-100/15 px-4 py-2.5 text-xs text-ink dark:text-sand-50 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-ink-soft dark:text-sand-100/70 mb-2">
                  Polygon Mainnet RPC Endpoint
                </label>
                <input
                  type="text"
                  value={formData.polygonRpc}
                  onChange={(e) => handleChange("polygonRpc", e.target.value)}
                  className="w-full rounded-xl border border-ocean-900/15 bg-sand-50/50 dark:bg-[#071a20]/60 dark:border-sand-100/15 px-4 py-2.5 text-xs text-ink dark:text-sand-50 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-ink-soft dark:text-sand-100/70 mb-2">
                  IPFS Gateway Endpoint
                </label>
                <input
                  type="text"
                  value={formData.ipfsGateway}
                  onChange={(e) => handleChange("ipfsGateway", e.target.value)}
                  className="w-full rounded-xl border border-ocean-900/15 bg-sand-50/50 dark:bg-[#071a20]/60 dark:border-sand-100/15 px-4 py-2.5 text-xs text-ink dark:text-sand-50 font-mono"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-mono uppercase tracking-wider text-ink-soft dark:text-sand-100/70 mb-2">
                  Supabase Storage Bucket Endpoint
                </label>
                <input
                  type="text"
                  value={formData.supabaseBucketUrl}
                  onChange={(e) => handleChange("supabaseBucketUrl", e.target.value)}
                  className="w-full rounded-xl border border-ocean-900/15 bg-sand-50/50 dark:bg-[#071a20]/60 dark:border-sand-100/15 px-4 py-2.5 text-xs text-ink dark:text-sand-50 font-mono"
                />
              </div>
            </div>
          </motion.div>
        )}

        {/* Tab 2: MRV & Verification Rules */}
        {activeTab === "mrv" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="rounded-[28px] border border-ocean-900/10 bg-white/80 dark:border-sand-100/10 dark:bg-[#0a232b]/80 backdrop-blur-md p-6 sm:p-8 shadow-soft space-y-6"
          >
            <div className="pb-4 border-b border-ocean-900/5 dark:border-sand-100/5">
              <h3 className="font-display text-base font-semibold text-ink dark:text-sand-50">
                Automated Verification & Carbon Accounting Controls
              </h3>
              <p className="text-xs text-ink-soft dark:text-sand-100/70">
                Set sensitivity levels for satellite AI detection and mandatory credit reserve pools.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-ink-soft dark:text-sand-100/70 mb-2">
                  Min Canopy Cover Density Threshold (%)
                </label>
                <input
                  type="number"
                  value={formData.canopyThreshold}
                  onChange={(e) => handleChange("canopyThreshold", e.target.value)}
                  className="w-full rounded-xl border border-ocean-900/15 bg-sand-50/50 dark:bg-[#071a20]/60 dark:border-sand-100/15 px-4 py-2.5 text-xs text-ink dark:text-sand-50 font-mono"
                />
                <span className="text-[10px] text-ink-faint dark:text-sand-100/40 mt-1 block">
                  Plots below this canopy percentage trigger manual verifier audit.
                </span>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-ink-soft dark:text-sand-100/70 mb-2">
                  NDVI Vegetation Sensitivity Index
                </label>
                <input
                  type="number"
                  step="0.05"
                  value={formData.ndviSensitivity}
                  onChange={(e) => handleChange("ndviSensitivity", e.target.value)}
                  className="w-full rounded-xl border border-ocean-900/15 bg-sand-50/50 dark:bg-[#071a20]/60 dark:border-sand-100/15 px-4 py-2.5 text-xs text-ink dark:text-sand-50 font-mono"
                />
                <span className="text-[10px] text-ink-faint dark:text-sand-100/40 mt-1 block">
                  Normalized Difference Vegetation Index baseline (0.0 to 1.0).
                </span>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-ink-soft dark:text-sand-100/70 mb-2">
                  Buffer Pool Reserve Ratio (%)
                </label>
                <input
                  type="number"
                  value={formData.bufferPoolRatio}
                  onChange={(e) => handleChange("bufferPoolRatio", e.target.value)}
                  className="w-full rounded-xl border border-ocean-900/15 bg-sand-50/50 dark:bg-[#071a20]/60 dark:border-sand-100/15 px-4 py-2.5 text-xs text-ink dark:text-sand-50 font-mono"
                />
                <span className="text-[10px] text-ink-faint dark:text-sand-100/40 mt-1 block">
                  Credits withheld automatically during minting to cover reversal risk.
                </span>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-ink-soft dark:text-sand-100/70 mb-2">
                  Regional Verifier SLA Target (Days)
                </label>
                <input
                  type="number"
                  value={formData.verifierSlaDays}
                  onChange={(e) => handleChange("verifierSlaDays", e.target.value)}
                  className="w-full rounded-xl border border-ocean-900/15 bg-sand-50/50 dark:bg-[#071a20]/60 dark:border-sand-100/15 px-4 py-2.5 text-xs text-ink dark:text-sand-50 font-mono"
                />
                <span className="text-[10px] text-ink-faint dark:text-sand-100/40 mt-1 block">
                  Time limit before unreviewed farmer submissions escalate.
                </span>
              </div>
            </div>
          </motion.div>
        )}

        {/* Tab 3: Marketplace & Fees */}
        {activeTab === "marketplace" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="rounded-[28px] border border-ocean-900/10 bg-white/80 dark:border-sand-100/10 dark:bg-[#0a232b]/80 backdrop-blur-md p-6 sm:p-8 shadow-soft space-y-6"
          >
            <div className="pb-4 border-b border-ocean-900/5 dark:border-sand-100/5">
              <h3 className="font-display text-base font-semibold text-ink dark:text-sand-50">
                Marketplace Commission & Escrow Setup
              </h3>
              <p className="text-xs text-ink-soft dark:text-sand-100/70">
                Adjust trading fees collected on secondary exchanges and farmer payout options.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-ink-soft dark:text-sand-100/70 mb-2">
                  Trading Commission Fee (%)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.tradingFeePercent}
                  onChange={(e) => handleChange("tradingFeePercent", e.target.value)}
                  className="w-full rounded-xl border border-ocean-900/15 bg-sand-50/50 dark:bg-[#071a20]/60 dark:border-sand-100/15 px-4 py-2.5 text-xs text-ink dark:text-sand-50 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-ink-soft dark:text-sand-100/70 mb-2">
                  Token Minting Fee Per tCO2e (₹)
                </label>
                <input
                  type="number"
                  value={formData.mintingFeePerCredit}
                  onChange={(e) => handleChange("mintingFeePerCredit", e.target.value)}
                  className="w-full rounded-xl border border-ocean-900/15 bg-sand-50/50 dark:bg-[#071a20]/60 dark:border-sand-100/15 px-4 py-2.5 text-xs text-ink dark:text-sand-50 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-ink-soft dark:text-sand-100/70 mb-2">
                  Default Display Currency
                </label>
                <select
                  value={formData.currencyDefault}
                  onChange={(e) => handleChange("currencyDefault", e.target.value)}
                  className="w-full rounded-xl border border-ocean-900/15 bg-sand-50/50 dark:bg-[#071a20]/60 dark:border-sand-100/15 px-4 py-2.5 text-xs text-ink dark:text-sand-50 font-mono"
                >
                  <option value="INR">INR (₹)</option>
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-ink-soft dark:text-sand-100/70 mb-2">
                  Automated Farmer Payout Gateway
                </label>
                <input
                  type="text"
                  value={formData.payoutGateway}
                  onChange={(e) => handleChange("payoutGateway", e.target.value)}
                  className="w-full rounded-xl border border-ocean-900/15 bg-sand-50/50 dark:bg-[#071a20]/60 dark:border-sand-100/15 px-4 py-2.5 text-xs text-ink dark:text-sand-50 font-mono"
                />
              </div>
            </div>
          </motion.div>
        )}

        {/* Tab 4: Security & Notifications */}
        {activeTab === "security" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="rounded-[28px] border border-ocean-900/10 bg-white/80 dark:border-sand-100/10 dark:bg-[#0a232b]/80 backdrop-blur-md p-6 sm:p-8 shadow-soft space-y-6"
          >
            <div className="pb-4 border-b border-ocean-900/5 dark:border-sand-100/5">
              <h3 className="font-display text-base font-semibold text-ink dark:text-sand-50">
                System Security & Event Webhooks
              </h3>
              <p className="text-xs text-ink-soft dark:text-sand-100/70">
                Configure authentication rules and automated notifications for external teams.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-ink-soft dark:text-sand-100/70 mb-2">
                  Admin Session Timeout (Minutes)
                </label>
                <input
                  type="number"
                  value={formData.sessionTimeoutMins}
                  onChange={(e) => handleChange("sessionTimeoutMins", e.target.value)}
                  className="w-full rounded-xl border border-ocean-900/15 bg-sand-50/50 dark:bg-[#071a20]/60 dark:border-sand-100/15 px-4 py-2.5 text-xs text-ink dark:text-sand-50 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-ink-soft dark:text-sand-100/70 mb-2">
                  System Webhook URL (Slack/Discord)
                </label>
                <input
                  type="text"
                  value={formData.webhookUrl}
                  onChange={(e) => handleChange("webhookUrl", e.target.value)}
                  className="w-full rounded-xl border border-ocean-900/15 bg-sand-50/50 dark:bg-[#071a20]/60 dark:border-sand-100/15 px-4 py-2.5 text-xs text-ink dark:text-sand-50 font-mono"
                />
              </div>

              <div className="md:col-span-2 flex items-center justify-between p-4 rounded-2xl bg-sand-50 dark:bg-[#071a20]/50 border border-ocean-900/5 dark:border-sand-100/5">
                <div>
                  <h4 className="text-xs font-semibold text-ink dark:text-sand-50">Enforce 2-Factor Authentication</h4>
                  <p className="text-[11px] text-ink-soft dark:text-sand-100/60">
                    Require regional verifiers and platform admins to verify via TOTP authenticator app.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={formData.require2FA}
                  onChange={(e) => handleChange("require2FA", e.target.checked)}
                  className="h-5 w-5 rounded border-ocean-900/20 text-mangrove-600 focus:ring-mangrove-500"
                />
              </div>
            </div>
          </motion.div>
        )}
      </main>

      {/* Global Navigation Footer */}
      <Footer />
    </div>
  );
}
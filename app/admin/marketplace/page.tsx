"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ShoppingBag,
  TrendingUp,
  Coins,
  DollarSign,
  AlertTriangle,
  Play,
  Pause,
  Sliders,
  ShieldAlert,
  CheckCircle2,
  XCircle,
  RefreshCw,
  Search,
  Sparkles,
  ArrowUpRight,
  ArrowDownRight,
  Lock,
  Unlock,
  Building2,
  Leaf,
  Scale,
} from "lucide-react";

import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

interface OrderBookItem {
  id: string;
  type: "Buy Order" | "Credit Listing";
  entity: string;
  projectOrBuyer: string;
  volume: string;
  pricePerUnit: string;
  totalValue: string;
  time: string;
  status: "Settled" | "Active Order" | "In Escrow";
}

interface EscrowDispute {
  disputeId: string;
  buyer: string;
  farmer: string;
  amountLocked: string;
  creditVolume: string;
  reason: string;
  flaggedBy: "Buyer" | "Farmer";
  status: "Locked in Escrow" | "Resolved - Released" | "Resolved - Refunded";
}

const initialOrders: OrderBookItem[] = [
  {
    id: "TX-9041",
    type: "Buy Order",
    entity: "Tata Steel Offset Fund",
    projectOrBuyer: "Sundarbans Delta Mangrove",
    volume: "500 tCO2e",
    pricePerUnit: "₹3,500",
    totalValue: "₹1,750,000",
    time: "10 mins ago",
    status: "Settled",
  },
  {
    id: "TX-9040",
    type: "Credit Listing",
    entity: "Dr. Aris Thorne",
    projectOrBuyer: "Sundarbans Restoration Plot",
    volume: "1,420 tCO2e",
    pricePerUnit: "₹3,500",
    totalValue: "₹4,970,000",
    time: "25 mins ago",
    status: "Active Order",
  },
  {
    id: "TX-9039",
    type: "Buy Order",
    entity: "Apex Industrial Corp",
    projectOrBuyer: "Pichavaram Tidal Forest",
    volume: "1,000 tCO2e",
    pricePerUnit: "₹3,650",
    totalValue: "₹3,650,000",
    time: "1 hour ago",
    status: "In Escrow",
  },
  {
    id: "TX-9038",
    type: "Credit Listing",
    entity: "Rajesh Kumar",
    projectOrBuyer: "Mahanadi Estuary Plot",
    volume: "850 tCO2e",
    pricePerUnit: "₹3,450",
    totalValue: "₹2,932,500",
    time: "3 hours ago",
    status: "Active Order",
  },
];

const initialDisputes: EscrowDispute[] = [
  {
    disputeId: "DSP-101",
    buyer: "Apex Industrial Corp",
    farmer: "Rajesh Kumar",
    amountLocked: "₹1,725,000",
    creditVolume: "500 tCO2e",
    reason: "Buyer flagged delayed retirement certificate generation on Polygon testnet node.",
    flaggedBy: "Buyer",
    status: "Locked in Escrow",
  },
  {
    disputeId: "DSP-102",
    buyer: "Reliance Sustainability Trust",
    farmer: "Siddharth Nair",
    amountLocked: "₹880,000",
    creditVolume: "250 tCO2e",
    reason: "Farmer reported discrepancy in secondary marketplace commission payout.",
    flaggedBy: "Farmer",
    status: "Locked in Escrow",
  },
];

export default function AdminMarketplacePage() {
  const [isTradingPaused, setIsTradingPaused] = useState(false);
  const [floorPrice, setFloorPrice] = useState("3500");
  const [ceilingPrice, setCeilingPrice] = useState("6500");
  const [priceUpdated, setPriceUpdated] = useState(false);

  const [orders, setOrders] = useState<OrderBookItem[]>(initialOrders);
  const [disputes, setDisputes] = useState<EscrowDispute[]>(initialDisputes);
  const [searchTerm, setSearchTerm] = useState("");

  // Handle Price Controls
  const handleUpdatePriceControls = (e: React.FormEvent) => {
    e.preventDefault();
    setPriceUpdated(true);
    setTimeout(() => setPriceUpdated(false), 3000);
  };

  // Resolve Escrow Dispute Handlers
  const handleReleaseEscrow = (disputeId: string) => {
    setDisputes((prev) =>
      prev.map((d) =>
        d.disputeId === disputeId ? { ...d, status: "Resolved - Released" } : d
      )
    );
  };

  const handleRefundBuyer = (disputeId: string) => {
    setDisputes((prev) =>
      prev.map((d) =>
        d.disputeId === disputeId ? { ...d, status: "Resolved - Refunded" } : d
      )
    );
  };

  const filteredOrders = orders.filter(
    (o) =>
      o.entity.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.projectOrBuyer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-sand-100 dark:bg-[#061418] text-ink dark:text-sand-100 flex flex-col justify-between relative overflow-x-hidden transition-colors">
      {/* Background Ambient Glow */}
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
              <ShoppingBag size={14} />
              <span>Exchange & Escrow Governance</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-display font-semibold text-ink dark:text-sand-50 tracking-tight">
              Marketplace Governance Portal
            </h1>
            <p className="text-xs sm:text-sm text-ink-soft dark:text-sand-100/70 mt-1">
              Control carbon credit pricing bounds, monitor live order books, and resolve locked escrow disputes.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsTradingPaused(!isTradingPaused)}
            className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-mono text-xs font-semibold shadow-md transition-all shrink-0 ${
              isTradingPaused
                ? "bg-emerald-600 hover:bg-emerald-500 text-white"
                : "bg-red-600 hover:bg-red-500 text-white"
            }`}
          >
            {isTradingPaused ? <Play size={15} /> : <Pause size={15} />}
            <span>{isTradingPaused ? "Resume Trading Engine" : "Circuit Breaker (Pause Trading)"}</span>
          </button>
        </motion.div>

        {/* SECTION 1: PRICE CONTROL BOUNDS & STATS */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Price Boundary Controls Form (5 Cols) */}
          <motion.form
            onSubmit={handleUpdatePriceControls}
            className="lg:col-span-5 rounded-[28px] border border-ocean-900/10 bg-white/80 dark:border-sand-100/10 dark:bg-[#0a232b]/80 backdrop-blur-md p-6 shadow-soft space-y-5"
          >
            <div className="flex items-center gap-2 pb-3 border-b border-ocean-900/5 dark:border-sand-100/5">
              <Sliders size={18} className="text-mangrove-600 dark:text-mangrove-400" />
              <h2 className="font-display text-base font-semibold text-ink dark:text-sand-50">
                Market Price Boundary Controls
              </h2>
            </div>

            {priceUpdated && (
              <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-500/20 text-emerald-800 dark:text-emerald-300 text-xs font-mono flex items-center gap-2">
                <CheckCircle2 size={15} />
                <span>Price floors & ceilings updated live across order books!</span>
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-ink-soft dark:text-sand-100/70 mb-1.5">
                  Floor Price / tCO2e (₹ Minimum Bound)
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-mono text-xs text-ink-faint">₹</span>
                  <input
                    type="number"
                    value={floorPrice}
                    onChange={(e) => setFloorPrice(e.target.value)}
                    className="w-full rounded-xl border border-ocean-900/15 bg-sand-50/50 dark:bg-[#071a20]/60 dark:border-sand-100/15 pl-8 pr-4 py-2 text-xs text-ink dark:text-sand-50 font-mono font-semibold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-ink-soft dark:text-sand-100/70 mb-1.5">
                  Maximum Ceiling Price / tCO2e (₹ Anti-Gouging Bound)
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-mono text-xs text-ink-faint">₹</span>
                  <input
                    type="number"
                    value={ceilingPrice}
                    onChange={(e) => setCeilingPrice(e.target.value)}
                    className="w-full rounded-xl border border-ocean-900/15 bg-sand-50/50 dark:bg-[#071a20]/60 dark:border-sand-100/15 pl-8 pr-4 py-2 text-xs text-ink dark:text-sand-50 font-mono font-semibold"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full inline-flex items-center justify-center gap-2 py-2.5 rounded-full bg-ocean-900 text-sand-50 dark:bg-mangrove-500 dark:text-ink text-xs font-mono font-semibold hover:opacity-90 transition-opacity"
            >
              <RefreshCw size={14} />
              <span>Deploy Price Controls</span>
            </button>
          </motion.form>

          {/* Quick Metrics Cards (7 Cols) */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="rounded-[24px] border border-ocean-900/10 bg-white/80 dark:border-sand-100/10 dark:bg-[#0a232b]/80 p-5 shadow-soft flex flex-col justify-between">
              <span className="text-[11px] font-mono uppercase tracking-wider text-ink-soft dark:text-sand-100/60 font-medium">
                24h Trading Volume
              </span>
              <div className="text-2xl sm:text-3xl font-display font-semibold font-mono text-ink dark:text-sand-50 mt-2">
                ₹13,302,500
              </div>
              <span className="text-xs text-mangrove-700 dark:text-mangrove-300 font-medium mt-1">
                3,770 tCO2e Exchanged Today
              </span>
            </div>

            <div className="rounded-[24px] border border-ocean-900/10 bg-white/80 dark:border-sand-100/10 dark:bg-[#0a232b]/80 p-5 shadow-soft flex flex-col justify-between">
              <span className="text-[11px] font-mono uppercase tracking-wider text-ink-soft dark:text-sand-100/60 font-medium">
                Platform Commission Yield (1.5%)
              </span>
              <div className="text-2xl sm:text-3xl font-display font-semibold font-mono text-ocean-900 dark:text-sand-100 mt-2">
                ₹199,537
              </div>
              <span className="text-xs text-ink-soft dark:text-sand-100/60 font-medium mt-1">
                Held in Automated Smart Escrow
              </span>
            </div>

            <div className="rounded-[24px] border border-ocean-900/10 bg-white/80 dark:border-sand-100/10 dark:bg-[#0a232b]/80 p-5 shadow-soft flex flex-col justify-between sm:col-span-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono uppercase tracking-wider text-ink-soft dark:text-sand-100/60 font-medium">
                  Escrow Health Status
                </span>
                <span className="inline-flex items-center gap-1.5 text-xs font-mono text-emerald-700 dark:text-emerald-300 font-medium">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>2 Active Disputes Pending Audit</span>
                </span>
              </div>
              <p className="text-xs text-ink-soft dark:text-sand-100/70 mt-2">
                ₹2,605,000 total funds currently locked across escrow smart contracts awaiting settlement approval.
              </p>
            </div>
          </div>
        </div>

        {/* SECTION 2: DISPUTE & ESCROW MANAGEMENT */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="rounded-[28px] border border-ocean-900/10 bg-white/80 dark:border-sand-100/10 dark:bg-[#0a232b]/80 backdrop-blur-md p-6 shadow-soft space-y-6"
        >
          <div className="flex items-center justify-between pb-4 border-b border-ocean-900/5 dark:border-sand-100/5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-500/15 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300">
                <Scale size={20} />
              </div>
              <div>
                <h2 className="font-display text-lg font-semibold text-ink dark:text-sand-50 tracking-tight">
                  Escrow Dispute Resolution Panel
                </h2>
                <p className="text-xs text-ink-soft dark:text-sand-100/70">
                  Review locked escrow transactions flagged by buyers or project developers
                </p>
              </div>
            </div>

            <span className="text-xs font-mono text-ink-soft dark:text-sand-100/60 bg-sand-100 dark:bg-[#071a20] px-3 py-1.5 rounded-full border border-ocean-900/5 dark:border-sand-100/5">
              {disputes.length} Disputes Total
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {disputes.map((dsp) => (
              <div
                key={dsp.disputeId}
                className="p-5 rounded-2xl bg-sand-50/70 dark:bg-[#071a20]/60 border border-ocean-900/10 dark:border-sand-100/10 space-y-4"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-mono text-xs font-semibold text-ink dark:text-sand-50">
                    <Lock size={14} className="text-amber-600 dark:text-amber-400" />
                    <span>{dsp.disputeId}</span>
                  </div>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-medium border ${
                      dsp.status.includes("Released")
                        ? "bg-emerald-500/10 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300 border-emerald-500/20"
                        : dsp.status.includes("Refunded")
                        ? "bg-blue-500/10 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300 border-blue-500/20"
                        : "bg-amber-500/10 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300 border-amber-500/20"
                    }`}
                  >
                    {dsp.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                  <div>
                    <span className="text-[10px] uppercase text-ink-faint dark:text-sand-100/50">Buyer</span>
                    <p className="font-semibold text-ink dark:text-sand-50">{dsp.buyer}</p>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase text-ink-faint dark:text-sand-100/50">Farmer</span>
                    <p className="font-semibold text-ink dark:text-sand-50">{dsp.farmer}</p>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase text-ink-faint dark:text-sand-100/50">Amount Locked</span>
                    <p className="font-semibold text-mangrove-700 dark:text-mangrove-300">{dsp.amountLocked}</p>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase text-ink-faint dark:text-sand-100/50">Volume</span>
                    <p className="font-semibold text-ocean-900 dark:text-sand-100">{dsp.creditVolume}</p>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-white/80 dark:bg-[#0a232b]/80 border border-ocean-900/5 dark:border-sand-100/5 text-xs text-ink-soft dark:text-sand-100/70">
                  <span className="font-mono text-[10px] uppercase font-semibold text-amber-700 dark:text-amber-300 block mb-1">
                    Dispute Flagged by {dsp.flaggedBy}
                  </span>
                  <p>{dsp.reason}</p>
                </div>

                {dsp.status === "Locked in Escrow" && (
                  <div className="flex items-center gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => handleReleaseEscrow(dsp.disputeId)}
                      className="flex-1 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-xs font-semibold shadow-sm transition-colors"
                    >
                      Release Funds to Farmer
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRefundBuyer(dsp.disputeId)}
                      className="flex-1 py-2 rounded-xl bg-ocean-900 hover:bg-ocean-800 text-white font-mono text-xs font-semibold shadow-sm transition-colors"
                    >
                      Refund Corporate Buyer
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </motion.div>

        {/* SECTION 3: LIVE ORDER BOOK & TRADES LEDGER */}
        <div className="rounded-[28px] border border-ocean-900/10 bg-white/80 dark:border-sand-100/10 dark:bg-[#0a232b]/80 backdrop-blur-md p-6 shadow-soft space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-ocean-900/5 dark:border-sand-100/5">
            <div>
              <h2 className="font-display text-lg font-semibold text-ink dark:text-sand-50 tracking-tight">
                Live Order Book & Transaction Ledger
              </h2>
              <p className="text-xs text-ink-soft dark:text-sand-100/70">
                Real-time trade stream across corporate buy orders and farmer credit listings
              </p>
            </div>

            <div className="relative w-full sm:w-64">
              <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-faint dark:text-sand-100/40" />
              <input
                type="text"
                placeholder="Filter order book..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-full border border-ocean-900/15 bg-sand-50/50 dark:bg-[#071a20]/60 pl-9 pr-4 py-2 text-xs text-ink dark:text-sand-50 placeholder:text-ink-faint focus:outline-none focus:ring-2 focus:ring-mangrove-500"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-ocean-900/5 dark:border-sand-100/5 text-[11px] font-mono uppercase tracking-wider text-ink-soft dark:text-sand-100/60">
                  <th className="py-3 px-4">Trade ID</th>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4">Entity</th>
                  <th className="py-3 px-4">Project / Destination</th>
                  <th className="py-3 px-4">Volume</th>
                  <th className="py-3 px-4">Price / Unit</th>
                  <th className="py-3 px-4">Total Value</th>
                  <th className="py-3 px-4">Time</th>
                  <th className="py-3 px-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ocean-900/5 dark:divide-sand-100/5 text-xs font-mono">
                {filteredOrders.map((o) => (
                  <tr key={o.id} className="hover:bg-sand-50/60 dark:hover:bg-[#071a20]/40 transition-colors">
                    <td className="py-4 px-4 font-semibold text-ink dark:text-sand-50">{o.id}</td>

                    <td className="py-4 px-4 font-sans">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-medium border ${
                          o.type === "Buy Order"
                            ? "bg-ocean-900/10 text-ocean-900 dark:bg-sand-100/10 dark:text-sand-50 border-ocean-900/15"
                            : "bg-mangrove-500/15 text-mangrove-800 dark:bg-mangrove-500/20 dark:text-mangrove-300 border-mangrove-500/20"
                        }`}
                      >
                        {o.type === "Buy Order" ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                        <span>{o.type}</span>
                      </span>
                    </td>

                    <td className="py-4 px-4 font-sans font-medium text-ink dark:text-sand-50">{o.entity}</td>

                    <td className="py-4 px-4 font-sans text-ink-soft dark:text-sand-100/70">{o.projectOrBuyer}</td>

                    <td className="py-4 px-4 font-semibold text-mangrove-700 dark:text-mangrove-300">{o.volume}</td>

                    <td className="py-4 px-4 text-ink-soft dark:text-sand-100/80">{o.pricePerUnit}</td>

                    <td className="py-4 px-4 font-semibold text-ink dark:text-sand-50">{o.totalValue}</td>

                    <td className="py-4 px-4 text-ink-faint dark:text-sand-100/40">{o.time}</td>

                    <td className="py-4 px-4 text-right font-sans">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-medium border ${
                          o.status === "Settled"
                            ? "bg-emerald-500/10 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300 border-emerald-500/20"
                            : o.status === "In Escrow"
                            ? "bg-amber-500/10 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300 border-amber-500/20"
                            : "bg-blue-500/10 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300 border-blue-500/20"
                        }`}
                      >
                        {o.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
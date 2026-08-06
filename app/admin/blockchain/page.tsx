"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Boxes,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  Zap,
  Flame,
  Download,
  Copy,
  Check,
  Search,
  Filter,
  Activity,
  Layers,
  Sparkles,
  FileCheck2,
} from "lucide-react";

import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

type TxType = "Mint" | "Transfer" | "Retire";

interface BlockchainTx {
  txHash: string;
  type: TxType;
  projectOrBuyer: string;
  amount: string;
  blockNumber: number;
  time: string;
  beneficiary?: string;
  retirementReason?: string;
}

const transactionsData: BlockchainTx[] = [
  {
    txHash: "0x8f3b91a27e4c012899d012421a109823f4c1a109",
    type: "Mint",
    projectOrBuyer: "Sundarbans Delta Restoration (BCN-P-901)",
    amount: "1,420 BCN-tCO2",
    blockNumber: 59812401,
    time: "10 mins ago",
  },
  {
    txHash: "0x3a1c90234b810293847561029384756199e41102",
    type: "Transfer",
    projectOrBuyer: "Apex Industrial Corp (Buyer)",
    amount: "500 BCN-tCO2",
    blockNumber: 59812380,
    time: "45 mins ago",
  },
  {
    txHash: "0x1d4e881203948571029384756102938477c29011",
    type: "Retire",
    projectOrBuyer: "Tata Steel Offset Fund",
    amount: "200 BCN-tCO2",
    blockNumber: 59812150,
    time: "2 hours ago",
    beneficiary: "Tata Steel CSR Net-Zero Scope 1 Drive 2026",
    retirementReason: "FY26 Corporate Scope 1 Emissions Neutralization",
  },
  {
    txHash: "0x55f2819203948571029384756102938488219002",
    type: "Mint",
    projectOrBuyer: "Pichavaram Tidal Forest Expansion (BCN-P-903)",
    amount: "2,100 BCN-tCO2",
    blockNumber: 59811900,
    time: "5 hours ago",
  },
  {
    txHash: "0x9921019203948571029384756102938433119099",
    type: "Retire",
    projectOrBuyer: "Reliance Sustainability Trust",
    amount: "450 BCN-tCO2",
    blockNumber: 59811420,
    time: "8 hours ago",
    beneficiary: "Reliance Jamnagar ESG Offsetting Project",
    retirementReason: "Q3 Industrial Carbon Footprint Retirement",
  },
];

export default function AdminBlockchainPage() {
  const [txs, setTxs] = useState<BlockchainTx[]>(transactionsData);
  const [selectedRetirement, setSelectedRetirement] = useState<BlockchainTx | null>(null);
  const [filterType, setFilterType] = useState<string>("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [copied, setCopied] = useState(false);

  // Live Telemetry Simulation
  const [blockNumber, setBlockNumber] = useState(59812401);
  const [gasPrice, setGasPrice] = useState(32);

  useEffect(() => {
    const interval = setInterval(() => {
      setBlockNumber((prev) => prev + 1);
      setGasPrice(Math.floor(28 + Math.random() * 10));
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleCopyHash = (hash: string) => {
    navigator.clipboard.writeText(hash);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const filteredTxs = txs.filter((t) => {
    const matchesFilter = filterType === "All" || t.type === filterType;
    const matchesSearch =
      t.txHash.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.projectOrBuyer.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

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
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-mono font-medium bg-ocean-900/10 text-ocean-900 dark:bg-sand-100/10 dark:text-sand-50 border border-ocean-900/15 mb-2">
              <Boxes size={14} />
              <span>Polygon Mainnet RPC Portal</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-display font-semibold text-ink dark:text-sand-50 tracking-tight">
              Blockchain Smart Contract Audit
            </h1>
            <p className="text-xs sm:text-sm text-ink-soft dark:text-sand-100/70 mt-1">
              Inspect immutable ledger mints, transfers, and downloadable retirement receipts on Polygon.
            </p>
          </div>

          <div className="relative w-full md:w-72 shrink-0">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-faint dark:text-sand-100/40" />
            <input
              type="text"
              placeholder="Search hash, project, buyer..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-full border border-ocean-900/15 bg-white/80 dark:bg-[#071a20]/80 pl-9 pr-4 py-2.5 text-xs text-ink dark:text-sand-50 placeholder:text-ink-faint focus:outline-none focus:ring-2 focus:ring-mangrove-500"
            />
          </div>
        </motion.div>

        {/* LIVE NETWORK TELEMETRY BAR */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="rounded-[24px] border border-ocean-900/10 bg-white/80 dark:border-sand-100/10 dark:bg-[#0a232b]/80 p-5 shadow-soft flex items-center justify-between">
            <div>
              <span className="text-[10px] font-mono uppercase text-ink-soft dark:text-sand-100/60 font-semibold">
                Block Height
              </span>
              <div className="text-xl font-mono font-semibold text-ink dark:text-sand-50 mt-1 flex items-center gap-2">
                <span>#{blockNumber}</span>
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              </div>
            </div>
            <Layers size={22} className="text-mangrove-600 dark:text-mangrove-400" />
          </div>

          <div className="rounded-[24px] border border-ocean-900/10 bg-white/80 dark:border-sand-100/10 dark:bg-[#0a232b]/80 p-5 shadow-soft flex items-center justify-between">
            <div>
              <span className="text-[10px] font-mono uppercase text-ink-soft dark:text-sand-100/60 font-semibold">
                Polygon Gas Price
              </span>
              <div className="text-xl font-mono font-semibold text-ink dark:text-sand-50 mt-1">
                {gasPrice} Gwei
              </div>
            </div>
            <Zap size={22} className="text-amber-500" />
          </div>

          <div className="rounded-[24px] border border-ocean-900/10 bg-white/80 dark:border-sand-100/10 dark:bg-[#0a232b]/80 p-5 shadow-soft flex items-center justify-between">
            <div>
              <span className="text-[10px] font-mono uppercase text-ink-soft dark:text-sand-100/60 font-semibold">
                BCNToken.sol Status
              </span>
              <div className="text-xs font-mono font-semibold text-emerald-700 dark:text-emerald-300 mt-1">
                Verified (ERC-20/721)
              </div>
            </div>
            <CheckCircle2 size={22} className="text-emerald-600 dark:text-emerald-400" />
          </div>

          <div className="rounded-[24px] border border-ocean-900/10 bg-white/80 dark:border-sand-100/10 dark:bg-[#0a232b]/80 p-5 shadow-soft flex items-center justify-between">
            <div>
              <span className="text-[10px] font-mono uppercase text-ink-soft dark:text-sand-100/60 font-semibold">
                BCNMarketplace.sol
              </span>
              <div className="text-xs font-mono font-semibold text-emerald-700 dark:text-emerald-300 mt-1">
                Escrow Active
              </div>
            </div>
            <ShieldCheck size={22} className="text-ocean-900 dark:text-sand-100" />
          </div>
        </div>

        {/* Filter Bar */}
        <div className="flex items-center justify-between gap-4 border-b border-ocean-900/10 dark:border-sand-100/10 pb-4 overflow-x-auto">
          <div className="flex items-center gap-2 bg-white/80 dark:bg-[#071a20]/80 p-1.5 rounded-full border border-ocean-900/10 dark:border-sand-100/10 text-xs font-mono">
            {["All", "Mint", "Transfer", "Retire"].map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setFilterType(t)}
                className={`px-4 py-1.5 rounded-full transition-all ${
                  filterType === t
                    ? "bg-ocean-900 text-sand-50 dark:bg-mangrove-500 dark:text-ink font-semibold shadow-sm"
                    : "text-ink-soft dark:text-sand-100/70 hover:text-ink"
                }`}
              >
                {t === "All" ? "All Logs" : t === "Retire" ? "Retirements / Burns" : `${t}s`}
              </button>
            ))}
          </div>

          <span className="text-xs font-mono text-ink-soft dark:text-sand-100/60">
            Showing {filteredTxs.length} Transactions
          </span>
        </div>

        {/* Main Ledger Table */}
        <div className="rounded-[28px] border border-ocean-900/10 bg-white/80 dark:border-sand-100/10 dark:bg-[#0a232b]/80 backdrop-blur-md p-6 shadow-soft">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-ocean-900/5 dark:border-sand-100/5 text-[11px] font-mono uppercase tracking-wider text-ink-soft dark:text-sand-100/60">
                  <th className="py-3 px-4">Tx Hash</th>
                  <th className="py-3 px-4">Action</th>
                  <th className="py-3 px-4">Project / Buyer</th>
                  <th className="py-3 px-4">Credit Volume</th>
                  <th className="py-3 px-4">Block #</th>
                  <th className="py-3 px-4">Time</th>
                  <th className="py-3 px-4 text-right">Audit Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ocean-900/5 dark:divide-sand-100/5 text-xs font-mono">
                {filteredTxs.map((tx) => (
                  <tr key={tx.txHash} className="hover:bg-sand-50/60 dark:hover:bg-[#071a20]/40 transition-colors">
                    <td className="py-4 px-4 font-semibold text-mangrove-700 dark:text-mangrove-300">
                      {tx.txHash.slice(0, 10)}...{tx.txHash.slice(-6)}
                    </td>

                    <td className="py-4 px-4 font-sans">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-medium border ${
                          tx.type === "Mint"
                            ? "bg-emerald-500/10 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300 border-emerald-500/20"
                            : tx.type === "Retire"
                            ? "bg-amber-500/10 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300 border-amber-500/20"
                            : "bg-blue-500/10 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300 border-blue-500/20"
                        }`}
                      >
                        {tx.type === "Retire" && <Flame size={12} />}
                        <span>{tx.type}</span>
                      </span>
                    </td>

                    <td className="py-4 px-4 font-sans text-ink dark:text-sand-50 font-medium">
                      {tx.projectOrBuyer}
                    </td>

                    <td className="py-4 px-4 font-semibold text-ocean-900 dark:text-sand-100">
                      {tx.amount}
                    </td>

                    <td className="py-4 px-4 text-ink-soft dark:text-sand-100/70">
                      #{tx.blockNumber}
                    </td>

                    <td className="py-4 px-4 text-ink-faint dark:text-sand-100/40">
                      {tx.time}
                    </td>

                    <td className="py-4 px-4 text-right">
                      {tx.type === "Retire" ? (
                        <button
                          type="button"
                          onClick={() => setSelectedRetirement(tx)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-amber-500/20 text-amber-800 dark:bg-amber-500/30 dark:text-amber-300 font-sans font-semibold hover:opacity-90"
                        >
                          <FileCheck2 size={13} />
                          <span>Receipt</span>
                        </button>
                      ) : (
                        <a
                          href={`https://polygonscan.com/tx/${tx.txHash}`}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-mangrove-700 dark:text-mangrove-300 hover:underline font-sans"
                        >
                          <span>Explorer</span>
                          <ExternalLink size={12} />
                        </a>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* PROOF OF RETIREMENT RECEIPT MODAL */}
        {selectedRetirement && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white dark:bg-[#0a232b] rounded-[28px] border border-ocean-900/10 dark:border-sand-100/10 p-6 max-w-lg w-full space-y-6 shadow-card"
            >
              <div className="flex items-center justify-between border-b border-ocean-900/5 dark:border-sand-100/5 pb-4">
                <div className="flex items-center gap-2">
                  <Flame size={20} className="text-amber-500" />
                  <h3 className="font-display text-lg font-semibold text-ink dark:text-sand-50">
                    Proof-of-Retirement Certificate
                  </h3>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedRetirement(null)}
                  className="text-ink-soft dark:text-sand-100/60 hover:text-ink dark:hover:text-sand-50 text-sm font-mono"
                >
                  ✕
                </button>
              </div>

              <div className="p-5 rounded-2xl bg-sand-50 dark:bg-[#071a20] border border-ocean-900/10 dark:border-sand-100/10 space-y-4 text-xs font-mono">
                <div>
                  <span className="text-[10px] text-ink-faint dark:text-sand-100/50 uppercase block">Transaction Hash</span>
                  <div className="flex items-center justify-between font-semibold text-mangrove-700 dark:text-mangrove-300 mt-0.5">
                    <span className="truncate max-w-xs">{selectedRetirement.txHash}</span>
                    <button
                      type="button"
                      onClick={() => handleCopyHash(selectedRetirement.txHash)}
                      className="p-1 hover:bg-sand-200 dark:hover:bg-[#0a232b] rounded transition-colors"
                    >
                      {copied ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <span className="text-[10px] text-ink-faint dark:text-sand-100/50 uppercase block">Retired Volume</span>
                    <p className="font-semibold text-ink dark:text-sand-50 text-sm">{selectedRetirement.amount}</p>
                  </div>

                  <div>
                    <span className="text-[10px] text-ink-faint dark:text-sand-100/50 uppercase block">Block Height</span>
                    <p className="font-semibold text-ink dark:text-sand-50">#{selectedRetirement.blockNumber}</p>
                  </div>
                </div>

                <div>
                  <span className="text-[10px] text-ink-faint dark:text-sand-100/50 uppercase block">Beneficiary Entity</span>
                  <p className="font-sans font-semibold text-ink dark:text-sand-50">{selectedRetirement.beneficiary}</p>
                </div>

                <div>
                  <span className="text-[10px] text-ink-faint dark:text-sand-100/50 uppercase block">Retirement Purpose / Scope</span>
                  <p className="font-sans text-ink-soft dark:text-sand-100/70">{selectedRetirement.retirementReason}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedRetirement(null)}
                  className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 rounded-full bg-ocean-900 text-sand-50 dark:bg-mangrove-500 dark:text-ink font-mono text-xs font-semibold shadow-sm"
                >
                  <Download size={14} />
                  <span>Download Cryptographic Certificate</span>
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
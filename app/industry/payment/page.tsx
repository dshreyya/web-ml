
"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  CheckCircle2,
  CreditCard,
  Landmark,
  Smartphone,
  ShieldCheck,
  Leaf,
  Receipt,
  WalletCards,
} from "lucide-react";

import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

type PaymentMethod = "UPI" | "CARD" | "NETBANKING";

export default function IndustryPaymentPage() {
  const router = useRouter();

  const [credits, setCredits] = useState(10);
  const [paymentMethod, setPaymentMethod] =
    useState<PaymentMethod>("UPI");
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  // Example price
  const pricePerCredit = 1800;

  const subtotal = credits * pricePerCredit;
  const platformFee = Math.round(subtotal * 0.02);
  const totalAmount = subtotal + platformFee;

  const handlePayment = () => {
    setIsProcessing(true);

    // Temporary payment simulation
    setTimeout(() => {
      setIsProcessing(false);
      setPaymentSuccess(true);
    }, 1500);
  };

  if (paymentSuccess) {
    return (
      <div className="min-h-screen bg-sand-100 dark:bg-[#061418] text-ink dark:text-sand-100 flex flex-col">
        <Navbar />

        <main className="relative z-10 flex-1 container mx-auto px-4 sm:px-6 lg:px-8 pt-28 sm:pt-36 pb-16 max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-[32px] border border-mangrove-500/20 bg-white/80 dark:bg-[#0a232b]/90 backdrop-blur-xl p-8 sm:p-12 shadow-card text-center"
          >
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-mangrove-500/15 text-mangrove-700 dark:text-mangrove-300">
              <CheckCircle2 size={42} />
            </div>

            <p className="text-xs font-mono uppercase tracking-wider text-mangrove-700 dark:text-mangrove-300 mb-3">
              Payment Successful
            </p>

            <h1 className="font-display text-3xl sm:text-4xl font-semibold text-ink dark:text-sand-50 tracking-tight">
              Carbon Credits Purchased
            </h1>

            <p className="mt-4 text-sm text-ink-soft dark:text-sand-100/70 leading-relaxed">
              Your payment has been processed successfully.
              The transaction has been recorded in the registry.
            </p>

            <div className="mt-8 rounded-2xl bg-sand-50/80 dark:bg-[#071a20]/80 border border-ocean-900/5 dark:border-sand-100/5 p-5 text-left">
              <div className="flex items-center gap-3 mb-4">
                <Receipt
                  size={20}
                  className="text-mangrove-600 dark:text-mangrove-300"
                />

                <h2 className="font-display font-semibold">
                  Transaction Summary
                </h2>
              </div>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-ink-soft dark:text-sand-100/60">
                    Credits Purchased
                  </span>

                  <span className="font-semibold">
                    {credits}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-ink-soft dark:text-sand-100/60">
                    Amount Paid
                  </span>

                  <span className="font-semibold">
                    ₹{totalAmount.toLocaleString("en-IN")}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-ink-soft dark:text-sand-100/60">
                    Payment Method
                  </span>

                  <span className="font-semibold">
                    {paymentMethod}
                  </span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => router.push("/industry/dashboard")}
              className="mt-8 inline-flex items-center justify-center gap-2 rounded-full bg-ocean-900 hover:bg-ocean-700 dark:bg-mangrove-500 dark:hover:bg-mangrove-300 dark:text-ink px-7 py-3.5 text-xs font-mono uppercase tracking-wider font-semibold text-sand-50 shadow-md transition-all"
            >
              Back to Dashboard
            </button>
          </motion.div>
        </main>

        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-sand-100 dark:bg-[#061418] text-ink dark:text-sand-100 flex flex-col relative overflow-x-hidden">
      {/* Ambient Background */}
      <div className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2 h-[600px] w-[1100px] rounded-full bg-gradient-to-b from-ocean-300/20 via-mangrove-300/15 to-transparent blur-3xl opacity-70 dark:from-ocean-900/35 dark:via-mangrove-900/25" />

      <Navbar />

      <main className="relative z-10 flex-1 container mx-auto px-4 sm:px-6 lg:px-8 pt-28 sm:pt-36 pb-16 max-w-6xl">

        {/* Back Button */}
        <motion.button
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          type="button"
          onClick={() => router.push("/industry/dashboard")}
          className="mb-6 inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-ink-soft dark:text-sand-100/70 hover:text-mangrove-700 dark:hover:text-mangrove-300 transition-colors"
        >
          <ArrowLeft size={15} />
          Back to Industry Dashboard
        </motion.button>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono font-medium bg-mangrove-500/15 text-mangrove-800 dark:bg-mangrove-500/20 dark:text-mangrove-300 border border-mangrove-500/20"
          >
            <Leaf size={14} />
            <span>Blue Carbon Marketplace</span>
          </div>

          <h1 className="mt-4 text-3xl sm:text-4xl md:text-5xl font-display font-semibold text-ink dark:text-sand-50 tracking-tight">
            Purchase Carbon Credits
          </h1>

          <p className="mt-3 max-w-2xl text-sm sm:text-base text-ink-soft dark:text-sand-100/70 leading-relaxed">
            Purchase verified blue carbon credits from approved
            restoration projects.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* LEFT SIDE */}
          <div className="lg:col-span-7 space-y-8">

            {/* Project Card */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="rounded-[28px] border border-ocean-900/10 bg-white/80 dark:border-sand-100/10 dark:bg-[#0a232b]/80 backdrop-blur-md p-6 sm:p-8 shadow-soft"
            >
              <div className="flex items-start justify-between gap-4 pb-5 mb-6 border-b border-ocean-900/5 dark:border-sand-100/5">

                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-mangrove-500/20 text-mangrove-800 dark:bg-mangrove-500/20 dark:text-mangrove-300">
                    <Leaf size={21} />
                  </div>

                  <div>
                    <h2 className="font-display text-lg font-semibold text-ink dark:text-sand-50">
                      Sundarbans Coastal Mangrove Restoration
                    </h2>

                    <p className="text-xs font-mono text-ink-soft dark:text-sand-100/60 mt-1">
                      Project ID: PRJ-MANGROVE-001
                    </p>
                  </div>
                </div>

                <span className="shrink-0 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-mono font-medium bg-mangrove-500/10 text-mangrove-700 dark:bg-mangrove-500/20 dark:text-mangrove-300 border border-mangrove-500/20">
                  <CheckCircle2 size={12} />
                  Verified
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-sand-50/70 dark:bg-[#071a20]/60 border border-ocean-900/5 dark:border-sand-100/5">
                  <span className="block text-[10px] font-mono uppercase tracking-wider text-ink-soft dark:text-sand-100/50">
                    Location
                  </span>

                  <span className="text-sm font-semibold text-ink dark:text-sand-50 block mt-1">
                    Sundarbans
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-sand-50/70 dark:bg-[#071a20]/60 border border-ocean-900/5 dark:border-sand-100/5">
                  <span className="block text-[10px] font-mono uppercase tracking-wider text-ink-soft dark:text-sand-100/50">
                    Price / Credit
                  </span>

                  <span className="text-sm font-semibold text-ink dark:text-sand-50 block mt-1 font-mono">
                    ₹{pricePerCredit.toLocaleString("en-IN")}
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Credit Quantity */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="rounded-[28px] border border-ocean-900/10 bg-white/80 dark:border-sand-100/10 dark:bg-[#0a232b]/80 backdrop-blur-md p-6 sm:p-8 shadow-soft"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-ocean-900/10 text-ocean-900 dark:bg-mangrove-500/20 dark:text-mangrove-300">
                  <WalletCards size={20} />
                </div>

                <div>
                  <h2 className="font-display text-lg font-semibold text-ink dark:text-sand-50">
                    Carbon Credits
                  </h2>

                  <p className="text-xs text-ink-soft dark:text-sand-100/60">
                    Select the number of credits you want to purchase.
                  </p>
                </div>
              </div>

              <label className="block text-[11px] font-mono uppercase tracking-wider text-ink-soft dark:text-sand-100/60 mb-2">
                Number of Credits
              </label>

              <input
                type="number"
                min="1"
                value={credits}
                onChange={(e) =>
                  setCredits(Math.max(1, Number(e.target.value)))
                }
                className="w-full rounded-2xl border border-ocean-900/10 bg-sand-50/80 dark:border-sand-100/10 dark:bg-[#071a20] px-4 py-3.5 text-sm font-mono text-ink dark:text-sand-50 outline-none focus:ring-2 focus:ring-mangrove-500/30"
              />
            </motion.div>

            {/* Payment Method */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="rounded-[28px] border border-ocean-900/10 bg-white/80 dark:border-sand-100/10 dark:bg-[#0a232b]/80 backdrop-blur-md p-6 sm:p-8 shadow-soft"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-mangrove-500/15 text-mangrove-800 dark:bg-mangrove-500/20 dark:text-mangrove-300">
                  <CreditCard size={20} />
                </div>

                <div>
                  <h2 className="font-display text-lg font-semibold text-ink dark:text-sand-50">
                    Payment Method
                  </h2>

                  <p className="text-xs text-ink-soft dark:text-sand-100/60">
                    Choose how you want to pay.
                  </p>
                </div>
              </div>

              <div className="space-y-3">

                {/* UPI */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod("UPI")}
                  className={`w-full flex items-center gap-4 rounded-2xl border p-4 text-left transition-all ${
                    paymentMethod === "UPI"
                      ? "border-mangrove-500 bg-mangrove-500/10"
                      : "border-ocean-900/10 bg-sand-50/70 dark:border-sand-100/10 dark:bg-[#071a20]/60"
                  }`}
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-ocean-900/10 dark:bg-sand-100/10">
                    <Smartphone size={19} />
                  </div>

                  <div className="flex-1">
                    <p className="text-sm font-semibold">
                      UPI
                    </p>

                    <p className="text-[11px] text-ink-soft dark:text-sand-100/60">
                      Google Pay, PhonePe, Paytm and other UPI apps
                    </p>
                  </div>

                  {paymentMethod === "UPI" && (
                    <CheckCircle2
                      size={19}
                      className="text-mangrove-600 dark:text-mangrove-300"
                    />
                  )}
                </button>

                {/* Card */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod("CARD")}
                  className={`w-full flex items-center gap-4 rounded-2xl border p-4 text-left transition-all ${
                    paymentMethod === "CARD"
                      ? "border-mangrove-500 bg-mangrove-500/10"
                      : "border-ocean-900/10 bg-sand-50/70 dark:border-sand-100/10 dark:bg-[#071a20]/60"
                  }`}
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-ocean-900/10 dark:bg-sand-100/10">
                    <CreditCard size={19} />
                  </div>

                  <div className="flex-1">
                    <p className="text-sm font-semibold">
                      Credit / Debit Card
                    </p>

                    <p className="text-[11px] text-ink-soft dark:text-sand-100/60">
                      Visa, Mastercard and supported cards
                    </p>
                  </div>

                  {paymentMethod === "CARD" && (
                    <CheckCircle2
                      size={19}
                      className="text-mangrove-600 dark:text-mangrove-300"
                    />
                  )}
                </button>

                {/* Net Banking */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod("NETBANKING")}
                  className={`w-full flex items-center gap-4 rounded-2xl border p-4 text-left transition-all ${
                    paymentMethod === "NETBANKING"
                      ? "border-mangrove-500 bg-mangrove-500/10"
                      : "border-ocean-900/10 bg-sand-50/70 dark:border-sand-100/10 dark:bg-[#071a20]/60"
                  }`}
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-ocean-900/10 dark:bg-sand-100/10">
                    <Landmark size={19} />
                  </div>

                  <div className="flex-1">
                    <p className="text-sm font-semibold">
                      Net Banking
                    </p>

                    <p className="text-[11px] text-ink-soft dark:text-sand-100/60">
                      Pay securely using your bank account
                    </p>
                  </div>

                  {paymentMethod === "NETBANKING" && (
                    <CheckCircle2
                      size={19}
                      className="text-mangrove-600 dark:text-mangrove-300"
                    />
                  )}
                </button>

              </div>
            </motion.div>
          </div>

          {/* RIGHT SIDE - SUMMARY */}
          <div className="lg:col-span-5">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="lg:sticky lg:top-28 rounded-[28px] border border-ocean-900/10 bg-white/80 dark:border-sand-100/10 dark:bg-[#0a232b]/80 backdrop-blur-md p-6 sm:p-8 shadow-soft"
            >
              <div className="flex items-center gap-3 pb-5 mb-5 border-b border-ocean-900/5 dark:border-sand-100/5">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-ocean-900/10 text-ocean-900 dark:bg-mangrove-500/20 dark:text-mangrove-300">
                  <Receipt size={20} />
                </div>

                <div>
                  <h2 className="font-display text-lg font-semibold text-ink dark:text-sand-50">
                    Order Summary
                  </h2>

                  <p className="text-xs text-ink-soft dark:text-sand-100/60">
                    Review your purchase
                  </p>
                </div>
              </div>

              <div className="space-y-4 text-sm">

                <div className="flex justify-between gap-4">
                  <span className="text-ink-soft dark:text-sand-100/60">
                    Carbon Credits
                  </span>

                  <span className="font-mono font-semibold">
                    {credits}
                  </span>
                </div>

                <div className="flex justify-between gap-4">
                  <span className="text-ink-soft dark:text-sand-100/60">
                    Price per Credit
                  </span>

                  <span className="font-mono font-semibold">
                    ₹{pricePerCredit.toLocaleString("en-IN")}
                  </span>
                </div>

                <div className="flex justify-between gap-4">
                  <span className="text-ink-soft dark:text-sand-100/60">
                    Subtotal
                  </span>

                  <span className="font-mono font-semibold">
                    ₹{subtotal.toLocaleString("en-IN")}
                  </span>
                </div>

                <div className="flex justify-between gap-4">
                  <span className="text-ink-soft dark:text-sand-100/60">
                    Platform Fee (2%)
                  </span>

                  <span className="font-mono font-semibold">
                    ₹{platformFee.toLocaleString("en-IN")}
                  </span>
                </div>

                <div className="border-t border-ocean-900/5 dark:border-sand-100/5 pt-5 mt-5">
                  <div className="flex justify-between items-end gap-4">
                    <span className="text-sm font-semibold">
                      Total Amount
                    </span>

                    <span className="text-2xl font-display font-semibold font-mono text-mangrove-700 dark:text-mangrove-300">
                      ₹{totalAmount.toLocaleString("en-IN")}
                    </span>
                  </div>
                </div>
              </div>

              {/* Security */}
              <div className="mt-6 rounded-2xl bg-mangrove-500/10 border border-mangrove-500/15 p-4">
                <div className="flex gap-3">
                  <ShieldCheck
                    size={19}
                    className="text-mangrove-700 dark:text-mangrove-300 shrink-0"
                  />

                  <div>
                    <p className="text-xs font-semibold text-mangrove-900 dark:text-mangrove-300">
                      Secure Payment
                    </p>

                    <p className="text-[11px] text-ink-soft dark:text-sand-100/60 mt-1 leading-relaxed">
                      Your payment information is processed securely.
                    </p>
                  </div>
                </div>
              </div>

              {/* Pay Button */}
              <button
                type="button"
                disabled={isProcessing}
                onClick={handlePayment}
                className="mt-6 w-full inline-flex items-center justify-center gap-2 rounded-full bg-ocean-900 hover:bg-ocean-700 disabled:opacity-60 dark:bg-mangrove-500 dark:hover:bg-mangrove-300 dark:text-ink px-6 py-4 text-xs font-mono uppercase tracking-wider font-semibold text-sand-50 shadow-md transition-all focus:outline-none focus:ring-2 focus:ring-mangrove-500"
              >
                {isProcessing ? (
                  "Processing Payment..."
                ) : (
                  <>
                    Pay ₹{totalAmount.toLocaleString("en-IN")}
                    <CheckCircle2 size={15} />
                  </>
                )}
              </button>

              <p className="mt-4 text-center text-[10px] font-mono text-ink-soft dark:text-sand-100/50">
                Payment Method: {paymentMethod}
              </p>
            </motion.div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}


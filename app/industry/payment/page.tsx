"use client";

import React, { useEffect, useState } from "react";
import { pdf } from "@react-pdf/renderer";
import CarbonPurchaseCertificate, {
  type CarbonPurchaseCertificateData,
} from "@/components/CarbonPurchaseCertificate";

import { useRouter, useSearchParams } from "next/navigation";

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
  Loader2,
  AlertCircle,
  FileText,
  Download,
  ExternalLink,
} from "lucide-react";

import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { getSupabaseClient } from "@/lib/supabase";

type PaymentMethod =
  | "UPI"
  | "CARD"
  | "NETBANKING";

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

interface PurchaseResult {
  transaction_id: string;
  certificate_id: string;
  remaining_credits: number;
}

export default function IndustryPaymentPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const projectId = searchParams.get("project");

  const [project, setProject] =
    useState<Project | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [credits, setCredits] =
    useState(1);

  const [paymentMethod, setPaymentMethod] =
    useState<PaymentMethod>("UPI");

  const [isProcessing, setIsProcessing] =
    useState(false);

  const [paymentSuccess, setPaymentSuccess] =
    useState(false);

  const [transactionId, setTransactionId] =
    useState("");

  const [certificateId, setCertificateId] =
    useState("");

  const [paymentError, setPaymentError] =
    useState("");

  const [remainingCredits, setRemainingCredits] =
    useState<number | null>(null);

  const [buyerName, setBuyerName] =
    useState("Industry Buyer");

  const [purchaseDate, setPurchaseDate] =
    useState("");

  const [certificateAction, setCertificateAction] =
    useState<"view" | "download" | "">("");

  /*
   * ============================================================
   * LOAD APPROVED PROJECT
   * ============================================================
   */
  useEffect(() => {
    const loadProject = async () => {
      try {
        setLoading(true);
        setError("");

        if (!projectId) {
          setError("Project ID is missing.");
          return;
        }

        const supabase =
          getSupabaseClient();

        if (!supabase) {
          setError(
            "Unable to connect to Supabase."
          );
          return;
        }

        /*
         * Check logged-in Industry user.
         */
        const {
          data: { user },
        } =
          await supabase.auth.getUser();

        if (!user) {
          router.replace("/login");
          return;
        }

        const metadataName =
          user.user_metadata?.full_name ||
          user.user_metadata?.name ||
          user.email ||
          "Industry Buyer";

        setBuyerName(String(metadataName));

        /*
         * ======================================================
         * GET APPROVED PROJECT
         * ======================================================
         */
        const {
          data,
          error: projectError,
        } =
          await supabase
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
            .eq(
              "project_id",
              projectId
            )
            .eq(
              "status",
              "APPROVED"
            )
            .maybeSingle();

        if (projectError) {
          console.error(
            "Payment project error:",
            projectError
          );

          setError(
            projectError.message
          );

          return;
        }

        if (!data) {
          setError(
            "This project is no longer available in the marketplace."
          );

          return;
        }

        /*
         * Check whether credits are available.
         */
        if (
          Number(
            data.available_credits ?? 0
          ) <= 0
        ) {
          setError(
            "No carbon credits are currently available for this project."
          );

          return;
        }

        setProject(data);

        /*
         * Start with 1 credit.
         */
        setCredits(1);
      } catch (err) {
        console.error(
          "Payment project loading error:",
          err
        );

        setError(
          "Unable to load the selected project."
        );
      } finally {
        setLoading(false);
      }
    };

    loadProject();
  }, [projectId, router]);

  /*
   * ============================================================
   * LOADING SCREEN
   * ============================================================
   */
  if (loading) {
    return (
      <div className="min-h-screen bg-sand-100 dark:bg-[#061418] text-ink dark:text-sand-100 flex flex-col">

        <Navbar />

        <main className="flex-1 flex items-center justify-center px-6 pt-28">

          <div className="flex items-center gap-3 text-sm text-ink-soft dark:text-sand-100/70">

            <Loader2
              size={20}
              className="animate-spin"
            />

            Loading project...

          </div>

        </main>

        <Footer />

      </div>
    );
  }

  /*
   * ============================================================
   * ERROR SCREEN
   * ============================================================
   */
  if (
    error ||
    !project
  ) {
    return (
      <div className="min-h-screen bg-sand-100 dark:bg-[#061418] text-ink dark:text-sand-100 flex flex-col">

        <Navbar />

        <main className="flex-1 flex items-center justify-center px-6 pt-28 pb-16">

          <div className="w-full max-w-xl rounded-[28px] border border-red-500/20 bg-red-50 p-8 dark:bg-red-950/20">

            <div className="flex items-start gap-3">

              <AlertCircle
                size={22}
                className="mt-0.5 text-red-600 dark:text-red-400"
              />

              <div>

                <h1 className="font-display text-xl font-semibold text-red-800 dark:text-red-300">
                  Unable to load project
                </h1>

                <p className="mt-2 text-sm text-red-700 dark:text-red-300/80">
                  {error ||
                    "The selected project could not be found."}
                </p>

              </div>

            </div>

            <button
              type="button"
              onClick={() =>
                router.push(
                  "/industry/marketplace"
                )
              }
              className="mt-6 rounded-full bg-ocean-900 px-6 py-3 text-xs font-mono uppercase tracking-wider font-semibold text-white"
            >
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
   * REAL PROJECT VALUES
   * ============================================================
   */

  const pricePerCredit =
    Number(
      project.credit_price ?? 0
    );

  const availableCredits =
    Number(
      project.available_credits ?? 0
    );

  const subtotal =
    credits * pricePerCredit;

  const platformFee =
    Math.round(
      subtotal * 0.02
    );

  const totalAmount =
    subtotal + platformFee;

  /*
   * ============================================================
   * HANDLE PAYMENT
   * ============================================================
   *
   * Payment is currently simulated.
   *
   * The actual database operation is handled by:
   *
   * process_carbon_purchase()
   *
   * That function:
   *
   * 1. Locks the project row
   * 2. Checks available credits
   * 3. Creates the transaction
   * 4. Deducts purchased credits
   * 5. Returns remaining credits
   */
  const handlePayment = async () => {

    /*
     * Basic quantity validation.
     */
    if (
      credits < 1 ||
      credits > availableCredits
    ) {
      setPaymentError(
        "Please select a valid number of credits."
      );

      return;
    }

    /*
     * Clear previous errors.
     */
    setPaymentError("");

    /*
     * Start loading.
     */
    setIsProcessing(true);

    try {

      /*
       * ======================================================
       * GET SUPABASE
       * ======================================================
       */
      const supabase =
        getSupabaseClient();

      if (!supabase) {
        throw new Error(
          "Unable to connect to Supabase."
        );
      }

      /*
       * ======================================================
       * GET CURRENT INDUSTRY USER
       * ======================================================
       */
      const {
        data: { user },
      } =
        await supabase.auth.getUser();

      if (!user) {
        router.replace("/login");
        return;
      }

      /*
       * ======================================================
       * RECHECK PROJECT
       * ======================================================
       *
       * The project is checked again immediately before
       * purchase so the displayed credit balance is not
       * blindly trusted.
       */
      const {
        data: latestProject,
        error: latestProjectError,
      } =
        await supabase
          .from("mangrove_projects")
          .select(`
            project_id,
            farmer_id,
            project_name,
            location,
            state,
            area_ha,
            available_credits,
            credit_price,
            status
          `)
          .eq(
            "project_id",
            project.project_id
          )
          .eq(
            "status",
            "APPROVED"
          )
          .maybeSingle();

      if (latestProjectError) {
        throw new Error(
          latestProjectError.message
        );
      }

      if (!latestProject) {
        throw new Error(
          "This project is no longer available."
        );
      }

      const latestAvailableCredits =
        Number(
          latestProject.available_credits ?? 0
        );

      if (
        latestAvailableCredits <= 0
      ) {
        throw new Error(
          "No carbon credits are currently available."
        );
      }

      if (
        credits > latestAvailableCredits
      ) {
        throw new Error(
          `Only ${latestAvailableCredits.toLocaleString(
            "en-IN"
          )} credits are currently available.`
        );
      }

      /*
       * ======================================================
       * GENERATE UNIQUE TRANSACTION ID
       * ======================================================
       */
      const generatedTransactionId =
        `BCN-${Date.now()}-${crypto
          .randomUUID()
          .slice(0, 8)
          .toUpperCase()}`;

      /*
       * ======================================================
       * GENERATE UNIQUE CERTIFICATE ID
       * ======================================================
       *
       * The actual certificate document will be generated
       * in the next step.
       */
      const generatedCertificateId =
        `BCN-CERT-${Date.now()}-${crypto
          .randomUUID()
          .slice(0, 8)
          .toUpperCase()}`;

      /*
       * ======================================================
       * PROCESS PURCHASE THROUGH SUPABASE RPC
       * ======================================================
       *
       * We do NOT insert directly into carbon_transactions.
       *
       * The database function handles:
       *
       * transaction creation
       * +
       * credit deduction
       *
       * as one database operation.
       */
      const {
        data: purchaseData,
        error: purchaseError,
      } =
        await supabase.rpc(
          "process_carbon_purchase",
          {
            p_project_id:
              latestProject.project_id,

            p_credits:
              credits,

            p_price_per_credit:
              Number(
                latestProject.credit_price ?? 0
              ),

            p_total_amount:
              totalAmount,

            p_payment_method:
              paymentMethod,

            p_transaction_id:
              generatedTransactionId,

            p_certificate_id:
              generatedCertificateId,
          }
        );

      /*
       * ======================================================
       * RPC ERROR
       * ======================================================
       */
      if (purchaseError) {
        console.error(
          "Carbon purchase RPC error:",
          purchaseError
        );

        throw new Error(
          purchaseError.message
        );
      }

      /*
       * ======================================================
       * VALIDATE RPC RESULT
       * ======================================================
       */
      if (
        !purchaseData ||
        !Array.isArray(
          purchaseData
        ) ||
        purchaseData.length === 0
      ) {
        throw new Error(
          "Purchase could not be confirmed."
        );
      }

      const purchase =
        purchaseData[0] as PurchaseResult;

      if (
        !purchase.transaction_id ||
        !purchase.certificate_id
      ) {
        throw new Error(
          "Purchase was created but confirmation details are missing."
        );
      }

      /*
       * ======================================================
       * UPDATE FRONTEND STATE
       * ======================================================
       */
      setTransactionId(
        purchase.transaction_id
      );

      setCertificateId(
        purchase.certificate_id
      );

      setRemainingCredits(
        Number(
          purchase.remaining_credits
        )
      );

      setPurchaseDate(new Date().toISOString());

      /*
       * ======================================================
       * PAYMENT SUCCESS
       * ======================================================
       */
      setPaymentSuccess(true);

    } catch (err) {

      console.error(
        "Payment processing error:",
        err
      );

      setPaymentError(
        err instanceof Error
          ? err.message
          : "Payment could not be completed."
      );

    } finally {

      setIsProcessing(false);

    }
  };

  /*
   * ============================================================
   * CERTIFICATE PDF HELPERS
   * ============================================================
   */

  const buildCertificateData = (): CarbonPurchaseCertificateData => ({
    buyerName,
    projectName: project.project_name,
    projectId: project.project_id,
    location:
      project.location ||
      project.state ||
      "Not available",
    projectArea:
      project.area_ha !== null
        ? Number(project.area_ha)
        : null,
    creditsPurchased: credits,
    co2ePurchased: credits,
    pricePerCredit,
    totalAmount,
    purchaseDate: purchaseDate || new Date().toISOString(),
    transactionId,
    certificateId,
    paymentMethod,
  });

  const generateCertificatePdf = async () => {
    if (!certificateId || !transactionId) {
      throw new Error(
        "Certificate details are not available yet."
      );
    }

    const blob = await pdf(
      <CarbonPurchaseCertificate
        data={buildCertificateData()}
      />
    ).toBlob();

    return blob;
  };

  const handleViewCertificate = async () => {
    let certificateWindow: Window | null = null;

    try {
      setCertificateAction("view");

      // Open the tab immediately so the browser does not block it as a popup.
      certificateWindow = window.open(
        "about:blank",
        "_blank"
      );

      const blob = await generateCertificatePdf();
      const url = URL.createObjectURL(blob);

      if (certificateWindow) {
        certificateWindow.location.href = url;
      } else {
        window.open(
          url,
          "_blank",
          "noopener,noreferrer"
        );
      }

      window.setTimeout(() => {
        URL.revokeObjectURL(url);
      }, 60000);
    } catch (err) {
      certificateWindow?.close();

      console.error(
        "Certificate view error:",
        err
      );
      setPaymentError(
        err instanceof Error
          ? err.message
          : "Unable to open the certificate."
      );
    } finally {
      setCertificateAction("");
    }
  };

  const handleDownloadCertificate = async () => {
    try {
      setCertificateAction("download");

      const blob = await generateCertificatePdf();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");

      link.href = url;
      link.download = `${certificateId}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();

      window.setTimeout(() => {
        URL.revokeObjectURL(url);
      }, 1000);
    } catch (err) {
      console.error(
        "Certificate download error:",
        err
      );
      setPaymentError(
        err instanceof Error
          ? err.message
          : "Unable to download the certificate."
      );
    } finally {
      setCertificateAction("");
    }
  };

  /*
   * ============================================================
   * SUCCESS SCREEN
   * ============================================================
   */
  if (paymentSuccess) {
    return (
      <div className="min-h-screen bg-sand-100 dark:bg-[#061418] text-ink dark:text-sand-100 flex flex-col">

        <Navbar />

        <main className="relative z-10 flex-1 container mx-auto px-4 sm:px-6 lg:px-8 pt-28 sm:pt-36 pb-16 max-w-3xl">

          <motion.div
            initial={{
              opacity: 0,
              y: 20,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            className="rounded-[32px] border border-mangrove-500/20 bg-white/80 dark:bg-[#0a232b]/90 backdrop-blur-xl p-8 sm:p-12 shadow-card text-center"
          >

            {/* SUCCESS ICON */}

            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-mangrove-500/15 text-mangrove-700 dark:text-mangrove-300">

              <CheckCircle2 size={42} />

            </div>

            {/* STATUS */}

            <p className="text-xs font-mono uppercase tracking-wider text-mangrove-700 dark:text-mangrove-300 mb-3">
              Payment Successful
            </p>

            <h1 className="font-display text-3xl sm:text-4xl font-semibold text-ink dark:text-sand-50 tracking-tight">
              Carbon Credits Purchased
            </h1>

            <p className="mt-4 text-sm text-ink-soft dark:text-sand-100/70 leading-relaxed">
              Your payment has been processed successfully.
              The purchase has been recorded in the BlueCarbon Nexus registry.
            </p>

            {/* ==================================================
                TRANSACTION ID
                ================================================== */}

            <div className="mt-6 rounded-2xl bg-mangrove-500/10 border border-mangrove-500/20 p-4 text-left">

              <p className="text-[10px] font-mono uppercase tracking-wider text-mangrove-700 dark:text-mangrove-300">
                Transaction ID
              </p>

              <p className="mt-1 text-sm font-mono font-semibold break-all text-ink dark:text-sand-50">
                {transactionId}
              </p>

            </div>

            {/* ==================================================
                CERTIFICATE ID
                ================================================== */}

            <div className="mt-4 rounded-2xl bg-ocean-900/5 dark:bg-sand-100/5 border border-ocean-900/10 dark:border-sand-100/10 p-4 text-left">

              <p className="text-[10px] font-mono uppercase tracking-wider text-ink-soft dark:text-sand-100/60">
                Certificate ID
              </p>

              <p className="mt-1 text-sm font-mono font-semibold break-all text-ink dark:text-sand-50">
                {certificateId}
              </p>

            </div>

            {/* ==================================================
                TRANSACTION SUMMARY
                ================================================== */}

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

                {/* PROJECT */}

                <div className="flex justify-between gap-4">

                  <span className="text-ink-soft dark:text-sand-100/60">
                    Project
                  </span>

                  <span className="font-semibold text-right max-w-[60%]">
                    {project.project_name}
                  </span>

                </div>

                {/* PROJECT ID */}

                <div className="flex justify-between gap-4">

                  <span className="text-ink-soft dark:text-sand-100/60">
                    Project ID
                  </span>

                  <span className="font-mono font-semibold text-right max-w-[60%] break-all">
                    {project.project_id}
                  </span>

                </div>

                {/* LOCATION */}

                <div className="flex justify-between gap-4">

                  <span className="text-ink-soft dark:text-sand-100/60">
                    Location
                  </span>

                  <span className="font-semibold text-right max-w-[60%]">
                    {project.location ||
                      project.state ||
                      "Not available"}
                  </span>

                </div>

                {/* PROJECT AREA */}

                <div className="flex justify-between gap-4">

                  <span className="text-ink-soft dark:text-sand-100/60">
                    Project Area
                  </span>

                  <span className="font-semibold">
                    {project.area_ha !== null
                      ? `${Number(
                          project.area_ha
                        ).toLocaleString(
                          "en-IN",
                          {
                            maximumFractionDigits: 4,
                          }
                        )} ha`
                      : "Not available"}
                  </span>

                </div>

                {/* CREDITS */}

                <div className="flex justify-between gap-4">

                  <span className="text-ink-soft dark:text-sand-100/60">
                    Credits Purchased
                  </span>

                  <span className="font-semibold">
                    {credits.toLocaleString(
                      "en-IN"
                    )}
                  </span>

                </div>

                {/* PRICE */}

                <div className="flex justify-between gap-4">

                  <span className="text-ink-soft dark:text-sand-100/60">
                    Price per Credit
                  </span>

                  <span className="font-semibold">
                    ₹
                    {pricePerCredit.toLocaleString(
                      "en-IN"
                    )}
                  </span>

                </div>

                {/* SUBTOTAL */}

                <div className="flex justify-between gap-4">

                  <span className="text-ink-soft dark:text-sand-100/60">
                    Subtotal
                  </span>

                  <span className="font-semibold">
                    ₹
                    {subtotal.toLocaleString(
                      "en-IN"
                    )}
                  </span>

                </div>

                {/* PLATFORM FEE */}

                <div className="flex justify-between gap-4">

                  <span className="text-ink-soft dark:text-sand-100/60">
                    Platform Fee
                  </span>

                  <span className="font-semibold">
                    ₹
                    {platformFee.toLocaleString(
                      "en-IN"
                    )}
                  </span>

                </div>

                {/* TOTAL */}

                <div className="flex justify-between gap-4 pt-3 border-t border-ocean-900/5 dark:border-sand-100/5">

                  <span className="font-semibold">
                    Amount Paid
                  </span>

                  <span className="font-semibold text-mangrove-700 dark:text-mangrove-300">
                    ₹
                    {totalAmount.toLocaleString(
                      "en-IN"
                    )}
                  </span>

                </div>

                {/* PAYMENT METHOD */}

                <div className="flex justify-between gap-4">

                  <span className="text-ink-soft dark:text-sand-100/60">
                    Payment Method
                  </span>

                  <span className="font-semibold">
                    {paymentMethod}
                  </span>

                </div>

                {/* PAYMENT STATUS */}

                <div className="flex justify-between gap-4">

                  <span className="text-ink-soft dark:text-sand-100/60">
                    Payment Status
                  </span>

                  <span className="font-semibold text-mangrove-700 dark:text-mangrove-300">
                    SUCCESS
                  </span>

                </div>

                {/* REMAINING CREDITS */}

                {remainingCredits !== null && (
                  <div className="flex justify-between gap-4">

                    <span className="text-ink-soft dark:text-sand-100/60">
                      Remaining Project Credits
                    </span>

                    <span className="font-semibold">
                      {remainingCredits.toLocaleString(
                        "en-IN"
                      )}
                    </span>

                  </div>
                )}

              </div>

            </div>

            {/* ==================================================
                CERTIFICATE ACTIONS
                ================================================== */}

            <div className="mt-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 p-5 text-left">

              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-700 dark:text-emerald-300">
                  <FileText size={19} />
                </div>

                <div className="min-w-0">
                  <p className="text-xs font-semibold text-emerald-800 dark:text-emerald-300">
                    Purchase Certificate Ready
                  </p>

                  <p className="mt-1 text-[11px] text-emerald-800/80 dark:text-emerald-300/70 leading-relaxed">
                    Your certificate has been generated for this carbon credit purchase.
                  </p>

                  <p className="mt-2 text-[11px] text-emerald-800/80 dark:text-emerald-300/70 break-all">
                    Certificate ID:{" "}
                    <span className="font-mono font-semibold">
                      {certificateId}
                    </span>
                  </p>
                </div>
              </div>

              <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={handleViewCertificate}
                  disabled={certificateAction !== ""}
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-ocean-900/10 bg-white/80 px-5 py-3 text-xs font-mono uppercase tracking-wider font-semibold text-ink shadow-sm transition-all hover:bg-white disabled:opacity-60 dark:border-sand-100/10 dark:bg-[#071a20] dark:text-sand-50 dark:hover:bg-[#0a232b]"
                >
                  {certificateAction === "view" ? (
                    <Loader2
                      size={15}
                      className="animate-spin"
                    />
                  ) : (
                    <ExternalLink size={15} />
                  )}
                  {certificateAction === "view"
                    ? "Opening..."
                    : "View Certificate"}
                </button>

                <button
                  type="button"
                  onClick={handleDownloadCertificate}
                  disabled={certificateAction !== ""}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-mangrove-500 px-5 py-3 text-xs font-mono uppercase tracking-wider font-semibold text-ink shadow-sm transition-all hover:bg-mangrove-400 disabled:opacity-60"
                >
                  {certificateAction === "download" ? (
                    <Loader2
                      size={15}
                      className="animate-spin"
                    />
                  ) : (
                    <Download size={15} />
                  )}
                  {certificateAction === "download"
                    ? "Preparing..."
                    : "Download Certificate"}
                </button>
              </div>

            </div>

            <button
              type="button"
              onClick={() =>
                router.push(
                  "/industry/dashboard"
                )
              }
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

  /*
   * ============================================================
   * MAIN PAYMENT PAGE
   * ============================================================
   */

  return (
    <div className="min-h-screen bg-sand-100 dark:bg-[#061418] text-ink dark:text-sand-100 flex flex-col relative overflow-x-hidden">

      {/* Ambient Background */}

      <div className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2 h-[600px] w-[1100px] rounded-full bg-gradient-to-b from-ocean-300/20 via-mangrove-300/15 to-transparent blur-3xl opacity-70 dark:from-ocean-900/35 dark:via-mangrove-900/25" />

      <Navbar />

      <main className="relative z-10 flex-1 container mx-auto px-4 sm:px-6 lg:px-8 pt-28 sm:pt-36 pb-16 max-w-6xl">

        {/* ======================================================
            BACK BUTTON
            ====================================================== */}

        <motion.button
          initial={{
            opacity: 0,
            x: -10,
          }}
          animate={{
            opacity: 1,
            x: 0,
          }}
          type="button"
          onClick={() =>
            router.push(
              "/industry/marketplace"
            )
          }
          className="mb-6 inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-ink-soft dark:text-sand-100/70 hover:text-mangrove-700 dark:hover:text-mangrove-300 transition-colors"
        >

          <ArrowLeft size={15} />

          Back to Marketplace

        </motion.button>

        {/* ======================================================
            HEADER
            ====================================================== */}

        <motion.div
          initial={{
            opacity: 0,
            y: -12,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.5,
          }}
          className="mb-8"
        >

          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono font-medium bg-mangrove-500/15 text-mangrove-800 dark:bg-mangrove-500/20 dark:text-mangrove-300 border border-mangrove-500/20">

            <Leaf size={14} />

            <span>
              Blue Carbon Marketplace
            </span>

          </div>

          <h1 className="mt-4 text-3xl sm:text-4xl md:text-5xl font-display font-semibold text-ink dark:text-sand-50 tracking-tight">
            Purchase Carbon Credits
          </h1>

          <p className="mt-3 max-w-2xl text-sm sm:text-base text-ink-soft dark:text-sand-100/70 leading-relaxed">
            Purchase verified blue carbon credits from
            approved restoration projects.
          </p>

        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* ====================================================
              LEFT SIDE
              ==================================================== */}

          <div className="lg:col-span-7 space-y-8">

            {/* ==================================================
                PROJECT CARD
                ================================================== */}

            <motion.div
              initial={{
                opacity: 0,
                y: 16,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                delay: 0.1,
              }}
              className="rounded-[28px] border border-ocean-900/10 bg-white/80 dark:border-sand-100/10 dark:bg-[#0a232b]/80 backdrop-blur-md p-6 sm:p-8 shadow-soft"
            >

              <div className="flex items-start justify-between gap-4 pb-5 mb-6 border-b border-ocean-900/5 dark:border-sand-100/5">

                <div className="flex items-center gap-3">

                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-mangrove-500/20 text-mangrove-800 dark:bg-mangrove-500/20 dark:text-mangrove-300">

                    <Leaf size={21} />

                  </div>

                  <div>

                    <h2 className="font-display text-lg font-semibold text-ink dark:text-sand-50">
                      {project.project_name}
                    </h2>

                    <p className="text-xs font-mono text-ink-soft dark:text-sand-100/60 mt-1">
                      Project ID:{" "}
                      {project.project_id}
                    </p>

                  </div>

                </div>

                <span className="shrink-0 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-mono font-medium bg-mangrove-500/10 text-mangrove-700 dark:bg-mangrove-500/20 dark:text-mangrove-300 border border-mangrove-500/20">

                  <CheckCircle2 size={12} />

                  Verified

                </span>

              </div>

              <div className="grid grid-cols-2 gap-4">

                {/* LOCATION */}

                <div className="p-4 rounded-2xl bg-sand-50/70 dark:bg-[#071a20]/60 border border-ocean-900/5 dark:border-sand-100/5">

                  <span className="block text-[10px] font-mono uppercase tracking-wider text-ink-soft dark:text-sand-100/50">
                    Location
                  </span>

                  <span className="text-sm font-semibold text-ink dark:text-sand-50 block mt-1">

                    {project.location ||
                      project.state ||
                      "Not available"}

                  </span>

                </div>

                {/* PRICE */}

                <div className="p-4 rounded-2xl bg-sand-50/70 dark:bg-[#071a20]/60 border border-ocean-900/5 dark:border-sand-100/5">

                  <span className="block text-[10px] font-mono uppercase tracking-wider text-ink-soft dark:text-sand-100/50">
                    Price / Credit
                  </span>

                  <span className="text-sm font-semibold text-ink dark:text-sand-50 block mt-1 font-mono">

                    ₹
                    {pricePerCredit.toLocaleString(
                      "en-IN"
                    )}

                  </span>

                </div>

              </div>

              {/* PROJECT AREA */}

              <div className="mt-4 p-4 rounded-2xl bg-sand-50/70 dark:bg-[#071a20]/60 border border-ocean-900/5 dark:border-sand-100/5">

                <span className="block text-[10px] font-mono uppercase tracking-wider text-ink-soft dark:text-sand-100/50">
                  Project Area
                </span>

                <span className="text-sm font-semibold text-ink dark:text-sand-50 block mt-1 font-mono">

                  {project.area_ha !== null
                    ? `${Number(
                        project.area_ha
                      ).toLocaleString(
                        "en-IN",
                        {
                          maximumFractionDigits: 4,
                        }
                      )} ha`
                    : "Not available"}

                </span>

              </div>

              {/* AVAILABLE CREDITS */}

              <div className="mt-4 p-4 rounded-2xl bg-sand-50/70 dark:bg-[#071a20]/60 border border-ocean-900/5 dark:border-sand-100/5">

                <span className="block text-[10px] font-mono uppercase tracking-wider text-ink-soft dark:text-sand-100/50">
                  Available Credits
                </span>

                <span className="text-sm font-semibold text-ink dark:text-sand-50 block mt-1 font-mono">

                  {availableCredits.toLocaleString(
                    "en-IN"
                  )}

                </span>

              </div>

            </motion.div>

            {/* ==================================================
                CREDIT QUANTITY
                ================================================== */}

            <motion.div
              initial={{
                opacity: 0,
                y: 16,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                delay: 0.15,
              }}
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
                min={1}
                max={availableCredits}
                value={credits}
                onChange={(e) => {

                  const value =
                    Number(
                      e.target.value
                    );

                  if (
                    Number.isNaN(value)
                  ) {
                    setCredits(1);
                    return;
                  }

                  setCredits(
                    Math.min(
                      availableCredits,
                      Math.max(
                        1,
                        value
                      )
                    )
                  );
                }}
                className="w-full rounded-2xl border border-ocean-900/10 bg-sand-50/80 dark:border-sand-100/10 dark:bg-[#071a20] px-4 py-3.5 text-sm font-mono text-ink dark:text-sand-50 outline-none focus:ring-2 focus:ring-mangrove-500/30"
              />

              <p className="mt-2 text-[11px] text-ink-soft dark:text-sand-100/50">

                Maximum available:{" "}

                {availableCredits.toLocaleString(
                  "en-IN"
                )}{" "}

                credits

              </p>

            </motion.div>

            {/* ==================================================
                PAYMENT METHOD
                ================================================== */}

            <motion.div
              initial={{
                opacity: 0,
                y: 16,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                delay: 0.2,
              }}
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
                  onClick={() =>
                    setPaymentMethod(
                      "UPI"
                    )
                  }
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

                  {paymentMethod ===
                    "UPI" && (
                    <CheckCircle2
                      size={19}
                      className="text-mangrove-600 dark:text-mangrove-300"
                    />
                  )}

                </button>

                {/* CARD */}

                <button
                  type="button"
                  onClick={() =>
                    setPaymentMethod(
                      "CARD"
                    )
                  }
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

                  {paymentMethod ===
                    "CARD" && (
                    <CheckCircle2
                      size={19}
                      className="text-mangrove-600 dark:text-mangrove-300"
                    />
                  )}

                </button>

                {/* NET BANKING */}

                <button
                  type="button"
                  onClick={() =>
                    setPaymentMethod(
                      "NETBANKING"
                    )
                  }
                  className={`w-full flex items-center gap-4 rounded-2xl border p-4 text-left transition-all ${
                    paymentMethod ===
                    "NETBANKING"
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

                  {paymentMethod ===
                    "NETBANKING" && (
                    <CheckCircle2
                      size={19}
                      className="text-mangrove-600 dark:text-mangrove-300"
                    />
                  )}

                </button>

              </div>

            </motion.div>

          </div>

          {/* ====================================================
              RIGHT SIDE
              ==================================================== */}

          <div className="lg:col-span-5">

            <motion.div
              initial={{
                opacity: 0,
                y: 16,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                delay: 0.25,
              }}
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

                {/* CREDITS */}

                <div className="flex justify-between gap-4">

                  <span className="text-ink-soft dark:text-sand-100/60">
                    Carbon Credits
                  </span>

                  <span className="font-mono font-semibold">
                    {credits}
                  </span>

                </div>

                {/* PRICE */}

                <div className="flex justify-between gap-4">

                  <span className="text-ink-soft dark:text-sand-100/60">
                    Price per Credit
                  </span>

                  <span className="font-mono font-semibold">

                    ₹
                    {pricePerCredit.toLocaleString(
                      "en-IN"
                    )}

                  </span>

                </div>

                {/* SUBTOTAL */}

                <div className="flex justify-between gap-4">

                  <span className="text-ink-soft dark:text-sand-100/60">
                    Subtotal
                  </span>

                  <span className="font-mono font-semibold">

                    ₹
                    {subtotal.toLocaleString(
                      "en-IN"
                    )}

                  </span>

                </div>

                {/* PLATFORM FEE */}

                <div className="flex justify-between gap-4">

                  <span className="text-ink-soft dark:text-sand-100/60">
                    Platform Fee (2%)
                  </span>

                  <span className="font-mono font-semibold">

                    ₹
                    {platformFee.toLocaleString(
                      "en-IN"
                    )}

                  </span>

                </div>

                {/* TOTAL */}

                <div className="border-t border-ocean-900/5 dark:border-sand-100/5 pt-5 mt-5">

                  <div className="flex justify-between items-end gap-4">

                    <span className="text-sm font-semibold">
                      Total Amount
                    </span>

                    <span className="text-2xl font-display font-semibold font-mono text-mangrove-700 dark:text-mangrove-300">

                      ₹
                      {totalAmount.toLocaleString(
                        "en-IN"
                      )}

                    </span>

                  </div>

                </div>

              </div>

              {/* ==================================================
                  SECURITY
                  ================================================== */}

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

              {/* ==================================================
                  PAYMENT ERROR
                  ================================================== */}

              {paymentError && (
                <div className="mt-4 rounded-2xl border border-red-500/20 bg-red-500/10 p-4">

                  <div className="flex items-start gap-3">

                    <AlertCircle
                      size={18}
                      className="text-red-600 dark:text-red-400 shrink-0 mt-0.5"
                    />

                    <div>

                      <p className="text-xs font-semibold text-red-700 dark:text-red-300">
                        Payment Failed
                      </p>

                      <p className="mt-1 text-[11px] leading-relaxed text-red-700/80 dark:text-red-300/70">
                        {paymentError}
                      </p>

                    </div>

                  </div>

                </div>
              )}

              {/* ==================================================
                  PAY BUTTON
                  ================================================== */}

              <button
                type="button"
                disabled={
                  isProcessing ||
                  credits < 1 ||
                  credits > availableCredits
                }
                onClick={
                  handlePayment
                }
                className="mt-6 w-full inline-flex items-center justify-center gap-2 rounded-full bg-ocean-900 hover:bg-ocean-700 disabled:opacity-60 dark:bg-mangrove-500 dark:hover:bg-mangrove-300 dark:text-ink px-6 py-4 text-xs font-mono uppercase tracking-wider font-semibold text-sand-50 shadow-md transition-all focus:outline-none focus:ring-2 focus:ring-mangrove-500"
              >

                {isProcessing ? (
                  <>

                    <Loader2
                      size={15}
                      className="animate-spin"
                    />

                    Processing Payment...

                  </>
                ) : (
                  <>

                    Pay ₹
                    {totalAmount.toLocaleString(
                      "en-IN"
                    )}

                    <CheckCircle2 size={15} />

                  </>
                )}

              </button>

              <p className="mt-4 text-center text-[10px] font-mono text-ink-soft dark:text-sand-100/50">

                Payment Method:{" "}

                {paymentMethod}

              </p>

            </motion.div>

          </div>

        </div>

      </main>

      <Footer />

    </div>
  );
}
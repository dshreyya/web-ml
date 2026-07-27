"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  MailCheck,
  ArrowLeft,
  Loader2,
  RefreshCw,
  CheckCircle2,
  ExternalLink,
  ShieldCheck,
  Mail,
  Leaf,
} from "lucide-react";

import { ThemeToggle } from "@/components/theme-toggle";
import { ToastContainer, ToastMessage } from "@/components/ui/toast";
import { getSupabaseClient } from "@/lib/supabase";

function VerifyEmailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const emailParam = searchParams.get("email") || "user@organization.com";

  const [isResending, setIsResending] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Countdown timer for resending verification email
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0 && !canResend) {
      timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [countdown, canResend]);

  const addToast = (
    type: "success" | "error" | "info",
    title: string,
    description?: string
  ) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, type, title, description }]);

    setTimeout(() => {
      dismissToast(id);
    }, 5000);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const handleResendEmail = async () => {
    if (!canResend) return;

    setIsResending(true);
    try {
      const supabase = getSupabaseClient();

      if (supabase) {
        const { error } = await supabase.auth.resend({
          type: "signup",
          email: emailParam,
          options: {
            emailRedirectTo: `${window.location.origin}/login`,
          },
        });

        if (error) {
          addToast("error", "Resend Failed", error.message);
        } else {
          addToast(
            "success",
            "Verification Email Sent",
            `A fresh verification link was dispatched to ${emailParam}.`
          );
          setCanResend(false);
          setCountdown(60);
        }
      } else {
        // Demonstration fallback mode
        await new Promise((resolve) => setTimeout(resolve, 1000));
        addToast(
          "success",
          "Verification Link Sent",
          `A new verification link has been sent to ${emailParam}.`
        );
        setCanResend(false);
        setCountdown(60);
      }
    } catch (err) {
      addToast(
        "error",
        "An unexpected error occurred",
        err instanceof Error ? err.message : "Please try again later."
      );
    } finally {
      setIsResending(false);
    }
  };

  const handleCheckVerification = async () => {
    setIsChecking(true);

    try {
      const supabase = getSupabaseClient();

      if (supabase) {
        // Refresh session to check user status
        const { data: { user } } = await supabase.auth.getUser();

        if (user && user.email_confirmed_at) {
          setIsVerified(true);
          addToast(
            "success",
            "Email Verified!",
            "Your account is active. Redirecting to login..."
          );
          setTimeout(() => {
            router.push("/login");
          }, 2000);
        } else {
          addToast(
            "info",
            "Verification Pending",
            "We haven't detected your email confirmation yet. Please click the link in your email inbox."
          );
        }
      } else {
        // Demonstration verification check
        await new Promise((resolve) => setTimeout(resolve, 1200));
        setIsVerified(true);
        addToast(
          "success",
          "Email Verified Successfully",
          "Your BlueCarbon Nexus account is now active. Redirecting to login portal..."
        );
        setTimeout(() => {
          router.push("/login");
        }, 2000);
      }
    } catch (err) {
      addToast(
        "error",
        "Check Failed",
        err instanceof Error ? err.message : "Unable to verify email status."
      );
    } finally {
      setIsChecking(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      {/* Main Card */}
      <div className="rounded-[28px] border border-ocean-900/10 bg-white p-8 sm:p-10 shadow-soft dark:border-sand-100/10 dark:bg-[#0a232b]">
        {isVerified ? (
          /* Verified Success State */
          <div className="py-6 text-center space-y-4">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-mangrove-100 text-mangrove-700 dark:bg-mangrove-900/40 dark:text-mangrove-300">
              <CheckCircle2 size={34} />
            </div>

            <div>
              <span className="font-mono text-[11px] uppercase tracking-widest2 text-mangrove-700 dark:text-mangrove-300">
                Email Verified
              </span>
              <h2 className="mt-1 font-display text-2xl font-medium text-ink dark:text-sand-50">
                Account Activated!
              </h2>
            </div>

            <p className="text-sm text-ink-soft dark:text-sand-100/70 leading-relaxed">
              Your email address has been verified. You now have full access to the BlueCarbon Nexus MRV portal and asset registry.
            </p>

            <div className="pt-4">
              <Link
                href="/login"
                className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-ocean-900 px-6 py-3.5 text-sm font-medium text-sand-50 shadow-md hover:bg-ocean-700 transition-colors dark:bg-mangrove-500 dark:text-ink dark:hover:bg-mangrove-300"
              >
                <ShieldCheck size={18} />
                <span>Continue to Sign In</span>
              </Link>
            </div>
          </div>
        ) : (
          /* Pending Email Verification Interface */
          <div>
            {/* Header Icon & Branding */}
            <div className="flex flex-col items-center text-center">
              <div className="relative">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-ocean-100 text-ocean-900 shadow-card dark:bg-ocean-900/60 dark:text-mangrove-300">
                  <MailCheck size={30} strokeWidth={2} />
                </div>
                <div className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-mangrove-500 text-ink text-xs font-bold shadow">
                  <Leaf size={12} />
                </div>
              </div>

              <span className="mt-4 font-mono text-[11px] uppercase tracking-widest2 text-mangrove-700 dark:text-mangrove-300">
                Security Checklist
              </span>

              <h1 className="mt-2 font-display text-2xl sm:text-3xl font-medium tracking-tight text-ink dark:text-sand-50">
                Verify Your Email
              </h1>

              <p className="mt-2 text-sm text-ink-soft dark:text-sand-100/70 leading-relaxed">
                We have sent a verification link to activate your enterprise account. Please check your inbox and click the button to proceed.
              </p>
            </div>

            {/* Email Address Highlight Box */}
            <div className="mt-6 flex items-center justify-between gap-3 rounded-2xl border border-ocean-900/10 bg-sand-50/80 p-4 dark:border-sand-100/10 dark:bg-[#071a20]/70">
              <div className="flex items-center gap-3 overflow-hidden">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-ocean-900/10 text-ocean-900 dark:bg-sand-100/10 dark:text-sand-100">
                  <Mail size={18} />
                </div>
                <div className="min-w-0">
                  <p className="text-[11px] font-mono uppercase tracking-wider text-ink-soft dark:text-sand-100/60">
                    Sent to
                  </p>
                  <p className="text-sm font-semibold text-ink dark:text-sand-50 truncate">
                    {emailParam}
                  </p>
                </div>
              </div>

              <a
                href={`mailto:${emailParam}`}
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 flex items-center gap-1 text-xs font-medium text-mangrove-700 hover:text-mangrove-900 dark:text-mangrove-300 dark:hover:text-mangrove-150 transition-colors"
              >
                <span>Open Mail</span>
                <ExternalLink size={13} />
              </a>
            </div>

            {/* Main Action Buttons */}
            <div className="mt-6 space-y-3">
              {/* Check Verification Status */}
              <button
                type="button"
                onClick={handleCheckVerification}
                disabled={isChecking}
                className="w-full flex items-center justify-center gap-2 rounded-full bg-ocean-900 px-6 py-3.5 text-sm font-medium tracking-wide text-sand-50 shadow-md transition-all hover:bg-ocean-700 focus:outline-none focus:ring-2 focus:ring-mangrove-500 focus:ring-offset-2 disabled:opacity-50 dark:bg-mangrove-500 dark:text-ink dark:hover:bg-mangrove-300"
              >
                {isChecking ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    <span>Checking Status...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck size={18} />
                    <span>I&apos;ve Verified My Email</span>
                  </>
                )}
              </button>

              {/* Resend Verification Email Button */}
              <button
                type="button"
                onClick={handleResendEmail}
                disabled={!canResend || isResending}
                className="w-full flex items-center justify-center gap-2 rounded-full border border-ocean-900/15 bg-white px-5 py-3 text-sm font-medium text-ink shadow-sm hover:bg-sand-50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-mangrove-500 disabled:opacity-50 dark:border-sand-100/15 dark:bg-[#071a20] dark:text-sand-100 dark:hover:bg-[#082028]"
              >
                {isResending ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    <span>Resending Link...</span>
                  </>
                ) : (
                  <>
                    <RefreshCw size={15} />
                    <span>
                      {canResend
                        ? "Resend Verification Email"
                        : `Resend email in ${countdown}s`}
                    </span>
                  </>
                )}
              </button>
            </div>

            {/* Change Email or Back to Signup Link */}
            <div className="mt-8 text-center text-xs text-ink-soft dark:text-sand-100/70">
              Entered the wrong email address?{" "}
              <Link
                href="/signup"
                className="font-medium text-mangrove-700 hover:underline dark:text-mangrove-300"
              >
                Return to Signup
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Toast Notification Component */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <div className="min-h-screen bg-sand-100 dark:bg-[#061418] text-ink dark:text-sand-100 flex flex-col justify-between relative overflow-x-hidden">
      {/* Background ambient subtle glow */}
      <div className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2 h-[500px] w-[800px] rounded-full bg-gradient-to-b from-ocean-300/10 via-mangrove-300/10 to-transparent blur-3xl opacity-60 dark:from-ocean-900/20 dark:via-mangrove-900/20" />

      {/* Header */}
      <header className="relative z-10 container-page section-pad flex h-20 items-center justify-between">
        <Link
          href="/signup"
          className="inline-flex items-center gap-2 text-sm font-medium text-ink/70 hover:text-ink dark:text-sand-100/70 dark:hover:text-sand-50 transition-colors"
        >
          <ArrowLeft size={16} />
          <span>Back to Signup</span>
        </Link>

        <div className="flex items-center gap-3">
          <ThemeToggle />
        </div>
      </header>

      {/* Main Container */}
      <main className="relative z-10 flex-1 flex items-center justify-center section-pad py-12">
        <motion.div
          initial={{ opacity: 1, y: 0 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-md"
        >
          <Suspense
            fallback={
              <div className="flex items-center justify-center p-12 text-center text-sm text-ink-soft dark:text-sand-100/70">
                <Loader2 size={24} className="animate-spin text-ocean-900 dark:text-mangrove-300 mr-2" />
                Loading verification portal...
              </div>
            }
          >
            <VerifyEmailContent />
          </Suspense>
        </motion.div>
      </main>

      {/* Footer Branding */}
      <footer className="relative z-10 container-page section-pad py-6 text-center text-xs text-ink-faint dark:text-sand-100/40">
        © {new Date().getFullYear()} BlueCarbon Nexus. Verified Blockchain MRV Registry.
      </footer>
    </div>
  );
}

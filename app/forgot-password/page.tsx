"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion } from "framer-motion";
import {
  Leaf,
  ArrowLeft,
  Loader2,
  Mail,
  CheckCircle2,
  Send,
  RotateCcw,
} from "lucide-react";

import { ThemeToggle } from "@/components/theme-toggle";
import { ToastContainer, ToastMessage } from "@/components/ui/toast";
import { getSupabaseClient } from "@/lib/supabase";

// Validation Schema
const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Email address is required" })
    .email({ message: "Please enter a valid email address" }),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState("");
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (type: "success" | "error" | "info", title: string, description?: string) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, type, title, description }]);

    setTimeout(() => {
      dismissToast(id);
    }, 5000);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setIsLoading(true);

    try {
      const supabase = getSupabaseClient();

      if (supabase) {
        // Real Supabase password reset call
        const { error } = await supabase.auth.resetPasswordForEmail(data.email, {
          redirectTo: `${window.location.origin}/login`,
        });

        if (error) {
          addToast("error", "Reset Request Failed", error.message);
        } else {
          setSubmittedEmail(data.email);
          setIsSubmitted(true);
          addToast(
            "success",
            "Reset Link Dispatched",
            `A password reset link has been sent to ${data.email}.`
          );
        }
      } else {
        // Fallback demo mode when Supabase env keys are not provided
        await new Promise((resolve) => setTimeout(resolve, 1000));

        setSubmittedEmail(data.email);
        setIsSubmitted(true);
        addToast(
          "success",
          "Reset Email Sent",
          `Instructions to reset your password have been dispatched to ${data.email}.`
        );
      }
    } catch (err) {
      addToast(
        "error",
        "An unexpected error occurred",
        err instanceof Error ? err.message : "Please try again later."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (!submittedEmail) return;
    setIsLoading(true);

    try {
      const supabase = getSupabaseClient();
      if (supabase) {
        await supabase.auth.resetPasswordForEmail(submittedEmail, {
          redirectTo: `${window.location.origin}/login`,
        });
      } else {
        await new Promise((resolve) => setTimeout(resolve, 800));
      }
      addToast(
        "success",
        "Reset Link Resent",
        `A fresh password reset email was dispatched to ${submittedEmail}.`
      );
    } catch {
      addToast("error", "Resend Failed", "Unable to resend reset email at this moment.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-sand-100 dark:bg-[#061418] text-ink dark:text-sand-100 flex flex-col justify-between relative overflow-x-hidden">
      {/* Background ambient subtle glow */}
      <div className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2 h-[500px] w-[800px] rounded-full bg-gradient-to-b from-ocean-300/10 via-mangrove-300/10 to-transparent blur-3xl opacity-60 dark:from-ocean-900/20 dark:via-mangrove-900/20" />

      {/* Navigation Header */}
      <header className="relative z-10 container-page section-pad flex h-20 items-center justify-between">
        <Link
          href="/login"
          className="inline-flex items-center gap-2 text-sm font-medium text-ink/70 hover:text-ink dark:text-sand-100/70 dark:hover:text-sand-50 transition-colors"
        >
          <ArrowLeft size={16} />
          <span>Back to Login</span>
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
          {/* Main Card */}
          <div className="rounded-[28px] border border-ocean-900/10 bg-white p-8 sm:p-10 shadow-soft dark:border-sand-100/10 dark:bg-[#0a232b]">
            {isSubmitted ? (
              /* Success State */
              <div className="py-4 text-center space-y-5">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-mangrove-100 text-mangrove-700 dark:bg-mangrove-900/40 dark:text-mangrove-300">
                  <CheckCircle2 size={32} />
                </div>

                <div>
                  <span className="font-mono text-[11px] uppercase tracking-widest2 text-mangrove-700 dark:text-mangrove-300">
                    Email Sent
                  </span>
                  <h2 className="mt-1 font-display text-2xl font-medium text-ink dark:text-sand-50">
                    Check Your Inbox
                  </h2>
                </div>

                <p className="text-sm text-ink-soft dark:text-sand-100/70 leading-relaxed">
                  We have sent password recovery instructions to{" "}
                  <strong className="text-ink dark:text-sand-100 font-semibold">
                    {submittedEmail}
                  </strong>
                  . Click the link in the email to set a new password.
                </p>

                <div className="pt-4 space-y-3">
                  <Link
                    href="/login"
                    className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-ocean-900 px-6 py-3.5 text-sm font-medium text-sand-50 shadow-md hover:bg-ocean-700 transition-colors dark:bg-mangrove-500 dark:text-ink dark:hover:bg-mangrove-300"
                  >
                    Return to Login
                  </Link>

                  <button
                    type="button"
                    onClick={handleResend}
                    disabled={isLoading}
                    className="w-full flex items-center justify-center gap-2 text-xs font-medium text-ink-soft hover:text-ink dark:text-sand-100/70 dark:hover:text-sand-100 transition-colors py-1 disabled:opacity-50"
                  >
                    {isLoading ? (
                      <Loader2 size={14} className="animate-spin" />
                    ) : (
                      <RotateCcw size={14} />
                    )}
                    <span>Didn&apos;t receive the email? Resend link</span>
                  </button>
                </div>
              </div>
            ) : (
              /* Password Reset Request Form */
              <>
                {/* Logo and Header */}
                <div className="flex flex-col items-center text-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-ocean-900 text-mangrove-300 shadow-card dark:bg-mangrove-500 dark:text-ink">
                    <Leaf size={22} strokeWidth={2.25} />
                  </div>

                  <span className="mt-4 font-mono text-[11px] uppercase tracking-widest2 text-mangrove-700 dark:text-mangrove-300">
                    Account Recovery
                  </span>

                  <h1 className="mt-2 font-display text-2xl sm:text-3xl font-medium tracking-tight text-ink dark:text-sand-50">
                    Reset Password
                  </h1>

                  <p className="mt-2 text-sm text-ink-soft dark:text-sand-100/70">
                    Enter the email address associated with your BlueCarbon Nexus account to receive a reset link.
                  </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5">
                  {/* Email Field */}
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-ink-soft dark:text-sand-100/70 mb-2">
                      Email Address
                    </label>
                    <div className="relative">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-ink-faint dark:text-sand-100/40">
                        <Mail size={17} />
                      </div>
                      <input
                        type="email"
                        placeholder="name@organization.com"
                        {...register("email")}
                        className={`w-full rounded-xl border bg-sand-50/50 pl-10 pr-4 py-3 text-sm text-ink placeholder:text-ink-faint/60 transition-all focus:bg-white focus:outline-none focus:ring-2 dark:bg-[#071a20]/60 dark:text-sand-50 dark:placeholder:text-sand-100/40 ${
                          errors.email
                            ? "border-red-400 focus:ring-red-400"
                            : "border-ocean-900/15 focus:border-mangrove-500 focus:ring-mangrove-500/30 dark:border-sand-100/15"
                        }`}
                      />
                    </div>
                    {errors.email && (
                      <p className="mt-1.5 text-xs text-red-500 dark:text-red-400 font-medium">
                        {errors.email.message}
                      </p>
                    )}
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full flex items-center justify-center gap-2 rounded-full bg-ocean-900 px-6 py-3.5 text-sm font-medium tracking-wide text-sand-50 shadow-md transition-all hover:bg-ocean-700 focus:outline-none focus:ring-2 focus:ring-mangrove-500 focus:ring-offset-2 disabled:opacity-50 dark:bg-mangrove-500 dark:text-ink dark:hover:bg-mangrove-300"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 size={18} className="animate-spin" />
                        <span>Sending Link...</span>
                      </>
                    ) : (
                      <>
                        <Send size={17} />
                        <span>Send Reset Link</span>
                      </>
                    )}
                  </button>
                </form>

                {/* Back to Login Footer */}
                <div className="mt-8 text-center text-xs text-ink-soft dark:text-sand-100/70">
                  Remember your password?{" "}
                  <Link
                    href="/login"
                    className="font-medium text-mangrove-700 hover:underline dark:text-mangrove-300"
                  >
                    Log In
                  </Link>
                </div>
              </>
            )}
          </div>
        </motion.div>
      </main>

      {/* Footer Branding */}
      <footer className="relative z-10 container-page section-pad py-6 text-center text-xs text-ink-faint dark:text-sand-100/40">
        © {new Date().getFullYear()} BlueCarbon Nexus. Verified Blockchain MRV Registry.
      </footer>

      {/* Toast Notification Layer */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}

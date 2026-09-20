"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion } from "framer-motion";
import {
  Eye,
  EyeOff,
  Leaf,
  ArrowLeft,
  Loader2,
  Lock,
  CheckCircle2,
  KeyRound,
} from "lucide-react";

import { ThemeToggle } from "@/components/theme-toggle";
import { ToastContainer, ToastMessage } from "@/components/ui/toast";
import { getSupabaseClient } from "@/lib/supabase";

// Password strength calculator
function calculatePasswordStrength(password: string) {
  let score = 0;
  if (!password) return { score: 0, label: "", color: "bg-gray-200 dark:bg-gray-700" };

  if (password.length >= 8) score += 1;
  if (password.length >= 12) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/[0-9]/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;

  if (score <= 2) {
    return { score: 33, label: "Weak", color: "bg-red-500", text: "text-red-500" };
  } else if (score <= 4) {
    return { score: 66, label: "Medium", color: "bg-amber-500", text: "text-amber-500" };
  } else {
    return { score: 100, label: "Strong", color: "bg-mangrove-500", text: "text-mangrove-600 dark:text-mangrove-400" };
  }
}

// Zod Validation Schema
const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(1, { message: "New password is required" })
      .min(8, { message: "Password must be at least 8 characters" })
      .refine((val) => /[A-Z]/.test(val), {
        message: "Password must contain at least one uppercase letter",
      })
      .refine((val) => /[0-9]/.test(val) || /[^A-Za-z0-9]/.test(val), {
        message: "Password must contain at least one number or special character",
      }),
    confirmPassword: z.string().min(1, { message: "Please confirm your password" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

export default function ResetPasswordPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
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
    watch,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const watchPassword = watch("password", "");
  const passwordStrength = calculatePasswordStrength(watchPassword);

  const onSubmit = async (data: ResetPasswordFormData) => {
    setIsLoading(true);

    try {
      const supabase = getSupabaseClient();

      if (supabase) {
        // Real Supabase update password call
        const { error } = await supabase.auth.updateUser({
          password: data.password,
        });

        if (error) {
          addToast("error", "Password Reset Failed", error.message);
        } else {
          setIsSuccess(true);
          addToast(
            "success",
            "Password Updated Successfully",
            "Your password has been changed. Redirecting to login..."
          );

          setTimeout(() => {
            router.push("/login");
          }, 2500);
        }
      } else {
        // Fallback demo mode when Supabase env keys are not provided
        await new Promise((resolve) => setTimeout(resolve, 1200));

        setIsSuccess(true);
        addToast(
          "success",
          "Password Reset Successful",
          "Your credentials have been securely updated. Redirecting to login..."
        );

        setTimeout(() => {
          router.push("/login");
        }, 2500);
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
            {isSuccess ? (
              /* Success State */
              <div className="py-6 text-center space-y-4">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-mangrove-100 text-mangrove-700 dark:bg-mangrove-900/40 dark:text-mangrove-300">
                  <CheckCircle2 size={32} />
                </div>

                <div>
                  <span className="font-mono text-[11px] uppercase tracking-widest2 text-mangrove-700 dark:text-mangrove-300">
                    Security Update Complete
                  </span>
                  <h2 className="mt-1 font-display text-2xl font-medium text-ink dark:text-sand-50">
                    Password Reset Successful
                  </h2>
                </div>

                <p className="text-sm text-ink-soft dark:text-sand-100/70 leading-relaxed">
                  Your password has been successfully updated. You can now log into your BlueCarbon Nexus enterprise portal using your new credentials.
                </p>

                <div className="pt-4">
                  <Link
                    href="/login"
                    className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-ocean-900 px-6 py-3.5 text-sm font-medium text-sand-50 shadow-md hover:bg-ocean-700 transition-colors dark:bg-mangrove-500 dark:text-ink dark:hover:bg-mangrove-300"
                  >
                    Proceed to Login
                  </Link>
                </div>
              </div>
            ) : (
              /* Reset Password Form */
              <>
                {/* Logo and Header */}
                <div className="flex flex-col items-center text-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-ocean-900 text-mangrove-300 shadow-card dark:bg-mangrove-500 dark:text-ink">
                    <Leaf size={22} strokeWidth={2.25} />
                  </div>

                  <span className="mt-4 font-mono text-[11px] uppercase tracking-widest2 text-mangrove-700 dark:text-mangrove-300">
                    Security Credentials
                  </span>

                  <h1 className="mt-2 font-display text-2xl sm:text-3xl font-medium tracking-tight text-ink dark:text-sand-50">
                    Set New Password
                  </h1>

                  <p className="mt-2 text-sm text-ink-soft dark:text-sand-100/70">
                    Please create a strong password to secure your BlueCarbon Nexus account.
                  </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-4">
                  {/* New Password Field */}
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-ink-soft dark:text-sand-100/70 mb-1.5">
                      New Password
                    </label>
                    <div className="relative">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-ink-faint dark:text-sand-100/40">
                        <Lock size={17} />
                      </div>
                      <input
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••••••"
                        {...register("password")}
                        className={`w-full rounded-xl border bg-sand-50/50 pl-10 pr-11 py-2.5 text-sm text-ink placeholder:text-ink-faint/60 transition-all focus:bg-white focus:outline-none focus:ring-2 dark:bg-[#071a20]/60 dark:text-sand-50 dark:placeholder:text-sand-100/40 ${
                          errors.password
                            ? "border-red-400 focus:ring-red-400"
                            : "border-ocean-900/15 focus:border-mangrove-500 focus:ring-mangrove-500/30 dark:border-sand-100/15"
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-ink-faint hover:text-ink dark:text-sand-100/40 dark:hover:text-sand-100 transition-colors"
                        aria-label={showPassword ? "Hide password" : "Show password"}
                      >
                        {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                      </button>
                    </div>

                    {/* Dynamic Password Strength Indicator */}
                    {watchPassword.length > 0 && (
                      <div className="mt-2 space-y-1">
                        <div className="flex items-center justify-between text-[11px] font-mono">
                          <span className="text-ink-soft dark:text-sand-100/60">Strength</span>
                          <span className={`font-semibold ${passwordStrength.text}`}>
                            {passwordStrength.label}
                          </span>
                        </div>
                        <div className="h-1.5 w-full bg-sand-200 dark:bg-[#071a20] rounded-full overflow-hidden">
                          <div
                            className={`h-full transition-all duration-300 ${passwordStrength.color}`}
                            style={{ width: `${passwordStrength.score}%` }}
                          />
                        </div>
                      </div>
                    )}

                    {errors.password && (
                      <p className="mt-1 text-xs text-red-500 dark:text-red-400 font-medium">
                        {errors.password.message}
                      </p>
                    )}
                  </div>

                  {/* Confirm Password Field */}
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-ink-soft dark:text-sand-100/70 mb-1.5">
                      Confirm New Password
                    </label>
                    <div className="relative">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-ink-faint dark:text-sand-100/40">
                        <Lock size={17} />
                      </div>
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="••••••••••••"
                        {...register("confirmPassword")}
                        className={`w-full rounded-xl border bg-sand-50/50 pl-10 pr-11 py-2.5 text-sm text-ink placeholder:text-ink-faint/60 transition-all focus:bg-white focus:outline-none focus:ring-2 dark:bg-[#071a20]/60 dark:text-sand-50 dark:placeholder:text-sand-100/40 ${
                          errors.confirmPassword
                            ? "border-red-400 focus:ring-red-400"
                            : "border-ocean-900/15 focus:border-mangrove-500 focus:ring-mangrove-500/30 dark:border-sand-100/15"
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-ink-faint hover:text-ink dark:text-sand-100/40 dark:hover:text-sand-100 transition-colors"
                        aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                      >
                        {showConfirmPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                      </button>
                    </div>
                    {errors.confirmPassword && (
                      <p className="mt-1 text-xs text-red-500 dark:text-red-400 font-medium">
                        {errors.confirmPassword.message}
                      </p>
                    )}
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full flex items-center justify-center gap-2 rounded-full bg-ocean-900 px-6 py-3.5 text-sm font-medium tracking-wide text-sand-50 shadow-md transition-all hover:bg-ocean-700 focus:outline-none focus:ring-2 focus:ring-mangrove-500 focus:ring-offset-2 disabled:opacity-50 dark:bg-mangrove-500 dark:text-ink dark:hover:bg-mangrove-300 mt-3"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 size={18} className="animate-spin" />
                        <span>Updating Password...</span>
                      </>
                    ) : (
                      <>
                        <KeyRound size={17} />
                        <span>Reset Password</span>
                      </>
                    )}
                  </button>
                </form>

                {/* Return to Login Link */}
                <div className="mt-8 text-center text-xs text-ink-soft dark:text-sand-100/70">
                  Remembered your password?{" "}
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

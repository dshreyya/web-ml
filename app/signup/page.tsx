"use client";

import { useState, useEffect } from "react";
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
  Mail,
  User,
  CheckCircle2,
  UserPlus,
  ShieldAlert,
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
const signupSchema = z
  .object({
    fullName: z
      .string()
      .min(1, { message: "Full name is required" })
      .min(2, { message: "Name must be at least 2 characters" }),
    email: z
      .string()
      .min(1, { message: "Email address is required" })
      .email({ message: "Please enter a valid email address" }),
    password: z
      .string()
      .min(1, { message: "Password is required" })
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

type SignupFormData = z.infer<typeof signupSchema>;

export default function SignupPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    const supabase = getSupabaseClient();
    if (!supabase) return;

    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        router.push("/");
      }
    });
  }, [router]);

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
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const watchPassword = watch("password", "");
  const passwordStrength = calculatePasswordStrength(watchPassword);

  const onSubmit = async (data: SignupFormData) => {
    setIsLoading(true);

    try {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const supabase = getSupabaseClient();

      console.log("[Signup] Runtime NEXT_PUBLIC_SUPABASE_URL:", supabaseUrl ? `${supabaseUrl.substring(0, 20)}...` : "UNDEFINED");
      console.log("[Signup] Supabase Client Initialized:", !!supabase);

      if (supabase) {
        const storedRole = localStorage.getItem("selectedRole") || "farmer";

        // Real Supabase Auth Signup
        console.log("[Signup] Calling supabase.auth.signUp for email:", data.email);
        const { error, data: authData } = await supabase.auth.signUp({
          email: data.email,
          password: data.password,
          options: {
            data: {
              full_name: data.fullName,
              role: storedRole,
            },
            emailRedirectTo: `${window.location.origin}/verify-email`,
          },
        });

        console.log("[Signup Response] data:", authData);
        console.log("[Signup Response] error:", error);

        if (error) {
          if (error.message.toLowerCase().includes("email signups are disabled") || error.code === "email_provider_disabled") {
            addToast(
              "error",
              "Email Provider Disabled in Supabase",
              "Please enable 'Email' provider in your Supabase Dashboard under Authentication -> Providers -> Email."
            );
          } else {
            addToast("error", "Registration Failed", error.message);
          }
        } else {
          addToast(
            "success",
            "Account Created!",
            "Verification email sent. Please check your inbox to activate your account."
          );
          setIsSuccess(true);
          // Redirect to email verification notice after short delay
          setTimeout(() => {
            router.push(`/verify-email?email=${encodeURIComponent(data.email)}`);
          }, 1500);
        }
      } else {
        console.warn("[Signup] Supabase client is NOT initialized. Check NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY environment variables.");
        addToast(
          "error",
          "Supabase Not Configured",
          "Unable to connect to Supabase authentication server. Please verify environment variables."
        );
      }
    } catch (err) {
      console.error("[Signup] Unexpected exception during signup:", err);
      addToast(
        "error",
        "An unexpected error occurred",
        err instanceof Error ? err.message : "Please try again later."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    setIsLoading(true);
    try {
      const supabase = getSupabaseClient();
      if (supabase) {
        const { error } = await supabase.auth.signInWithOAuth({
          provider: "google",
          options: {
            redirectTo: `${window.location.origin}/signup`,
          },
        });
        if (error) {
          addToast("error", "Google Signup Error", error.message);
        }
      } else {
        await new Promise((resolve) => setTimeout(resolve, 800));
        addToast(
          "info",
          "Google OAuth Setup",
          "Google Sign-Up initiated. Connect Supabase credentials to complete live OAuth account creation."
        );
      }
    } catch {
      addToast("error", "OAuth Failure", "Unable to complete Google registration.");
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
          href="/"
          className="inline-flex items-center gap-2 text-sm font-medium text-ink/70 hover:text-ink dark:text-sand-100/70 dark:hover:text-sand-50 transition-colors"
        >
          <ArrowLeft size={16} />
          <span>Back to Home</span>
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
              /* Success Email Verification State */
              <div className="py-6 text-center space-y-4">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-mangrove-100 text-mangrove-700 dark:bg-mangrove-900/40 dark:text-mangrove-300">
                  <CheckCircle2 size={32} />
                </div>

                <h2 className="font-display text-2xl font-medium text-ink dark:text-sand-50">
                  Verify Your Email
                </h2>

                <p className="text-sm text-ink-soft dark:text-sand-100/70 leading-relaxed">
                  We&apos;ve sent a confirmation link to your email address. Please click the link in the message to activate your account and access BlueCarbon Nexus.
                </p>

                <div className="pt-4 space-y-3">
                  <Link
                    href="/login"
                    className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-ocean-900 px-6 py-3 text-sm font-medium text-sand-50 shadow-md hover:bg-ocean-700 transition-colors dark:bg-mangrove-500 dark:text-ink dark:hover:bg-mangrove-300"
                  >
                    Proceed to Login
                  </Link>

                  <button
                    onClick={() => setIsSuccess(false)}
                    className="text-xs text-ink-soft hover:text-ink dark:text-sand-100/60 dark:hover:text-sand-100 transition-colors"
                  >
                    Need to change email address?
                  </button>
                </div>
              </div>
            ) : (
              /* Registration Form */
              <>
                {/* Logo and Header */}
                <div className="flex flex-col items-center text-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-ocean-900 text-mangrove-300 shadow-card dark:bg-mangrove-500 dark:text-ink">
                    <Leaf size={22} strokeWidth={2.25} />
                  </div>

                  <span className="mt-4 font-mono text-[11px] uppercase tracking-widest2 text-mangrove-700 dark:text-mangrove-300">
                    Create Enterprise Account
                  </span>

                  <h1 className="mt-2 font-display text-2xl sm:text-3xl font-medium tracking-tight text-ink dark:text-sand-50">
                    Join BlueCarbon Nexus
                  </h1>

                  <p className="mt-2 text-sm text-ink-soft dark:text-sand-100/70">
                    Register to buy, issue, or monitor verified coastal blue carbon credits.
                  </p>
                </div>

                {/* Google OAuth Button */}
                <div className="mt-8">
                  <button
                    type="button"
                    onClick={handleGoogleSignup}
                    disabled={isLoading}
                    className="w-full flex items-center justify-center gap-3 rounded-full border border-ocean-900/15 bg-white px-5 py-3 text-sm font-medium text-ink shadow-sm hover:bg-sand-50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-mangrove-500 disabled:opacity-50 dark:border-sand-100/15 dark:bg-[#071a20] dark:text-sand-100 dark:hover:bg-[#082028]"
                  >
                    <svg className="h-4 w-4" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                      />
                    </svg>
                    <span>Continue with Google</span>
                  </button>
                </div>

                {/* Divider */}
                <div className="relative my-6 flex items-center justify-center">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-ocean-900/10 dark:border-sand-100/10" />
                  </div>
                  <span className="relative bg-white dark:bg-[#0a232b] px-3 text-xs font-mono uppercase tracking-wider text-ink-faint dark:text-sand-100/50">
                    Or register with email
                  </span>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  {/* Full Name Field */}
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-ink-soft dark:text-sand-100/70 mb-1.5">
                      Full Name
                    </label>
                    <div className="relative">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-ink-faint dark:text-sand-100/40">
                        <User size={17} />
                      </div>
                      <input
                        type="text"
                        placeholder="Dr. Elena Rostova"
                        {...register("fullName")}
                        className={`w-full rounded-xl border bg-sand-50/50 pl-10 pr-4 py-2.5 text-sm text-ink placeholder:text-ink-faint/60 transition-all focus:bg-white focus:outline-none focus:ring-2 dark:bg-[#071a20]/60 dark:text-sand-50 dark:placeholder:text-sand-100/40 ${
                          errors.fullName
                            ? "border-red-400 focus:ring-red-400"
                            : "border-ocean-900/15 focus:border-mangrove-500 focus:ring-mangrove-500/30 dark:border-sand-100/15"
                        }`}
                      />
                    </div>
                    {errors.fullName && (
                      <p className="mt-1 text-xs text-red-500 dark:text-red-400 font-medium">
                        {errors.fullName.message}
                      </p>
                    )}
                  </div>

                  {/* Email Field */}
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-ink-soft dark:text-sand-100/70 mb-1.5">
                      Email Address
                    </label>
                    <div className="relative">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-ink-faint dark:text-sand-100/40">
                        <Mail size={17} />
                      </div>
                      <input
                        type="email"
                        placeholder="elena@climatefund.org"
                        {...register("email")}
                        className={`w-full rounded-xl border bg-sand-50/50 pl-10 pr-4 py-2.5 text-sm text-ink placeholder:text-ink-faint/60 transition-all focus:bg-white focus:outline-none focus:ring-2 dark:bg-[#071a20]/60 dark:text-sand-50 dark:placeholder:text-sand-100/40 ${
                          errors.email
                            ? "border-red-400 focus:ring-red-400"
                            : "border-ocean-900/15 focus:border-mangrove-500 focus:ring-mangrove-500/30 dark:border-sand-100/15"
                        }`}
                      />
                    </div>
                    {errors.email && (
                      <p className="mt-1 text-xs text-red-500 dark:text-red-400 font-medium">
                        {errors.email.message}
                      </p>
                    )}
                  </div>

                  {/* Password Field */}
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-ink-soft dark:text-sand-100/70 mb-1.5">
                      Password
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
                      Confirm Password
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
                    className="w-full flex items-center justify-center gap-2 rounded-full bg-ocean-900 px-6 py-3.5 text-sm font-medium tracking-wide text-sand-50 shadow-md transition-all hover:bg-ocean-700 focus:outline-none focus:ring-2 focus:ring-mangrove-500 focus:ring-offset-2 disabled:opacity-50 dark:bg-mangrove-500 dark:text-ink dark:hover:bg-mangrove-300 mt-2"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 size={18} className="animate-spin" />
                        <span>Creating Account...</span>
                      </>
                    ) : (
                      <>
                        <UserPlus size={18} />
                        <span>Create Account</span>
                      </>
                    )}
                  </button>
                </form>

                {/* Account Login Footer */}
                <div className="mt-8 text-center text-xs text-ink-soft dark:text-sand-100/70">
                  Already have an account?{" "}
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
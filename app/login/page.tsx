"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
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
  ShieldCheck,
} from "lucide-react";

import { ThemeToggle } from "@/components/theme-toggle";
import {
  ToastContainer,
  ToastMessage,
} from "@/components/ui/toast";
import { getSupabaseClient } from "@/lib/supabase";

// =====================================================
// VALIDATION SCHEMA
// =====================================================

const loginSchema = z.object({
  email: z
    .string()
    .min(1, {
      message: "Email address is required",
    })
    .email({
      message: "Please enter a valid email address",
    }),

  password: z
    .string()
    .min(1, {
      message: "Password is required",
    })
    .min(6, {
      message: "Password must be at least 6 characters",
    }),

  rememberMe: z.boolean(),
});

type LoginFormData = z.infer<typeof loginSchema>;

// =====================================================
// LOGIN PAGE
// =====================================================

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // ===================================================
  // SELECTED ROLE
  // ===================================================

  const [selectedRole, setSelectedRole] =
    useState<string>("farmer");

  useEffect(() => {
    const roleFromUrl = searchParams.get("role");

    const roleFromStorage =
      typeof window !== "undefined"
        ? localStorage.getItem("selectedRole")
        : null;

    const role =
      roleFromUrl ||
      roleFromStorage ||
      "farmer";

    setSelectedRole(role);

    if (typeof window !== "undefined") {
      localStorage.setItem(
        "selectedRole",
        role
      );
    }
  }, [searchParams]);

  // ===================================================
  // STATES
  // ===================================================

  const [showPassword, setShowPassword] =
    useState(false);

  const [isLoading, setIsLoading] =
    useState(false);

  const [toasts, setToasts] =
    useState<ToastMessage[]>([]);

  // ===================================================
  // TOAST
  // ===================================================

  const addToast = (
    type: "success" | "error" | "info",
    title: string,
    description?: string
  ) => {
    const id = Math.random()
      .toString(36)
      .substring(2, 9);

    setToasts((prev) => [
      ...prev,
      {
        id,
        type,
        title,
        description,
      },
    ]);

    setTimeout(() => {
      dismissToast(id);
    }, 5000);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) =>
      prev.filter(
        (toast) => toast.id !== id
      )
    );
  };

  // ===================================================
  // ROLE REDIRECT
  // ===================================================

  const handleRoleRedirect = async (
    userRole?: string
  ) => {
    const role =
      userRole || selectedRole;

    console.log(
      "Redirecting with role:",
      role
    );

    // =================================================
    // FARMER
    // =================================================

    if (role === "farmer") {
      router.push(
        "/farmer/onboarding"
      );

      return;
    }

    // =================================================
    // INDUSTRY
    // =================================================

    if (role === "buyer") {
      console.log(
        "Checking industry onboarding status..."
      );

      const supabase =
        getSupabaseClient();

      if (!supabase) {
        console.error(
          "Supabase client unavailable."
        );

        router.push(
          "/industry/onboarding"
        );

        return;
      }

      try {
        // =============================================
        // GET CURRENT USER
        // =============================================

        const {
          data: {
            user,
          },
          error: userError,
        } =
          await supabase.auth.getUser();

        if (userError || !user) {
          console.error(
            "Unable to get logged-in user:",
            userError?.message
          );

          router.push(
            "/login?role=buyer"
          );

          return;
        }

        console.log(
          "Industry user ID:",
          user.id
        );

        // =============================================
        // GET THIS USER'S INDUSTRY PROFILE
        // =============================================

        const {
          data: profile,
          error: profileError,
        } =
          await supabase
            .from("industry_profiles")
            .select(
              "id, onboarding_status"
            )
            .eq(
              "user_id",
              user.id
            )
            .maybeSingle();

        if (profileError) {
          console.error(
            "Industry profile error:",
            profileError
          );

          addToast(
            "error",
            "Unable to Load Profile",
            profileError.message
          );

          router.push(
            "/industry/onboarding"
          );

          return;
        }

        // =============================================
        // NO PROFILE
        // =============================================

        if (!profile) {
          console.log(
            "No industry profile found."
          );

          router.push(
            "/industry/onboarding"
          );

          return;
        }

        const status =
          profile.onboarding_status;

        console.log(
          "Industry profile ID:",
          profile.id
        );

        console.log(
          "Industry onboarding status:",
          status
        );

        // =============================================
        // APPROVED
        // =============================================

        if (status === "APPROVED") {
          console.log(
            "Industry account approved."
          );

          console.log(
            "Redirecting to industry dashboard."
          );

          router.push(
            "/industry/dashboard"
          );

          return;
        }

        // =============================================
        // PENDING VERIFICATION
        // =============================================

        if (
          status ===
          "PENDING_VERIFICATION"
        ) {
          console.log(
            "Industry application is pending Authority verification."
          );

          router.push(
            "/industry/onboarding/verification"
          );

          return;
        }

        // =============================================
        // PENDING DOCUMENTS
        // =============================================

        if (
          status ===
          "PENDING_DOCUMENTS"
        ) {
          console.log(
            "Industry documents are pending."
          );

          router.push(
            "/industry/onboarding/documents"
          );

          return;
        }

        // =============================================
        // REJECTED
        // =============================================

        if (
          status === "REJECTED"
        ) {
          console.log(
            "Industry application was rejected."
          );

          router.push(
            "/industry/onboarding/verification"
          );

          return;
        }

        // =============================================
        // DRAFT
        // =============================================

        if (
          status === "DRAFT"
        ) {
          console.log(
            "Industry profile is still a draft."
          );

          router.push(
            "/industry/onboarding/profile"
          );

          return;
        }

        // =============================================
        // UNKNOWN STATUS
        // =============================================

        console.log(
          "Unknown onboarding status:",
          status
        );

        router.push(
          "/industry/onboarding"
        );

      } catch (error) {
        console.error(
          "Industry redirect error:",
          error
        );

        addToast(
          "error",
          "Unable to Load Account",
          "We could not determine your Industry account status."
        );

        router.push(
          "/industry/onboarding"
        );
      }

      return;
    }

    // =================================================
    // ADMIN
    // =================================================

    if (role === "admin") {
      router.push(
        "/admin/dashboard"
      );

      return;
    }

    // =================================================
    // UNKNOWN ROLE
    // =================================================

    router.push("/");
  };

  // ===================================================
  // FORM
  // ===================================================

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),

    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  // ===================================================
  // EMAIL LOGIN
  // ===================================================

  const onSubmit = async (
    data: LoginFormData
  ) => {
    console.log(
      "Login submitted"
    );

    console.log(
      "Selected portal:",
      selectedRole
    );

    setIsLoading(true);

    try {
      const supabase =
        getSupabaseClient();

      // =================================================
      // SUPABASE LOGIN
      // =================================================

      if (supabase) {
        console.log(
          "Calling Supabase login..."
        );

        const {
          data: authData,
          error,
        } =
          await supabase.auth.signInWithPassword(
            {
              email: data.email,
              password: data.password,
            }
          );

        // ===============================================
        // LOGIN ERROR
        // ===============================================

        if (error) {
          console.error(
            "Supabase login error:",
            error.message
          );

          if (
            error.message
              .toLowerCase()
              .includes(
                "email not confirmed"
              )
          ) {
            addToast(
              "error",
              "Email Verification Required",
              "Your email has not been confirmed yet. Please verify your email inbox."
            );

            setTimeout(() => {
              router.push(
                `/verify-email?email=${encodeURIComponent(
                  data.email
                )}&role=${encodeURIComponent(
                  selectedRole
                )}`
              );
            }, 2000);
          } else if (
            error.message
              .toLowerCase()
              .includes(
                "email logins are disabled"
              ) ||
            error.code ===
              "email_provider_disabled"
          ) {
            addToast(
              "error",
              "Email Provider Disabled",
              "Please enable the Email provider in Supabase Authentication settings."
            );
          } else {
            addToast(
              "error",
              "Authentication Failed",
              error.message
            );
          }

          return;
        }

        // ===============================================
        // USER SUCCESSFULLY AUTHENTICATED
        // ===============================================

        const user =
          authData.user;

        if (!user) {
          addToast(
            "error",
            "Authentication Failed",
            "No authenticated user was returned by Supabase."
          );

          return;
        }

        const userRole =
          user.user_metadata?.role;

        console.log(
          "Selected portal:",
          selectedRole
        );

        console.log(
          "Authenticated account role:",
          userRole
        );

        // ===============================================
        // IMPORTANT ROLE CHECK
        // ===============================================

        if (
          userRole !== selectedRole
        ) {
          console.log(
            "ROLE MISMATCH"
          );

          await supabase.auth.signOut();

          let actualRoleName =
            "another portal";

          if (
            userRole === "farmer"
          ) {
            actualRoleName =
              "Farmer";
          } else if (
            userRole === "buyer"
          ) {
            actualRoleName =
              "Industry Buyer";
          } else if (
            userRole === "admin"
          ) {
            actualRoleName =
              "Admin";
          }

          addToast(
            "error",
            "Wrong Portal",
            `This account is registered as ${actualRoleName}. Please use the ${actualRoleName} portal to log in.`
          );

          return;
        }

        // ===============================================
        // ROLE MATCHED
        // ===============================================

        addToast(
          "success",
          "Welcome Back!",
          "Successfully authenticated with BlueCarbon Nexus. Redirecting..."
        );

        // ===============================================
        // REMEMBER EMAIL
        // ===============================================

        if (data.rememberMe) {
          localStorage.setItem(
            "bcn_remember_email",
            data.email
          );
        } else {
          localStorage.removeItem(
            "bcn_remember_email"
          );
        }

        // ===============================================
        // REDIRECT
        // ===============================================

        setTimeout(async () => {
          await handleRoleRedirect(
            userRole
          );
        }, 1000);

      } else {
        // =================================================
        // DEMONSTRATION / FALLBACK MODE
        // =================================================

        await new Promise(
          (resolve) =>
            setTimeout(
              resolve,
              1200
            )
        );

        addToast(
          "success",
          "Login Successful",
          `Authenticated as ${data.email}. Redirecting to the selected portal...`
        );

        if (data.rememberMe) {
          localStorage.setItem(
            "bcn_remember_email",
            data.email
          );
        } else {
          localStorage.removeItem(
            "bcn_remember_email"
          );
        }

        setTimeout(async () => {
          await handleRoleRedirect();
        }, 1000);
      }

    } catch (err) {
      console.error(
        "Login error:",
        err
      );

      addToast(
        "error",
        "An Unexpected Error Occurred",
        err instanceof Error
          ? err.message
          : "Please try again later."
      );
    } finally {
      setIsLoading(false);
    }
  };

  // ===================================================
  // GOOGLE LOGIN
  // ===================================================

  const handleGoogleLogin =
    async () => {
      setIsLoading(true);

      try {
        const supabase =
          getSupabaseClient();

        if (supabase) {
          /*
           * Preserve selected role
           * during Google OAuth.
           */

          const {
            error,
          } =
            await supabase.auth.signInWithOAuth(
              {
                provider: "google",

                options: {
                  redirectTo:
                    `${window.location.origin}/login?role=${encodeURIComponent(
                      selectedRole
                    )}`,
                },
              }
            );

          if (error) {
            addToast(
              "error",
              "Google Sign-In Error",
              error.message
            );
          }

        } else {
          await new Promise(
            (resolve) =>
              setTimeout(
                resolve,
                800
              )
          );

          addToast(
            "info",
            "Google OAuth Workspace",
            "Connect Supabase credentials to enable live Google authentication."
          );
        }

      } catch (err) {
        console.error(
          "Google login error:",
          err
        );

        addToast(
          "error",
          "OAuth Failure",
          "Unable to complete Google authentication."
        );
      } finally {
        setIsLoading(false);
      }
    };

  // ===================================================
  // PORTAL TEXT
  // ===================================================

  const portalTitle =
    selectedRole === "buyer"
      ? "Industry Buyer Portal"
      : selectedRole === "farmer"
      ? "Farmer Portal"
      : "Platform Admin";

  const pageTitle =
    selectedRole === "buyer"
      ? "Industry Login"
      : selectedRole === "farmer"
      ? "Farmer Login"
      : "Admin Login";

  const pageDescription =
    selectedRole === "buyer"
      ? "Sign in to manage your industrial assets and carbon offset portfolio."
      : selectedRole === "farmer"
      ? "Sign in to manage your farm, MRV data, and verified carbon credits."
      : "Sign in to manage and govern the BlueCarbon Nexus platform.";

  // ===================================================
  // UI
  // ===================================================

  return (
    <div className="min-h-screen bg-sand-100 dark:bg-[#061418] text-ink dark:text-sand-100 flex flex-col justify-between relative overflow-x-hidden">

      {/* Background Glow */}

      <div className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2 h-[500px] w-[800px] rounded-full bg-gradient-to-b from-ocean-300/10 via-mangrove-300/10 to-transparent blur-3xl opacity-60 dark:from-ocean-900/20 dark:via-mangrove-900/20" />

      {/* =================================================
          HEADER
      ================================================= */}

      <header className="relative z-10 container-page section-pad flex h-20 items-center justify-between">

        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-medium text-ink/70 hover:text-ink dark:text-sand-100/70 dark:hover:text-sand-50 transition-colors"
        >
          <ArrowLeft size={16} />

          <span>
            Back to Home
          </span>
        </Link>

        <div className="flex items-center gap-3">
          <ThemeToggle />
        </div>
      </header>

      {/* =================================================
          MAIN
      ================================================= */}

      <main className="relative z-10 flex-1 flex items-center justify-center section-pad py-12">

        <motion.div
          initial={{
            opacity: 0,
            y: 0,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.5,
            ease: [
              0.16,
              1,
              0.3,
              1,
            ],
          }}
          className="w-full max-w-md"
        >

          {/* =================================================
              LOGIN CARD
          ================================================= */}

          <div className="rounded-[28px] border border-ocean-900/10 bg-white p-8 sm:p-10 shadow-soft dark:border-sand-100/10 dark:bg-[#0a232b]">

            {/* Logo + Header */}

            <div className="flex flex-col items-center text-center">

              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-ocean-900 text-mangrove-300 shadow-card dark:bg-mangrove-500 dark:text-ink">

                <Leaf
                  size={22}
                  strokeWidth={2.25}
                />

              </div>

              <span className="mt-4 font-mono text-[11px] uppercase tracking-widest2 text-mangrove-700 dark:text-mangrove-300">

                {portalTitle}

              </span>

              <h1 className="mt-2 font-display text-2xl sm:text-3xl font-medium tracking-tight text-ink dark:text-sand-50">

                {pageTitle}

              </h1>

              <p className="mt-2 text-sm text-ink-soft dark:text-sand-100/70">

                {pageDescription}

              </p>

            </div>

            {/* =================================================
                GOOGLE BUTTON
            ================================================= */}

            <div className="mt-8">

              <button
                type="button"
                onClick={
                  handleGoogleLogin
                }
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-3 rounded-full border border-ocean-900/15 bg-white px-5 py-3 text-sm font-medium text-ink shadow-sm hover:bg-sand-50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-mangrove-500 disabled:opacity-50 dark:border-sand-100/15 dark:bg-[#071a20] dark:text-sand-100 dark:hover:bg-[#082028]"
              >

                <svg
                  className="h-4 w-4"
                  viewBox="0 0 24 24"
                >

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

                <span>
                  Continue with Google
                </span>

              </button>

            </div>

            {/* Divider */}

            <div className="relative my-6 flex items-center justify-center">

              <div className="absolute inset-0 flex items-center">

                <div className="w-full border-t border-ocean-900/10 dark:border-sand-100/10" />

              </div>

              <span className="relative bg-white dark:bg-[#0a232b] px-3 text-xs font-mono uppercase tracking-wider text-ink-faint dark:text-sand-100/50">

                Or work with email

              </span>

            </div>

            {/* =================================================
                FORM
            ================================================= */}

            <form
              onSubmit={handleSubmit(
                onSubmit
              )}
              className="space-y-5"
            >

              {/* EMAIL */}

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
                    {...register(
                      "email"
                    )}
                    className={`w-full rounded-xl border bg-sand-50/50 pl-10 pr-4 py-3 text-sm text-ink placeholder:text-ink-faint/60 transition-all focus:bg-white focus:outline-none focus:ring-2 dark:bg-[#071a20]/60 dark:text-sand-50 dark:placeholder:text-sand-100/40 ${
                      errors.email
                        ? "border-red-400 focus:ring-red-400"
                        : "border-ocean-900/15 focus:border-mangrove-500 focus:ring-mangrove-500/30 dark:border-sand-100/15"
                    }`}
                  />

                </div>

                {errors.email && (
                  <p className="mt-1.5 text-xs text-red-500 dark:text-red-400 font-medium">

                    {
                      errors.email
                        .message
                    }

                  </p>
                )}

              </div>

              {/* PASSWORD */}

              <div>

                <div className="flex items-center justify-between mb-2">

                  <label className="block text-xs font-mono uppercase tracking-wider text-ink-soft dark:text-sand-100/70">

                    Password

                  </label>

                  <Link
                    href="/forgot-password"
                    className="text-xs font-medium text-mangrove-700 hover:text-mangrove-900 dark:text-mangrove-300 dark:hover:text-mangrove-150 transition-colors"
                  >
                    Forgot Password?
                  </Link>

                </div>

                <div className="relative">

                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-ink-faint dark:text-sand-100/40">

                    <Lock size={17} />

                  </div>

                  <input
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    placeholder="••••••••••••"
                    {...register(
                      "password"
                    )}
                    className={`w-full rounded-xl border bg-sand-50/50 pl-10 pr-11 py-3 text-sm text-ink placeholder:text-ink-faint/60 transition-all focus:bg-white focus:outline-none focus:ring-2 dark:bg-[#071a20]/60 dark:text-sand-50 dark:placeholder:text-sand-100/40 ${
                      errors.password
                        ? "border-red-400 focus:ring-red-400"
                        : "border-ocean-900/15 focus:border-mangrove-500 focus:ring-mangrove-500/30 dark:border-sand-100/15"
                    }`}
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword(
                        !showPassword
                      )
                    }
                    className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-ink-faint hover:text-ink dark:text-sand-100/40 dark:hover:text-sand-100 transition-colors"
                    aria-label={
                      showPassword
                        ? "Hide password"
                        : "Show password"
                    }
                  >

                    {showPassword ? (
                      <EyeOff
                        size={17}
                      />
                    ) : (
                      <Eye
                        size={17}
                      />
                    )}

                  </button>

                </div>

                {errors.password && (
                  <p className="mt-1.5 text-xs text-red-500 dark:text-red-400 font-medium">

                    {
                      errors.password
                        .message
                    }

                  </p>
                )}

              </div>

              {/* REMEMBER ME */}

              <div className="flex items-center justify-between">

                <label className="flex items-center gap-2.5 cursor-pointer select-none">

                  <input
                    type="checkbox"
                    {...register(
                      "rememberMe"
                    )}
                    className="h-4 w-4 rounded border-ocean-900/20 text-ocean-900 focus:ring-mangrove-500 dark:border-sand-100/20 dark:bg-[#071a20] dark:checked:bg-mangrove-500"
                  />

                  <span className="text-xs text-ink-soft dark:text-sand-100/80 font-medium">

                    Remember me on this device

                  </span>

                </label>

              </div>

              {/* SUBMIT */}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 rounded-full bg-ocean-900 px-6 py-3.5 text-sm font-medium tracking-wide text-sand-50 shadow-md transition-all hover:bg-ocean-700 focus:outline-none focus:ring-2 focus:ring-mangrove-500 focus:ring-offset-2 disabled:opacity-50 dark:bg-mangrove-500 dark:text-ink dark:hover:bg-mangrove-300"
              >

                {isLoading ? (
                  <>
                    <Loader2
                      size={18}
                      className="animate-spin"
                    />

                    <span>
                      Signing in...
                    </span>
                  </>
                ) : (
                  <>
                    <ShieldCheck
                      size={18}
                    />

                    <span>
                      Sign In
                    </span>
                  </>
                )}

              </button>

            </form>

            {/* =================================================
                CREATE ACCOUNT
            ================================================= */}

            <div className="mt-8 text-center text-xs text-ink-soft dark:text-sand-100/70">

              Don&apos;t have an account?{" "}

              <Link
                href={`/signup?role=${encodeURIComponent(
                  selectedRole
                )}`}
                className="font-medium text-mangrove-700 hover:underline dark:text-mangrove-300"
              >
                Create New Account
              </Link>

            </div>

          </div>

        </motion.div>

      </main>

      {/* FOOTER */}

      <footer className="relative z-10 container-page section-pad py-6 text-center text-xs text-ink-faint dark:text-sand-100/40">

        © {new Date().getFullYear()} BlueCarbon Nexus. Verified Blockchain MRV Registry.

      </footer>

      {/* TOAST */}

      <ToastContainer
        toasts={toasts}
        onDismiss={dismissToast}
      />

    </div>
  );
}
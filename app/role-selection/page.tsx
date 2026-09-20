"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Leaf,
  Building2,
  ShieldCheck,
  ArrowLeft,
  ArrowRight,
  Sparkles,
  Loader2,
} from "lucide-react";

import { ThemeToggle } from "@/components/theme-toggle";
import {
  ToastContainer,
  ToastMessage,
} from "@/components/ui/toast";
import { getSupabaseClient } from "@/lib/supabase";

type RoleType = "farmer" | "buyer" | "admin";

const roles = [
  {
    id: "farmer" as RoleType,
    title: "Farmer / Developer",
    category: "Project Developer Portal",
    badge: "Eco Registry",
    description:
      "Register coastal mangrove restoration projects, submit telemetry MRV data, and issue verified carbon credits.",
    icon: Leaf,
    actionText: "Continue as Farmer",
    color:
      "from-mangrove-500/20 via-mangrove-500/10 to-transparent",
    borderHover: "hover:border-mangrove-500",
    iconBg:
      "bg-mangrove-500/15 text-mangrove-700 dark:bg-mangrove-500/20 dark:text-mangrove-300",
  },
  {
    id: "buyer" as RoleType,
    title: "Industry Buyer",
    category: "Corporate Offset Portal",
    badge: "Enterprise Marketplace",
    description:
      "Browse immutable blue carbon registries, analyze satellite MRV proof, and purchase verified carbon offsets.",
    icon: Building2,
    actionText: "Continue as Buyer",
    color:
      "from-ocean-500/20 via-ocean-500/10 to-transparent",
    borderHover: "hover:border-ocean-600",
    iconBg:
      "bg-ocean-900/10 text-ocean-900 dark:bg-sand-100/10 dark:text-sand-50",
  },
  {
    id: "admin" as RoleType,
    title: "Platform Admin",
    category: "Registry Governance",
    badge: "Protocol Governance",
    description:
      "Oversee verifier approvals, audit blockchain telemetry records, and manage platform compliance.",
    icon: ShieldCheck,
    actionText: "Continue as Admin",
    color:
      "from-amber-500/20 via-amber-500/10 to-transparent",
    borderHover: "hover:border-amber-500",
    iconBg:
      "bg-amber-500/15 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300",
  },
];

export default function RoleSelectionPage() {
  const router = useRouter();

  const [loadingRole, setLoadingRole] =
    useState<RoleType | null>(null);

  const [toasts, setToasts] =
    useState<ToastMessage[]>([]);

  /*
   * Show Toast
   */
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

  /*
   * Remove Toast
   */
  const dismissToast = (id: string) => {
    setToasts((prev) =>
      prev.filter((t) => t.id !== id)
    );
  };

  /*
   * ROLE SELECTION
   *
   * Important:
   *
   * We DO NOT change the role of an existing
   * Supabase account here.
   *
   * Example:
   *
   * Farmer account logged in
   *       ↓
   * Select Industry
   *       ↓
   * Farmer role != Buyer role
   *       ↓
   * Sign out
   *       ↓
   * Industry Login
   *
   * The Farmer account remains a Farmer account.
   */
  const handleRoleSelect = async (
    role: RoleType
  ) => {
    setLoadingRole(role);

    try {
      /*
       * Save selected role locally.
       *
       * This will be used by Login and Signup.
       */
      if (
        typeof window !== "undefined"
      ) {
        localStorage.setItem(
          "selectedRole",
          role
        );
      }

      const supabase =
        getSupabaseClient();

      if (supabase) {
        /*
         * Check if someone is already logged in.
         */
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (user) {
          /*
           * Get the role of the currently
           * authenticated account.
           */
          const currentRole =
            user.user_metadata?.role;

          console.log(
            "Selected role:",
            role
          );

          console.log(
            "Current account role:",
            currentRole
          );

          /*
           * CASE 1:
           *
           * Current account role matches
           * selected role.
           *
           * Example:
           * Farmer account + Farmer selected
           */
          if (
            currentRole === role
          ) {
            if (role === "farmer") {
              router.push(
                "/farmer/onboarding"
              );
            } else if (
              role === "buyer"
            ) {
              router.push(
                "/industry/onboarding"
              );
            } else if (
              role === "admin"
            ) {
              router.push(
                "/admin/dashboard"
              );
            }

            return;
          }

          /*
           * CASE 2:
           *
           * Current account role does NOT
           * match selected role.
           *
           * Example:
           *
           * Farmer logged in
           * User selects Industry
           *
           * DO NOT change:
           * farmer → buyer
           *
           * Instead:
           * sign out → Industry Login
           */
          await supabase.auth.signOut();

          if (role === "farmer") {
            router.push(
              "/login?role=farmer"
            );
          } else if (
            role === "buyer"
          ) {
            router.push(
              "/login?role=buyer"
            );
          } else if (
            role === "admin"
          ) {
            router.push(
              "/login?role=admin"
            );
          }

          return;
        }
      }

      /*
       * CASE 3:
       *
       * Nobody is logged in.
       *
       * Send the user to login for
       * the selected role.
       */
      if (role === "farmer") {
        router.push(
          "/login?role=farmer"
        );
      } else if (
        role === "buyer"
      ) {
        router.push(
          "/login?role=buyer"
        );
      } else if (
        role === "admin"
      ) {
        router.push(
          "/login?role=admin"
        );
      }
    } catch (err) {
      console.error(
        "Role Selection Error:",
        err
      );

      addToast(
        "error",
        "Role Selection Failed",
        err instanceof Error
          ? err.message
          : "An unexpected error occurred."
      );
    } finally {
      setLoadingRole(null);
    }
  };

  return (
    <div className="min-h-screen bg-sand-100 dark:bg-[#061418] text-ink dark:text-sand-100 flex flex-col justify-between relative overflow-x-hidden transition-colors">
      {/* Background Ambient Glow */}
      <div className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2 h-[600px] w-[1000px] rounded-full bg-gradient-to-b from-ocean-300/15 via-mangrove-300/10 to-transparent blur-3xl opacity-70 dark:from-ocean-900/25 dark:via-mangrove-900/15" />

      {/* Navigation Header */}
      <header className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 flex h-20 items-center justify-between">
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

      {/* Main Content Area */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center container mx-auto px-4 sm:px-6 lg:px-8 py-12 max-w-6xl">
        <motion.div
          initial={{
            opacity: 0,
            y: -15,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.5,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="text-center space-y-4 mb-12 max-w-2xl"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/80 dark:bg-[#0a232b]/80 border border-ocean-900/10 dark:border-sand-100/10 shadow-sm backdrop-blur-md">
            <Sparkles
              size={14}
              className="text-mangrove-600 dark:text-mangrove-400"
            />

            <span className="font-mono text-xs uppercase tracking-widest text-ink-soft dark:text-sand-100/80">
              BlueCarbon Nexus Ecosystem
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-display font-medium text-ink dark:text-sand-50 tracking-tight">
            Choose Your Platform Role
          </h1>

          <p className="text-sm sm:text-base text-ink-soft dark:text-sand-100/70 leading-relaxed">
            Select your account profile to
            customize your verified MRV tools,
            dashboards, and transaction
            permissions.
          </p>
        </motion.div>

        {/* Roles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 w-full">
          {roles.map((role) => {
            const Icon = role.icon;

            const isLoading =
              loadingRole === role.id;

            return (
              <motion.div
                key={role.id}
                whileHover={{
                  y: -4,
                }}
                transition={{
                  duration: 0.2,
                }}
                className={`group relative rounded-[28px] border border-ocean-900/10 dark:border-sand-100/10 bg-white/80 dark:bg-[#0a232b]/80 backdrop-blur-md p-8 shadow-soft flex flex-col justify-between transition-all duration-300 ${role.borderHover} overflow-hidden`}
              >
                {/* Subtle Ambient Hover Gradient */}
                <div
                  className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${role.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
                />

                <div className="relative z-10 space-y-6">
                  {/* Icon & Badge */}
                  <div className="flex items-center justify-between">
                    <div
                      className={`flex h-12 w-12 items-center justify-center rounded-2xl ${role.iconBg} shadow-sm`}
                    >
                      <Icon size={24} />
                    </div>

                    <span className="font-mono text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-full bg-sand-100 dark:bg-[#071a20] border border-ocean-900/5 dark:border-sand-100/10 text-ink-soft dark:text-sand-100/70">
                      {role.badge}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <div className="space-y-2">
                    <span className="block font-mono text-xs uppercase tracking-wider text-mangrove-700 dark:text-mangrove-300 font-medium">
                      {role.category}
                    </span>

                    <h2 className="font-display text-2xl font-medium text-ink dark:text-sand-50">
                      {role.title}
                    </h2>

                    <p className="text-xs sm:text-sm text-ink-soft dark:text-sand-100/70 leading-relaxed">
                      {role.description}
                    </p>
                  </div>
                </div>

                {/* Action Button */}
                <div className="relative z-10 pt-8">
                  <button
                    type="button"
                    onClick={() =>
                      handleRoleSelect(
                        role.id
                      )
                    }
                    disabled={
                      loadingRole !== null
                    }
                    className="w-full inline-flex items-center justify-between gap-2 rounded-full border border-ocean-900/15 bg-white px-5 py-3 text-xs font-mono font-medium text-ink shadow-sm hover:bg-sand-50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-mangrove-500 disabled:opacity-50 dark:border-sand-100/15 dark:bg-[#071a20] dark:text-sand-100 dark:hover:bg-[#082028]"
                  >
                    <span>
                      {isLoading
                        ? "Redirecting..."
                        : role.actionText}
                    </span>

                    {isLoading ? (
                      <Loader2
                        size={15}
                        className="animate-spin"
                      />
                    ) : (
                      <ArrowRight
                        size={15}
                        className="group-hover:translate-x-1 transition-transform"
                      />
                    )}
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </main>

      {/* Footer Branding */}
      <footer className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-6 text-center text-xs text-ink-faint dark:text-sand-100/40">
        © {new Date().getFullYear()} BlueCarbon Nexus. Verified Blockchain MRV Registry.
      </footer>

      {/* Toast Layer */}
      <ToastContainer
        toasts={toasts}
        onDismiss={dismissToast}
      />
    </div>
  );
}
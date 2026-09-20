"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { 
  CheckCircle2, 
  Lock, 
  ArrowRight, 
  Leaf, 
  ShieldCheck, 
  FileText, 
  LayoutDashboard,
  UserCheck,
  Loader2
} from "lucide-react";

import { createClient } from "@/lib/supabase";
import { ThemeToggle } from "@/components/theme-toggle";

interface StepItem {
  id: number;
  label: string;
  icon: React.ElementType;
}

const STEPS: StepItem[] = [
  { id: 1, label: "Account", icon: UserCheck },
  { id: 2, label: "Farmer Profile", icon: Leaf },
  { id: 3, label: "Land Documents", icon: FileText },
  { id: 4, label: "Verification", icon: ShieldCheck },
  { id: 5, label: "Dashboard", icon: LayoutDashboard },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
  },
};

export default function FarmerOnboardingPage() {
  const router = useRouter();
  const supabase = createClient();

  const [loading, setLoading] = useState<boolean>(true);
  const [currentStep, setCurrentStep] = useState<number>(2);

  useEffect(() => {
    async function checkStatus() {
      try {
        setLoading(true);
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!session) {
          router.replace("/login");
          return;
        }

        const { data: profile } = await supabase
          .from("farmer_profiles")
          .select("onboarding_status")
          .eq("user_id", session.user.id)
          .single();

        if (profile) {
          switch (profile.onboarding_status) {
            case "NOT_STARTED":
              setCurrentStep(2);
              break;
            case "PENDING_DOCUMENTS":
              setCurrentStep(3);
              break;
            case "PENDING_VERIFICATION":
              setCurrentStep(4);
              break;
            case "APPROVED":
              setCurrentStep(5);
              router.replace("/farmer/dashboard");
              return;
            default:
              setCurrentStep(2);
          }
        }
      } catch (err) {
        console.error("Error fetching onboarding status:", err);
      } finally {
        setLoading(false);
      }
    }

    checkStatus();
  }, [router, supabase]);

  const handleNextStep = () => {
    if (currentStep === 2) {
      router.push("/farmer/onboarding/profile");
    } else if (currentStep === 3) {
      router.push("/farmer/onboarding/documents");
    } else if (currentStep === 4) {
      router.push("/farmer/onboarding/verification");
    } else if (currentStep === 5) {
      router.push("/farmer/dashboard");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-sand-100 dark:bg-[#061418] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-mangrove-600 dark:text-mangrove-400" />
          <p className="text-xs font-mono text-ink-soft dark:text-sand-100/70">
            Checking onboarding status...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-sand-100 dark:bg-[#061418] text-ink dark:text-sand-100 flex flex-col justify-between relative overflow-x-hidden transition-colors">
      <div className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2 h-[600px] w-[900px] rounded-full bg-gradient-to-b from-ocean-300/15 via-mangrove-300/10 to-transparent blur-3xl opacity-70 dark:from-ocean-900/30 dark:via-mangrove-900/20" />

      <header className="relative z-10 container mx-auto px-6 h-20 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-ocean-900 text-mangrove-300 shadow-card dark:bg-mangrove-500 dark:text-ink">
            <Leaf size={18} strokeWidth={2.25} />
          </div>
          <span className="font-display font-medium tracking-tight text-lg text-ink dark:text-sand-50">
            BlueCarbon <span className="text-mangrove-700 dark:text-mangrove-300">Nexus</span>
          </span>
        </div>

        <div className="flex items-center gap-3">
          <ThemeToggle />
        </div>
      </header>

      <main className="relative z-10 flex-1 container mx-auto px-4 sm:px-6 py-8 max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-center space-y-3"
        >
          <span className="font-mono text-xs uppercase tracking-widest text-mangrove-700 dark:text-mangrove-300 bg-mangrove-500/10 dark:bg-mangrove-500/20 px-3 py-1 rounded-full border border-mangrove-500/20">
            Farmer Portal Setup
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-display font-medium text-ink dark:text-sand-50 tracking-tight">
            Complete Your Farmer Setup
          </h1>
          <p className="text-sm sm:text-base text-ink-soft dark:text-sand-100/70 max-w-xl mx-auto leading-relaxed">
            Register your coastal land, submit blue carbon MRV telemetry, and begin issuing verified carbon credits.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="my-10 p-6 rounded-[24px] border border-ocean-900/10 bg-white/60 dark:border-sand-100/10 dark:bg-[#0a232b]/60 backdrop-blur-md shadow-soft"
        >
          <div className="flex items-center justify-between relative">
            <div className="absolute top-5 left-6 right-6 h-[2px] bg-sand-200 dark:bg-sand-100/10 -z-0">
              <div
                className="h-full bg-gradient-to-r from-mangrove-500 to-ocean-500 transition-all duration-500"
                style={{
                  width: `${((currentStep - 1) / (STEPS.length - 1)) * 100}%`,
                }}
              />
            </div>

            {STEPS.map((step) => {
              const isCompleted = step.id < currentStep;
              const isCurrent = step.id === currentStep;
              const Icon = step.icon;

              return (
                <div
                  key={step.id}
                  className="flex flex-col items-center relative z-10 space-y-2"
                >
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-full transition-all duration-300 ${
                      isCompleted
                        ? "bg-mangrove-500 text-ink shadow-md"
                        : isCurrent
                        ? "bg-ocean-900 text-sand-50 ring-4 ring-mangrove-500/30 dark:bg-mangrove-300 dark:text-ink"
                        : "bg-white dark:bg-[#071a20] border border-ocean-900/10 dark:border-sand-100/10 text-ink-faint dark:text-sand-100/40"
                    }`}
                  >
                    {isCompleted ? (
                      <CheckCircle2 size={18} strokeWidth={2.5} />
                    ) : (
                      <Icon size={18} strokeWidth={isCurrent ? 2.2 : 1.8} />
                    )}
                  </div>
                  <span
                    className={`text-xs font-mono tracking-tight hidden sm:block ${
                      isCurrent
                        ? "font-semibold text-ink dark:text-sand-50"
                        : isCompleted
                        ? "text-mangrove-700 dark:text-mangrove-300"
                        : "text-ink-faint dark:text-sand-100/40"
                    }`}
                  >
                    {step.label}
                  </span>
                </div>
              );
            })}
          </div>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          <motion.div variants={cardVariants}>
            <div className="rounded-[24px] border border-ocean-900/10 bg-white/80 dark:border-sand-100/10 dark:bg-[#0a232b]/80 backdrop-blur-md p-6 sm:p-8 shadow-soft flex flex-col justify-between h-full">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono bg-mangrove-500/15 text-mangrove-800 dark:text-mangrove-300 mb-4">
                  <CheckCircle2 size={14} />
                  <span>Completed</span>
                </div>
                <h3 className="font-display text-xl font-medium text-ink dark:text-sand-50">
                  Account Created
                </h3>
                <p className="mt-2 text-sm text-ink-soft dark:text-sand-100/70 leading-relaxed">
                  Your enterprise account and initial cryptographic identity have been registered.
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-ocean-900/5 dark:border-sand-100/5">
                <button
                  disabled
                  className="w-full flex items-center justify-center gap-2 rounded-full bg-mangrove-500/20 px-5 py-3 text-sm font-medium text-mangrove-800 dark:text-mangrove-300 cursor-default"
                >
                  <CheckCircle2 size={16} />
                  <span>Completed</span>
                </button>
              </div>
            </div>
          </motion.div>

          <motion.div
            variants={cardVariants}
            whileHover={currentStep === 2 ? { y: -4, transition: { duration: 0.2 } } : {}}
          >
            <div
              className={`rounded-[24px] p-6 sm:p-8 shadow-card flex flex-col justify-between h-full relative overflow-hidden backdrop-blur-md transition-all ${
                currentStep === 2
                  ? "border-2 border-mangrove-500/40 bg-white dark:border-mangrove-400/30 dark:bg-[#0a232b]"
                  : currentStep > 2
                  ? "border border-ocean-900/10 bg-white/80 dark:border-sand-100/10 dark:bg-[#0a232b]/80"
                  : "border border-ocean-900/10 bg-white/40 dark:border-sand-100/10 dark:bg-[#0a232b]/40 opacity-70"
              }`}
            >
              {currentStep === 2 && (
                <div className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full bg-mangrove-500/10 blur-2xl" />
              )}

              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono mb-4 font-medium">
                  {currentStep > 2 ? (
                    <span className="bg-mangrove-500/15 text-mangrove-800 dark:text-mangrove-300 px-3 py-1 rounded-full flex items-center gap-1">
                      <CheckCircle2 size={14} /> Completed
                    </span>
                  ) : currentStep === 2 ? (
                    <span className="bg-ocean-900 text-sand-50 dark:bg-mangrove-500 dark:text-ink px-3 py-1 rounded-full flex items-center gap-1.5">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-mangrove-300 opacity-75" />
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-mangrove-400" />
                      </span>
                      Current Step
                    </span>
                  ) : (
                    <span className="bg-sand-200/60 dark:bg-sand-100/10 text-ink-faint dark:text-sand-100/50 px-3 py-1 rounded-full flex items-center gap-1">
                      <Lock size={12} /> Locked
                    </span>
                  )}
                </div>
                <h3 className="font-display text-xl font-medium text-ink dark:text-sand-50">
                  Complete Farmer Profile
                </h3>
                <p className="mt-2 text-sm text-ink-soft dark:text-sand-100/70 leading-relaxed">
                  Fill in your farm coordinates, mangrove land parcel details, and organization type.
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-ocean-900/5 dark:border-sand-100/5">
                {currentStep === 2 ? (
                  <button
                    type="button"
                    onClick={handleNextStep}
                    className="w-full flex items-center justify-center gap-2 rounded-full bg-ocean-900 hover:bg-ocean-700 dark:bg-mangrove-500 dark:hover:bg-mangrove-300 dark:text-ink px-6 py-3.5 text-sm font-medium tracking-wide text-sand-50 shadow-md transition-all focus:outline-none focus:ring-2 focus:ring-mangrove-500"
                  >
                    <span>Complete Profile</span>
                    <ArrowRight size={16} />
                  </button>
                ) : (
                  <button
                    disabled
                    className="w-full flex items-center justify-center gap-2 rounded-full bg-sand-200/50 dark:bg-sand-100/5 px-5 py-3 text-sm font-medium text-ink-faint dark:text-sand-100/40 cursor-default"
                  >
                    {currentStep > 2 ? <CheckCircle2 size={16} /> : <Lock size={14} />}
                    <span>{currentStep > 2 ? "Completed" : "Locked"}</span>
                  </button>
                )}
              </div>
            </div>
          </motion.div>

          <motion.div
            variants={cardVariants}
            whileHover={currentStep === 3 ? { y: -4, transition: { duration: 0.2 } } : {}}
          >
            <div
              className={`rounded-[24px] p-6 sm:p-8 shadow-card flex flex-col justify-between h-full relative overflow-hidden backdrop-blur-md transition-all ${
                currentStep === 3
                  ? "border-2 border-mangrove-500/40 bg-white dark:border-mangrove-400/30 dark:bg-[#0a232b]"
                  : currentStep > 3
                  ? "border border-ocean-900/10 bg-white/80 dark:border-sand-100/10 dark:bg-[#0a232b]/80"
                  : "border border-ocean-900/10 bg-white/40 dark:border-sand-100/10 dark:bg-[#0a232b]/40 opacity-70"
              }`}
            >
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono mb-4 font-medium">
                  {currentStep > 3 ? (
                    <span className="bg-mangrove-500/15 text-mangrove-800 dark:text-mangrove-300 px-3 py-1 rounded-full flex items-center gap-1">
                      <CheckCircle2 size={14} /> Completed
                    </span>
                  ) : currentStep === 3 ? (
                    <span className="bg-ocean-900 text-sand-50 dark:bg-mangrove-500 dark:text-ink px-3 py-1 rounded-full flex items-center gap-1.5">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-mangrove-300 opacity-75" />
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-mangrove-400" />
                      </span>
                      Current Step
                    </span>
                  ) : (
                    <span className="bg-sand-200/60 dark:bg-sand-100/10 text-ink-faint dark:text-sand-100/50 px-3 py-1 rounded-full flex items-center gap-1">
                      <Lock size={12} /> Locked
                    </span>
                  )}
                </div>
                <h3 className="font-display text-xl font-medium text-ink dark:text-sand-50">
                  Upload Land Documents
                </h3>
                <p className="mt-2 text-sm text-ink-soft dark:text-sand-100/70 leading-relaxed">
                  Upload title deeds, satellite survey boundaries, and conservation rights.
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-ocean-900/5 dark:border-sand-100/5">
                {currentStep === 3 ? (
                  <button
                    type="button"
                    onClick={handleNextStep}
                    className="w-full flex items-center justify-center gap-2 rounded-full bg-ocean-900 hover:bg-ocean-700 dark:bg-mangrove-500 dark:hover:bg-mangrove-300 dark:text-ink px-6 py-3.5 text-sm font-medium tracking-wide text-sand-50 shadow-md transition-all focus:outline-none focus:ring-2 focus:ring-mangrove-500"
                  >
                    <span>Upload Documents</span>
                    <ArrowRight size={16} />
                  </button>
                ) : (
                  <button
                    disabled
                    className="w-full flex items-center justify-center gap-2 rounded-full bg-sand-200/50 dark:bg-sand-100/5 px-5 py-3 text-sm font-medium text-ink-faint dark:text-sand-100/40 cursor-default"
                  >
                    {currentStep > 3 ? <CheckCircle2 size={16} /> : <Lock size={14} />}
                    <span>{currentStep > 3 ? "Completed" : "Locked"}</span>
                  </button>
                )}
              </div>
            </div>
          </motion.div>

          <motion.div
            variants={cardVariants}
            whileHover={currentStep === 4 ? { y: -4, transition: { duration: 0.2 } } : {}}
          >
            <div
              className={`rounded-[24px] p-6 sm:p-8 shadow-card flex flex-col justify-between h-full relative overflow-hidden backdrop-blur-md transition-all ${
                currentStep === 4
                  ? "border-2 border-mangrove-500/40 bg-white dark:border-mangrove-400/30 dark:bg-[#0a232b]"
                  : "border border-ocean-900/10 bg-white/40 dark:border-sand-100/10 dark:bg-[#0a232b]/40 opacity-70"
              }`}
            >
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono mb-4 font-medium">
                  {currentStep === 4 ? (
                    <span className="bg-ocean-900 text-sand-50 dark:bg-mangrove-500 dark:text-ink px-3 py-1 rounded-full flex items-center gap-1.5">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-mangrove-300 opacity-75" />
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-mangrove-400" />
                      </span>
                      Current Step
                    </span>
                  ) : (
                    <span className="bg-sand-200/60 dark:bg-sand-100/10 text-ink-faint dark:text-sand-100/50 px-3 py-1 rounded-full flex items-center gap-1">
                      <Lock size={12} /> Locked
                    </span>
                  )}
                </div>
                <h3 className="font-display text-xl font-medium text-ink dark:text-sand-50">
                  MRV Verification
                </h3>
                <p className="mt-2 text-sm text-ink-soft dark:text-sand-100/70 leading-relaxed">
                  Automated satellite & drone telemetry verification of mangrove biomass.
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-ocean-900/5 dark:border-sand-100/5">
                {currentStep === 4 ? (
                  <button
                    type="button"
                    onClick={handleNextStep}
                    className="w-full flex items-center justify-center gap-2 rounded-full bg-ocean-900 hover:bg-ocean-700 dark:bg-mangrove-500 dark:hover:bg-mangrove-300 dark:text-ink px-6 py-3.5 text-sm font-medium tracking-wide text-sand-50 shadow-md transition-all focus:outline-none focus:ring-2 focus:ring-mangrove-500"
                  >
                    <span>Check Verification Status</span>
                    <ArrowRight size={16} />
                  </button>
                ) : (
                  <button
                    disabled
                    className="w-full flex items-center justify-center gap-2 rounded-full bg-sand-200/50 dark:bg-sand-100/5 px-5 py-3 text-sm font-medium text-ink-faint dark:text-sand-100/40 cursor-default"
                  >
                    <Lock size={14} />
                    <span>Locked</span>
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      </main>

      <footer className="relative z-10 container mx-auto px-6 py-6 text-center text-xs font-mono text-ink-faint dark:text-sand-100/40">
        © {new Date().getFullYear()} BlueCarbon Nexus. Verified Blockchain MRV Registry.
      </footer>
    </div>
  );
}
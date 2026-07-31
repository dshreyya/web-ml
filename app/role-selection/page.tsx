"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
  Sprout, 
  Factory, 
  ShieldCheck, 
  ArrowRight, 
  Leaf, 
  ArrowLeft 
} from "lucide-react";

import { ThemeToggle } from "@/components/theme-toggle";

const ROLES = [
  {
    id: "farmer",
    title: "Farmer / Developer",
    subtitle: "Project Developer Portal",
    description:
      "Register coastal mangrove restoration projects, submit telemetry MRV data, and issue verified carbon credits.",
    icon: Sprout,
    badge: "Eco Registry",
    color: "from-mangrove-500/20 to-mangrove-600/10",
    borderHover: "hover:border-mangrove-500/50 dark:hover:border-mangrove-400/50",
    iconBg: "bg-mangrove-500/10 text-mangrove-700 dark:bg-mangrove-500/20 dark:text-mangrove-300",
  },
  {
    id: "buyer",
    title: "Industry Buyer",
    subtitle: "Corporate Offset Portal",
    description:
      "Browse immutable blue carbon registries, analyze satellite MRV proof, and purchase verified carbon offsets.",
    icon: Factory,
    badge: "Enterprise Marketplace",
    color: "from-ocean-500/20 to-ocean-600/10",
    borderHover: "hover:border-ocean-500/50 dark:hover:border-ocean-400/50",
    iconBg: "bg-ocean-900/10 text-ocean-900 dark:bg-ocean-300/20 dark:text-ocean-300",
  },
  {
    id: "admin",
    title: "Platform Admin",
    subtitle: "Registry Governance",
    description:
      "Oversee verifier approvals, audit blockchain telemetry records, and manage platform compliance.",
    icon: ShieldCheck,
    badge: "Protocol Governance",
    color: "from-amber-500/20 to-amber-600/10",
    borderHover: "hover:border-amber-500/50 dark:hover:border-amber-400/50",
    iconBg: "bg-amber-500/10 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.1,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 25 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
  },
};

export default function RoleSelectionPage() {
  const router = useRouter();

  const chooseRole = (role: string) => {
    // Persist selected role for authentication onboarding flow
    localStorage.setItem("selectedRole", role);

    // Navigate to signup
    router.push("/signup");
  };

  return (
    <div className="min-h-screen bg-sand-100 dark:bg-[#061418] text-ink dark:text-sand-100 flex flex-col justify-between relative overflow-x-hidden transition-colors">
      {/* Background ambient subtle glow */}
      <div className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2 h-[600px] w-[900px] rounded-full bg-gradient-to-b from-ocean-300/15 via-mangrove-300/10 to-transparent blur-3xl opacity-70 dark:from-ocean-900/30 dark:via-mangrove-900/20" />

      {/* Header Bar */}
      <header className="relative z-10 container mx-auto px-6 h-20 flex items-center justify-between">
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

      {/* Main Content */}
      <main className="relative z-10 flex-1 container mx-auto px-4 sm:px-6 py-8 flex flex-col items-center justify-center max-w-6xl">
        {/* Title Section */}
        <motion.div
          initial={{ opacity: 1, y: 0 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-center space-y-3 mb-12"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/80 dark:bg-[#0a232b]/80 border border-ocean-900/10 dark:border-sand-100/10 shadow-sm backdrop-blur-md">
            <Leaf size={14} className="text-mangrove-600 dark:text-mangrove-400" />
            <span className="font-mono text-xs uppercase tracking-widest text-ink-soft dark:text-sand-100/80">
              BlueCarbon Nexus Ecosystem
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-display font-medium text-ink dark:text-sand-50 tracking-tight">
            Choose Your Platform Role
          </h1>

          <p className="text-sm sm:text-base text-ink-soft dark:text-sand-100/70 max-w-lg mx-auto leading-relaxed">
            Select your account profile to customize your verified MRV tools, dashboards, and transaction permissions.
          </p>
        </motion.div>

        {/* Roles Glassmorphic Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full"
        >
          {ROLES.map((role) => {
            const Icon = role.icon;

            return (
              <motion.div
                key={role.id}
                variants={cardVariants}
                whileHover={{ y: -6, transition: { duration: 0.2 } }}
                onClick={() => chooseRole(role.id)}
                className={`group cursor-pointer rounded-[28px] border border-ocean-900/10 bg-white/70 dark:border-sand-100/10 dark:bg-[#0a232b]/70 backdrop-blur-md p-8 shadow-soft transition-all duration-300 flex flex-col justify-between relative overflow-hidden ${role.borderHover}`}
              >
                {/* Top Subtle Ambient Glow inside Card */}
                <div
                  className={`pointer-events-none absolute -right-10 -top-10 h-36 w-36 rounded-full bg-gradient-to-br ${role.color} blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                />

                <div>
                  {/* Icon & Badge Row */}
                  <div className="flex items-center justify-between mb-6">
                    <div className={`flex h-14 w-14 items-center justify-center rounded-2xl shadow-sm transition-transform duration-300 group-hover:scale-110 ${role.iconBg}`}>
                      <Icon size={26} strokeWidth={2} />
                    </div>
                    <span className="font-mono text-[10px] uppercase tracking-wider text-ink-faint dark:text-sand-100/50 bg-sand-200/50 dark:bg-sand-100/5 px-2.5 py-1 rounded-full border border-ocean-900/5 dark:border-sand-100/5">
                      {role.badge}
                    </span>
                  </div>

                  {/* Subtitle & Title */}
                  <span className="font-mono text-[11px] uppercase tracking-widest text-mangrove-700 dark:text-mangrove-300">
                    {role.subtitle}
                  </span>
                  <h2 className="mt-1 font-display text-2xl font-medium text-ink dark:text-sand-50 group-hover:text-mangrove-700 dark:group-hover:text-mangrove-300 transition-colors">
                    {role.title}
                  </h2>

                  {/* Description */}
                  <p className="mt-3 text-sm text-ink-soft dark:text-sand-100/70 leading-relaxed">
                    {role.description}
                  </p>
                </div>

                {/* Bottom CTA Action Bar */}
                <div className="mt-8 pt-5 border-t border-ocean-900/5 dark:border-sand-100/5 flex items-center justify-between text-xs font-mono font-medium text-ink group-hover:text-mangrove-700 dark:text-sand-100 dark:group-hover:text-mangrove-300 transition-colors">
                  <span>Continue as {role.id.charAt(0).toUpperCase() + role.id.slice(1)}</span>
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-sand-100 dark:bg-[#071a20] group-hover:bg-mangrove-500 group-hover:text-ink transition-all duration-300">
                    <ArrowRight size={14} className="transform group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 container mx-auto px-6 py-6 text-center text-xs font-mono text-ink-faint dark:text-sand-100/40">
        © {new Date().getFullYear()} BlueCarbon Nexus. Verified Blockchain MRV Registry.
      </footer>
    </div>
  );
}
"use client";

import { motion } from "framer-motion";
import { Plane, BrainCircuit, ShieldCheck, Link2, Store } from "lucide-react";
import { SectionHeading } from "@/components/ui/section-heading";

const STEPS = [
  {
    icon: Plane,
    label: "Drone Survey",
    title: "Aerial capture",
    description:
      "Scheduled drone and satellite passes photograph canopy cover, tidal channels, and planting sites at fixed intervals.",
  },
  {
    icon: BrainCircuit,
    label: "AI Analysis",
    title: "Biomass estimation",
    description:
      "Computer vision models segment canopy extent and estimate above-ground biomass and carbon sequestration.",
  },
  {
    icon: ShieldCheck,
    label: "Verification",
    title: "Field cross-check",
    description:
      "Automated flags are reconciled against ground-truth sampling and reviewed by qualified field verifiers.",
  },
  {
    icon: Link2,
    label: "Blockchain",
    title: "Evidence anchoring",
    description:
      "Verified data is hashed and written to a public ledger, creating a permanent, tamper-evident audit trail.",
  },
  {
    icon: Store,
    label: "Marketplace",
    title: "Credit issuance",
    description:
      "Anchored evidence packages flow to registries and buyers, ready for issuance under recognised methodologies.",
  },
];

export function HowItWorks() {
  return (
    <section id="technology" className="section-pad bg-ocean-100/40 py-24 sm:py-32 dark:bg-[#071a20]">
      <div className="container-page">
        <SectionHeading
          eyebrow="How It Works"
          title="One survey flight, one unbroken chain of evidence."
          description="Five stages carry a single reading — a patch of mangrove canopy on a given day — from the field to a form any registry can audit."
          align="center"
          className="mx-auto"
        />

        <div className="relative mt-20">
          <div className="absolute left-0 right-0 top-[27px] hidden h-px border-t border-dashed border-ocean-900/25 lg:block dark:border-sand-100/25" />
          <div className="grid gap-10 lg:grid-cols-5 lg:gap-6">
            {STEPS.map((step) => (
              <motion.div
                key={step.label}
                initial={{ opacity: 1, y: 0 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative"
              >
                <div className="relative z-10 flex h-14 w-14 items-center justify-center rounded-full border border-ocean-900/15 bg-sand-50 text-ocean-900 shadow-soft dark:border-sand-100/15 dark:bg-[#0a232b] dark:text-mangrove-300">
                  <step.icon size={20} strokeWidth={1.75} />
                </div>
                <span className="mt-5 block font-mono text-[10.5px] uppercase tracking-widest2 text-mangrove-700 dark:text-mangrove-300">
                  {step.label}
                </span>
                <h3 className="mt-2 font-display text-[19px] text-ink dark:text-sand-50">
                  {step.title}
                </h3>
                <p className="mt-2.5 text-[14px] leading-relaxed text-ink/65 dark:text-sand-100/60">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

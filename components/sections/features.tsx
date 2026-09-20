"use client";

import { motion } from "framer-motion";
import {
  FileCheck2,
  Satellite,
  Waves,
  Network,
  Radar,
  Users,
} from "lucide-react";
import { SectionHeading } from "@/components/ui/section-heading";

const FEATURES = [
  {
    icon: FileCheck2,
    title: "Tamper-evident evidence ledger",
    description:
      "Every survey, sample, and report is hashed and timestamped, so no record can be altered after the fact without detection.",
  },
  {
    icon: Satellite,
    title: "Multi-source monitoring",
    description:
      "Drone imagery, satellite passes, and in-field sensors feed a single evidence stream — no manual reconciliation required.",
  },
  {
    icon: Waves,
    title: "Built for coastal ecosystems",
    description:
      "Purpose-built for mangroves, seagrass meadows, and tidal marsh — habitats existing MRV tooling wasn't designed around.",
  },
  {
    icon: Network,
    title: "Registry-compatible by design",
    description:
      "Evidence packages map to recognised methodologies, so verified data can move into existing issuance pipelines.",
  },
  {
    icon: Radar,
    title: "GIS-native project records",
    description:
      "Every project boundary, planting zone, and monitoring point lives on an interactive map, not a spreadsheet.",
  },
  {
    icon: Users,
    title: "Built with field teams",
    description:
      "Designed around how restoration NGOs and mangrove cells actually collect data — offline-first, low-bandwidth ready.",
  },
];

export function Features() {
  return (
    <section id="solutions" className="section-pad py-24 sm:py-32">
      <div className="container-page">
        <SectionHeading
          eyebrow="Features"
          title="Infrastructure built around one requirement: verifiability."
          description="Everything here exists to answer a single question a skeptical auditor might ask — how do we know this actually happened?"
        />

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 1, y: 0 }}
              animate={{ opacity: 1, y: 0 }}
              className="group rounded-2xl border border-ocean-900/10 bg-sand-50 p-7 shadow-card transition-colors duration-300 hover:border-mangrove-500/30 dark:border-sand-100/10 dark:bg-[#0a232b]"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-ocean-100 text-ocean-900 transition-colors group-hover:bg-mangrove-100 group-hover:text-mangrove-700 dark:bg-ocean-900/40 dark:text-ocean-300 dark:group-hover:bg-mangrove-900/50 dark:group-hover:text-mangrove-300">
                <f.icon size={19} strokeWidth={1.75} />
              </div>
              <h3 className="mt-5 font-display text-[18px] text-ink dark:text-sand-50">
                {f.title}
              </h3>
              <p className="mt-2.5 text-[14px] leading-relaxed text-ink/65 dark:text-sand-100/60">
                {f.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

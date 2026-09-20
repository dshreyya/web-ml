"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { SectionHeading } from "@/components/ui/section-heading";
import { ScanFrame } from "@/components/ui/scan-frame";

const STATS = [
  { value: "MRV", label: "Evidence infrastructure, not a token exchange" },
  { value: "VM0033", label: "Built toward Verra & Gold Standard methodologies" },
  { value: "24/7", label: "Continuous canopy & tidal monitoring" },
];

export function About() {
  return (
    <section id="about" className="section-pad py-24 sm:py-32">
      <div className="container-page grid gap-16 lg:grid-cols-2 lg:items-center lg:gap-12">
        <SectionHeading
          eyebrow="About BlueCarbon Nexus"
          title="A verification layer for the blue carbon economy — not another registry to compete with."
          description={
            <>
              Coastal restoration projects lose credibility long before they lose credits — in
              the gap between what happens on the water and what gets reported. BlueCarbon Nexus
              closes that gap. Drone flights and satellite passes are converted into geotagged,
              timestamped evidence, hashed and anchored on-chain, then routed toward the
              methodologies and registries that already govern blue carbon issuance.
              <br />
              <br />
              The result is a record that funders, auditors, and communities can all verify
              independently — without asking anyone to take the project&rsquo;s word for it.
            </>
          }
        />

        <motion.div
          initial={{ opacity: 1, scale: 1 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="relative aspect-[4/5] overflow-hidden rounded-[28px] shadow-glow sm:aspect-square"
        >
          <Image
            src="/images/about-mangrove.jpg"
            alt="Aerial view of mangrove restoration site"
            fill
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ocean-950/70 via-transparent to-transparent" />
          <ScanFrame coordinates="19.02° N, 72.85° E" hash="0x4c9a…11e2" label="FIELD SITE · 03" />
        </motion.div>
      </div>

      <div className="container-page mt-20 grid gap-px overflow-hidden rounded-2xl border border-ocean-900/10 bg-ocean-900/10 sm:grid-cols-3 dark:border-sand-100/10 dark:bg-sand-100/10">
        {STATS.map((s) => (
          <motion.div
            key={s.value}
            initial={{ opacity: 1, y: 0 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-sand-50 px-8 py-9 dark:bg-[#071a20]"
          >
            <div className="font-mono text-[13px] tracking-wide text-mangrove-700 dark:text-mangrove-300">
              {s.value}
            </div>
            <p className="mt-2 text-[14.5px] leading-snug text-ink/70 dark:text-sand-100/70">
              {s.label}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
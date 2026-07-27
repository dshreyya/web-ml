"use client";

import { motion } from "framer-motion";
import { Quote } from "lucide-react";
import { SectionHeading } from "@/components/ui/section-heading";

const QUOTES = [
  {
    quote:
      "We used to spend weeks reconciling drone footage with field notebooks before every audit. Now the evidence trail is already assembled by the time our verifier asks for it.",
    name: "Restoration Program Lead",
    org: "Coastal NGO, West Bengal",
  },
  {
    quote:
      "The GIS registry gave our funders a way to see exactly where their money went — down to individual planting plots, not just a regional total.",
    name: "Project Coordinator",
    org: "State Mangrove Cell",
  },
  {
    quote:
      "What stood out was how little it changed our fieldwork. The monitoring fits into the surveys our team was already running.",
    name: "Field Verification Officer",
    org: "Independent MRV Auditor",
  },
];

export function Testimonials() {
  return (
    <section className="section-pad py-24 sm:py-32">
      <div className="container-page">
        <SectionHeading
          eyebrow="From the Field"
          title="Built alongside the teams doing the restoration work."
          align="center"
          className="mx-auto"
        />

        <div className="mt-16 grid gap-6 lg:grid-cols-3">
          {QUOTES.map((t) => (
            <motion.figure
              key={t.name}
              initial={{ opacity: 1, y: 0 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl border border-ocean-900/10 bg-sand-50 p-8 dark:border-sand-100/10 dark:bg-[#0a232b]"
            >
              <Quote size={20} className="text-mangrove-500" strokeWidth={1.5} />
              <blockquote className="mt-5 text-[15px] leading-relaxed text-ink/80 dark:text-sand-100/75">
                &ldquo;{t.quote}&rdquo;
              </blockquote>
              <figcaption className="mt-6 border-t border-ocean-900/8 pt-4 dark:border-sand-100/10">
                <div className="text-[13.5px] font-medium text-ink dark:text-sand-50">
                  {t.name}
                </div>
                <div className="text-[12.5px] text-ink/50 dark:text-sand-100/50">{t.org}</div>
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  );
}

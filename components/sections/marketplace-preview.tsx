"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { ArrowUpRight, BadgeCheck } from "lucide-react";
import { SectionHeading } from "@/components/ui/section-heading";
import { Button } from "@/components/ui/button";

const LISTINGS = [
  {
    name: "Sundarbans Mangrove Restoration",
    region: "West Bengal, India",
    method: "VM0033-aligned",
    hectares: "1,240 ha",
  },
  {
    name: "Gulf of Kutch Seagrass Recovery",
    region: "Gujarat, India",
    method: "Gold Standard track",
    hectares: "480 ha",
  },
  {
    name: "Pichavaram Tidal Marsh",
    region: "Tamil Nadu, India",
    method: "VM0033-aligned",
    hectares: "310 ha",
  },
];

export function MarketplacePreview() {
  return (
    <section id="marketplace" className="section-pad py-24 sm:py-32 bg-ocean-100/40 dark:bg-[#071a20]">
      <div className="container-page">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading
            eyebrow="Marketplace"
            title="Verified projects, ready for the next step."
            description="Browse restoration projects with anchored evidence trails — each one traceable back to the drone pass and field verification behind it."
          />
          <Button href="#marketplace" variant="secondary" size="md" className="mb-1">
            View all listings <ArrowUpRight size={14} />
          </Button>
        </div>

        <div className="mt-14 grid gap-6 lg:grid-cols-3">
          {LISTINGS.map((item, i) => (
            <motion.div
              key={item.name}
              initial={{ opacity: 1, y: 0 }}
              animate={{ opacity: 1, y: 0 }}
              className="overflow-hidden rounded-2xl border border-ocean-900/10 bg-sand-50 shadow-card dark:border-sand-100/10 dark:bg-[#0a232b]"
            >
              <div className="relative h-40">
                <Image
                  src={`/images/marketplace-${i + 1}.jpg`}
                  alt={item.name}
                  fill
                  sizes="(min-width: 1024px) 33vw, 100vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ocean-950/60 to-transparent" />
                <span className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-sand-50/95 px-2.5 py-1 font-mono text-[10px] text-mangrove-700">
                  <BadgeCheck size={12} /> Evidence verified
                </span>
              </div>
              <div className="p-6">
                <h3 className="font-display text-[18px] text-ink dark:text-sand-50">
                  {item.name}
                </h3>
                <p className="mt-1 text-[13px] text-ink/55 dark:text-sand-100/55">
                  {item.region}
                </p>
                <div className="mt-5 flex items-center justify-between border-t border-ocean-900/8 pt-4 text-[12.5px] dark:border-sand-100/10">
                  <span className="font-mono text-ink/60 dark:text-sand-100/60">{item.method}</span>
                  <span className="font-mono text-ink/60 dark:text-sand-100/60">{item.hectares}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
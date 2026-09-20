"use client";

import { motion } from "framer-motion";

const STATS = [
  { value: "2,030+", label: "Hectares under active monitoring" },
  { value: "18", label: "Coastal restoration projects onboarded" },
  { value: "6,400+", label: "Verified survey passes recorded" },
  { value: "100%", label: "Evidence hash-anchored on-chain" },
];

export function Statistics() {
  return (
    <section className="section-pad py-20">
      <div className="container-page rounded-[28px] bg-ocean-950 px-8 py-16 sm:px-14">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {STATS.map((s) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 1, y: 0 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="font-display text-[2.5rem] leading-none text-sand-50">
                {s.value}
              </div>
              <p className="mt-3 text-[13.5px] leading-snug text-sand-100/60">
                {s.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

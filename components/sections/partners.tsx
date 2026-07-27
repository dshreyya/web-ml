"use client";

import { SectionHeading } from "@/components/ui/section-heading";

const CATEGORIES = [
  { label: "Standards & Methodologies", items: ["VM0033 alignment", "Gold Standard track", "ICVCM core principles"] },
  { label: "Technology Stack", items: ["Polygon anchoring", "IPFS evidence storage", "Open GIS layers"] },
  { label: "Field Network", items: ["Restoration NGOs", "State mangrove cells", "Academic field stations"] },
];

export function Partners() {
  return (
    <section className="section-pad py-24 sm:py-28">
      <div className="container-page">
        <SectionHeading
          eyebrow="Aligned With"
          title="Designed to plug into the systems that already govern blue carbon."
          align="center"
          className="mx-auto"
        />
        <div className="mt-14 grid gap-px overflow-hidden rounded-2xl border border-ocean-900/10 bg-ocean-900/10 sm:grid-cols-3 dark:border-sand-100/10 dark:bg-sand-100/10">
          {CATEGORIES.map((cat) => (
            <div key={cat.label} className="bg-sand-50 px-8 py-10 dark:bg-[#0a232b]">
              <h3 className="font-mono text-[11px] uppercase tracking-widest2 text-mangrove-700 dark:text-mangrove-300">
                {cat.label}
              </h3>
              <ul className="mt-4 space-y-2.5">
                {cat.items.map((item) => (
                  <li key={item} className="text-[14.5px] text-ink/70 dark:text-sand-100/65">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

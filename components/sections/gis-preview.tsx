"use client";

import { motion } from "framer-motion";
import { MapPin, Layers, ArrowUpRight } from "lucide-react";
import { SectionHeading } from "@/components/ui/section-heading";
import { AerialArt } from "@/components/ui/aerial-art";
import { Button } from "@/components/ui/button";

const PINS = [
  { x: "28%", y: "38%", label: "Sundarbans Delta" },
  { x: "52%", y: "62%", label: "Gulf of Kutch" },
  { x: "70%", y: "30%", label: "Godavari Estuary" },
  { x: "40%", y: "72%", label: "Pichavaram" },
];

const LAYERS = ["Mangrove canopy", "Tidal boundary", "Monitoring points", "Restoration zones"];

export function GISPreview() {
  return (
    <section id="gis-registry" className="section-pad py-24 sm:py-32">
      <div className="container-page grid gap-14 lg:grid-cols-2 lg:items-center lg:gap-16">
        <div className="order-2 lg:order-1">
          <SectionHeading
            eyebrow="GIS Registry"
            title="Every project, mapped down to the planting row."
            description="Project boundaries, monitoring points, and restoration zones live on an interactive coastal map — not buried in a report PDF. Explore geotagged evidence for any registered site."
          />
          <div className="mt-8 space-y-3">
            {LAYERS.map((layer) => (
              <div key={layer} className="flex items-center gap-3 text-[14px] text-ink/70 dark:text-sand-100/65">
                <span className="flex h-6 w-6 items-center justify-center rounded-md bg-mangrove-100 text-mangrove-700 dark:bg-mangrove-900/40 dark:text-mangrove-300">
                  <Layers size={12} />
                </span>
                {layer}
              </div>
            ))}
          </div>
          <Button href="#gis-registry" variant="secondary" size="md" className="mt-8">
            Open the GIS Registry <ArrowUpRight size={14} />
          </Button>
        </div>

        <motion.div
          initial={{ opacity: 1, scale: 1 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="relative order-1 aspect-[4/3] overflow-hidden rounded-[28px] border border-ocean-900/10 shadow-soft lg:order-2 dark:border-sand-100/10"
        >
          <AerialArt variant="grid" />
          {PINS.map((pin) => (
            <div
              key={pin.label}
              className="group absolute -translate-x-1/2 -translate-y-full"
              style={{ left: pin.x, top: pin.y }}
            >
              <div className="flex flex-col items-center">
                <span className="whitespace-nowrap rounded-md bg-ocean-950/85 px-2 py-1 font-mono text-[10px] text-sand-50 opacity-0 transition-opacity group-hover:opacity-100">
                  {pin.label}
                </span>
                <MapPin size={22} className="mt-1 text-mangrove-300 drop-shadow" fill="#0A3D5C" strokeWidth={1.5} />
              </div>
            </div>
          ))}
          <div className="absolute bottom-4 right-4 rounded-lg bg-sand-50/90 px-3 py-1.5 font-mono text-[10px] text-ocean-900 backdrop-blur">
            4 active regions
          </div>
        </motion.div>
      </div>
    </section>
  );
}

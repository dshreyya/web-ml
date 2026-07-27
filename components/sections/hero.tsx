"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { ArrowRight, PlayCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScanFrame } from "@/components/ui/scan-frame";

const fadeUp = {
  hidden: { opacity: 0, y: 22 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, delay: 0.15 + i * 0.1, ease: [0.16, 1, 0.3, 1] as const },
  }),
};

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-[72px]">
      <div className="relative min-h-[92vh]">
        <div className="absolute inset-0">
          {/*
            Hero photo: full-bleed, responsive, art-directed crop.
            Drop your licensed aerial mangrove photograph at
            public/images/hero-mangrove.jpg (recommended source resolution:
            2400px+ wide) — this component picks it up automatically.
            `object-position` keeps the mangrove islands / turquoise
            waterways centered across breakpoints; adjust per-image.
          */}
          <Image
            src="/images/hero-mangrove.jpg"
            alt="Aerial view of mangrove islands and turquoise tidal waterways"
            fill
            priority
            sizes="100vw"
            className="object-cover object-[center_38%] sm:object-[center_32%]"
          />
          {/* Readability scrim: dark ocean-blue → mangrove-green, ~20-30% opacity, heavier at bottom where the headline sits */}
          <div className="absolute inset-0 bg-gradient-to-t from-ocean-950/65 via-ocean-950/25 to-mangrove-950/15" />
          <div className="absolute inset-0 bg-gradient-to-r from-ocean-950/35 via-transparent to-ocean-950/15" />
        </div>

        <ScanFrame coordinates="21.14° N, 72.79° E" hash="0x8f21…c04a" />

        <div className="container-page section-pad relative flex min-h-[92vh] flex-col justify-end pb-20 pt-32 sm:pb-28">
          <motion.span
            custom={0}
            initial="hidden"
            animate="show"
            variants={fadeUp}
            className="eyebrow mb-6 inline-flex w-fit items-center gap-2 rounded-full border border-sand-50/20 px-3.5 py-1.5 text-mangrove-300 backdrop-blur-sm"
          >
            Drone · Satellite · Blockchain MRV
          </motion.span>

          <motion.h1
            custom={1}
            initial="hidden"
            animate="show"
            variants={fadeUp}
            className="max-w-3xl font-display text-[2.5rem] font-normal leading-[1.08] tracking-tight text-sand-50 balance sm:text-[3.4rem] lg:text-[4rem]"
          >
            Protecting coastal ecosystems through transparent blue carbon verification.
          </motion.h1>

          <motion.p
            custom={2}
            initial="hidden"
            animate="show"
            variants={fadeUp}
            className="mt-6 max-w-xl text-[16px] leading-relaxed text-sand-100/75 sm:text-[17px]"
          >
            BlueCarbon Nexus turns drone and satellite monitoring of mangroves, seagrass, and
            tidal marsh into tamper-proof, blockchain-anchored evidence — built to strengthen
            the registries that issue and govern blue carbon credits.
          </motion.p>

          <motion.div
            custom={3}
            initial="hidden"
            animate="show"
            variants={fadeUp}
            className="mt-9 flex flex-wrap items-center gap-4"
          >
            <Button href="#register" variant="primary" size="lg">
              Register Project <ArrowRight size={15} />
            </Button>
            <Button
              href="#marketplace"
              size="lg"
              className="border border-sand-50/30 text-sand-50 hover:bg-sand-50/10"
              variant="ghost"
            >
              <PlayCircle size={16} /> Explore Marketplace
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

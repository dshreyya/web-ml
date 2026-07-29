"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CtaBand() {
  return (
    <section id="get-started" className="section-pad pb-24 sm:pb-32">
      <motion.div
        initial={{ opacity: 1, y: 0 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="container-page relative overflow-hidden rounded-[28px]"
      >
        <div className="relative px-8 py-20 sm:px-16 sm:py-24">
          <div className="absolute inset-0">
            <Image
              src="/images/cta-mangrove.jpg"
              alt="Aerial mangrove coastline"
              fill
              sizes="100vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-ocean-950/80" />
          </div>

          <div className="relative mx-auto max-w-xl text-center">
            <h2 className="font-display text-[2rem] leading-tight text-sand-50 balance sm:text-[2.5rem]">
              Join the Blue Carbon Ecosystem
            </h2>

            <p className="mt-4 text-[15px] leading-relaxed text-sand-100/70">
              Whether you're a farmer restoring mangroves, an industry buyer
              investing in verified carbon credits, or an administrator managing
              the platform, BlueCarbon Nexus provides a secure and transparent
              ecosystem for everyone.
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Button
                href="/role-selection"
                variant="primary"
                size="lg"
              >
                Get Started <ArrowRight size={15} />
              </Button>

              <Button
                href="#contact"
                size="lg"
                variant="ghost"
                className="border border-sand-50/30 text-sand-50 hover:bg-sand-50/10"
              >
                Talk to our team
              </Button>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
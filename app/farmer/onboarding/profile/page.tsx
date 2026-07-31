"use client";

import { motion } from "framer-motion";
import { User, Leaf, MapPin } from "lucide-react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

const fadeUp = {
  hidden: {
    opacity: 0,
    y: 24,
  },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      delay: i * 0.12,
    },
  }),
};

export default function FarmerProfilePage() {
  return (
    <>
      <Navbar />

      <main className="relative min-h-screen overflow-hidden bg-gradient-to-b from-sand-50 via-white to-mangrove-50 dark:from-[#041116] dark:via-[#061418] dark:to-[#0a2024]">

        {/* Background Blur */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -left-40 top-20 h-96 w-96 rounded-full bg-mangrove-400/20 blur-3xl" />
          <div className="absolute right-0 top-40 h-[500px] w-[500px] rounded-full bg-ocean-500/10 blur-3xl" />
        </div>

        <section className="container-page relative pt-36 pb-24">

          {/* Heading */}

          <motion.div
            custom={0}
            initial="hidden"
            animate="show"
            variants={fadeUp}
            className="mx-auto max-w-3xl text-center"
          >
            <span className="inline-flex items-center rounded-full border border-mangrove-300/40 bg-mangrove-100/60 px-4 py-1 text-sm font-medium text-mangrove-700 dark:bg-mangrove-900/30 dark:text-mangrove-300">
              Farmer Onboarding
            </span>

            <h1 className="mt-6 font-display text-5xl font-semibold tracking-tight text-ocean-950 dark:text-white">
              Complete Farmer Profile
            </h1>

            <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-slate-600 dark:text-slate-300">
              Complete your profile before registering your Blue Carbon
              restoration project.
            </p>
          </motion.div>

          {/* Personal Information Card */}

          <motion.div
            custom={1}
            initial="hidden"
            animate="show"
            variants={fadeUp}
            className="mx-auto mt-16 max-w-5xl rounded-3xl border border-white/50 bg-white/70 p-10 shadow-2xl backdrop-blur-xl dark:border-white/10 dark:bg-white/5"
          >
            <div className="mb-8 flex items-center gap-3">
              <div className="rounded-xl bg-mangrove-100 p-3 dark:bg-mangrove-900/30">
                <User className="h-6 w-6 text-mangrove-700 dark:text-mangrove-300" />
              </div>

              <div>
                <h2 className="text-2xl font-semibold text-ocean-950 dark:text-white">
                  Personal Information
                </h2>

                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Tell us about yourself.
                </p>
              </div>
            </div>

            {/* FORM COMES IN PART B */}
          </motion.div>

          {/* Project Information Card */}

          <motion.div
            custom={2}
            initial="hidden"
            animate="show"
            variants={fadeUp}
            className="mx-auto mt-10 max-w-5xl rounded-3xl border border-white/50 bg-white/70 p-10 shadow-2xl backdrop-blur-xl dark:border-white/10 dark:bg-white/5"
          >
            <div className="mb-8 flex items-center gap-3">
              <div className="rounded-xl bg-ocean-100 p-3 dark:bg-ocean-900/30">
                <Leaf className="h-6 w-6 text-ocean-700 dark:text-ocean-300" />
              </div>

              <div>
                <h2 className="text-2xl font-semibold text-ocean-950 dark:text-white">
                  Project Information
                </h2>

                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Details about your Blue Carbon project.
                </p>
              </div>
            </div>

            {/* FORM COMES IN PART B */}
          </motion.div>

          {/* Location Card */}

          <motion.div
            custom={3}
            initial="hidden"
            animate="show"
            variants={fadeUp}
            className="mx-auto mt-10 max-w-5xl rounded-3xl border border-white/50 bg-white/70 p-10 shadow-2xl backdrop-blur-xl dark:border-white/10 dark:bg-white/5"
          >
            <div className="mb-8 flex items-center gap-3">
              <div className="rounded-xl bg-emerald-100 p-3 dark:bg-emerald-900/30">
                <MapPin className="h-6 w-6 text-emerald-700 dark:text-emerald-300" />
              </div>

              <div>
                <h2 className="text-2xl font-semibold text-ocean-950 dark:text-white">
                  Location
                </h2>

                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Help us locate your restoration project.
                </p>
              </div>
            </div>

            {/* FORM COMES IN PART B */}
          </motion.div>

        </section>
      </main>

      <Footer />
    </>
  );
}
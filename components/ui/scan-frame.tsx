"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * Signature verification motif: a targeting/scan frame that overlays aerial
 * imagery with a sweeping scan line, live coordinate readout, and a
 * verification hash — visualizing the site's core idea (a drone/satellite
 * pass being converted into a tamper-proof evidence record).
 */
export function ScanFrame({
  className,
  coordinates = "21.14\u00B0 N, 72.79\u00B0 E",
  hash = "0x8f21…c04a",
  label = "SCAN PASS · LIVE",
}: {
  className?: string;
  coordinates?: string;
  hash?: string;
  label?: string;
}) {
  return (
    <div className={cn("pointer-events-none absolute inset-0", className)}>
      {/* corner brackets */}
      {[
        "top-5 left-5 border-t border-l",
        "top-5 right-5 border-t border-r",
        "bottom-5 left-5 border-b border-l",
        "bottom-5 right-5 border-b border-r",
      ].map((pos) => (
        <span
          key={pos}
          className={cn("absolute h-6 w-6 border-sand-50/70", pos)}
        />
      ))}

      {/* sweeping scan line */}
      <div className="absolute inset-x-5 top-5 bottom-5 overflow-hidden">
        <motion.div
          className="h-px w-full bg-gradient-to-r from-transparent via-mangrove-300 to-transparent"
          animate={{ y: ["0%", "100%", "0%"] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          style={{ boxShadow: "0 0 12px 1px rgba(143,203,169,0.6)" }}
        />
      </div>

      {/* readouts */}
      <div className="absolute left-5 top-5 flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest2 text-sand-50/85">
        <span className="h-1.5 w-1.5 animate-pulse-soft rounded-full bg-mangrove-300" />
        {label}
      </div>
      <div className="absolute bottom-5 left-5 font-mono text-[10px] tracking-wide text-sand-50/80">
        {coordinates}
      </div>
      <div className="absolute bottom-5 right-5 font-mono text-[10px] tracking-wide text-sand-50/80">
        HASH {hash}
      </div>
    </div>
  );
}

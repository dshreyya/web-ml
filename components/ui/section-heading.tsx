"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  className,
  light = false,
}: {
  eyebrow?: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  align?: "left" | "center";
  className?: string;
  light?: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 1, y: 0 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        "max-w-2xl",
        align === "center" && "mx-auto text-center",
        className
      )}
    >
      {eyebrow && (
        <span className={cn("eyebrow", light && "text-mangrove-300")}>
          {eyebrow}
        </span>
      )}
      <h2
        className={cn(
          "mt-4 font-display text-[2.1rem] leading-[1.12] tracking-tight balance sm:text-[2.6rem]",
          light ? "text-sand-50" : "text-ink dark:text-sand-50"
        )}
      >
        {title}
      </h2>
      {description && (
        <p
          className={cn(
            "mt-5 text-[15.5px] leading-relaxed",
            light ? "text-sand-100/70" : "text-ink-soft text-ink/65 dark:text-sand-100/65"
          )}
        >
          {description}
        </p>
      )}
    </motion.div>
  );
}

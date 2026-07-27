"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/components/theme-provider";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return <div className="h-9 w-9" aria-hidden />;
  }

  const isDark = theme === "dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className="flex h-9 w-9 items-center justify-center rounded-full border border-ocean-900/15 text-ocean-900 transition-colors hover:bg-ocean-900/[0.05] dark:border-sand-100/20 dark:text-sand-100 dark:hover:bg-sand-100/[0.08]"
    >
      {isDark ? <Sun size={15} /> : <Moon size={15} />}
    </button>
  );
}
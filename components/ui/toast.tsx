"use client";

import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";
import { cn } from "@/lib/utils";

export type ToastMessage = {
  id: string;
  type: "success" | "error" | "info";
  title: string;
  description?: string;
};

interface ToastContainerProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export function ToastContainer({ toasts, onDismiss }: ToastContainerProps) {
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 max-w-md w-full px-4 pointer-events-none">
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className={cn(
              "pointer-events-auto flex items-start gap-3 rounded-2xl p-4 shadow-soft border text-sm backdrop-blur-md",
              toast.type === "success" &&
                "bg-mangrove-100/90 border-mangrove-300/60 text-mangrove-950 dark:bg-[#0d2a1c]/90 dark:border-mangrove-700/50 dark:text-mangrove-150",
              toast.type === "error" &&
                "bg-red-50/90 border-red-200 text-red-950 dark:bg-[#2b0a0a]/90 dark:border-red-800/50 dark:text-red-150",
              toast.type === "info" &&
                "bg-ocean-100/90 border-ocean-300/60 text-ocean-950 dark:bg-[#051e2b]/90 dark:border-ocean-700/50 dark:text-ocean-150"
            )}
          >
            <div className="mt-0.5 shrink-0">
              {toast.type === "success" && <CheckCircle2 size={18} className="text-mangrove-700 dark:text-mangrove-300" />}
              {toast.type === "error" && <AlertCircle size={18} className="text-red-600 dark:text-red-400" />}
              {toast.type === "info" && <Info size={18} className="text-ocean-700 dark:text-ocean-300" />}
            </div>

            <div className="flex-1 min-w-0">
              <h4 className="font-medium leading-tight">{toast.title}</h4>
              {toast.description && (
                <p className="mt-1 text-xs opacity-90 leading-relaxed">{toast.description}</p>
              )}
            </div>

            <button
              onClick={() => onDismiss(toast.id)}
              className="shrink-0 p-1 rounded-full opacity-60 hover:opacity-100 transition-opacity"
              aria-label="Close notification"
            >
              <X size={15} />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

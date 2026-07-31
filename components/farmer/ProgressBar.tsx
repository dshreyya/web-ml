"use client";

import React from "react";
import { motion } from "framer-motion";

export interface StepItem {
  id: number;
  label: string;
}

interface ProgressBarProps {
  steps: StepItem[];
  currentStep: number; // 1-indexed
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ steps, currentStep }) => {
  // Calculate percentage for progress line fill
  const progressPercentage = ((currentStep - 1) / (steps.length - 1)) * 100;

  return (
    <div className="w-full max-w-4xl mx-auto py-6 px-4">
      <div className="relative flex items-center justify-between">
        {/* Background Gray Line */}
        <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-full h-1 bg-gray-200 -z-0" />

        {/* Animated Active Line */}
        <motion.div
          className="absolute left-0 top-1/2 transform -translate-y-1/2 h-1 bg-blue-600 -z-0"
          initial={{ width: "0%" }}
          animate={{ width: `${progressPercentage}%` }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        />

        {/* Step Nodes */}
        {steps.map((step) => {
          const isCompleted = step.id < currentStep;
          const isCurrent = step.id === currentStep;

          return (
            <div key={step.id} className="relative z-10 flex flex-col items-center">
              {/* Circle Icon Node */}
              <motion.div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm border-2 transition-colors duration-300 ${
                  isCompleted
                    ? "bg-green-500 border-green-500 text-white"
                    : isCurrent
                    ? "bg-blue-600 border-blue-600 text-white shadow-lg"
                    : "bg-white border-gray-300 text-gray-400"
                }`}
                animate={
                  isCurrent
                    ? {
                        scale: [1, 1.1, 1],
                        boxShadow: [
                          "0px 0px 0px rgba(37, 99, 235, 0.4)",
                          "0px 0px 12px rgba(37, 99, 235, 0.7)",
                          "0px 0px 0px rgba(37, 99, 235, 0.4)",
                        ],
                      }
                    : { scale: 1 }
                }
                transition={
                  isCurrent
                    ? { repeat: Infinity, duration: 2, ease: "easeInOut" }
                    : { duration: 0.2 }
                }
              >
                {isCompleted ? (
                  <motion.svg
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    className="w-6 h-6 stroke-current"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="3"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </motion.svg>
                ) : (
                  <span>{step.id}</span>
                )}
              </motion.div>

              {/* Step Label */}
              <span
                className={`absolute top-12 text-xs font-medium whitespace-nowrap text-center ${
                  isCompleted
                    ? "text-green-600"
                    : isCurrent
                    ? "text-blue-600 font-bold"
                    : "text-gray-400"
                }`}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
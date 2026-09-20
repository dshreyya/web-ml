"use client";

import React from "react";
import { motion } from "framer-motion";

export type StepStatus = "completed" | "current" | "locked";

interface StepCardProps {
  status: StepStatus;
  title: string;
  description: string;
  buttonText: string;
  onAction?: () => void;
}

export const StepCard: React.FC<StepCardProps> = ({
  status,
  title,
  description,
  buttonText,
  onAction,
}) => {
  const isCompleted = status === "completed";
  const isCurrent = status === "current";
  const isLocked = status === "locked";

  // Card background and border styles based on status
  const getCardStyle = () => {
    if (isCompleted) return "bg-white border-green-200 shadow-sm";
    if (isCurrent) return "bg-white border-blue-500 shadow-md ring-2 ring-blue-500/20";
    return "bg-gray-50 border-gray-200 opacity-75";
  };

  // Button styles based on status
  const getButtonStyle = () => {
    if (isCompleted)
      return "bg-green-100 text-green-700 hover:bg-green-200 cursor-pointer font-medium";
    if (isCurrent)
      return "bg-blue-600 text-white hover:bg-blue-700 cursor-pointer font-semibold shadow-md";
    return "bg-gray-200 text-gray-400 cursor-not-allowed font-normal";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={
        !isLocked
          ? {
              scale: 1.02,
              boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
            }
          : {}
      }
      transition={{ duration: 0.3 }}
      className={`relative rounded-xl border p-6 flex flex-col justify-between h-full transition-all ${getCardStyle()}`}
    >
      {/* Header Status Badge */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <span
            className={`text-xs px-2.5 py-1 rounded-full font-medium flex items-center gap-1.5 ${
              isCompleted
                ? "bg-green-100 text-green-800"
                : isCurrent
                ? "bg-blue-100 text-blue-800"
                : "bg-gray-200 text-gray-600"
            }`}
          >
            {isCompleted && "✓ Completed"}
            {isCurrent && "🔵 Current Step"}
            {isLocked && "🔒 Locked"}
          </span>
        </div>

        {/* Content */}
        <h3
          className={`text-lg font-bold mb-2 ${
            isLocked ? "text-gray-500" : "text-gray-900"
          }`}
        >
          {title}
        </h3>
        <p className="text-sm text-gray-600 mb-6 leading-relaxed">{description}</p>
      </div>

      {/* Action Button */}
      <motion.button
        whileTap={!isLocked ? { scale: 0.98 } : {}}
        disabled={isLocked}
        onClick={onAction}
        className={`w-full py-2.5 px-4 rounded-lg text-sm transition-colors duration-200 flex items-center justify-center gap-2 ${getButtonStyle()}`}
      >
        {buttonText}
      </motion.button>
    </motion.div>
  );
};
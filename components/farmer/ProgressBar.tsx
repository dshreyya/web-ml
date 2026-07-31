"use client";

import { Check } from "lucide-react";

type ProgressBarProps = {
  currentStep: number;
};

const steps = [
  "Account",
  "Profile",
  "Documents",
  "Verification",
  "Dashboard",
];

export default function ProgressBar({
  currentStep,
}: ProgressBarProps) {
  return (
    <div className="w-full py-10">
      <div className="flex items-center justify-between relative">

        {/* Line */}
        <div className="absolute left-0 right-0 top-5 h-1 bg-gray-200 z-0 rounded-full" />

        {/* Active Line */}
        <div
          className="absolute left-0 top-5 h-1 bg-green-600 z-0 rounded-full transition-all duration-500"
          style={{
            width: `${(currentStep - 1) * 25}%`,
          }}
        />

        {steps.map((step, index) => {
          const stepNumber = index + 1;

          const completed = stepNumber < currentStep;
          const active = stepNumber === currentStep;

          return (
            <div
              key={step}
              className="relative z-10 flex flex-col items-center w-24"
            >
              <div
                className={`
                w-10
                h-10
                rounded-full
                flex
                items-center
                justify-center
                font-semibold
                transition-all
                duration-300

                ${
                  completed
                    ? "bg-green-600 text-white"
                    : active
                    ? "bg-blue-600 text-white ring-4 ring-blue-200"
                    : "bg-gray-200 text-gray-600"
                }
                `}
              >
                {completed ? (
                  <Check size={18} />
                ) : (
                  stepNumber
                )}
              </div>

              <span
                className={`mt-3 text-sm font-medium text-center ${
                  active
                    ? "text-blue-700"
                    : completed
                    ? "text-green-700"
                    : "text-gray-500"
                }`}
              >
                {step}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
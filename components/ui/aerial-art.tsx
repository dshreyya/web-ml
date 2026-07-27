import { cn } from "@/lib/utils";

/**
 * Generative aerial-view artwork standing in for drone/satellite mangrove
 * photography — tidal creek channels cut through forest canopy, rendered
 * as layered organic paths in the ocean/mangrove palette. Swap the <svg>
 * body for a real aerial photograph when available; the ScanFrame overlay
 * is designed to sit on top of either.
 */
export function AerialArt({
  className,
  variant = "delta",
}: {
  className?: string;
  variant?: "delta" | "coast" | "grid";
}) {
  if (variant === "grid") {
    return (
      <svg
        viewBox="0 0 800 600"
        className={cn("h-full w-full", className)}
        preserveAspectRatio="xMidYMid slice"
      >
        <rect width="800" height="600" fill="#0A3D5C" />
        <path d="M0 60 Q200 180 380 120 T800 200 L800 0 L0 0 Z" fill="#0F5C87" opacity="0.6" />
        <path d="M0 600 L0 340 Q160 240 320 320 T650 300 Q740 330 800 280 L800 600 Z" fill="#123625" />
        <path d="M0 600 L0 420 Q180 360 340 420 T700 400 Q760 410 800 380 L800 600 Z" fill="#1B6B4A" />
        <path d="M0 600 L0 500 Q220 460 400 510 T800 480 L800 600 Z" fill="#2D8A5F" opacity="0.85" />
        {Array.from({ length: 9 }).map((_, i) => (
          <line key={`v${i}`} x1={i * 100} y1="0" x2={i * 100} y2="600" stroke="#E8F4F8" strokeOpacity="0.06" />
        ))}
        {Array.from({ length: 7 }).map((_, i) => (
          <line key={`h${i}`} x1="0" y1={i * 100} x2="800" y2={i * 100} stroke="#E8F4F8" strokeOpacity="0.06" />
        ))}
      </svg>
    );
  }

  return (
    <svg
      viewBox="0 0 800 600"
      className={cn("h-full w-full", className)}
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <linearGradient id="water" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#051E2B" />
          <stop offset="100%" stopColor="#0F5C87" />
        </linearGradient>
        <linearGradient id="canopyA" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#123625" />
          <stop offset="100%" stopColor="#1B6B4A" />
        </linearGradient>
        <linearGradient id="canopyB" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1B6B4A" />
          <stop offset="100%" stopColor="#2D8A5F" />
        </linearGradient>
        <radialGradient id="sunGlint" cx="50%" cy="20%" r="60%">
          <stop offset="0%" stopColor="#D6EAF2" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#D6EAF2" stopOpacity="0" />
        </radialGradient>
      </defs>

      <rect width="800" height="600" fill="url(#water)" />
      <rect width="800" height="600" fill="url(#sunGlint)" />

      {/* forest canopy mass */}
      <path
        d="M-20 90 C 120 30, 260 130, 400 70 S 700 20, 840 100 L 840 620 L -20 620 Z"
        fill="url(#canopyA)"
      />
      <path
        d="M-20 180 C 140 130, 300 220, 460 150 S 720 120, 840 190 L 840 620 L -20 620 Z"
        fill="url(#canopyB)"
        opacity="0.92"
      />

      {/* tidal creek channels carving through canopy */}
      <path
        d="M840 260 C 660 230, 600 340, 470 320 C 340 300, 300 400, 160 380 C 60 366, 20 420, -20 410"
        fill="none"
        stroke="#0A3D5C"
        strokeWidth="34"
        strokeLinecap="round"
        opacity="0.9"
      />
      <path
        d="M840 260 C 660 230, 600 340, 470 320 C 340 300, 300 400, 160 380 C 60 366, 20 420, -20 410"
        fill="none"
        stroke="#1B84B5"
        strokeWidth="10"
        strokeLinecap="round"
        opacity="0.55"
      />
      <path
        d="M600 600 C 560 500, 620 460, 560 400 C 520 360, 540 300, 480 260"
        fill="none"
        stroke="#0A3D5C"
        strokeWidth="22"
        strokeLinecap="round"
        opacity="0.85"
      />
      <path
        d="M240 600 C 260 520, 200 480, 230 420 C 250 380, 210 340, 230 300"
        fill="none"
        stroke="#0A3D5C"
        strokeWidth="16"
        strokeLinecap="round"
        opacity="0.8"
      />

      {/* canopy texture flecks */}
      {Array.from({ length: 60 }).map((_, i) => {
        const x = (i * 137) % 800;
        const y = 90 + ((i * 71) % 480);
        const r = 3 + (i % 5);
        return (
          <circle
            key={i}
            cx={x}
            cy={y}
            r={r}
            fill={i % 3 === 0 ? "#8FCBA9" : "#123625"}
            opacity={0.18}
          />
        );
      })}
    </svg>
  );
}

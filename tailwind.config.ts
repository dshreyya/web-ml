import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: "#0B1615",
          soft: "#3C4A49",
          faint: "#6B7877",
        },
        sand: {
          50: "#FDFCFA",
          100: "#FAF8F3",
          200: "#F3EFE6",
        },
        ocean: {
          950: "#051E2B",
          900: "#0A3D5C",
          700: "#0F5C87",
          500: "#1B84B5",
          300: "#8FC4DB",
          150: "#D6EAF2",
          100: "#E8F4F8",
        },
        mangrove: {
          950: "#0D2A1C",
          900: "#123625",
          700: "#1B6B4A",
          500: "#2D8A5F",
          300: "#8FCBA9",
          150: "#D7EFE1",
          100: "#E6F5EC",
        },
      },
      fontFamily: {
        display: ["var(--font-fraunces)", "serif"],
        sans: ["var(--font-inter)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      letterSpacing: {
        widest2: "0.28em",
      },
      boxShadow: {
        soft: "0 2px 8px rgba(10, 61, 92, 0.06), 0 12px 32px rgba(10, 61, 92, 0.08)",
        card: "0 1px 2px rgba(11, 22, 21, 0.04), 0 8px 24px rgba(11, 22, 21, 0.06)",
        glow: "0 0 0 1px rgba(45, 138, 95, 0.12), 0 8px 40px rgba(45, 138, 95, 0.18)",
      },
      backgroundImage: {
        "grain": "url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIj48ZmlsdGVyIGlkPSJuIj48ZmVUdXJidWxlbmNlIHR5cGU9ImZyYWN0YWxOb2lzZSIgYmFzZUZyZXF1ZW5jeT0iMC44NSIgbnVtT2N0YXZlcz0iMiIgc3RpdGNoVGlsZXM9InN0aXRjaCIvPjwvZmlsdGVyPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbHRlcj0idXJsKCNuKSIgb3BhY2l0eT0iMC4wNCIvPjwvc3ZnPg==')",
      },
      animation: {
        "scan-y": "scan-y 4.5s ease-in-out infinite",
        "float-slow": "float-slow 8s ease-in-out infinite",
        "pulse-soft": "pulse-soft 3s ease-in-out infinite",
        "marquee": "marquee 32s linear infinite",
      },
      keyframes: {
        "scan-y": {
          "0%, 100%": { transform: "translateY(0%)" },
          "50%": { transform: "translateY(100%)" },
        },
        "float-slow": {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        "pulse-soft": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.4" },
        },
        marquee: {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
      maxWidth: {
        "8xl": "88rem",
      },
    },
  },
  plugins: [],
};

export default config;

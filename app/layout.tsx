import type { Metadata } from "next";
import Script from "next/script";
import { Fraunces, Inter, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  axes: ["opsz", "SOFT", "WONK"],
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "BlueCarbon Nexus — Blockchain-Verified Blue Carbon Registry & MRV",
  description:
    "BlueCarbon Nexus is a blockchain-based Monitoring, Reporting & Verification (MRV) infrastructure for coastal blue carbon ecosystems — turning drone and satellite evidence into tamper-proof records for mangrove, seagrass, and tidal marsh restoration.",
  metadataBase: new URL("https://bluecarbonnexus.example"),
  openGraph: {
    title: "BlueCarbon Nexus — Blockchain-Verified Blue Carbon Registry & MRV",
    description:
      "Transparent, tamper-proof verification infrastructure for coastal blue carbon restoration.",
    type: "website",
  },
};

// Runs before hydration to apply the saved theme instantly, avoiding a
// light-mode flash on page load. Using next/script (beforeInteractive)
// instead of a raw <script> tag inside the tree keeps React from warning
// about scripts rendered as part of a component.
const THEME_INIT_SCRIPT = `
  (function () {
    try {
      var stored = window.localStorage.getItem('theme');
      if (stored === 'dark') {
        document.documentElement.classList.add('dark');
      }
    } catch (e) {}
  })();
`;

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <Script id="theme-init" strategy="beforeInteractive">
          {THEME_INIT_SCRIPT}
        </Script>
      </head>
      <body className={`${fraunces.variable} ${inter.variable} ${plexMono.variable} font-sans`}>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
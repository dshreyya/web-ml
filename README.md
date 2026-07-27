# BlueCarbon Nexus — Public Marketing Website

A premium public marketing site (pre-login) for **BlueCarbon Nexus**, a blockchain-based
Blue Carbon Registry & MRV (Monitoring, Reporting, Verification) platform for coastal
ecosystems. Built with Next.js 16 (App Router), TypeScript, Tailwind CSS, and Framer Motion.

## What's in the box

- Fully responsive, light/dark mode marketing site — no dashboards, wallet balances,
  gas fees, or admin data on any public page.
- Modular, typed components under `components/`, one file per section.
- A generative SVG "aerial mangrove" art system (`components/ui/aerial-art.tsx`) standing
  in for real drone/satellite photography, plus a signature "verification scan frame"
  overlay (`components/ui/scan-frame.tsx`) that ties the visual language directly to the
  product's MRV concept.
- Design tokens (colors, type, spacing, motion) centralized in `tailwind.config.ts`.

## Getting started

```bash
npm install
npm run dev
```

Open http://localhost:3000.

> **Note:** `next/font` fetches Fraunces, Inter, and IBM Plex Mono from Google Fonts at
> build time, so `npm run build` needs outbound network access. This is normal for any
> Next.js project using `next/font/google` and will work in your local machine, CI, or
> hosting provider (Vercel, Netlify, etc.) without changes.

## Replacing the placeholder aerial imagery

`AerialArt` (in `components/ui/aerial-art.tsx`) renders generative SVG artwork in the
site's ocean-blue / mangrove-green palette so the site doesn't depend on external photo
assets. To swap in real aerial photography:

1. Drop your image(s) into `public/images/`.
2. Replace the relevant `<AerialArt variant="..." />` usage with a Next.js `<Image />`
   pointing at your file, keeping the surrounding wrapper (for gradient overlays and the
   `<ScanFrame />` component) intact.

## Structure

```
app/
  layout.tsx        Root layout, fonts, theme provider
  page.tsx           Homepage — composes all sections
  globals.css
components/
  navbar.tsx
  footer.tsx
  theme-provider.tsx
  theme-toggle.tsx
  ui/
    button.tsx
    section-heading.tsx
    aerial-art.tsx    Generative "aerial mangrove" artwork
    scan-frame.tsx     Signature verification-scan overlay
  sections/
    hero.tsx
    trusted-by.tsx
    about.tsx
    how-it-works.tsx
    features.tsx
    gis-preview.tsx
    marketplace-preview.tsx
    statistics.tsx
    testimonials.tsx
    partners.tsx
    cta-band.tsx
```

## Design notes

- **Palette:** off-white/sand backgrounds, deep ocean blue (`ocean-900` `#0A3D5C`) and
  mangrove green (`mangrove-700` `#1B6B4A`) as primary accents, full dark-mode variants.
- **Type:** Fraunces (display serif) for headlines, Inter for body/UI, IBM Plex Mono for
  eyebrows, coordinates, and data-flavored labels — reinforcing the "verified evidence"
  positioning.
- **Signature element:** the scan-frame overlay (corner brackets, sweeping scan line,
  live coordinate + hash readout) appears across hero, about, and GIS imagery to make the
  verification concept visually legible rather than just stated in copy.

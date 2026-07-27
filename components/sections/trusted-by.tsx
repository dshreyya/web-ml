"use client";

const MARKS = [
  "Coastal Research Institutes",
  "State Mangrove Cells",
  "Environmental NGOs",
  "Carbon Project Developers",
  "Academic Field Stations",
  "Community Restoration Groups",
];

export function TrustedBy() {
  const loop = [...MARKS, ...MARKS];

  return (
    <section className="border-y border-ocean-900/8 bg-sand-50 py-10 dark:border-sand-100/10 dark:bg-[#071a20]">
      <div className="container-page section-pad">
        <p className="mb-6 text-center font-mono text-[10.5px] uppercase tracking-widest2 text-ink/40 dark:text-sand-100/40">
          Built for the field teams verifying blue carbon on the ground
        </p>
      </div>
      <div className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-sand-50 to-transparent dark:from-[#071a20]" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-sand-50 to-transparent dark:from-[#071a20]" />
        <div className="flex w-max animate-marquee gap-16">
          {loop.map((name, i) => (
            <span
              key={i}
              className="whitespace-nowrap font-display text-[17px] italic text-ink/35 dark:text-sand-100/35"
            >
              {name}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

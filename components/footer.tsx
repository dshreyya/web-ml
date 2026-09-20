import Link from "next/link";
import { Leaf, Twitter, Linkedin, Github } from "lucide-react";

const COLUMNS = [
  {
    title: "Product",
    links: [
      { label: "Solutions", href: "#solutions" },
      { label: "Technology", href: "#technology" },
      { label: "GIS Registry", href: "#gis-registry" },
      { label: "Marketplace", href: "#marketplace" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "#about" },
      { label: "Contact", href: "#contact" },
      { label: "Careers", href: "#" },
      { label: "Press", href: "#" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Methodology Notes", href: "#" },
      { label: "Field Data Standards", href: "#" },
      { label: "Developer Docs", href: "#" },
      { label: "Trust & Security", href: "#" },
    ],
  },
];

export function Footer() {
  return (
    <footer id="contact" className="border-t border-ocean-900/10 bg-sand-50 dark:border-sand-100/10 dark:bg-[#061418]">
      <div className="container-page section-pad py-16">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <Link href="/" className="flex items-center gap-2.5">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-ocean-900 text-mangrove-300 dark:bg-mangrove-500 dark:text-ink">
                <Leaf size={15} strokeWidth={2.25} />
              </span>
              <span className="font-display text-[17px] font-medium tracking-tight text-ink dark:text-sand-50">
                BlueCarbon Nexus
              </span>
            </Link>
            <p className="mt-4 max-w-xs text-[13.5px] leading-relaxed text-ink/60 dark:text-sand-100/55">
              Blockchain-based MRV infrastructure for coastal blue carbon ecosystems —
              turning field evidence into records anyone can verify.
            </p>
            <div className="mt-6 flex items-center gap-3">
              {[Twitter, Linkedin, Github].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-ocean-900/15 text-ink/60 transition-colors hover:border-mangrove-500/40 hover:text-mangrove-700 dark:border-sand-100/15 dark:text-sand-100/60 dark:hover:text-mangrove-300"
                  aria-label="Social link"
                >
                  <Icon size={14} />
                </a>
              ))}
            </div>
          </div>

          {COLUMNS.map((col) => (
            <div key={col.title}>
              <h4 className="font-mono text-[10.5px] uppercase tracking-widest2 text-ink/40 dark:text-sand-100/40">
                {col.title}
              </h4>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-[13.5px] text-ink/70 transition-colors hover:text-ink dark:text-sand-100/65 dark:hover:text-sand-50"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-ocean-900/8 pt-8 text-[12.5px] text-ink/50 sm:flex-row dark:border-sand-100/10 dark:text-sand-100/45">
          <span>© {new Date().getFullYear()} BlueCarbon Nexus. All rights reserved.</span>
          <div className="flex gap-6">
            <a href="#" className="hover:text-ink dark:hover:text-sand-100">Privacy</a>
            <a href="#" className="hover:text-ink dark:hover:text-sand-100">Terms</a>
            <a href="#sign-in" className="hover:text-ink dark:hover:text-sand-100">Sign In</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

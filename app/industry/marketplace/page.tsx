"use client";

import { useRouter } from "next/navigation";
import { Leaf, MapPin, Coins, ArrowRight } from "lucide-react";

const projects = [
  {
    id: "sundarbans",
    name: "Sundarbans Coastal Mangrove Restoration",
    location: "West Bengal",
    area: "12.5 ha",
    credits: 500,
    price: 1800,
    status: "Verified",
  },
  {
    id: "goa",
    name: "Goa Coastal Mangrove Restoration",
    location: "Goa",
    area: "18.2 ha",
    credits: 350,
    price: 1650,
    status: "Verified",
  },
  {
    id: "maharashtra",
    name: "Maharashtra Coastal Restoration",
    location: "Maharashtra",
    area: "25.6 ha",
    credits: 800,
    price: 1700,
    status: "Verified",
  },
  {
    id: "odisha",
    name: "Odisha Mangrove Conservation Project",
    location: "Odisha",
    area: "30.4 ha",
    credits: 650,
    price: 1750,
    status: "Verified",
  },
];

export default function IndustryMarketplacePage() {
  const router = useRouter();

  const handleBuy = (project: (typeof projects)[0]) => {
    router.push(
      `/industry/payment?project=${project.id}&price=${project.price}`
    );
  };

  return (
    <main className="min-h-screen bg-sand-50 dark:bg-[#06171d]">

      {/* Header */}
      <section className="mx-auto max-w-7xl px-6 pt-12 pb-8">

        <div className="mb-8">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-mangrove-600/20 bg-mangrove-50 px-4 py-2 font-mono text-xs text-mangrove-700 dark:bg-mangrove-900/20 dark:text-mangrove-300">
            <Leaf size={15} />
            VERIFIED BLUE CARBON PROJECTS
          </div>

          <h1 className="font-display text-5xl font-semibold text-ink dark:text-sand-50">
            Blue Carbon Marketplace
          </h1>

          <p className="mt-4 max-w-2xl text-base text-ink-soft dark:text-sand-200/70">
            Explore verified mangrove restoration projects and purchase
            blockchain-backed carbon credits.
          </p>
        </div>

        {/* Projects */}
        <div className="grid gap-6 md:grid-cols-2">

          {projects.map((project) => (
            <div
              key={project.id}
              className="rounded-[28px] border border-ocean-900/10 bg-white p-6 shadow-card dark:border-sand-100/10 dark:bg-[#0a2027]"
            >

              {/* Project icon */}
              <div className="mb-5 flex items-center justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-mangrove-100 text-mangrove-700 dark:bg-mangrove-900/30 dark:text-mangrove-300">
                  <Leaf size={23} />
                </div>

                <span className="rounded-full bg-mangrove-100 px-3 py-1 text-xs font-semibold text-mangrove-700 dark:bg-mangrove-900/30 dark:text-mangrove-300">
                  {project.status}
                </span>
              </div>

              {/* Project name */}
              <h2 className="font-display text-2xl font-semibold text-ink dark:text-sand-50">
                {project.name}
              </h2>

              {/* Location */}
              <div className="mt-3 flex items-center gap-2 text-sm text-ink-soft dark:text-sand-200/70">
                <MapPin size={16} />
                {project.location}
              </div>

              {/* Details */}
              <div className="mt-6 grid grid-cols-3 gap-3">

                <div className="rounded-2xl bg-sand-50 p-4 dark:bg-[#071a20]">
                  <p className="text-xs text-ink-soft dark:text-sand-200/60">
                    Area
                  </p>

                  <p className="mt-1 font-semibold text-ink dark:text-sand-50">
                    {project.area}
                  </p>
                </div>

                <div className="rounded-2xl bg-sand-50 p-4 dark:bg-[#071a20]">
                  <p className="text-xs text-ink-soft dark:text-sand-200/60">
                    Credits
                  </p>

                  <p className="mt-1 font-semibold text-ink dark:text-sand-50">
                    {project.credits}
                  </p>
                </div>

                <div className="rounded-2xl bg-sand-50 p-4 dark:bg-[#071a20]">
                  <p className="text-xs text-ink-soft dark:text-sand-200/60">
                    Price
                  </p>

                  <p className="mt-1 font-semibold text-ink dark:text-sand-50">
                    ₹{project.price.toLocaleString()}
                  </p>
                </div>

              </div>

              {/* Buttons */}
              <div className="mt-6 flex gap-3">

                <button
                  type="button"
                  className="flex flex-1 items-center justify-center gap-2 rounded-2xl border border-ocean-900/10 px-4 py-3 text-sm font-semibold text-ink transition hover:bg-sand-50 dark:border-sand-100/10 dark:text-sand-50 dark:hover:bg-[#071a20]"
                >
                  View Project
                </button>

                <button
                  type="button"
                  onClick={() => handleBuy(project)}
                  className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-ocean-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-ocean-800"
                >
                  <Coins size={17} />
                  Buy Credits
                  <ArrowRight size={16} />
                </button>

              </div>

            </div>
          ))}

        </div>
      </section>
    </main>
  );
}
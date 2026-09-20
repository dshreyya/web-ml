import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Hero } from "@/components/sections/hero";
import { TrustedBy } from "@/components/sections/trusted-by";
import { About } from "@/components/sections/about";
import { HowItWorks } from "@/components/sections/how-it-works";
import { Features } from "@/components/sections/features";
import { GISPreview } from "@/components/sections/gis-preview";
import { MarketplacePreview } from "@/components/sections/marketplace-preview";
import { Statistics } from "@/components/sections/statistics";
import { Testimonials } from "@/components/sections/testimonials";
import { Partners } from "@/components/sections/partners";
import { CtaBand } from "@/components/sections/cta-band";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <TrustedBy />
        <About />
        <HowItWorks />
        <Features />
        <GISPreview />
        <MarketplacePreview />
        <Statistics />
        <Testimonials />
        <Partners />
        <CtaBand />
      </main>
      <Footer />
    </>
  );
}

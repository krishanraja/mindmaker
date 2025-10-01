import { lazy, Suspense } from "react";
import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import ProblemSection from "@/components/ProblemSection";
import DifferenceSection from "@/components/DifferenceSection";
import TrustSection from "@/components/TrustSection";
import AudienceOutcomesSection from "@/components/AudienceOutcomesSection";
import StatsSection from "@/components/StatsSection";
import CTASection from "@/components/CTASection";

// Lazy load below-the-fold components
const PathwaysSection = lazy(() => import("@/components/PathwaysSection"));
const ContentHubSection = lazy(() => import("@/components/ContentHubSection"));
const Footer = lazy(() => import("@/components/Footer"));

const Index = () => {
  return (
    <main className="min-h-screen">
      <Navigation />
      {/* SEO-optimized structure */}
      <header>
        <Hero />
      </header>

      <section aria-label="Trust Indicators">
        <TrustSection />
      </section>

      <ProblemSection />
      <DifferenceSection />

      <section aria-label="Audience Outcomes" id="outcomes">
        <AudienceOutcomesSection />
      </section>

      <Suspense fallback={<div className="min-h-[400px]" />}>
        <PathwaysSection />
      </Suspense>

      <Suspense fallback={<div className="min-h-[300px]" />}>
        <section aria-label="Content Hub">
          <ContentHubSection />
        </section>
      </Suspense>

      <section aria-label="Founder Credentials and Methodology">
        <StatsSection />
      </section>

      <section aria-label="Call to Action">
        <CTASection />
      </section>
      
      <Suspense fallback={<div className="min-h-[200px]" />}>
        <Footer />
      </Suspense>
    </main>
  );
};

export default Index;

import { lazy, Suspense } from "react";
import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import ProblemSection from "@/components/ProblemSection";
import MindmakerSystemSection from "@/components/MindmakerSystemSection";
import TrustSection from "@/components/TrustSection";
import AILeadershipIndexSection from "@/components/AILeadershipIndexSection";
import SimplifiedPathwaysSection from "@/components/SimplifiedPathwaysSection";
import AssessmentPreviewSection from "@/components/AssessmentPreviewSection";
import WhyThisWorksSection from "@/components/WhyThisWorksSection";
import StatsSection from "@/components/StatsSection";
import CTASection from "@/components/CTASection";

// Lazy load below-the-fold components
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

      <section id="system" aria-label="Mindmaker System">
        <MindmakerSystemSection />
      </section>

      <section aria-label="AI Leadership Index">
        <AILeadershipIndexSection />
      </section>

      <AssessmentPreviewSection />

      <SimplifiedPathwaysSection />

      <section aria-label="Why This Works">
        <WhyThisWorksSection />
      </section>

      <Suspense fallback={<div className="min-h-[300px]" />}>
        <section aria-label="Content Hub">
          <ContentHubSection />
        </section>
      </Suspense>

      <section aria-label="Founder Credentials and System">
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

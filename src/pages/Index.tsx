import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import ProblemSection from "@/components/ProblemSection";
import DifferenceSection from "@/components/DifferenceSection";
import TrustSection from "@/components/TrustSection";
import CollapsibleMethodologySection from "@/components/CollapsibleMethodologySection";
import PathwaysSection from "@/components/PathwaysSection";
import AudienceOutcomesSection from "@/components/AudienceOutcomesSection";
import ContentHubSection from "@/components/ContentHubSection";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";

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

      <section aria-label="Problem Statement and Solution">
        <ProblemSection />
        <DifferenceSection />
      </section>

      <section aria-label="Audience Outcomes" id="outcomes">
        <AudienceOutcomesSection />
      </section>

      <section aria-label="Program Pathways" id="pathways">
        <PathwaysSection />
      </section>

      <section aria-label="Content Hub">
        <ContentHubSection />
      </section>

      <section aria-label="Learning Methodology">
        <CollapsibleMethodologySection />
      </section>

      <section aria-label="Call to Action">
        <CTASection />
      </section>
      
      <Footer />
    </main>
  );
};

export default Index;

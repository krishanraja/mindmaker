import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import StatsSection from "@/components/StatsSection";
import TrustSection from "@/components/TrustSection";
import DifferenceSection from "@/components/DifferenceSection";
import ProblemSection from "@/components/ProblemSection";
import AudienceOutcomesSection from "@/components/AudienceOutcomesSection";
import MethodologySection from "@/components/MethodologySection";
import PathwaysSection from "@/components/PathwaysSection";
import CoachSection from "@/components/CoachSection";
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
      
      <section aria-label="Proven Results" id="stats">
        <StatsSection />
      </section>
      
      <section aria-label="Trusted by Industry Leaders" id="trust">
        <TrustSection />
      </section>
      
      <section aria-label="The MindMaker Difference" id="difference">
        <DifferenceSection />
      </section>
      
      <section aria-label="The Problem" id="problem">
        <ProblemSection />
      </section>
      
      <section aria-label="Transformation Outcomes" id="outcomes">
        <AudienceOutcomesSection />
      </section>
      
      <section aria-label="AI MindMaker Program" id="pathways">
        <PathwaysSection />
      </section>
      
      <section aria-label="Our Methodology" id="methodology">
        <MethodologySection />
      </section>
      
      <section aria-label="AI-Enabled Coaching" id="coach">
        <CoachSection />  
      </section>
      
      <section aria-label="Content Hub" id="content-hub">
        <ContentHubSection />
      </section>
      
      <section aria-label="Call to Action" id="cta">
        <CTASection />
      </section>
      
      <Footer />
    </main>
  );
};

export default Index;

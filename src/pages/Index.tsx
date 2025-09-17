import Hero from "@/components/Hero";
import StatsSection from "@/components/StatsSection";
import DifferenceSection from "@/components/DifferenceSection";
import ProblemSection from "@/components/ProblemSection";
import AudienceOutcomesSection from "@/components/AudienceOutcomesSection";
import MethodologySection from "@/components/MethodologySection";
import PathwaysSection from "@/components/PathwaysSection";
import CoachSection from "@/components/CoachSection";
import CTASection from "@/components/CTASection";

const Index = () => {
  return (
    <main className="min-h-screen">
      {/* SEO-optimized structure */}
      <header>
        <Hero />
      </header>
      
      <section aria-label="Proven Results">
        <StatsSection />
      </section>
      
      <section aria-label="The MindMaker Difference">
        <DifferenceSection />
      </section>
      
      <section aria-label="The Problem">
        <ProblemSection />
      </section>
      
      <section aria-label="Transformation Outcomes">
        <AudienceOutcomesSection />
      </section>
      
      <section aria-label="Our Methodology">
        <MethodologySection />
      </section>
      
      <section aria-label="AI MindMaker Program">
        <PathwaysSection />
      </section>
      
      <section aria-label="AI-Enabled Coaching">
        <CoachSection />  
      </section>
      
      <footer>
        <CTASection />
      </footer>
    </main>
  );
};

export default Index;

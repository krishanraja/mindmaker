import Hero from "@/components/Hero";
import StatsSection from "@/components/StatsSection";
import ProblemSection from "@/components/ProblemSection";
import MethodologySection from "@/components/MethodologySection";
import PathwaysSection from "@/components/PathwaysSection";
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
      
      <section aria-label="The Problem">
        <ProblemSection />
      </section>
      
      <section aria-label="Our Methodology">
        <MethodologySection />
      </section>
      
      <section aria-label="Transformation Pathways">
        <PathwaysSection />
      </section>
      
      <footer>
        <CTASection />
      </footer>
    </main>
  );
};

export default Index;

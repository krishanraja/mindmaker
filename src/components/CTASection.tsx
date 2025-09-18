import { Button } from "@/components/ui/button";
import { ArrowUp, Mail } from "lucide-react";

const CTASection = () => {
  const scrollToOutcomes = () => {
    const outcomesSection = document.getElementById('outcomes');
    if (outcomesSection) {
      outcomesSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="section-padding relative overflow-hidden bg-brand-gradient">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.15),transparent_70%)]" />
      </div>

      <div className="container-width relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          <div className="mb-8">
            <div className="inline-flex items-center bg-white/10 text-white/90 px-4 py-2 rounded-full text-sm font-medium mb-6">
              ⚡ Limited Availability • Q1 2025 Cohorts Filling Fast
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-6 text-white leading-tight">
              Your Competitors Are Already<br />
              <span className="text-accent">Building AI Advantage</span>
            </h2>
          </div>
          
          <div className="mb-12 max-w-3xl mx-auto">
            <p className="text-lg md:text-xl leading-relaxed text-white/90 mb-6">
              While others debate AI's future, industry leaders are securing competitive dominance. 
              <strong className="text-white"> Don't let hesitation cost you market position.</strong>
            </p>
            <div className="bg-white/10 border border-white/20 rounded-xl p-6 mb-8">
              <div className="flex items-center justify-center mb-4">
                <div className="w-12 h-12 bg-accent/20 rounded-full flex items-center justify-center">
                  <span className="text-2xl">🎯</span>
                </div>
              </div>
              <p className="text-white font-medium text-lg">
                "Companies that master AI integration in 2025 will dominate their markets. 
                Those that don't will become footnotes."
              </p>
              <p className="text-white/80 text-sm mt-2">— Harvard Business Review, 2024</p>
            </div>
          </div>

          <div className="flex flex-col gap-4 mb-8 max-w-md mx-auto">
            <Button asChild className="bg-white text-primary hover:bg-white/90 font-semibold px-8 py-4 text-lg group w-full shadow-2xl transform hover:scale-105 transition-all duration-200">
              <a href="https://calendly.com/krish-raja/mindmaker-meeting" target="_blank" rel="noopener noreferrer">
                <Mail className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
                Secure Your AI Advantage
              </a>
            </Button>
            
            <Button 
              onClick={scrollToOutcomes}
              variant="outline"
              className="border-white/30 text-white hover:bg-white/10 font-medium px-8 py-4 text-base group w-full"
            >
              <ArrowUp className="mr-2 h-4 w-4 group-hover:-translate-y-1 transition-transform" />
              Or Choose a Pathway Above
            </Button>
          </div>
          
          <div className="text-center border-t border-white/20 pt-8">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 mb-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-white">16+</div>
                <div className="text-sm text-white/80">Years Experience</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">500+</div>
                <div className="text-sm text-white/80">Leaders Transformed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">$50M+</div>
                <div className="text-sm text-white/80">Value Created</div>
              </div>
            </div>
            <p className="text-base text-white/80">
              Join industry leaders who've already secured their competitive edge
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
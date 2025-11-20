import { Button } from "@/components/ui/button";
import { ArrowUp, Target, TrendingUp, Users } from "lucide-react";
import krishHeadshot from "@/assets/krish-headshot.png";

const CTASection = () => {
  const scrollToOutcomes = () => {
    const outcomesSection = document.getElementById('outcomes');
    if (outcomesSection) {
      outcomesSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="section-padding relative overflow-hidden bg-gradient-to-br from-indigo-900/95 via-purple-600/70 to-purple-500/80">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.15),transparent_70%)]" />
      </div>

      <div className="container-width relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          <div className="mb-8">
            <div className="inline-flex items-center bg-white/10 backdrop-blur-sm text-white/90 px-6 py-3 rounded-full text-sm font-medium mb-6 gap-3 border border-white/20 text-left">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse shadow-lg shadow-amber-500/50"></div>
                <span className="font-semibold">Q1 2026 Sprint Cohorts</span>
              </div>
              <span className="text-white/40 text-xs">•</span>
              <div className="flex items-center gap-1 text-xs sm:text-sm">
                <span className="whitespace-nowrap font-semibold text-amber-200">6 spots remaining</span>
              </div>
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-6 text-white leading-tight">
              The AI hype is over.<br />
              <span className="text-white/90">Leadership starts now.</span>
            </h2>
          </div>
          
          <div className="mb-12 max-w-2xl mx-auto">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 sm:p-8 mb-8 backdrop-blur-sm">
              <div className="flex flex-col sm:flex-row gap-6 sm:gap-8 items-center sm:items-start">
                {/* Headshot */}
                <div className="flex-shrink-0">
                  <img 
                    src={krishHeadshot} 
                    alt="Krish Raja, AI Strategy Expert"
                    className="w-[100px] h-[100px] sm:w-[120px] sm:h-[120px] rounded-full object-cover shadow-lg shadow-primary/20"
                  />
                </div>
                
                {/* Quote Content */}
                <div className="flex-1 text-center sm:text-left">
                  <p className="text-white font-medium text-base leading-relaxed italic">
                    "After 90+ leadership systems and 50+ executive keynotes, the pattern became clear: 
                    leaders don't need more AI courses. They need cognitive infrastructure that lets them think clearly about AI."
                  </p>
                  <p className="text-white/70 font-semibold text-base mt-4">— Krish Raja, Creator of Mindmaker Method™</p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8 max-w-3xl mx-auto">
            <Button 
              asChild 
              variant="hero-primary" 
              size="lg" 
              className="w-full group"
            >
              <a href="/leaders" rel="noopener noreferrer">
                <Target className="mr-2 h-5 w-5" />
                Get Your Cognitive Baseline
              </a>
            </Button>
            
            <Button 
              asChild 
              variant="hero-primary" 
              size="lg" 
              className="w-full group"
            >
              <a href="/partners-interest" rel="noopener noreferrer">
                <TrendingUp className="mr-2 h-5 w-5" />
                Assess Your Portfolio
              </a>
            </Button>
            
            <Button 
              asChild 
              variant="hero-primary" 
              size="lg" 
              className="w-full group"
            >
              <a href="/exec-teams" rel="noopener noreferrer">
                <Users className="mr-2 h-5 w-5" />
                Request Team Alignment
              </a>
            </Button>
          </div>
          
          <Button 
            onClick={scrollToOutcomes}
            variant="hero-secondary"
            size="sm"
            className="group"
          >
            <ArrowUp className="mr-2 h-4 w-4 group-hover:-translate-y-1 transition-transform duration-200" />
            Or Explore Pathways Above
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
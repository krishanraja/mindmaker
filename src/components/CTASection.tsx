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
    <section className="section-padding relative overflow-hidden bg-gradient-to-br from-indigo-900/90 via-purple-600/40 to-purple-500/50">
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
                <span className="font-semibold">Limited Availability</span>
              </div>
              <span className="text-white/40 text-xs">•</span>
              <div className="flex items-center gap-1 text-xs sm:text-sm">
                <span className="whitespace-nowrap">Q1 2025 Cohorts</span>
                <span className="whitespace-nowrap font-semibold text-amber-200">Filling&nbsp;Fast</span>
              </div>
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold tracking-tight mb-6 text-white leading-tight">
              Don't Let Your Competition<br />
              <span className="text-white/80">Leave You Behind</span>
            </h2>
          </div>
          
          <div className="mb-12 max-w-2xl mx-auto">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-8 mb-8 backdrop-blur-sm">
              <p className="text-white font-medium text-base leading-relaxed italic">
                "Businesses that master AI literacy at each level will transform rapidly.
                <br className="sm:hidden" />
                <br className="sm:hidden" />
                <span className="hidden sm:inline"> </span>
                Those that don't will be forced to fight the ones that do."
              </p>
              <p className="text-white/70 font-semibold text-base mt-4">— Krish</p>
            </div>
          </div>

          <div className="flex flex-col gap-4 mb-8 max-w-md mx-auto">
            <Button asChild variant="hero-primary" size="xl" className="w-full">
              <a href="https://calendly.com/krish-raja/mindmaker-meeting" target="_blank" rel="noopener noreferrer" className="group">
                <Mail className="mr-3 h-5 w-5" />
                Secure Your Competitive Edge
              </a>
            </Button>
            
            <Button 
              onClick={scrollToOutcomes}
              variant="hero-secondary"
              size="lg"
              className="w-full group"
            >
              <ArrowUp className="mr-2 h-4 w-4 group-hover:-translate-y-1 transition-transform duration-200" />
              Or Choose a Pathway Above
            </Button>
          </div>
          
          <div className="text-center border-t border-white/20 pt-8">
            <div className="flex flex-row items-baseline justify-center gap-3 sm:gap-8 mb-4">
              <div className="text-center flex-1">
                <div className="text-xl sm:text-2xl font-semibold text-white">90+</div>
                <div className="text-xs sm:text-sm text-white/80">Strategic Plans</div>
              </div>
              <div className="text-center flex-1">
                <div className="text-xl sm:text-2xl font-semibold text-white">50+</div>
                <div className="text-xs sm:text-sm text-white/80">Executive Sessions</div>
              </div>
              <div className="text-center flex-1">
                <div className="text-xl sm:text-2xl font-semibold text-white">12</div>
                <div className="text-xs sm:text-sm text-white/80">Recent AI Advisories</div>
              </div>
            </div>
            <p className="text-base text-white/80">
              Proven track record in strategic AI implementation and revenue growth
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
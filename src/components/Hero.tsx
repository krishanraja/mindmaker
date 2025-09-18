import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, CheckCircle, Layers, Zap } from "lucide-react";
import mindmakerLogo from "@/assets/mindmaker-logo.png";

const Hero = () => {
  return (
    <section className="min-h-[100dvh] flex items-center justify-center relative overflow-hidden">
      {/* Background Layer 1: Mindmaker Animation */}
      <div className="absolute inset-0 z-0">
        <img 
          src="/mindmaker-background.gif"
          alt=""
          className="w-full h-full object-cover"
        />
      </div>
      
      {/* Background Layer 2: Semi-transparent Purple Overlay */}
      <div className="absolute inset-0 z-1 bg-gradient-to-br from-[#667eea]/50 to-[#764ba2]/50 backdrop-blur-sm"></div>
      
      {/* Content Layer */} 
      <div className="container-width relative z-10 text-center">
        <div className="max-w-6xl mx-auto fade-in-up pt-safe-top pb-16 md:pb-20 px-4">
          {/* Logo - Half Size */}
          <div className="mb-6 md:mb-8 mt-8 md:mt-12">
            <img 
              src={mindmakerLogo} 
              alt="MindMaker" 
              className="h-10 md:h-14 lg:h-16 w-auto mx-auto"
            />
          </div>
          
          {/* Main Tagline - Enlarged with Gobold Font */}
          <h1 className="font-gobold text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold tracking-[0.15em] mb-4 md:mb-6 leading-tight max-w-5xl mx-auto px-4 text-white uppercase hero-text-shimmer">
            ai literacy
          </h1>
          
          {/* Supporting Tagline */}
          <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-medium tracking-wide mb-10 md:mb-12 leading-relaxed max-w-4xl mx-auto px-4 text-white/95">
            Everyone's future foundation.
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 md:gap-6 mb-10 md:mb-12 px-4">
            <Button 
              variant="hero-primary"
              size="lg" 
              className="px-6 md:px-8 py-3 md:py-4 text-base md:text-lg group w-full sm:w-auto min-h-[44px]"
              onClick={() => {
                const outcomesSection = document.getElementById('outcomes');
                if (outcomesSection) {
                  outcomesSection.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              aria-label="Take AI Literacy Assessment"
            >
              AI Literacy Assessment
              <ArrowRight className="ml-2 h-4 md:h-5 w-4 md:w-5 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
            </Button>
            
            <Button 
              variant="hero-secondary"
              size="lg"
              className="px-6 md:px-8 py-3 md:py-4 text-base md:text-lg w-full sm:w-auto min-h-[44px]"
              onClick={() => {
                const pathwaysSection = document.getElementById('pathways');
                if (pathwaysSection) {
                  pathwaysSection.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              aria-label="View Educational Seminars"
            >
              Educational Seminars
            </Button>
          </div>

          {/* Proof Points */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 max-w-4xl mx-auto mb-6 md:mb-8">
            <div className="glass-card-dark text-center p-4 md:p-6">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-white/10 rounded-lg mb-4">
                <CheckCircle className="h-6 w-6 text-white" aria-hidden="true" />
              </div>
              <div className="text-xl md:text-2xl font-semibold tracking-tight text-white mb-2 drop-shadow-sm">5-Minute</div>
              <div className="text-lg font-semibold text-white mb-1">Assessment</div>
              <div className="text-white/90 text-sm md:text-base font-medium leading-relaxed tracking-wide">Discover your AI readiness gaps</div>
            </div>
            
            <div className="glass-card-dark text-center p-4 md:p-6">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-white/10 rounded-lg mb-4">
                <Layers className="h-6 w-6 text-white" aria-hidden="true" />
              </div>
              <div className="text-xl md:text-2xl font-semibold tracking-tight text-white mb-2 drop-shadow-sm">4-Phase</div>
              <div className="text-lg font-semibold text-white mb-1">Methodology</div>
              <div className="text-white/90 text-sm md:text-base font-medium leading-relaxed tracking-wide">Structured learning with measurable outcomes</div>
            </div>
            
            <div className="glass-card-dark text-center p-4 md:p-6">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-white/10 rounded-lg mb-4">
                <Zap className="h-6 w-6 text-white" aria-hidden="true" />
              </div>
              <div className="text-xl md:text-2xl font-semibold tracking-tight text-white mb-2 drop-shadow-sm">Start</div>
              <div className="text-lg font-semibold text-white mb-1">Day One</div>
              <div className="text-white/90 text-sm md:text-base font-medium leading-relaxed tracking-wide">Apply AI thinking in your first session</div>
            </div>
          </div>


        </div>
      </div>
      
      {/* Scroll Indicator */}
      <div className="absolute bottom-6 md:bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white/50 rounded-full mt-2 animate-pulse" />
        </div>
      </div>
    </section>
  );
};

export default Hero;
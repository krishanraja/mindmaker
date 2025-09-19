import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import mindmakerLogo from "@/assets/mindmaker-logo.png";
import InteractiveTimeline from "./InteractiveTimeline";
import { useFontLoader } from "@/hooks/useFontLoader";

const Hero = () => {
  const { isLoaded: goboldLoaded, isLoading: goboldLoading } = useFontLoader('Gobold');
  
  return (
    <section className="min-h-[100dvh] flex items-center justify-center relative overflow-hidden">
      {/* Background Layer 1: Mindmaker Animation */}
      <div className="absolute inset-0 z-0">
        <img 
          src="/mindmaker-background.gif"
          alt=""
          className="w-full h-full object-cover object-center"
        />
      </div>
      
      {/* Background Layer 2: Dramatic Dark Indigo Gradient Overlay */}
      <div className="absolute inset-0 z-[1] bg-gradient-to-br from-indigo-900/80 via-purple-600/30 to-purple-500/40"></div>
      
      {/* Content Layer */} 
      <div className="container-width relative z-10 text-center">
        <div className="max-w-6xl mx-auto fade-in-up pb-12 md:pb-20 px-4 sm:px-6">
          {/* Logo - Mobile Optimized with Safe Area */}
          <div className="mb-8 md:mb-10 mt-16 md:mt-12 pt-safe-area-top">
            <img 
              src={mindmakerLogo} 
              alt="MindMaker" 
              className="h-8 sm:h-10 md:h-14 lg:h-16 w-auto mx-auto"
            />
          </div>
          
          {/* Main Tagline - Mobile-First Typography */}
          <h1 className={`${goboldLoaded ? 'font-gobold' : 'font-black'} text-3xl sm:text-4xl md:text-6xl lg:text-7xl xl:text-8xl font-bold tracking-[0.1em] sm:tracking-[0.15em] mb-4 md:mb-6 leading-[1.1] sm:leading-tight max-w-5xl mx-auto uppercase hero-text-shimmer transition-[font-family] duration-200 ${goboldLoading ? 'opacity-80' : 'opacity-100'}`}>
            ai literacy
          </h1>
          
          {/* Supporting Tagline - Mobile Optimized */}
          <p className="text-base sm:text-lg md:text-2xl lg:text-3xl xl:text-4xl font-medium tracking-wide mb-8 md:mb-12 leading-relaxed max-w-4xl mx-auto text-white/95">
            Everyone's future foundation.
          </p>
          
          {/* CTA Buttons - Mobile-First Design */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-center sm:gap-4 md:gap-6 mb-8 md:mb-12 max-w-lg sm:max-w-none mx-auto">
            {/* Primary CTA - Book a Call */}
            <Button 
              variant="hero-primary"
              size="lg" 
              className="px-6 md:px-8 py-4 md:py-4 text-sm sm:text-base md:text-lg font-semibold group w-full sm:w-auto min-h-[48px] sm:min-h-[44px] rounded-lg sm:rounded-md order-1 sm:order-1"
              onClick={() => window.open('https://calendly.com/krish-raja/mindmaker-meeting', '_blank')}
              aria-label="Book a strategic consultation call"
            >
              Book a Call
            </Button>
            
            {/* Secondary CTAs */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 order-2 sm:order-2">
              <Button 
                variant="hero-secondary"
                size="sm"
                className="px-4 md:px-6 py-3 md:py-3 text-xs sm:text-sm md:text-base font-medium w-full sm:w-auto min-h-[44px] sm:min-h-[40px] rounded-lg sm:rounded-md"
                onClick={() => {
                  const outcomesSection = document.getElementById('outcomes');
                  if (outcomesSection) {
                    outcomesSection.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                aria-label="Take AI Literacy Assessment"
              >
                <span className="sm:hidden">Assess in 2 min</span>
                <span className="hidden sm:inline">Assess your literacy in 2 min</span>
                <ArrowRight className="ml-2 h-3 md:h-4 w-3 md:w-4 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
              </Button>
              
              <Button 
                variant="hero-secondary"
                size="sm"
                className="px-4 md:px-6 py-3 md:py-3 text-xs sm:text-sm md:text-base font-medium w-full sm:w-auto min-h-[44px] sm:min-h-[40px] rounded-lg sm:rounded-md"
                onClick={() => {
                  const pathwaysSection = document.getElementById('pathways');
                  if (pathwaysSection) {
                    pathwaysSection.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                aria-label="View Educational Seminars"
              >
                <span className="sm:hidden">Explore Seminars</span>
                <span className="hidden sm:inline">Explore Seminars</span>
              </Button>
            </div>
          </div>

          {/* Interactive AI Timeline */}
          <div className="mb-6 md:mb-8">
            <InteractiveTimeline />
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
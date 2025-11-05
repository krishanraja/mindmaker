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
          loading="eager"
          decoding="async"
          fetchPriority="high"
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
              loading="eager"
              decoding="async"
              fetchPriority="high"
            />
          </div>
          
          {/* Main Tagline - Mobile-First Typography */}
          <h1 className={`${goboldLoaded ? 'font-gobold' : 'font-black'} text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight mb-4 md:mb-6 leading-[1.1] sm:leading-tight max-w-5xl mx-auto hero-text-shimmer transition-[font-family] duration-200 ${goboldLoading ? 'opacity-80' : 'opacity-100'}`}>
            AI LITERACY
          </h1>
          
          {/* Supporting Tagline - Mobile Optimized */}
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl font-medium tracking-wide mb-3 md:mb-4 leading-relaxed max-w-3xl mx-auto text-white/95">
            The future foundation of leadership
          </p>
          
          <p className="text-sm sm:text-base md:text-lg font-normal mb-8 md:mb-12 leading-relaxed max-w-4xl mx-auto text-white/80">
            Mindmaker builds the human capability that sits between algorithms and outcomes.
          </p>
          
          {/* Primary CTA - Mobile-First Design */}
          <div className="flex flex-col gap-3 mb-4 md:mb-6 max-w-lg mx-auto">
            <Button 
              variant="hero-primary"
              size="lg" 
              className="px-6 md:px-8 py-4 md:py-4 text-sm sm:text-base md:text-lg font-semibold group w-full min-h-[48px] rounded-lg"
              onClick={() => window.open('https://calendly.com/krish-raja/mindmaker-meeting', '_blank')}
              aria-label="Start your AI alignment sprint"
            >
              Start Your AI Alignment Sprint
              <ArrowRight className="ml-2 h-4 md:h-5 w-4 md:w-5 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
            </Button>
          </div>

          {/* Pathway Buttons - New Entry Routes */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-8 md:mb-12 max-w-2xl mx-auto justify-center">
            <Button 
              variant="hero-secondary"
              size="sm"
              className="px-4 md:px-6 py-3 text-xs sm:text-sm font-medium w-full sm:w-auto min-h-[44px] rounded-lg"
              onClick={() => window.location.href = '/leaders'}
              aria-label="Free 2-minute AI leadership benchmark for individual executives"
            >
              Take 2-Min Assessment
            </Button>
            
            <Button 
              variant="hero-secondary"
              size="sm"
              className="px-4 md:px-6 py-3 text-xs sm:text-sm font-medium w-full sm:w-auto min-h-[44px] rounded-lg"
              onClick={() => window.location.href = '/exec-teams'}
              aria-label="Configure 4-hour AI bootcamp for your executive team"
            >
              Configure Team Bootcamp
            </Button>
            
            <Button 
              variant="hero-secondary"
              size="sm"
              className="px-4 md:px-6 py-3 text-xs sm:text-sm font-medium w-full sm:w-auto min-h-[44px] rounded-lg"
              onClick={() => window.location.href = '/partners-interest'}
              aria-label="Assess 1-10 portfolio companies with our scoring tool"
            >
              Score Your Portfolio
            </Button>
          </div>
          
          {/* Value Prop */}
          <p className="text-xs sm:text-sm text-white/70 max-w-4xl mx-auto mb-8">
            Individual leaders: Get your AI readiness score in 2 minutes. Executive teams: Configure custom bootcamps. Partners: Score up to 10 portfolio companies.
          </p>

          {/* Interactive AI Timeline */}
          <div className="mt-20 md:mt-28 lg:mt-32">
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
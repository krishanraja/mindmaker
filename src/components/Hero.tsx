import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, CheckCircle, Layers, Zap } from "lucide-react";
import mindmakerLogo from "@/assets/mindmaker-logo.png";

const Hero = () => {
  return (
    <section className="hero-clouds min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Content */}
      <div className="container-width relative z-10 text-center text-white">
        <div className="max-w-6xl mx-auto fade-in-up pt-12 md:pt-16 lg:pt-20 pb-16 md:pb-20">
          {/* Logo */}
          <div className="mb-8">
            <img 
              src={mindmakerLogo} 
              alt="MindMaker" 
              className="h-16 w-auto mx-auto mb-6"
            />
          </div>
          
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-3 md:px-4 py-2 mb-6 md:mb-8">
            <Sparkles size={16} className="text-white" aria-hidden="true" />
            <span className="text-xs md:text-sm font-medium">AI has learned our language. AI literacy helps us to move the other way.</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-semibold tracking-tight mb-4 md:mb-6 leading-tight">
            Transform How You
            <span className="block text-white">
              Think About AI
            </span>
          </h1>
          
          {/* Subheadline */}
          <p className="text-sm md:text-base lg:text-lg leading-relaxed mb-8 md:mb-12 max-w-4xl mx-auto opacity-90 px-4">
            <strong className="text-white">The World's First AI Literacy Accelerator.</strong>
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 md:gap-6 mb-12 md:mb-16 px-4">
            <Button 
              size="lg" 
              className="bg-primary text-white hover:bg-primary-600 focus:ring-2 focus:ring-ring font-semibold px-6 md:px-8 py-3 md:py-4 text-base md:text-lg group w-full sm:w-auto min-h-[44px]"
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
              variant="outline" 
              size="lg"
              className="glass-card-dark border-white/20 text-white hover:bg-white/10 font-medium px-6 md:px-8 py-3 md:py-4 text-base md:text-lg w-full sm:w-auto min-h-[44px]"
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 max-w-4xl mx-auto mb-8">
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
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white/50 rounded-full mt-2 animate-pulse" />
        </div>
      </div>
    </section>
  );
};

export default Hero;
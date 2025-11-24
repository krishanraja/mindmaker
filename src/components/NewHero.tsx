import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";
import mindmakerLogo from "@/assets/mindmaker-logo-new.png";
import krishHeadshot from "@/assets/krish-headshot.png";

const NewHero = () => {
  return (
    <section className="min-h-screen flex items-center justify-center bg-ink text-white relative overflow-hidden">
      {/* Subtle Grid Background */}
      <div className="absolute inset-0 opacity-[0.03]">
        <div 
          className="absolute inset-0" 
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(126, 244, 194, 0.1) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(126, 244, 194, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '80px 80px'
          }}
        />
      </div>
      
      {/* Content */}
      <div className="container-width relative z-10 py-20">
        {/* Logo - Centered, prominent with glow */}
        <div className="flex justify-center mb-24 fade-in-up">
          <div className="bg-white/10 p-8 rounded-full backdrop-blur-sm">
            <img 
              src={mindmakerLogo} 
              alt="Mindmaker" 
              className="h-16 md:h-20 w-auto"
            />
          </div>
        </div>
        
        {/* Hero Content - Main Section */}
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-20">
            {/* Left: Main Content */}
            <div className="flex-1 text-center lg:text-left space-y-10 fade-in-up" style={{animationDelay: '0.1s'}}>
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight tracking-tight text-white">
                Stop Guessing About AI.
                <span className="relative inline-block mt-2">
                  <span className="relative z-10">Start Building Systems That Work.</span>
                  <span className="absolute bottom-0 left-0 w-full h-3 bg-mint/60 -z-10 animate-expandWidth"></span>
                </span>
              </h1>
        
              <p className="text-lg sm:text-xl md:text-2xl text-white/90 max-w-2xl mx-auto lg:mx-0 font-light leading-relaxed">
                Most leaders feel behind on AI—but don't know what to actually do about it. 
                We help you think clearly, make decisions 3x faster, and build AI systems that persist.
              </p>
              
              {/* Trust Bar - Editorial proof points */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6 text-sm text-white/70 font-medium fade-in-up" style={{animationDelay: '0.2s'}}>
                <span className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-mint" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  No vendor theatre
                </span>
                <span className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-mint" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Practice on real work
                </span>
                <span className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-mint" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Systems that persist
                </span>
              </div>
              
              {/* CTAs - Premium, high-contrast */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 fade-in-up" style={{animationDelay: '0.3s'}}>
                <Button 
                  size="xl" 
                  className="bg-white text-ink hover:bg-white/90 font-semibold px-8 py-6 text-lg shadow-2xl hover:shadow-mint/20 transition-all hover:scale-105 hover:-translate-y-0.5 min-w-[240px] touch-target"
                  onClick={() => window.location.href = '/builder-session'}
                >
                  Book a Builder Session
                </Button>
                <Button 
                  size="xl" 
                  variant="outline" 
                  className="border-2 border-white/30 text-white hover:bg-white/10 hover:border-white/50 backdrop-blur-sm font-semibold px-8 py-6 text-lg min-w-[240px] touch-target"
                  onClick={() => {
                    const productsSection = document.getElementById('products');
                    productsSection?.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  View Programs
                </Button>
              </div>
              
              {/* Micro-copy - Trust reinforcement */}
              <p className="text-sm text-white/60 fade-in-up mx-auto lg:mx-0" style={{animationDelay: '0.4s'}}>
                No fluff. No theory. Just real AI systems you can build in 90 minutes.
              </p>
            </div>
            
            {/* Right: Krish Headshot - Trust Signal */}
            <div className="hidden lg:block fade-in-up" style={{animationDelay: '0.5s'}}>
              <div className="relative">
                <img 
                  src={krishHeadshot}
                  alt="Krish, Founder & Builder" 
                  className="w-48 h-48 rounded-full border-4 border-mint/30 shadow-2xl hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-white/95 backdrop-blur-sm border border-mint/30 rounded-full px-6 py-2 shadow-lg">
                  <div className="text-ink text-xs font-semibold whitespace-nowrap">Built by Krish</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Scroll Indicator - Subtle, bottom-center */}
      <div className="absolute bottom-16 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-60 hover:opacity-100 transition-opacity cursor-pointer fade-in-up" style={{animationDelay: '0.6s'}}>
        <span className="text-white/70 text-xs uppercase tracking-wider font-medium">Scroll to explore</span>
        <svg className="w-5 h-5 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
      
      {/* Add CSS animation for underline */}
      <style>{`
        @keyframes expandWidth {
          to {
            transform: scaleX(1);
          }
        }
      `}</style>
    </section>
  );
};

export default NewHero;

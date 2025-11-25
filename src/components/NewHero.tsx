import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";
import mindmakerIconDark from "@/assets/mindmaker-icon-dark.png";

const NewHero = () => {
  return (
    <section className="min-h-screen flex items-center justify-center bg-ink text-white relative overflow-hidden">
      {/* Dynamic Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-ink via-ink to-mint/10"></div>
      
      {/* GIF Background Overlay - 20% opacity */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: 'url(/mindmaker-background-green.gif)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      ></div>
      
      {/* Animated Grid Background */}
      <div className="absolute inset-0 opacity-[0.08]">
        <div 
          className="absolute inset-0 animate-pulse" 
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(126, 244, 194, 0.15) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(126, 244, 194, 0.15) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px',
            animation: 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite'
          }}
        />
      </div>
      
      {/* Glowing Orbs */}
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-mint/20 rounded-full blur-3xl animate-pulse" style={{animationDuration: '3s'}}></div>
      <div className="absolute bottom-1/4 left-1/3 w-80 h-80 bg-mint/10 rounded-full blur-3xl animate-pulse" style={{animationDuration: '4s', animationDelay: '1s'}}></div>
      
      {/* Content */}
      <div className="container-width relative z-10 py-20">
      {/* Logo - Left aligned */}
      <div className="flex justify-start mb-24 fade-in-up -ml-6">
        <img 
          src={mindmakerIconDark} 
          alt="Mindmaker" 
          className="h-36 md:h-48 w-auto"
        />
        </div>
        
        {/* Hero Content - Left aligned */}
        <div className="max-w-4xl">
          <div className="space-y-10 fade-in-up" style={{animationDelay: '0.1s'}}>
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight tracking-tight text-white">
              Become the next version of yourself with{" "}
              <span className="relative inline-block">
                <span className="relative z-10 text-mint animate-pulse" style={{animationDuration: '2s'}}>AI literacy for leaders</span>
                <span className="absolute bottom-0 left-0 w-full h-4 bg-mint/30 -z-10 animate-expandWidth blur-sm"></span>
              </span>
            </h1>
      
            <p className="text-lg sm:text-xl md:text-2xl text-white/90 max-w-3xl font-light leading-relaxed">
              Most leaders feel behind on AI, but don't know what to actually do about it. We help you become an AI-age business leader by getting you on the path to AI literacy that outlives any one tool.
            </p>
              
            {/* Trust Bar - Editorial proof points */}
            <div className="flex flex-wrap items-center gap-6 text-sm text-white/70 font-medium fade-in-up" style={{animationDelay: '0.2s'}}>
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
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 fade-in-up" style={{animationDelay: '0.3s'}}>
            <Button 
              size="xl" 
              className="bg-mint text-ink hover:bg-mint/90 font-bold px-10 py-7 text-lg shadow-2xl shadow-mint/30 hover:shadow-mint/50 transition-all hover:scale-110 hover:-translate-y-1 min-w-[260px] touch-target group"
              onClick={() => window.location.href = '/builder-session'}
            >
              <span className="group-hover:animate-pulse">Book a Builder Session</span>
            </Button>
            <Button 
              size="xl" 
              variant="outline" 
              className="border-2 border-mint/50 text-mint hover:bg-mint/20 hover:border-mint backdrop-blur-sm font-bold px-10 py-7 text-lg min-w-[260px] touch-target hover:scale-105 transition-all"
              onClick={() => {
                const productsSection = document.getElementById('products');
                productsSection?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              View Programs
            </Button>
            </div>
          
          {/* Scroll Indicator - Left aligned with content */}
          <div className="flex flex-col items-start gap-2 mt-32 opacity-60 hover:opacity-100 transition-opacity cursor-pointer fade-in-up" style={{animationDelay: '0.6s'}}>
            <span className="text-white/70 text-xs uppercase tracking-wider font-medium">Scroll to explore</span>
            <svg className="w-5 h-5 text-white/70 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
          </div>
        </div>
      </div>
      
      {/* Add CSS animation for underline */}
      <style>{`
        @keyframes expandWidth {
          0% {
            transform: scaleX(0);
            opacity: 0;
          }
          100% {
            transform: scaleX(1);
            opacity: 1;
          }
        }
      `}</style>
    </section>
  );
};

export default NewHero;

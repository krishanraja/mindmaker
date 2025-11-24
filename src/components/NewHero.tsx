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
      <div className="container-width relative z-10 text-center py-20">
        {/* Logo - Larger, more prominent */}
        <div className="mb-16 fade-in-up">
          <img 
            src={mindmakerLogo} 
            alt="Mindmaker" 
            className="h-16 md:h-20 w-auto mx-auto"
            style={{
              filter: 'drop-shadow(0 0 20px rgba(126, 244, 194, 0.3))'
            }}
          />
        </div>
        
        {/* Main Headline - Bloomberg-level typography */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-8 leading-[1.1] max-w-5xl mx-auto fade-in-up" style={{animationDelay: '0.1s'}}>
          Turn non-technical leaders into{' '}
          <span className="relative inline-block">
            <span className="relative z-10">no-code AI builders</span>
            <span 
              className="absolute bottom-1 left-0 w-full h-3 bg-mint/30 -z-0"
              style={{
                animation: 'expandWidth 0.8s ease-out 0.5s forwards',
                transformOrigin: 'left',
                transform: 'scaleX(0)'
              }}
            />
          </span>
        </h1>
        
        {/* Subheadline - Refined spacing */}
        <div className="space-y-2 mb-12 fade-in-up" style={{animationDelay: '0.2s'}}>
          <p className="text-xl md:text-2xl leading-relaxed max-w-3xl mx-auto text-white/90 font-medium">
            Stop delegating the future to the IT team.
          </p>
          <p className="text-xl md:text-2xl leading-relaxed max-w-3xl mx-auto text-white/90 font-medium">
            Start designing it yourself.
          </p>
        </div>
        
        {/* Trust Bar */}
        <div className="flex flex-wrap items-center justify-center gap-6 mb-12 text-sm text-white/70 fade-in-up" style={{animationDelay: '0.3s'}}>
          <span className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-mint" />
            90+ leadership teams
          </span>
          <span className="hidden sm:inline text-white/40">•</span>
          <span className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-mint" />
            16 years experience
          </span>
          <span className="hidden sm:inline text-white/40">•</span>
          <span className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-mint" />
            Fortune 500 clients
          </span>
        </div>
        
        {/* Premium CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-4xl mx-auto mb-6 fade-in-up" style={{animationDelay: '0.4s'}}>
          <Button 
            size="xl"
            className="bg-white text-ink hover:bg-white/90 font-bold px-10 py-7 text-lg w-full sm:w-auto touch-target shadow-2xl"
            onClick={() => window.open('https://calendly.com/krish-raja/mindmaker-meeting', '_blank')}
          >
            Book a Builder Session
          </Button>
          
          <Button 
            size="xl"
            variant="outline"
            className="border-2 border-white/30 text-white hover:bg-white/10 hover:border-white/50 font-semibold px-10 py-7 text-lg w-full sm:w-auto touch-target backdrop-blur-sm"
            onClick={() => window.location.href = '/builder-sprint'}
          >
            View Programs
          </Button>
        </div>
        
        {/* Micro-copy under CTA */}
        <p className="text-sm text-white/60 mb-16 fade-in-up" style={{animationDelay: '0.5s'}}>
          Free 60-minute consultation • No obligation • Immediate value
        </p>
        
        {/* Three Value Props - Editorial style */}
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto text-left fade-in-up" style={{animationDelay: '0.6s'}}>
          <div className="border-l-2 border-mint/50 pl-4">
            <h3 className="text-base font-bold mb-2 text-white">Individual Leaders</h3>
            <p className="text-white/70 text-sm leading-relaxed">
              Build working systems in 30 days
            </p>
          </div>
          
          <div className="border-l-2 border-mint/50 pl-4">
            <h3 className="text-base font-bold mb-2 text-white">Executive Teams</h3>
            <p className="text-white/70 text-sm leading-relaxed">
              Run AI-enabled decisions in 4 hours
            </p>
          </div>
          
          <div className="border-l-2 border-mint/50 pl-4">
            <h3 className="text-base font-bold mb-2 text-white">Partners</h3>
            <p className="text-white/70 text-sm leading-relaxed">
              Portfolio-wide AI implementation
            </p>
          </div>
        </div>
        
        {/* Krish Headshot - Trust Signal */}
        <div className="absolute bottom-12 right-8 hidden lg:block fade-in-up" style={{animationDelay: '0.7s'}}>
          <div className="relative">
            <img 
              src={krishHeadshot} 
              alt="Krish Raja" 
              className="w-32 h-32 rounded-full border-4 border-mint/30 shadow-2xl object-cover"
            />
            <div className="absolute -bottom-2 -right-2 bg-mint text-ink text-xs font-bold px-3 py-1 rounded-full shadow-lg">
              Founder
            </div>
          </div>
        </div>
      </div>
      
      {/* Refined Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce opacity-50 hover:opacity-100 transition-opacity">
        <div className="flex flex-col items-center gap-2">
          <span className="text-xs text-white/60 font-medium">Scroll to explore</span>
          <div className="w-6 h-10 border-2 border-white/20 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/40 rounded-full mt-2 animate-pulse" />
          </div>
        </div>
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

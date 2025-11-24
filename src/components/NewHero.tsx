import { Button } from "@/components/ui/button";
import mindmakerLogo from "@/assets/mindmaker-logo.png";

const NewHero = () => {
  return (
    <section className="min-h-[90vh] flex items-center justify-center bg-ink text-white relative overflow-hidden">
      {/* Background Pattern - Subtle */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-gradient-to-br from-mint/20 to-transparent"></div>
      </div>
      
      {/* Content */}
      <div className="container-width relative z-10 text-center py-20">
        {/* Logo */}
        <div className="mb-12">
          <img 
            src={mindmakerLogo} 
            alt="Mindmaker" 
            className="h-12 md:h-16 w-auto mx-auto opacity-90"
          />
        </div>
        
        {/* Main Headline */}
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 leading-tight max-w-5xl mx-auto">
          Turn non-technical leaders into no-code AI builders
        </h1>
        
        {/* Subheadline */}
        <p className="text-xl md:text-2xl mb-4 leading-relaxed max-w-3xl mx-auto text-white/80 font-medium">
          Stop delegating the future to the IT team.
        </p>
        <p className="text-xl md:text-2xl mb-12 leading-relaxed max-w-3xl mx-auto text-white/80 font-medium">
          Start designing it yourself.
        </p>
        
        {/* Three-Path CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-4xl mx-auto mb-12">
          <Button 
            size="lg"
            className="bg-mint text-ink hover:bg-mint/90 font-semibold px-8 py-6 text-lg w-full sm:w-auto touch-target"
            onClick={() => window.open('https://calendly.com/krish-raja/mindmaker-meeting', '_blank')}
          >
            Book a Builder Session
          </Button>
          
          <Button 
            size="lg"
            variant="outline"
            className="border-2 border-white text-white hover:bg-white/10 font-semibold px-8 py-6 text-lg w-full sm:w-auto touch-target"
            onClick={() => window.location.href = '/builder-sprint'}
          >
            View Programs
          </Button>
        </div>
        
        {/* Three Value Props */}
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto text-left mt-16">
          <div className="fade-in-up" style={{animationDelay: '0.1s'}}>
            <h3 className="text-lg font-semibold mb-2 text-mint">Individual Leaders</h3>
            <p className="text-white/70 text-sm leading-relaxed">
              Build working systems in 30 days
            </p>
          </div>
          
          <div className="fade-in-up" style={{animationDelay: '0.2s'}}>
            <h3 className="text-lg font-semibold mb-2 text-mint">Executive Teams</h3>
            <p className="text-white/70 text-sm leading-relaxed">
              Run AI-enabled decisions in 4 hours
            </p>
          </div>
          
          <div className="fade-in-up" style={{animationDelay: '0.3s'}}>
            <h3 className="text-lg font-semibold mb-2 text-mint">Partners</h3>
            <p className="text-white/70 text-sm leading-relaxed">
              Portfolio-wide AI implementation
            </p>
          </div>
        </div>
      </div>
      
      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white/50 rounded-full mt-2 animate-pulse" />
        </div>
      </div>
    </section>
  );
};

export default NewHero;

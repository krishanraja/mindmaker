import { Button } from "@/components/ui/button";
import mindmakerIconDark from "@/assets/mindmaker-icon-dark.png";
import { FrictionMapBuilder } from "@/components/Interactive/FrictionMapBuilder";

const NewHero = () => {
  return (
    <section id="hero" className="min-h-screen flex items-center justify-center bg-ink text-white relative overflow-hidden pt-safe-area-top">
      {/* Dynamic Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-ink via-ink to-mint/10"></div>
      
      {/* GIF Background Overlay */}
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
      <div className="container-width relative z-10 py-12 sm:py-16 md:py-20">
        {/* Logo */}
        <div className="flex justify-start mb-12 sm:mb-16 md:mb-24 fade-in-up -ml-6">
          <img 
            src={mindmakerIconDark} 
            alt="Mindmaker" 
            className="h-16 sm:h-20 md:h-24 w-auto"
          />
        </div>
        
        {/* Two Column Layout: Text + Interactive */}
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-start">
          {/* Left: Hero Content */}
          <div className="space-y-6 sm:space-y-8 md:space-y-10 fade-in-up" style={{animationDelay: '0.1s'}}>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight tracking-tight text-white">
              Become the next version of yourself with{" "}
              <span className="relative inline-block">
                <span className="relative z-10 text-mint animate-pulse" style={{animationDuration: '2s'}}>AI literacy for leaders</span>
                <span className="absolute bottom-0 left-0 w-full h-3 sm:h-4 bg-mint/30 -z-10 animate-expandWidth blur-sm"></span>
              </span>
            </h1>
      
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-white/90 max-w-3xl font-light leading-relaxed">
              Most leaders feel behind on AI, but don't know what to actually do about it. We help you become an AI-age business leader by getting you on the path to AI literacy that outlives any one tool.
            </p>
              
            {/* Trust Bar */}
            <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-xs sm:text-sm text-white/70 font-medium fade-in-up" style={{animationDelay: '0.2s'}}>
              <span className="flex items-center gap-2">
                <svg className="w-3 h-3 sm:w-4 sm:h-4 text-mint" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                No vendor theatre
              </span>
              <span className="flex items-center gap-2">
                <svg className="w-3 h-3 sm:w-4 sm:h-4 text-mint" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Practice on real work
              </span>
              <span className="flex items-center gap-2">
                <svg className="w-3 h-3 sm:w-4 sm:h-4 text-mint" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Systems that persist
              </span>
            </div>
            
            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-start gap-3 sm:gap-4 fade-in-up" style={{animationDelay: '0.3s'}}>
              <Button 
                size="lg" 
                className="bg-mint text-ink hover:bg-mint/90 font-bold px-8 sm:px-10 py-6 sm:py-7 text-base sm:text-lg shadow-2xl shadow-mint/30 hover:shadow-mint/50 transition-all hover:scale-105 hover:-translate-y-1 touch-target group"
                onClick={() => window.location.href = '/builder-session'}
              >
                <span className="group-hover:animate-pulse">Book a Builder Session</span>
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-2 border-mint/50 text-mint hover:bg-mint/20 hover:border-mint backdrop-blur-sm font-bold px-8 sm:px-10 py-6 sm:py-7 text-base sm:text-lg touch-target hover:scale-105 transition-all"
                onClick={() => {
                  const productsSection = document.getElementById('products');
                  productsSection?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                View Programs
              </Button>
            </div>
          </div>

          {/* Right: Interactive Friction Map Builder */}
          <div className="fade-in-up lg:mt-8" style={{animationDelay: '0.4s'}}>
            <FrictionMapBuilder />
          </div>
        </div>
        
        {/* Scroll Indicator */}
        <div className="flex flex-col items-start gap-2 mt-16 sm:mt-24 md:mt-32 opacity-60 hover:opacity-100 transition-opacity cursor-pointer fade-in-up" style={{animationDelay: '0.6s'}}>
          <span className="text-white/70 text-xs uppercase tracking-wider font-medium">Scroll to explore</span>
          <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white/70 animate-bounce" style={{animationDuration: '1.5s'}} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </div>
      
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

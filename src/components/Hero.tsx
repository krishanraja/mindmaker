import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Target, TrendingUp } from "lucide-react";

const Hero = () => {
  return (
    <section className="hero-clouds min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Content */}
      <div className="container-width relative z-10 text-center text-white">
        <div className="max-w-6xl mx-auto fade-in-up">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 mb-8">
            <Sparkles size={16} className="text-white" />
            <span className="text-sm font-medium">The existential challenge of our generation is coming</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-semibold tracking-tight mb-6 leading-tight">
            AI Literacy is
            <span className="block text-white">
              Non-Negotiable
            </span>
          </h1>
          
          {/* Subheadline */}
          <p className="text-base md:text-lg leading-relaxed mb-4 max-w-4xl mx-auto opacity-90">
            <strong className="text-white">3 in 5 workers need occupational transition.</strong> The dangerous gap between AI hype and practical enterprise implementation is widening every day. 
            Our proven literacy-first methodology transforms leadership teams into confident AI decision-makers.
          </p>
          
          {/* Urgency Statement */}
          <p className="text-sm md:text-base leading-relaxed mb-12 max-w-3xl mx-auto opacity-80">
            <strong className="text-white">16 years of expertise.</strong> 90+ product strategies delivered. Stop waiting for AI to happen to you.
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-16">
            <Button 
              size="lg" 
              className="bg-primary text-white hover:bg-primary-600 focus:ring-2 focus:ring-ring font-semibold px-8 py-4 text-lg group"
            >
              AI Readiness Assessment
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            
            <Button 
              variant="outline" 
              size="lg"
              className="glass-card-dark border-white/20 text-white hover:bg-white/10 font-medium px-8 py-4 text-lg"
            >
              Executive Seminars
            </Button>
          </div>

          {/* Proof Points */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
            <div className="glass-card-dark text-center p-6">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-white/10 rounded-lg mb-4">
                <Target className="h-6 w-6 text-white" />
              </div>
              <div className="text-2xl font-bold text-white mb-2">90+</div>
              <div className="text-white/80 text-sm">Product Strategies Delivered</div>
            </div>
            
            <div className="glass-card-dark text-center p-6">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-white/10 rounded-lg mb-4">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
              <div className="text-2xl font-bold text-white mb-2">50+</div>
              <div className="text-white/80 text-sm">Executive Seminars & Keynotes</div>
            </div>
            
            <div className="glass-card-dark text-center p-6">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-white/10 rounded-lg mb-4">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <div className="text-2xl font-bold text-white mb-2">16</div>
              <div className="text-white/80 text-sm">Years of Proven Expertise</div>
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
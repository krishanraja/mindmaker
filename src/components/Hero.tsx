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
            <span className="text-sm font-medium">Stop waiting for AI to happen to you</span>
          </div>

          {/* Main Headline */}
          <h1 className="display-xl mb-6 leading-tight">
            Transform Your Business with
            <span className="block bg-gradient-to-r from-white via-purple-100 to-pink-100 bg-clip-text text-transparent">
              Strategic AI Implementation
            </span>
          </h1>
          
          {/* Subheadline */}
          <p className="body-lg mb-12 max-w-4xl mx-auto opacity-90 leading-relaxed">
            Break free from AI pilot purgatory. Our proven 4-phase methodology has delivered 
            <strong className="text-white"> 3-5x revenue growth</strong> for 100+ enterprises. 
            Move from AI hype to measurable competitive advantage.
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-16">
            <Button 
              size="lg" 
              className="btn-modern bg-white text-purple-600 hover:bg-white/90 font-semibold px-8 py-4 text-lg group"
            >
              Get Your AI Readiness Assessment
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            
            <Button 
              variant="outline" 
              size="lg"
              className="btn-modern border-white/30 text-white hover:bg-white/10 font-medium px-8 py-4 text-lg"
            >
              Watch Success Stories
            </Button>
          </div>

          {/* Proof Points */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
            <div className="card-modern text-center p-6">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-white/10 rounded-lg mb-4">
                <Target className="h-6 w-6 text-white" />
              </div>
              <div className="text-2xl font-bold text-white mb-2">100+</div>
              <div className="text-white/80 text-sm">Enterprises Transformed</div>
            </div>
            
            <div className="card-modern text-center p-6">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-white/10 rounded-lg mb-4">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
              <div className="text-2xl font-bold text-white mb-2">3-5x</div>
              <div className="text-white/80 text-sm">Revenue Growth</div>
            </div>
            
            <div className="card-modern text-center p-6">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-white/10 rounded-lg mb-4">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <div className="text-2xl font-bold text-white mb-2">90%</div>
              <div className="text-white/80 text-sm">Success Rate</div>
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
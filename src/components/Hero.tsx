import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, GraduationCap, Users, BookOpen } from "lucide-react";
import mindmakerLogo from "@/assets/mindmaker-logo.png";

const Hero = () => {
  return (
    <section className="hero-clouds min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Content */}
      <div className="container-width relative z-10 text-center text-white">
        <div className="max-w-6xl mx-auto fade-in-up">
          {/* Logo */}
          <div className="mb-8">
            <img 
              src={mindmakerLogo} 
              alt="MindMaker" 
              className="h-16 w-auto mx-auto mb-6"
            />
          </div>
          
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 mb-8">
            <Sparkles size={16} className="text-white" />
            <span className="text-sm font-medium">AI has learned our language. Now we must learn its way of thinking.</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-semibold tracking-tight mb-6 leading-tight">
            Transform How You
            <span className="block text-white">
              Think About AI
            </span>
          </h1>
          
          {/* Subheadline */}
          <p className="text-base md:text-lg leading-relaxed mb-4 max-w-4xl mx-auto opacity-90">
            <strong className="text-white">The World's First AI Literacy Accelerator.</strong>
          </p>
          <p className="text-base md:text-lg leading-relaxed mb-4 max-w-4xl mx-auto opacity-90">
            Through proven methodologies and cognitive frameworks, we help leaders develop the mental models to think, reason, and collaborate with AI systems effectively.
          </p>
          <p className="text-base md:text-lg leading-relaxed mb-12 max-w-4xl mx-auto opacity-90">
            Being AI literate is the critical pre-game before you become an AI orchestrator or AI leader.
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-16">
            <Button 
              size="lg" 
              className="bg-primary text-white hover:bg-primary-600 focus:ring-2 focus:ring-ring font-semibold px-8 py-4 text-lg group"
              onClick={() => {
                const outcomesSection = document.getElementById('outcomes');
                if (outcomesSection) {
                  outcomesSection.scrollIntoView({ behavior: 'smooth' });
                }
              }}
            >
              AI Literacy Assessment
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            
            <Button 
              variant="outline" 
              size="lg"
              className="glass-card-dark border-white/20 text-white hover:bg-white/10 font-medium px-8 py-4 text-lg"
              onClick={() => {
                const pathwaysSection = document.getElementById('pathways');
                if (pathwaysSection) {
                  pathwaysSection.scrollIntoView({ behavior: 'smooth' });
                }
              }}
            >
              Educational Seminars
            </Button>
          </div>

          {/* Proof Points */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
            <div className="glass-card-dark text-center p-6">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-white/10 rounded-lg mb-4">
                <GraduationCap className="h-6 w-6 text-white" />
              </div>
              <div className="text-2xl font-bold text-white mb-2">200+</div>
              <div className="text-white/80 text-sm">Minds Transformed</div>
            </div>
            
            <div className="glass-card-dark text-center p-6">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-white/10 rounded-lg mb-4">
                <Users className="h-6 w-6 text-white" />
              </div>
              <div className="text-2xl font-bold text-white mb-2">50+</div>
              <div className="text-white/80 text-sm">Educational Seminars Delivered</div>
            </div>
            
            <div className="glass-card-dark text-center p-6">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-white/10 rounded-lg mb-4">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
              <div className="text-2xl font-bold text-white mb-2">16</div>
              <div className="text-white/80 text-sm">Years Teaching & Research</div>
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
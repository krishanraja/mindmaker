import { Button } from "@/components/ui/button";
import { ArrowRight, Download, FileText } from "lucide-react";
import heroBackground from "@/assets/hero-background.jpg";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroBackground}
          alt="AI transformation visualization"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/90 via-primary/70 to-primary/50" />
      </div>
      
      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 text-center text-white">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-6xl md:text-8xl font-black leading-tight mb-8">
            Stop waiting for AI to{" "}
            <span className="block text-accent-glow">happen to you</span>
          </h1>
          
          <p className="text-xl md:text-2xl leading-relaxed mb-12 max-w-4xl mx-auto opacity-90">
            While <strong>88% of enterprises fail</strong> to scale AI beyond pilots, 
            industry leaders use our proven 4-phase methodology to build AI-first 
            competitive advantages that drive <strong className="text-accent-glow">3-5x revenue growth</strong>.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Button variant="cta" size="xl" className="group">
              Get Your AI Readiness Assessment
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            
            <Button variant="enterprise" size="xl" className="group bg-white/10 text-white border-white/20 hover:bg-white/20">
              <Download className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
              Download CEO AI Strategy Playbook
            </Button>
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
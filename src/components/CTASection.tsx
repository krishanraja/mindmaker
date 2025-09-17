import { Button } from "@/components/ui/button";
import { ArrowRight, Clock, TrendingUp, Zap } from "lucide-react";

const CTASection = () => {
  const urgencyStats = [
    {
      number: "12",
      description: "AI advisories delivered in last 3 months alone",
      icon: Clock,
    },
    {
      number: "90+", 
      description: "New product strategies delivered to media organizations",
      icon: Zap,
    },
    {
      number: "50+",
      description: "Executive seminars and keynotes on data & automation futures", 
      icon: TrendingUp,
    },
  ];

  return (
    <section className="section-padding bg-primary text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.1),transparent_70%)]" />
      </div>

      <div className="container-width relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight mb-6">The AI Literacy Gap</h2>
          <blockquote className="text-xl md:text-2xl font-semibold mb-8 max-w-4xl mx-auto opacity-90">
            "Team AI literacy is the missing piece in enterprise AI adoption, whilst AI product strategy usually goes missing - creating opportunity for emerging competitors to displace incumbents."
          </blockquote>
          <p className="text-base md:text-lg leading-relaxed opacity-80 max-w-3xl mx-auto">
            Transform from AI-confused to AI-confident before your competitors do.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {urgencyStats.map((stat, index) => (
            <div key={index} className="text-center group">
              <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-white/20 transition-colors duration-300">
                <stat.icon className="w-10 h-10 text-white" />
              </div>
              <div className="text-3xl md:text-4xl font-bold mb-4 text-white">
                {stat.number}
              </div>
              <p className="text-base md:text-lg leading-relaxed opacity-90">
                {stat.description}
              </p>
            </div>
          ))}
        </div>

        <div className="text-center">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 md:p-12 max-w-4xl mx-auto">
            <div className="mb-8">
              <h3 className="text-3xl font-bold mb-4">AI Mindmaker</h3>
              <p className="text-base md:text-lg leading-relaxed opacity-90">
                Literacy to Strategy - Bridge the gap between AI hype and practical enterprise implementation. 
                16 years of proven expertise in tech, data, and AI transformation.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <Button asChild className="bg-accent text-white hover:bg-accent-400 focus:ring-2 focus:ring-ring group">
                <a href="mailto:krish@fractionl.ai?subject=AI Readiness Assessment">
                  AI Readiness Assessment
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </a>
              </Button>
              
              <Button asChild variant="outline" className="bg-transparent border-white text-white hover:bg-white/10">
                <a href="mailto:krish@fractionl.ai?subject=Executive Consultation">
                  Executive Consultation
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </a>
              </Button>
            </div>
            
            <div className="mt-6 text-center">
              <p className="text-sm opacity-80">
                Contact <a href="mailto:krish@fractionl.ai" className="text-accent hover:underline font-medium">krish@fractionl.ai</a> to discuss your specific needs
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
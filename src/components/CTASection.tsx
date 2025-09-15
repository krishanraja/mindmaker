import { Button } from "@/components/ui/button";
import { ArrowRight, Clock, TrendingUp, Zap } from "lucide-react";

const CTASection = () => {
  const urgencyStats = [
    {
      number: "6 months",
      description: "Until AI literacy becomes table stakes in most sectors",
      icon: Clock,
    },
    {
      number: "90 days", 
      description: "Typical transformation timeline with our methodology",
      icon: Zap,
    },
    {
      number: "3-5x",
      description: "Average revenue growth from AI-first strategies", 
      icon: TrendingUp,
    },
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-primary via-primary-light to-primary-glow text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.1),transparent_70%)]" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">The Strategic Imperative</h2>
          <blockquote className="text-2xl md:text-3xl font-semibold mb-8 max-w-4xl mx-auto opacity-90">
            "AI won't replace managers – but managers who understand AI will replace those who don't."
          </blockquote>
          <p className="text-xl opacity-80 max-w-3xl mx-auto">
            The window for building AI-first competitive advantages is closing rapidly.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {urgencyStats.map((stat, index) => (
            <div key={index} className="text-center group">
              <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-white/20 transition-colors duration-300">
                <stat.icon className="w-10 h-10 text-white" />
              </div>
              <div className="text-3xl md:text-4xl font-black mb-4 text-accent-glow">
                {stat.number}
              </div>
              <p className="text-lg opacity-90">
                {stat.description}
              </p>
            </div>
          ))}
        </div>

        <div className="text-center">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 md:p-12 max-w-4xl mx-auto">
            <div className="mb-8">
              <h3 className="text-3xl font-bold mb-4">AI Mindmaker</h3>
              <p className="text-xl opacity-90">
                AI literacy to strategy - transforming enterprises from pilot purgatory to production-ready AI advantages.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <Button variant="cta" size="xl" className="group bg-accent hover:bg-accent-glow">
                Start Your AI Transformation
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              
              <Button variant="enterprise" size="xl" className="group bg-white/10 text-white border-white/30 hover:bg-white/20">
                Schedule Strategic Consultation
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
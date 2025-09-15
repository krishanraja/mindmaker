import { Button } from "@/components/ui/button";
import { ArrowRight, Search, Target, Users, TrendingUp } from "lucide-react";

const MethodologySection = () => {
  const phases = [
    {
      number: "1",
      title: "DISCOVER",
      goal: "LEARN",
      description: "Diagnostic across your team in the areas of tech stack, objectives, product vision, customer sets and competitive landscape.",
      benefits: [
        "Executive team AI literacy primer",
        "Market shifts & competitive analysis", 
        "Workflow & capability assessment",
      ],
      icon: Search,
      cta: "Start Discovery Sprint",
    },
    {
      number: "2", 
      title: "STRATEGIZE",
      goal: "DECIDE",
      description: "Build an AI + data-led product plan which delivers on corporate revenue strategy objectives and competitive positioning.",
      benefits: [
        "AI capabilities mapping to product strategy",
        "Future-proof business architecture",
        "Competitive moat development",
      ],
      icon: Target,
      cta: "Build AI Strategy",
    },
    {
      number: "3",
      title: "IMPLEMENT", 
      goal: "ALIGN",
      description: "Inspire, educate & level up team members & leaders on AI, create operational plans that drive execution speed.",
      benefits: [
        "Team AI literacy transformation",
        "Workflow redesign workshops",
        "Internal AI usage playbook",
      ],
      icon: Users,
      cta: "Transform Teams",
    },
    {
      number: "4",
      title: "SCALE",
      goal: "SELL", 
      description: "Agentic AI & data pricing, monetization systems, automation that drives inbound sales & marketing content engine.",
      benefits: [
        "AI-powered revenue optimization",
        "Automated sales & marketing systems",
        "Pricing & monetization strategy",
      ],
      icon: TrendingUp,
      cta: "Scale Revenue",
    },
  ];

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="section-title">The Proven 4-Phase Transformation</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Our modular advisory capabilities follow a proven sequence: <strong>Learn → Decide → Align → Sell</strong>. 
            Each phase builds strategic AI advantages that create sustainable competitive moats.
          </p>
        </div>

        <div className="space-y-12">
          {phases.map((phase, index) => (
            <div 
              key={index}
              className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${
                index % 2 === 1 ? 'lg:grid-flow-col-dense' : ''
              }`}
            >
              {/* Content */}
              <div className={`space-y-6 ${index % 2 === 1 ? 'lg:col-start-2' : ''}`}>
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                    <span className="text-2xl font-black text-primary">{phase.number}</span>
                  </div>
                  <div>
                    <h3 className="text-3xl font-bold text-primary">{phase.title}</h3>
                    <p className="text-xl font-semibold text-accent">Goal: {phase.goal}</p>
                  </div>
                </div>

                <p className="text-lg text-muted-foreground leading-relaxed">
                  {phase.description}
                </p>

                <div className="space-y-3">
                  {phase.benefits.map((benefit, benefitIndex) => (
                    <div key={benefitIndex} className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-accent rounded-full" />
                      <span className="text-foreground">{benefit}</span>
                    </div>
                  ))}
                </div>

                <Button variant="hero" size="lg" className="group">
                  {phase.cta}
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>

              {/* Icon Visual */}
              <div className={`flex justify-center ${index % 2 === 1 ? 'lg:col-start-1' : ''}`}>
                <div className="w-64 h-64 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full flex items-center justify-center group hover:scale-105 transition-transform duration-300">
                  <phase.icon className="w-24 h-24 text-primary group-hover:text-accent transition-colors duration-300" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MethodologySection;
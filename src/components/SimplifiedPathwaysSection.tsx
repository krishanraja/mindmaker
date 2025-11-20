import { Button } from "@/components/ui/button";
import { Target, Rocket, ArrowRight } from "lucide-react";
import PartnersCard from "./PartnersCard";

const SimplifiedPathwaysSection = () => {
  const pathways = [
    {
      track: "FOUNDATION",
      audience: "Leaders/Founders",
      title: "AI Alignment Sprint",
      timeline: "30 Days",
      investment: "$5-10K",
      description: "Build AI-forward leadership confidence and speed of decision",
      deliverables: [
        "Map where you stand vs where you think you stand",
        "Build mental models to spot theatre vs substance",
        "Practice on real decisions until patterns become instinct",
        "Upgrade questions for vendors and boards",
        "Result: Better AI decisions, less wasted capital"
      ],
      icon: Target,
      gradient: "from-primary to-primary-600",
      cta: "Book Discovery Call",
      ctaLink: "https://calendly.com/krish-raja/mindmaker-meeting"
    },
    {
      track: "PERFORMANCE",
      audience: "Leaders/Founders",
      title: "AI Strategy Accelerator",
      timeline: "6-12 Weeks",
      investment: "Custom",
      description: "Turn literacy into measurable ROI and competitive advantage",
      deliverables: [
        "Track how mental models improve decision velocity",
        "Build cognitive infrastructure that compounds quarterly",
        "Evolve thinking patterns based on real outcomes",
        "Measure clarity improvements, not vanity metrics",
        "Result: Decisions get faster and cleaner over time"
      ],
      icon: Rocket,
      gradient: "from-accent to-accent-400",
      cta: "Book Strategy Call",
      ctaLink: "https://calendly.com/krish-raja/mindmaker-meeting"
    }
  ];

  return (
    <section id="pathways" className="section-padding bg-background">
      <div className="container-width">
        <div className="text-center mb-16 fade-in-up">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-6">
            <span className="text-foreground">Three Clear Paths.</span>
            <br />
            <span className="text-primary">One Compounding System.</span>
          </h2>
          <p className="text-lg md:text-xl leading-relaxed text-muted-foreground max-w-3xl mx-auto">
            Choose the engagement model that fits your needs — from 30-day sprints to annual partnerships.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {pathways.map((pathway, index) => {
            const IconComponent = pathway.icon;
            return (
              <div 
                key={index}
                className="glass-card p-8 fade-in-up hover:scale-105 transition-all duration-300 flex flex-col h-full min-h-[600px] lg:min-h-[700px]"
                style={{animationDelay: `${index * 0.15}s`}}
              >
                {/* Header */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-3">
                    <div className="text-xs font-bold text-primary/60 tracking-wider">
                      {pathway.track}
                    </div>
                    <div className="text-xs font-medium text-muted-foreground/80">
                      {pathway.audience}
                    </div>
                  </div>
                  <div className={`w-12 h-12 bg-gradient-to-br ${pathway.gradient} rounded-lg flex items-center justify-center mb-4`}>
                    <IconComponent className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-foreground mb-2">
                    {pathway.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    {pathway.description}
                  </p>
                  {pathway.track === "FOUNDATION" && (
                    <p className="text-xs text-primary/80 italic mb-2">
                      Start with our free 2-minute AI Leadership Benchmark to assess your readiness and receive a personalized 90-day roadmap.
                    </p>
                  )}
                  {pathway.track === "PERFORMANCE" && (
                    <p className="text-xs text-primary/80 italic mb-2">
                      Already completed the benchmark? This accelerator builds on your baseline with quarterly dashboards and innovation pipelines.
                    </p>
                  )}
                </div>

                {/* Timeline & Investment */}
                <div className="flex items-center justify-between mb-6 pb-6 border-b border-border">
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">Timeline</div>
                    <div className="text-sm font-semibold text-foreground">{pathway.timeline}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-muted-foreground mb-1">Investment</div>
                    <div className="text-sm font-semibold text-primary">{pathway.investment}</div>
                  </div>
                </div>

                {/* Deliverables */}
                <div className="flex-grow mb-6">
                  <div className="text-sm font-semibold text-foreground mb-3">What You Get:</div>
                  <ul className="space-y-2">
                    {pathway.deliverables.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <span className="text-primary mt-0.5">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>


                {/* CTA */}
                <Button 
                  variant="hero-primary" 
                  size="lg" 
                  className="w-full group"
                  onClick={() => window.open(pathway.ctaLink, '_blank')}
                >
                  {pathway.cta}
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            );
          })}
          
          {/* Partners Card - Third Column */}
          <div className="h-full min-h-[600px] lg:min-h-[700px]" style={{animationDelay: '0.3s'}}>
            <PartnersCard />
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center fade-in-up" style={{animationDelay: '0.5s'}}>
          <p className="text-sm text-muted-foreground mb-4">
            Not sure which path fits your needs?
          </p>
          <Button 
            variant="outline" 
            size="lg"
            onClick={() => window.open('https://calendly.com/krish-raja/mindmaker-meeting', '_blank')}
          >
            Book a Strategy Call
          </Button>
        </div>
      </div>
    </section>
  );
};

export default SimplifiedPathwaysSection;

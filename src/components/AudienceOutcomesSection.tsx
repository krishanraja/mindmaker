import { Crown, Rocket, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";

const AudienceOutcomesSection = () => {
  const outcomes = [
    {
      audience: "Leaders",
      outcome: "Run & Future Proof",
      description: "Transform from AI-anxious to AI-confident. Make strategic decisions with clarity and conviction.",
      benefits: [
        "Strategic AI roadmap aligned with business goals",
        "Confident decision-making framework", 
        "Risk mitigation strategies that actually work",
        "Team alignment on AI priorities"
      ],
      icon: Crown,
      cta: "Executive Assessment"
    },
    {
      audience: "Founders",
      outcome: "Reclaim Purpose", 
      description: "Stop chasing AI shiny objects. Focus on what matters: sustainable competitive advantage.",
      benefits: [
        "Clear product-market fit with AI integration",
        "Competitive differentiation strategy",
        "Resource allocation that drives ROI",
        "Investor-ready AI narrative"
      ],
      icon: Rocket,
      cta: "Founder Sprint"
    },
    {
      audience: "Teams", 
      outcome: "10x Your Value",
      description: "Turn AI anxiety into career acceleration. Become the talent companies fight to keep.",
      benefits: [
        "Future-proof skill development plan",
        "AI-augmented productivity mastery",
        "Career positioning in AI-first economy", 
        "Confidence to lead AI initiatives"
      ],
      icon: TrendingUp,
      cta: "Team Program"
    },
  ];

  return (
    <section className="section-padding bg-background">
      <div className="container-width">
        <div className="text-center mb-16 fade-in-up">
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight mb-6">
            Your{" "}
            <span className="text-primary">
              Transformation Outcome
            </span>
          </h2>
          <p className="text-base md:text-lg leading-relaxed text-muted-foreground max-w-3xl mx-auto">
            Different audiences, different outcomes. Same proven methodology that delivers results.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {outcomes.map((outcome, index) => (
            <div key={index} className="card p-8 fade-in-up" style={{animationDelay: `${index * 0.1}s`}}>
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary text-white rounded-xl mb-4">
                  <outcome.icon className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  {outcome.audience}
                </h3>
                <h4 className="text-2xl font-bold text-primary mb-4">
                  {outcome.outcome}
                </h4>
                <p className="text-muted-foreground leading-relaxed mb-6">
                  {outcome.description}
                </p>
              </div>
              
              <div className="space-y-3 mb-8">
                {outcome.benefits.map((benefit, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-sm text-muted-foreground leading-relaxed">
                      {benefit}  
                    </span>
                  </div>
                ))}
              </div>
              
              <Button 
                className="w-full bg-primary hover:bg-primary-600 text-white"
                onClick={() => window.location.href = `mailto:krish@fractionl.ai?subject=${outcome.cta} - Let's Discuss`}
              >
                {outcome.cta}
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AudienceOutcomesSection;
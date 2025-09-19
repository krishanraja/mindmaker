import { Button } from "@/components/ui/button";
import mindmakerIconLight from "@/assets/mindmaker-icon-light.png";
import ResponsiveCardGrid from "@/components/ResponsiveCardGrid";

const AudienceOutcomesSection = () => {
  const outcomes = [
    {
      audience: "Enterprise Leaders",
      outcome: "Run & Future Proof",
      description: "Transform from AI-anxious to AI-confident. Make strategic decisions with clarity and conviction.",
      benefits: [
        "Strategic AI roadmap for business",
        "Confident decision framework", 
        "Effective risk mitigation strategies",
        "Team AI priority alignment"
      ],
      icon: mindmakerIconLight,
      cta: "Executive Assessment"
    },
    {
      audience: "High Growth SMB",
      outcome: "Reclaim Purpose", 
      description: "Stop chasing AI shiny objects. Focus on what matters: sustainable competitive advantage.",
      benefits: [
        "AI-integrated product-market fit",
        "Competitive differentiation plan",
        "ROI-driven resource allocation",
        "Strong investor AI narrative"
      ],
      icon: mindmakerIconLight,
      cta: "High Growth Sprint"
    },
    {
      audience: "Teams", 
      outcome: "10x Your Value",
      description: "Turn AI anxiety into career acceleration.<br />Become the talent companies fight to keep.",
      benefits: [
        "Future-proof skill development",
        "AI productivity mastery",
        "AI-first economy positioning", 
        "AI leadership confidence"
      ],
      icon: mindmakerIconLight,
      cta: "Team Program"
    },
  ];

  return (
    <section className="py-8 sm:py-12 md:py-16 lg:py-16 bg-background">
      <div className="container-width">
        <div className="text-center mb-8 sm:mb-10 md:mb-12 lg:mb-10 fade-in-up">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight mb-4 sm:mb-5 lg:mb-4">
            <span className="text-primary">
              Pick a Pathway
            </span>
          </h2>
          <p className="text-sm sm:text-base md:text-lg leading-relaxed text-muted-foreground mx-auto px-4">
            Different audiences, different outcomes.<br className="sm:hidden" /> Same proven methodology<br className="sm:hidden" /> that delivers results.
          </p>
        </div>
        
        <ResponsiveCardGrid 
          desktopGridClass="flex flex-col lg:grid lg:grid-cols-3 gap-6 lg:gap-6"
          mobileCardHeight="h-[550px]"
        >
          {outcomes.map((outcome, index) => (
            <div key={index} className="card p-6 sm:p-8 lg:p-6 fade-in-up flex flex-col h-full rounded-xl" style={{animationDelay: `${index * 0.1}s`}}>
              <div className="text-center mb-5 sm:mb-6 lg:mb-5 flex flex-col">
                <div className="inline-flex items-center justify-center w-14 sm:w-16 h-14 sm:h-16 bg-primary text-white rounded-xl mb-4 mx-auto">
                  <img src={outcome.icon} alt="MindMaker Icon" className="max-h-7 max-w-7 sm:max-h-8 sm:max-w-8 object-contain" />
                </div>
                <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wide text-foreground mb-2">
                  {outcome.audience}
                </h3>
                <h4 className="text-xl sm:text-2xl font-bold text-primary mb-3 sm:mb-4 lg:mb-3">
                  {outcome.outcome}
                </h4>
                <p className="text-sm sm:text-sm font-normal leading-relaxed text-muted-foreground" dangerouslySetInnerHTML={{ __html: outcome.description }}>
                </p>
              </div>
              
              <div className="space-y-3 mb-5 sm:mb-6 lg:mb-5 flex-1">
                {outcome.benefits.map((benefit, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-sm font-normal leading-relaxed text-muted-foreground">
                      {benefit}  
                    </span>
                  </div>
                ))}
              </div>
              
              <Button 
                asChild
                size="lg"
                className="w-full bg-primary hover:bg-primary-600 text-white mt-auto min-h-[48px] text-sm sm:text-base font-semibold rounded-lg"
              >
                <a 
                  href={
                    outcome.cta === 'Executive Assessment' ? 'https://leaders.themindmaker.ai' :
                    outcome.cta === 'High Growth Sprint' ? 'https://smb.themindmaker.ai' :
                    outcome.cta === 'Team Program' ? 'https://teams.themindmaker.ai' :
                    '#'
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {outcome.cta}
                </a>
              </Button>
            </div>
          ))}
        </ResponsiveCardGrid>
      </div>
    </section>
  );
};

export default AudienceOutcomesSection;
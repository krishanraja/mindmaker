import { Button } from "@/components/ui/button";
import mindmakerIconLight from "@/assets/mindmaker-icon-light.png";
import ResponsiveCardGrid from "@/components/ResponsiveCardGrid";

const AudienceOutcomesSection = () => {
  const outcomes = [
    {
      audience: "Enterprise Leaders",
      outcome: "Run & Future Proof",
      description: "Transform from anxious to AI-confident. Make strategic decisions with AI as your thinking partner, not just another tool.",
      benefits: [
        "Accelerated AI adoption without wasted pilots",
        "Strategic roadmap for measurable ROI", 
        "Confident decision-making framework",
        "Leadership literacy that drives business outcomes"
      ],
      icon: mindmakerIconLight,
      cta: "Executive Assessment"
    },
    {
      audience: "High Growth SMB",
      outcome: "Reclaim Purpose", 
      description: "Stop chasing hype. Transform AI literacy into a revenue catalyst for sustainable competitive advantage.",
      benefits: [
        "Revenue growth through literacy-driven workflows",
        "Competitive advantage with modular, flexible learning",
        "Choose what you need, when you need it",
        "Fast-track innovation with practical business outcomes"
      ],
      icon: mindmakerIconLight,
      cta: "High Growth Sprint"
    },
    {
      audience: "Teams", 
      outcome: "10x Your Value",
      description: "Turn AI anxiety into career acceleration.<br />Master GenAI as your thinking partner and become indispensable talent.",
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
            Interactive, gamified learning designed to transform GenAI from overwhelming threat to strategic thinking partner. Choose your pathway.
          </p>
        </div>
        
        <ResponsiveCardGrid 
          desktopGridClass="flex flex-col lg:grid lg:grid-cols-3 gap-6 lg:gap-6"
          mobileCardHeight="h-[360px]"
        >
          {outcomes.map((outcome, index) => (
            <div key={index} className="card p-4 sm:p-6 lg:p-8 fade-in-up flex flex-col justify-between h-full rounded-xl" style={{animationDelay: `${index * 0.1}s`}}>
              <div className="flex flex-col flex-1">
                <div className="text-center mb-5 sm:mb-6 lg:mb-5 flex flex-col">
                  <div className="inline-flex items-center justify-center w-14 sm:w-16 h-14 sm:h-16 bg-primary text-white rounded-xl mb-4 mx-auto">
                    <img src={outcome.icon} alt="MindMaker Icon" className="h-8 w-8 sm:h-10 sm:w-10 object-contain" loading="lazy" decoding="async" />
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
                
                <div className="space-y-3 mb-5 sm:mb-6 lg:mb-5">
                  {outcome.benefits.map((benefit, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-sm font-normal leading-relaxed text-muted-foreground">
                        {benefit}  
                      </span>
                    </div>
                  ))}
                </div>
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
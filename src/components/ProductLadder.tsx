import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { User, Users, TrendingUp } from "lucide-react";
import { useState } from "react";
import peerComparisonMatrix from "@/assets/peer-comparison-matrix.png";
import battleTestStrategy from "@/assets/battle-test-strategy.png";
import { InitialConsultModal } from "@/components/InitialConsultModal";

const JourneySlider = ({ onBookClick }: { onBookClick: (program: string) => void }) => {
  const [journeyStage, setJourneyStage] = useState([0]);
  
  const offerings = [
    {
      name: "Drop In Builder Session",
      duration: "60 minutes",
      description: "Live session with Krish. Bring one real leadership problem. Leave with an AI friction map, 1-2 draft systems, and written follow-up with prompts.",
      cta: "Book Session",
      program: "builder-session",
      intensity: "Light Touch",
    },
    {
      name: "Curated Weekly Updates",
      duration: "4 weeks async",
      description: "Weekly recommendations and async access to Krish. Stay current on what matters for your context. Build at your own pace.",
      cta: "Learn More",
      program: "builder-session",
      intensity: "Steady Build",
    },
    {
      name: "30-Day Builder Sprint",
      duration: "4 weeks intensive",
      description: "For senior leaders. Build 3-5 working AI-enabled systems around your actual week. Leave with a Builder Dossier and 90-day plan.",
      cta: "Learn More",
      program: "builder-sprint",
      intensity: "Deep Dive",
    },
  ];

  const currentIndex = journeyStage[0] <= 33 ? 0 : journeyStage[0] <= 66 ? 1 : 2;
  const currentOffering = offerings[currentIndex];

  return (
    <div className="premium-card h-full flex flex-col min-h-[440px]">
      <div className="inline-block bg-mint text-ink text-xs font-bold px-3 py-1 rounded-full mb-4 shadow-lg w-fit">
        ⭐ RECOMMENDED
      </div>
      
      <div className="mb-6">
        <div className="text-xs font-bold text-muted-foreground mb-2">YOUR JOURNEY</div>
        <Slider
          value={journeyStage}
          onValueChange={setJourneyStage}
          max={100}
          step={1}
          className="mb-4"
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span className={journeyStage[0] <= 33 ? "text-foreground font-semibold" : ""}>1 hr</span>
          <span className={journeyStage[0] > 33 && journeyStage[0] <= 66 ? "text-foreground font-semibold" : ""}>4 weeks</span>
          <span className={journeyStage[0] > 66 ? "text-foreground font-semibold" : ""}>30 days</span>
        </div>
      </div>

      <div className="flex-1 flex flex-col transition-all duration-300">
        <div className="text-xs text-mint font-bold mb-2">{currentOffering.intensity}</div>
        <h4 className="text-lg font-bold text-foreground mb-2">
          {currentOffering.name}
        </h4>
        <div className="text-xs text-muted-foreground mb-3">
          {currentOffering.duration}
        </div>
        
        <p className="text-sm leading-relaxed mb-4 text-foreground flex-1">
          {currentOffering.description}
        </p>
        
        <Button 
          size="lg"
          variant="mint"
          className="w-full touch-target font-semibold shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5"
          onClick={() => onBookClick(currentOffering.program)}
        >
          {currentOffering.cta}
        </Button>
      </div>
    </div>
  );
};

const ProductLadder = () => {
  const [consultModalOpen, setConsultModalOpen] = useState(false);
  const [preselectedProgram, setPreselectedProgram] = useState<string | undefined>();

  const handleBookClick = (program: string) => {
    setPreselectedProgram(program);
    setConsultModalOpen(true);
  };

  const tracks = [
    {
      icon: User,
      label: "1-1 LEADERS",
      title: "Individual Builder Journey",
      useSlider: true,
    },
    {
      icon: Users,
      label: "EXEC TEAMS",
      title: "Team Transformation",
      offerings: [
        {
          name: "AI Leadership Lab",
          duration: "2-8 hours",
          description: "For 6-12 executives. Run two real decisions through a new AI-enabled way of working. Leave with a 90-day pilot charter.",
          cta: "Learn More",
          program: "leadership-lab",
          image: battleTestStrategy,
        },
      ],
    },
    {
      icon: TrendingUp,
      label: "PARTNERS",
      title: "Portfolio-Wide Programs",
      offerings: [
        {
          name: "Portfolio Program",
          duration: "6-12 months",
          description: "For VCs, advisors, consultancies. Repeatable way to scan and prioritize your portfolio for AI work. Co-create sprints and labs.",
          cta: "Learn More",
          program: "partner-program",
          image: peerComparisonMatrix,
        },
      ],
    },
  ];

  return (
    <section className="section-padding bg-background" id="products">
      <div className="container-width">
        <div className="text-center mb-8 sm:mb-12 px-4 sm:px-0">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6">
            Choose Your Builder Journey
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-3xl mx-auto">
            From 60-minute sessions to portfolio-wide transformation
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto px-4 sm:px-0">
          {tracks.map((track, trackIndex) => {
            const IconComponent = track.icon;
            return (
              <div key={trackIndex} className="fade-in-up flex flex-col" style={{animationDelay: `${trackIndex * 0.1}s`}}>
                {/* Track Header */}
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-ink text-white rounded-md flex items-center justify-center flex-shrink-0">
                    <IconComponent className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-muted-foreground">
                      {track.label}
                    </div>
                    <h3 className="text-xl font-bold text-foreground">
                      {track.title}
                    </h3>
                  </div>
                </div>

                {/* Track Content */}
                {track.useSlider ? (
                  <JourneySlider onBookClick={handleBookClick} />
                ) : (
                  <div className="h-full flex flex-col">
                    {track.offerings?.map((offering, offeringIndex) => (
                      <div 
                        key={offeringIndex}
                        className="minimal-card h-full flex flex-col min-h-[440px]"
                      >
                        <h4 className="text-lg font-bold text-foreground mb-2">
                          {offering.name}
                        </h4>
                        <div className="text-xs text-muted-foreground mb-3">
                          {offering.duration}
                        </div>
                        
                        <p className="text-sm leading-relaxed mb-4 text-foreground">
                          {offering.description}
                        </p>
                        
                        {offering.image && (
                          <div className="mb-4 flex-1 flex items-center justify-center overflow-visible relative group">
                            <div className="w-full h-32 rounded-lg overflow-hidden border border-border/50 transition-all duration-300 md:group-hover:scale-[2] md:group-hover:z-50 md:group-hover:shadow-2xl md:cursor-zoom-in bg-background">
                              <img 
                                src={offering.image} 
                                alt={offering.name}
                                className="w-full h-full object-contain"
                                loading="eager"
                              />
                            </div>
                          </div>
                        )}
                        
                        <Button
                          size="lg"
                          variant="default"
                          className="w-full touch-target mt-auto"
                          onClick={() => handleBookClick(offering.program)}
                        >
                          {offering.cta}
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
          );
        })}
      </div>

      {/* Initial Consult Modal */}
      <InitialConsultModal 
        open={consultModalOpen} 
        onOpenChange={setConsultModalOpen}
        preselectedProgram={preselectedProgram}
      />
    </div>
  </section>
);
};

export default ProductLadder;

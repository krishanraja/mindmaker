import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { User, Users, TrendingUp, ChevronDown } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import peerComparisonMatrix from "@/assets/peer-comparison-matrix.png";
import battleTestStrategy from "@/assets/battle-test-strategy.png";
import { InitialConsultModal } from "@/components/InitialConsultModal";
import { useIsMobile } from "@/hooks/use-mobile";
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/components/ui/collapsible";

const JourneySlider = ({ onBookClick, navigate }: { onBookClick: (program: string) => void; navigate: (path: string) => void }) => {
  const [journeyStage, setJourneyStage] = useState([0]);
  
  const offerings = [
    {
      name: "Drop In Builder Session",
      duration: "60 minutes",
      description: "Live session with Krish. Bring one real leadership problem. Leave with an AI friction map, 1-2 draft systems, and written follow-up with prompts.",
      pricing: "$250 → $150 until Jan 1",
      cta: "Book Session",
      program: "builder-session",
      intensity: "Light Touch",
    },
    {
      name: "Curated Weekly Updates",
      duration: "4 weeks async",
      description: "Weekly recommendations and async access to Krish. Stay current on what matters for your context. Build at your own pace.",
      cta: "Learn More",
      link: "/builder-session",
      program: "builder-session",
      intensity: "Steady Build",
    },
    {
      name: "AI Literacy-to-Influence",
      duration: "90 days",
      description: "For senior leaders. Build working AI-enabled systems around your actual week. Leave with a Builder Dossier and implementation plan.",
      cta: "Learn More",
      link: "/builder-sprint",
      program: "builder-sprint",
      intensity: "Deep Dive",
    },
  ];

  const currentIndex = journeyStage[0] <= 33 ? 0 : journeyStage[0] <= 66 ? 1 : 2;
  const currentOffering = offerings[currentIndex];

  return (
    <div className="premium-card h-full flex flex-col transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
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
          <span className={journeyStage[0] > 66 ? "text-foreground font-semibold" : ""}>90 days</span>
        </div>
      </div>

      <div className="flex-1 flex flex-col transition-all duration-300">
        <div className="text-xs text-mint-dark font-bold mb-2">{currentOffering.intensity}</div>
        <h4 className="text-lg font-bold text-foreground mb-2">
          {currentOffering.name}
        </h4>
        <div className="text-xs text-muted-foreground mb-3">
          {currentOffering.duration}
        </div>
        
        {currentOffering.pricing && (
          <div className="text-sm font-bold text-mint mb-3">
            {currentOffering.pricing}
          </div>
        )}
        
        <p className="text-sm leading-relaxed mb-4 text-foreground flex-1">
          {currentOffering.description}
        </p>
        
        <Button 
          size="lg"
          variant="mint"
          className="w-full touch-target font-semibold shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5"
          onClick={() => {
            if ('link' in currentOffering && currentOffering.link) {
              window.scrollTo({ top: 0, behavior: 'smooth' });
              navigate(currentOffering.link);
            } else {
              onBookClick(currentOffering.program);
            }
          }}
        >
          {currentOffering.cta}
        </Button>
      </div>
    </div>
  );
};

const ProductLadder = () => {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const [consultModalOpen, setConsultModalOpen] = useState(false);
  const [preselectedProgram, setPreselectedProgram] = useState<string | undefined>();
  const [expandedTrack, setExpandedTrack] = useState<number | null>(null);

  // Auto-open modal when #book hash is present
  useEffect(() => {
    const handleHashChange = () => {
      if (window.location.hash === '#book') {
        setConsultModalOpen(true);
        // Remove the hash to clean up URL
        window.history.replaceState(null, '', window.location.pathname);
      }
    };

    // Check on mount
    handleHashChange();

    // Listen for hash changes
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

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
          link: "/leadership-lab",
          program: "leadership-lab",
          image: battleTestStrategy,
        },
      ],
    },
    {
      icon: TrendingUp,
      label: "PORTFOLIOS",
      title: "Portfolio-Wide Programs",
      offerings: [
        {
          name: "Portfolio Program",
          duration: "6-12 months",
          description: "For VCs, advisors, consultancies. Help the business leaders you serve become AI literate with a repeatable method and co-branded delivery.",
          cta: "Learn More",
          link: "/portfolio-program",
          program: "portfolio-program",
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
        
        {isMobile ? (
          // Mobile: Collapsible Accordion
          <div className="space-y-4 px-4">
            {tracks.map((track, trackIndex) => {
              const IconComponent = track.icon;
              const isExpanded = expandedTrack === trackIndex;
              
              return (
                <Collapsible
                  key={trackIndex}
                  open={isExpanded}
                  onOpenChange={(open) => setExpandedTrack(open ? trackIndex : null)}
                  className="fade-in-up"
                  style={{animationDelay: `${trackIndex * 0.1}s`}}
                >
                  <CollapsibleTrigger className="w-full">
                    <div className="flex items-center justify-between p-4 bg-card rounded-lg border border-border hover:border-border/60 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-ink text-white rounded-md flex items-center justify-center flex-shrink-0">
                          <IconComponent className="h-5 w-5" />
                        </div>
                        <div className="text-left">
                          <div className="text-xs font-bold text-muted-foreground">
                            {track.label}
                          </div>
                          <h3 className="text-lg font-bold text-foreground">
                            {track.title}
                          </h3>
                        </div>
                      </div>
                      <ChevronDown 
                        className={`h-5 w-5 text-muted-foreground transition-transform duration-200 flex-shrink-0 ${
                          isExpanded ? 'rotate-180' : ''
                        }`}
                      />
                    </div>
                  </CollapsibleTrigger>
                  
                  <CollapsibleContent className="pt-4">
                    {track.useSlider ? (
                      <JourneySlider onBookClick={handleBookClick} navigate={navigate} />
                    ) : (
                      <div className="h-full flex flex-col">
                        {track.offerings?.map((offering, offeringIndex) => (
                        <div 
                            key={offeringIndex}
                            className="minimal-card h-full flex flex-col transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
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
                                <div className="w-full h-32 rounded-lg overflow-hidden border border-border/50 transition-all duration-300 bg-background">
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
                              onClick={() => {
                                if ('link' in offering && offering.link) {
                                  window.scrollTo({ top: 0, behavior: 'smooth' });
                                  navigate(offering.link);
                                } else {
                                  handleBookClick(offering.program);
                                }
                              }}
                            >
                              {offering.cta}
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </CollapsibleContent>
                </Collapsible>
              );
            })}
          </div>
        ) : (
          // Desktop: Original Grid Layout
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
                    <JourneySlider onBookClick={handleBookClick} navigate={navigate} />
                  ) : (
                    <div className="h-full flex flex-col">
                      {track.offerings?.map((offering, offeringIndex) => (
                        <div 
                          key={offeringIndex}
                          className="minimal-card h-full flex flex-col transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
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
                            onClick={() => {
                              if ('link' in offering && offering.link) {
                                window.scrollTo({ top: 0, behavior: 'smooth' });
                                navigate(offering.link);
                              } else {
                                handleBookClick(offering.program);
                              }
                            }}
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
        )}

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

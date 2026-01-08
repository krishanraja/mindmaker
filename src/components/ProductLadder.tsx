import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { User, Users, Compass, ChevronDown, CheckCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { InitialConsultModal } from "@/components/InitialConsultModal";
import { useIsMobile } from "@/hooks/use-mobile";
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/components/ui/collapsible";

const BuildPathSlider = ({ navigate }: { navigate: (path: string) => void }) => {
  const [journeyStage, setJourneyStage] = useState([0]);
  
  const offerings = [
    {
      name: "Drop-In Build Session",
      duration: "60 minutes",
      description: "Live session with Krish. Bring one real problem. Leave with a working prototype, friction map, and prompts you can extend yourself.",
      pricing: "$250 → $150 until Jan 1",
      cta: "Book Session",
      link: "/builder-session",
      intensity: "Quick Win",
    },
    {
      name: "Weekly Build Cadence",
      duration: "4 weeks async",
      description: "Weekly recommendations and async access. Build at your own pace with guidance. Ship something real every week.",
      cta: "Learn More",
      link: "/builder-sprint",
      intensity: "Steady Build",
    },
    {
      name: "90-Day Builder Sprint",
      duration: "90 days",
      description: "Full transformation. Build working AI-enabled systems around your actual week. Leave with a Builder Dossier and the ability to extend everything independently.",
      cta: "Learn How to Build",
      link: "/builder-sprint",
      intensity: "Deep Dive",
    },
  ];

  const currentIndex = journeyStage[0] <= 33 ? 0 : journeyStage[0] <= 66 ? 1 : 2;
  const currentOffering = offerings[currentIndex];

  return (
    <div className="premium-card h-full flex flex-col transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
      <div className="inline-block bg-mint text-ink text-xs font-bold px-3 py-1 rounded-full mb-4 shadow-lg w-fit">
        CHOOSE YOUR DEPTH
      </div>
      
      <div className="mb-6">
        <div className="text-xs font-bold text-muted-foreground mb-2">YOUR COMMITMENT</div>
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
            window.scrollTo({ top: 0, behavior: 'smooth' });
            navigate(currentOffering.link);
          }}
        >
          {currentOffering.cta}
        </Button>
      </div>
    </div>
  );
};

interface TrackCardProps {
  icon: React.ElementType;
  label: string;
  title: string;
  subtitle: string;
  bullets: string[];
  cta: string;
  link: string;
  recommended?: boolean;
}

const TrackCard = ({ icon: IconComponent, label, title, subtitle, bullets, cta, link, recommended }: TrackCardProps) => {
  const navigate = useNavigate();
  
  return (
    <div className={`minimal-card h-full flex flex-col transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${recommended ? 'ring-2 ring-mint/50' : ''}`}>
      {recommended && (
        <div className="inline-block bg-mint text-ink text-xs font-bold px-3 py-1 rounded-full mb-4 shadow-lg w-fit">
          RECOMMENDED
        </div>
      )}
      
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-ink text-white rounded-md flex items-center justify-center flex-shrink-0">
          <IconComponent className="h-5 w-5" />
        </div>
        <div className="text-xs font-bold text-muted-foreground">
          {label}
        </div>
      </div>
      
      <h3 className="text-xl font-bold text-foreground mb-2">
        {title}
      </h3>
      
      <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
        {subtitle}
      </p>
      
      <ul className="space-y-2 mb-6 flex-1">
        {bullets.map((bullet, index) => (
          <li key={index} className="flex items-start gap-2 text-sm text-foreground">
            <CheckCircle className="h-4 w-4 text-mint flex-shrink-0 mt-0.5" />
            <span>{bullet}</span>
          </li>
        ))}
      </ul>
      
      <Button
        size="lg"
        variant="default"
        className="w-full touch-target mt-auto"
        onClick={() => {
          window.scrollTo({ top: 0, behavior: 'smooth' });
          navigate(link);
        }}
      >
        {cta}
      </Button>
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

  const tracks = [
    {
      icon: User,
      label: "HANDS-ON LEADERS",
      title: "Build with AI",
      subtitle: "For operators who want to personally create AI-powered systems, apps, and workflows.",
      bullets: [
        "You actively build GTM systems, tools, or automations",
        "You want AI to expand your creative and strategic output",
        "You're willing to change how you work week to week",
      ],
      cta: "Learn how to build",
      link: "/builder-sprint",
      useSlider: true,
    },
    {
      icon: Compass,
      label: "HANDS-OFF EXECUTIVES",
      title: "Orchestrate AI",
      subtitle: "For executives who want control, clarity, and governance without building tools themselves.",
      bullets: [
        "You delegate execution but own decisions",
        "You need board-level confidence on AI",
        "You want systems you can oversee, not tinker with",
      ],
      cta: "Learn how to orchestrate",
      link: "/builder-session",
      useSlider: false,
    },
    {
      icon: Users,
      label: "EXEC TEAMS",
      title: "Align your leadership team",
      subtitle: "For exec teams that need shared AI decision frameworks, fast.",
      bullets: [
        "Conflicting views on AI risk and value",
        "Vendor noise and pilot confusion",
        "Need a 90-day pilot charter",
      ],
      cta: "Run an exec lab",
      link: "/leadership-lab",
      useSlider: false,
    },
  ];

  return (
    <section className="section-padding bg-background" id="products">
      <div className="container-width">
        <div className="text-center mb-8 sm:mb-12 px-4 sm:px-0">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6">
            How do you want to work with AI?
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-3xl mx-auto mb-4">
            Two ways to lead with AI, plus team alignment for exec teams ready to commit.
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
                          <p className="text-xs text-muted-foreground mt-1">
                            {track.subtitle}
                          </p>
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
                      <BuildPathSlider navigate={navigate} />
                    ) : (
                      <TrackCard
                        icon={track.icon}
                        label={track.label}
                        title={track.title}
                        subtitle={track.subtitle}
                        bullets={track.bullets}
                        cta={track.cta}
                        link={track.link}
                      />
                    )}
                  </CollapsibleContent>
                </Collapsible>
              );
            })}
          </div>
        ) : (
          // Desktop: Grid Layout
          <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto px-4 sm:px-0">
            {tracks.map((track, trackIndex) => {
              return (
                <div key={trackIndex} className="fade-in-up flex flex-col" style={{animationDelay: `${trackIndex * 0.1}s`}}>
                  {track.useSlider ? (
                    <>
                      {/* Track Header for Slider */}
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-ink text-white rounded-md flex items-center justify-center flex-shrink-0">
                          <track.icon className="h-5 w-5" />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-muted-foreground">
                            {track.label}
                          </div>
                          <h3 className="text-xl font-bold text-foreground">
                            {track.title}
                          </h3>
                          <p className="text-sm text-muted-foreground mt-1">
                            {track.subtitle}
                          </p>
                        </div>
                      </div>
                      <BuildPathSlider navigate={navigate} />
                    </>
                  ) : (
                    <TrackCard
                      icon={track.icon}
                      label={track.label}
                      title={track.title}
                      subtitle={track.subtitle}
                      bullets={track.bullets}
                      cta={track.cta}
                      link={track.link}
                    />
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

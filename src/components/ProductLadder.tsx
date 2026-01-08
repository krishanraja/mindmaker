import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { User, Users, Compass, CheckCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { InitialConsultModal } from "@/components/InitialConsultModal";
import { useIsMobile } from "@/hooks/use-mobile";

type PathType = "build" | "orchestrate";

interface Offering {
  depth: string;
  name: string;
  duration: string;
  description: string;
  pricing?: string;
  cta: string;
  intensity: string;
}

const buildOfferings: Offering[] = [
  {
    depth: "1hr",
    name: "Drop-In Build Session",
    duration: "60 minutes",
    description: "Live session with Krish. Bring one real problem. Leave with a working prototype, friction map, and prompts you can extend yourself.",
    pricing: "$250 → $150 until Jan 1",
    cta: "Book Build Session",
    intensity: "Quick Win",
  },
  {
    depth: "4wk",
    name: "Weekly Build Cadence",
    duration: "4 weeks async",
    description: "Weekly recommendations and async access. Build at your own pace with guidance. Ship something real every week.",
    cta: "Learn More",
    intensity: "Steady Build",
  },
  {
    depth: "90d",
    name: "90-Day Builder Sprint",
    duration: "90 days",
    description: "Full transformation. Build working AI-enabled systems around your actual week. Leave with a Builder Dossier and the ability to extend everything independently.",
    cta: "Learn How to Build",
    intensity: "Deep Dive",
  },
];

const orchestrateOfferings: Offering[] = [
  {
    depth: "1hr",
    name: "Executive Decision Review",
    duration: "60 minutes",
    description: "A decision review session for leaders who delegate execution but own outcomes. Leave with frameworks to evaluate AI initiatives and direct teams effectively.",
    pricing: "$250 → $150 until Jan 1",
    cta: "Book Decision Review",
    intensity: "Quick Clarity",
  },
  {
    depth: "4wk",
    name: "Weekly Orchestration Cadence",
    duration: "4 weeks async",
    description: "Weekly check-ins on AI governance and decision-making. Build oversight systems at your own pace. Gain control without building tools yourself.",
    cta: "Learn More",
    intensity: "Steady Control",
  },
  {
    depth: "90d",
    name: "90-Day Orchestration Program",
    duration: "90 days",
    description: "Full executive AI governance program. Build decision frameworks, oversight models, and evaluation criteria. Leave with board-level confidence on AI.",
    cta: "Learn How to Orchestrate",
    intensity: "Full Governance",
  },
];

const pathInfo = {
  build: {
    icon: User,
    label: "HANDS-ON LEADERS",
    title: "Build with AI",
    subtitle: "For operators who want to personally create AI-powered systems, apps, and workflows.",
    bullets: [
      "You actively build GTM systems, tools, or automations",
      "You want AI to expand your creative and strategic output",
      "You're willing to change how you work week to week",
    ],
    offerings: buildOfferings,
    route: "/builder-sprint",
  },
  orchestrate: {
    icon: Compass,
    label: "HANDS-OFF EXECUTIVES",
    title: "Orchestrate AI",
    subtitle: "For executives who want control, clarity, and governance without building tools themselves.",
    bullets: [
      "You delegate execution but own decisions",
      "You need board-level confidence on AI",
      "You want systems you can oversee, not tinker with",
    ],
    offerings: orchestrateOfferings,
    route: "/builder-session",
  },
};

const PathSlider = ({ 
  path, 
  navigate 
}: { 
  path: PathType; 
  navigate: (path: string) => void;
}) => {
  const [journeyStage, setJourneyStage] = useState([0]);
  const info = pathInfo[path];
  const offerings = info.offerings;

  const currentIndex = journeyStage[0] <= 33 ? 0 : journeyStage[0] <= 66 ? 1 : 2;
  const currentOffering = offerings[currentIndex];
  const depthParam = currentOffering.depth;

  return (
    <div className="premium-card flex flex-col transition-all duration-300">
      {/* Slider Section */}
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

      {/* Offering Details */}
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
            navigate(`${info.route}?depth=${depthParam}`);
          }}
        >
          {currentOffering.cta}
        </Button>
      </div>
    </div>
  );
};

const TeamCard = ({ navigate }: { navigate: (path: string) => void }) => {
  return (
    <div className="minimal-card flex flex-col transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-ink text-white rounded-md flex items-center justify-center flex-shrink-0">
          <Users className="h-5 w-5" />
        </div>
        <div className="text-xs font-bold text-muted-foreground">
          EXEC TEAMS
        </div>
      </div>
      
      <h3 className="text-xl font-bold text-foreground mb-2">
        Align your leadership team
      </h3>
      
      <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
        For exec teams that need shared AI decision frameworks, fast.
      </p>
      
      <ul className="space-y-2 mb-6 flex-1">
        <li className="flex items-start gap-2 text-sm text-foreground">
          <CheckCircle className="h-4 w-4 text-mint flex-shrink-0 mt-0.5" />
          <span>Conflicting views on AI risk and value</span>
        </li>
        <li className="flex items-start gap-2 text-sm text-foreground">
          <CheckCircle className="h-4 w-4 text-mint flex-shrink-0 mt-0.5" />
          <span>Vendor noise and pilot confusion</span>
        </li>
        <li className="flex items-start gap-2 text-sm text-foreground">
          <CheckCircle className="h-4 w-4 text-mint flex-shrink-0 mt-0.5" />
          <span>Need a 90-day pilot charter</span>
        </li>
      </ul>
      
      <Button
        size="lg"
        variant="default"
        className="w-full touch-target mt-auto"
        onClick={() => {
          window.scrollTo({ top: 0, behavior: 'smooth' });
          navigate("/leadership-lab");
        }}
      >
        Run an exec lab
      </Button>
    </div>
  );
};

const ProductLadder = () => {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const [consultModalOpen, setConsultModalOpen] = useState(false);
  const [preselectedProgram, setPreselectedProgram] = useState<string | undefined>();
  const [selectedPath, setSelectedPath] = useState<PathType>("build");

  // Auto-open modal when #book hash is present
  useEffect(() => {
    const handleHashChange = () => {
      if (window.location.hash === '#book') {
        setConsultModalOpen(true);
        window.history.replaceState(null, '', window.location.pathname);
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const currentPathInfo = pathInfo[selectedPath];
  const PathIcon = currentPathInfo.icon;

  return (
    <section className="section-padding bg-background" id="products">
      <div className="container-width">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12 px-4 sm:px-0">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6">
            How do you want to work with AI?
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-3xl mx-auto">
            Choose your path, then select your commitment level.
          </p>
        </div>

        {/* Main Content: Tabs + Slider */}
        <div className="max-w-2xl mx-auto px-4 sm:px-0 mb-12">
          {/* Tab Buttons */}
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setSelectedPath("build")}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-semibold transition-all duration-200 ${
                selectedPath === "build"
                  ? "bg-ink text-white shadow-md"
                  : "bg-card border border-border text-foreground hover:border-ink/30"
              }`}
            >
              <User className="h-4 w-4" />
              <span>Build with AI</span>
            </button>
            <button
              onClick={() => setSelectedPath("orchestrate")}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-semibold transition-all duration-200 ${
                selectedPath === "orchestrate"
                  ? "bg-ink text-white shadow-md"
                  : "bg-card border border-border text-foreground hover:border-ink/30"
              }`}
            >
              <Compass className="h-4 w-4" />
              <span>Orchestrate AI</span>
            </button>
          </div>

          {/* Path Info Card */}
          <div className="minimal-card mb-6 fade-in-up">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-ink text-white rounded-md flex items-center justify-center flex-shrink-0">
                <PathIcon className="h-5 w-5" />
              </div>
              <div>
                <div className="text-xs font-bold text-muted-foreground">
                  {currentPathInfo.label}
                </div>
                <h3 className="text-xl font-bold text-foreground">
                  {currentPathInfo.title}
                </h3>
              </div>
            </div>
            
            <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
              {currentPathInfo.subtitle}
            </p>
            
            <ul className="space-y-2">
              {currentPathInfo.bullets.map((bullet, index) => (
                <li key={index} className="flex items-start gap-2 text-sm text-foreground">
                  <CheckCircle className="h-4 w-4 text-mint flex-shrink-0 mt-0.5" />
                  <span>{bullet}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Slider */}
          <PathSlider path={selectedPath} navigate={navigate} />
        </div>

        {/* Team Section - Separate Below */}
        <div className="max-w-md mx-auto px-4 sm:px-0">
          <div className="text-center mb-6">
            <p className="text-sm text-muted-foreground">
              Need to align your entire leadership team first?
            </p>
          </div>
          <TeamCard navigate={navigate} />
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

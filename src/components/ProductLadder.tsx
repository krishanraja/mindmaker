import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { User, Users, Compass, CheckCircle, ArrowLeft } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { InitialConsultModal } from "@/components/InitialConsultModal";
import { motion, AnimatePresence } from "framer-motion";
import { PromoBanner } from "@/components/PromoBanner";
import { useSessionData } from "@/contexts/SessionDataContext";
import { useIsMobile } from "@/hooks/use-mobile";

type AudienceType = "individual" | "team";
type PathType = "build" | "orchestrate";

interface Offering {
  depth: string;
  name: string;
  duration: string;
  description: string;
  cta: string;
  intensity: string;
}

// Individual offerings
const buildOfferings: Offering[] = [
  {
    depth: "1hr",
    name: "Drop-In Build Session",
    duration: "60 minutes",
    description: "Live session with Krish. Bring one real problem. Leave with a working prototype, friction map, and prompts you can extend yourself.",
    cta: "Book Build Session",
    intensity: "Quick Win",
  },
  {
    depth: "4wk",
    name: "Weekly Build Cadence",
    duration: "4 weeks async",
    description: "Weekly recommendations and async access. Build at your own pace with guidance. Ship something real every week.",
    cta: "Book Session",
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
    cta: "Book Decision Review",
    intensity: "Quick Clarity",
  },
  {
    depth: "4wk",
    name: "Weekly Orchestration Cadence",
    duration: "4 weeks async",
    description: "Weekly check-ins on AI governance and decision-making. Build oversight systems at your own pace. Gain control without building tools yourself.",
    cta: "Book Session",
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

// Team offerings - 3hr / 4wk / 90d format
const teamOfferings: Offering[] = [
  {
    depth: "3hr",
    name: "Team Alignment Session",
    duration: "3 hours",
    description: "Drop-in session to align your leadership team and define your AI strategy. Surface conflicts, agree on priorities, leave with clarity on next steps.",
    cta: "Book Alignment Session",
    intensity: "Quick Alignment",
  },
  {
    depth: "4wk",
    name: "Accelerated Exec Lab",
    duration: "4 weeks",
    description: "Shortened executive team lab. Build shared decision frameworks and commit to a pilot with owner and gates. Fast-track your team's AI alignment.",
    cta: "Book Session",
    intensity: "Focused Sprint",
  },
  {
    depth: "90d",
    name: "Full Executive Lab",
    duration: "90 days",
    description: "Complete executive team transformation. Align on AI, run real decisions through new workflows, leave with a board-ready charter and 90-day pilot commitment.",
    cta: "Start Full Lab",
    intensity: "Full Transformation",
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

const teamInfo = {
  icon: Users,
  label: "EXECUTIVE TEAMS",
  title: "Align Your Leadership Team",
  subtitle: "For exec teams that need shared AI decision frameworks and alignment, fast.",
  bullets: [
    "Conflicting views on AI risk and value across leadership",
    "Vendor noise and pilot confusion slowing decisions",
    "Need a clear 90-day pilot charter with owner and gates",
  ],
  offerings: teamOfferings,
  route: "/leadership-lab",
};

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.05,
    },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.2 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 24,
    },
  },
  exit: {
    opacity: 0,
    y: -10,
    scale: 0.98,
    transition: { duration: 0.2 },
  },
};

const slideVariants = {
  hidden: { opacity: 0, x: 20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 24,
    },
  },
  exit: {
    opacity: 0,
    x: -20,
    transition: { duration: 0.15 },
  },
};

// Audience Selection Component
const AudienceSelection = ({
  onSelect,
}: {
  onSelect: (audience: AudienceType) => void;
}) => {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="max-w-2xl mx-auto px-4 sm:px-0"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Individual Card */}
        <motion.button
          variants={cardVariants}
          onClick={() => onSelect("individual")}
          className="group relative bg-card border-2 border-border rounded-xl p-6 sm:p-8 text-left transition-all duration-300 hover:border-ink/40 hover:shadow-lg hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="flex flex-col h-full min-h-[180px] sm:min-h-[200px]">
            <div className="w-12 h-12 bg-ink text-white rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
              <User className="h-6 w-6" />
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-2">
              Level Up Yourself
            </h3>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed flex-1">
              Build or orchestrate AI systems personally. Grow your own capabilities.
            </p>
            <div className="mt-4 flex items-center gap-2 text-sm font-semibold text-ink group-hover:gap-3 transition-all duration-300">
              <span>Choose your path</span>
              <ArrowLeft className="h-4 w-4 rotate-180" />
            </div>
          </div>
        </motion.button>

        {/* Team Card */}
        <motion.button
          variants={cardVariants}
          onClick={() => onSelect("team")}
          className="group relative bg-card border-2 border-border rounded-xl p-6 sm:p-8 text-left transition-all duration-300 hover:border-ink/40 hover:shadow-lg hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="flex flex-col h-full min-h-[180px] sm:min-h-[200px]">
            <div className="w-12 h-12 bg-ink text-white rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
              <Users className="h-6 w-6" />
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-2">
              Align Your Team
            </h3>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed flex-1">
              Get your executive team aligned on AI strategy and decision frameworks.
            </p>
            <div className="mt-4 flex items-center gap-2 text-sm font-semibold text-ink group-hover:gap-3 transition-all duration-300">
              <span>Choose your commitment</span>
              <ArrowLeft className="h-4 w-4 rotate-180" />
            </div>
          </div>
        </motion.button>
      </div>
    </motion.div>
  );
};

// Commitment Slider Component (reusable for both paths)
const CommitmentSlider = ({
  offerings,
  sliderLabels,
  route,
  navigate,
  onCTAClick,
  audienceType,
  pathType,
  learnMoreLink,
}: {
  offerings: Offering[];
  sliderLabels: [string, string, string];
  route: string;
  navigate: (path: string) => void;
  onCTAClick: (commitmentLevel: string) => void;
  audienceType: "individual" | "team";
  pathType?: "build" | "orchestrate";
  learnMoreLink: string;
}) => {
  const [journeyStage, setJourneyStage] = useState([0]);
  const isMobile = useIsMobile();

  const currentIndex = journeyStage[0] <= 33 ? 0 : journeyStage[0] <= 66 ? 1 : 2;
  const currentOffering = offerings[currentIndex];
  const depthParam = currentOffering.depth;

  return (
    <motion.div
      variants={cardVariants}
      className="premium-card flex flex-col transition-all duration-300"
    >
      {/* Slider Section */}
      <div className="mb-6">
        <div className="text-xs font-bold text-muted-foreground mb-3">YOUR COMMITMENT</div>
        <Slider
          value={journeyStage}
          onValueChange={setJourneyStage}
          max={100}
          step={1}
          className="mb-4"
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span className={journeyStage[0] <= 33 ? "text-foreground font-semibold" : ""}>
            {sliderLabels[0]}
          </span>
          <span className={journeyStage[0] > 33 && journeyStage[0] <= 66 ? "text-foreground font-semibold" : ""}>
            {sliderLabels[1]}
          </span>
          <span className={journeyStage[0] > 66 ? "text-foreground font-semibold" : ""}>
            {sliderLabels[2]}
          </span>
        </div>
      </div>

      {/* Promo Banner */}
      <PromoBanner compact className="mb-6" />

      {/* Offering Details with AnimatePresence for smooth transitions */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="flex-1 flex flex-col"
        >
          <div className="text-xs text-mint-dark font-bold mb-2">{currentOffering.intensity}</div>
          <h4 className="text-lg font-bold text-foreground mb-2">
            {currentOffering.name}
          </h4>
          <div className="text-xs text-muted-foreground mb-3">
            {currentOffering.duration}
          </div>

          <p className="text-sm leading-relaxed mb-4 text-foreground flex-1 min-h-[60px]">
            {currentOffering.description}
          </p>

          <div className="flex gap-2">
            <Button
              size="lg"
              variant="mint"
              className="flex-1 touch-target font-semibold shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5"
              onClick={() => onCTAClick(depthParam)}
            >
              {isMobile ? "Book" : currentOffering.cta}
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="touch-target font-semibold"
              onClick={() => navigate(learnMoreLink)}
            >
              Learn More
            </Button>
          </div>
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
};

// Individual Path Component
const IndividualPath = ({
  onBack,
  navigate,
  onCTAClick,
}: {
  onBack: () => void;
  navigate: (path: string) => void;
  onCTAClick: (commitmentLevel: string, pathType: "build" | "orchestrate") => void;
}) => {
  const [selectedPath, setSelectedPath] = useState<PathType>("build");
  const isMobile = useIsMobile();
  const currentPathInfo = pathInfo[selectedPath];
  const PathIcon = currentPathInfo.icon;

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="max-w-2xl mx-auto px-4 sm:px-0"
    >
      {/* Back Button */}
      <motion.button
        variants={cardVariants}
        onClick={onBack}
        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors group"
      >
        <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
        <span>Back to selection</span>
      </motion.button>

      {/* Tab Buttons */}
      <motion.div variants={cardVariants} className="flex gap-2 mb-6">
        <button
          onClick={() => setSelectedPath("build")}
          className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-semibold transition-all duration-200 ${
            selectedPath === "build"
              ? "bg-ink text-white shadow-md"
              : "bg-card border border-border text-foreground hover:border-ink/30"
          }`}
        >
          <User className="h-4 w-4" />
          <span>{isMobile ? "Build" : "Build with AI"}</span>
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
          <span>{isMobile ? "Orchestrate" : "Orchestrate AI"}</span>
        </button>
      </motion.div>

      {/* Path Info Card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={selectedPath}
          variants={slideVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="minimal-card mb-6"
        >
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
        </motion.div>
      </AnimatePresence>

      {/* Slider */}
      <CommitmentSlider
        offerings={currentPathInfo.offerings}
        sliderLabels={["1 hr", "4 weeks", "90 days"]}
        route={currentPathInfo.route}
        navigate={navigate}
        onCTAClick={(commitmentLevel) => onCTAClick(commitmentLevel, selectedPath)}
        audienceType="individual"
        pathType={selectedPath}
        learnMoreLink={`/individual?path=${selectedPath}`}
      />
    </motion.div>
  );
};

// Team Path Component
const TeamPath = ({
  onBack,
  navigate,
  onCTAClick,
}: {
  onBack: () => void;
  navigate: (path: string) => void;
  onCTAClick: (commitmentLevel: string) => void;
}) => {
  const TeamIcon = teamInfo.icon;

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="max-w-2xl mx-auto px-4 sm:px-0"
    >
      {/* Back Button */}
      <motion.button
        variants={cardVariants}
        onClick={onBack}
        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors group"
      >
        <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
        <span>Back to selection</span>
      </motion.button>

      {/* Team Info Card */}
      <motion.div variants={cardVariants} className="minimal-card mb-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-ink text-white rounded-md flex items-center justify-center flex-shrink-0">
            <TeamIcon className="h-5 w-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-muted-foreground">
              {teamInfo.label}
            </div>
            <h3 className="text-xl font-bold text-foreground">
              {teamInfo.title}
            </h3>
          </div>
        </div>

        <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
          {teamInfo.subtitle}
        </p>

        <ul className="space-y-2">
          {teamInfo.bullets.map((bullet, index) => (
            <li key={index} className="flex items-start gap-2 text-sm text-foreground">
              <CheckCircle className="h-4 w-4 text-mint flex-shrink-0 mt-0.5" />
              <span>{bullet}</span>
            </li>
          ))}
        </ul>
      </motion.div>

      {/* Team Slider */}
      <CommitmentSlider
        offerings={teamInfo.offerings}
        sliderLabels={["3 hr", "4 weeks", "90 days"]}
        route={teamInfo.route}
        navigate={navigate}
        onCTAClick={onCTAClick}
        audienceType="team"
        learnMoreLink="/team"
      />
    </motion.div>
  );
};

// Main Component
const ProductLadder = () => {
  const navigate = useNavigate();
  const { setQualificationData } = useSessionData();
  const [consultModalOpen, setConsultModalOpen] = useState(false);
  const [preselectedProgram, setPreselectedProgram] = useState<string | undefined>();
  const [commitmentLevel, setCommitmentLevel] = useState<string | undefined>();
  const [audienceType, setAudienceType] = useState<"individual" | "team" | undefined>();
  const [pathType, setPathType] = useState<"build" | "orchestrate" | undefined>();
  const [audience, setAudience] = useState<AudienceType | null>(null);

  // Auto-open modal when #book hash is present
  useEffect(() => {
    const handleHashChange = () => {
      if (window.location.hash === "#book") {
        setConsultModalOpen(true);
        window.history.replaceState(null, "", window.location.pathname);
      }
    };

    handleHashChange();
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  const handleBack = () => {
    setAudience(null);
  };

  const handleIndividualCTAClick = (commitment: string, path: "build" | "orchestrate") => {
    const qualificationData = {
      preselectedProgram: path,
      commitmentLevel: commitment,
      audienceType: "individual" as const,
      pathType: path,
    };
    setCommitmentLevel(commitment);
    setAudienceType("individual");
    setPathType(path);
    setPreselectedProgram(path);
    setQualificationData(qualificationData);
    setConsultModalOpen(true);
  };

  const handleTeamCTAClick = (commitment: string) => {
    const qualificationData = {
      preselectedProgram: "team",
      commitmentLevel: commitment,
      audienceType: "team" as const,
      pathType: undefined,
    };
    setCommitmentLevel(commitment);
    setAudienceType("team");
    setPathType(undefined);
    setPreselectedProgram("team");
    setQualificationData(qualificationData);
    setConsultModalOpen(true);
  };

  return (
    <section className="section-padding bg-background" id="products">
      <div className="container-width">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12 px-4 sm:px-0">
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6"
          >
            {audience === null
              ? "Who is this for?"
              : audience === "individual"
              ? "How do you want to work with AI?"
              : "Choose your team commitment"}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-3xl mx-auto"
          >
            {audience === null
              ? "Select whether you're leveling up yourself or aligning your team."
              : audience === "individual"
              ? "Choose your path, then select your commitment level."
              : "Select how deep you want to go with your leadership team."}
          </motion.p>
        </div>

        {/* Main Content with AnimatePresence */}
        <AnimatePresence mode="wait">
          {audience === null && (
            <AudienceSelection key="audience" onSelect={setAudience} />
          )}
          {audience === "individual" && (
            <IndividualPath key="individual" onBack={handleBack} navigate={navigate} onCTAClick={handleIndividualCTAClick} />
          )}
          {audience === "team" && (
            <TeamPath key="team" onBack={handleBack} navigate={navigate} onCTAClick={handleTeamCTAClick} />
          )}
        </AnimatePresence>

        {/* Initial Consult Modal */}
        <InitialConsultModal
          open={consultModalOpen}
          onOpenChange={setConsultModalOpen}
          preselectedProgram={preselectedProgram}
          commitmentLevel={commitmentLevel}
          audienceType={audienceType}
          pathType={pathType}
        />
      </div>
    </section>
  );
};

export default ProductLadder;

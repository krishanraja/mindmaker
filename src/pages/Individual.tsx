import { useState, useEffect } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { User, Compass, CheckCircle, AlertCircle, Calendar, Zap } from "lucide-react";
import { SEO } from "@/components/SEO";
import { ModuleExplorer } from "@/components/ModuleExplorer";
import { useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { PromoBanner } from "@/components/PromoBanner";
import { JourneyInfoCarousel, type JourneyCard } from "@/components/JourneyInfoCarousel";
import { FloatingBookCTA } from "@/components/FloatingBookCTA";
import { InitialConsultModal } from "@/components/InitialConsultModal";
import { motion, AnimatePresence } from "framer-motion";

type PathType = "build" | "orchestrate";
type DepthType = "1hr" | "4wk" | "90d";

// Build path content
const buildContent = {
  "1hr": {
    badge: "QUICK WIN",
    title: "Drop-In Build Session",
    duration: "60 minutes",
    icon: Zap,
    headline: "Bring one real problem. Leave with a working prototype.",
    description: "A live session with Krish where you build something real. Bring your biggest friction point and leave with a working prototype, friction map, and prompts you can extend yourself.",
    qualifier: {
      title: "This is for hands-on leaders who want a quick win.",
      body: "If you have one specific problem you want to solve with AI and you're ready to build, this session will get you unstuck fast.",
      outcome: "You will leave with something working, not a deck.",
    },
    deliverables: [
      "A working prototype or system built live in the session",
      "A friction map showing where AI can remove bottlenecks",
      "Prompts and templates you can extend yourself",
      "Written follow-up with next steps",
    ],
    outcomes: [
      "One real problem solved with a working solution",
      "Clear understanding of how to extend what you built",
      "Confidence to tackle the next build yourself",
    ],
  },
  "4wk": {
    badge: "STEADY BUILD",
    title: "Weekly Build Cadence",
    duration: "4 weeks async",
    icon: Calendar,
    headline: "Ship something real every week with guidance.",
    description: "Weekly recommendations and async access to Krish. Build at your own pace with expert guidance. Each week you ship something real and get feedback.",
    qualifier: {
      title: "This is for hands-on leaders who want steady progress.",
      body: "If you want to build consistently but need guidance and accountability, this cadence keeps you shipping without the intensity of a full sprint.",
      outcome: "You will ship 4 real things in 4 weeks.",
    },
    deliverables: [
      "Weekly personalized recommendations based on your context",
      "Async access to Krish for questions and feedback",
      "4 shipped builds over 4 weeks",
      "A growing library of prompts and systems you created",
    ],
    outcomes: [
      "4 working systems or workflows you built yourself",
      "A repeatable method for building with AI",
      "Momentum and confidence to continue independently",
    ],
  },
  "90d": {
    badge: "DEEP DIVE",
    title: "90-Day Builder Sprint",
    duration: "90 days",
    icon: Calendar,
    headline: "Full transformation. Build systems that change how you work.",
    description: "In 90 days you go from talking about AI to personally building and running a set of working systems that support how you think, decide and lead.",
    qualifier: {
      title: "This is for hands-on leaders ready for transformation.",
      body: "If you want to fundamentally change how you work with AI and are willing to invest the time, this sprint will transform your capabilities.",
      outcome: "You will build. You will change your habits. You will leave able to independently build your next system without me.",
    },
    deliverables: [
      "4 live build sessions with Krish where you do the building",
      "A written Builder Dossier with workflows, prompts and guardrails you created",
      "Simple metrics that track time saved, cycle time and decision quality",
      "The knowledge to extend and modify everything yourself going forward",
    ],
    outcomes: [
      "3 to 5 live workflows or systems you built around your actual week",
      "A personal prompt and system library tailored to how you think",
      "The ability to extend everything independently without me",
      "A 90 day plan to roll this out to your team",
      "A clear story you can tell the board about where this is going",
    ],
    weeks: [
      {
        week: "Week 0",
        title: "Intake",
        description: "Short form and a 45 minute call to map your current week, your 2026 targets and your main constraints.",
      },
      {
        week: "Week 1",
        title: "The Mirror",
        description: "You map the real work you do: writing, decisions, coaching, alignment, board prep, crisis moments. You see where time is really going and where AI can act as a thinking partner.",
      },
      {
        week: "Week 2",
        title: "The Systems",
        description: "You design and build your first set of support systems. Examples: briefing and decision templates, weekly review packs, board narrative engines. You build these yourself with guidance.",
      },
      {
        week: "Week 3",
        title: "The Team",
        description: "You bring 1 to 3 of your key people into the picture. You run one live meeting or decision using the new systems. You capture what worked, what broke and what needs guardrails.",
      },
      {
        week: "Week 4",
        title: "The Charter",
        description: "You write a short charter and operating guide. You finish with a visible change in how you run your week and a draft playbook for your team that you can extend independently.",
      },
    ],
  },
};

// Orchestrate path content
const orchestrateContent = {
  "1hr": {
    badge: "QUICK CLARITY",
    title: "Executive Decision Review",
    duration: "60 minutes",
    icon: Zap,
    headline: "Gain control over AI without building tools yourself.",
    description: "A decision review session for leaders who delegate execution but own outcomes. Leave with frameworks to evaluate AI initiatives and direct teams effectively.",
    qualifier: {
      title: "This is for hands-off leaders who need quick clarity.",
      body: "If you have AI decisions to make and need a clear framework fast, this session gives you control without requiring you to become technical.",
      outcome: "You will leave with decision frameworks, not a to-do list to build things.",
    },
    deliverables: [
      "Decision frameworks for AI investment and prioritization",
      "Oversight models for evaluating AI initiatives",
      "Questions and controls you can use with teams and vendors",
      "Written follow-up with evaluation criteria",
    ],
    outcomes: [
      "A clear view of where AI should and should not be used in your context",
      "Confidence to evaluate vendors and initiatives",
      "The ability to direct others effectively on AI",
    ],
    howItWorks: [
      {
        step: "1. Short Intake",
        description: "Fill out a brief form about your current AI decisions and governance challenges.",
      },
      {
        step: "2. Decision Review (60 min)",
        description: "Work directly with Krish to review your AI landscape, evaluate initiatives, and build frameworks for oversight and control.",
      },
      {
        step: "3. Written Follow-Up",
        description: "Receive a written summary with decision frameworks, evaluation criteria, and questions you can use with your teams and vendors.",
      },
    ],
  },
  "4wk": {
    badge: "STEADY CONTROL",
    title: "Weekly Orchestration Cadence",
    duration: "4 weeks async",
    icon: Calendar,
    headline: "Build oversight systems at your own pace.",
    description: "Weekly check-ins on AI governance and decision-making. Build oversight systems at your own pace. Gain control without building tools yourself.",
    qualifier: {
      title: "This is for hands-off leaders who want steady governance.",
      body: "If you need to build AI oversight systems but want to do it methodically over time, this cadence gives you control without the intensity of a full program.",
      outcome: "You will build governance frameworks, not apps.",
    },
    deliverables: [
      "Weekly governance check-ins and recommendations",
      "Async access to Krish for decision support",
      "Evolving oversight frameworks tailored to your context",
      "Vendor evaluation criteria and questions",
    ],
    outcomes: [
      "A complete AI governance framework for your organization",
      "Clear criteria for evaluating AI investments",
      "Confidence to lead AI discussions at board level",
      "Systems you can oversee, not tinker with",
    ],
    howItWorks: [
      {
        step: "1. Initial Assessment",
        description: "Map your current AI landscape, decisions pending, and governance gaps.",
      },
      {
        step: "2. Weekly Check-ins",
        description: "Each week we focus on a different aspect: vendor evaluation, risk assessment, investment criteria, team direction.",
      },
      {
        step: "3. Ongoing Support",
        description: "Async access for questions as they arise. Real decisions, real guidance.",
      },
    ],
  },
  "90d": {
    badge: "FULL GOVERNANCE",
    title: "90-Day Orchestration Program",
    duration: "90 days",
    icon: Calendar,
    headline: "Full executive AI governance program.",
    description: "Build decision frameworks, oversight models, and evaluation criteria. Leave with board-level confidence on AI and the ability to direct your organization's AI strategy.",
    qualifier: {
      title: "This is for hands-off leaders ready for full governance.",
      body: "If you need to build comprehensive AI governance for your organization and want to do it right, this program gives you everything you need to lead with confidence.",
      outcome: "You will leave with complete governance frameworks and board-level confidence.",
    },
    deliverables: [
      "4 live sessions with Krish focused on governance and decision-making",
      "Complete AI governance framework for your organization",
      "Vendor evaluation playbook with criteria and questions",
      "Board-ready materials on AI strategy and risk",
      "Team direction frameworks for delegating AI work",
    ],
    outcomes: [
      "A complete AI governance framework you can implement",
      "Board-level confidence on AI strategy and risk",
      "Clear criteria for all AI investment decisions",
      "The ability to direct teams and vendors effectively",
      "A 90-day implementation plan for your governance systems",
    ],
    phases: [
      {
        phase: "Phase 1",
        title: "Assessment",
        description: "Map your current AI landscape, pending decisions, governance gaps, and organizational readiness.",
      },
      {
        phase: "Phase 2",
        title: "Frameworks",
        description: "Build decision frameworks for AI investment, risk assessment, and vendor evaluation.",
      },
      {
        phase: "Phase 3",
        title: "Implementation",
        description: "Create team direction frameworks, board materials, and oversight systems.",
      },
      {
        phase: "Phase 4",
        title: "Operationalize",
        description: "Put governance into practice. Review real decisions. Refine based on what works.",
      },
    ],
  },
};

const Individual = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedPath, setSelectedPath] = useState<PathType>((searchParams.get("path") as PathType) || "build");
  const [commitmentSlider, setCommitmentSlider] = useState<number[]>([0]);
  const [consultModalOpen, setConsultModalOpen] = useState(false);

  // Initialize slider based on URL commitment param or default to 0
  useEffect(() => {
    const commitment = searchParams.get("commitment");
    if (commitment === "1hr") {
      setCommitmentSlider([0]);
    } else if (commitment === "4wk") {
      setCommitmentSlider([50]);
    } else if (commitment === "90d") {
      setCommitmentSlider([100]);
    }
  }, [searchParams]);

  // Listen for openConsultModal event from Navigation component
  useEffect(() => {
    const handleOpenConsultModal = () => {
      setConsultModalOpen(true);
    };
    
    window.addEventListener('openConsultModal', handleOpenConsultModal);
    return () => window.removeEventListener('openConsultModal', handleOpenConsultModal);
  }, []);

  // Calculate current depth from slider
  const currentIndex = commitmentSlider[0] <= 33 ? 0 : commitmentSlider[0] <= 66 ? 1 : 2;
  const depthOptions: DepthType[] = ["1hr", "4wk", "90d"];
  const depth = depthOptions[currentIndex];
  
  // Get content based on path and depth
  const content = selectedPath === "build" ? buildContent[depth] : orchestrateContent[depth];
  const IconComponent = content.icon;

  // Update URL when slider changes
  const handleSliderChange = (value: number[]) => {
    setCommitmentSlider(value);
    const newIndex = value[0] <= 33 ? 0 : value[0] <= 66 ? 1 : 2;
    const newDepth = depthOptions[newIndex];
    setSearchParams({ path: selectedPath, commitment: newDepth });
  };

  // Update URL when path changes
  const handlePathChange = (newPath: PathType) => {
    setSelectedPath(newPath);
    setSearchParams({ path: newPath, commitment: depth });
  };

  const handleCTAClick = () => {
    setConsultModalOpen(true);
  };

  const seoData = {
    title: `Individual AI Programs - ${selectedPath === "build" ? "Build" : "Orchestrate"} with AI`,
    description: content.description,
    canonical: `/individual?path=${selectedPath}&commitment=${depth}`,
    keywords: selectedPath === "build" 
      ? "AI builder program, hands-on AI training, AI systems building, build with AI"
      : "AI executive consultation, AI governance, AI decision framework, executive AI control",
  };

  return (
    <main className="min-h-screen bg-background">
      <SEO {...seoData} />
      <Navigation />
      
      <section className="section-padding-nav">
        <div className="container-width max-w-5xl">
          {/* Path Tabs */}
          <div className="flex justify-center gap-2 mb-8">
            <Button
              variant={selectedPath === "build" ? "default" : "outline"}
              size="sm"
              onClick={() => handlePathChange("build")}
              className="min-w-[140px]"
            >
              <User className="h-4 w-4 mr-2" />
              Build with AI
            </Button>
            <Button
              variant={selectedPath === "orchestrate" ? "default" : "outline"}
              size="sm"
              onClick={() => handlePathChange("orchestrate")}
              className="min-w-[140px]"
            >
              <Compass className="h-4 w-4 mr-2" />
              Orchestrate AI
            </Button>
          </div>

          {/* Commitment Slider */}
          <div className="mb-8">
            <div className="text-xs font-bold text-muted-foreground mb-3 text-center">YOUR COMMITMENT</div>
            <Slider
              value={commitmentSlider}
              onValueChange={handleSliderChange}
              max={100}
              step={1}
              className="mb-4"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span className={commitmentSlider[0] <= 33 ? "text-foreground font-semibold" : ""}>
                1 Hour
              </span>
              <span className={commitmentSlider[0] > 33 && commitmentSlider[0] <= 66 ? "text-foreground font-semibold" : ""}>
                4 Weeks
              </span>
              <span className={commitmentSlider[0] > 66 ? "text-foreground font-semibold" : ""}>
                90 Days
              </span>
            </div>
          </div>

          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-block bg-ink/10 dark:bg-mint/10 text-ink dark:text-foreground px-4 py-2 rounded-full text-sm font-bold mb-6">
              {content.badge}
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              {content.title}
            </h1>
            <div className="flex items-center justify-center gap-2 text-muted-foreground mb-6">
              <IconComponent className="h-5 w-5" />
              <span className="text-lg">{content.duration}</span>
            </div>
            <p className="text-xl text-foreground leading-relaxed max-w-3xl mx-auto mb-8">
              {content.headline}
            </p>
            
            {/* Promo Banner */}
            <PromoBanner className="max-w-2xl mx-auto" />
          </div>
          
          {/* Qualifier Section */}
          <div className="minimal-card bg-mint/10 mb-8">
            <h2 className="text-xl font-bold mb-3">{content.qualifier.title}</h2>
            <p className="text-foreground leading-relaxed mb-4">
              {content.qualifier.body}
            </p>
            <p className="text-foreground leading-relaxed">
              <strong>{content.qualifier.outcome}</strong>
            </p>
          </div>
          
          {/* Disqualifier Section - Only for Build path */}
          {selectedPath === "build" && (
            <div className="minimal-card border border-destructive/30 bg-destructive/5 mb-12">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Not the right fit?</h3>
                  <p className="text-muted-foreground">
                    If you prefer to delegate all AI work to others and don't intend to build yourself, 
                    this will not be a fit.{" "}
                    <button 
                      onClick={() => handlePathChange("orchestrate")}
                      className="text-mint hover:underline font-medium"
                    >
                      See Orchestrate AI instead.
                    </button>
                  </p>
                </div>
              </div>
            </div>
          )}
          
          {/* Info Cards Carousel */}
          <JourneyInfoCarousel
            className="mb-8"
            cards={[
              {
                id: "who-its-for",
                title: "Who It's For",
                content: (
                  <>
                    <p className="text-foreground leading-relaxed mb-4">
                      {selectedPath === "build" 
                        ? "A senior leader with real authority over a slice of the business who wants to personally build with AI. Often a CEO, GM, CCO, CPO, CRO or transformation owner."
                        : "Senior executives (CEO, CFO, Board Members, C-Suite) who delegate execution but need to own AI decisions."}
                    </p>
                    {selectedPath === "build" ? (
                      <p className="text-foreground leading-relaxed">
                        You are likely:
                      </p>
                    ) : null}
                    <ul className="space-y-2 text-foreground mt-4">
                      {selectedPath === "build" ? (
                        <>
                          <li>• Ready to get your hands dirty with AI tools</li>
                          <li>• Dipping into tools yourself but with no repeatable method</li>
                          <li>• Frustrated that every AI meeting ends in a slide, not a change you built</li>
                        </>
                      ) : (
                        <>
                          <li>• Delegate execution but need to own AI decisions</li>
                          <li>• Want board-level confidence on AI without becoming technical</li>
                          <li>• Need to evaluate vendors and initiatives without getting lost in details</li>
                          <li>• Want systems you can oversee, not tinker with</li>
                        </>
                      )}
                    </ul>
                  </>
                ),
              },
              {
                id: "what-you-get",
                title: "What You Get",
                content: (
                  <div className="space-y-4">
                    {content.deliverables.map((item, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-mint flex-shrink-0 mt-0.5" />
                        <p className="text-foreground">{item}</p>
                      </div>
                    ))}
                  </div>
                ),
              },
              {
                id: "what-you-build",
                title: selectedPath === "build" ? "What You Will Build" : "What You Will Achieve",
                bgClass: "bg-muted/30",
                content: (
                  <>
                    <p className="text-foreground leading-relaxed mb-4">
                      You leave with:
                    </p>
                    <ul className="space-y-3 text-foreground">
                      {content.outcomes.map((outcome, index) => (
                        <li key={index}>• {outcome}</li>
                      ))}
                    </ul>
                  </>
                ),
              },
              ...(content.howItWorks ? [{
                id: "how-it-works",
                title: "How It Works",
                content: (
                  <div className="space-y-4">
                    {content.howItWorks.map((item, index) => (
                      <div key={index}>
                        <h3 className="font-semibold text-foreground mb-1">{item.step}</h3>
                        <p className="text-muted-foreground text-sm">{item.description}</p>
                      </div>
                    ))}
                  </div>
                ),
              }] : []),
            ] as JourneyCard[]}
          />
          
          {/* Structure - Only for 90d */}
          {depth === "90d" && (
            <div className="mb-12">
              <h2 className="text-2xl font-bold mb-6 text-center">Structure</h2>
              <div className="space-y-4">
                {(content.weeks || content.phases)?.map((item: any, index: number) => (
                  <div 
                    key={index} 
                    className="minimal-card fade-in-up"
                    style={{animationDelay: `${index * 0.05}s`}}
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-20 h-20 bg-ink text-white rounded-md flex items-center justify-center">
                        <span className="text-sm font-bold">{item.week || item.phase}</span>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-foreground mb-2">{item.title}</h3>
                        <p className="text-muted-foreground leading-relaxed">{item.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Module Explorer */}
          <ModuleExplorer context="individual" />
          
          {/* CTA */}
          <div className="text-center mt-12 mb-24">
            <Button
              size="lg"
              variant="mint"
              className="px-12 py-6 text-lg font-bold"
              onClick={handleCTAClick}
            >
              Book Your Session
            </Button>
          </div>
        </div>
      </section>
      
      <Footer />
      
      {/* Sticky CTA Bar - Always visible on desktop, above footer */}
      <div className="sticky bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-t border-border shadow-lg hidden md:block">
        <div className="container-width max-w-5xl py-4">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm font-semibold text-foreground">
                {content.title}
              </p>
              <p className="text-xs text-muted-foreground">
                {content.duration} • <span className="hidden sm:inline">{selectedPath === "build" ? "Build with AI" : "Orchestrate AI"}</span><span className="sm:hidden">{selectedPath === "build" ? "Build" : "Orchestrate"}</span>
              </p>
            </div>
            <Button
              size="lg"
              variant="mint"
              className="px-8 py-6 font-bold"
              onClick={handleCTAClick}
            >
              Book Your Session
            </Button>
          </div>
        </div>
      </div>
      
      {/* Floating Book CTA for mobile */}
      <FloatingBookCTA 
        preselectedProgram={selectedPath}
        commitmentLevel={depth}
        audienceType="individual"
        pathType={selectedPath}
      />
      
      {/* Consult Modal */}
      <InitialConsultModal
        open={consultModalOpen}
        onOpenChange={setConsultModalOpen}
        preselectedProgram={selectedPath}
        commitmentLevel={depth}
        audienceType="individual"
        pathType={selectedPath}
      />
    </main>
  );
};

export default Individual;

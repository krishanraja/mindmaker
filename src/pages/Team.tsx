import { useState, useEffect } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Users, CheckCircle, Calendar } from "lucide-react";
import { SEO } from "@/components/SEO";
import { ModuleExplorer } from "@/components/ModuleExplorer";
import { useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { PromoBanner } from "@/components/PromoBanner";
import { JourneyInfoCarousel, type JourneyCard } from "@/components/JourneyInfoCarousel";
import { FloatingBookCTA } from "@/components/FloatingBookCTA";
import { InitialConsultModal } from "@/components/InitialConsultModal";

type DepthType = "3hr" | "4wk" | "90d";

const depthContent = {
  "3hr": {
    badge: "QUICK ALIGNMENT",
    title: "Team Alignment Session",
    duration: "3 hours",
    icon: Calendar,
    headline: "Drop-in session to align your leadership team and define your AI strategy.",
    description: "Surface conflicts, agree on priorities, leave with clarity on next steps.",
    qualifier: {
      title: "This is for executive teams needing quick alignment.",
      body: "If your team has conflicting views on AI and needs a facilitated session to get on the same page, this session will create clarity fast.",
      outcome: "You will leave with alignment, not training materials.",
    },
    deliverables: [
      "3-hour facilitated session with your leadership team",
      "Bottleneck identification and prioritization",
      "Agreed-upon next steps and owner assignment",
      "Executive summary within 72 hours",
    ],
    outcomes: [
      "Clear view of where the team agrees and disagrees on AI",
      "Prioritized list of bottlenecks that matter",
      "Agreed-upon next steps with owner and timeline",
      "Reduced conflict and increased alignment",
    ],
    segments: [
      {
        title: "The Myth Check",
        description: "The team sees a sharp, current view of where AI is genuinely creating value. Enough to anchor the rest of the day, not a lecture.",
      },
      {
        title: "The Bottleneck Board",
        description: "Each leader writes where they are stuck. We cluster the inputs and agree on the handful of constraints that matter.",
      },
      {
        title: "The Effortless Map",
        description: "We sketch what would feel effortless by 2026 if AI and new systems were applied properly.",
      },
      {
        title: "The Simulations",
        description: "We run two decisions, side by side. Column A: the current human-only way. Column B: a new approach that uses AI as a thinking and drafting partner.",
      },
      {
        title: "The Rewrite",
        description: "The team drafts a one page addendum to the existing strategy that captures the new targets, guardrails and pilot.",
      },
      {
        title: "The Huddle",
        description: "We name the owner, the budget envelope and the first gates. No one leaves without a date for the first review.",
      },
    ],
  },
  "4wk": {
    badge: "FOCUSED SPRINT",
    title: "Accelerated Exec Lab",
    duration: "4 weeks",
    icon: Calendar,
    headline: "Shortened executive team lab with focused alignment.",
    description: "Build shared decision frameworks and commit to a pilot with owner and gates. Fast-track your team's AI alignment.",
    qualifier: {
      title: "This is for executive teams needing focused alignment fast.",
      body: "If you need to build AI decision frameworks quickly but want more than a single session, this accelerated program gives you alignment and commitment.",
      outcome: "You will leave with shared frameworks and a committed pilot.",
    },
    deliverables: [
      "4 weekly facilitated sessions with your leadership team",
      "Shared AI decision frameworks",
      "90-day pilot charter with owner, budget, and gates",
      "Team alignment snapshot",
      "Board-ready materials",
    ],
    outcomes: [
      "Complete alignment on AI strategy and priorities",
      "Shared decision frameworks the team will use",
      "Committed 90-day pilot with clear ownership",
      "Reduced vendor noise and pilot confusion",
      "Clear path forward with accountability",
    ],
  },
  "90d": {
    badge: "FULL TRANSFORMATION",
    title: "Full Executive Lab",
    duration: "90 days",
    icon: Calendar,
    headline: "Complete executive team transformation.",
    description: "Align on AI, run real decisions through new workflows, leave with a board-ready charter and 90-day pilot commitment.",
    qualifier: {
      title: "This is for executive teams ready for full transformation.",
      body: "If you need comprehensive AI alignment and want to do it right, this program gives you everything you need to lead with confidence as a team.",
      outcome: "You will leave with complete alignment, frameworks, and a committed pilot.",
    },
    deliverables: [
      "4 live facilitated sessions with your leadership team",
      "Complete AI governance framework for your organization",
      "90-day pilot charter, ready to be shared with the board",
      "Team alignment snapshot showing where you agree and where you don't",
      "Clear owner, budget envelope, and first review date",
      "Board-ready materials on AI strategy",
    ],
    outcomes: [
      "Complete alignment on AI strategy across leadership",
      "Shared decision frameworks the entire team uses",
      "Committed 90-day pilot with owner, budget, and gates",
      "Reduced conflict and increased confidence",
      "Clear story you can tell the board",
      "A 90-day implementation plan for your team",
    ],
    segments: [
      {
        title: "The Myth Check",
        description: "The team sees a sharp, current view of where AI is genuinely creating value. Enough to anchor the rest of the day, not a lecture.",
      },
      {
        title: "The Bottleneck Board",
        description: "Each leader writes where they are stuck. We cluster the inputs and agree on the handful of constraints that matter.",
      },
      {
        title: "The Effortless Map",
        description: "We sketch what would feel effortless by 2026 if AI and new systems were applied properly.",
      },
      {
        title: "The Simulations",
        description: "We run two decisions, side by side. Column A: the current human-only way. Column B: a new approach that uses AI as a thinking and drafting partner. We measure the change in time, quality and risk.",
      },
      {
        title: "The Rewrite",
        description: "The team drafts a one page addendum to the existing strategy that captures the new targets, guardrails and pilot.",
      },
      {
        title: "The Huddle",
        description: "We name the owner, the budget envelope and the first gates. No one leaves without a date for the first review.",
      },
    ],
  },
};

const Team = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [commitmentSlider, setCommitmentSlider] = useState<number[]>([0]);
  const [consultModalOpen, setConsultModalOpen] = useState(false);

  // Initialize slider based on URL commitment param or default to 0
  useEffect(() => {
    const commitment = searchParams.get("commitment");
    if (commitment === "3hr") {
      setCommitmentSlider([0]);
    } else if (commitment === "4wk") {
      setCommitmentSlider([50]);
    } else if (commitment === "90d") {
      setCommitmentSlider([100]);
    }
  }, [searchParams]);

  // Calculate current depth from slider
  const currentIndex = commitmentSlider[0] <= 33 ? 0 : commitmentSlider[0] <= 66 ? 1 : 2;
  const depthOptions: DepthType[] = ["3hr", "4wk", "90d"];
  const depth = depthOptions[currentIndex];
  
  // Get content based on depth
  const content = depthContent[depth];
  const IconComponent = content.icon;

  // Update URL when slider changes
  const handleSliderChange = (value: number[]) => {
    setCommitmentSlider(value);
    const newIndex = value[0] <= 33 ? 0 : value[0] <= 66 ? 1 : 2;
    const newDepth = depthOptions[newIndex];
    setSearchParams({ commitment: newDepth });
  };

  const handleCTAClick = () => {
    setConsultModalOpen(true);
  };

  const seoData = {
    title: `Team AI Programs - ${content.title}`,
    description: content.description,
    canonical: `/team?commitment=${depth}`,
    keywords: "executive AI alignment, AI leadership lab, executive team AI decisions, AI transformation, executive workshop",
  };

  return (
    <main className="min-h-screen bg-background">
      <SEO {...seoData} />
      <Navigation />
      
      <section className="section-padding-nav">
        <div className="container-width max-w-5xl">
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
                3 Hours
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
            <p className="text-foreground font-semibold text-lg mb-4">
              This is not training. It is a facilitated decision reset for leadership teams.
            </p>
            <h2 className="text-xl font-bold mb-3">{content.qualifier.title}</h2>
            <p className="text-foreground leading-relaxed mb-4">
              {content.qualifier.body}
            </p>
            <p className="text-foreground leading-relaxed">
              <strong>{content.qualifier.outcome}</strong>
            </p>
          </div>
          
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
                      Executive teams of 6 to 12 people who need to align on AI decisions, not learn about AI.
                    </p>
                    <p className="text-foreground leading-relaxed">
                      <span className="font-semibold">Ideal mix:</span> CEO, COO, CFO, product, marketing, data, people, 
                      operations and innovation leads.
                    </p>
                  </>
                ),
              },
              {
                id: "what-you-decide",
                title: "What You Decide Together",
                bgClass: "bg-muted/30",
                content: (
                  <>
                    <p className="text-foreground leading-relaxed mb-3">
                      {depth === "3hr" 
                        ? "In three hours the team:"
                        : depth === "4wk"
                        ? "Over four weeks the team:"
                        : "In the full program the team:"}
                    </p>
                    <ul className="space-y-2 text-foreground">
                      <li className="text-sm">• Surfaces the real bottlenecks that matter for the next 12 to 24 months</li>
                      <li className="text-sm">• Runs real decisions through a new AI-enabled way of working</li>
                      <li className="text-sm">• Commits to a single 90-day pilot with an owner, budget and gates</li>
                      <li className="text-sm">• Leaves with a short, board-ready charter of what will happen next</li>
                    </ul>
                  </>
                ),
              },
              {
                id: "deliverables",
                title: "Deliverables",
                content: (
                  <div className="space-y-3">
                    {content.deliverables.map((item, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-mint flex-shrink-0 mt-0.5" />
                        <p className="text-foreground text-sm">{item}</p>
                      </div>
                    ))}
                  </div>
                ),
              },
            ] as JourneyCard[]}
          />
          
          {/* What Happens - Only for 3hr and 90d */}
          {(depth === "3hr" || depth === "90d") && content.segments && (
            <div className="mb-12">
              <h2 className="text-2xl font-bold mb-6 text-center">What Happens in the Room</h2>
              <div className="space-y-4">
                {content.segments.map((segment, index) => (
                  <div 
                    key={index} 
                    className="minimal-card fade-in-up"
                    style={{animationDelay: `${index * 0.05}s`}}
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-16 h-16 bg-ink text-white rounded-md flex items-center justify-center">
                        <span className="text-xl font-bold">{index + 1}</span>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-foreground mb-2">{segment.title}</h3>
                        <p className="text-muted-foreground leading-relaxed">{segment.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Module Explorer */}
          <ModuleExplorer context="team" />
          
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
                {content.duration} • Team Alignment
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
        preselectedProgram="team"
        commitmentLevel={depth}
        audienceType="team"
      />
      
      {/* Consult Modal */}
      <InitialConsultModal
        open={consultModalOpen}
        onOpenChange={setConsultModalOpen}
        preselectedProgram="team"
        commitmentLevel={depth}
        audienceType="team"
      />
    </main>
  );
};

export default Team;

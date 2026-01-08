import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Clock, CheckCircle, Info, Calendar, Zap } from "lucide-react";
import { ConsultationBooking } from "@/components/ConsultationBooking";
import { SEO } from "@/components/SEO";
import { ModuleExplorer } from "@/components/ModuleExplorer";
import { Link, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { PromoBanner } from "@/components/PromoBanner";

type DepthType = "1hr" | "4wk" | "90d";

const depthContent = {
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

const BuilderSession = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const depth = (searchParams.get("depth") as DepthType) || "1hr";
  const content = depthContent[depth];
  const IconComponent = content.icon;

  const setDepth = (newDepth: DepthType) => {
    setSearchParams({ depth: newDepth });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const seoData = {
    title: `Orchestrate AI - ${content.title}`,
    description: content.description,
    canonical: `/builder-session?depth=${depth}`,
    keywords: "AI executive consultation, AI governance, AI decision framework, executive AI control, AI oversight, hands-off AI leadership",
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "Service",
      "name": `Orchestrate AI - ${content.title}`,
      "description": content.description,
      "provider": {
        "@type": "Organization",
        "name": "The Mindmaker",
        "url": "https://www.themindmaker.ai/"
      },
      "serviceType": "Executive AI Consultation",
      "areaServed": "Worldwide",
      "audience": {
        "@type": "BusinessAudience",
        "audienceType": "Executives, C-Suite, Senior Leaders"
      },
      "offers": {
        "@type": "Offer",
        "availability": "https://schema.org/InStock"
      }
    }
  };

  return (
    <main className="min-h-screen bg-background">
      <SEO {...seoData} />
      <Navigation />
      
      <section className="section-padding">
        <div className="container-width max-w-5xl">
          {/* Depth Switcher */}
          <div className="flex justify-center gap-2 mb-8">
            <Button 
              variant={depth === "1hr" ? "default" : "outline"} 
              size="sm"
              onClick={() => setDepth("1hr")}
              className="min-w-[80px]"
            >
              1 Hour
            </Button>
            <Button 
              variant={depth === "4wk" ? "default" : "outline"} 
              size="sm"
              onClick={() => setDepth("4wk")}
              className="min-w-[80px]"
            >
              4 Weeks
            </Button>
            <Button 
              variant={depth === "90d" ? "default" : "outline"} 
              size="sm"
              onClick={() => setDepth("90d")}
              className="min-w-[80px]"
            >
              90 Days
            </Button>
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
          
          {/* Boundary Copy */}
          <div className="minimal-card border border-border bg-muted/30 mb-8">
            <div className="flex items-start gap-3">
              <Info className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-foreground mb-2">What this is not</h3>
                <p className="text-muted-foreground">
                  You will not be taught how to build apps or automations. 
                  The outcome is clarity, control, and the ability to direct others effectively.{" "}
                  <Link to={`/builder-sprint?depth=${depth}`} className="text-mint hover:underline font-medium">
                    Want to build yourself? See Build with AI instead.
                  </Link>
                </p>
              </div>
            </div>
          </div>
          
          {/* Who This Is For */}
          <div className="minimal-card mb-12">
            <h2 className="text-2xl font-bold mb-4">Who This Is For</h2>
            <p className="text-foreground leading-relaxed mb-4">
              Senior executives (CEO, CFO, Board Members, C-Suite) who:
            </p>
            <ul className="space-y-2 text-foreground">
              <li>• Delegate execution but need to own AI decisions</li>
              <li>• Want board-level confidence on AI without becoming technical</li>
              <li>• Need to evaluate vendors and initiatives without getting lost in details</li>
              <li>• Want systems they can oversee, not tinker with</li>
            </ul>
          </div>

          {/* Phases - Only for 90d */}
          {depth === "90d" && content.phases && (
            <div className="mb-12">
              <h2 className="text-2xl font-bold mb-6 text-center">Program Structure</h2>
              <div className="space-y-4">
                {content.phases.map((phase, index) => (
                  <div 
                    key={index} 
                    className="minimal-card fade-in-up"
                    style={{animationDelay: `${index * 0.05}s`}}
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-20 h-20 bg-ink text-white rounded-md flex items-center justify-center">
                        <span className="text-sm font-bold">{phase.phase}</span>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-foreground mb-2">{phase.title}</h3>
                        <p className="text-muted-foreground leading-relaxed">{phase.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* How It Works - for 1hr and 4wk */}
          {(depth === "1hr" || depth === "4wk") && content.howItWorks && (
            <div className="minimal-card mb-8">
              <h2 className="text-2xl font-bold mb-6">How It Works</h2>
              <div className="space-y-6">
                {content.howItWorks.map((item, index) => (
                  <div key={index}>
                    <h3 className="font-semibold text-foreground mb-2">{item.step}</h3>
                    <p className="text-muted-foreground">{item.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* What You Get */}
          <div className="minimal-card mb-8">
            <h2 className="text-2xl font-bold mb-6">What You Get</h2>
            <div className="space-y-4">
              {content.deliverables.map((item, index) => (
                <div key={index} className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-mint flex-shrink-0 mt-0.5" />
                  <p className="text-foreground">{item}</p>
                </div>
              ))}
            </div>
          </div>
          
          {/* Outcome */}
          <div className="minimal-card bg-muted/30 mb-8">
            <h2 className="text-2xl font-bold mb-4">What You Leave With</h2>
            <p className="text-foreground leading-relaxed mb-4">
              You leave with:
            </p>
            <ul className="space-y-3 text-foreground">
              {content.outcomes.map((outcome, index) => (
                <li key={index}>• {outcome}</li>
              ))}
            </ul>
          </div>
          
          {/* Module Explorer */}
          <ModuleExplorer context="individual" />
          
          {/* CTA */}
          <ConsultationBooking variant="default" preselectedProgram="builder-session" />
        </div>
      </section>
      
      <Footer />
    </main>
  );
};

export default BuilderSession;

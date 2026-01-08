import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Calendar, CheckCircle, AlertCircle, Clock, Zap } from "lucide-react";
import { ConsultationBooking } from "@/components/ConsultationBooking";
import { SEO } from "@/components/SEO";
import { ModuleExplorer } from "@/components/ModuleExplorer";
import { Link, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { PromoBanner } from "@/components/PromoBanner";

type DepthType = "1hr" | "4wk" | "90d";

const depthContent = {
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

const BuilderSprint = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const depth = (searchParams.get("depth") as DepthType) || "90d";
  const content = depthContent[depth];
  const IconComponent = content.icon;

  const setDepth = (newDepth: DepthType) => {
    setSearchParams({ depth: newDepth });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const seoData = {
    title: `Build with AI - ${content.title}`,
    description: content.description,
    canonical: `/builder-sprint?depth=${depth}`,
    keywords: "AI builder program, hands-on AI training, AI systems building, build with AI, AI for operators, practical AI building",
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "Course",
      "name": `Build with AI - ${content.title}`,
      "description": content.description,
      "provider": {
        "@type": "Organization",
        "name": "The Mindmaker",
        "url": "https://www.themindmaker.ai/"
      },
      "courseMode": "Online",
      "educationalLevel": "Executive",
      "audience": {
        "@type": "EducationalAudience",
        "audienceType": "Hands-on Leaders, Operators, Builders"
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
          
          {/* Disqualifier Section */}
          <div className="minimal-card border border-destructive/30 bg-destructive/5 mb-12">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-foreground mb-2">Not the right fit?</h3>
                <p className="text-muted-foreground">
                  If you prefer to delegate all AI work to others and don't intend to build yourself, 
                  this will not be a fit.{" "}
                  <Link to={`/builder-session?depth=${depth}`} className="text-mint hover:underline font-medium">
                    See Orchestrate AI instead.
                  </Link>
                </p>
              </div>
            </div>
          </div>
          
          {/* Who It's For */}
          <div className="minimal-card mb-12">
            <h2 className="text-2xl font-bold mb-4">Who It's For</h2>
            <p className="text-foreground leading-relaxed mb-4">
              A senior leader with real authority over a slice of the business 
              who wants to personally build with AI. Often a CEO, GM, CCO, CPO, CRO or transformation owner.
            </p>
            <p className="text-foreground leading-relaxed">
              You are likely:
            </p>
            <ul className="space-y-2 text-foreground mt-4">
              <li>• Ready to get your hands dirty with AI tools</li>
              <li>• Dipping into tools yourself but with no repeatable method</li>
              <li>• Frustrated that every AI meeting ends in a slide, not a change you built</li>
            </ul>
          </div>
          
          {/* Structure - Only for 90d */}
          {depth === "90d" && content.weeks && (
            <div className="mb-12">
              <h2 className="text-2xl font-bold mb-6 text-center">Structure</h2>
              <div className="space-y-4">
                {content.weeks.map((week, index) => (
                  <div 
                    key={index} 
                    className="minimal-card fade-in-up"
                    style={{animationDelay: `${index * 0.05}s`}}
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-20 h-20 bg-ink text-white rounded-md flex items-center justify-center">
                        <span className="text-sm font-bold">{week.week}</span>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-foreground mb-2">{week.title}</h3>
                        <p className="text-muted-foreground leading-relaxed">{week.description}</p>
                      </div>
                    </div>
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
            <h2 className="text-2xl font-bold mb-4">What You Will Build</h2>
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
          <ConsultationBooking variant="default" />
        </div>
      </section>
      
      <Footer />
    </main>
  );
};

export default BuilderSprint;

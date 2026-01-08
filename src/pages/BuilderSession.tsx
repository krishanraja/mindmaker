import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Clock, CheckCircle, Info } from "lucide-react";
import { ConsultationBooking } from "@/components/ConsultationBooking";
import { SEO } from "@/components/SEO";
import { ModuleExplorer } from "@/components/ModuleExplorer";
import { Link } from "react-router-dom";

const BuilderSession = () => {
  const seoData = {
    title: "Orchestrate AI - Executive Decision Review Session",
    description: "60-minute decision review session for executives. Gain control, clarity, and governance over AI without building tools yourself. Leave with frameworks to direct others effectively.",
    canonical: "/builder-session",
    keywords: "AI executive consultation, AI governance, AI decision framework, executive AI control, AI oversight, AI strategy session, hands-off AI leadership",
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "Service",
      "name": "Orchestrate AI Session",
      "description": "60-minute decision review session for executives who want control over AI without building tools themselves.",
      "provider": {
        "@type": "Organization",
        "name": "The Mindmaker",
        "url": "https://www.themindmaker.ai/"
      },
      "serviceType": "Executive AI Consultation",
      "duration": "PT1H",
      "areaServed": "Worldwide",
      "audience": {
        "@type": "BusinessAudience",
        "audienceType": "Executives, C-Suite, Senior Leaders"
      },
      "offers": {
        "@type": "Offer",
        "price": "150",
        "priceCurrency": "USD",
        "availability": "https://schema.org/InStock",
        "priceValidUntil": "2026-12-31"
      }
    }
  };

  const outcomes = [
    "Decision frameworks for AI investment and prioritization",
    "Oversight models for evaluating AI initiatives",
    "Questions and controls you can use with teams and vendors",
    "A clear view of where AI should and should not be used in your context",
  ];

  return (
    <main className="min-h-screen bg-background">
      <SEO {...seoData} />
      <Navigation />
      
      <section className="section-padding">
        <div className="container-width max-w-4xl">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-block bg-ink/10 dark:bg-mint/10 text-ink dark:text-foreground px-4 py-2 rounded-full text-sm font-bold mb-6">
              FOR EXECUTIVES
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Orchestrate AI
            </h1>
            <div className="flex items-center justify-center gap-2 text-muted-foreground mb-6">
              <Clock className="h-5 w-5" />
              <span className="text-lg">60 minutes live</span>
            </div>
            <p className="text-xl text-foreground leading-relaxed">
              A decision review session for leaders who delegate execution but own outcomes. 
              Gain control over AI without needing to build tools yourself.
            </p>
          </div>
          
          {/* Qualifier Section */}
          <div className="minimal-card bg-mint/10 mb-8">
            <h2 className="text-xl font-bold mb-3">This is for hands-off leaders.</h2>
            <p className="text-foreground leading-relaxed">
              If you lead through delegation and decision-making, this session gives you 
              control over AI without needing to build tools yourself. You will leave with 
              the ability to direct others effectively.
            </p>
          </div>
          
          {/* Boundary Copy */}
          <div className="minimal-card border border-border bg-muted/30 mb-8">
            <div className="flex items-start gap-3">
              <Info className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-foreground mb-2">What this is not</h3>
                <p className="text-muted-foreground">
                  You will not be taught how to build apps or automations in this session. 
                  The outcome is clarity, control, and the ability to direct others effectively.{" "}
                  <Link to="/builder-sprint" className="text-mint hover:underline font-medium">
                    Want to build yourself? See Build with AI instead.
                  </Link>
                </p>
              </div>
            </div>
          </div>
          
          {/* What You Get */}
          <div className="minimal-card mb-8">
            <h2 className="text-2xl font-bold mb-6">What You Leave With</h2>
            <div className="space-y-4">
              {outcomes.map((outcome, index) => (
                <div key={index} className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-mint flex-shrink-0 mt-0.5" />
                  <p className="text-foreground">{outcome}</p>
                </div>
              ))}
            </div>
          </div>
          
          {/* How It Works */}
          <div className="minimal-card mb-8">
            <h2 className="text-2xl font-bold mb-6">How It Works</h2>
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-foreground mb-2">1. Short Intake</h3>
                <p className="text-muted-foreground">
                  Fill out a brief form about your current AI decisions and governance challenges.
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold text-foreground mb-2">2. Decision Review (60 min)</h3>
                <p className="text-muted-foreground">
                  Work directly with Krish to review your AI landscape, evaluate initiatives, 
                  and build frameworks for oversight and control.
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold text-foreground mb-2">3. Written Follow-Up</h3>
                <p className="text-muted-foreground">
                  Receive a written summary with decision frameworks, evaluation criteria, 
                  and questions you can use with your teams and vendors.
                </p>
              </div>
            </div>
          </div>
          
          {/* Who This Is For */}
          <div className="minimal-card bg-muted/30 mb-12">
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

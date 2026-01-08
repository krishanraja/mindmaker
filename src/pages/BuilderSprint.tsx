import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Calendar, CheckCircle, AlertCircle } from "lucide-react";
import { ConsultationBooking } from "@/components/ConsultationBooking";
import { SEO } from "@/components/SEO";
import { ModuleExplorer } from "@/components/ModuleExplorer";
import { Link } from "react-router-dom";

const BuilderSprint = () => {
  const seoData = {
    title: "Build with AI - 90-Day Hands-On Builder Program",
    description: "90-day intensive program for hands-on leaders. You will build working AI systems around your actual work. Leave with a Builder Dossier and the ability to extend everything independently.",
    canonical: "/builder-sprint",
    keywords: "AI builder program, hands-on AI training, AI systems building, build with AI, AI for operators, 90-day AI program, AI implementation, practical AI building",
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "Course",
      "name": "Build with AI - 90-Day Sprint",
      "description": "90-day intensive program for hands-on leaders to build working AI-enabled systems around their actual work",
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
      "timeRequired": "P90D",
      "hasCourseInstance": {
        "@type": "CourseInstance",
        "courseMode": "Online",
        "duration": "P90D"
      },
      "offers": {
        "@type": "Offer",
        "availability": "https://schema.org/InStock"
      }
    }
  };

  const weeks = [
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
  ];

  const deliverables = [
    "4 live build sessions with Krish where you do the building",
    "A written Builder Dossier with workflows, prompts and guardrails you created",
    "Simple metrics that track time saved, cycle time and decision quality",
    "The knowledge to extend and modify everything yourself going forward",
  ];

  return (
    <main className="min-h-screen bg-background">
      <SEO {...seoData} />
      <Navigation />
      
      <section className="section-padding">
        <div className="container-width max-w-5xl">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-block bg-ink/10 dark:bg-mint/10 text-ink dark:text-foreground px-4 py-2 rounded-full text-sm font-bold mb-6">
              FOR HANDS-ON LEADERS
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Build with AI
            </h1>
            <div className="flex items-center justify-center gap-2 text-muted-foreground mb-6">
              <Calendar className="h-5 w-5" />
              <span className="text-lg">90 days</span>
            </div>
            <p className="text-xl text-foreground leading-relaxed max-w-3xl mx-auto">
              In 90 days you go from talking about AI to personally building and running 
              a set of working systems that support how you think, decide and lead.
            </p>
          </div>
          
          {/* Qualifier Section */}
          <div className="minimal-card bg-mint/10 mb-8">
            <h2 className="text-xl font-bold mb-3">This is for hands-on leaders.</h2>
            <p className="text-foreground leading-relaxed mb-4">
              If you want to personally build AI-powered systems, apps, or workflows 
              and are willing to change how you work, this sprint is designed for you.
            </p>
            <p className="text-foreground leading-relaxed">
              <strong>You will build.</strong> You will change your habits. 
              You will leave able to independently build your next system without me.
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
                  <Link to="/builder-session" className="text-mint hover:underline font-medium">
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
              A single senior leader with real authority over a slice of the business 
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
          
          {/* Structure */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6 text-center">Structure</h2>
            <div className="space-y-4">
              {weeks.map((week, index) => (
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
          
          {/* What You Get */}
          <div className="minimal-card mb-8">
            <h2 className="text-2xl font-bold mb-6">What You Get, Concretely</h2>
            <div className="space-y-4">
              {deliverables.map((item, index) => (
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
              You leave with systems you built yourself:
            </p>
            <ul className="space-y-3 text-foreground">
              <li>• 3 to 5 live workflows or systems you built around your actual week</li>
              <li>• A personal prompt and system library tailored to how you think</li>
              <li>• The ability to extend everything independently without me</li>
              <li>• A 90 day plan to roll this out to your team</li>
              <li>• A clear story you can tell the board about where this is going</li>
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

import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Users, CheckCircle } from "lucide-react";
import { ConsultationBooking } from "@/components/ConsultationBooking";
import { SEO } from "@/components/SEO";

const LeadershipLab = () => {
  const seoData = {
    title: "AI Leadership Lab - Executive Team Transformation",
    description: "4-hour executive team workshop for 6-12 leaders. Run two real decisions through AI-enabled workflows. Leave with a 90-day pilot charter and board-ready summary.",
    canonical: "/leadership-lab",
    keywords: "executive AI training, AI leadership workshop, executive team AI, AI transformation, executive workshop, AI for executives, leadership AI program, team AI training",
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "EducationalEvent",
      "name": "AI Leadership Lab",
      "description": "Executive team transformation workshop. Run two real decisions through AI-enabled workflows in 4 hours.",
      "provider": {
        "@type": "Organization",
        "name": "The Mindmaker",
        "url": "https://www.themindmaker.ai/"
      },
      "duration": "PT4H",
      "audience": {
        "@type": "EducationalAudience",
        "audienceType": "Executive Teams, C-Suite"
      },
      "eventAttendanceMode": "https://schema.org/OnlineEventAttendanceMode",
      "offers": {
        "@type": "Offer",
        "availability": "https://schema.org/InStock"
      }
    }
  };

  const segments = [
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
  ];

  const deliverables = [
    "Executive summary deck within 72 hours",
    "A 90-day pilot charter, ready to be shared with the board",
    "Team literacy and comfort snapshot, so you know where to focus",
    "Optional internal GPT sandbox based on the outputs, for leaders to keep working with the material",
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
              FOR EXECUTIVE TEAMS
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              AI Leadership Lab
            </h1>
            <div className="flex items-center justify-center gap-2 text-muted-foreground mb-6">
              <Users className="h-5 w-5" />
              <span className="text-lg">4 hours • 6-12 executives</span>
            </div>
            <p className="text-xl text-foreground leading-relaxed max-w-3xl mx-auto">
              Executive teams move from loose AI curiosity to a shared, practical path. 
              In four hours, commit to a single 90-day pilot with an owner, budget and gates.
            </p>
          </div>
          
          {/* Who It's For */}
          <div className="minimal-card mb-12">
            <h2 className="text-2xl font-bold mb-4">Who It's For</h2>
            <p className="text-foreground leading-relaxed mb-4">
              Executive teams of 6 to 12 people who need to move from loose AI curiosity to a shared, practical path.
            </p>
            <p className="text-foreground leading-relaxed">
              <span className="font-semibold">Ideal mix:</span> CEO, COO, CFO, product, marketing, data, people, 
              operations and innovation leads.
            </p>
          </div>
          
          {/* Outcome */}
          <div className="minimal-card bg-mint/10 mb-12">
            <h2 className="text-2xl font-bold mb-4">Outcome</h2>
            <p className="text-foreground leading-relaxed mb-4">
              In four hours the team:
            </p>
            <ul className="space-y-3 text-foreground">
              <li>• Surfaces the real bottlenecks that matter for the next 12 to 24 months</li>
              <li>• Runs two real decisions through a new AI-enabled way of working</li>
              <li>• Commits to a single 90-day pilot with an owner, budget and gates</li>
              <li>• Leaves with a short, board-ready summary of what will happen next</li>
            </ul>
          </div>
          
          {/* What Happens */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6 text-center">What Happens in the Room</h2>
            <div className="space-y-4">
              {segments.map((segment, index) => (
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
          
          {/* Deliverables */}
          <div className="minimal-card mb-8">
            <h2 className="text-2xl font-bold mb-6">Deliverables</h2>
            <div className="space-y-4">
              {deliverables.map((item, index) => (
                <div key={index} className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-mint flex-shrink-0 mt-0.5" />
                  <p className="text-foreground">{item}</p>
                </div>
              ))}
            </div>
          </div>
          
          {/* CTA */}
          <ConsultationBooking variant="default" />
        </div>
      </section>
      
      <Footer />
    </main>
  );
};

export default LeadershipLab;

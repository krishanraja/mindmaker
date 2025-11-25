import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Clock, CheckCircle } from "lucide-react";
import { ConsultationBooking } from "@/components/ConsultationBooking";
import { SEO } from "@/components/SEO";

const BuilderSession = () => {
  const seoData = {
    title: "Builder Session - 60-Min AI Problem Solving with Expert",
    description: "Live 60-minute session with Krish. Bring one real problem, leave with AI friction map and 1-2 working systems. Written follow-up with prompts included.",
    canonical: "/builder-session",
    keywords: "AI consultation, AI problem solving, AI expert session, AI strategy session, hands-on AI help, AI friction mapping, AI systems design, quick AI solution",
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "Service",
      "name": "Builder Session",
      "description": "60-minute live AI problem-solving session. Map friction points and design working AI systems for your specific challenge.",
      "provider": {
        "@type": "Organization",
        "name": "The Mindmaker",
        "url": "https://www.themindmaker.ai/"
      },
      "serviceType": "AI Consultation",
      "duration": "PT1H",
      "areaServed": "Worldwide",
      "audience": {
        "@type": "BusinessAudience",
        "audienceType": "Senior Leaders, Executives"
      },
      "offers": {
        "@type": "Offer",
        "price": "348",
        "priceCurrency": "USD",
        "availability": "https://schema.org/InStock"
      }
    }
  };

  const outcomes = [
    "A map of where AI can remove friction",
    "1 or 2 draft systems or workflows designed live",
    "A written follow-up with prompts, diagrams and next steps",
  ];

  return (
    <main className="min-h-screen bg-background">
      <SEO {...seoData} />
      <Navigation />
      
      <section className="section-padding">
        <div className="container-width max-w-4xl">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-block bg-mint/10 text-mint px-4 py-2 rounded-full text-sm font-bold mb-6">
              ENTRY PRODUCT
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Builder Session
            </h1>
            <div className="flex items-center justify-center gap-2 text-muted-foreground mb-6">
              <Clock className="h-5 w-5" />
              <span className="text-lg">60 minutes live</span>
            </div>
            <p className="text-xl text-foreground leading-relaxed">
              A live session with Krish plus a short intake. You bring one real leadership problem. 
              You leave with working systems.
            </p>
          </div>
          
          {/* What You Get */}
          <div className="minimal-card mb-8">
            <h2 className="text-2xl font-bold mb-6">What You Get</h2>
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
                  Fill out a brief form about your current challenge and what you're trying to achieve.
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold text-foreground mb-2">2. Live Session (60 min)</h3>
                <p className="text-muted-foreground">
                  Work directly with Krish to map friction points and design 1-2 working systems.
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold text-foreground mb-2">3. Written Follow-Up</h3>
                <p className="text-muted-foreground">
                  Receive a written summary with prompts, diagrams, and clear next steps you can use immediately.
                </p>
              </div>
            </div>
          </div>
          
          {/* Who This Is For */}
          <div className="minimal-card bg-muted/30 mb-12">
            <h2 className="text-2xl font-bold mb-4">Who This Is For</h2>
            <p className="text-foreground leading-relaxed mb-4">
              Senior leaders (CEO, GM, CCO, CPO, CMO, CRO, COO) who:
            </p>
            <ul className="space-y-2 text-foreground">
              <li>• Are tired of AI decks that go nowhere</li>
              <li>• Want to see what building with AI actually looks like</li>
              <li>• Have one specific problem they want to solve</li>
              <li>• Are considering the 30-Day Sprint or Leadership Lab</li>
            </ul>
          </div>
          
          {/* CTA */}
          <ConsultationBooking variant="default" preselectedProgram="builder-session" />
        </div>
      </section>
      
      <Footer />
    </main>
  );
};

export default BuilderSession;

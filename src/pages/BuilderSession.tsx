import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Clock, CheckCircle, ArrowRight } from "lucide-react";

const BuilderSession = () => {
  const outcomes = [
    "A map of where AI can remove friction",
    "1 or 2 draft systems or workflows designed live",
    "A written follow-up with prompts, diagrams and next steps",
  ];

  return (
    <main className="min-h-screen bg-background">
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
          <div className="text-center">
            <Button 
              size="lg"
              className="bg-ink text-white hover:bg-ink/90 font-semibold px-12 py-6 text-lg touch-target group"
              onClick={() => window.open('https://calendly.com/krish-raja/mindmaker-meeting', '_blank')}
            >
              Book Your Builder Session
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            
            <p className="text-sm text-muted-foreground mt-4">
              No prep required. Just bring your real work.
            </p>
          </div>
        </div>
      </section>
      
      <Footer />
    </main>
  );
};

export default BuilderSession;

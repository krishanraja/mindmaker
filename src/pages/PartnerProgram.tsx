import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { TrendingUp, CheckCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { SEO } from "@/components/SEO";

const PartnerProgram = () => {
  const seoData = {
    title: "Partner Portfolio Program - AI Enablement for VCs and Advisors",
    description: "6-12 month program for VC funds, advisory firms, and consultancies. Portfolio-wide AI enablement with repeatable methods, co-branded assets, and direct expert access.",
    canonical: "/partner-program",
    keywords: "VC AI program, portfolio AI enablement, advisory AI, consultancy AI, investor AI tools, portfolio company AI, VC value creation, AI for advisors",
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "Service",
      "name": "Partner Portfolio Program",
      "description": "6-12 month program for VCs, advisors, and consultancies to enable AI across their portfolio with repeatable methods.",
      "provider": {
        "@type": "Organization",
        "name": "The Mindmaker",
        "url": "https://www.themindmaker.ai/"
      },
      "serviceType": "Partnership Program",
      "areaServed": "Worldwide",
      "audience": {
        "@type": "BusinessAudience",
        "audienceType": "VC Funds, Advisory Firms, Consultancies"
      },
      "duration": "P6M"
    }
  };

  const phases = [
    {
      title: "Portfolio Scan",
      description: "Use the Mindmaker scanner to score 5 to 20 companies across readiness, pressure and appetite. Receive a heatmap and a set of suggested first moves.",
    },
    {
      title: "First Wave",
      description: "Choose 3 to 5 companies for initial work. Run a 30-day Builder Sprint for a key leader in each, or an AI Leadership Lab for their exec team.",
    },
    {
      title: "Program",
      description: "Turn what worked into a standing offer in your fund or firm. Agree clear commercial terms so everyone benefits from repeat usage.",
    },
    {
      title: "Index",
      description: "Roll out the benchmark and tracking across your portfolio so you can talk about AI maturity with evidence, not hope.",
    },
  ];

  const benefits = [
    "Shared use of the Mindmaker methods and tools",
    "Co-branded assets you can take into board meetings and partner sessions",
    "Priority access for your portfolio to new experiments",
    "Direct access to Krish as a thinking partner on difficult accounts",
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
              FOR PARTNERS
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Partner Portfolio Program
            </h1>
            <div className="flex items-center justify-center gap-2 text-muted-foreground mb-6">
              <TrendingUp className="h-5 w-5" />
              <span className="text-lg">6-12 months</span>
            </div>
            <p className="text-xl text-foreground leading-relaxed max-w-3xl mx-auto">
              For VC funds, advisory firms and consultancies that want to be credible on AI 
              in front of their portfolio or client base without pretending to be a software company.
            </p>
          </div>
          
          {/* Who It's For */}
          <div className="minimal-card mb-12">
            <h2 className="text-2xl font-bold mb-4">Who It's For</h2>
            <p className="text-foreground leading-relaxed mb-4">
              <span className="font-semibold">Ideal partner:</span>
            </p>
            <ul className="space-y-2 text-foreground">
              <li>• Already trusted at board or founder level</li>
              <li>• Wants to move from slideware about AI to live experiments inside their portfolio</li>
              <li>• Sees AI literacy as a value creation lever but lacks a concrete method</li>
            </ul>
          </div>
          
          {/* Outcome */}
          <div className="minimal-card bg-mint/10 mb-12">
            <h2 className="text-2xl font-bold mb-4">Outcome</h2>
            <p className="text-foreground leading-relaxed mb-4">
              In 6 to 12 months you:
            </p>
            <ul className="space-y-3 text-foreground">
              <li>• Have a repeatable way to scan and prioritise companies for AI work</li>
              <li>• Co-create sprints and labs that you can bring into your portfolio</li>
              <li>• Share a simple dashboard that tracks adoption and pilots across companies</li>
              <li>• Strengthen your own brand as the place that makes AI useful, not noisy</li>
            </ul>
          </div>
          
          {/* How It Works */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6 text-center">How It Works</h2>
            <div className="space-y-4">
              {phases.map((phase, index) => (
                <div 
                  key={index} 
                  className="minimal-card fade-in-up"
                  style={{animationDelay: `${index * 0.05}s`}}
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-16 h-16 bg-ink text-white rounded-md flex items-center justify-center">
                      <span className="text-sm font-bold">Phase {index + 1}</span>
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
          
          {/* What You Get */}
          <div className="minimal-card mb-8">
            <h2 className="text-2xl font-bold mb-6">What You Get</h2>
            <div className="space-y-4">
              {benefits.map((item, index) => (
                <div key={index} className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-mint flex-shrink-0 mt-0.5" />
                  <p className="text-foreground">{item}</p>
                </div>
              ))}
            </div>
          </div>
          
          {/* CTA */}
          <Card className="p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Ready to Explore?</h2>
            <p className="text-foreground mb-6 leading-relaxed">
              Let's talk about how this could work for your portfolio or client base.
            </p>
            <Button 
              size="lg"
              className="bg-mint text-ink hover:bg-mint/90 font-bold text-lg"
              asChild
            >
              <a 
                href="https://calendly.com/krish-mindmaker/mindmaker-intro-call" 
                target="_blank" 
                rel="noopener noreferrer"
              >
                Schedule a Conversation
                <ArrowRight className="ml-2 h-5 w-5" />
              </a>
            </Button>
          </Card>
        </div>
      </section>
      
      <Footer />
    </main>
  );
};

export default PartnerProgram;

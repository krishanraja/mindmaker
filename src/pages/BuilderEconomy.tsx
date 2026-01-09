import { useState } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Radio, Video, FileText, ArrowRight } from "lucide-react";
import { SEO } from "@/components/SEO";
import { InitialConsultModal } from "@/components/InitialConsultModal";
import { useSessionData } from "@/contexts/SessionDataContext";

const BuilderEconomy = () => {
  const { sessionData } = useSessionData();
  const [consultModalOpen, setConsultModalOpen] = useState(false);
  
  const formats = [
    {
      icon: Radio,
      title: "Podcast",
      description: "Deep conversations with founders, leaders and operators who are building with AI in real companies.",
      cta: "Listen to Episodes",
      link: "#podcast",
    },
    {
      icon: Video,
      title: "Live Builder Rooms",
      description: "Open sessions where people bring one problem and watch it get redesigned live. Join the conversation.",
      cta: "Join Next Session",
      link: "#live",
    },
    {
      icon: FileText,
      title: "Written Briefings",
      description: "Short, sharp field notes from client work and experiments. Real insights, no fluff.",
      cta: "Read Briefings",
      link: "#briefings",
    },
  ];

  const seoData = {
    title: "The Builder Economy - AI Insights & Community",
    description: "Podcasts, live builder rooms, and written briefings on how leaders are building with AI. Real stories from practitioners, not hype.",
    canonical: "/builder-economy",
    keywords: "AI podcast, AI community, AI builders, AI insights, AI for leaders",
  };

  return (
    <main className="min-h-screen bg-background">
      <SEO {...seoData} />
      <Navigation />
      
      <section className="section-padding">
        <div className="container-width max-w-5xl">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              The Builder Economy
            </h1>
            <p className="text-xl text-foreground leading-relaxed max-w-3xl mx-auto">
              The media and community layer that feeds Mindmaker. 
              A long-running conversation about how people build with AI 
              in their own careers and companies.
            </p>
          </div>
          
          {/* Role */}
          <div className="minimal-card mb-12">
            <h2 className="text-2xl font-bold mb-4">Role in the System</h2>
            <p className="text-foreground leading-relaxed mb-4">
              The Builder Economy exists to:
            </p>
            <ul className="space-y-2 text-foreground">
              <li>• Attract people who are wired to build with AI, not just watch</li>
              <li>• Share real stories from practitioners, not hype merchants</li>
              <li>• Give future clients a low-friction way to get to know how Krish thinks</li>
            </ul>
          </div>
          
          {/* Formats */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-8 text-center">Formats</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {formats.map((format, index) => {
                const IconComponent = format.icon;
                return (
                  <div 
                    key={index}
                    className="minimal-card text-center fade-in-up"
                    style={{animationDelay: `${index * 0.1}s`}}
                  >
                    <div className="w-16 h-16 bg-mint/10 rounded-md flex items-center justify-center mx-auto mb-4">
                      <IconComponent className="h-8 w-8 text-mint" />
                    </div>
                    
                    <h3 className="text-xl font-bold text-foreground mb-3">
                      {format.title}
                    </h3>
                    
                    <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                      {format.description}
                    </p>
                    
                    <Button 
                      variant="outline"
                      className="w-full border-ink text-ink hover:bg-ink/5"
                      asChild
                    >
                      <a href={format.link}>{format.cta}</a>
                    </Button>
                  </div>
                );
              })}
            </div>
          </div>
          
          {/* Connection */}
          <div className="minimal-card bg-ink text-white mb-12">
            <h2 className="text-2xl font-bold mb-4">How It Connects to Mindmaker Offers</h2>
            <ul className="space-y-3 text-white/90">
              <li>• Every episode and live session points back to a simple next step: a Builder Session, a sprint, a lab or the partner program</li>
              <li>• Clients become guests once there is a story to tell, which closes the loop</li>
              <li>• Partners can invite their portfolio into live sessions as a safe first taste</li>
            </ul>
          </div>
          
          {/* What Visitors See */}
          <div className="minimal-card bg-mint/10 mb-12">
            <h2 className="text-2xl font-bold mb-4">What a New Visitor Sees</h2>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-8 h-8 bg-ink text-white rounded-full flex items-center justify-center font-bold">
                  1
                </div>
                <p className="text-foreground">
                  <span className="font-semibold">A clear promise:</span> this is about people who are using AI to build value in the real economy
                </p>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-8 h-8 bg-ink text-white rounded-full flex items-center justify-center font-bold">
                  2
                </div>
                <p className="text-foreground">
                  <span className="font-semibold">A simple path:</span> listen, join a live session, or book a Builder Session
                </p>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-8 h-8 bg-ink text-white rounded-full flex items-center justify-center font-bold">
                  3
                </div>
                <p className="text-foreground">
                  <span className="font-semibold">A tight narrative:</span> AI literacy is the new baseline for serious leaders, and this is where you build it
                </p>
              </div>
            </div>
          </div>
          
          {/* CTA */}
          <div className="text-center">
            <p className="text-lg text-muted-foreground mb-6">
              Ready to move from listening to building?
            </p>
            
            <Button 
              size="lg"
              className="bg-ink text-white hover:bg-ink/90 font-semibold px-12 py-6 text-lg touch-target group"
              onClick={() => setConsultModalOpen(true)}
            >
              Book a Builder Session
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </div>
      </section>
      
      <Footer />
      
      {/* Consult Modal */}
      <InitialConsultModal
        open={consultModalOpen}
        onOpenChange={setConsultModalOpen}
        preselectedProgram={sessionData.qualificationData?.preselectedProgram || "build"}
        commitmentLevel={sessionData.qualificationData?.commitmentLevel}
        audienceType={sessionData.qualificationData?.audienceType}
        pathType={sessionData.qualificationData?.pathType || "build"}
      />
    </main>
  );
};

export default BuilderEconomy;

import { Bot, Clock, Users, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const CoachSection = () => {
  const features = [
    {
      icon: Zap,
      title: "90-Day Executive Sprint",
      description: "Intensive program that transforms AI literacy into strategic execution capability"
    },
    {
      icon: Bot,
      title: "AI Agent Development", 
      description: "Build custom AI agents that solve real business problems - not just demos"
    },
    {
      icon: Users,
      title: "Cohort Experience",
      description: "Learn alongside other leaders facing similar challenges in intimate group settings"
    },
    {
      icon: Clock,
      title: "Always-On Coaching",
      description: "Interactive toolkit that maps your unique strengths to personalized service recommendations"
    }
  ];

  return (
    <section className="section-padding bg-muted/30">
      <div className="container-width">
        <div className="text-center mb-16 fade-in-up">
          <div className="flex items-center justify-center gap-4 mb-6">
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight">
              AI-Enabled{" "}
              <span className="text-primary">
                Coach & Advisor
              </span>
            </h2>
            <Badge variant="secondary" className="text-xs font-semibold px-3 py-1">
              Coming Soon
            </Badge>
          </div>
          <p className="text-base md:text-lg leading-relaxed text-muted-foreground max-w-3xl mx-auto mb-8">
            Soon, we'll be your AI-augmented advisory team that will combine human expertise 
            with intelligent tools for an always-on, always-improving coaching experience.
          </p>
          
          <div className="card p-8 max-w-4xl mx-auto mb-12">
            <blockquote className="text-lg md:text-xl leading-relaxed italic text-muted-foreground mb-4">
              "The future belongs to those who understand how to leverage AI as a thinking partner, 
              not just a productivity tool."
            </blockquote>
            <cite className="font-semibold text-foreground">
              — Krish, AI MindMaker Methodology Creator
            </cite>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {features.map((feature, index) => (
            <div key={index} className="card p-6 fade-in-up" style={{animationDelay: `${index * 0.1}s`}}>
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-primary text-white rounded-xl flex items-center justify-center">
                  <feature.icon className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wide text-foreground mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-sm font-normal leading-relaxed text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="text-center">
          <Button 
            size="lg"
            disabled
            className="bg-muted text-muted-foreground px-8 py-4 text-lg cursor-not-allowed"
          >
            Coming Soon - Stay Tuned
          </Button>
          <p className="text-sm text-muted-foreground mt-4">
            Our interactive toolkit will map your strengths to personalized recommendations
          </p>
        </div>
      </div>
    </section>
  );
};

export default CoachSection;
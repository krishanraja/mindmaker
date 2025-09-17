import { Bot, Clock, Users, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

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
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight mb-6">
            AI-Enabled{" "}
            <span className="text-primary">
              Coach & Advisor
            </span>
          </h2>
          <p className="text-base md:text-lg leading-relaxed text-muted-foreground max-w-3xl mx-auto mb-8">
            Not just another consultant. We're your AI-augmented advisory team that combines human expertise 
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
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
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
            className="bg-primary hover:bg-primary-600 text-white px-8 py-4 text-lg"
            onClick={() => window.location.href = 'mailto:krish@fractionl.ai?subject=AI-Enabled Coaching - Discovery Call'}
          >
            Start Your AI Transformation
          </Button>
          <p className="text-sm text-muted-foreground mt-4">
            Interactive toolkit maps your strengths to personalized recommendations
          </p>
        </div>
      </div>
    </section>
  );
};

export default CoachSection;
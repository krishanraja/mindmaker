import { Building2, Shield, Users, MessageSquareQuote } from "lucide-react";

const TrustSection = () => {
  const trustItems = [
    {
      icon: Building2,
      label: "Enterprises"
    },
    {
      icon: Shield,
      label: "Telcos"
    },
    {
      icon: Users,
      label: "Media Organizations"
    },
    {
      icon: MessageSquareQuote,
      label: "Scale-ups"
    }
  ];

  return (
    <section className="py-16 px-4 bg-purple-50">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            Trusted AI Literacy Infrastructure
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-6">
            Built for enterprises, telcos, media organizations and scale-ups that need leaders who can think clearly about AI.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 md:gap-8 text-sm text-foreground/80">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">90+</div>
              <div className="text-xs text-muted-foreground">Leadership systems built</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">50+</div>
              <div className="text-xs text-muted-foreground">Leaders with upgraded mental models</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">5-10</div>
              <div className="text-xs text-muted-foreground">hrs/week saved per leader</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">50%</div>
              <div className="text-xs text-muted-foreground">reduction in stalled pilots</div>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          {trustItems.map((item, index) => {
            const IconComponent = item.icon;
            return (
              <div
                key={index}
                className="flex flex-col items-center justify-center p-6 rounded-lg bg-card/30 backdrop-blur-sm border border-border/20 hover:border-primary/20 transition-all duration-300 hover:scale-105"
              >
                <IconComponent className="h-8 w-8 text-primary mb-3" />
                <span className="text-sm font-medium text-foreground/80 whitespace-nowrap">{item.label}</span>
              </div>
            );
          })}
        </div>
        
        <div className="text-center">
          <p className="text-base md:text-lg font-medium text-foreground/80 italic">
            "Vendors sell tools. Consultants sell strategy. Mindmaker builds the thinking infrastructure to evaluate both."
          </p>
        </div>
      </div>
    </section>
  );
};

export default TrustSection;
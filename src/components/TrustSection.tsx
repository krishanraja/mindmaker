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
            The World's First GenAI Literacy Accelerator
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Trusted by enterprises, telcos, media organizations and scale-ups worldwide.
          </p>
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
          <p className="text-sm text-muted-foreground">
            Testimonials and case studies<br className="sm:hidden" /> available upon request
          </p>
        </div>
      </div>
    </section>
  );
};

export default TrustSection;
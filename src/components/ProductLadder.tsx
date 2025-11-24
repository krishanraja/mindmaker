import { Button } from "@/components/ui/button";
import { Clock, Calendar, Users, TrendingUp } from "lucide-react";

const ProductLadder = () => {
  const products = [
    {
      icon: Clock,
      label: "ENTRY",
      title: "Builder Session",
      duration: "60 minutes",
      description: "Live session with Krish. Bring one real leadership problem. Leave with an AI friction map, 1-2 draft systems, and written follow-up with prompts.",
      cta: "Book Session",
      link: "/builder-session",
      featured: true,
    },
    {
      icon: Calendar,
      label: "LEADERS",
      title: "30-Day Builder Sprint",
      duration: "4 weeks",
      description: "For senior leaders. Build 3-5 working AI-enabled systems around your actual week. Leave with a Builder Dossier and 90-day plan.",
      pricing: "$5-8K USD",
      cta: "Learn More",
      link: "/builder-sprint",
    },
    {
      icon: Users,
      label: "TEAMS",
      title: "AI Leadership Lab",
      duration: "4 hours",
      description: "For 6-12 executives. Run two real decisions through a new AI-enabled way of working. Leave with a 90-day pilot charter.",
      pricing: "$10-20K USD",
      cta: "Learn More",
      link: "/leadership-lab",
    },
    {
      icon: TrendingUp,
      label: "PARTNERS",
      title: "Portfolio Program",
      duration: "6-12 months",
      description: "For VCs, advisors, consultancies. Repeatable way to scan and prioritize your portfolio for AI work. Co-create sprints and labs.",
      pricing: "Retainer or Revenue Share",
      cta: "Learn More",
      link: "/partner-program",
    },
  ];

  return (
    <section className="section-padding bg-background">
      <div className="container-width">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            The Product Ladder
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed max-w-3xl mx-auto">
            From a 60-minute entry session to portfolio-wide transformation
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-6 max-w-6xl mx-auto">
          {products.map((product, index) => {
            const IconComponent = product.icon;
            return (
              <div 
                key={index}
                className={`${product.featured ? 'premium-card' : 'minimal-card'} fade-in-up`}
                style={{animationDelay: `${index * 0.1}s`}}
              >
                {product.featured && (
                  <div className="inline-block bg-gold text-white text-xs font-bold px-3 py-1 rounded-full mb-4 shadow-lg">
                    ⭐ RECOMMENDED
                  </div>
                )}
                
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 bg-ink text-white rounded-md flex items-center justify-center flex-shrink-0">
                    <IconComponent className="h-6 w-6" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-muted-foreground mb-1">
                      {product.label}
                    </div>
                    <h3 className="text-xl font-bold text-foreground">
                      {product.title}
                    </h3>
                    <div className="text-sm text-muted-foreground">
                      {product.duration}
                    </div>
                  </div>
                </div>
                
                <p className="text-sm text-foreground leading-relaxed mb-4">
                  {product.description}
                </p>
                
                {product.pricing && (
                  <div className="text-sm font-semibold text-primary mb-4">
                    {product.pricing}
                  </div>
                )}
                
                <Button 
                  className={product.featured ? "w-full bg-gold text-white hover:bg-gold-light font-bold shadow-lg" : "w-full"}
                  size="lg"
                  onClick={() => window.location.href = product.link}
                >
                  {product.cta}
                </Button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ProductLadder;

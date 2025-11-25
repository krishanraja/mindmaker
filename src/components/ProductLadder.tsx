import { Button } from "@/components/ui/button";
import { User, Users, TrendingUp } from "lucide-react";

const ProductLadder = () => {
  const tracks = [
    {
      icon: User,
      label: "1-1 LEADERS",
      title: "Individual Builder Journey",
      offerings: [
        {
          name: "Drop In Builder Session",
          duration: "60 minutes",
          description: "Live session with Krish. Bring one real leadership problem. Leave with an AI friction map, 1-2 draft systems, and written follow-up with prompts.",
          cta: "Book Session",
          link: "/builder-session",
          featured: true,
        },
        {
          name: "Curated Weekly Updates",
          duration: "4 weeks async",
          description: "Weekly recommendations and async access to Krish. Stay current on what matters for your context. Build at your own pace.",
          cta: "Learn More",
          link: "/builder-session",
        },
        {
          name: "30-Day Builder Sprint",
          duration: "4 weeks intensive",
          description: "For senior leaders. Build 3-5 working AI-enabled systems around your actual week. Leave with a Builder Dossier and 90-day plan.",
          cta: "Learn More",
          link: "/builder-sprint",
        },
      ],
    },
    {
      icon: Users,
      label: "EXEC TEAMS",
      title: "Team Transformation",
      offerings: [
        {
          name: "AI Leadership Lab",
          duration: "2-8 hours",
          description: "For 6-12 executives. Run two real decisions through a new AI-enabled way of working. Leave with a 90-day pilot charter.",
          cta: "Learn More",
          link: "/leadership-lab",
        },
      ],
    },
    {
      icon: TrendingUp,
      label: "PARTNERS",
      title: "Portfolio-Wide Programs",
      offerings: [
        {
          name: "Portfolio Program",
          duration: "6-12 months",
          description: "For VCs, advisors, consultancies. Repeatable way to scan and prioritize your portfolio for AI work. Co-create sprints and labs.",
          cta: "Learn More",
          link: "/partner-program",
        },
      ],
    },
  ];

  return (
    <section className="section-padding bg-background" id="products">
      <div className="container-width">
        <div className="text-center mb-8 sm:mb-12 px-4 sm:px-0">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6">
            Choose Your Builder Journey
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-3xl mx-auto">
            From 60-minute sessions to portfolio-wide transformation
          </p>
        </div>
        
        <div className="space-y-12 max-w-6xl mx-auto px-4 sm:px-0">
          {tracks.map((track, trackIndex) => {
            const IconComponent = track.icon;
            return (
              <div key={trackIndex} className="fade-in-up" style={{animationDelay: `${trackIndex * 0.1}s`}}>
                {/* Track Header */}
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-ink text-white rounded-md flex items-center justify-center flex-shrink-0">
                    <IconComponent className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-muted-foreground">
                      {track.label}
                    </div>
                    <h3 className="text-xl font-bold text-foreground">
                      {track.title}
                    </h3>
                  </div>
                </div>

                {/* Track Offerings */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {track.offerings.map((offering, offeringIndex) => (
                    <div 
                      key={offeringIndex}
                      className={`${offering.featured ? 'premium-card' : 'minimal-card'}`}
                    >
                      {offering.featured && (
                        <div className="inline-block bg-mint text-ink text-xs font-bold px-3 py-1 rounded-full mb-4 shadow-lg">
                          ⭐ RECOMMENDED
                        </div>
                      )}
                      
                      <h4 className="text-lg font-bold text-foreground mb-2">
                        {offering.name}
                      </h4>
                      <div className="text-xs text-muted-foreground mb-3">
                        {offering.duration}
                      </div>
                      
                      <p className="text-sm leading-relaxed mb-4 text-foreground">
                        {offering.description}
                      </p>
                      
                      <Button 
                        size="lg"
                        variant={offering.featured ? "mint" : "default"}
                        className={`w-full touch-target ${offering.featured 
                          ? "font-semibold shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5" 
                          : ""
                        }`}
                        onClick={() => window.location.href = offering.link}
                      >
                        {offering.cta}
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ProductLadder;

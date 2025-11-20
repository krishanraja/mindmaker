import { AlertTriangle, Clock, DollarSign, Users } from "lucide-react";
import { useScrollTrigger } from "@/hooks/useScrollTrigger";
import LiveStatsPopup from "@/components/LiveStatsPopup";
import ResponsiveCardGrid from "@/components/ResponsiveCardGrid";
import { useState, useEffect, useCallback } from "react";

const ProblemSection = () => {
  const { elementRef, isVisible } = useScrollTrigger({ threshold: 0.4 });
  const [showPopup, setShowPopup] = useState(false);

  // Show popup when section becomes visible
  useEffect(() => {
    if (isVisible) {
      setShowPopup(true);
    }
  }, [isVisible]);

  // Memoize onClose callback to prevent recreation
  const handleClosePopup = useCallback(() => {
    setShowPopup(false);
  }, []);

  const infrastructureGaps = [
    {
      title: "You Can't Tell What's Real Anymore",
      description: "Leaders sit through vendor demos and nod along—but don't know what questions to ask or how to spot the bullshit.",
      impact: "70% of AI pilots fail because execs can't tell substance from sales pitch—so they fund the wrong things.",
      icon: Users,
    },
    {
      title: "Your Team Isn't on the Same Page",
      description: "Your exec team has five different views on AI—some excited, some skeptical, everyone using different words.",
      impact: "Even good AI pilots collapse when your team can't agree on what success looks like.",
      icon: AlertTriangle,
    },
    {
      title: "Workshops That Fade Fast",
      description: "You've sent teams to AI training. They came back excited for a week, then it all evaporated. Nothing actually changed.",
      impact: "Most training fades in weeks because it's not connected to real work. No way to tell if anyone's actually getting better.",
      icon: Clock,
    },
  ];

  return (
    <section ref={elementRef} className="section-padding bg-background">
      <div className="container-width">
        <div className="text-center mb-16 fade-in-up">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-6">
            <span className="text-destructive">70% of AI pilots fail</span>
            <br />
            <span className="text-foreground">because leaders can't tell what's real</span>
          </h2>
        </div>
        
        <ResponsiveCardGrid 
          desktopGridClass="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16"
          className="mb-16"
        >
          {infrastructureGaps.map((item, index) => (
            <div key={index} className="card p-4 sm:p-6 lg:p-8 fade-in-up h-full flex flex-col" style={{animationDelay: `${index * 0.1}s`}}>
              <div className="inline-flex items-center justify-center w-16 h-16 bg-destructive text-white rounded-xl mb-6">
                <item.icon className="h-8 w-8" />
              </div>
              
              <h3 className="text-xl font-bold text-foreground mb-3">
                {item.title}
              </h3>
              
              <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                {item.description}
              </p>
              
              <p className="text-sm text-destructive leading-relaxed mt-auto pt-4 border-t border-border font-medium">
                {item.impact}
              </p>
            </div>
          ))}
        </ResponsiveCardGrid>

        {/* Quote Section */}
        <div className="glass-card p-8 md:p-12 max-w-4xl mx-auto text-center fade-in-up">
          <p className="text-base md:text-lg text-muted-foreground italic">
            Most teams sit through demos that fade. We build the system that lets you see through them.
          </p>
        </div>
      </div>

      {/* Live Stats Popup */}
      <LiveStatsPopup 
        isVisible={showPopup} 
        onClose={handleClosePopup} 
      />
    </section>
  );
};

export default ProblemSection;
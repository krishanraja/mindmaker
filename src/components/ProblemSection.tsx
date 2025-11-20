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
      gap: "Cognitive Infrastructure",
      problem: "Operating from Hype, Not Mental Models",
      impact: "70% of GenAI pilots stall because leaders lack the cognitive scaffolding to spot substance vs theatre",
      solution: "Build mental infrastructure for AI decisions, not just awareness",
      icon: Users,
    },
    {
      gap: "Baseline System", 
      problem: "No Way to Map How Leaders Think",
      impact: "Organizations invest in AI but have no baseline showing how leadership actually decides when AI is involved",
      solution: "Establish cognitive baseline with diagnostic to track decision clarity",
      icon: AlertTriangle,
    },
    {
      gap: "Compounding Infrastructure",
      problem: "Workshops Don't Build Lasting Patterns", 
      impact: "Sessions fade within weeks. Mental models leave no lasting infrastructure",
      solution: "Practice on real decisions until thinking patterns become instinct",
      icon: Clock,
    },
  ];

  return (
    <section ref={elementRef} className="section-padding bg-background">
      <div className="container-width">
        <div className="text-center mb-16 fade-in-up">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-6">
            <span className="text-destructive">70% of GenAI pilots stall</span>
            <br />
            <span className="text-foreground">because leadership operates from hype, not capability</span>
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
              
              <h3 className="text-xs font-bold text-destructive/60 tracking-wider mb-2 uppercase">
                {item.gap}
              </h3>
              
              <h4 className="text-xl font-bold text-foreground mb-4">
                {item.problem}
              </h4>
              
              <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                <strong className="text-destructive">Impact:</strong> {item.impact}
              </p>
              
              <p className="text-sm text-foreground leading-relaxed mt-auto pt-4 border-t border-border">
                <strong>Solution:</strong> {item.solution}
              </p>
            </div>
          ))}
        </ResponsiveCardGrid>

        {/* Quote Section */}
        <div className="glass-card p-8 md:p-12 max-w-4xl mx-auto text-center fade-in-up">
          <blockquote className="text-xl md:text-2xl font-bold text-foreground mb-6">
            "Vendors sell tools. Consultants sell strategy. Mindmaker builds the thinking infrastructure to evaluate both."
          </blockquote>
          <p className="text-base md:text-lg text-muted-foreground">
            The gap isn't tools or advice—it's cognitive infrastructure that lets leaders think clearly about AI.
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
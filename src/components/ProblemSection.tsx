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
      gap: "Capability Infrastructure",
      problem: "Operating from Hype, Not Capability",
      impact: "70% of GenAI pilots stall because teams lack the fundamental infrastructure to execute",
      solution: "Build leadership capability systems, not just awareness",
      icon: Users,
    },
    {
      gap: "Performance System", 
      problem: "No Way to Measure AI Leadership",
      impact: "Organizations invest in AI training but have no metrics to track leadership effectiveness",
      solution: "Deploy AI Leadership Index™ to baseline and track real progress",
      icon: AlertTriangle,
    },
    {
      gap: "Compounding Framework",
      problem: "One-Off Interventions Don't Scale", 
      impact: "Training fades within weeks. Pilots don't compound into capabilities",
      solution: "Integrate Literacy-to-Leverage Loop™ into daily operations",
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
            "Most teams sit through demos that fade."
          </blockquote>
          <p className="text-base md:text-lg text-muted-foreground">
            The market doesn't need more AI courses — it needs leaders who can lead with AI.
            That's why we built the Mindmaker system.
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
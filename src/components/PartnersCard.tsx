import { Button } from "@/components/ui/button";
import { Users, ArrowRight } from "lucide-react";

const PartnersCard = () => {
  return (
    <div className="glass-card p-8 fade-in-up hover:scale-105 transition-all duration-300 flex flex-col h-full">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <div className="text-xs font-bold text-primary/60 tracking-wider">
            SCALE
          </div>
          <div className="text-xs font-medium text-muted-foreground/80">
            Investors/Consultants/Educators
          </div>
        </div>
        <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center mb-4">
          <Users className="h-6 w-6 text-white" />
        </div>
        <h3 className="text-2xl font-bold text-foreground mb-2">
          Partner Program License
        </h3>
        <p className="text-sm text-muted-foreground mb-4">
          License the Mindmaker Method; roll up portfolio/team AI Leadership Index; co-deliver Sprints
        </p>
        <p className="text-xs text-primary/80 italic mb-2">
          Use our portfolio scoring tool to assess 1-10 companies and generate co-delivery plans with heatmap visualization.
        </p>
      </div>

      {/* Timeline & Investment */}
      <div className="flex items-center justify-between mb-6 pb-6 border-b border-border">
        <div>
          <div className="text-xs text-muted-foreground mb-1">Timeline</div>
          <div className="text-sm font-semibold text-foreground">Annual</div>
        </div>
        <div className="text-right">
          <div className="text-xs text-muted-foreground mb-1">Investment</div>
          <div className="text-sm font-semibold text-primary">Custom</div>
        </div>
      </div>

      {/* Deliverables */}
      <div className="flex-grow mb-6">
        <div className="text-sm font-semibold text-foreground mb-3">What You Get:</div>
        <ul className="space-y-2">
          <li className="flex items-start gap-2 text-sm text-muted-foreground">
            <span className="text-primary mt-0.5">•</span>
            <span>License the Mindmaker Method™ for your organization</span>
          </li>
          <li className="flex items-start gap-2 text-sm text-muted-foreground">
            <span className="text-primary mt-0.5">•</span>
            <span>Roll up portfolio/team AI Leadership Index™ dashboard</span>
          </li>
          <li className="flex items-start gap-2 text-sm text-muted-foreground">
            <span className="text-primary mt-0.5">•</span>
            <span>Co-deliver Sprints with expert enablement</span>
          </li>
        </ul>
      </div>

      {/* Credits Badge */}
      <div className="mb-6">
        <div className="inline-flex items-center bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-semibold">
          200+ Credits
        </div>
      </div>

      {/* CTA */}
      <div className="space-y-2">
        <Button 
          variant="hero-primary" 
          size="lg" 
          className="w-full group"
          onClick={() => window.location.href = '/partners-interest'}
        >
          Register Portfolio Interest
          <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
        </Button>
        <p className="text-xs text-center text-muted-foreground/70">
          Includes access to portfolio assessment tool
        </p>
      </div>
    </div>
  );
};

export default PartnersCard;

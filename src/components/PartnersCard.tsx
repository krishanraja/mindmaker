import { Button } from "@/components/ui/button";
import { Users, ArrowRight } from "lucide-react";

const PartnersCard = () => {
  return (
    <div className="glass-card p-8 fade-in-up hover:scale-105 transition-all duration-300 flex flex-col">
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
      </div>

      {/* Key Benefits */}
      <div className="flex-grow mb-6">
        <div className="text-sm font-semibold text-foreground mb-3">Program Benefits:</div>
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

      {/* CTAs */}
      <div className="space-y-3">
        <Button 
          variant="hero-primary" 
          size="lg" 
          className="w-full group"
          onClick={() => window.location.href = '/partners-interest'}
        >
          Register Portfolio Interest
          <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
        </Button>
        
        <Button 
          variant="outline" 
          size="lg" 
          className="w-full"
          onClick={() => window.open('mailto:krish@mindmaker.ai?subject=Partner Enablement Pack Request', '_blank')}
        >
          Request Enablement Pack
        </Button>
      </div>
    </div>
  );
};

export default PartnersCard;

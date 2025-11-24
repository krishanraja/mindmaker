import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { TrendingUp, Clock, Zap } from "lucide-react";

const InteractiveROI = () => {
  const [hoursPerWeek, setHoursPerWeek] = useState([15]);
  
  const calculateSavings = () => {
    const hours = hoursPerWeek[0];
    const potentialSavings = Math.round(hours * 0.4); // 40% time savings
    const monthlyHours = potentialSavings * 4;
    const yearlyHours = monthlyHours * 12;
    
    return { potentialSavings, monthlyHours, yearlyHours };
  };
  
  const { potentialSavings, monthlyHours, yearlyHours } = calculateSavings();

  return (
    <section className="section-padding bg-background">
      <div className="container-width">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              See your potential time savings
            </h2>
            <p className="text-lg text-muted-foreground">
              Most leaders spend 10-20 hours per week on strategic decisions. See what AI systems could give you back.
            </p>
          </div>
          
          <div className="premium-card bg-gradient-to-br from-ink/5 to-mint/5">
            {/* Interactive Slider */}
            <div className="mb-8">
              <label className="text-sm font-semibold text-foreground block mb-4">
                Hours per week on strategic decisions, planning, and analysis:
              </label>
              
              <div className="flex items-center gap-6">
                <Slider
                  value={hoursPerWeek}
                  onValueChange={setHoursPerWeek}
                  min={5}
                  max={40}
                  step={1}
                  className="flex-1"
                />
                <div className="text-3xl font-bold text-ink w-20 text-right">
                  {hoursPerWeek[0]}h
                </div>
              </div>
            </div>
            
            {/* Results Display */}
            <div className="grid md:grid-cols-3 gap-4 mb-8">
              <div className="minimal-card bg-background text-center">
                <Clock className="h-8 w-8 text-mint mx-auto mb-2" />
                <div className="text-2xl font-bold text-foreground mb-1">
                  {potentialSavings}h
                </div>
                <div className="text-xs text-muted-foreground">
                  Saved per week
                </div>
              </div>
              
              <div className="minimal-card bg-background text-center">
                <TrendingUp className="h-8 w-8 text-gold mx-auto mb-2" />
                <div className="text-2xl font-bold text-foreground mb-1">
                  {monthlyHours}h
                </div>
                <div className="text-xs text-muted-foreground">
                  Saved per month
                </div>
              </div>
              
              <div className="minimal-card bg-background text-center">
                <Zap className="h-8 w-8 text-ink mx-auto mb-2" />
                <div className="text-2xl font-bold text-foreground mb-1">
                  {yearlyHours}h
                </div>
                <div className="text-xs text-muted-foreground">
                  Saved per year
                </div>
              </div>
            </div>
            
            {/* Value Proposition */}
            <div className="border-t border-border pt-6">
              <p className="text-sm text-muted-foreground mb-4 text-center">
                That's <strong className="text-foreground">{Math.round(yearlyHours / 40)} weeks</strong> of work you could redirect to higher-impact activities
              </p>
              
              <Button 
                size="lg"
                className="w-full bg-gold text-white hover:bg-gold-light font-bold shadow-lg"
                onClick={() => window.open('https://calendly.com/krish-raja/mindmaker-meeting', '_blank')}
              >
                Book a Session to See How →
              </Button>
            </div>
          </div>
          
          {/* Disclaimer */}
          <p className="text-xs text-muted-foreground text-center mt-6">
            * Time savings based on average results from 90+ leadership teams. Individual results vary based on current workflows and implementation depth.
          </p>
        </div>
      </div>
    </section>
  );
};

export default InteractiveROI;

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Sparkles } from "lucide-react";

interface InitialConsultModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  preselectedProgram?: string;
}

export const InitialConsultModal = ({ open, onOpenChange, preselectedProgram }: InitialConsultModalProps) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [selectedProgram, setSelectedProgram] = useState(preselectedProgram || "");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const programs = [
    { 
      value: "builder-session", 
      label: "Builder Session", 
      subtitle: "60 min one-off",
      price: "$348",
      originalPrice: "$497",
      priceId: "price_1SXSnwHGqJqsGEJL2K4m8nXV"
    },
    { 
      value: "builder-sprint", 
      label: "30-Day Builder Sprint", 
      subtitle: "4 weeks intensive",
      price: "$2,098",
      originalPrice: "$2,997",
      priceId: "price_1SXSoFHGqJqsGEJLfHZbf6BP"
    },
    { 
      value: "leadership-lab", 
      label: "AI Leadership Lab", 
      subtitle: "Team workshop",
      price: "$7,000",
      originalPrice: "$10,000",
      priceId: "price_1SXSofHGqJqsGEJLkxNwgoqd"
    },
    { 
      value: "partner-program", 
      label: "Portfolio Partner Program", 
      subtitle: "6-12 months",
      price: "Free consultation",
      priceId: null
    },
    { 
      value: "not-sure", 
      label: "Not sure yet - help me decide", 
      subtitle: "Exploration call",
      price: null,
      priceId: null
    },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !email || !selectedProgram) {
      toast({
        title: "Missing information",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const selectedProgramData = programs.find(p => p.value === selectedProgram);
      
      // For partner program, go directly to Calendly
      if (selectedProgram === 'partner-program') {
        const calendlyUrl = `https://calendly.com/krish-raja/mindmaker-meeting?name=${encodeURIComponent(name)}&email=${encodeURIComponent(email)}&prefill_email=${encodeURIComponent(email)}&prefill_name=${encodeURIComponent(name)}&a1=${encodeURIComponent(selectedProgram)}`;
        window.open(calendlyUrl, '_blank');
        onOpenChange(false);
        toast({
          title: "Opening Calendly",
          description: "Booking your partner consultation...",
        });
        return;
      }

      console.log('Invoking edge function with:', { name, email, selectedProgram });
      
      const { data, error } = await supabase.functions.invoke('create-consultation-hold', {
        body: { 
          name, 
          email, 
          selectedProgram,
          priceId: selectedProgramData?.priceId
        }
      });

      console.log('Edge function response:', { data, error });

      if (error) {
        console.error('Edge function error:', error);
        throw error;
      }

      if (data?.url) {
        console.log('Opening checkout URL:', data.url);
        window.open(data.url, '_blank');
        onOpenChange(false);
        toast({
          title: "Redirecting to checkout",
          description: "Opening Stripe checkout in a new tab...",
        });
      } else {
        throw new Error('No checkout URL returned from server');
      }
    } catch (error) {
      console.error('Error creating checkout:', error);
      toast({
        title: "Booking error",
        description: error instanceof Error ? error.message : "Please try again or contact support",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[520px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Book Your Initial Consult</DialogTitle>
          <DialogDescription className="text-base">
            45 minutes to map your outcomes • Zero pressure • Real conversation
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          {/* Program Selection */}
          <div className="space-y-3">
            <Label className="text-sm font-semibold">What are you most interested in?</Label>
            <RadioGroup value={selectedProgram} onValueChange={setSelectedProgram}>
              {programs.map((program) => (
                <div key={program.value} className="flex items-start space-x-3 space-y-0">
                  <RadioGroupItem value={program.value} id={program.value} className="mt-1" />
                  <Label 
                    htmlFor={program.value} 
                    className="font-normal cursor-pointer flex-1 leading-tight"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="font-semibold block">{program.label}</span>
                        <span className="text-xs text-muted-foreground">{program.subtitle}</span>
                      </div>
                      {program.price && (
                        <div className="text-right">
                          {program.originalPrice && (
                            <span className="text-xs text-muted-foreground line-through block">{program.originalPrice}</span>
                          )}
                          <span className={`text-sm font-bold ${program.originalPrice ? 'text-mint' : ''}`}>
                            {program.price}
                          </span>
                        </div>
                      )}
                    </div>
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          {/* Name & Email */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                required
              />
            </div>
          </div>

          {/* Value Props */}
          <div className="bg-muted/50 rounded-lg p-4 space-y-2 border border-border/50">
            {selectedProgram === 'partner-program' ? (
              <div className="flex items-start gap-2 text-sm">
                <span className="text-lg">🎯</span>
                <div>
                  <span className="font-semibold">Partner Program</span>
                  <span className="text-muted-foreground"> • Free consultation for portfolio partners • Direct booking</span>
                </div>
              </div>
            ) : (
              <div className="flex items-start gap-2 text-sm">
                <span className="text-lg">🔒</span>
                <div>
                  <span className="font-semibold">$50 hold</span>
                  <span className="text-muted-foreground"> • Fully refundable if not satisfied • Deducted from any program you choose</span>
                </div>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <Button 
            type="submit" 
            className="w-full bg-mint text-ink hover:bg-mint/90 font-bold text-lg py-6"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                Reserve My Spot
                <Sparkles className="ml-2 h-5 w-5" />
              </>
            )}
          </Button>

          {/* Urgency Element */}
          <p className="text-center text-sm text-muted-foreground">
            ⚡ <span className="font-semibold text-mint-dark">Holiday Special: 30% off</span> for Individuals & Teams through December
          </p>
        </form>
      </DialogContent>
    </Dialog>
  );
};

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { ArrowRight, Lock, DollarSign } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface ConsultationBookingProps {
  variant?: 'default' | 'compact';
  preselectedProgram?: string;
}

export const ConsultationBooking = ({ variant = 'default', preselectedProgram }: ConsultationBookingProps) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !email) {
      toast({
        title: "Missing Information",
        description: "Please enter your name and email",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      // Call edge function to create Stripe Checkout session
      const { data, error } = await supabase.functions.invoke('create-consultation-hold', {
        body: { name, email, selectedProgram: preselectedProgram || 'not-specified' }
      });

      if (error) throw error;

      if (data?.url) {
        // Redirect to Stripe Checkout
        window.location.href = data.url;
      } else {
        throw new Error('No checkout URL returned');
      }
    } catch (error: any) {
      console.error('Error:', error);
      toast({
        title: "Booking Error",
        description: error.message || "Failed to create booking. Please try again.",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  if (variant === 'compact') {
    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Input
            type="text"
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={isLoading}
            required
          />
        </div>
        <div className="space-y-2">
          <Input
            type="email"
            placeholder="Your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isLoading}
            required
          />
        </div>
        <Button
          type="submit"
          className="w-full bg-ink text-white hover:bg-ink/90 font-semibold"
          disabled={isLoading}
        >
          {isLoading ? "Processing..." : "Book Free Consultation ($50 hold)"}
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
        <p className="text-xs text-muted-foreground text-center">
          $50 refundable hold • Deducted from final service price
        </p>
      </form>
    );
  }

  return (
    <Card className="p-6 md:p-8 max-w-2xl mx-auto">
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-mint/20 mb-4">
          <DollarSign className="w-8 h-8 text-mint" />
        </div>
        <h3 className="text-2xl font-bold mb-2">Book Your Initial Consult</h3>
        <p className="text-muted-foreground">
          45 minutes to map your outcomes • Zero pressure • Real conversation
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Full Name</Label>
          <Input
            id="name"
            type="text"
            placeholder="John Smith"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={isLoading}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email Address</Label>
          <Input
            id="email"
            type="email"
            placeholder="john@company.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isLoading}
            required
          />
        </div>

        <div className="bg-muted/50 rounded-lg p-4 space-y-3 border border-border/50">
          <div className="flex items-start gap-2 text-sm">
            <span className="text-lg">🔒</span>
            <div>
              <span className="font-semibold">$50 hold</span>
              <span className="text-muted-foreground"> • Fully refundable if not satisfied • Deducted from any program you choose</span>
            </div>
          </div>
          <div className="flex items-start gap-2 text-sm">
            <span className="text-lg">⚡</span>
            <div>
              <span className="font-semibold text-mint">Holiday rates available</span>
              <span className="text-muted-foreground"> through December</span>
            </div>
          </div>
        </div>

        <Button
          type="submit"
          size="lg"
          className="w-full bg-mint text-ink hover:bg-mint/90 font-bold text-lg py-6"
          disabled={isLoading}
        >
          {isLoading ? "Processing..." : "Reserve My Spot"}
          <ArrowRight className="ml-2 h-5 w-5" />
        </Button>

        <p className="text-center text-sm text-muted-foreground mt-4">
          No prep required. Just bring your real work.
        </p>
      </form>
    </Card>
  );
};

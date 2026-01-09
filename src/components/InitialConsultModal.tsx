import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2, ArrowRight } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useSessionData } from "@/contexts/SessionDataContext";
import { openCalendlyPopup } from "@/utils/calendly";

interface InitialConsultModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  preselectedProgram?: string;
  commitmentLevel?: string;
  audienceType?: "individual" | "team";
  pathType?: "build" | "orchestrate";
}

export const InitialConsultModal = ({ 
  open, 
  onOpenChange, 
  preselectedProgram, 
  commitmentLevel,
  audienceType,
  pathType 
}: InitialConsultModalProps) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [selectedPath, setSelectedPath] = useState(preselectedProgram || "");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const { sessionData } = useSessionData();

  // Auto-select path if provided
  useEffect(() => {
    if (preselectedProgram && !selectedPath) {
      setSelectedPath(preselectedProgram);
    }
  }, [preselectedProgram, selectedPath]);

  const pathOptions = [
    { 
      value: "build", 
      label: "I want to build with AI myself",
      helper: "Requires hands-on work and habit change."
    },
    { 
      value: "orchestrate", 
      label: "I want to orchestrate AI as an executive",
      helper: "Focused on decision control, not building tools."
    },
    { 
      value: "team", 
      label: "I'm booking for a leadership team",
      helper: "Facilitated decision reset for exec teams."
    },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // If preselectedProgram is provided, selectedPath is optional
    const pathRequired = !preselectedProgram;
    
    if (!name || !email || !jobTitle || (pathRequired && !selectedPath)) {
      toast({
        title: "Missing information",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const selectedPathData = pathOptions.find(p => p.value === selectedPath);
      
      // Determine the program value to send
      const programValue = preselectedProgram || selectedPath || 'not-sure';
      
      // Send enriched lead email with all context
      const { data: emailData, error: emailError } = await supabase.functions.invoke('send-lead-email', {
        body: {
          name,
          email,
          jobTitle,
          selectedProgram: programValue,
          commitmentLevel: commitmentLevel,
          audienceType: audienceType,
          pathType: pathType,
          sessionData
        }
      });

      // Check for errors in multiple places
      const emailFailed = emailError || (emailData && emailData.error);
      
      if (emailFailed) {
        console.error('Email error:', emailError || emailData?.error);
        toast({
          title: "Email notification failed",
          description: "Your booking will proceed, but we couldn't send a confirmation email. Please contact us if needed.",
          variant: "destructive",
        });
        // Still proceed to Calendly, but user is informed
      }
      
      // Open Calendly popup with commitmentLevel
      try {
        await openCalendlyPopup({
          name,
          email,
          source: 'initial-consult',
          preselectedProgram: programValue,
          commitmentLevel: commitmentLevel,
        });
        
        onOpenChange(false);
        toast({
          title: "Opening Calendly",
          description: "Booking your consultation...",
        });
      } catch (calendlyError) {
        console.error('Calendly error:', calendlyError);
        toast({
          title: "Booking Error",
          description: "Could not open booking page. Please try again or contact support.",
          variant: "destructive",
        });
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

  const formContent = (
    <form onSubmit={handleSubmit} className="space-y-6 mt-4 px-1 sm:px-0">
      {/* Path Selection - Required First Question (only show if not pre-selected) */}
      {!preselectedProgram && (
        <div className="space-y-3">
          <Label className="text-sm font-semibold">How do you want to work with AI?</Label>
          <RadioGroup value={selectedPath} onValueChange={setSelectedPath}>
            {pathOptions.map((path) => (
              <div key={path.value} className="flex items-start space-x-3 space-y-0">
                <RadioGroupItem value={path.value} id={path.value} className="mt-1" />
                <Label 
                  htmlFor={path.value} 
                  className="font-normal cursor-pointer flex-1 leading-tight"
                >
                  <div>
                    <span className="font-semibold block">{path.label}</span>
                  </div>
                </Label>
              </div>
            ))}
          </RadioGroup>
          
          {/* Conditional helper text based on selection */}
          {selectedPath && (
            <div className="pl-7 py-2 px-3 bg-muted/50 rounded-md border border-border/50">
              <p className="text-sm text-muted-foreground">
                {pathOptions.find(p => p.value === selectedPath)?.helper}
              </p>
            </div>
          )}
        </div>
      )}
      
      {/* Show commitment level if provided */}
      {commitmentLevel && (
        <div className="bg-mint/10 border border-mint/30 rounded-lg p-4">
          <p className="text-sm font-semibold text-foreground mb-1">Selected Commitment:</p>
          <p className="text-sm text-muted-foreground">
            {commitmentLevel === "1hr" ? "1 Hour Session" :
             commitmentLevel === "3hr" ? "3 Hour Session" :
             commitmentLevel === "4wk" ? "4 Week Program" :
             commitmentLevel === "90d" ? "90 Day Program" :
             commitmentLevel}
          </p>
        </div>
      )}

      {/* Name, Job Title & Email */}
      <div className="space-y-4">
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
          <Label htmlFor="jobTitle">Job Title</Label>
          <Input
            id="jobTitle"
            value={jobTitle}
            onChange={(e) => setJobTitle(e.target.value)}
            placeholder="e.g. CEO, VP of Operations"
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
        <div className="flex items-start gap-2 text-sm">
          <span className="text-lg">🎯</span>
          <div>
            <span className="font-semibold">Free consultation</span>
            <span className="text-muted-foreground"> • 45 minutes to map your outcomes • Zero pressure • Real conversation</span>
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <Button 
        type="submit" 
        className="w-full bg-mint text-ink hover:bg-mint/90 font-semibold text-base py-6"
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
            <ArrowRight className="ml-2 h-5 w-5" />
          </>
        )}
      </Button>
    </form>
  );

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent className="max-h-[85vh] px-4">
          <DrawerHeader className="text-left pb-4">
            <DrawerTitle className="text-xl font-bold">Book Your Initial Consult</DrawerTitle>
            <DrawerDescription className="text-sm">
              45 minutes to map your outcomes • Zero pressure • Real conversation
            </DrawerDescription>
          </DrawerHeader>
          <div className="overflow-y-auto pb-safe-bottom">
            {formContent}
          </div>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[520px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Book Your Initial Consult</DialogTitle>
          <DialogDescription className="text-base">
            45 minutes to map your outcomes • Zero pressure • Real conversation
          </DialogDescription>
        </DialogHeader>
        {formContent}
      </DialogContent>
    </Dialog>
  );
};

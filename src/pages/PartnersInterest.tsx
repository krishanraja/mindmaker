import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  orgName: z.string().trim().min(2, "Organization name required").max(100),
  contactName: z.string().trim().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().trim().email("Invalid email address").max(255),
  role: z.string().min(1, "Please select your role"),
  portfolioSize: z.string().min(1, "Please select portfolio/client size"),
  notes: z.string().trim().max(1000, "Notes must be less than 1000 characters").optional(),
});

type FormData = z.infer<typeof formSchema>;

const PartnersInterest = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = (data: FormData) => {
    setIsSubmitted(true);
    
    toast({
      title: "Interest Registered!",
      description: "We'll send the Partner Enablement Pack within 48 hours.",
    });

    // Here you would typically send data to backend
    console.log("Partners Interest Submission:", data);
  };

  if (isSubmitted) {
    return (
      <main className="min-h-screen">
        <Navigation />
        <section className="section-padding pt-safe-area-top">
          <div className="container-width max-w-2xl">
            <Card className="glass-card">
              <CardHeader className="text-center">
                <div className="flex justify-center mb-4">
                  <CheckCircle2 className="h-16 w-16 text-primary" />
                </div>
                <CardTitle className="text-3xl mb-2">Welcome to the Partner Program</CardTitle>
                <CardDescription className="text-lg">
                  Your interest in the Mindmaker Partner Program has been registered.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground text-center">
                  We'll send your <strong className="text-primary">Partner Enablement Pack</strong> within <strong>48 hours</strong>, including:
                </p>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-0.5">✓</span>
                    <span>Program structure and licensing terms</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-0.5">✓</span>
                    <span>Revenue share model details</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-0.5">✓</span>
                    <span>Portfolio dashboard demo and access info</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-0.5">✓</span>
                    <span>Next steps and enablement calendar</span>
                  </li>
                </ul>
                <p className="text-sm text-muted-foreground text-center mt-4">
                  A confirmation email has been sent to your inbox.
                </p>
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="w-full"
                  onClick={() => window.location.href = '/'}
                >
                  Return to Homepage
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>
        <Footer />
      </main>
    );
  }

  return (
    <main className="min-h-screen">
      <Navigation />
      <section className="section-padding pt-safe-area-top bg-muted/30">
        <div className="container-width max-w-3xl">
          <div className="text-center mb-12 fade-in-up">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
              Join the Mindmaker Partner Program
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              License the Mindmaker Method, roll up portfolio AI Leadership Index scores, and co-deliver Sprints at scale. Register your interest below.
            </p>
          </div>

          <Card className="glass-card fade-in-up">
            <CardHeader>
              <CardTitle>Partner Program Registration</CardTitle>
              <CardDescription>Tell us about your organization and we'll send the full enablement pack</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="orgName">Organization Name *</Label>
                  <Input 
                    id="orgName" 
                    {...register("orgName")} 
                    placeholder="Acme Ventures, ABC Consulting, etc." 
                  />
                  {errors.orgName && <p className="text-sm text-destructive">{errors.orgName.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contactName">Your Name *</Label>
                  <Input id="contactName" {...register("contactName")} placeholder="Jane Smith" />
                  {errors.contactName && <p className="text-sm text-destructive">{errors.contactName.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address *</Label>
                  <Input id="email" type="email" {...register("email")} placeholder="jane@organization.com" />
                  {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="role">Your Role *</Label>
                  <select 
                    id="role" 
                    {...register("role")} 
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  >
                    <option value="">Select...</option>
                    <option value="investor">Investor / VC Partner</option>
                    <option value="consultant">Consultant / Advisor</option>
                    <option value="educator">Educator / Program Director</option>
                    <option value="other">Other</option>
                  </select>
                  {errors.role && <p className="text-sm text-destructive">{errors.role.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="portfolioSize">Portfolio / Client Base Size *</Label>
                  <select 
                    id="portfolioSize" 
                    {...register("portfolioSize")} 
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  >
                    <option value="">Select...</option>
                    <option value="1-5">1-5 companies/clients</option>
                    <option value="6-15">6-15 companies/clients</option>
                    <option value="16-50">16-50 companies/clients</option>
                    <option value="50+">50+ companies/clients</option>
                  </select>
                  {errors.portfolioSize && <p className="text-sm text-destructive">{errors.portfolioSize.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Additional Notes (Optional)</Label>
                  <Textarea 
                    id="notes" 
                    {...register("notes")} 
                    placeholder="Any specific questions or context you'd like to share?"
                    rows={4}
                    className="resize-none"
                  />
                  {errors.notes && <p className="text-sm text-destructive">{errors.notes.message}</p>}
                  <p className="text-xs text-muted-foreground">Maximum 1000 characters</p>
                </div>

                <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                  <p className="text-sm text-muted-foreground">
                    <strong className="text-foreground">What you'll receive:</strong> Full program structure, licensing terms, revenue share model, portfolio dashboard demo, and enablement calendar.
                  </p>
                </div>

                <Button type="submit" variant="hero-primary" size="lg" className="w-full group">
                  Register Partner Interest
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>
      <Footer />
    </main>
  );
};

export default PartnersInterest;

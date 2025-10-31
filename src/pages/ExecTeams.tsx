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
  contactName: z.string().trim().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().trim().email("Invalid email address").max(255),
  company: z.string().trim().min(2, "Company name required").max(100),
  teamSize: z.string().min(1, "Please select team size"),
  aiMaturity: z.string().min(1, "Please select AI maturity level"),
  challenges: z.string().trim().min(10, "Please describe your challenges (minimum 10 characters)").max(500),
});

type FormData = z.infer<typeof formSchema>;

const ExecTeams = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = (data: FormData) => {
    setIsSubmitted(true);
    
    toast({
      title: "Request Submitted!",
      description: "We'll reach out within 24 hours to schedule your team assessment.",
    });

    // Here you would typically send data to backend
    console.log("Exec Teams Discovery Submission:", data);
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
                <CardTitle className="text-3xl mb-2">Request Received</CardTitle>
                <CardDescription className="text-lg">
                  Thank you for your interest in aligning your executive team on AI strategy.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground text-center">
                  We'll review your submission and reach out within <strong className="text-primary">24 hours</strong> to schedule your team assessment call.
                </p>
                <p className="text-sm text-muted-foreground text-center">
                  In the meantime, we've sent a confirmation email with next steps.
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
              Align Your Executive Team on AI Strategy
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              Most AI initiatives fail because leadership teams aren't aligned. Let's change that. Fill out this quick form to book your team assessment call.
            </p>
          </div>

          <Card className="glass-card fade-in-up">
            <CardHeader>
              <CardTitle>Executive Team Discovery</CardTitle>
              <CardDescription>Help us understand your team's needs so we can prepare a tailored assessment</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="contactName">Your Name *</Label>
                  <Input id="contactName" {...register("contactName")} placeholder="Jane Doe" />
                  {errors.contactName && <p className="text-sm text-destructive">{errors.contactName.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address *</Label>
                  <Input id="email" type="email" {...register("email")} placeholder="jane@company.com" />
                  {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="company">Company Name *</Label>
                  <Input id="company" {...register("company")} placeholder="Acme Corp" />
                  {errors.company && <p className="text-sm text-destructive">{errors.company.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="teamSize">Executive Team Size *</Label>
                  <select 
                    id="teamSize" 
                    {...register("teamSize")} 
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  >
                    <option value="">Select...</option>
                    <option value="3-5">3-5 executives</option>
                    <option value="6-10">6-10 executives</option>
                    <option value="11-20">11-20 executives</option>
                    <option value="20+">20+ executives</option>
                  </select>
                  {errors.teamSize && <p className="text-sm text-destructive">{errors.teamSize.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="aiMaturity">Current AI Maturity Level *</Label>
                  <select 
                    id="aiMaturity" 
                    {...register("aiMaturity")} 
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  >
                    <option value="">Select...</option>
                    <option value="exploring">Exploring - Early conversations</option>
                    <option value="piloting">Piloting - Running experiments</option>
                    <option value="scaling">Scaling - Moving to production</option>
                    <option value="leading">Leading - AI integrated across ops</option>
                  </select>
                  {errors.aiMaturity && <p className="text-sm text-destructive">{errors.aiMaturity.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="challenges">What challenges is your team facing with AI? *</Label>
                  <Textarea 
                    id="challenges" 
                    {...register("challenges")} 
                    placeholder="e.g., Leadership isn't aligned on priorities, pilots aren't scaling, can't measure ROI, etc."
                    rows={4}
                    className="resize-none"
                  />
                  {errors.challenges && <p className="text-sm text-destructive">{errors.challenges.message}</p>}
                  <p className="text-xs text-muted-foreground">10-500 characters</p>
                </div>

                <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                  <p className="text-sm text-muted-foreground">
                    <strong className="text-foreground">What happens next:</strong> We'll review your submission and schedule a 30-minute team assessment call to explore alignment gaps and recommend a path forward.
                  </p>
                </div>

                <Button type="submit" variant="hero-primary" size="lg" className="w-full group">
                  Request Team Assessment
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

export default ExecTeams;

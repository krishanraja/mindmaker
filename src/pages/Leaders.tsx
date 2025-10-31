import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().trim().email("Invalid email address").max(255),
  company: z.string().trim().min(2, "Company name required").max(100),
  role: z.string().trim().min(2, "Role required").max(100),
  aiMaturity: z.string().min(1, "Please select your AI maturity level"),
  primaryChallenge: z.string().min(1, "Please select your primary challenge"),
  decisionSpeed: z.string().min(1, "Please rate your decision speed"),
});

type FormData = z.infer<typeof formSchema>;

const Leaders = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const { toast } = useToast();

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const calculateScore = (data: FormData) => {
    let points = 0;
    if (data.aiMaturity === "exploring") points += 20;
    else if (data.aiMaturity === "piloting") points += 40;
    else if (data.aiMaturity === "scaling") points += 60;
    else if (data.aiMaturity === "leading") points += 80;

    if (data.decisionSpeed === "slow") points += 10;
    else if (data.decisionSpeed === "moderate") points += 20;
    else if (data.decisionSpeed === "fast") points += 30;

    return Math.min(points, 100);
  };

  const onSubmit = (data: FormData) => {
    const calculatedScore = calculateScore(data);
    setScore(calculatedScore);
    setIsSubmitted(true);
    
    toast({
      title: "Assessment Complete!",
      description: "Your AI Leadership baseline has been calculated.",
    });

    // Here you would typically send data to backend
    console.log("Leaders Benchmark Submission:", { ...data, score: calculatedScore });
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
                <CardTitle className="text-3xl mb-2">Your AI Leadership Score</CardTitle>
                <div className="text-6xl font-bold text-primary my-6">{score}/100</div>
                <CardDescription className="text-lg">
                  {score < 40 && "You're in the early stages of AI leadership development. A Sprint can accelerate your journey."}
                  {score >= 40 && score < 70 && "You're building momentum. Ready to turn pilots into measurable ROI?"}
                  {score >= 70 && "You're well-positioned. Consider the Accelerator to maximize competitive advantage."}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground text-center">
                  Based on your assessment, we recommend starting with the <strong className="text-primary">AI Alignment Sprint</strong> to build a solid foundation.
                </p>
                <Button 
                  variant="hero-primary" 
                  size="lg" 
                  className="w-full group"
                  onClick={() => window.open('https://calendly.com/krish-raja/mindmaker-meeting', '_blank')}
                >
                  Book Your Strategy Call
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
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
              Assess Your AI Leadership Baseline
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              Answer 7 quick questions to discover where you stand and what path forward makes sense.
            </p>
          </div>

          <Card className="glass-card fade-in-up">
            <CardHeader>
              <CardTitle>Leadership Benchmark Assessment</CardTitle>
              <CardDescription>Your responses help us recommend the right pathway</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name *</Label>
                  <Input id="name" {...register("name")} placeholder="John Smith" />
                  {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address *</Label>
                  <Input id="email" type="email" {...register("email")} placeholder="john@company.com" />
                  {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="company">Company *</Label>
                  <Input id="company" {...register("company")} placeholder="Acme Corp" />
                  {errors.company && <p className="text-sm text-destructive">{errors.company.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="role">Your Role *</Label>
                  <Input id="role" {...register("role")} placeholder="CEO, VP Product, etc." />
                  {errors.role && <p className="text-sm text-destructive">{errors.role.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="aiMaturity">Where is your organization with AI? *</Label>
                  <select 
                    id="aiMaturity" 
                    {...register("aiMaturity")} 
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  >
                    <option value="">Select...</option>
                    <option value="exploring">Exploring - We're just starting to learn</option>
                    <option value="piloting">Piloting - Running early experiments</option>
                    <option value="scaling">Scaling - Moving successful pilots to production</option>
                    <option value="leading">Leading - AI is integrated across operations</option>
                  </select>
                  {errors.aiMaturity && <p className="text-sm text-destructive">{errors.aiMaturity.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="primaryChallenge">What's your biggest AI challenge? *</Label>
                  <select 
                    id="primaryChallenge" 
                    {...register("primaryChallenge")} 
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  >
                    <option value="">Select...</option>
                    <option value="literacy">Team doesn't know where to start</option>
                    <option value="alignment">Leadership not aligned on strategy</option>
                    <option value="roi">Can't measure real ROI or impact</option>
                    <option value="scaling">Pilots stall before they scale</option>
                    <option value="confidence">Lack confidence in AI decisions</option>
                  </select>
                  {errors.primaryChallenge && <p className="text-sm text-destructive">{errors.primaryChallenge.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="decisionSpeed">How fast do you make AI-related decisions? *</Label>
                  <select 
                    id="decisionSpeed" 
                    {...register("decisionSpeed")} 
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  >
                    <option value="">Select...</option>
                    <option value="slow">Slow - We overthink and delay</option>
                    <option value="moderate">Moderate - Takes a few weeks</option>
                    <option value="fast">Fast - We decide and move quickly</option>
                  </select>
                  {errors.decisionSpeed && <p className="text-sm text-destructive">{errors.decisionSpeed.message}</p>}
                </div>

                <Button type="submit" variant="hero-primary" size="lg" className="w-full group">
                  Calculate My Score
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

export default Leaders;

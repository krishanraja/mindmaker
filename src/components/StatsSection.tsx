import { useState } from "react";
import { GraduationCap, BookOpen, Users, ExternalLink, ChevronDown, Award, Brain, Lightbulb, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

const StatsSection = () => {
  const [isCredentialsOpen, setIsCredentialsOpen] = useState(false);
  const [isMethodologyOpen, setIsMethodologyOpen] = useState(false);

  const handleCredentialsToggle = (open: boolean) => {
    if (!open && isCredentialsOpen) {
      // Scroll to top of section when closing
      const section = document.getElementById('access-unique-expertise');
      if (section) {
        section.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
    setIsCredentialsOpen(open);
  };

  const handleMethodologyToggle = (open: boolean) => {
    if (!open && isMethodologyOpen) {
      // Scroll to top of section when closing
      const section = document.getElementById('access-unique-expertise');
      if (section) {
        section.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
    setIsMethodologyOpen(open);
  };
  
  const credentialHighlights = [
    {
      problem: "Real-World Context",
      quote: "Big Tech, telco, broadcaster, enterprise, and scale-up environments",
      pain: "Practical insights from building cognitive infrastructure across diverse business contexts",
      icon: GraduationCap,
    },
    {
      problem: "Multidisciplinary Foundation",
      quote: "Certified in Teaching, Linguistics, Psychology, Computing, and Business",
      pain: "Comprehensive expertise bridging technical complexity with how leaders actually think",
      icon: BookOpen,
    },
    {
      problem: "90+ Leadership Systems Built", 
      quote: "Establishing cognitive infrastructure for executives making high-stakes AI decisions",
      pain: "Proven results from leaders who can now spot theatre vs substance",
      icon: Users,
    },
  ];

  const methodologyPhases = [
    {
      number: "01",
      title: "DIAGNOSE",
      description: "Map how you currently think and decide when AI is involved",
      benefits: [
        "Surface where you stand vs where you think you stand",
        "Identify cognitive blind spots and decision patterns",
        "Establish baseline mental models",
        "Reveal tensions between ambition and capability"
      ],
      icon: Brain,
    },
    {
      number: "02",
      title: "PRACTICE",
      description: "Safe rehearsal on real decisions until patterns become instinct",
      benefits: [
        "Apply to your actual work scenarios",
        "Build muscle memory for AI thinking",
        "Test mental models against real constraints",
        "Make mistakes in safe environment"
      ],
      icon: Lightbulb,
    },
    {
      number: "03",
      title: "COMPOUND",
      description: "Infrastructure that persists and improves every quarter",
      benefits: [
        "Decision velocity improves continuously",
        "Mental models self-correct through practice",
        "Capability builds on itself, not resets",
        "Quarterly evolution, not one-time training"
      ],
      icon: Zap,
    }
  ];

  return (
    <section id="access-unique-expertise" className="section-padding bg-muted">
      <div className="container-width">
        <div className="text-center mb-8 sm:mb-10 md:mb-12 fade-in-up">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight mb-3 sm:mb-4">
            System{" "}
            <span className="text-primary">
              + Founder Credibility
            </span>
          </h2>
          <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto">
            After 90+ leadership systems and 50+ executive keynotes, the pattern became clear: 
            leaders don't need more AI courses. They need <strong>cognitive infrastructure</strong> that lets them think clearly about AI—so they can make better decisions and spot vendor theatre.
          </p>
          <p className="text-sm md:text-base text-primary font-semibold mt-4">
            Creator of the Mindmaker Method™ and AI Leadership Index™
          </p>
        </div>
        
        {/* Credentials Collapsible */}
        <Collapsible open={isCredentialsOpen} onOpenChange={handleCredentialsToggle} className="mb-6">
          <CollapsibleContent className="mb-6">
            <div className="glass-card mobile-padding max-w-4xl mx-auto animate-collapsible-down">
              <div className="space-y-6">
                {credentialHighlights.map((item, index) => (
                  <div key={index} className="flex gap-4 items-start">
                    <div className="flex-shrink-0 inline-flex items-center justify-center w-12 h-12 bg-success text-white rounded-lg">
                      <item.icon className="h-6 w-6" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base sm:text-lg font-semibold text-success mb-2">
                        {item.problem}
                      </h3>
                      
                      <blockquote className="text-sm text-muted-foreground italic mb-2 leading-snug">
                        "{item.quote}"
                      </blockquote>
                      
                      <p className="text-sm text-muted-foreground leading-snug">
                        {item.pain}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>

        {/* Methodology Collapsible */}
        <Collapsible open={isMethodologyOpen} onOpenChange={handleMethodologyToggle} className="mb-6">
          <CollapsibleContent className="mb-6">
            <div className="glass-card mobile-padding max-w-4xl mx-auto animate-collapsible-down">
              <div className="space-y-6">
                {methodologyPhases.map((phase, index) => (
                  <div key={index} className="flex gap-4 items-start">
                    <div className="flex-shrink-0 inline-flex items-center justify-center w-12 h-12 bg-primary text-white rounded-lg">
                      <phase.icon className="h-6 w-6" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-lg font-bold text-primary">{phase.number}</span>
                        <h3 className="text-base sm:text-lg font-semibold text-primary">
                          {phase.title}
                        </h3>
                      </div>
                      
                      <p className="text-sm text-muted-foreground mb-3 leading-snug">
                        {phase.description}
                      </p>
                      
                      <ul className="space-y-1">
                        {phase.benefits.map((benefit, benefitIndex) => (
                          <li key={benefitIndex} className="flex items-start gap-2 text-sm text-muted-foreground">
                            <div className="w-1.5 h-1.5 bg-primary rounded-full mt-1.5 flex-shrink-0" />
                            <span className="leading-snug">{benefit}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>
          
        {/* Three Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center flex-wrap">
          <Collapsible open={isCredentialsOpen} onOpenChange={handleCredentialsToggle} className="w-full sm:w-auto">
            <CollapsibleTrigger asChild>
              <Button 
                variant="outline" 
                size="lg"
                className="border-primary text-primary hover:bg-primary hover:text-white group transition-all duration-300 min-h-[48px] px-6 sm:px-8 text-sm sm:text-base w-full sm:w-auto flex items-center justify-center gap-2"
              >
                <Award className="h-4 sm:h-5 w-4 sm:w-5 group-hover:scale-110 transition-transform flex-shrink-0" />
                <span className="flex-shrink-0">Credentials</span>
                <ChevronDown className={`h-4 sm:h-5 w-4 sm:w-5 transition-transform duration-300 flex-shrink-0 ${isCredentialsOpen ? 'rotate-180' : ''}`} />
              </Button>
            </CollapsibleTrigger>
          </Collapsible>
          
          <Collapsible open={isMethodologyOpen} onOpenChange={handleMethodologyToggle} className="w-full sm:w-auto">
            <CollapsibleTrigger asChild>
              <Button 
                variant="outline" 
                size="lg"
                className="border-primary text-primary hover:bg-primary hover:text-white group transition-all duration-300 min-h-[48px] px-6 sm:px-8 text-sm sm:text-base w-full sm:w-auto flex items-center justify-center gap-2"
              >
                <Brain className="h-4 sm:h-5 w-4 sm:w-5 group-hover:scale-110 transition-transform flex-shrink-0" />
                <span className="flex-shrink-0">Methodology</span>
                <ChevronDown className={`h-4 sm:h-5 w-4 sm:w-5 transition-transform duration-300 flex-shrink-0 ${isMethodologyOpen ? 'rotate-180' : ''}`} />
              </Button>
            </CollapsibleTrigger>
          </Collapsible>
          
          <Button 
            variant="outline" 
            size="lg"
            className="border-primary text-primary hover:bg-primary hover:text-white group transition-all duration-300 min-h-[48px] px-6 sm:px-8 text-sm sm:text-base w-full sm:w-auto flex items-center justify-center gap-2"
            onClick={() => window.open('https://www.krishraja.com/', '_blank')}
          >
            <ExternalLink className="h-4 sm:h-5 w-4 sm:w-5 group-hover:scale-110 transition-transform flex-shrink-0" />
            <span className="flex-shrink-0">Founder Bio</span>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default StatsSection;

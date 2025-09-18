import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Brain, BookOpen, Lightbulb, Zap, ArrowRight, ChevronDown, ChevronUp } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

const CollapsibleMethodologySection = () => {
  const [isOpen, setIsOpen] = useState(false);

  const phases = [
    {
      number: "01",
      title: "ASSESS", 
      subtitle: "Cognitive Baseline",
      goal: "Comprehensive evaluation of current AI mental models and learning readiness",
      description: "We evaluate your existing AI understanding, identify cognitive gaps, and establish personalized learning pathways based on your team's unique knowledge foundation and learning objectives.",
      benefits: [
        "AI literacy baseline assessment",
        "Cognitive gap analysis",
        "Learning style evaluation",
        "Personalized pathway design"
      ],
      icon: Brain,
      cta: "Begin Assessment"
    },
    {
      number: "02", 
      title: "ABSORB",
      subtitle: "Deep Learning",
      goal: "Structured knowledge acquisition of AI reasoning patterns and frameworks",
      description: "Immerse in carefully curated learning experiences that build foundational AI literacy through interactive sessions, case studies, and hands-on exploration of AI thinking patterns.",
      benefits: [
        "Core AI concept mastery",
        "Reasoning pattern recognition",
        "Mental model restructuring", 
        "Critical thinking development"
      ],
      icon: BookOpen,
      cta: "Start Learning Journey"
    },
    {
      number: "03",
      title: "APPLY",
      subtitle: "Practical Integration", 
      goal: "Real-world application of AI knowledge through guided practice sessions",
      description: "Transform theoretical understanding into practical capability through structured application exercises, problem-solving scenarios, and collaborative learning experiences.",
      benefits: [
        "Hands-on practice sessions",
        "Real-world problem solving",
        "Collaborative learning experiences",
        "Confidence building exercises"
      ],
      icon: Lightbulb,
      cta: "Practice Application"
    },
    {
      number: "04",
      title: "ACCELERATE",
      subtitle: "Mastery & Leadership",
      goal: "Advanced mastery development and thought leadership cultivation",
      description: "Achieve advanced AI literacy mastery while developing the capability to teach others, lead AI initiatives, and become a recognized thought leader in your organization and industry.",
      benefits: [
        "Advanced mastery achievement",
        "Teaching and mentoring skills", 
        "Thought leadership development",
        "Organizational AI advocacy"
      ],
      icon: Zap,
      cta: "Achieve Mastery"
    }
  ];

  return (
    <section className="section-padding bg-muted">
      <div className="container-width">
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
          <div className="text-center mb-8 fade-in-up">
            <CollapsibleTrigger asChild>
              <Button 
                variant="outline" 
                className="w-full max-w-md mx-auto p-6 h-auto flex flex-col items-center gap-4 hover:bg-muted/50 transition-colors"
              >
                <div className="text-center">
                  <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold tracking-tight mb-2">
                    Our <span className="text-primary">4-Phase Methodology</span>
                  </h2>
                  <p className="text-sm sm:text-base text-muted-foreground">
                    From AI-Confused to AI-Confident
                  </p>
                </div>
                <div className="flex items-center gap-2 text-sm font-medium text-primary">
                  <span>Learn More</span>
                  {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </div>
              </Button>
            </CollapsibleTrigger>
          </div>

          <CollapsibleContent className="animate-accordion-down">
            <div className="pt-8">
              <div className="text-center mb-12 fade-in-up">
                <p className="text-sm sm:text-base md:text-lg leading-relaxed text-muted-foreground max-w-3xl mx-auto mb-3 sm:mb-4">
                  Our proven cognitive learning methodology transforms teams through structured literacy development. 
                  Each phase builds deep understanding while cultivating practical AI reasoning capabilities.
                </p>
                <div className="flex flex-wrap items-center justify-center gap-2 text-xs sm:text-sm font-medium text-muted-foreground">
                  <span className="text-primary font-semibold">ASSESS</span>
                  <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="text-primary font-semibold">ABSORB</span>
                  <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="text-primary font-semibold">APPLY</span>
                  <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="text-primary font-semibold">ACCELERATE</span>
                </div>
              </div>

              <div className="space-y-16 sm:space-y-20 md:space-y-24">
                {phases.map((phase, index) => (
                  <div key={index} className={`grid lg:grid-cols-2 gap-8 sm:gap-12 items-center fade-in-up ${
                    index % 2 === 1 ? 'lg:grid-flow-col-dense' : ''
                  }`} style={{animationDelay: `${index * 0.2}s`}}>
                    
                    {/* Content */}
                    <div className={index % 2 === 1 ? 'lg:col-start-2' : ''}>
                      <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
                        <div className="text-3xl sm:text-4xl font-bold text-primary">
                          {phase.number}
                        </div>
                        <div>
                          <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wide">{phase.title}</h3>
                          <p className="text-xs sm:text-sm font-normal leading-relaxed text-muted-foreground">{phase.subtitle}</p>
                        </div>
                      </div>
                      
                      <div className="mb-4 sm:mb-6">
                        <h4 className="text-xs sm:text-sm font-bold uppercase tracking-wide text-foreground mb-2 sm:mb-3">Goal:</h4>
                        <p className="text-xs sm:text-sm font-normal leading-relaxed text-muted-foreground">{phase.goal}</p>
                      </div>
                      
                      <p className="text-xs sm:text-sm font-normal leading-relaxed text-muted-foreground mb-6 sm:mb-8">
                        {phase.description}
                      </p>
                      
                      <div className="mb-6 sm:mb-8">
                        <h4 className="text-xs sm:text-sm font-bold uppercase tracking-wide text-foreground mb-3 sm:mb-4">Key Benefits:</h4>
                        <ul className="space-y-2 sm:space-y-3">
                          {phase.benefits.map((benefit, benefitIndex) => (
                            <li key={benefitIndex} className="flex items-center gap-3">
                              <div className="w-2 h-2 bg-primary rounded-full" />
                              <span className="text-xs sm:text-sm font-normal leading-relaxed text-muted-foreground">{benefit}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    
                    {/* Visual */}
                    <div className={`${index % 2 === 1 ? 'lg:col-start-1 lg:row-start-1' : ''}`}>
                      <div className="glass-card p-8 sm:p-10 md:p-12 text-center rounded-xl">
                        <div className="inline-flex items-center justify-center w-20 sm:w-24 h-20 sm:h-24 bg-primary text-white rounded-2xl mb-6 sm:mb-8">
                          <phase.icon className="h-10 sm:h-12 w-10 sm:w-12" />
                        </div>
                        
                        <div className="text-5xl sm:text-6xl font-bold text-primary mb-3 sm:mb-4">
                          {phase.number}
                        </div>
                        
                        <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wide text-foreground">
                          {phase.title}
                        </h3>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </div>
    </section>
  );
};

export default CollapsibleMethodologySection;
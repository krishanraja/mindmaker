import { Button } from "@/components/ui/button";
import { Brain, BookOpen, Lightbulb, Zap, ArrowRight } from "lucide-react";

const MethodologySection = () => {
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
        <div className="text-center mb-20 fade-in-up">
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight mb-6">
            From <span className="text-primary">AI-Confused</span> to <span className="text-primary">AI-Confident</span>
          </h2>
          <p className="text-base md:text-lg leading-relaxed text-muted-foreground max-w-3xl mx-auto mb-4">
            Our proven cognitive learning methodology transforms teams through structured literacy development. 
            Each phase builds deep understanding while cultivating practical AI reasoning capabilities.
          </p>
          <div className="flex items-center justify-center gap-2 text-sm font-medium text-muted-foreground">
            <span className="text-primary font-semibold">ASSESS</span>
            <ArrowRight className="h-4 w-4" />
            <span className="text-primary font-semibold">ABSORB</span>
            <ArrowRight className="h-4 w-4" />
            <span className="text-primary font-semibold">APPLY</span>
            <ArrowRight className="h-4 w-4" />
            <span className="text-primary font-semibold">ACCELERATE</span>
          </div>
        </div>

        <div className="space-y-24">
          {phases.map((phase, index) => (
            <div key={index} className={`grid lg:grid-cols-2 gap-12 items-center fade-in-up ${
              index % 2 === 1 ? 'lg:grid-flow-col-dense' : ''
            }`} style={{animationDelay: `${index * 0.2}s`}}>
              
              {/* Content */}
              <div className={index % 2 === 1 ? 'lg:col-start-2' : ''}>
                <div className="flex items-center gap-4 mb-6">
                  <div className="text-4xl font-bold text-primary">
                    {phase.number}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold uppercase tracking-wide">{phase.title}</h3>
                    <p className="text-sm font-normal leading-relaxed text-muted-foreground">{phase.subtitle}</p>
                  </div>
                </div>
                
                <div className="mb-6">
                  <h4 className="text-sm font-bold uppercase tracking-wide text-foreground mb-3">Goal:</h4>
                  <p className="text-sm font-normal leading-relaxed text-muted-foreground">{phase.goal}</p>
                </div>
                
                <p className="text-sm font-normal leading-relaxed text-muted-foreground mb-8">
                  {phase.description}
                </p>
                
                <div className="mb-8">
                  <h4 className="text-sm font-bold uppercase tracking-wide text-foreground mb-4">Key Benefits:</h4>
                  <ul className="space-y-3">
                    {phase.benefits.map((benefit, benefitIndex) => (
                      <li key={benefitIndex} className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-primary rounded-full" />
                        <span className="text-sm font-normal leading-relaxed text-muted-foreground">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
              </div>
              
              {/* Visual */}
              <div className={`${index % 2 === 1 ? 'lg:col-start-1 lg:row-start-1' : ''}`}>
                <div className="glass-card p-12 text-center">
                  <div className="inline-flex items-center justify-center w-24 h-24 bg-primary text-white rounded-2xl mb-8">
                    <phase.icon className="h-12 w-12" />
                  </div>
                  
                  <div className="text-6xl font-bold text-primary mb-4">
                    {phase.number}
                  </div>
                  
                  <h3 className="text-sm font-bold uppercase tracking-wide text-foreground">
                    {phase.title}
                  </h3>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MethodologySection;
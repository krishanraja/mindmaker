import { AlertTriangle, Clock, DollarSign, Users } from "lucide-react";

const ProblemSection = () => {
  const audienceProblems = [
    {
      audience: "Leaders",
      problem: "Drowning in AI noise",
      quote: "I know AI will change everything, but I don't know where to start or who to trust",
      pain: "Paralyzed by complexity, wasting resources on pilots that never scale",
      icon: Users,
    },
    {
      audience: "Founders", 
      problem: "Existential competition fear",
      quote: "Every competitor seems to be 'AI-powered' - am I already too late?",
      pain: "Burning cash on shiny AI tools while core business fundamentals suffer",
      icon: AlertTriangle,
    },
    {
      audience: "Teams",
      problem: "Job displacement anxiety", 
      quote: "Will I still be relevant in an AI world? How do I future-proof my career?",
      pain: "Stuck between fear of being replaced and pressure to 'upskill' without direction",
      icon: Clock,
    },
  ];

  return (
    <section className="section-padding bg-background">
      <div className="container-width">
        <div className="text-center mb-16 fade-in-up">
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight mb-6">
            The Existential{" "}
            <span className="text-destructive">
              Human Challenge
            </span>
          </h2>
          <p className="text-base md:text-lg leading-relaxed text-muted-foreground max-w-3xl mx-auto">
            3 in 5 workers will need to rethink the way they work this decade as agentic automation rewrites roles and AI begins its ascent in to productivity.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {audienceProblems.map((item, index) => (
            <div key={index} className="card p-8 fade-in-up" style={{animationDelay: `${index * 0.1}s`}}>
              <div className="inline-flex items-center justify-center w-16 h-16 bg-destructive text-white rounded-xl mb-6">
                <item.icon className="h-8 w-8" />
              </div>
              
              <h3 className="text-xl font-semibold text-foreground mb-2">
                {item.audience}
              </h3>
              
              <h4 className="text-lg font-medium text-destructive mb-4">
                {item.problem}
              </h4>
              
              <blockquote className="text-sm text-muted-foreground italic mb-4 leading-relaxed">
                "{item.quote}"
              </blockquote>
              
              <p className="text-sm text-muted-foreground leading-relaxed">
                <strong>Reality:</strong> {item.pain}
              </p>
            </div>
          ))}
        </div>

        {/* Quote Section */}
        <div className="card p-8 max-w-4xl mx-auto text-center fade-in-up">
          <blockquote className="text-base md:text-lg leading-relaxed italic text-muted-foreground mb-6">
            "The gap between AI hype and practical implementation is costing enterprises millions. 
            Without proper literacy and strategic direction, even the best AI tools become expensive experiments."
          </blockquote>
          
          <div className="text-center">
            <p className="font-semibold text-foreground">
              That's why we created the AI Mindmaker methodology - to bridge this dangerous gap.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProblemSection;
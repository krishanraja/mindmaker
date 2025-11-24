import { AlertTriangle } from "lucide-react";

const TheProblem = () => {
  const problems = [
    "AI pilots that stall because decisions still run on old habits",
    "Teams waiting for someone else to decide what is safe and what is useful",
    "Vendors selling point solutions while leaders lose the plot",
  ];

  return (
    <section className="section-padding bg-muted/30">
      <div className="container-width">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              The Problem
            </h2>
            <p className="text-lg text-foreground leading-relaxed mb-8">
              Most companies now have data, tools and pilots. What they lack is leadership 
              that can <span className="font-semibold">think with AI</span>, not just talk about it.
            </p>
          </div>
          
          <div className="space-y-4 mb-12">
            {problems.map((problem, index) => (
              <div 
                key={index}
                className="minimal-card flex items-start gap-4 fade-in-up"
                style={{animationDelay: `${index * 0.1}s`}}
              >
                <AlertTriangle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
                <p className="text-foreground">{problem}</p>
              </div>
            ))}
          </div>
          
          <div className="minimal-card bg-ink text-white text-center p-8">
            <p className="text-lg font-semibold mb-2">
              Mindmaker fixes the missing layer
            </p>
            <p className="text-white/80">
              The human operating system for AI
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TheProblem;

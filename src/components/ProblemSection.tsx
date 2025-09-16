import { AlertTriangle, Clock, DollarSign, Users } from "lucide-react";

const ProblemSection = () => {
  const problems = [
    {
      stat: "73%",
      description: "of executives admit they don't understand AI well enough to make strategic decisions",
      icon: Users,
    },
    {
      stat: "89%", 
      description: "of AI pilots never reach production due to lack of strategic direction",
      icon: Clock,
    },
    {
      stat: "$2.3M",
      description: "average cost of failed AI initiatives per enterprise annually",
      icon: DollarSign,
    },
    {
      stat: "95%",
      description: "of leaders fear being left behind by AI-powered competitors",
      icon: AlertTriangle,
    },
  ];

  return (
    <section className="section-padding bg-muted/30">
      <div className="container-width">
        <div className="text-center mb-16 fade-in-up">
          <h2 className="display-lg mb-6">
            The Critical{" "}
            <span className="bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
              Enterprise Challenge
            </span>
          </h2>
          <p className="body-lg text-muted-foreground max-w-3xl mx-auto">
            While competitors race ahead with AI, most enterprises remain stuck in pilot purgatory, 
            burning resources without measurable results.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {problems.map((problem, index) => (
            <div key={index} className="card-modern text-center p-6 fade-in-up" style={{animationDelay: `${index * 0.1}s`}}>
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-red-500 to-orange-500 rounded-xl mb-6">
                <problem.icon className="h-8 w-8 text-white" />
              </div>
              
              <div className="text-3xl font-bold bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent mb-4">
                {problem.stat}
              </div>
              
              <p className="text-sm text-muted-foreground leading-relaxed">
                {problem.description}
              </p>
            </div>
          ))}
        </div>

        {/* Quote Section */}
        <div className="card-modern p-8 max-w-4xl mx-auto text-center fade-in-up">
          <blockquote className="body-lg italic text-muted-foreground mb-6">
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
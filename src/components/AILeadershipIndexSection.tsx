import { Button } from "@/components/ui/button";
import { TrendingUp, Users, Lightbulb, Gauge } from "lucide-react";

const AILeadershipIndexSection = () => {
  const metrics = [
    {
      title: "Decision Velocity",
      description: "Time from idea → action",
      icon: TrendingUp,
      color: "from-primary to-primary-400"
    },
    {
      title: "Leverage Ratio",
      description: "Revenue per headcount",
      icon: Users,
      color: "from-accent to-accent-400"
    },
    {
      title: "Innovation Cadence",
      description: "New AI pilots per quarter",
      icon: Lightbulb,
      color: "from-primary to-accent"
    },
    {
      title: "Confidence Index",
      description: "Executive clarity benchmark",
      icon: Gauge,
      color: "from-accent-400 to-primary-600"
    }
  ];

  return (
    <section id="ai-leadership-index" className="section-padding bg-muted/30">
      <div className="container-width">
        <div className="text-center mb-16 fade-in-up">
          <div className="inline-flex items-center bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Gauge className="w-4 h-4 mr-2" />
            Proprietary Performance System
          </div>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-6">
            <span className="text-foreground">
              Most vendors sell you tools.
            </span>
            <br />
            <span className="text-primary">
              We show you how you actually think.
            </span>
          </h2>
          <p className="text-lg md:text-xl leading-relaxed text-muted-foreground max-w-3xl mx-auto">
            Track what matters: How fast you decide. How much you leverage. How often you innovate.
          </p>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {metrics.map((metric, index) => {
            const IconComponent = metric.icon;
            return (
              <div 
                key={index}
                className="glass-card p-6 fade-in-up group hover:scale-105 transition-all duration-300"
                style={{animationDelay: `${index * 0.1}s`}}
              >
                <div className={`w-12 h-12 bg-gradient-to-br ${metric.color} rounded-lg flex items-center justify-center mb-4 group-hover:shadow-lg transition-shadow`}>
                  <IconComponent className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-bold text-foreground mb-2">
                  {metric.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {metric.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Dashboard Preview Section */}
        <div className="max-w-4xl mx-auto fade-in-up" style={{animationDelay: '0.5s'}}>
          <div className="glass-card p-8 md:p-12">
            <div className="text-center mb-8">
              <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
                AI Leadership Index™
              </h3>
              <p className="text-base text-muted-foreground max-w-2xl mx-auto">
                The first performance tracking system designed specifically for AI-forward leadership. 
                Measure what moves the needle, not vanity metrics.
              </p>
            </div>

            {/* Mock Dashboard Visual */}
            <div className="bg-gradient-to-br from-background to-muted/50 rounded-lg p-6 md:p-8 border border-border/50 mb-8">
              <div className="grid grid-cols-2 gap-4 mb-6">
                {metrics.map((metric, index) => (
                  <div key={index} className="bg-card/50 rounded-lg p-4 border border-border/30">
                    <div className="text-xs text-muted-foreground mb-1">{metric.title}</div>
                    <div className="text-2xl font-bold text-primary">{85 + index * 3}%</div>
                    <div className="text-xs text-success mt-1">↑ +{12 + index * 2}% vs. baseline</div>
                  </div>
                ))}
              </div>
              <div className="text-center text-xs text-muted-foreground">
                Live dashboard example • Updated quarterly
              </div>
            </div>

            <div className="text-center">
              <Button 
                variant="hero-primary" 
                size="lg"
                onClick={() => {
                  const outcomesSection = document.getElementById('outcomes');
                  if (outcomesSection) {
                    outcomesSection.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
              >
                See Your Baseline
              </Button>
              <p className="text-sm text-muted-foreground mt-4">
                Get your cognitive baseline in 2 minutes
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AILeadershipIndexSection;

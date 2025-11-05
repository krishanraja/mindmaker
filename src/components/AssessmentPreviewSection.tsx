import { Button } from "@/components/ui/button";
import { Target, Users, TrendingUp, ArrowRight } from "lucide-react";

const AssessmentPreviewSection = () => {
  const assessments = [
    {
      audience: "Individual Leaders",
      title: "AI Leadership Benchmark",
      process: "2-min benchmark → 7-dimension score → 90-day roadmap",
      icon: Target,
      gradient: "from-primary to-primary-600",
      link: "/leaders"
    },
    {
      audience: "Executive Teams",
      title: "Team Bootcamp Configurator",
      process: "4-hour bootcamp configurator → team baseline → pilot charter",
      icon: Users,
      gradient: "from-accent to-accent-400",
      link: "/exec-teams"
    },
    {
      audience: "Partners & Investors",
      title: "Portfolio Scoring Tool",
      process: "Portfolio scoring → heatmap for 1-10 companies → co-delivery plan",
      icon: TrendingUp,
      gradient: "from-primary-400 to-accent",
      link: "/partners-interest"
    }
  ];

  const scrollToPathways = () => {
    document.getElementById('pathways')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="section-padding bg-muted/30">
      <div className="container-width">
        <div className="text-center mb-12 fade-in-up">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            <span className="text-foreground">Not Ready to Commit?</span>
            <br />
            <span className="text-primary">Start With a Free Assessment</span>
          </h2>
          <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
            Choose your path and get immediate, actionable insights tailored to your role.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {assessments.map((assessment, index) => {
            const IconComponent = assessment.icon;
            return (
              <div
                key={index}
                className="glass-card p-6 fade-in-up hover:scale-105 transition-all duration-300"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Icon */}
                <div className={`w-12 h-12 bg-gradient-to-br ${assessment.gradient} rounded-lg flex items-center justify-center mb-4`}>
                  <IconComponent className="h-6 w-6 text-white" />
                </div>

                {/* Audience */}
                <div className="text-xs font-bold text-primary/60 tracking-wider mb-2">
                  {assessment.audience}
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold text-foreground mb-3">
                  {assessment.title}
                </h3>

                {/* Process Flow */}
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {assessment.process}
                </p>
              </div>
            );
          })}
        </div>

        {/* CTA */}
        <div className="text-center fade-in-up" style={{ animationDelay: '0.3s' }}>
          <Button
            variant="hero-primary"
            size="lg"
            className="group"
            onClick={scrollToPathways}
          >
            View Full Engagement Options
            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default AssessmentPreviewSection;

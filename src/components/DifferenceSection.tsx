import { CheckCircle, Zap, Users, Target, Briefcase } from "lucide-react";

const DifferenceSection = () => {
  const differences = [
    {
      number: "01",
      title: "Media Industry Expertise",
      description: "16+ years specializing in media, entertainment, and content strategy - not generic AI consulting",
      icon: Briefcase,
    },
    {
      number: "02", 
      title: "Literacy-First Methodology",
      description: "Build understanding before tools. Our proven framework ensures sustainable AI adoption",
      icon: Target,
    },
    {
      number: "03",
      title: "Modular Credit System",
      description: "Pay only for what you need. Flexible 5-25 credit modules tailored to your specific challenges",
      icon: CheckCircle,
    },
    {
      number: "04",
      title: "AI-Enabled Coaching",
      description: "Human expertise augmented by intelligent tools - not just another consultant",
      icon: Zap,
    },
    {
      number: "05",
      title: "Proven at Scale",
      description: "90+ product strategies delivered. Real results with Fortune 500 companies and startups alike",
      icon: Users,
    },
  ];

  return (
    <section className="section-padding bg-muted/30">
      <div className="container-width">
        <div className="text-center mb-16 fade-in-up">
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight mb-6">
            The{" "}
            <span className="text-primary">
              MindMaker™ Difference
            </span>
          </h2>
          <p className="text-base md:text-lg leading-relaxed text-muted-foreground max-w-3xl mx-auto">
            AI literacy is more than just prompting. Only if each worker shifts their mindset will they become a 10X orchestrator inside and out of work. We bridge that gap between casual AI usage and applicable implementation.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {differences.map((difference, index) => (
            <div key={index} className="card p-8 fade-in-up" style={{animationDelay: `${index * 0.1}s`}}>
              <div className="flex items-start gap-4 mb-6">
                <div className="flex-shrink-0 w-12 h-12 bg-primary text-white rounded-xl flex items-center justify-center">
                  <difference.icon className="h-6 w-6" />
                </div>
                <div className="text-2xl font-bold text-primary/60">
                  {difference.number}
                </div>
              </div>
              
              <h3 className="text-sm font-bold uppercase tracking-wide text-foreground mb-4">
                {difference.title}
              </h3>
              
              <p className="text-sm font-normal leading-relaxed text-muted-foreground">
                {difference.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default DifferenceSection;
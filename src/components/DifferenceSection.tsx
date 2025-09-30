import { CheckCircle, Zap, Users, Target, Briefcase } from "lucide-react";
import ResponsiveCardGrid from "@/components/ResponsiveCardGrid";

const DifferenceSection = () => {
  const differences = [
    {
      number: "01",
      title: "Strategic Bridge",
      description: "The essential step between confused humans and technical implementers. Technical builds mean nothing without confident non-technical teams.",
      icon: Briefcase,
    },
    {
      number: "02", 
      title: "Literacy-First Methodology",
      description: "Build understanding before tools. AI isn't software; it's more like a new species of worker we need to learn to communicate with.",
      icon: Target,
    },
    {
      number: "03",
      title: "Modular Credit System",
      description: "Choose what you need, when you need it. Interactive, flexible learning with 5-45 credit options. Pay-as-you-go for real business outcomes.",
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
      title: "From Knowledge to Revenue",
      description: "Accelerated adoption without wasted pilots. Proven business outcomes with Fortune 500 companies and scale-ups.",
      icon: Users,
    },
  ];

  return (
    <section className="section-padding bg-slate-100">
      <div className="container-width">
        <div className="text-center mb-16 fade-in-up">
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight mb-6">
            <span className="text-primary">
              Interactive & Engaging Approach
            </span>
          </h2>
          <p className="text-base md:text-lg leading-relaxed text-muted-foreground max-w-3xl mx-auto">
            Move beyond boring workshops and theoretical frameworks. Our gamified, interactive methodology transforms AI literacy into engaging experiences with measurable outcomes.
          </p>
        </div>
        
        <ResponsiveCardGrid 
          desktopGridClass="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {differences.map((difference, index) => (
            <div key={index} className="card p-4 sm:p-6 lg:p-8 fade-in-up h-full flex flex-col" style={{animationDelay: `${index * 0.1}s`}}>
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
        </ResponsiveCardGrid>
      </div>
    </section>
  );
};

export default DifferenceSection;
import { CheckCircle, Zap, Users, Target, Briefcase } from "lucide-react";
import ResponsiveCardGrid from "@/components/ResponsiveCardGrid";

const DifferenceSection = () => {
  const differences = [
    {
      number: "01",
      title: "You'll Actually Use This",
      description: "Not another deck that dies in your email. Real questions you'll use in vendor meetings next week.",
      icon: Target,
    },
    {
      number: "02", 
      title: "See Where You Really Stand",
      description: "Most execs think they're further ahead than they are. We show you the gap—no judgment, just clarity.",
      icon: CheckCircle,
    },
    {
      number: "03",
      title: "Practice on Your Real Work",
      description: "Use your actual decisions as the training ground. Not fake case studies.",
      icon: Zap,
    },
    {
      number: "04",
      title: "Spot Vendor Theatre",
      description: "Stop nodding along in sales pitches. Upgrade your bullshit detector for AI claims.",
      icon: Briefcase,
    },
    {
      number: "05",
      title: "It Doesn't Fade",
      description: "Most workshops evaporate in weeks. This sticks because you practice on real work until it's instinct.",
      icon: Users,
    },
  ];

  return (
    <section className="section-padding bg-slate-100">
      <div className="container-width">
        <div className="text-center mb-16 fade-in-up">
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight mb-6">
            <span className="text-primary">
              The Mindmaker Difference
            </span>
          </h2>
          <p className="text-base md:text-lg leading-relaxed text-muted-foreground max-w-3xl mx-auto">
            A system that helps leaders think clearly about AI—so they can make better calls and stop wasting money on theatre.
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
import { Brain, Target, Zap, TrendingUp, RefreshCw } from "lucide-react";

const MindmakerSystemSection = () => {
  const systemSteps = [
    {
      number: "01",
      title: "SEE WHERE YOU STAND",
      description: "Where you think you are vs where you actually are",
      icon: Target,
    },
    {
      number: "02",
      title: "PRACTICE ON REAL WORK",
      description: "Use your actual decisions, not fake case studies",
      icon: Zap,
    },
    {
      number: "03",
      title: "IT BECOMES INSTINCT",
      description: "Stop second-guessing yourself in vendor meetings",
      icon: Brain,
    },
    {
      number: "04",
      title: "TRACK REAL PROGRESS",
      description: "See if you're getting sharper each quarter",
      icon: TrendingUp,
    },
    {
      number: "05",
      title: "IT KEEPS COMPOUNDING",
      description: "Doesn't fade like workshops do",
      icon: RefreshCw,
    },
  ];

  return (
    <section className="section-padding bg-gradient-to-br from-primary/5 via-accent/5 to-primary/10">
      <div className="container-width">
        <div className="text-center mb-16 fade-in-up">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-6">
            How It Actually Works
          </h2>
          <p className="text-base md:text-lg leading-relaxed text-muted-foreground max-w-3xl mx-auto">
            A 5-step system that helps you think clearly, make better calls, and get sharper each quarter—not another workshop that fades.
          </p>
        </div>

        {/* System Loop Visualization */}
        <div className="max-w-5xl mx-auto mb-12">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 md:gap-2">
            {systemSteps.map((step, index) => {
              const IconComponent = step.icon;
              const isLast = index === systemSteps.length - 1;
              
              return (
                <div key={index} className="relative">
                  <div 
                    className="glass-card p-6 h-full flex flex-col items-center text-center fade-in-up group hover:scale-105 transition-all duration-300"
                    style={{animationDelay: `${index * 0.1}s`}}
                  >
                    <div className="w-14 h-14 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center mb-4 group-hover:shadow-lg transition-shadow">
                      <IconComponent className="h-7 w-7 text-white" />
                    </div>
                    
                    <div className="text-xs font-bold text-primary/60 mb-2">
                      {step.number}
                    </div>
                    
                    <h3 className="text-sm font-bold uppercase tracking-wide text-foreground mb-3">
                      {step.title}
                    </h3>
                    
                    <p className="text-xs leading-relaxed text-muted-foreground">
                      {step.description}
                    </p>
                  </div>
                  
                  {/* Arrow connector for desktop */}
                  {!isLast && (
                    <div className="hidden md:block absolute top-1/2 -right-1 transform -translate-y-1/2 z-10">
                      <div className="text-primary/40 text-2xl">→</div>
                    </div>
                  )}
                  
                  {/* Downward arrow for mobile */}
                  {!isLast && (
                    <div className="md:hidden flex justify-center my-2">
                      <div className="text-primary/40 text-2xl">↓</div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          
          {/* Loop back arrow */}
          <div className="flex justify-center mt-8">
            <div className="glass-card px-6 py-3 inline-flex items-center gap-3">
              <RefreshCw className="h-5 w-5 text-primary animate-spin" style={{animationDuration: '3s'}} />
              <span className="text-sm font-semibold text-foreground">Continuous Performance Loop</span>
            </div>
          </div>
        </div>

        {/* Key Differentiator */}
        <div className="max-w-3xl mx-auto text-center fade-in-up" style={{animationDelay: '0.6s'}}>
          <div className="glass-card p-8">
            <p className="text-base text-muted-foreground">
              Workshops fade. Consultants tell you what to do. Tools do the work for you. 
              We build the system that lets you think for yourself—spot theatre, make better calls, stop wasting money.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MindmakerSystemSection;

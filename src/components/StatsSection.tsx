import { Award, Users, Zap } from "lucide-react";

const StatsSection = () => {
  const stats = [
    {
      number: "90+",
      label: "AI product strategies delivered",
      description: "to media & enterprise organizations",
      icon: Award,
    },
    {
      number: "50+", 
      label: "Executive seminars delivered",
      description: "on automation & AI futures",
      icon: Users,
    },
    {
      number: "16",
      label: "Years of proven expertise",
      description: "in tech & AI transformation",
      icon: Zap,
    },
  ];

  return (
    <section className="section-padding bg-gradient-subtle">
      <div className="container-width">
        <div className="text-center mb-16 fade-in-up">
          <h2 className="display-lg mb-4">
            The Definitive AI Literacy &{" "}
            <span className="text-purple-600">
              Strategic Advisory
            </span>{" "}
            Firm
          </h2>
          <p className="body-lg text-muted-foreground max-w-2xl mx-auto">
            Proven track record of transforming enterprises from AI confusion to competitive advantage
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {stats.map((stat, index) => (
            <div key={index} className="card-modern card-metric group fade-in-up" style={{animationDelay: `${index * 0.1}s`}}>
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl mb-6 group-hover:scale-110 transition-transform duration-300">
                <stat.icon className="h-8 w-8 text-white" />
              </div>
              
              <div className="number group-hover:scale-110 transition-transform duration-300">
                {stat.number}
              </div>
              
              <div className="text-lg font-semibold text-foreground mb-2">
                {stat.label}
              </div>
              
              <div className="label">
                {stat.description}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
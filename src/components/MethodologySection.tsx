import { Button } from "@/components/ui/button";
import { Search, Target, Rocket, TrendingUp, ArrowRight } from "lucide-react";

const MethodologySection = () => {
  const phases = [
    {
      number: "01",
      title: "LEARN",
      subtitle: "AI Literacy Foundation",
      goal: "Transform your leadership from AI-confused to AI-confident",
      description: "Build deep understanding of AI capabilities, limitations, and strategic implications through executive education and hands-on workshops.",
      benefits: [
        "Executive AI literacy program",
        "Hands-on tool exploration", 
        "Industry-specific use cases",
        "Risk assessment framework"
      ],
      icon: Search,
      cta: "Start Learning",
    },
    {
      number: "02", 
      title: "DECIDE",
      subtitle: "Strategic Planning",
      goal: "Create your comprehensive AI transformation roadmap",
      description: "Develop a clear, actionable strategy that aligns AI initiatives with business objectives and delivers measurable ROI.",
      benefits: [
        "Custom AI strategy development",
        "ROI projection modeling",
        "Risk mitigation planning",
        "Technology stack selection"
      ],
      icon: Target,
      cta: "Build Strategy",
    },
    {
      number: "03",
      title: "ALIGN", 
      subtitle: "Organizational Readiness",
      goal: "Prepare your organization for successful AI implementation",
      description: "Align stakeholders, optimize processes, and build the organizational foundation needed for AI success.",
      benefits: [
        "Change management program",
        "Process optimization",
        "Team skill development",
        "Cultural transformation"
      ],
      icon: Rocket,
      cta: "Align Teams",
    },
    {
      number: "04",
      title: "SCALE",
      subtitle: "Implementation & Growth", 
      goal: "Execute, measure, and scale your AI initiatives",
      description: "Deploy AI solutions systematically, track performance metrics, and expand successful implementations across the organization.",
      benefits: [
        "Phased implementation plan",
        "Performance monitoring",
        "Continuous optimization", 
        "Enterprise-wide scaling"
      ],
      icon: TrendingUp,
      cta: "Scale Impact",
    },
  ];

  return (
    <section className="section-padding bg-gradient-subtle">
      <div className="container-width">
        <div className="text-center mb-20 fade-in-up">
          <h2 className="display-lg mb-6">
            Our Proven{" "}
            <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              4-Phase Methodology
            </span>
          </h2>
          <p className="body-lg text-muted-foreground max-w-3xl mx-auto">
            The systematic approach that has delivered 3-5x revenue growth for 100+ enterprises. 
            From AI literacy to strategic excellence in 90 days.
          </p>
        </div>

        <div className="space-y-24">
          {phases.map((phase, index) => (
            <div key={index} className={`grid lg:grid-cols-2 gap-12 items-center fade-in-up ${
              index % 2 === 1 ? 'lg:grid-flow-col-dense' : ''
            }`} style={{animationDelay: `${index * 0.2}s`}}>
              
              {/* Content */}
              <div className={index % 2 === 1 ? 'lg:col-start-2' : ''}>
                <div className="flex items-center gap-4 mb-6">
                  <div className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    {phase.number}
                  </div>
                  <div>
                    <h3 className="display-md font-bold">{phase.title}</h3>
                    <p className="text-lg text-muted-foreground">{phase.subtitle}</p>
                  </div>
                </div>
                
                <div className="mb-6">
                  <h4 className="text-xl font-semibold text-foreground mb-3">Goal:</h4>
                  <p className="body-lg text-muted-foreground">{phase.goal}</p>
                </div>
                
                <p className="body-md text-muted-foreground mb-8">
                  {phase.description}
                </p>
                
                <div className="mb-8">
                  <h4 className="text-lg font-semibold text-foreground mb-4">Key Benefits:</h4>
                  <ul className="space-y-3">
                    {phase.benefits.map((benefit, benefitIndex) => (
                      <li key={benefitIndex} className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full" />
                        <span className="text-muted-foreground">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <Button className="btn-modern group">
                  {phase.cta}
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
              
              {/* Visual */}
              <div className={`${index % 2 === 1 ? 'lg:col-start-1 lg:row-start-1' : ''}`}>
                <div className="card-modern p-12 text-center">
                  <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl mb-8">
                    <phase.icon className="h-12 w-12 text-white" />
                  </div>
                  
                  <div className="text-6xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
                    {phase.number}
                  </div>
                  
                  <h3 className="text-2xl font-bold text-foreground">
                    {phase.title}
                  </h3>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MethodologySection;
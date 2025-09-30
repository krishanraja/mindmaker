import { GraduationCap, BookOpen, Users, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import ResponsiveCardGrid from "@/components/ResponsiveCardGrid";

const StatsSection = () => {
  const credentialHighlights = [
    {
      audience: "Qualified",
      problem: "Teacher & Educator",
      quote: "With proper certification and years of educational experience in transforming learning approaches",
      pain: "Deep understanding of how adult learners absorb complex technical concepts",
      icon: GraduationCap,
    },
    {
      audience: "Advanced", 
      problem: "Academic Credentials",
      quote: "Linguistics, Computing & Psychology backgrounds provide multidisciplinary insight into AI learning",
      pain: "Scientific approach to breaking down AI complexity into digestible, actionable knowledge",
      icon: BookOpen,
    },
    {
      audience: "100+",
      problem: "Minds Transformed", 
      quote: "Proven track record of accelerating tech literacy across diverse professional backgrounds",
      pain: "Real results from executives, founders, and teams who now lead with AI confidence",
      icon: Users,
    },
  ];

  return (
    <section className="section-padding bg-muted">
      <div className="container-width">
        <div className="text-center mb-10 sm:mb-12 md:mb-16 fade-in-up">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight mb-3 sm:mb-4">
            Ready To Help{" "}
            <span className="text-primary">
              You
            </span>
          </h2>
        </div>
        
        <ResponsiveCardGrid 
          desktopGridClass="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16"
          className="mb-16"
          mobileCardHeight="h-[420px]"
        >
          {credentialHighlights.map((item, index) => (
            <div key={index} className="card p-8 fade-in-up h-full flex flex-col" style={{animationDelay: `${index * 0.1}s`}}>
              <div className="inline-flex items-center justify-center w-16 h-16 bg-success text-white rounded-xl mb-6">
                <item.icon className="h-8 w-8" />
              </div>
              
              <h3 className="text-xl font-semibold text-foreground mb-2">
                {item.audience}
              </h3>
              
              <h4 className="text-lg font-medium text-success mb-4">
                {item.problem}
              </h4>
              
              <blockquote className="text-sm text-muted-foreground italic mb-4 leading-relaxed">
                "{item.quote}"
              </blockquote>
              
              <p className="text-sm text-muted-foreground leading-relaxed">
                <strong>Impact:</strong> {item.pain}
              </p>
            </div>
          ))}
        </ResponsiveCardGrid>
        
        {/* Founder CTA Button */}
        <div className="flex justify-center mt-8 sm:mt-12 md:mt-16">
          <Button 
            variant="outline" 
            size="lg"
            className="border-primary text-primary hover:bg-primary hover:text-white group transition-all duration-300 min-h-[48px] px-6 sm:px-8 text-sm sm:text-base"
            onClick={() => window.open('https://www.krishraja.com/', '_blank')}
          >
            <ExternalLink className="mr-2 h-4 sm:h-5 w-4 sm:w-5 group-hover:scale-110 transition-transform" />
            Check out our Founder
          </Button>
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
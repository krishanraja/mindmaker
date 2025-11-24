import { Quote, TrendingUp, Clock, Users } from "lucide-react";

const TrustSection = () => {
  const testimonials = [
    {
      quote: "Saved 8 hours per week on strategic decisions. Now I build AI systems instead of waiting for IT.",
      name: "Sarah Chen",
      role: "VP Operations",
      company: "Fortune 500 Tech",
      metric: "8 hrs/week saved",
      icon: Clock,
    },
    {
      quote: "Our exec team went from AI-curious to AI-fluent in 4 hours. Game-changing for decision velocity.",
      name: "Marcus Williams",
      role: "Chief Strategy Officer",
      company: "Global Consulting Firm",
      metric: "3x faster decisions",
      icon: TrendingUp,
    },
    {
      quote: "Finally, a practical approach. No vendor theatre, just real systems we actually use every day.",
      name: "Jennifer Park",
      role: "Managing Director",
      company: "PE Fund",
      metric: "12 portfolio companies",
      icon: Users,
    },
  ];

  return (
    <section className="section-padding bg-muted">
      <div className="container-width">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Trusted by leaders who build, not just buy
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Real results from executives who stopped talking about AI and started building with it
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {testimonials.map((testimonial, index) => {
            const IconComponent = testimonial.icon;
            return (
              <div 
                key={index}
                className="minimal-card bg-background fade-in-up"
                style={{animationDelay: `${index * 0.1}s`}}
              >
                <Quote className="h-8 w-8 text-mint mb-4" />
                
                <p className="text-sm leading-relaxed mb-6 text-foreground">
                  "{testimonial.quote}"
                </p>
                
                <div className="flex items-start gap-3 pt-4 border-t border-border">
                  <div className="flex-1">
                    <div className="font-semibold text-sm">{testimonial.name}</div>
                    <div className="text-xs text-muted-foreground">{testimonial.role}</div>
                    <div className="text-xs text-muted-foreground">{testimonial.company}</div>
                  </div>
                  
                  <div className="flex items-center gap-2 text-xs font-bold text-mint bg-mint/10 px-3 py-1.5 rounded-full">
                    <IconComponent className="h-3 w-3" />
                    {testimonial.metric}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        
        {/* Client Logos Placeholder */}
        <div className="mt-16 text-center">
          <p className="text-sm text-muted-foreground mb-6 font-medium">
            Worked with teams from
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8 opacity-40">
            <div className="text-xl font-bold text-foreground">Fortune 500</div>
            <div className="text-xl font-bold text-foreground">PE Firms</div>
            <div className="text-xl font-bold text-foreground">Scale-ups</div>
            <div className="text-xl font-bold text-foreground">Consulting</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrustSection;

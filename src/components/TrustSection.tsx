import { Quote, TrendingUp, Clock, Users } from "lucide-react";

const TrustSection = () => {
  const testimonials = [
    {
      quote: "Invested 6 hr/week in to systems-building instead of delegating, starting to see decision-velocity improving!",
      name: "Sarah Messir",
      role: "Head of BizOps",
      company: "Fortune 500 Tech",
      metric: "6 hrs/week invested",
      icon: Clock,
    },
    {
      quote: "Krish knows how to take you on a journey, help you realize the WHY and get you pumped instead of worried.",
      name: "Marcus Davis",
      role: "Chief Strategy Officer",
      company: "Global Consulting Firm",
      metric: "Game-changing",
      icon: TrendingUp,
    },
    {
      quote: "It's great to have a way to help my portfolio with what's next with an actual builder who also gets the board room.",
      name: "Jennifer Park",
      role: "Managing Director",
      company: "PE Fund",
      metric: "12 portfolio companies",
      icon: Users,
    },
  ];

  return (
    <section className="section-padding bg-muted relative overflow-hidden" id="trust">
      {/* Background GIF overlay */}
      <div 
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage: 'url(/mindmaker-background.gif)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      />
      <div className="container-width relative z-10">
        <div className="text-center mb-12 sm:mb-16 px-4 sm:px-0">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">
            Trusted by leaders who build, not just buy
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
            Real results from executives who stopped talking about AI and started building with it
          </p>
        </div>
        
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto px-4 sm:px-0">
          {testimonials.map((testimonial, index) => {
            const IconComponent = testimonial.icon;
            return (
              <div 
                key={index}
                className="minimal-card bg-background fade-in-up"
                style={{animationDelay: `${index * 0.1}s`}}
              >
                <Quote className="h-6 w-6 sm:h-8 sm:w-8 text-mint mb-4" />
                
                <p className="text-sm sm:text-base leading-relaxed mb-6 text-foreground">
                  "{testimonial.quote}"
                </p>
                
                <div className="flex items-start gap-3 pt-4 border-t border-border">
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-sm">{testimonial.name}</div>
                    <div className="text-xs text-muted-foreground truncate">{testimonial.role}</div>
                    <div className="text-xs text-muted-foreground truncate">{testimonial.company}</div>
                  </div>
                  
                  <div className="flex items-center gap-2 text-xs font-bold text-mint-dark bg-mint/10 px-2 sm:px-3 py-1.5 rounded-full whitespace-nowrap">
                    <IconComponent className="h-3 w-3 flex-shrink-0" />
                    <span className="hidden sm:inline">{testimonial.metric}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        
        {/* Client Logos Placeholder */}
        <div className="mt-16 text-center px-4 sm:px-0">
          <p className="text-sm text-muted-foreground mb-6 font-medium">
            Worked with teams from
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8 opacity-40 mb-6">
            <div className="text-xl font-bold text-foreground">Fortune 500</div>
            <div className="text-xl font-bold text-foreground">VC Firms</div>
            <div className="text-xl font-bold text-foreground">Scale-ups</div>
            <div className="text-xl font-bold text-foreground">Consulting</div>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-6 opacity-50">
            <div className="text-sm font-medium text-muted-foreground">Media</div>
            <div className="text-sm font-medium text-muted-foreground">E-Commerce</div>
            <div className="text-sm font-medium text-muted-foreground">Marketing</div>
            <div className="text-sm font-medium text-muted-foreground">Telco</div>
            <div className="text-sm font-medium text-muted-foreground">Wellness</div>
            <div className="text-sm font-medium text-muted-foreground">Entertainment</div>
            <div className="text-sm font-medium text-muted-foreground">Music</div>
            <div className="text-sm font-medium text-muted-foreground">Legal</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrustSection;

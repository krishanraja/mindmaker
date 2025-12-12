import { Quote, TrendingUp, Clock, Users, Award, Lightbulb, BookOpen, Rocket } from "lucide-react";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, type CarouselApi } from "@/components/ui/carousel";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface TestimonialCardProps {
  testimonial: any;
  onExpandChange?: (expanded: boolean) => void;
}

const TestimonialCard = ({ testimonial, onExpandChange }: TestimonialCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const IconComponent = testimonial.icon;
  const isLongQuote = testimonial.quote.length > 180;

  const handleToggle = () => {
    const newExpanded = !isExpanded;
    setIsExpanded(newExpanded);
    onExpandChange?.(newExpanded);
  };

  return (
    <div className="minimal-card hover-lift bg-background h-full flex flex-col min-h-[280px]">
      <Quote className="h-6 w-6 text-mint mb-4 flex-shrink-0" />
      
      <div className="flex-grow">
        <motion.p 
          className={cn(
            "text-sm leading-relaxed text-foreground",
            !isExpanded && isLongQuote && "line-clamp-4"
          )}
          layout
          transition={{ duration: 0.3 }}
        >
          "{testimonial.quote}"
        </motion.p>
        
        {isLongQuote && (
          <button 
            onClick={handleToggle}
            className="text-mint text-xs mt-2 hover:underline focus:outline-none"
          >
            {isExpanded ? "Show less" : "Read more..."}
          </button>
        )}
      </div>
      
      <div className="flex items-start gap-3 pt-4 mt-auto border-t border-border">
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
};

const TrustSection = () => {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [isAnyExpanded, setIsAnyExpanded] = useState(false);

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
      role: "Strategy Leader",
      company: "Global Consulting Firm",
      metric: "Game-changing",
      icon: TrendingUp,
    },
    {
      quote: "It's great to have a way to help my portfolio with what's next with an actual builder who also gets the board room.",
      name: "Jennifer Xu",
      role: "Investor",
      company: "VC Fund",
      metric: "12 portfolio companies",
      icon: Users,
    },
    {
      quote: "Krish has experience in different environments ranging from corporate to start up and has built teams from the ground up displaying his entrepreneurial approach while being equally comfortable playing that role in more traditional organisations as well. The other wonderful attribute Krish brings is his very human approach - a great communicator of complexity and a warm nature that brings people together.",
      name: "Lizzie Young",
      role: "CEO",
      company: "Media",
      metric: "Leadership",
      icon: Award,
    },
    {
      quote: "Krish is an outstanding leader with a clear vision, a collaborative approach, results driven and has a knack for driving innovation.",
      name: "Marie-Anne",
      role: "Founder",
      company: "Recruiting",
      metric: "Innovation",
      icon: Lightbulb,
    },
    {
      quote: "Articulate, engaging & entertaining. Krish explores all the barriers experienced with data & technology, breaks them all down with relevant examples & stories and presents clear solutions. Full of support, Krish is always keen to educate & assist his peers.",
      name: "Michael Ricciardone",
      role: "Country Manager",
      company: "Tech",
      metric: "Education",
      icon: BookOpen,
    },
    {
      quote: "I highly recommend Krish for any leadership situation where innovation and 'get shit done' are valued.",
      name: "Vincent Pelillo",
      role: "Managing Director",
      company: "Media",
      metric: "Get Shit Done",
      icon: Rocket,
    },
  ];

  // Track current slide
  useEffect(() => {
    if (!api) return;
    
    setCurrent(api.selectedScrollSnap());
    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  // Auto-play logic with pause on expansion
  useEffect(() => {
    if (!api || isAnyExpanded) return;
    
    const interval = setInterval(() => {
      api.scrollNext();
    }, 5000);
    
    return () => clearInterval(interval);
  }, [api, isAnyExpanded]);

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
        
        <Carousel 
          setApi={setApi}
          opts={{ 
            align: "start", 
            loop: true 
          }} 
          className="w-full max-w-6xl mx-auto px-4 sm:px-0"
        >
          <CarouselContent className="-ml-2 md:-ml-4">
            {testimonials.map((testimonial, index) => (
              <CarouselItem 
                key={index} 
                className="pl-2 md:pl-4 basis-[85%] sm:basis-1/2 lg:basis-1/3"
              >
                <div 
                  className="fade-in-up"
                  style={{animationDelay: `${index * 0.1}s`}}
                >
                  <TestimonialCard 
                    testimonial={testimonial} 
                    onExpandChange={(expanded) => setIsAnyExpanded(expanded)}
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="hidden sm:flex" />
          <CarouselNext className="hidden sm:flex" />
        </Carousel>

        {/* Mobile dot indicators */}
        <div className="flex justify-center gap-2 mt-6 sm:hidden">
          {testimonials.map((_, idx) => (
            <button
              key={idx}
              className={cn(
                "w-2 h-2 rounded-full transition-colors",
                current === idx ? "bg-mint" : "bg-muted-foreground/30"
              )}
              onClick={() => api?.scrollTo(idx)}
              aria-label={`Go to testimonial ${idx + 1}`}
            />
          ))}
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

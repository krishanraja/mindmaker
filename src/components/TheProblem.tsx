import { motion } from "framer-motion";
import { useRef, useState } from "react";
import { useScrollTrigger } from "@/hooks/useScrollTrigger";
import { BuilderAssessment } from "@/components/Interactive/BuilderAssessment";
import { FrictionMapBuilder } from "@/components/Interactive/FrictionMapBuilder";
import { TryItWidget } from "@/components/Interactive/AIDecisionHelper";
import { PortfolioBuilder } from "@/components/Interactive/PortfolioBuilder";
import { User, Lightbulb, Map, TrendingUp, Sparkles } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Carousel, CarouselContent, CarouselItem, CarouselApi } from "@/components/ui/carousel";
import { useEffect } from "react";

type DialogType = 'quiz' | 'decision' | 'friction' | 'portfolio' | null;

interface InteractiveCardProps {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  description: string;
  onClick: () => void;
  delay?: number;
}

const InteractiveCard = ({ icon, title, subtitle, description, onClick, delay = 0 }: InteractiveCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay }}
      className="flex flex-col h-full"
    >
      <div 
        className="minimal-card flex-1 flex flex-col p-6 cursor-pointer hover:border-mint/60 transition-colors"
        onClick={onClick}
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-mint/20 flex items-center justify-center">
            {icon}
          </div>
          <div>
            <h3 className="font-bold text-lg">{title}</h3>
            <p className="text-xs text-muted-foreground">{subtitle}</p>
          </div>
        </div>
        <p className="text-sm text-muted-foreground mb-6">
          {description}
        </p>
        <div className="mt-auto">
          <button className="w-full py-2 px-4 bg-mint/10 hover:bg-mint/20 text-ink rounded-lg text-sm font-semibold transition-colors">
            Open Tool →
          </button>
        </div>
      </div>
    </motion.div>
  );
};

const TheProblem = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const { elementRef: triggerRef, isVisible } = useScrollTrigger({ threshold: 0.2 });
  const [dialogType, setDialogType] = useState<DialogType>(null);
  const [carouselApi, setCarouselApi] = useState<CarouselApi>();
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    if (!carouselApi) return;

    carouselApi.on("select", () => {
      setCurrentSlide(carouselApi.selectedScrollSnap());
    });
  }, [carouselApi]);

  const cards = [
    {
      id: 'quiz' as const,
      icon: <User className="w-5 h-5 text-mint-dark" />,
      title: "Builder Profile Quiz",
      subtitle: "60-second assessment",
      description: "Where are you on your AI journey? Take a quick assessment to get personalized recommendations."
    },
    {
      id: 'decision' as const,
      icon: <Lightbulb className="w-5 h-5 text-mint-dark" />,
      title: "AI Decision Helper",
      subtitle: "Instant clarity",
      description: "Stuck on an AI decision? Get structured advice and a clear next step right now."
    },
    {
      id: 'friction' as const,
      icon: <Map className="w-5 h-5 text-mint-dark" />,
      title: "Friction Map Builder",
      subtitle: "Map your time sink",
      description: "Visualize your biggest friction point and see how AI can help you reclaim your time."
    },
    {
      id: 'portfolio' as const,
      icon: <TrendingUp className="w-5 h-5 text-mint-dark" />,
      title: "Model out your starting points",
      subtitle: "Build your AI portfolio",
      description: "Select your weekly tasks and see your personalized transformation roadmap."
    }
  ];

  const renderDialogContent = () => {
    const aiDisclaimer = (
      <div className="mb-4 p-3 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg">
        <p className="text-xs text-red-900 dark:text-red-200">
          <strong>AI-Powered Sample:</strong> This tool uses AI trained on decades of proprietary data, decision-making frameworks, and cognitive research. However, this is an AI response for exploration purposes. Consultation with Krish is the next step for personalized guidance.
        </p>
      </div>
    );

    switch (dialogType) {
      case 'quiz':
        return (
          <>
            <DialogHeader>
              <DialogTitle>Builder Profile Quiz</DialogTitle>
            </DialogHeader>
            {aiDisclaimer}
            <div className="mt-4">
              <BuilderAssessment compact={false} />
            </div>
          </>
        );
      case 'decision':
        return (
          <>
            <DialogHeader>
              <DialogTitle>AI Decision Helper</DialogTitle>
            </DialogHeader>
            {aiDisclaimer}
            <div className="mt-4">
              <TryItWidget compact={false} />
            </div>
          </>
        );
      case 'friction':
        return (
          <>
            <DialogHeader>
              <DialogTitle>Friction Map Builder</DialogTitle>
            </DialogHeader>
            {aiDisclaimer}
            <div className="mt-4">
              <FrictionMapBuilder compact={false} />
            </div>
          </>
        );
      case 'portfolio':
        return (
          <>
            <DialogHeader>
              <DialogTitle>Model out your starting points</DialogTitle>
            </DialogHeader>
            {aiDisclaimer}
            <div className="mt-4">
              <PortfolioBuilder compact={false} />
            </div>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <section 
      ref={sectionRef}
      className="section-padding bg-muted/30 relative overflow-hidden"
    >
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
      <div ref={triggerRef as any} className="container-width relative z-10">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div 
            className="text-center mb-12 md:mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              Lead from the front.
            </h2>
            
            {/* Disclaimer */}
            <motion.div 
              className="mb-6 max-w-3xl mx-auto"
              initial={{ opacity: 0 }}
              animate={isVisible ? { opacity: 1 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-mint/10 border border-mint/30 rounded-lg">
                <Sparkles className="w-3.5 h-3.5 text-mint-dark flex-shrink-0" />
                <span className="text-muted-foreground text-[0.7rem]">
                  <strong className="text-foreground">Sample tools for exploration.</strong> Actual tool recommendations and strategies are delivered through our Sprint services.
                </span>
              </div>
            </motion.div>
            
            <p className="text-lg md:text-xl text-muted-foreground max-w-4xl mx-auto">
              AI Agents will be working inside most businesses within six months. Are you ready to lead a new species of worker?
            </p>
          </motion.div>

          {/* Desktop: 2x2 Grid */}
          <div className="hidden md:grid md:grid-cols-2 gap-6 lg:gap-8">
            {cards.map((card, index) => (
              <InteractiveCard
                key={card.id}
                icon={card.icon}
                title={card.title}
                subtitle={card.subtitle}
                description={card.description}
                onClick={() => setDialogType(card.id)}
                delay={0.1 * (index + 1)}
              />
            ))}
          </div>

          {/* Mobile: Swipe Carousel */}
          <div className="md:hidden">
            <Carousel
              setApi={setCarouselApi}
              opts={{
                align: "center",
                loop: false,
              }}
              className="w-full"
            >
              <CarouselContent>
                {cards.map((card) => (
                  <CarouselItem key={card.id} className="basis-[85%]">
                    <InteractiveCard
                      icon={card.icon}
                      title={card.title}
                      subtitle={card.subtitle}
                      description={card.description}
                      onClick={() => setDialogType(card.id)}
                    />
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>

            {/* Dot Indicators */}
            <div className="flex justify-center gap-2 mt-6">
              {cards.map((_, index) => (
                <button
                  key={index}
                  onClick={() => carouselApi?.scrollTo(index)}
                  className={`h-2 rounded-full transition-all ${
                    currentSlide === index 
                      ? 'w-8 bg-mint' 
                      : 'w-2 bg-muted-foreground/30'
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Dialog for Interactive Components */}
      <Dialog open={dialogType !== null} onOpenChange={() => setDialogType(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          {renderDialogContent()}
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default TheProblem;

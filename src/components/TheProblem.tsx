import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useRef, useState, useEffect } from "react";
import { useScrollTrigger } from "@/hooks/useScrollTrigger";
import { BuilderAssessment } from "@/components/Interactive/BuilderAssessment";
import { FrictionMapBuilder } from "@/components/Interactive/FrictionMapBuilder";
import { TryItWidget } from "@/components/Interactive/AIDecisionHelper";
import { PortfolioBuilder } from "@/components/Interactive/PortfolioBuilder";
import { User, Lightbulb, Map, TrendingUp, X, Mic, Crown, Wrench, Users } from "lucide-react";
import { Dialog, DialogWizardContent } from "@/components/ui/dialog";
import { Carousel, CarouselContent, CarouselItem, CarouselApi } from "@/components/ui/carousel";
import { useIsMobile } from "@/hooks/use-mobile";

type DialogType = 'quiz' | 'decision' | 'friction' | 'portfolio' | null;

interface InteractiveCardProps {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  description: string;
  onClick: () => void;
  delay?: number;
  hasVoice?: boolean;
}

const InteractiveCard = ({ icon, title, subtitle, description, onClick, delay = 0, hasVoice = true }: InteractiveCardProps) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay }}
      className="flex flex-col h-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div 
        className="premium-card flex-1 flex flex-col p-6 cursor-pointer group relative overflow-hidden rounded-2xl"
        onClick={onClick}
      >
        {/* Animated gradient border effect on hover */}
        <motion.div
          className="absolute inset-0 rounded-2xl pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
          style={{
            background: 'linear-gradient(135deg, hsl(var(--mint) / 0.3) 0%, transparent 50%, hsl(var(--mint) / 0.2) 100%)',
          }}
        />

        {/* Content */}
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <motion.div 
                className="w-12 h-12 rounded-xl bg-gradient-to-br from-mint/30 to-mint/10 flex items-center justify-center shadow-lg shadow-mint/10"
                animate={isHovered ? { scale: 1.05, rotate: 3 } : { scale: 1, rotate: 0 }}
                transition={{ duration: 0.3 }}
              >
                {icon}
              </motion.div>
              <div>
                <h3 className="font-bold text-lg leading-tight">{title}</h3>
                <p className="text-xs text-muted-foreground">{subtitle}</p>
              </div>
            </div>
            
            {/* Voice indicator badge */}
            {hasVoice && (
              <motion.div
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-mint/10 border border-mint/20"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: delay + 0.3 }}
              >
                <Mic className="w-3 h-3 text-mint" />
                <span className="text-[10px] font-medium text-mint-dark">Voice</span>
              </motion.div>
            )}
          </div>
          
          <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
            {description}
          </p>
          
          <div className="mt-auto">
            <Button 
              variant="mint" 
              className="w-full group/btn relative overflow-hidden"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                Open Tool
                <motion.span
                  animate={isHovered ? { x: 4 } : { x: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  →
                </motion.span>
              </span>
            </Button>
          </div>
        </div>

        {/* Decorative corner accent */}
        <div className="absolute top-0 right-0 w-16 h-16 overflow-hidden pointer-events-none">
          <motion.div
            className="absolute -top-8 -right-8 w-16 h-16 bg-gradient-to-br from-mint/20 to-transparent rotate-45"
            animate={isHovered ? { scale: 1.5, opacity: 1 } : { scale: 1, opacity: 0.5 }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>
    </motion.div>
  );
};

// Mobile carousel card - more compact with glass morphism
const MobileInteractiveCard = ({ icon, title, subtitle, description, onClick, hasVoice = true }: InteractiveCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="h-full"
    >
      <div 
        className="h-full flex flex-col p-5 cursor-pointer rounded-2xl relative overflow-hidden"
        onClick={onClick}
        style={{
          background: 'linear-gradient(135deg, hsl(var(--card) / 0.95), hsl(var(--mint) / 0.05))',
          backdropFilter: 'blur(12px)',
          border: '2px solid hsl(var(--mint) / 0.3)',
          boxShadow: '0 8px 32px hsl(var(--mint) / 0.1), inset 0 1px 0 hsl(var(--mint) / 0.1)',
        }}
      >
        {/* Voice indicator */}
        {hasVoice && (
          <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-0.5 rounded-full bg-mint/15 border border-mint/25">
            <Mic className="w-2.5 h-2.5 text-mint" />
            <span className="text-[9px] font-medium text-mint-dark">Voice</span>
          </div>
        )}

        <div className="flex items-start gap-3 mb-3">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-mint/30 to-mint/10 flex items-center justify-center flex-shrink-0">
            {icon}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-base leading-tight">{title}</h3>
            <p className="text-[11px] text-muted-foreground">{subtitle}</p>
          </div>
        </div>
        
        <p className="text-sm text-muted-foreground mb-4 leading-relaxed flex-1">
          {description}
        </p>
        
        <Button 
          variant="mint" 
          className="w-full"
          size="default"
        >
          Open Tool →
        </Button>
      </div>
    </motion.div>
  );
};

// ICP Slider Component with shimmering borders
const ICPSlider = () => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const isMobile = useIsMobile();

  const icps = [
    {
      id: 'hands-off',
      icon: Crown,
      title: 'HANDS-OFF LEADERS',
      description: 'AI systems, authority, and ideas. Deploy working systems without hands-on building.',
    },
    {
      id: 'hands-on',
      icon: Wrench,
      title: 'HANDS-ON BUILDERS',
      description: 'Build alongside AI. Create weapons-grade GTM engines, content engines, and apps.',
    },
    {
      id: 'teams',
      icon: Users,
      title: 'TEAMS NEEDING TRANSFORMATION',
      description: 'Sharpen communal AI literacy before committing. Stop wasting your one bullet.',
    },
  ];

  return (
    <div className="mb-12 md:mb-16">
      {/* Desktop: Horizontal Slider with visible previews */}
      <div className="hidden md:block">
        <div className="relative max-w-6xl mx-auto px-8">
          <div className="flex items-center gap-6 overflow-hidden">
            {icps.map((icp, index) => {
              const IconComponent = icp.icon;
              const isSelected = selectedIndex === index;
              const offset = index - selectedIndex;
              const scale = isSelected ? 1 : 0.9;
              const opacity = Math.abs(offset) <= 1 ? 1 : 0.4;
              
              return (
                <motion.div
                  key={icp.id}
                  className="flex-1 cursor-pointer"
                  onClick={() => setSelectedIndex(index)}
                  initial={false}
                  animate={{
                    scale,
                    opacity,
                    x: offset * 20,
                  }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                >
                  <div className="relative p-6 rounded-2xl bg-card border-2 overflow-hidden group">
                    {/* Shimmering border effect */}
                    <div className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none">
                      <motion.div
                        className="absolute inset-0"
                        style={{
                          background: isSelected
                            ? 'linear-gradient(135deg, hsl(var(--mint) / 0.4) 0%, transparent 50%, hsl(var(--mint) / 0.3) 100%)'
                            : 'linear-gradient(135deg, hsl(var(--mint) / 0.1) 0%, transparent 50%, hsl(var(--mint) / 0.05) 100%)',
                        }}
                        animate={
                          isSelected
                            ? {
                                backgroundPosition: ['0% 0%', '100% 100%'],
                              }
                            : {}
                        }
                        transition={{
                          duration: 3,
                          repeat: Infinity,
                          repeatType: 'reverse',
                          ease: 'linear',
                        }}
                      />
                      {/* Animated shimmer line */}
                      {isSelected && (
                        <motion.div
                          className="absolute inset-0"
                          style={{
                            background: 'linear-gradient(90deg, transparent 0%, hsl(var(--mint) / 0.6) 50%, transparent 100%)',
                            backgroundSize: '200% 100%',
                          }}
                          animate={{
                            backgroundPosition: ['-200% 0', '200% 0'],
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: 'linear',
                          }}
                        />
                      )}
                    </div>

                    {/* Border */}
                    <motion.div
                      className="absolute inset-0 rounded-2xl pointer-events-none"
                      style={{
                        border: isSelected ? '2px solid hsl(var(--mint) / 0.6)' : '2px solid hsl(var(--border))',
                        boxShadow: isSelected
                          ? '0 0 20px hsl(var(--mint) / 0.3), inset 0 0 20px hsl(var(--mint) / 0.1)'
                          : 'none',
                      }}
                      animate={{
                        boxShadow: isSelected
                          ? [
                              '0 0 20px hsl(var(--mint) / 0.3), inset 0 0 20px hsl(var(--mint) / 0.1)',
                              '0 0 30px hsl(var(--mint) / 0.4), inset 0 0 25px hsl(var(--mint) / 0.15)',
                              '0 0 20px hsl(var(--mint) / 0.3), inset 0 0 20px hsl(var(--mint) / 0.1)',
                            ]
                          : 'none',
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: 'easeInOut',
                      }}
                    />

                    {/* Content */}
                    <div className="relative z-10">
                      <div className="flex items-center gap-4 mb-4">
                        <motion.div
                          className="w-16 h-16 rounded-xl bg-gradient-to-br from-mint/30 to-mint/10 flex items-center justify-center"
                          animate={isSelected ? { scale: 1.1, rotate: 5 } : { scale: 1, rotate: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <IconComponent className="w-8 h-8 text-mint" />
                        </motion.div>
                        <div className="flex-1">
                          <h3 className="font-bold text-sm text-mint-dark mb-1">{icp.title}</h3>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed">{icp.description}</p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Navigation dots */}
          <div className="flex justify-center gap-2 mt-6">
            {icps.map((_, index) => (
              <button
                key={index}
                onClick={() => setSelectedIndex(index)}
                className={`h-2 rounded-full transition-all ${
                  selectedIndex === index ? 'w-8 bg-mint' : 'w-2 bg-muted-foreground/30'
                }`}
                aria-label={`Select ${icps[index].title}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Mobile: Full-width swipeable cards */}
      <div className="md:hidden">
        <Carousel
          setApi={(api) => {
            if (api) {
              api.on("select", () => {
                setSelectedIndex(api.selectedScrollSnap());
              });
            }
          }}
          opts={{
            align: "center",
            loop: false,
          }}
          className="w-full"
        >
          <CarouselContent>
            {icps.map((icp, index) => {
              const IconComponent = icp.icon;
              return (
                <CarouselItem key={icp.id} className="basis-full">
                  <div className="relative p-6 rounded-2xl bg-card border-2 overflow-hidden mx-2">
                    {/* Shimmering border effect */}
                    <div className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none">
                      <motion.div
                        className="absolute inset-0"
                        style={{
                          background: 'linear-gradient(135deg, hsl(var(--mint) / 0.3) 0%, transparent 50%, hsl(var(--mint) / 0.2) 100%)',
                        }}
                        animate={{
                          backgroundPosition: ['0% 0%', '100% 100%'],
                        }}
                        transition={{
                          duration: 3,
                          repeat: Infinity,
                          repeatType: 'reverse',
                          ease: 'linear',
                        }}
                      />
                      <motion.div
                        className="absolute inset-0"
                        style={{
                          background: 'linear-gradient(90deg, transparent 0%, hsl(var(--mint) / 0.5) 50%, transparent 100%)',
                          backgroundSize: '200% 100%',
                        }}
                        animate={{
                          backgroundPosition: ['-200% 0', '200% 0'],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: 'linear',
                        }}
                      />
                    </div>

                    {/* Border */}
                    <div
                      className="absolute inset-0 rounded-2xl pointer-events-none"
                      style={{
                        border: '2px solid hsl(var(--mint) / 0.5)',
                        boxShadow: '0 0 20px hsl(var(--mint) / 0.3), inset 0 0 20px hsl(var(--mint) / 0.1)',
                      }}
                    />

                    {/* Content */}
                    <div className="relative z-10">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-mint/30 to-mint/10 flex items-center justify-center">
                          <IconComponent className="w-8 h-8 text-mint" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold text-sm text-mint-dark mb-1">{icp.title}</h3>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed">{icp.description}</p>
                    </div>
                  </div>
                </CarouselItem>
              );
            })}
          </CarouselContent>
        </Carousel>

        {/* Dot indicators */}
        <div className="flex justify-center gap-2 mt-6">
          {icps.map((_, index) => (
            <div
              key={index}
              className={`h-2 rounded-full transition-all ${
                selectedIndex === index ? 'w-8 bg-mint' : 'w-2 bg-muted-foreground/30'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

const TheProblem = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const { elementRef: triggerRef, isVisible } = useScrollTrigger({ threshold: 0.2 });
  const [dialogType, setDialogType] = useState<DialogType>(null);
  const [carouselApi, setCarouselApi] = useState<CarouselApi>();
  const [currentSlide, setCurrentSlide] = useState(0);
  const isMobile = useIsMobile();

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

  const getDialogTitle = () => {
    switch (dialogType) {
      case 'quiz': return 'Builder Profile Quiz';
      case 'decision': return 'AI Decision Helper';
      case 'friction': return 'Friction Map Builder';
      case 'portfolio': return 'Model out your starting points';
      default: return '';
    }
  };

  const renderDialogContent = () => {
    switch (dialogType) {
      case 'quiz':
        return <BuilderAssessment compact={false} onClose={() => setDialogType(null)} />;
      case 'decision':
        return <TryItWidget compact={false} onClose={() => setDialogType(null)} />;
      case 'friction':
        return <FrictionMapBuilder compact={false} onClose={() => setDialogType(null)} />;
      case 'portfolio':
        return <PortfolioBuilder compact={false} onClose={() => setDialogType(null)} />;
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
      
      {/* Decorative gradient orbs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-mint/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-mint/5 rounded-full blur-3xl pointer-events-none" />
      
      <div ref={triggerRef as any} className="container-width relative z-10">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div 
            className="text-center mb-12 md:mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={isVisible ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-mint/10 border border-mint/20 mb-6"
            >
              <Mic className="w-4 h-4 text-mint" />
              <span className="text-sm font-medium text-mint-dark">Voice-enabled tools</span>
            </motion.div>
            
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              Boss the boardroom confidently.
            </h2>
            
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Three paths. One outcome: confident boardroom leadership.
            </p>
          </motion.div>

          {/* ICP Slider */}
          <ICPSlider />

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
                hasVoice={true}
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
                    <MobileInteractiveCard
                      icon={card.icon}
                      title={card.title}
                      subtitle={card.subtitle}
                      description={card.description}
                      onClick={() => setDialogType(card.id)}
                      hasVoice={true}
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
        <DialogWizardContent className="sm:max-w-2xl sm:max-h-[85vh]" hideCloseButton={isMobile}>
          {/* Mobile: Header with close button integrated into tool */}
          {!isMobile && (
            <div className="shrink-0 p-6 pb-4 border-b">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold">{getDialogTitle()}</h2>
                  <p className="text-xs text-muted-foreground mt-1">
                    Powered by Mindmaker Methodology
                  </p>
                </div>
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-mint/10 border border-mint/20">
                  <Mic className="w-3 h-3 text-mint" />
                  <span className="text-[10px] font-medium text-mint-dark">Voice Enabled</span>
                </div>
              </div>
            </div>
          )}
          <div className="flex-1 flex flex-col overflow-hidden min-h-0 sm:p-6 sm:pt-4">
            {renderDialogContent()}
          </div>
        </DialogWizardContent>
      </Dialog>
    </section>
  );
};

export default TheProblem;

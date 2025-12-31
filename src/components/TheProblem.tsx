import { useState, useRef, useEffect, useCallback } from "react";
import { motion, useInView } from "framer-motion";
import { useIsMobile } from "@/hooks/use-mobile";
import { ArrowUp, MousePointer2 } from "lucide-react";
import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from "@/components/ui/carousel";

interface PanelData {
  problem: {
    video: string;
    headline: string;
    objectPosition?: string;
  };
  opportunity: {
    video: string;
    headline: string;
    objectPosition?: string;
  };
}

const panels: PanelData[] = [
  {
    problem: {
      video: '/problem 1.mp4',
      headline: 'AI is being bought like software and implemented like labor.',
      objectPosition: 'center center',
    },
    opportunity: {
      video: '/solution 1.mp4',
      headline: 'Successful leaders are embracing AI literacy, not delegating it.',
      objectPosition: 'center center',
    },
  },
  {
    problem: {
      video: '/problem 2.mp4',
      headline: 'Dashboard theatre blurs what real success looks like.',
      objectPosition: 'center center',
    },
    opportunity: {
      video: '/solution 2.mp4',
      headline: 'Leaders who build their own systems can\'t be fooled.',
      objectPosition: 'center center',
    },
  },
  {
    problem: {
      video: '/problem 3.mp4',
      headline: 'Leadership teams are looking to one another for the answer.',
      objectPosition: 'center center',
    },
    opportunity: {
      video: '/solution 3.mp4',
      headline: 'Teams aligned once can create compounding successes across the org.',
      objectPosition: 'center center',
    },
  },
];

interface PanelProps {
  panel: PanelData;
  index: number;
}

const Panel = ({ panel, index }: PanelProps) => {
  const panelRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [wipeProgress, setWipeProgress] = useState(0);
  const [isWiped, setIsWiped] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const isInView = useInView(panelRef, { once: false, amount: 0.3 });
  const isMobile = useIsMobile();

  // Handle hover for desktop
  const handleMouseEnter = useCallback(() => {
    if (!isMobile) {
      setIsHovered(true);
      if (!isWiped) {
        setIsWiped(true);
        setWipeProgress(1);
        if (containerRef.current) {
          containerRef.current.style.setProperty('--wipe-progress', '0%'); // 0% = fully revealed
        }
      }
    }
  }, [isMobile, isWiped]);

  const handleMouseLeave = useCallback(() => {
    if (!isMobile) {
      setIsHovered(false);
    }
  }, [isMobile]);

  // Handle click/tap as alternative trigger
  const handleClick = useCallback(() => {
    if (!isWiped) {
      setIsWiped(true);
      setWipeProgress(1);
      if (containerRef.current) {
        containerRef.current.style.setProperty('--wipe-progress', '0%');
      }
    }
  }, [isWiped]);

  // Initialize CSS variable (start at 100% = fully hidden)
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.style.setProperty('--wipe-progress', '100%');
    }
  }, []);

  return (
    <motion.div
      ref={panelRef}
      className="relative h-[80vh] w-full overflow-hidden cursor-pointer group"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      aria-label={`Panel ${index + 1}: ${panel.problem.headline}`}
      whileHover={!isMobile && !isWiped ? { scale: 1.02 } : {}}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      style={{
        boxShadow: isHovered && !isWiped
          ? '0 0 40px rgba(158, 82%, 73%, 0.3), 0 0 80px rgba(158, 82%, 73%, 0.15)'
          : 'none',
        border: isHovered && !isWiped
          ? '2px solid rgba(158, 82%, 73%, 0.4)'
          : '2px solid transparent',
        transition: 'box-shadow 0.3s ease, border 0.3s ease',
      }}
    >
      {/* Visual Affordance Indicator - Desktop Only */}
      {!isMobile && !isWiped && (
        <motion.div
          className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 pointer-events-none"
          initial={{ opacity: 0, y: 10 }}
          animate={{ 
            opacity: [0.6, 1, 0.6],
            y: [0, -4, 0],
          }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          <div className="flex items-center gap-2 text-white/90 text-sm font-medium bg-black/40 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20">
            <MousePointer2 className="w-4 h-4" />
            <span>Hover to reveal solution</span>
          </div>
        </motion.div>
      )}

      {/* Problem Video Layer (Bottom - Always Visible) */}
      <div className="absolute inset-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
          style={{
            objectPosition: panel.problem.objectPosition || 'center center',
          }}
          aria-hidden="true"
        >
          <source src={panel.problem.video} type="video/mp4" />
        </video>
        
        {/* Problem Overlay */}
        <div
          className="absolute inset-0"
          style={{
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
          }}
          aria-hidden="true"
        />

        {/* Problem Text Overlay */}
        <div className="absolute inset-0 z-10 flex items-center justify-center px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{
              duration: 0.8,
              ease: [0.25, 0.1, 0.25, 1],
              delay: 0.2,
            }}
            className="max-w-[90%] text-center"
            style={{
              background: 'rgba(0, 0, 0, 0.6)',
              backdropFilter: 'blur(8px)',
              padding: '1.5rem 2rem',
              borderRadius: '8px',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)',
            }}
          >
            <h2
              className="font-display text-xl sm:text-2xl md:text-3xl font-normal leading-[1.15] tracking-tight text-white"
              style={{
                textShadow: '0 2px 8px rgba(0, 0, 0, 0.8), 0 4px 16px rgba(0, 0, 0, 0.6)',
              }}
            >
              {panel.problem.headline}
            </h2>
          </motion.div>
        </div>
      </div>

      {/* Solution Video Layer (Top - Revealed via Wipe) */}
      <div
        ref={containerRef}
        className="absolute inset-0"
        style={{
          clipPath: 'inset(var(--wipe-progress, 100%) 0 0 0)',
          transition: isWiped ? 'clip-path 1.5s cubic-bezier(0.25, 0.1, 0.25, 1)' : 'none',
          willChange: 'clip-path',
        }}
      >
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
          style={{
            objectPosition: panel.opportunity.objectPosition || 'center center',
          }}
          aria-hidden="true"
        >
          <source src={panel.opportunity.video} type="video/mp4" />
        </video>
        
        {/* Opportunity Overlay */}
        <div
          className="absolute inset-0"
          style={{
            backgroundColor: 'rgba(0, 0, 0, 0.4)',
          }}
          aria-hidden="true"
        />

        {/* Opportunity Text Overlay */}
        <div className="absolute inset-0 z-10 flex items-center justify-center px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={wipeProgress > 0.3 ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{
              duration: 0.8,
              ease: [0.25, 0.1, 0.25, 1],
              delay: 0.3,
            }}
            className="max-w-[90%] text-center"
            style={{
              background: 'rgba(255, 255, 255, 0.85)',
              backdropFilter: 'blur(8px)',
              padding: '1.5rem 2rem',
              borderRadius: '8px',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
            }}
          >
            <h2
              className="font-display text-xl sm:text-2xl md:text-3xl font-normal leading-[1.15] tracking-tight text-foreground"
              style={{
                textShadow: '0 1px 4px rgba(0, 0, 0, 0.2)',
              }}
            >
              {panel.opportunity.headline}
            </h2>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

interface MobilePanelProps {
  panel: PanelData;
  index: number;
  isActive: boolean;
}

const MobilePanel = ({ panel, index, isActive }: MobilePanelProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [wipeProgress, setWipeProgress] = useState(0);
  const [isWiped, setIsWiped] = useState(false);
  const isInView = useInView(containerRef, { once: false, amount: 0.5 });

  // Auto-reveal when panel is centered and in view
  useEffect(() => {
    if (isActive && isInView && !isWiped) {
      const timer = setTimeout(() => {
        setIsWiped(true);
        setWipeProgress(1);
        if (containerRef.current) {
          containerRef.current.style.setProperty('--wipe-progress', '0%'); // 0% = fully revealed
        }
      }, 800); // Delay for better UX

      return () => clearTimeout(timer);
    }
  }, [isActive, isInView, isWiped]);

  // Handle tap to reveal
  const handleClick = useCallback(() => {
    if (!isWiped) {
      setIsWiped(true);
      setWipeProgress(1);
      if (containerRef.current) {
        containerRef.current.style.setProperty('--wipe-progress', '0%');
      }
    }
  }, [isWiped]);

  // Initialize CSS variable
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.style.setProperty('--wipe-progress', '100%');
    }
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative h-[65vh] w-full overflow-hidden rounded-lg"
      onClick={handleClick}
      role="button"
      tabIndex={0}
      aria-label={`Panel ${index + 1}: ${panel.problem.headline}`}
    >
      {/* Problem Video Layer */}
      <div className="absolute inset-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
          style={{
            objectPosition: panel.problem.objectPosition || 'center center',
          }}
          aria-hidden="true"
        >
          <source src={panel.problem.video} type="video/mp4" />
        </video>
        
        <div
          className="absolute inset-0"
          style={{
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
          }}
          aria-hidden="true"
        />

        <div className="absolute inset-0 z-10 flex items-center justify-center px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{
              duration: 0.6,
              ease: [0.25, 0.1, 0.25, 1],
            }}
            className="max-w-[90%] text-center"
            style={{
              background: 'rgba(0, 0, 0, 0.6)',
              backdropFilter: 'blur(8px)',
              padding: '1.25rem 1.75rem',
              borderRadius: '8px',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)',
            }}
          >
            <h2
              className="font-display text-lg sm:text-xl md:text-2xl font-normal leading-[1.15] tracking-tight text-white"
              style={{
                textShadow: '0 2px 8px rgba(0, 0, 0, 0.8), 0 4px 16px rgba(0, 0, 0, 0.6)',
              }}
            >
              {panel.problem.headline}
            </h2>
            {!isWiped && (
              <motion.div
                className="mt-3 text-white/80 text-xs flex items-center justify-center gap-1"
                animate={{ opacity: [0.6, 1, 0.6] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <span>Tap to reveal solution</span>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>

      {/* Solution Video Layer */}
      <div
        className="absolute inset-0"
        style={{
          clipPath: 'inset(var(--wipe-progress, 100%) 0 0 0)',
          transition: isWiped ? 'clip-path 1.5s cubic-bezier(0.25, 0.1, 0.25, 1)' : 'none',
          willChange: 'clip-path',
        }}
      >
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
          style={{
            objectPosition: panel.opportunity.objectPosition || 'center center',
          }}
          aria-hidden="true"
        >
          <source src={panel.opportunity.video} type="video/mp4" />
        </video>
        
        <div
          className="absolute inset-0"
          style={{
            backgroundColor: 'rgba(0, 0, 0, 0.4)',
          }}
          aria-hidden="true"
        />

        <div className="absolute inset-0 z-10 flex items-center justify-center px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={wipeProgress > 0.3 ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{
              duration: 0.8,
              ease: [0.25, 0.1, 0.25, 1],
              delay: 0.3,
            }}
            className="max-w-[90%] text-center"
            style={{
              background: 'rgba(255, 255, 255, 0.85)',
              backdropFilter: 'blur(8px)',
              padding: '1.25rem 1.75rem',
              borderRadius: '8px',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
            }}
          >
            <h2
              className="font-display text-lg sm:text-xl md:text-2xl font-normal leading-[1.15] tracking-tight text-foreground"
              style={{
                textShadow: '0 1px 4px rgba(0, 0, 0, 0.2)',
              }}
            >
              {panel.opportunity.headline}
            </h2>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

const TheProblem = () => {
  const isMobile = useIsMobile();
  const [carouselApi, setCarouselApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!carouselApi) {
      return;
    }

    setCurrent(carouselApi.selectedScrollSnap());

    carouselApi.on("select", () => {
      setCurrent(carouselApi.selectedScrollSnap());
    });
  }, [carouselApi]);

  // Desktop: Grid layout
  if (!isMobile) {
    return (
      <section className="relative w-full py-12 md:py-16" aria-label="Problem to opportunity journey">
        <div className="container-width mb-12 md:mb-16">
          <h2 className="text-center font-display text-2xl font-normal tracking-tight text-foreground sm:text-3xl md:text-4xl">
            Boss the boardroom confidently.
          </h2>
        </div>

        <div className="container-width">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
            {panels.map((panel, index) => (
              <Panel key={index} panel={panel} index={index} />
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Mobile: Horizontal carousel
  return (
    <section className="relative w-full py-8 md:py-12" aria-label="Problem to opportunity journey">
      <div className="container-width mb-8 md:mb-12">
        <h2 className="text-center font-display text-xl font-normal tracking-tight text-foreground sm:text-2xl md:text-3xl">
          Boss the boardroom confidently.
        </h2>
      </div>

      <div className="container-width">
        <Carousel
          setApi={setCarouselApi}
          opts={{
            align: 'center',
            loop: false,
            dragFree: false,
            containScroll: 'trimSnaps',
          }}
          orientation="horizontal"
          className="w-full"
        >
          <CarouselContent className="-ml-2 md:-ml-4">
            {panels.map((panel, index) => (
              <CarouselItem key={index} className="pl-2 md:pl-4 basis-[90%] sm:basis-[85%]">
                <MobilePanel panel={panel} index={index} isActive={current === index} />
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>

        {/* Dot Indicators */}
        <div className="flex justify-center gap-2 mt-6">
          {panels.map((_, index) => (
            <button
              key={index}
              onClick={() => carouselApi?.scrollTo(index)}
              className={`h-2 rounded-full transition-all ${
                current === index
                  ? 'w-8 bg-mint'
                  : 'w-2 bg-muted-foreground/30'
              }`}
              aria-label={`Go to panel ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TheProblem;

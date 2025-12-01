import { motion } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';

const transformations = [
  { 
    before: "47 browser tabs about 'AI strategy'", 
    after: "Clear decision framework that makes sense" 
  },
  { 
    before: "Conflicting vendor promises everywhere", 
    after: "Vendor evaluation criteria with BS detector" 
  },
  { 
    before: "Scattered notes across 5 apps", 
    after: "Working prototype in production" 
  },
  { 
    before: "Endless AI meetings going nowhere", 
    after: "Confident narrative and boardroom prep" 
  },
  { 
    before: "Team asking about AI news daily", 
    after: "You're the one others DM for advice" 
  },
  { 
    before: "Zero prototypes. Zero conviction.", 
    after: "Confidence to say 'no' to shiny objects" 
  },
];

const BeforeAfterSplit = () => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Map raw scroll progress to animation progress with three phases
  const getAnimationProgress = (rawProgress: number): number => {
    // Phase 1: 0% → 25% scroll = 0% animation (Section enters, user reads "Before")
    if (rawProgress < 0.25) return 0;
    
    // Phase 2: 25% → 65% scroll = 0% → 100% animation (Wipe moves 1:1 with scroll)
    if (rawProgress < 0.65) {
      return (rawProgress - 0.25) / 0.40; // 40% of scroll for the wipe
    }
    
    // Phase 3: 65% → 100% scroll = 100% animation (Dwell zone - "After" stays visible)
    return 1;
  };

  useEffect(() => {
    const handleScroll = () => {
      if (!wrapperRef.current) return;
      
      const wrapperRect = wrapperRef.current.getBoundingClientRect();
      const wrapperHeight = wrapperRef.current.offsetHeight;
      const viewportHeight = window.innerHeight;
      
      // Calculate raw progress: how far through the wrapper has the user scrolled?
      // 0 when wrapper top is at viewport bottom, 1 when wrapper bottom exits viewport top
      const rawProgress = (viewportHeight - wrapperRect.top) / (wrapperHeight + viewportHeight);
      
      setScrollProgress(Math.max(0, Math.min(1, rawProgress)));
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const animationProgress = getAnimationProgress(scrollProgress);

  return (
    <div 
      ref={wrapperRef}
      className="relative bg-muted/30"
      style={{ height: '200vh' }}
    >
      <section 
        className="sticky px-4 py-16 md:py-24"
        style={{ 
          top: '10vh',
          height: '80vh',
          display: 'flex',
          alignItems: 'center'
        }}
      >
      <div className="container mx-auto max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold mb-3">
            The Transformation
          </h2>
          <p className="text-sm text-muted-foreground">
            Watch chaos become clarity
          </p>
        </div>

        {/* Scroll progress indicator */}
        {scrollProgress > 0 && scrollProgress < 1 && (
          <div className="flex items-center justify-center gap-2 mb-6">
            <div className="h-1 w-20 bg-muted rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-mint rounded-full"
                style={{ width: `${animationProgress * 100}%` }}
              />
            </div>
            <span className="text-xs text-muted-foreground">
              {animationProgress === 0 ? '↓ Scroll to transform' : 
               animationProgress < 1 ? 'Scroll to reveal...' : 
               '✓ Complete'}
            </span>
          </div>
        )}

        {/* Two-layer card with horizontal sweep */}
        <div className="relative editorial-card overflow-hidden">
          {/* AFTER layer (bottom) - always visible */}
          <div className="space-y-6">
            {/* Header */}
            <div className="border-l-4 pl-4" style={{ borderColor: 'hsl(var(--mint))' }}>
              <h3 className="text-xl font-bold text-foreground mb-2">
                After: Clarity
              </h3>
              <p className="text-sm text-muted-foreground">
                Building with conviction
              </p>
            </div>
            
            {/* Items */}
            <div className="space-y-4">
              {transformations.map((item, index) => {
                const itemProgress = getItemProgress(index, animationProgress);
                return (
                  <motion.div 
                    key={`after-${index}`}
                    className="flex items-start gap-3"
                    animate={{
                      scale: itemProgress > 0.3 && itemProgress < 0.7 ? 1.03 : 1,
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    <div 
                      className="w-2 h-2 rounded-full mt-2 flex-shrink-0"
                      style={{ backgroundColor: 'hsl(var(--mint))' }}
                    />
                    <p className="text-sm text-foreground font-medium flex-1">
                      {item.after}
                    </p>
                  </motion.div>
                );
              })}
            </div>
            
            {/* Quote */}
            <div className="pt-4 border-t space-y-2" style={{ borderColor: 'hsl(var(--mint) / 0.2)' }}>
              <p className="text-xs font-semibold text-green-700 dark:text-green-600">
                "I know exactly what we're building, why it matters, and how to get there."
              </p>
              <p className="text-xs font-bold text-foreground">
                Guarantee or your money back
              </p>
            </div>
          </div>

          {/* BEFORE layer (top) - clips away with scroll */}
          <motion.div
            className="absolute inset-0 bg-card"
            style={{
              clipPath: `inset(0 0 0 ${animationProgress * 100}%)`,
            }}
            transition={{ type: "tween", ease: "easeOut", duration: 0.1 }}
          >
            <div className="space-y-6 p-6">
              {/* Header */}
              <div className="border-l-4 pl-4" style={{ borderColor: 'hsl(var(--destructive))' }}>
                <h3 className="text-xl font-bold text-foreground mb-2">
                  Before: Chaos
                </h3>
                <p className="text-sm text-muted-foreground">
                  Overwhelmed by AI hype
                </p>
              </div>
              
              {/* Items */}
              <div className="space-y-4">
                {transformations.map((item, index) => (
                  <div 
                    key={`before-${index}`}
                    className="flex items-start gap-3"
                  >
                    <div 
                      className="w-2 h-2 rounded-full mt-2 flex-shrink-0"
                      style={{ backgroundColor: 'hsl(var(--destructive))' }}
                    />
                    <p className="text-sm text-muted-foreground flex-1">
                      {item.before}
                    </p>
                  </div>
                ))}
              </div>
              
              {/* Quote */}
              <div className="pt-4 border-t" style={{ borderColor: 'hsl(var(--border))' }}>
                <p className="text-xs text-muted-foreground italic">
                  "Everyone's talking about AI, but I don't know where to start or who to trust."
                </p>
              </div>
            </div>
          </motion.div>

          {/* Mint glow line at sweep edge */}
          {animationProgress > 0.05 && animationProgress < 0.95 && (
            <motion.div
              className="absolute top-0 bottom-0 w-1 pointer-events-none"
              style={{
                left: `${animationProgress * 100}%`,
                background: 'linear-gradient(to right, transparent, hsl(var(--mint)), transparent)',
                boxShadow: '0 0 20px 2px hsl(var(--mint) / 0.5)',
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            />
          )}
        </div>

        {/* Completion message */}
        {animationProgress > 0.85 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mt-8"
          >
            <p className="text-sm text-muted-foreground">
              This isn't theory. It's what happens when you work with a practitioner who's been in your seat.
            </p>
          </motion.div>
        )}
      </div>
    </section>
    </div>
  );
};

// Calculate progress for each item with stagger
const getItemProgress = (index: number, animationProgress: number) => {
  const itemStart = index * 0.15;
  const itemDuration = 0.20;
  return Math.max(0, Math.min(1, (animationProgress - itemStart) / itemDuration));
};

export default BeforeAfterSplit;

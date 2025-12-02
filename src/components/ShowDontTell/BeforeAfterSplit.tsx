import { motion } from 'framer-motion';
import { useState, useCallback } from 'react';
import { useScrollLock } from '@/hooks/useScrollLock';

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
  const [animationProgress, setAnimationProgress] = useState(0);
  const isComplete = animationProgress >= 1;

  const PROGRESS_DIVISOR = 700; // Tune for scroll feel (higher = slower animation)
  
  const handleProgress = useCallback((delta: number, direction: 'up' | 'down') => {
    setAnimationProgress(prev => 
      Math.max(0, Math.min(1, prev + delta / PROGRESS_DIVISOR))
    );
  }, []);

  const canReverseExit = animationProgress <= 0;

  const { sectionRef, isLocked } = useScrollLock({
    lockThreshold: 0,
    onProgress: handleProgress,
    isComplete: isComplete || canReverseExit,
    canReverseExit: true,
    enabled: true,
  });

  // Calculate progress for each item with stagger
  const getItemProgress = (index: number) => {
    const itemStart = index * 0.15;
    const itemDuration = 0.20;
    return Math.max(0, Math.min(1, (animationProgress - itemStart) / itemDuration));
  };

  return (
    <section 
      ref={sectionRef}
      className="min-h-screen flex items-center justify-center bg-muted/30 px-4 py-16 md:py-24"
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

        {/* Progress indicator */}
        {isLocked && animationProgress < 1 && (
          <div className="flex items-center justify-center gap-2 mb-6">
            <div className="h-1 w-20 bg-muted rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-mint rounded-full"
                style={{ width: `${animationProgress * 100}%` }}
              />
            </div>
            <span className="text-xs text-muted-foreground">
              {animationProgress === 0 ? '↓ Scroll to transform' : 
               animationProgress < 1 ? 'Keep scrolling...' : 
               '✓ Complete'}
            </span>
          </div>
        )}

        {/* Two-layer card with horizontal wipe */}
        <div className="relative editorial-card overflow-hidden">
          {/* AFTER layer (bottom) - always visible */}
          <div className="space-y-6 p-6">
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
                const itemProgress = getItemProgress(index);
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

          {/* Mint glow line at wipe edge */}
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

        {/* Scroll Lock Indicator */}
        {isLocked && animationProgress < 1 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50"
          >
            <div className="bg-background/90 px-4 py-2 rounded-full border shadow-lg backdrop-blur-sm">
              <span className="text-xs text-muted-foreground">
                ↓ Keep scrolling ({Math.round(animationProgress * 100)}%)
              </span>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default BeforeAfterSplit;

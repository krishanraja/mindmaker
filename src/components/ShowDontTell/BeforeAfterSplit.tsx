import { useState, useCallback, useRef, useEffect } from 'react';
import { useScrollLock } from '@/hooks/useScrollLock';
import { useIsMobile } from '@/hooks/use-mobile';

const transformations = [
  { 
    before: "47 browser tabs about 'AI strategy'", 
    after: "Clear decision framework" 
  },
  { 
    before: "Conflicting vendor promises everywhere", 
    after: "Vendor evaluation with BS detector" 
  },
  { 
    before: "Scattered notes across 5 apps", 
    after: "Working prototype in production" 
  },
  { 
    before: "Endless AI meetings going nowhere", 
    after: "Confident boardroom narrative" 
  },
  { 
    before: "Team asking about AI news daily", 
    after: "You're the one others DM for advice" 
  },
  { 
    before: "Zero prototypes. Zero conviction.", 
    after: "Confidence to say 'no'" 
  },
];

const BeforeAfterSplit = () => {
  const isMobile = useIsMobile();
  
  // Use refs for continuous animation, state only for discrete UI changes
  const progressRef = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const rafIdRef = useRef<number | null>(null);
  const accumulatedDeltaRef = useRef(0);
  
  // State only for discrete UI updates (progress indicator text, completion)
  const [displayProgress, setDisplayProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  
  const PROGRESS_DIVISOR = isMobile ? 400 : 700;
  
  // Batch updates via RAF for smooth GPU animation
  const scheduleUpdate = useCallback(() => {
    if (rafIdRef.current !== null) return;
    
    rafIdRef.current = requestAnimationFrame(() => {
      const delta = accumulatedDeltaRef.current;
      accumulatedDeltaRef.current = 0;
      rafIdRef.current = null;
      
      const newProgress = Math.max(0, Math.min(1, progressRef.current + delta / PROGRESS_DIVISOR));
      progressRef.current = newProgress;
      
      // Update CSS variable for GPU-accelerated clipPath
      if (containerRef.current) {
        containerRef.current.style.setProperty('--wipe-progress', `${newProgress * 100}%`);
      }
      
      // Only update React state for discrete UI changes (every 10%)
      const displayBucket = Math.floor(newProgress * 10);
      const currentBucket = Math.floor(displayProgress * 10);
      if (displayBucket !== currentBucket || newProgress >= 1) {
        setDisplayProgress(newProgress);
      }
      
      // Check completion
      if (newProgress >= 1 && !isComplete) {
        setIsComplete(true);
      } else if (newProgress < 1 && isComplete) {
        setIsComplete(false);
      }
    });
  }, [PROGRESS_DIVISOR, displayProgress, isComplete]);
  
  const handleProgress = useCallback((delta: number, _direction: 'up' | 'down') => {
    accumulatedDeltaRef.current += delta;
    scheduleUpdate();
  }, [scheduleUpdate]);

  const { sectionRef, isLocked } = useScrollLock({
    lockThreshold: 0,
    headerOffset: 80,
    onProgress: handleProgress,
    isComplete: isComplete,
    canReverseExit: true,
    enabled: true,
  });
  
  // Cleanup RAF on unmount
  useEffect(() => {
    return () => {
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
      }
    };
  }, []);

  // Initialize CSS variable
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.style.setProperty('--wipe-progress', '0%');
    }
  }, []);

  return (
    <section 
      ref={sectionRef}
      className="min-h-screen flex items-center justify-center bg-muted/30 px-4 py-12 md:py-24"
    >
      <div className="container mx-auto max-w-2xl">
        {/* Header */}
        <div className="text-center mb-4 md:mb-8">
          <h2 className="text-2xl md:text-3xl font-bold mb-3">
            The Transformation
          </h2>
          <p className="text-sm text-muted-foreground">
            Watch chaos become clarity
          </p>
        </div>

        {/* Progress indicator - uses displayProgress for discrete updates */}
        {isLocked && displayProgress < 1 && (
          <div className="flex items-center justify-center gap-2 mb-6">
            <div className="h-1 w-20 bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full bg-mint rounded-full transition-[width] duration-100"
                style={{ width: `${displayProgress * 100}%` }}
              />
            </div>
            <span className="text-xs text-muted-foreground">
              {displayProgress === 0 ? '↓ Scroll to transform' : 
               displayProgress < 1 ? 'Keep scrolling...' : 
               '✓ Complete'}
            </span>
          </div>
        )}

        {/* Two-layer card with CSS variable-driven horizontal wipe */}
        <div 
          ref={containerRef}
          className="relative editorial-card overflow-hidden scroll-animation-container"
          style={{ '--wipe-progress': '0%' } as React.CSSProperties}
        >
          {/* AFTER layer (bottom) - always visible */}
          <div className="space-y-4 md:space-y-6 p-4 md:p-6">
            {/* Header */}
            <div className="border-l-4 pl-4" style={{ borderColor: 'hsl(var(--mint))' }}>
              <h3 className="text-xl font-bold text-foreground mb-2">
                After: Clarity
              </h3>
              <p className="text-sm text-muted-foreground">
                Building with conviction
              </p>
            </div>
            
            {/* Items - no scale animation, pure static */}
            <div className="space-y-3 md:space-y-4">
              {transformations.map((item, index) => (
                <div 
                  key={`after-${index}`}
                  className="flex items-start gap-3"
                >
                  <div 
                    className="w-2 h-2 rounded-full mt-2 flex-shrink-0"
                    style={{ backgroundColor: 'hsl(var(--mint))' }}
                  />
                  <p className="text-sm text-foreground font-medium flex-1">
                    {item.after}
                  </p>
                </div>
              ))}
            </div>
            
            {/* Quote */}
            <div className="pt-4 border-t space-y-2" style={{ borderColor: 'hsl(var(--mint) / 0.2)' }}>
              <p className="text-xs font-semibold text-green-700 dark:text-green-600">
                "I know exactly what we're building, why it matters, and how to get there."
              </p>
              <p className="text-xs font-bold text-foreground hidden md:block">
                Guarantee or your money back
              </p>
            </div>
          </div>

          {/* BEFORE layer (top) - clips away via CSS variable */}
          <div
            className="absolute inset-0 bg-card before-layer-wipe"
            style={{
              clipPath: `inset(0 0 0 var(--wipe-progress, 0%))`,
            }}
          >
            <div className="space-y-4 md:space-y-6 p-4 md:p-6">
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
              <div className="space-y-3 md:space-y-4">
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
          </div>

          {/* Mint glow line at wipe edge - CSS driven */}
          <div
            className="absolute top-0 bottom-0 w-1 pointer-events-none wipe-glow-line"
            style={{
              left: 'var(--wipe-progress, 0%)',
              background: 'linear-gradient(to right, transparent, hsl(var(--mint)), transparent)',
              boxShadow: '0 0 20px 2px hsl(var(--mint) / 0.5)',
              opacity: 'var(--glow-opacity, 0)',
            }}
          />
        </div>

        {/* Completion message */}
        {displayProgress > 0.85 && (
          <div
            className="text-center mt-8 animate-fade-in"
          >
            <p className="text-sm text-muted-foreground">
              This isn't theory. It's what happens when you work with a practitioner who's been in your seat.
            </p>
          </div>
        )}

        {/* Scroll Lock Indicator */}
        {isLocked && displayProgress < 1 && (
          <div
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 animate-fade-in"
          >
            <div className="bg-background/90 px-4 py-2 rounded-full border shadow-lg backdrop-blur-sm">
              <span className="text-xs text-muted-foreground">
                ↓ Keep scrolling ({Math.round(displayProgress * 100)}%)
              </span>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default BeforeAfterSplit;

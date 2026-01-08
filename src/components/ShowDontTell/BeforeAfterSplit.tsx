import { useState, useCallback, useRef, useEffect } from 'react';
import { useScrollHijack } from '@/hooks/useScrollHijack';
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
  
  // Refs for animation
  const progressRef = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Refs for scroll hijack (defense-in-depth)
  const sectionRef = useRef<HTMLElement>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);
  
  // Refs to track current state values without causing dependency issues
  const displayProgressRef = useRef(0);
  const isCompleteRef = useRef(false);
  
  // State only for discrete UI updates (progress indicator text, completion)
  const [displayProgress, setDisplayProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  
  // Keep refs in sync with state
  useEffect(() => {
    displayProgressRef.current = displayProgress;
  }, [displayProgress]);
  
  useEffect(() => {
    isCompleteRef.current = isComplete;
  }, [isComplete]);
  
  const PROGRESS_DIVISOR = isMobile ? 400 : 700;
  
  // Handle progress updates from scroll hijack
  const handleProgress = useCallback((progress: number, _delta: number, _direction: 'up' | 'down') => {
    progressRef.current = progress;
    
    // Update CSS variable for GPU-accelerated clipPath
    if (containerRef.current) {
      containerRef.current.style.setProperty('--wipe-progress', `${progress * 100}%`);
    }
    
    // Only update React state for discrete UI changes (every 10%)
    const displayBucket = Math.floor(progress * 10);
    const currentBucket = Math.floor(displayProgressRef.current * 10);
    if (displayBucket !== currentBucket || progress >= 1) {
      displayProgressRef.current = progress;
      setDisplayProgress(progress);
    }
    
    // Check completion
    if (progress >= 1 && !isCompleteRef.current) {
      isCompleteRef.current = true;
      setIsComplete(true);
    } else if (progress < 1 && isCompleteRef.current) {
      isCompleteRef.current = false;
      setIsComplete(false);
    }
  }, []);

  // Handle escape velocity (user scrolling very fast = wants to skip)
  const handleEscapeVelocity = useCallback(() => {
    progressRef.current = 1;
    if (containerRef.current) {
      containerRef.current.style.setProperty('--wipe-progress', '100%');
    }
    setDisplayProgress(1);
    setIsComplete(true);
  }, []);

  // Use defense-in-depth scroll hijack hook
  const { isLocked, skipToEnd } = useScrollHijack({
    sentinelRef,
    sectionRef,
    onProgress: handleProgress,
    isComplete: isComplete,
    progressDivisor: PROGRESS_DIVISOR,
    enabled: true,
    maxDeltaPerFrame: 0.08, // Max 8% progress per frame
    escapeVelocityThreshold: 12, // pixels/ms
    onEscapeVelocity: handleEscapeVelocity,
  });

  // Initialize CSS variable
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.style.setProperty('--wipe-progress', '0%');
    }
  }, []);

  // Skip handler for buttons
  const handleSkip = useCallback(() => {
    skipToEnd();
    progressRef.current = 1;
    setDisplayProgress(1);
    setIsComplete(true);
    if (containerRef.current) {
      containerRef.current.style.setProperty('--wipe-progress', '100%');
    }
  }, [skipToEnd]);

  return (
    <section 
      ref={sectionRef}
      className="min-h-screen flex items-center justify-center bg-muted/30 px-4 py-8 md:py-16 scroll-hijack-section"
    >
      {/* LAYER 4: Sentinel element for anticipatory detection */}
      <div 
        ref={sentinelRef}
        className="scroll-hijack-sentinel"
        aria-hidden="true"
      />
      
      <div className="container mx-auto max-w-2xl">
        {/* Header */}
        <div className="text-center mb-4 md:mb-6">
          <h2 className="text-2xl md:text-3xl font-bold mb-2">
            The Transformation
          </h2>
          <p className="text-sm text-muted-foreground">
            Watch chaos become clarity
          </p>
        </div>

        {/* Progress indicator - uses displayProgress for discrete updates */}
        {isLocked && displayProgress < 1 && (
          <div className="flex items-center justify-center gap-3 mb-4">
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
            {displayProgress > 0.3 && (
              <button
                onClick={handleSkip}
                className="text-xs text-mint hover:text-mint-dark underline underline-offset-2 transition-colors"
              >
                Skip →
              </button>
            )}
          </div>
        )}

        {/* Two-layer card with CSS variable-driven horizontal wipe */}
        <div 
          ref={containerRef}
          className="relative editorial-card overflow-hidden scroll-animation-container scroll-hijack-canvas"
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
            className="absolute inset-0 bg-card before-layer-wipe scroll-hijack-item"
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
            className="text-center mt-6 animate-fade-in"
          >
            <p className="text-sm text-muted-foreground">
              This isn't theory. It's what happens when you work with a practitioner who's been in your seat.
            </p>
          </div>
        )}

        {/* Scroll Lock Indicator */}
        {isLocked && displayProgress < 1 && (
          <div
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 animate-fade-in scroll-hijack-indicator"
          >
            <div className="bg-background/90 px-4 py-2 rounded-full border shadow-lg backdrop-blur-sm flex items-center gap-3">
              <span className="text-xs text-muted-foreground">
                ↓ Keep scrolling ({Math.round(displayProgress * 100)}%)
              </span>
              {displayProgress > 0.3 && (
                <button
                  onClick={handleSkip}
                  className="text-xs text-mint hover:text-mint-dark underline underline-offset-2 transition-colors"
                >
                  Skip →
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default BeforeAfterSplit;

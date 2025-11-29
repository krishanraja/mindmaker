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
  const sectionRef = useRef<HTMLElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;
      
      const rect = sectionRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      
      // Start when section enters viewport, complete when it reaches center
      const triggerStart = viewportHeight * 0.8; // Start at 80% down viewport
      const triggerEnd = viewportHeight * 0.3;   // Complete at 30% down viewport
      
      let progress = 0;
      
      if (rect.top < triggerStart && rect.top > triggerEnd) {
        // Active transformation zone
        progress = 1 - ((rect.top - triggerEnd) / (triggerStart - triggerEnd));
      } else if (rect.top <= triggerEnd) {
        // Fully transformed
        progress = 1;
      }
      
      setScrollProgress(progress);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section 
      ref={sectionRef} 
      className="py-16 md:py-24 px-4 bg-muted/30"
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
                const itemProgress = getItemProgress(index, scrollProgress);
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
              clipPath: `inset(0 0 0 ${scrollProgress * 100}%)`,
            }}
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
          {scrollProgress > 0.05 && scrollProgress < 0.95 && (
            <motion.div
              className="absolute top-0 bottom-0 w-1 pointer-events-none"
              style={{
                left: `${scrollProgress * 100}%`,
                background: 'linear-gradient(to right, transparent, hsl(var(--mint)), transparent)',
                boxShadow: '0 0 20px 2px hsl(var(--mint) / 0.5)',
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            />
          )}
        </div>

        {/* Completion message */}
        {scrollProgress > 0.85 && (
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
  );
};

// Calculate progress for each item with stagger
const getItemProgress = (index: number, scrollProgress: number) => {
  const itemStart = 0.15 + (index * 0.12);
  const itemDuration = 0.15;
  const itemEnd = itemStart + itemDuration;
  return Math.max(0, Math.min(1, (scrollProgress - itemStart) / itemDuration));
};

export default BeforeAfterSplit;

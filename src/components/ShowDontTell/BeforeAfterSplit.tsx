import { motion, useTransform, useMotionValue, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import { Quote } from 'lucide-react';
import { cn } from '@/lib/utils';

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
      const sectionHeight = sectionRef.current.offsetHeight;
      const viewportHeight = window.innerHeight;
      
      // Calculate progress from when section enters to when it exits
      const startScroll = -rect.top;
      const maxScroll = sectionHeight - viewportHeight;
      const progress = Math.max(0, Math.min(1, startScroll / maxScroll));
      
      setScrollProgress(progress);
    };

    handleScroll(); // Initial calculation
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section 
      ref={sectionRef} 
      className="relative h-[250vh] md:h-[300vh] bg-muted/30"
    >
      <div className="sticky top-0 h-screen flex items-center justify-center px-4 py-12">
        <div className="max-w-2xl w-full">
          {/* Progress dots */}
          <ProgressDots progress={scrollProgress} />
          
          {/* Main transformation card */}
          <TransformationCard progress={scrollProgress} />
          
          {/* Scroll hint */}
          <AnimatePresence>
            {scrollProgress < 0.05 && (
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center text-sm text-muted-foreground mt-6"
              >
                ↓ Scroll to transform chaos into clarity ↓
              </motion.p>
            )}
          </AnimatePresence>

          {/* Completion message */}
          <AnimatePresence>
            {scrollProgress > 0.95 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="text-center mt-8 space-y-2"
              >
                <p className="text-sm text-muted-foreground">
                  This isn't theory. It's what happens when you work with a practitioner who's been in your seat.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};

const ProgressDots = ({ progress }: { progress: number }) => {
  return (
    <div className="flex justify-center gap-2 mb-8">
      {transformations.map((_, index) => {
        const itemProgress = getItemProgress(index, progress);
        return (
          <motion.div
            key={index}
            className="w-2 h-2 rounded-full"
            style={{
              backgroundColor: itemProgress > 0.5 ? 'hsl(var(--mint))' : 'hsl(var(--destructive))',
            }}
            animate={{
              scale: itemProgress > 0.4 && itemProgress < 0.6 ? 1.5 : 1,
            }}
            transition={{ duration: 0.2 }}
          />
        );
      })}
    </div>
  );
};

const TransformationCard = ({ progress }: { progress: number }) => {
  // Header transforms at 0-8%
  const headerProgress = Math.min(1, progress / 0.08);
  
  return (
    <motion.div 
      className="editorial-card space-y-6"
      style={{
        borderColor: progress > 0.5 
          ? `hsl(var(--mint) / ${0.2 + progress * 0.3})` 
          : `hsl(var(--destructive) / ${0.3 - progress * 0.1})`,
      }}
    >
      {/* Transforming Header */}
      <TransformingHeader progress={headerProgress} />
      
      {/* Transforming Items */}
      <div className="space-y-4">
        {transformations.map((item, index) => (
          <TransformingItem 
            key={index} 
            item={item} 
            progress={getItemProgress(index, progress)} 
          />
        ))}
      </div>
      
      {/* Transforming Quote */}
      <TransformingQuote progress={progress} />
    </motion.div>
  );
};

const TransformingHeader = ({ progress }: { progress: number }) => {
  return (
    <div 
      className="border-l-4 pl-4 transition-colors duration-500"
      style={{
        borderColor: progress > 0.5 ? 'hsl(var(--mint))' : 'hsl(var(--destructive))',
      }}
    >
      <div className="relative h-8">
        <AnimatePresence mode="wait">
          {progress < 0.5 ? (
            <motion.h3
              key="before"
              initial={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute text-xl font-bold text-foreground"
            >
              Before: Chaos
            </motion.h3>
          ) : (
            <motion.h3
              key="after"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute text-xl font-bold text-foreground"
            >
              After: Clarity
            </motion.h3>
          )}
        </AnimatePresence>
      </div>
      
      <div className="relative h-5 mt-2">
        <AnimatePresence mode="wait">
          {progress < 0.5 ? (
            <motion.p
              key="before-sub"
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute text-sm text-muted-foreground"
            >
              Overwhelmed by AI hype
            </motion.p>
          ) : (
            <motion.p
              key="after-sub"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute text-sm text-muted-foreground"
            >
              Building with conviction
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

const TransformingItem = ({ item, progress }: { item: typeof transformations[0]; progress: number }) => {
  return (
    <motion.div 
      className="flex items-start gap-3"
      animate={{
        scale: progress > 0.4 && progress < 0.6 ? 1.02 : 1,
      }}
      transition={{ duration: 0.2 }}
    >
      {/* Transforming dot */}
      <motion.div 
        className="w-2 h-2 rounded-full mt-2 flex-shrink-0"
        style={{
          backgroundColor: progress > 0.5 ? 'hsl(var(--mint))' : 'hsl(var(--destructive))',
        }}
        animate={{
          scale: progress > 0.4 && progress < 0.6 ? 1.5 : 1,
        }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      />
      
      {/* Transforming text */}
      <div className="relative flex-1 min-h-[3rem] text-sm">
        <AnimatePresence mode="wait">
          {progress < 0.5 ? (
            <motion.p
              key="before"
              initial={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              className="absolute text-muted-foreground"
            >
              {item.before}
            </motion.p>
          ) : (
            <motion.p
              key="after"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute text-foreground font-medium"
            >
              {item.after}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

const TransformingQuote = ({ progress }: { progress: number }) => {
  // Quote transforms at 90-100%
  const quoteProgress = Math.max(0, Math.min(1, (progress - 0.9) / 0.1));
  
  return (
    <motion.div 
      className="pt-4 border-t transition-colors duration-500"
      style={{
        borderColor: quoteProgress > 0.5 ? 'hsl(var(--mint) / 0.2)' : 'hsl(var(--border))',
      }}
    >
      <div className="relative min-h-[4rem]">
        <AnimatePresence mode="wait">
          {quoteProgress < 0.5 ? (
            <motion.p
              key="before-quote"
              initial={{ opacity: 1 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute text-xs text-muted-foreground italic"
            >
              "Everyone's talking about AI, but I don't know where to start or who to trust."
            </motion.p>
          ) : (
            <motion.div
              key="after-quote"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute space-y-2"
            >
              <p className="text-xs font-semibold text-green-700 dark:text-green-600">
                "I know exactly what we're building, why it matters, and how to get there."
              </p>
              <p className="text-xs font-bold text-foreground">
                Guarantee or your money back
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

// Helper function to calculate individual item progress with stagger
const getItemProgress = (index: number, scrollProgress: number) => {
  const itemStart = 0.08 + (index * 0.13);
  const itemEnd = itemStart + 0.13;
  return Math.max(0, Math.min(1, (scrollProgress - itemStart) / (itemEnd - itemStart)));
};

export default BeforeAfterSplit;

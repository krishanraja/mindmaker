import { motion } from 'framer-motion';
import { useAINewsTicker } from '@/hooks/useAINewsTicker';
import { Sparkles } from 'lucide-react';
import { useState, useRef } from 'react';

const AINewsTicker = () => {
  const { headlines } = useAINewsTicker();
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollOffset, setScrollOffset] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const resumeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Don't render if no headlines
  if (!headlines || headlines.length === 0) {
    return null;
  }

  // Duplicate headlines for seamless loop
  const duplicatedHeadlines = [...headlines, ...headlines, ...headlines];

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    setIsPaused(true);
    setStartX(e.touches[0].clientX - scrollOffset);
    
    // Clear any pending resume
    if (resumeTimeoutRef.current) {
      clearTimeout(resumeTimeoutRef.current);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    e.preventDefault(); // Prevent page scroll
    const x = e.touches[0].clientX - startX;
    setScrollOffset(x);
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    // Resume auto-scroll after 2 seconds
    resumeTimeoutRef.current = setTimeout(() => {
      setIsPaused(false);
      setScrollOffset(0);
    }, 2000);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setIsPaused(true);
    setStartX(e.clientX - scrollOffset);
    
    if (resumeTimeoutRef.current) {
      clearTimeout(resumeTimeoutRef.current);
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.clientX - startX;
    setScrollOffset(x);
  };

  const handleMouseUp = () => {
    if (!isDragging) return;
    setIsDragging(false);
    resumeTimeoutRef.current = setTimeout(() => {
      setIsPaused(false);
      setScrollOffset(0);
    }, 2000);
  };

  return (
    <div className="relative w-full py-6 bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 overflow-hidden">
      {/* Header */}
      <div className="text-center mb-4">
        <p className="text-sm text-foreground/80 italic">AI shifts shaping 2026 and beyond</p>
      </div>
      
      {/* Fade edges */}
      <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />
      
      {/* Ticker content */}
      <div className="relative overflow-hidden cursor-grab active:cursor-grabbing">
        <motion.div
          className="flex gap-12 items-center whitespace-nowrap"
          style={isPaused ? { x: scrollOffset } : undefined}
          animate={isPaused ? {} : {
            x: [0, -100 * headlines.length],
          }}
          transition={isPaused ? {} : {
            x: {
              repeat: Infinity,
              repeatType: "loop",
              duration: headlines.length * 2.67,
              ease: "linear",
            },
          }}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          {duplicatedHeadlines.map((headline, index) => (
            <div
              key={`${headline.title}-${index}`}
              className="flex items-center gap-4 text-sm md:text-base group select-none"
            >
              <Sparkles className="w-4 h-4 text-primary flex-shrink-0 opacity-70 group-hover:opacity-100 transition-opacity" />
              <span className="font-semibold text-foreground group-hover:text-primary transition-colors">
                {headline.title}
              </span>
              <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">
                {headline.source}
              </span>
              <span className="text-muted-foreground mx-4">•</span>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default AINewsTicker;

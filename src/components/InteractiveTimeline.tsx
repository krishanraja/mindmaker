import React, { useState, useEffect, useRef } from 'react';
import { Brain, Lightbulb, Target, Rocket, Zap, Users, Bot, Star } from 'lucide-react';

interface TimelineItem {
  year: string;
  title: string;
  description: string;
  impact: string;
  meaning: string;
  icon: React.ComponentType<{ className?: string }>;
  gradientStep: number;
}

const InteractiveTimeline = () => {
  const [activeItem, setActiveItem] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const timelineData: TimelineItem[] = [
    {
      year: "1956",
      title: "AI is Born",
      description: "The term 'Artificial Intelligence' is coined at Dartmouth Conference",
      impact: "What this means for you:",
      meaning: "You're living in the age AI was always meant to reach.",
      icon: Brain,
      gradientStep: 0
    },
    {
      year: "1997", 
      title: "Deep Blue Beats Chess Master",
      description: "AI defeats world chess champion Garry Kasparov in historic match",
      impact: "What this means for you:",
      meaning: "AI excels at strategic thinking - learn to collaborate.",
      icon: Target,
      gradientStep: 1
    },
    {
      year: "2011",
      title: "Watson Wins Jeopardy!",
      description: "IBM's Watson defeats human champions at complex trivia",
      impact: "What this means for you:",
      meaning: "AI processes information instantly - your value is wisdom.",
      icon: Lightbulb,
      gradientStep: 2
    },
    {
      year: "2016",
      title: "AlphaGo's Breakthrough", 
      description: "AI masters the ancient game of Go through intuitive learning",
      impact: "What this means for you:",
      meaning: "AI can be creative and intuitive - embrace collaboration.",
      icon: Zap,
      gradientStep: 3
    },
    {
      year: "2020",
      title: "GPT-3 Revolution",
      description: "AI begins writing, coding, and creating at human-level quality",
      impact: "What this means for you:",
      meaning: "AI is your creative partner - focus on strategy and prompting.",
      icon: Rocket,
      gradientStep: 4
    },
    {
      year: "2022",
      title: "ChatGPT Goes Viral",
      description: "1 million users in 5 days - AI enters mainstream consciousness",
      impact: "What this means for you:",
      meaning: "AI literacy is as essential as digital literacy was in the 90s.",
      icon: Users,
      gradientStep: 5
    },
    {
      year: "2024",
      title: "AI Agents Emerge",
      description: "AI systems begin completing complex multi-step autonomous tasks",
      impact: "What this means for you:",
      meaning: "The future belongs to those who orchestrate AI agents.",
      icon: Bot,
      gradientStep: 6
    },
    {
      year: "2025",
      title: "Your AI Literacy Journey",
      description: "You decide how AI shapes your future - starting today",
      impact: "What this means for you:",
      meaning: "You have the power to shape how AI impacts your future.",
      icon: Star,
      gradientStep: 7
    }
  ];

  const currentItem = timelineData[activeItem];

  // Touch gesture handling
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      nextItem();
    } else if (isRightSwipe) {
      prevItem();
    }
  };

  const nextItem = () => {
    setActiveItem((prev) => (prev + 1) % timelineData.length);
    setIsPaused(true);
    setTimeout(() => setIsPaused(false), 2000);
  };

  const prevItem = () => {
    setActiveItem((prev) => (prev - 1 + timelineData.length) % timelineData.length);
    setIsPaused(true);
    setTimeout(() => setIsPaused(false), 2000);
  };

  const handleDotClick = (index: number) => {
    setActiveItem(index);
    setIsPaused(true);
    setTimeout(() => setIsPaused(false), 3000);
  };

  const handleContentClick = () => {
    nextItem();
  };

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying || isPaused) return;
    
    const interval = setInterval(() => {
      setActiveItem((prev) => {
        const next = (prev + 1) % timelineData.length;
        if (next === 0) {
          setIsAutoPlaying(false);
        }
        return next;
      });
    }, 4000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, isPaused, timelineData.length]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        prevItem();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        nextItem();  
      } else if (e.key === ' ') {
        e.preventDefault();
        setIsAutoPlaying(!isAutoPlaying);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isAutoPlaying]);

  // Generate brand-aligned gradient based on progress
  const getGradientStyle = (step: number) => {
    const opacity = 0.15 + (step / timelineData.length) * 0.3;
    return {
      background: `linear-gradient(135deg, hsl(var(--primary) / ${opacity}) 0%, hsl(var(--accent) / ${opacity * 0.8}) 100%)`
    };
  };

  // Calculate proportional positioning based on year gaps
  const getYearGaps = () => {
    const years = timelineData.map(item => parseInt(item.year));
    const gaps = [];
    for (let i = 1; i < years.length; i++) {
      gaps.push(years[i] - years[i-1]);
    }
    return gaps;
  };

  const getProportionalPositions = () => {
    const gaps = getYearGaps();
    const totalYears = gaps.reduce((sum, gap) => sum + gap, 0);
    const rawPositions = [0];
    let cumulative = 0;
    
    gaps.forEach(gap => {
      cumulative += gap;
      rawPositions.push((cumulative / totalYears) * 100);
    });
    
    // Apply hybrid spacing with minimum distance constraints
    const minSpacing = 8; // Minimum 8% spacing between dots
    const adjustedPositions = [rawPositions[0]];
    
    for (let i = 1; i < rawPositions.length; i++) {
      const prevPos = adjustedPositions[i - 1];
      const currentPos = rawPositions[i];
      const requiredPos = prevPos + minSpacing;
      
      // Use larger of proportional position or minimum required position
      adjustedPositions.push(Math.max(currentPos, requiredPos));
    }
    
    // Normalize to ensure last position doesn't exceed 100%
    const maxPos = Math.max(...adjustedPositions);
    if (maxPos > 100) {
      const scale = 95 / maxPos; // Leave 5% margin
      return adjustedPositions.map(pos => pos * scale);
    }
    
    return adjustedPositions;
  };

  const dotPositions = getProportionalPositions();

  // Calculate Y position on wavy path for each dot using proper Bezier math
  const getWavyYPosition = (xPercent: number) => {
    // Convert percentage to SVG coordinates (0-800)
    const x = (xPercent / 100) * 800;
    
    // Wavy path: M0,32 Q100,20 200,32 T400,32 Q500,44 600,32 T800,32
    // Use proper quadratic Bezier curve calculations
    if (x <= 200) {
      // First curve: Q100,20 from (0,32) to (200,32)
      const t = x / 200;
      // Quadratic Bezier: B(t) = (1-t)²P₀ + 2(1-t)tP₁ + t²P₂
      return Math.pow(1-t, 2) * 32 + 2 * (1-t) * t * 20 + Math.pow(t, 2) * 32;
    } else if (x <= 400) {
      // T400,32 - smooth continuation using implicit control point
      const t = (x - 200) / 200;
      // Control point is reflection of previous: (300,44)
      return Math.pow(1-t, 2) * 32 + 2 * (1-t) * t * 44 + Math.pow(t, 2) * 32;
    } else if (x <= 600) {
      // Q500,44 from (400,32) to (600,32)
      const t = (x - 400) / 200;
      return Math.pow(1-t, 2) * 32 + 2 * (1-t) * t * 44 + Math.pow(t, 2) * 32;
    } else {
      // T800,20 - smooth continuation curving upward
      const t = (x - 600) / 200;
      // Control point is reflection: (700,20) for upward curve
      return Math.pow(1-t, 2) * 32 + 2 * (1-t) * t * 20 + Math.pow(t, 2) * 20;
    }
  };

  return (
    <div 
      ref={containerRef}
      className="w-full max-w-4xl mx-auto mb-12 px-4 sm:px-6 select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-6 tracking-tight">
          Explore your AI journey
        </h2>
        <div className="w-24 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent mx-auto"></div>
      </div>

      {/* Organic Journey Visualization */}
      <div className="mb-8">
        <div className="relative h-16">
          {/* Wavy progress track */}
          <svg className="w-full h-full overflow-visible" viewBox="0 0 800 64" preserveAspectRatio="none">
            <defs>
              <linearGradient id="pathGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="rgba(255,255,255,0.3)" />
                <stop offset="100%" stopColor="rgba(255,255,255,0.1)" />
              </linearGradient>
              <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="rgba(255,255,255,0.8)" />
                <stop offset="100%" stopColor="rgba(255,255,255,0.5)" />
              </linearGradient>
            </defs>
            
            {/* Background wavy path */}
            <path
              d="M0,32 Q100,20 200,32 T400,32 Q500,44 600,32 T800,20"
              stroke="url(#pathGradient)"
              strokeWidth="3"
              fill="none"
              className="transition-all duration-700"
            />
            
            {/* Active progress path */}
            <path
              d="M0,32 Q100,20 200,32 T400,32 Q500,44 600,32 T800,20"
              stroke="url(#progressGradient)"
              strokeWidth="3"
              fill="none"
              strokeDasharray="1000"
              strokeDashoffset={1000 - (1000 * ((activeItem + 1) / timelineData.length))}
              className="transition-all duration-700 ease-out"
            />
          </svg>
          
          {/* Journey waypoint dots */}
          <div className="absolute inset-0">
            {timelineData.map((item, index) => {
              const xPos = dotPositions[index];
              const yPos = getWavyYPosition(xPos);
              return (
                <button
                  key={index}
                  onClick={() => handleDotClick(index)}
                  className="absolute transition-all duration-500 transform -translate-x-1/2 -translate-y-1/2 p-3 -m-3"
                  style={{ 
                    left: `${xPos}%`,
                    top: `${(yPos / 64) * 100}%`, // Convert SVG Y to percentage of container height
                    transform: `translate(-50%, -50%) scale(${
                      index === activeItem ? 1.4 : index < activeItem ? 1.1 : 0.9
                    })`,
                    minWidth: '44px',
                    minHeight: '44px',
                  }}
                  aria-label={`Go to ${item.year}: ${item.title}`}
                >
                <div className={`relative w-3 h-3 sm:w-4 sm:h-4 rounded-full transition-all duration-500 ${
                  index === activeItem 
                    ? 'bg-white shadow-lg shadow-white/40 ring-2 ring-white/30' 
                    : index < activeItem 
                      ? 'bg-white/80 hover:bg-white' 
                      : 'bg-white/40 hover:bg-white/60'
                }`}>
                  {/* Active waypoint glow */}
                  {index === activeItem && (
                    <div className="absolute inset-0 rounded-full bg-white/30 animate-ping" />
                  )}
                  
                    {/* Year label on hover/active */}
                    <div className={`absolute -top-8 left-1/2 transform -translate-x-1/2 text-xs font-bold text-white/80 transition-opacity duration-300 ${
                      index === activeItem ? 'opacity-100' : 'opacity-0 hover:opacity-70'
                    }`}>
                      {item.year}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Fixed Height Content Container */}
      <div className="relative h-[400px] sm:h-[450px] mb-8">
        <div 
          className="glass-card-dark h-full transition-all duration-700 ease-out transform hover:scale-[1.02] overflow-hidden relative"
          style={getGradientStyle(currentItem.gradientStep)}
        >
          {/* Left Navigation Zone */}
          <button
            className="absolute left-0 top-0 w-1/2 h-full z-10 flex items-center justify-start pl-4 group cursor-pointer"
            onClick={prevItem}
            aria-label="Previous milestone"
          >
            <div className="opacity-0 group-hover:opacity-40 transition-opacity duration-300 text-white/60">
              ←
            </div>
          </button>
          
          {/* Right Navigation Zone */}
          <button
            className="absolute right-0 top-0 w-1/2 h-full z-10 flex items-center justify-end pr-4 group cursor-pointer"
            onClick={nextItem}
            aria-label="Next milestone"
          >
            <div className="opacity-0 group-hover:opacity-40 transition-opacity duration-300 text-white/60">
              →
            </div>
          </button>
          <div className="flex flex-col h-full p-6 sm:p-8">
            {/* Top Section - Icon and Year */}
            <div className="flex flex-col items-center text-center h-24 sm:h-28 justify-center">
              <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 transition-all duration-700 mb-2">
                <currentItem.icon className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
              </div>
              
              <div className="font-gobold text-2xl sm:text-3xl md:text-4xl text-white transition-all duration-700 tracking-wider drop-shadow-lg">
                {currentItem.year}
              </div>
            </div>

            {/* Middle Section - Title and Description */}
            <div className="flex flex-col text-center h-32 sm:h-36 justify-center overflow-hidden">
              <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-white leading-tight transition-all duration-700 tracking-tight drop-shadow-md mb-2 sm:mb-3">
                {currentItem.title}
              </h3>
              <p className="text-white/85 text-sm sm:text-base md:text-lg leading-tight transition-all duration-700 font-medium tracking-wide max-w-2xl mx-auto overflow-hidden">
                {currentItem.description}
              </p>
            </div>

            {/* Bottom Section - Impact */}
            <div className="flex-1 flex flex-col justify-center">
              <div className="bg-gradient-to-r from-white/10 to-white/5 rounded-xl p-3 sm:p-4 border border-white/10 transition-all duration-700 h-full flex flex-col justify-center overflow-hidden">
                <h4 className="text-white/90 font-bold mb-2 text-xs sm:text-sm text-center tracking-widest uppercase">
                  {currentItem.impact}
                </h4>
                <div className="max-w-xs sm:max-w-sm mx-auto px-2 overflow-hidden"> 
                  <p className="text-white text-xs sm:text-sm font-semibold leading-tight text-center tracking-wide drop-shadow-sm text-balance">
                    {currentItem.meaning}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Minimalist Status Bar */}
      <div className="flex justify-center items-center mt-6 space-x-4">
        <div className="text-white/60 text-sm">
          {activeItem + 1} of {timelineData.length}
        </div>
        
        {isAutoPlaying && !isPaused && (
          <div className="flex items-center space-x-1 text-white/40 text-xs">
            <div className="w-1 h-1 bg-white/60 rounded-full animate-pulse" />
            <span>Auto-playing</span>
          </div>
        )}
      </div>

      {/* Gesture Hint */}
      <div className="text-center mt-4">
        <p className="text-white/50 text-xs sm:text-sm">
          ← Swipe or use arrow keys to navigate →
        </p>  
      </div>
    </div>
  );
};

export default InteractiveTimeline;
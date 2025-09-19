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
      meaning: "You're living in the age AI was always meant to reach - mass adoption.",
      icon: Brain,
      gradientStep: 0
    },
    {
      year: "1997", 
      title: "Deep Blue Beats Chess Master",
      description: "AI defeats world chess champion Garry Kasparov in historic match",
      impact: "What this means for you:",
      meaning: "AI excels at strategic thinking - learn to collaborate, not compete.",
      icon: Target,
      gradientStep: 1
    },
    {
      year: "2011",
      title: "Watson Wins Jeopardy!",
      description: "IBM's Watson defeats human champions at complex trivia",
      impact: "What this means for you:",
      meaning: "AI processes information instantly - your value is in interpretation and wisdom.",
      icon: Lightbulb,
      gradientStep: 2
    },
    {
      year: "2016",
      title: "AlphaGo's Breakthrough", 
      description: "AI masters the ancient game of Go through intuitive learning",
      impact: "What this means for you:",
      meaning: "AI can be creative and intuitive - embrace hybrid human-AI collaboration.",
      icon: Zap,
      gradientStep: 3
    },
    {
      year: "2020",
      title: "GPT-3 Revolution",
      description: "AI begins writing, coding, and creating at human-level quality",
      impact: "What this means for you:",
      meaning: "AI is your creative partner - focus on prompting, editing, and strategic direction.",
      icon: Rocket,
      gradientStep: 4
    },
    {
      year: "2022",
      title: "ChatGPT Goes Viral",
      description: "1 million users in 5 days - AI enters mainstream consciousness",
      impact: "What this means for you:",
      meaning: "AI literacy is now as essential as digital literacy was in the 90s.",
      icon: Users,
      gradientStep: 5
    },
    {
      year: "2024",
      title: "AI Agents Emerge",
      description: "AI systems begin completing complex multi-step autonomous tasks",
      impact: "What this means for you:",
      meaning: "The future belongs to those who can orchestrate AI agents effectively.",
      icon: Bot,
      gradientStep: 6
    },
    {
      year: "2025",
      title: "Your AI Literacy Journey",
      description: "You decide how AI shapes your future - starting today",
      impact: "What this means for you:",
      meaning: "Right now, you have the power to shape how AI impacts your life and career.",
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
        <h2 className="mobile-text-xl font-bold text-white mb-2">
          The AI Revolution Timeline
        </h2>
        <p className="text-white/70 mobile-text-sm">
          Tap, swipe, or click to explore each milestone
        </p>
      </div>

      {/* Interactive Progress Bar */}
      <div className="mb-8">
        <div className="relative">
          {/* Progress track */}
          <div className="h-1 bg-white/20 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-white/60 to-white/40 rounded-full transition-all duration-700 ease-out"
              style={{ width: `${((activeItem + 1) / timelineData.length) * 100}%` }}
            />
          </div>
          
          {/* Interactive dots */}
          <div className="flex justify-between items-center mt-6">
            {timelineData.map((_, index) => (
              <button
                key={index}
                onClick={() => handleDotClick(index)}
                className={`relative transition-all duration-500 transform ${
                  index === activeItem 
                    ? 'scale-125' 
                    : index < activeItem 
                      ? 'scale-100' 
                      : 'scale-75'
                }`}
                aria-label={`Go to ${timelineData[index].year}`}
              >
                <div className={`w-4 h-4 sm:w-5 sm:h-5 rounded-full transition-all duration-500 ${
                  index === activeItem 
                    ? 'bg-white shadow-lg shadow-white/25 ring-2 ring-white/30 ring-offset-2 ring-offset-transparent' 
                    : index < activeItem 
                      ? 'bg-white/70 hover:bg-white/90' 
                      : 'bg-white/30 hover:bg-white/50'
                }`} />
                
                {/* Active indicator pulse */}
                {index === activeItem && (
                  <div className="absolute inset-0 w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-white/20 animate-ping" />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Fixed-Height Content Container */}
      <div 
        className="relative h-96 sm:h-80 overflow-hidden"
        onClick={handleContentClick}
        role="button"
        tabIndex={0}
        aria-label="Tap to advance to next milestone"
      >
        <div 
          className="glass-card-dark mobile-padding h-full cursor-pointer transition-all duration-700 ease-out transform hover:scale-[1.02]"
          style={getGradientStyle(currentItem.gradientStep)}
        >
          <div className="flex flex-col justify-center h-full text-center space-y-4 sm:space-y-6">
            {/* Icon and Year */}
            <div className="space-y-3 sm:space-y-4">
              <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 transition-all duration-700">
                <currentItem.icon className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
              </div>
              <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-white transition-all duration-700">
                {currentItem.year}
              </div>
            </div>

            {/* Title and Description */}
            <div className="space-y-2 sm:space-y-3 max-w-2xl mx-auto">
              <h3 className="mobile-text-lg font-bold text-white leading-tight transition-all duration-700">
                {currentItem.title}
              </h3>
              <p className="text-white/80 mobile-text-sm leading-relaxed transition-all duration-700">
                {currentItem.description}
              </p>
            </div>

            {/* Impact Section */}
            <div className="bg-gradient-to-r from-white/5 to-white/10 rounded-xl p-3 sm:p-4 border border-white/10 max-w-2xl mx-auto transition-all duration-700">
              <h4 className="text-white/90 font-semibold mb-1 sm:mb-2 text-xs sm:text-sm">
                {currentItem.impact}
              </h4>
              <p className="text-white mobile-text-sm font-medium leading-relaxed">
                {currentItem.meaning}
              </p>
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
import { motion } from 'framer-motion';
import { useAINewsTicker } from '@/hooks/useAINewsTicker';
import { Sparkles } from 'lucide-react';

const AINewsTicker = () => {
  const { headlines } = useAINewsTicker();

  // Duplicate headlines for seamless loop
  const duplicatedHeadlines = [...headlines, ...headlines, ...headlines];

  return (
    <div className="relative w-full py-6 bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 overflow-hidden">
      {/* Header */}
      <div className="text-center mb-4">
        <p className="text-sm text-foreground/80 italic">Today's latest news in AI</p>
      </div>
      
      {/* Fade edges */}
      <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-background to-transparent z-10" />
      <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-background to-transparent z-10" />
      
      {/* Ticker content */}
      <div className="relative overflow-hidden">
        <motion.div
          className="flex gap-12 items-center whitespace-nowrap"
          animate={{
            x: [0, -100 * headlines.length],
          }}
          transition={{
            x: {
              repeat: Infinity,
              repeatType: "loop",
              duration: headlines.length * 1.5,
              ease: "linear",
            },
          }}
        >
          {duplicatedHeadlines.map((headline, index) => (
            <div
              key={`${headline.title}-${index}`}
              className="flex items-center gap-4 text-sm md:text-base group"
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

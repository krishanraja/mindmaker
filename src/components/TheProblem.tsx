import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useState } from "react";
import { useScrollTrigger } from "@/hooks/useScrollTrigger";

const TheProblem = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [selectedProblems, setSelectedProblems] = useState<number[]>([]);
  const { elementRef: triggerRef, isVisible } = useScrollTrigger({ threshold: 0.2 });
  
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  const problems = [
    { 
      text: "Everyone's talking about AI, but nobody's actually doing anything",
      x: -20, 
      y: 0,
      delay: 0 
    },
    { 
      text: "Your team looks to you for answers you don't have yet",
      x: 20, 
      y: -10,
      delay: 0.15 
    },
    { 
      text: "Vendors promise everything, deliver confusion",
      x: -15, 
      y: 10,
      delay: 0.3 
    },
    { 
      text: "Pilots launch, then quietly die in the corner",
      x: 15, 
      y: 5,
      delay: 0.45 
    },
    { 
      text: "You know you should be moving faster",
      x: -10, 
      y: -5,
      delay: 0.6 
    },
  ];

  const toggleProblem = (index: number) => {
    setSelectedProblems(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  const weightProgress = selectedProblems.length / problems.length;
  const reliefProgress = useTransform(scrollYProgress, [0.5, 0.9], [0, 1]);

  return (
    <section 
      ref={sectionRef}
      className="section-padding bg-muted/30 relative overflow-hidden min-h-[100vh]"
    >
      <div ref={triggerRef as any} className="container-width">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              The Weight You're Carrying
            </h2>
            <p className="text-lg text-muted-foreground">
              Tap what resonates with you
            </p>
          </motion.div>

          {/* Floating Problems */}
          <div className="relative min-h-[400px] mb-16">
            {problems.map((problem, index) => {
              const isSelected = selectedProblems.includes(index);
              
              return (
                <motion.button
                  key={index}
                  onClick={() => toggleProblem(index)}
                  initial={{ opacity: 0, scale: 0.8, x: problem.x, y: problem.y }}
                  animate={isVisible ? { 
                    opacity: 1, 
                    scale: 1,
                    x: isSelected ? 0 : problem.x,
                    y: isSelected ? index * -8 : problem.y + Math.sin(index) * 10,
                  } : {}}
                  transition={{ 
                    delay: problem.delay,
                    duration: 0.6,
                    type: "spring",
                    stiffness: 100 
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`
                    block w-full p-6 rounded-lg mb-4 text-left cursor-pointer
                    transition-all duration-300
                    ${isSelected 
                      ? 'bg-destructive/20 border-2 border-destructive shadow-lg shadow-destructive/20' 
                      : 'bg-background border border-border hover:border-destructive/50'
                    }
                  `}
                  style={{
                    position: 'relative',
                  }}
                >
                  <p className={`text-base ${isSelected ? 'font-semibold text-foreground' : 'text-foreground/80'}`}>
                    {problem.text}
                  </p>
                  {isSelected && (
                    <motion.div 
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-2 -right-2 w-6 h-6 bg-destructive rounded-full flex items-center justify-center text-white text-xs font-bold"
                    >
                      ✓
                    </motion.div>
                  )}
                </motion.button>
              );
            })}
          </div>

          {/* Weight Indicator */}
          {selectedProblems.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mb-12 text-center"
            >
              <div className="inline-flex items-center gap-3 bg-destructive/10 px-6 py-3 rounded-full">
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className={`w-2 h-8 rounded-full transition-all duration-300 ${
                        i < selectedProblems.length ? 'bg-destructive' : 'bg-destructive/20'
                      }`}
                      style={{
                        height: i < selectedProblems.length ? `${(i + 1) * 8}px` : '8px'
                      }}
                    />
                  ))}
                </div>
                <span className="text-sm font-semibold text-foreground">
                  {selectedProblems.length} of {problems.length} acknowledged
                </span>
              </div>
            </motion.div>
          )}

          {/* Relief / Solution Reveal */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={isVisible ? { 
              opacity: weightProgress > 0.4 ? 1 : 0,
              y: weightProgress > 0.4 ? 0 : 40 
            } : {}}
            transition={{ duration: 0.8, type: "spring" }}
          >
            <motion.div 
              className="minimal-card bg-ink text-white text-center p-8 relative overflow-hidden"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              {/* Glow effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-mint/20 to-transparent"
                animate={{
                  opacity: [0.3, 0.6, 0.3],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
              
              <div className="relative z-10">
                <motion.p 
                  className="text-lg font-semibold mb-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  Mindmaker fixes the missing layer
                </motion.p>
                <motion.p 
                  className="text-white/80"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  The human operating system for AI
                </motion.p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default TheProblem;

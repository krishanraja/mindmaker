import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

interface Concept {
  id: string;
  label: string;
  category: 'strategy' | 'tools' | 'execution';
}

const concepts: Concept[] = [
  { id: '1', label: 'Context Windows', category: 'tools' },
  { id: '2', label: 'Prompt Engineering', category: 'execution' },
  { id: '3', label: 'Agents', category: 'tools' },
  { id: '4', label: 'Tool Vendors', category: 'strategy' },
  { id: '5', label: 'RAG', category: 'tools' },
  { id: '6', label: 'Fine-tuning', category: 'execution' },
  { id: '7', label: 'AI Governance', category: 'strategy' },
  { id: '8', label: 'Embeddings', category: 'tools' },
];

const ChaosToClarity = () => {
  const [isOrganized, setIsOrganized] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsOrganized(true), 300);
        }
      },
      { threshold: 0.4 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const getRandomPosition = (index: number) => ({
    x: Math.sin(index * 2.5) * 250 + (Math.random() - 0.5) * 100,
    y: Math.cos(index * 2.1) * 200 + (Math.random() - 0.5) * 100,
  });

  const getOrganizedPosition = (concept: Concept, index: number) => {
    const categoryIndex = concepts.filter(c => c.category === concept.category).indexOf(concept);
    const categoryY = concept.category === 'strategy' ? -120 : concept.category === 'tools' ? 0 : 120;
    const categoryX = (categoryIndex - 1.5) * 180;
    return { x: categoryX, y: categoryY };
  };

  return (
    <section ref={sectionRef} className="section-padding bg-background relative overflow-hidden">
      <div className="container-width">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              {isOrganized ? 'Clear Framework' : 'AI Feels Like Chaos'}
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {isOrganized 
                ? 'Mindmaker organizes complexity into actionable clarity'
                : 'Too many concepts, vendors, and opinions. Where do you even start?'
              }
            </p>
          </motion.div>
        </div>

        {/* Visualization */}
        <div className="relative h-[500px] flex items-center justify-center">
          {/* Category Labels (only show when organized) */}
          {isOrganized && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1, duration: 0.5 }}
                className="absolute top-12 left-1/2 -translate-x-1/2 text-sm font-bold text-mint uppercase tracking-wider"
              >
                Strategic Layer
              </motion.div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2, duration: 0.5 }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-sm font-bold text-mint uppercase tracking-wider"
              >
                Evaluation Layer
              </motion.div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.4, duration: 0.5 }}
                className="absolute bottom-12 left-1/2 -translate-x-1/2 text-sm font-bold text-mint uppercase tracking-wider"
              >
                Execution Layer
              </motion.div>
            </>
          )}

          {/* Concept Nodes */}
          <div className="absolute inset-0 flex items-center justify-center">
            {concepts.map((concept, index) => {
              const chaosPos = getRandomPosition(index);
              const organizedPos = getOrganizedPosition(concept, index);

              return (
                <motion.div
                  key={concept.id}
                  initial={chaosPos}
                  animate={isOrganized ? organizedPos : chaosPos}
                  transition={{
                    type: 'spring',
                    damping: 20,
                    stiffness: 100,
                    delay: isOrganized ? index * 0.08 : 0,
                  }}
                  className="absolute"
                >
                  <motion.div
                    animate={{
                      rotate: isOrganized ? 0 : [0, 5, -5, 0],
                      scale: isOrganized ? 1 : [1, 1.05, 0.95, 1],
                    }}
                    transition={{
                      duration: 2 + index * 0.3,
                      repeat: isOrganized ? 0 : Infinity,
                      repeatType: 'reverse',
                    }}
                    className={`px-4 py-2 rounded-lg border-2 text-sm font-semibold whitespace-nowrap ${
                      isOrganized
                        ? 'bg-mint/10 border-mint text-foreground'
                        : 'bg-background border-border text-muted-foreground'
                    }`}
                  >
                    {concept.label}
                  </motion.div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Bottom Text */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isOrganized ? 1 : 0 }}
          transition={{ delay: 1.5, duration: 0.5 }}
          className="text-center mt-12"
        >
          <p className="text-lg font-semibold text-foreground">
            One 90-minute session. From overwhelmed to equipped.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default ChaosToClarity;

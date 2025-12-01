import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import AINewsTicker from '@/components/AINewsTicker';
import { useScrollLock } from '@/hooks/useScrollLock';

type Category = "Technical" | "Commercial" | "Organizational" | "Competitive";

interface Concept {
  id: number;
  label: string;
  category: Category;
  temporary?: boolean;
}

const concepts: Concept[] = [
  // Technical (4 permanent)
  { id: 1, label: "Context windows", category: "Technical" },
  { id: 2, label: "Tokens", category: "Technical" },
  { id: 3, label: "RAG", category: "Technical" },
  { id: 4, label: "Prompt engineering", category: "Technical" },
  
  // Commercial (4 permanent)
  { id: 5, label: "Vendor overpromises", category: "Commercial" },
  { id: 6, label: "ROI fog", category: "Commercial" },
  { id: 7, label: "Pilot purgatory", category: "Commercial" },
  { id: 8, label: "Integration debt", category: "Commercial" },
  
  // Organizational (4 permanent)
  { id: 9, label: "Misaligned teams", category: "Organizational" },
  { id: 10, label: "Rogue AI experiments", category: "Organizational" },
  { id: 11, label: "Change fatigue", category: "Organizational" },
  { id: 12, label: "Shadow IT", category: "Organizational" },
  
  // Competitive (4 permanent)
  { id: 13, label: "Competitor noise", category: "Competitive" },
  { id: 14, label: "Board pressure", category: "Competitive" },
  { id: 15, label: "Fear of betting wrong", category: "Competitive" },
  { id: 16, label: "Rapid obsolescence", category: "Competitive" },
  
  // TEMPORARY - Technical hype words
  { id: 101, label: "Neural networks", category: "Technical", temporary: true },
  { id: 102, label: "Deep learning", category: "Technical", temporary: true },
  { id: 103, label: "Foundation models", category: "Technical", temporary: true },
  { id: 104, label: "Multimodal AI", category: "Technical", temporary: true },
  { id: 105, label: "Transformers", category: "Technical", temporary: true },
  { id: 106, label: "Computer vision", category: "Technical", temporary: true },
  { id: 107, label: "NLP breakthroughs", category: "Technical", temporary: true },
  { id: 108, label: "Edge AI", category: "Technical", temporary: true },
  { id: 109, label: "MLOps", category: "Technical", temporary: true },
  { id: 110, label: "Feature engineering", category: "Technical", temporary: true },
  { id: 111, label: "Model drift", category: "Technical", temporary: true },
  { id: 112, label: "Transfer learning", category: "Technical", temporary: true },
  { id: 113, label: "Few-shot learning", category: "Technical", temporary: true },
  { id: 114, label: "Zero-shot learning", category: "Technical", temporary: true },
  { id: 115, label: "Reinforcement learning", category: "Technical", temporary: true },
  
  // TEMPORARY - Commercial hype words
  { id: 201, label: "AI-first transformation", category: "Commercial", temporary: true },
  { id: 202, label: "Digital disruption", category: "Commercial", temporary: true },
  { id: 203, label: "AI acceleration", category: "Commercial", temporary: true },
  { id: 204, label: "AI maturity models", category: "Commercial", temporary: true },
  { id: 205, label: "AI-powered everything", category: "Commercial", temporary: true },
  { id: 206, label: "Generative AI revolution", category: "Commercial", temporary: true },
  { id: 207, label: "AI ROI calculators", category: "Commercial", temporary: true },
  { id: 208, label: "AI benchmarks", category: "Commercial", temporary: true },
  { id: 209, label: "AI winter fears", category: "Commercial", temporary: true },
  { id: 210, label: "Vendor lock-in", category: "Commercial", temporary: true },
  { id: 211, label: "AI hype cycle", category: "Commercial", temporary: true },
  { id: 212, label: "Consultant theatre", category: "Commercial", temporary: true },
  
  // TEMPORARY - Organizational hype words
  { id: 301, label: "AI governance", category: "Organizational", temporary: true },
  { id: 302, label: "Responsible AI", category: "Organizational", temporary: true },
  { id: 303, label: "AI ethics committees", category: "Organizational", temporary: true },
  { id: 304, label: "AI literacy programs", category: "Organizational", temporary: true },
  { id: 305, label: "Change management", category: "Organizational", temporary: true },
  { id: 306, label: "AI champions network", category: "Organizational", temporary: true },
  { id: 307, label: "Cross-functional pods", category: "Organizational", temporary: true },
  { id: 308, label: "AI centers of excellence", category: "Organizational", temporary: true },
  { id: 309, label: "Agile AI teams", category: "Organizational", temporary: true },
  { id: 310, label: "Data mesh", category: "Organizational", temporary: true },
  { id: 311, label: "Federated learning", category: "Organizational", temporary: true },
  
  // TEMPORARY - Competitive hype words
  { id: 401, label: "AGI coming soon", category: "Competitive", temporary: true },
  { id: 402, label: "Quantum AI", category: "Competitive", temporary: true },
  { id: 403, label: "AI agents everywhere", category: "Competitive", temporary: true },
  { id: 404, label: "Autonomous systems", category: "Competitive", temporary: true },
  { id: 405, label: "Synthetic data", category: "Competitive", temporary: true },
  { id: 406, label: "Explainable AI", category: "Competitive", temporary: true },
  { id: 407, label: "AI observability", category: "Competitive", temporary: true },
  { id: 408, label: "Cognitive computing", category: "Competitive", temporary: true },
  { id: 409, label: "Intelligent automation", category: "Competitive", temporary: true },
  { id: 410, label: "Smart algorithms", category: "Competitive", temporary: true },
  { id: 411, label: "AI infrastructure", category: "Competitive", temporary: true },
  { id: 412, label: "Model serving", category: "Competitive", temporary: true },
  { id: 413, label: "AI pipelines", category: "Competitive", temporary: true },
];

const ChaosToClarity = () => {
  const [animationProgress, setAnimationProgress] = useState(0);
  const isComplete = animationProgress >= 1;

  const handleProgress = useCallback((delta: number) => {
    setAnimationProgress(prev => 
      Math.max(0, Math.min(1, prev + delta / 800))
    );
  }, []);

  const { sectionRef, isLocked } = useScrollLock({
    lockThreshold: 0,
    onProgress: handleProgress,
    isComplete,
    enabled: true,
  });

  // Chaotic random positions
  const getRandomPosition = (id: number) => {
    const seed = id * 123.456;
    const randX = (Math.sin(seed) * 10000) % 1;
    const randY = (Math.cos(seed * 1.5) * 10000) % 1;
    
    return {
      x: 10 + randX * 80,
      y: 10 + randY * 80,
      rotation: (randX - 0.5) * 30,
      translateX: '0%',
    };
  };

  // Organized 2x2 grid positions
  const getOrganizedPosition = (concept: Concept, index: number) => {
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
    
    const categoryPositions = isMobile ? {
      Technical: { baseX: 15, baseY: 18, translateX: '0%' },
      Commercial: { baseX: 85, baseY: 18, translateX: '-100%' },
      Organizational: { baseX: 15, baseY: 55, translateX: '0%' },
      Competitive: { baseX: 85, baseY: 55, translateX: '-100%' },
    } : {
      Technical: { baseX: 30, baseY: 22, translateX: '-50%' },
      Commercial: { baseX: 70, baseY: 22, translateX: '-50%' },
      Organizational: { baseX: 30, baseY: 62, translateX: '-50%' },
      Competitive: { baseX: 70, baseY: 62, translateX: '-50%' },
    };

    // For position calculation, only count permanent items
    const permanentConcepts = concepts.filter(c => !c.temporary);
    const categoryItems = permanentConcepts.filter(c => c.category === concept.category);
    const categoryIndex = categoryItems.findIndex(c => c.id === concept.id);
    
    // If temporary, return random position (they fade out)
    if (concept.temporary) {
      return getRandomPosition(concept.id);
    }

    const base = categoryPositions[concept.category];
    const offsetY = categoryIndex * (isMobile ? 6.5 : 7);

    return {
      x: base.baseX,
      y: base.baseY + offsetY,
      rotation: 0,
      translateX: base.translateX,
    };
  };

  // Interpolate between chaos and clarity
  const getPosition = (concept: Concept, index: number) => {
    const chaos = getRandomPosition(concept.id);
    const clarity = getOrganizedPosition(concept, index);
    
    return {
      x: chaos.x + (clarity.x - chaos.x) * animationProgress,
      y: chaos.y + (clarity.y - chaos.y) * animationProgress,
      rotation: chaos.rotation * (1 - animationProgress),
      translateX: clarity.translateX,
    };
  };

  const getCurrentMonthYear = () => {
    const date = new Date();
    const month = date.toLocaleString('en-US', { month: 'long' });
    const year = date.getFullYear();
    return `${month} ${year}`;
  };

  const getHeadline = () => {
    if (animationProgress < 0.85) {
      return "From chaos and a firehose of info, to...";
    }
    return "To a clear path, charted with real-world expertise.";
  };

  const getCategoryColor = (category: Category, isLabel: boolean = false) => {
    if (animationProgress < 0.7) {
      return isLabel ? "text-foreground" : "text-muted-foreground";
    }
    
    const colors = {
      Technical: "text-foreground",
      Commercial: "text-amber-700 dark:text-amber-400",
      Organizational: "text-red-700 dark:text-red-400",
      Competitive: "text-purple-700 dark:text-purple-400",
    };
    return colors[category];
  };

  const groupedConcepts = concepts.reduce((acc, concept) => {
    if (!acc[concept.category]) acc[concept.category] = [];
    acc[concept.category].push(concept);
    return acc;
  }, {} as Record<Category, Concept[]>);

  return (
    <section 
      ref={sectionRef} 
      className="section-padding bg-background py-32 relative overflow-hidden min-h-screen flex flex-col justify-center"
    >
      <div className="container-width">
        {/* Dynamic Headline */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            {getHeadline()}
            {animationProgress > 0.7 && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6 }}
                className="text-base md:text-lg text-foreground/70 mt-4 leading-relaxed"
              >
                This is the critical missing piece before you deploy a six-figure consultant, and improves your confidence and decision making<br />
                - ready for when you embark on a full AI strategy or transformation.
              </motion.p>
            )}
          </h2>
        </motion.div>

        {/* Concepts Visualization */}
        <div className="relative h-[500px] md:h-[600px] max-w-4xl mx-auto">
          {Object.entries(groupedConcepts).map(([category, categoryPieces]) => {
            const cat = category as Category;
            const categoryPos = getOrganizedPosition(categoryPieces[0], 0);
            
            const labelPos = animationProgress > 0.5 
              ? { x: categoryPos.x, y: categoryPos.y - 8, rotation: 0 }
              : getRandomPosition(categoryPieces[0].id - 100);
            
            return (
              <div key={category}>
                {/* Category Label */}
                <motion.div
                  className={`absolute text-xs md:text-sm font-bold uppercase tracking-wider whitespace-nowrap transition-all duration-300 ${
                    animationProgress > 0.7 ? 'scale-105' : ''
                  } ${getCategoryColor(cat, true)}`}
                  animate={{
                    left: `${labelPos.x}%`,
                    top: `${labelPos.y}%`,
                    x: categoryPos.translateX,
                    y: '-50%',
                    rotate: animationProgress > 0.5 ? 0 : (labelPos.rotation || 0),
                    opacity: animationProgress > 0.3 ? 1 : 0.7,
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 80,
                    damping: 25,
                    mass: 0.8,
                  }}
                >
                  {category}
                </motion.div>
                
                {/* Category Concepts */}
                {categoryPieces.map((concept, index) => {
                  const pos = getPosition(concept, index);
                  
                  const temporaryOpacity = concept.temporary 
                    ? Math.max(0, 1 - ((animationProgress - 0.3) * 1.5))
                    : 0.6 + (animationProgress * 0.4);
                  
                  if (concept.temporary && animationProgress > 0.75) return null;
                  
                  return (
                    <motion.div
                      key={concept.id}
                      className={`absolute px-3 py-1.5 rounded-full text-xs md:text-sm font-medium border whitespace-nowrap transition-colors duration-300
                        ${animationProgress > 0.7 
                          ? 'bg-muted/30 border-border text-foreground' 
                          : 'bg-muted/50 border-border text-muted-foreground'}
                        ${concept.temporary ? 'text-xs bg-muted/70 border-border/50' : ''}`}
                      animate={{
                        left: `${pos.x}%`,
                        top: `${pos.y}%`,
                        x: pos.translateX,
                        y: '-50%',
                        rotate: pos.rotation,
                        opacity: temporaryOpacity,
                        scale: concept.temporary ? (1 - animationProgress * 0.3) : 1,
                      }}
                      transition={{
                        type: "spring",
                        stiffness: 80,
                        damping: 25,
                        mass: 0.8,
                      }}
                      style={{
                        zIndex: concept.temporary ? 0 : 1,
                      }}
                    >
                      {concept.label}
                    </motion.div>
                  );
                })}
              </div>
            );
          })}
        </div>

        {/* News Ticker */}
        {animationProgress > 0.8 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mt-16"
          >
            <p className="text-base md:text-lg text-center text-foreground/90 mb-6 leading-relaxed max-w-4xl mx-auto">
              Tailored to your role, industry, competitive set and current AI updates from {getCurrentMonthYear()}.
            </p>
            <AINewsTicker />
          </motion.div>
        )}

        {/* Scroll Lock Indicator */}
        {isLocked && animationProgress < 1 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50"
          >
            <div className="bg-background/90 px-4 py-2 rounded-full border shadow-lg backdrop-blur-sm">
              <span className="text-xs text-muted-foreground">
                ↓ Keep scrolling ({Math.round(animationProgress * 100)}%)
              </span>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default ChaosToClarity;

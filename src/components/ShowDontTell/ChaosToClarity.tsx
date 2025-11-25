import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import AINewsTicker from '@/components/AINewsTicker';

type Category = "Technical" | "Commercial" | "Organizational" | "Competitive";

interface Concept {
  id: number;
  label: string;
  category: Category;
}

const concepts: Concept[] = [
  // Technical (4)
  { id: 1, label: "Context windows", category: "Technical" },
  { id: 2, label: "Tokens", category: "Technical" },
  { id: 3, label: "RAG", category: "Technical" },
  { id: 4, label: "Prompt engineering", category: "Technical" },
  
  // Commercial (4)
  { id: 5, label: "Vendor overpromises", category: "Commercial" },
  { id: 6, label: "ROI fog", category: "Commercial" },
  { id: 7, label: "Pilot purgatory", category: "Commercial" },
  { id: 8, label: "Integration debt", category: "Commercial" },
  
  // Organizational (4)
  { id: 9, label: "Misaligned teams", category: "Organizational" },
  { id: 10, label: "Rogue AI experiments", category: "Organizational" },
  { id: 11, label: "Change fatigue", category: "Organizational" },
  { id: 12, label: "Shadow IT", category: "Organizational" },
  
  // Competitive (4)
  { id: 13, label: "Competitor noise", category: "Competitive" },
  { id: 14, label: "Board pressure", category: "Competitive" },
  { id: 15, label: "Fear of betting wrong", category: "Competitive" },
  { id: 16, label: "Rapid obsolescence", category: "Competitive" },
];

const ChaosToClarity = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;
      
      const rect = sectionRef.current.getBoundingClientRect();
      const sectionHeight = rect.height;
      const windowHeight = window.innerHeight;
      
      // Calculate scroll progress through section
      const scrolled = windowHeight - rect.top;
      const progress = Math.max(0, Math.min(1, scrolled / (sectionHeight + windowHeight)));
      
      setScrollProgress(progress);
    };
    
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Faster animation: 0.15-0.5 instead of 0.2-0.8
  const organizationLevel = 
    scrollProgress < 0.15 ? 0 : 
    scrollProgress > 0.5 ? 1 : 
    (scrollProgress - 0.15) / 0.35;

  // Chaotic random positions
  const getRandomPosition = (id: number) => {
    const seed = id * 123.456;
    const randX = (Math.sin(seed) * 10000) % 1;
    const randY = (Math.cos(seed * 1.5) * 10000) % 1;
    
    return {
      x: 10 + randX * 80,
      y: 10 + randY * 80,
      rotation: (randX - 0.5) * 30,
    };
  };

  // Organized 2x2 grid positions with better spacing to prevent overlap
  const getOrganizedPosition = (concept: Concept, index: number) => {
    const categoryPositions = {
      Technical: { baseX: 18, baseY: 22 },
      Commercial: { baseX: 62, baseY: 22 },
      Organizational: { baseX: 18, baseY: 62 },
      Competitive: { baseX: 62, baseY: 62 },
    };

    const categoryIndex = concepts
      .filter(c => c.category === concept.category)
      .findIndex(c => c.id === concept.id);

    const base = categoryPositions[concept.category];
    // Vertical stacking with more space between items
    const offsetY = categoryIndex * 7;

    return {
      x: base.baseX,
      y: base.baseY + offsetY,
      rotation: 0,
    };
  };

  // Interpolate between chaos and clarity
  const getPosition = (concept: Concept, index: number) => {
    const chaos = getRandomPosition(concept.id);
    const clarity = getOrganizedPosition(concept, index);
    
    return {
      x: chaos.x + (clarity.x - chaos.x) * organizationLevel,
      y: chaos.y + (clarity.y - chaos.y) * organizationLevel,
      rotation: chaos.rotation * (1 - organizationLevel),
    };
  };

  // Get current month and year
  const getCurrentMonthYear = () => {
    const date = new Date();
    const month = date.toLocaleString('en-US', { month: 'long' });
    const year = date.getFullYear();
    return `${month} ${year}`;
  };

  // Dynamic headline based on organization level
  const getHeadline = () => {
    if (organizationLevel < 0.3) return "From chaos and a firehose of info, to...";
    if (organizationLevel < 0.7) return "Organizing your acceleration plan...";
    return "Your individualized acceleration plan";
  };

  const getCategoryColor = (category: Category, isLabel: boolean = false) => {
    if (organizationLevel < 0.7) {
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

  // Group concepts by category for rendering
  const groupedConcepts = concepts.reduce((acc, concept) => {
    if (!acc[concept.category]) acc[concept.category] = [];
    acc[concept.category].push(concept);
    return acc;
  }, {} as Record<Category, Concept[]>);

  return (
    <section 
      ref={sectionRef} 
      className="section-padding bg-background py-32 relative overflow-hidden"
    >
      <div className="container-width">
        {/* Dynamic Headline */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <h2 
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4"
          >
          {getHeadline()}
          {organizationLevel > 0.7 && (
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

        {/* Concepts Visualization with Category Labels */}
        <div className="relative h-[500px] md:h-[600px] max-w-4xl mx-auto">
          {Object.entries(groupedConcepts).map(([category, categoryPieces]) => {
            const cat = category as Category;
            const categoryPos = getOrganizedPosition(categoryPieces[0], 0);
            
            // Category label position (above its group)
            const labelPos = organizationLevel > 0.5 
              ? { x: categoryPos.x, y: categoryPos.y - 8, rotation: 0 }
              : getRandomPosition(categoryPieces[0].id - 100);
            
            return (
              <div key={category}>
                {/* Category Label */}
                <motion.div
                  className={`absolute text-xs md:text-sm font-bold uppercase tracking-wider whitespace-nowrap ${getCategoryColor(cat, true)}`}
                  animate={{
                    left: `${labelPos.x}%`,
                    top: `${labelPos.y}%`,
                    rotate: organizationLevel > 0.5 ? 0 : (labelPos.rotation || 0),
                    opacity: organizationLevel > 0.3 ? 1 : 0.7,
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 120,
                    damping: 20,
                    mass: 0.5,
                  }}
                  style={{
                    transform: 'translate(-50%, -50%)',
                  }}
                >
                  {category}
                </motion.div>
                
                {/* Category Concepts */}
                {categoryPieces.map((concept, index) => {
                  const pos = getPosition(concept, index);
                  
                  return (
                    <motion.div
                      key={concept.id}
                      className={`absolute px-3 py-1.5 rounded-full text-xs md:text-sm font-medium border whitespace-nowrap transition-colors duration-300
                        ${organizationLevel > 0.7 
                          ? 'bg-muted/30 border-border text-foreground' 
                          : 'bg-muted/50 border-border text-muted-foreground'}`}
                      animate={{
                        left: `${pos.x}%`,
                        top: `${pos.y}%`,
                        rotate: pos.rotation,
                        opacity: 0.6 + (organizationLevel * 0.4),
                      }}
                      transition={{
                        type: "spring",
                        stiffness: 120,
                        damping: 20,
                        mass: 0.5,
                      }}
                      style={{
                        transform: 'translate(-50%, -50%)',
                        zIndex: 1,
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

        {/* News Ticker and Final Message */}
        {organizationLevel > 0.8 && (
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
      </div>
    </section>
  );
};

export default ChaosToClarity;

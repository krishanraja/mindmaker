import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

interface Concept {
  id: number;
  label: string;
  category: "Input" | "Processing" | "Output" | "Feedback";
}

const concepts: Concept[] = [
  { id: 1, label: "Prompt Engineering", category: "Input" },
  { id: 2, label: "Context Windows", category: "Input" },
  { id: 3, label: "LLMs", category: "Processing" },
  { id: 4, label: "Fine-tuning", category: "Processing" },
  { id: 5, label: "RAG Systems", category: "Processing" },
  { id: 6, label: "Embeddings", category: "Processing" },
  { id: 7, label: "API Calls", category: "Output" },
  { id: 8, label: "Automation", category: "Output" },
  { id: 9, label: "Human Review", category: "Feedback" },
  { id: 10, label: "Model Selection", category: "Input" },
  { id: 11, label: "Tokens", category: "Processing" },
  { id: 12, label: "Chain of Thought", category: "Input" },
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

      // Calculate how much of the section has scrolled through viewport
      const scrolled = windowHeight - rect.top;
      const progress = Math.max(0, Math.min(1, scrolled / (sectionHeight + windowHeight)));

      setScrollProgress(progress);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Initial calculation

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Map scroll progress to organization level
  const organizationLevel = 
    scrollProgress < 0.2 ? 0 : 
    scrollProgress > 0.8 ? 1 : 
    (scrollProgress - 0.2) / 0.6;

  // Generate chaotic positions (consistent per concept using ID as seed)
  const getRandomPosition = (id: number) => {
    const seed = id * 9999;
    const pseudoRandom = (Math.sin(seed) * 10000) % 1;
    const angle = pseudoRandom * Math.PI * 2;
    const radius = 100 + (Math.abs(Math.cos(seed)) * 150);
    
    return {
      x: Math.cos(angle) * radius,
      y: Math.sin(angle) * radius,
    };
  };

  // Generate organized positions based on category
  const getOrganizedPosition = (concept: Concept, index: number) => {
    const categoryPositions: Record<Concept["category"], { x: number; y: number }> = {
      Input: { x: -200, y: -100 },
      Processing: { x: 0, y: -100 },
      Output: { x: 200, y: -100 },
      Feedback: { x: 0, y: 100 },
    };

    const basePos = categoryPositions[concept.category];
    const categoryIndex = concepts.filter(c => c.category === concept.category).indexOf(concept);
    
    return {
      x: basePos.x + (categoryIndex % 2 === 0 ? -60 : 60),
      y: basePos.y + Math.floor(categoryIndex / 2) * 60,
    };
  };

  // Interpolate between chaos and organized positions
  const getPosition = (concept: Concept) => {
    const chaos = getRandomPosition(concept.id);
    const clarity = getOrganizedPosition(concept, concept.id);

    return {
      x: chaos.x + (clarity.x - chaos.x) * organizationLevel,
      y: chaos.y + (clarity.y - chaos.y) * organizationLevel,
    };
  };

  // Category labels
  const categories = ["Input", "Processing", "Output", "Feedback"] as const;

  return (
    <section 
      ref={sectionRef} 
      className="section-padding bg-background py-32 relative overflow-hidden"
    >
      <div className="container-width">
        {/* Dynamic Headline */}
        <div className="text-center mb-16 space-y-4">
          <motion.h2 
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground"
            animate={{
              opacity: 1,
              fontWeight: organizationLevel < 0.5 ? 400 : 700,
            }}
            transition={{ duration: 0.3 }}
          >
            {organizationLevel < 0.3 
              ? "AI feels like chaos" 
              : organizationLevel < 0.7
              ? "AI organizing into clarity"
              : "AI becomes a clear framework"}
          </motion.h2>
          <motion.p 
            className="text-lg text-muted-foreground max-w-2xl mx-auto"
            animate={{ opacity: organizationLevel > 0.5 ? 1 : 0.6 }}
          >
            {organizationLevel < 0.7
              ? "Scattered concepts, overwhelming terminology, no clear path forward."
              : "Organized into Input → Processing → Output → Feedback. A system that makes sense."}
          </motion.p>
        </div>

        {/* Visualization Container */}
        <div className="relative h-[500px] md:h-[600px] flex items-center justify-center">
          {/* Category Labels (fade in as organized) */}
          {categories.map((category) => {
            const positions: Record<typeof category, { x: string; y: string }> = {
              Input: { x: "15%", y: "30%" },
              Processing: { x: "45%", y: "30%" },
              Output: { x: "75%", y: "30%" },
              Feedback: { x: "45%", y: "70%" },
            };

            return (
              <motion.div
                key={category}
                className="absolute text-sm font-bold text-mint uppercase tracking-wide"
                style={{
                  left: positions[category].x,
                  top: positions[category].y,
                  transform: "translate(-50%, -50%)",
                }}
                animate={{
                  opacity: organizationLevel > 0.5 ? 1 : 0,
                  scale: organizationLevel > 0.5 ? 1 : 0.8,
                }}
                transition={{ duration: 0.3 }}
              >
                {category}
              </motion.div>
            );
          })}

          {/* Concepts */}
          <div className="absolute inset-0 flex items-center justify-center">
            {concepts.map((concept) => {
              const position = getPosition(concept);
              
              return (
                <motion.div
                  key={concept.id}
                  className="absolute px-3 py-2 bg-muted/80 backdrop-blur-sm border border-border rounded-md text-xs md:text-sm font-medium text-foreground whitespace-nowrap"
                  animate={{
                    x: position.x,
                    y: position.y,
                    opacity: organizationLevel < 0.2 ? 0.6 : 1,
                    rotate: organizationLevel < 0.5 ? (concept.id % 3 - 1) * 15 : 0,
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 50,
                    damping: 20,
                  }}
                >
                  {concept.label}
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Bottom Message */}
        <motion.div 
          className="text-center mt-12"
          animate={{ opacity: organizationLevel > 0.7 ? 1 : 0 }}
        >
          <p className="text-sm text-muted-foreground italic">
            This is what we do: turn chaos into clarity through systems thinking.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default ChaosToClarity;

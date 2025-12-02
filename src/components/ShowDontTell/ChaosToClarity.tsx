import { useState } from "react";
import { motion } from "framer-motion";
import AINewsTicker from "@/components/AINewsTicker";
import { useIsMobile } from "@/hooks/use-mobile";
import { mapRange, easeInOutCubic, lerp, smoothStep } from "@/utils/animationEasing";
import { useScrollLock } from "@/hooks/useScrollLock";

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

const CHAOS_HEADLINE = "From chaos and a firehose of info, to...";
const CLARITY_HEADLINE = "To a clear path, charted with real-world expertise.";

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

const getCurrentMonthYear = () => {
  const date = new Date();
  const month = date.toLocaleString("en-US", { month: "long" });
  const year = date.getFullYear();
  return `${month} ${year}`;
};

// ---------- POSITION HELPERS ----------

// Chaotic random positions – pure function, seeded by id
const getRandomPosition = (id: number, isMobile: boolean) => {
  const seed = id * 123.456;
  const randX = Math.abs((Math.sin(seed) * 10000) % 100) / 100;
  const randY = Math.abs((Math.cos(seed * 1.5) * 10000) % 100) / 100;

  const xMin = isMobile ? 35 : 5;
  const xRange = isMobile ? 30 : 90;

  const yMin = 30;
  const yRange = 40;

  return {
    x: xMin + randX * xRange,
    y: yMin + randY * yRange,
    rotation: (randX - 0.5) * 50,
    translateX: isMobile ? "-50%" : "0%",
  };
};

// Organized positions – vertical stack on mobile, 2x2 grid on desktop
const getOrganizedPosition = (
  concept: Concept,
  index: number,
  isMobile: boolean
) => {
  const categoryPositions = isMobile
    ? {
        // VERTICAL STACK - all centered at 50%
        Technical: { baseX: 50, baseY: 12, translateX: "-50%" },
        Commercial: { baseX: 50, baseY: 35, translateX: "-50%" },
        Organizational: { baseX: 50, baseY: 58, translateX: "-50%" },
        Competitive: { baseX: 50, baseY: 81, translateX: "-50%" },
      }
    : {
        Technical: { baseX: 30, baseY: 22, translateX: "-50%" },
        Commercial: { baseX: 70, baseY: 22, translateX: "-50%" },
        Organizational: { baseX: 30, baseY: 62, translateX: "-50%" },
        Competitive: { baseX: 70, baseY: 62, translateX: "-50%" },
      };

  // Temporary items stay chaotic so they can fade out
  if (concept.temporary) {
    return getRandomPosition(concept.id, isMobile);
  }

  const permanentConcepts = concepts.filter((c) => !c.temporary);
  const categoryItems = permanentConcepts.filter(
    (c) => c.category === concept.category
  );
  const categoryIndex = categoryItems.findIndex((c) => c.id === concept.id);

  const base = categoryPositions[concept.category];
  const offsetY = categoryIndex * (isMobile ? 4 : 7);

  return {
    x: base.baseX,
    y: base.baseY + offsetY,
    rotation: 0,
    translateX: base.translateX,
  };
};

// Interpolation between chaos and clarity
const getInterpolatedPosition = (
  concept: Concept,
  index: number,
  isMobile: boolean,
  progress: number
) => {
  const chaos = getRandomPosition(concept.id, isMobile);
  const clarity = getOrganizedPosition(concept, index, isMobile);

  const chaosTranslate =
    chaos.translateX === "-50%" ? -50 : chaos.translateX === "-100%" ? -100 : 0;
  const clarityTranslate =
    clarity.translateX === "-50%"
      ? -50
      : clarity.translateX === "-100%"
      ? -100
      : 0;

  const interpolatedTranslate =
    chaosTranslate + (clarityTranslate - chaosTranslate) * progress;

  return {
    x: chaos.x + (clarity.x - chaos.x) * progress,
    y: chaos.y + (clarity.y - chaos.y) * progress,
    rotation: chaos.rotation * (1 - progress),
    translateX: `${interpolatedTranslate}%`,
  };
};

const getCategoryColor = (category: Category, colorProgress: number, isLabel = false) => {
  if (colorProgress < 0.3) {
    return isLabel ? "text-foreground" : "text-muted-foreground";
  }

  const colors: Record<Category, string> = {
    Technical: "text-foreground",
    Commercial: "text-amber-700 dark:text-amber-400",
    Organizational: "text-red-700 dark:text-red-400",
    Competitive: "text-purple-700 dark:text-purple-400",
  };

  return colors[category];
};

// ---------- MAIN COMPONENT ----------

const ChaosToClarity = () => {
  const isMobile = useIsMobile();
  const [animationProgress, setAnimationProgress] = useState(0);

  // Scroll lock configuration
  const PROGRESS_DIVISOR = isMobile ? 400 : 700; // Faster on mobile for better UX
  
  const handleProgress = (delta: number, direction: 'up' | 'down') => {
    setAnimationProgress((prev) => {
      const change = delta / PROGRESS_DIVISOR;
      return clamp01(prev + change);
    });
  };

  const isComplete = animationProgress >= 1;

  const { sectionRef, isLocked } = useScrollLock({
    lockThreshold: 0,
    headerOffset: 60,
    onProgress: handleProgress,
    isComplete: isComplete,
    canReverseExit: true,
    enabled: true,
  });

  // Derived timelines
  const headlineProgress = clamp01(mapRange(animationProgress, 0.7, 0.9));
  const labelProgress = clamp01(mapRange(animationProgress, 0.4, 0.6));
  const colorProgress = clamp01(mapRange(animationProgress, 0.6, 0.8));
  const temporaryFadeProgress = clamp01(mapRange(animationProgress, 0.2, 0.6));
  const newsTickerProgress = clamp01(mapRange(animationProgress, 0.75, 0.9));

  // Filter concepts for mobile performance
  const visibleConcepts = concepts.filter((c) => {
    if (!c.temporary) return true;
    if (!isMobile) return true;

    // Trim some temporary noise on mobile
    if (c.id > 110 && c.id < 200) return false;
    if (c.id > 206) return false;
    return true;
  });

  const groupedConcepts = visibleConcepts.reduce(
    (acc, concept) => {
      if (!acc[concept.category]) acc[concept.category] = [];
      acc[concept.category].push(concept);
      return acc;
    },
    {} as Record<Category, Concept[]>
  );

  const headlineChaosOpacity = lerp(
    1,
    0,
    smoothStep(0.5, 0.8, headlineProgress)
  );
  const headlineClarityOpacity = lerp(
    0,
    1,
    smoothStep(0.5, 0.8, headlineProgress)
  );

  const showScrollHint = isLocked && animationProgress < 0.4;

  return (
    <section
      ref={sectionRef}
      className="w-full bg-background relative overflow-hidden min-h-screen"
    >
      <div className="w-full max-w-7xl mx-auto px-4 md:px-6 py-16 md:py-32">
        {/* Sticky header block – keeps heading stable as you scroll */}
        <div className="sticky top-0 z-20 bg-background/95 backdrop-blur-sm border-b border-border/40 pt-4 pb-6 md:pt-6 md:pb-8">
          <div className="text-center">
            <div className="relative h-[3.5rem] md:h-[4.5rem] lg:h-[5.5rem]">
              {/* Chaos headline */}
              <motion.h2
                className="absolute inset-0 flex items-center justify-center text-2xl md:text-4xl lg:text-5xl font-bold text-foreground text-balance"
                style={{ opacity: headlineChaosOpacity }}
              >
                {CHAOS_HEADLINE}
              </motion.h2>

              {/* Clarity headline */}
              <motion.h2
                className="absolute inset-0 flex items-center justify-center text-2xl md:text-4xl lg:text-5xl font-bold text-foreground text-balance"
                style={{ opacity: headlineClarityOpacity }}
              >
                {CLARITY_HEADLINE}
              </motion.h2>
            </div>

            {/* Desktop paragraph */}
            <motion.p
              animate={{
                opacity: smoothStep(0.65, 0.8, animationProgress),
                y: lerp(20, 0, mapRange(animationProgress, 0.65, 0.8)),
              }}
              transition={{ duration: 0.3 }}
              className="hidden md:block text-base md:text-lg text-foreground/70 mt-4 leading-relaxed"
            >
              This is the critical missing piece before you deploy a six-figure
              consultant, and improves your confidence and decision making
              <br />
              ready for when you embark on a full AI strategy or transformation.
            </motion.p>

            {/* Mobile paragraph */}
            <motion.p
              animate={{
                opacity: smoothStep(0.65, 0.8, animationProgress),
                y: lerp(20, 0, mapRange(animationProgress, 0.65, 0.8)),
              }}
              transition={{ duration: 0.3 }}
              className="md:hidden text-sm text-foreground/70 mt-3 leading-relaxed"
            >
              The critical clarity step before deploying expensive consultants.
            </motion.p>
          </div>
        </div>

        {/* Main animation canvas */}
        <div className="relative h-[500px] md:h-[600px] w-full max-w-[min(calc(100vw-2rem),56rem)] mx-auto mt-10 md:mt-16 overflow-hidden">
          {Object.entries(groupedConcepts).map(([category, categoryPieces]) => {
            const cat = category as Category;

            const categoryPos = getOrganizedPosition(
              categoryPieces[0],
              0,
              isMobile
            );

            // Label positions: start chaotic, converge to category position
            const labelChaosPos = getRandomPosition(
              categoryPieces[0].id - 100,
              isMobile
            );
            const labelClarityPos = {
              x: categoryPos.x,
              y: categoryPos.y - 6,
            };

            const labelChaosTranslate =
              labelChaosPos.translateX === "-50%" ? -50 : 0;
            const labelClarityTranslate =
              categoryPos.translateX === "-50%"
                ? -50
                : categoryPos.translateX === "-100%"
                ? -100
                : 0;

            const labelInterpolatedTranslate =
              labelChaosTranslate +
              (labelClarityTranslate - labelChaosTranslate) *
                Math.min(1, animationProgress * 2);

            const labelEase = easeInOutCubic(labelProgress);
            const labelX =
              labelChaosPos.x +
              (labelClarityPos.x - labelChaosPos.x) * labelEase;
            const labelY =
              labelChaosPos.y +
              (labelClarityPos.y - labelChaosPos.y) * labelEase;

            const labelScale = lerp(
              1,
              1.05,
              smoothStep(0.6, 0.8, animationProgress)
            );
            const labelOpacity = lerp(
              0.7,
              1,
              smoothStep(0.2, 0.5, animationProgress)
            );

            const labelColor = getCategoryColor(
              cat,
              colorProgress,
              true
            );

            return (
              <div key={category}>
                {/* Category label */}
                <motion.div
                  className={`absolute text-xs md:text-sm font-bold uppercase tracking-wider whitespace-nowrap ${labelColor}`}
                  animate={{
                    left: `${labelX}%`,
                    top: `${labelY}%`,
                    x: `${labelInterpolatedTranslate}%`,
                    y: "-50%",
                    rotate: labelChaosPos.rotation * (1 - labelEase),
                    opacity: labelOpacity,
                    scale: labelScale,
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

                {/* Category concepts */}
                {categoryPieces.map((concept, index) => {
                  const pos = getInterpolatedPosition(
                    concept,
                    index,
                    isMobile,
                    animationProgress
                  );

                  const fadeProgress = temporaryFadeProgress;
                  const temporaryOpacity = concept.temporary
                    ? lerp(1, 0, fadeProgress)
                    : lerp(0.6, 1, animationProgress);

                  if (concept.temporary && fadeProgress >= 0.98) return null;

                  const itemScale = concept.temporary
                    ? lerp(1, 0.7, fadeProgress)
                    : 1;

                  const itemColor = getCategoryColor(
                    cat,
                    colorProgress,
                    false
                  );

                  return (
                    <motion.div
                      key={concept.id}
                      className={`absolute text-xs md:text-sm px-2 md:px-3 py-1 md:py-1.5 rounded-md bg-muted/50 border border-border/30 whitespace-nowrap ${itemColor}`}
                      style={{
                        maxWidth: isMobile ? "35vw" : "auto",
                      }}
                      animate={{
                        left: `${pos.x}%`,
                        top: `${pos.y}%`,
                        x: pos.translateX,
                        y: "-50%",
                        rotate: pos.rotation,
                        opacity: temporaryOpacity,
                        scale: itemScale,
                      }}
                      transition={{
                        type: "spring",
                        stiffness: 60,
                        damping: 20,
                        mass: 0.5,
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

        {/* AI News Ticker */}
        <motion.div
          className="mt-12 md:mt-20"
          animate={{
            opacity: newsTickerProgress,
            y: lerp(30, 0, newsTickerProgress),
          }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center mb-4 md:mb-6">
            <p className="text-sm md:text-base font-medium text-muted-foreground">
              {getCurrentMonthYear()} - Latest Business AI Headlines
            </p>
          </div>
          <AINewsTicker />
        </motion.div>

        {/* Scroll hint */}
        {showScrollHint && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            exit={{ opacity: 0 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-30 text-sm text-muted-foreground flex items-center gap-2"
          >
            <span>Scroll to organize</span>
            <svg
              className="w-4 h-4 animate-bounce"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 14l-7 7m0 0l-7-7m7 7V3"
              />
            </svg>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default ChaosToClarity;

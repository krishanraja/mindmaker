import { useState, useCallback, useRef, useEffect, useMemo } from "react";
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

// ---------- POSITION HELPERS (Pure functions, no state) ----------

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
    translateX: isMobile ? -50 : 0,
  };
};

const getOrganizedPosition = (
  concept: Concept,
  _index: number,
  isMobile: boolean
) => {
  const categoryPositions = isMobile
    ? {
        Technical: { baseX: 50, baseY: 12, translateX: -50 },
        Commercial: { baseX: 50, baseY: 35, translateX: -50 },
        Organizational: { baseX: 50, baseY: 58, translateX: -50 },
        Competitive: { baseX: 50, baseY: 81, translateX: -50 },
      }
    : {
        Technical: { baseX: 30, baseY: 22, translateX: -50 },
        Commercial: { baseX: 70, baseY: 22, translateX: -50 },
        Organizational: { baseX: 30, baseY: 62, translateX: -50 },
        Competitive: { baseX: 70, baseY: 62, translateX: -50 },
      };

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
  
  // Ref-based progress for continuous animation (no re-renders)
  const progressRef = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const rafIdRef = useRef<number | null>(null);
  const accumulatedDeltaRef = useRef(0);
  
  // State only for discrete UI changes (visibility thresholds)
  const [uiState, setUiState] = useState({
    showClarity: false,
    showTicker: false,
    showScrollHint: true,
    isComplete: false,
  });

  const PROGRESS_DIVISOR = isMobile ? 400 : 700;
  
  // Pre-calculate positions once (memoized)
  const visibleConcepts = useMemo(() => concepts.filter((c) => {
    if (!c.temporary) return true;
    if (!isMobile) return true;
    if (c.id > 110 && c.id < 200) return false;
    if (c.id > 206) return false;
    return true;
  }), [isMobile]);

  const conceptPositions = useMemo(() => {
    return visibleConcepts.map((concept, index) => {
      const chaos = getRandomPosition(concept.id, isMobile);
      const clarity = getOrganizedPosition(concept, index, isMobile);
      return { concept, chaos, clarity };
    });
  }, [visibleConcepts, isMobile]);

  const groupedConcepts = useMemo(() => {
    return visibleConcepts.reduce(
      (acc, concept) => {
        if (!acc[concept.category]) acc[concept.category] = [];
        acc[concept.category].push(concept);
        return acc;
      },
      {} as Record<Category, Concept[]>
    );
  }, [visibleConcepts]);

  // Update CSS variables for all animated elements
  const updateAnimationState = useCallback((progress: number) => {
    const container = containerRef.current;
    if (!container) return;

    // Set main progress variable
    container.style.setProperty('--chaos-progress', String(progress));
    
    // Derived progress values for different animation phases
    const headlineProgress = clamp01(mapRange(progress, 0.7, 0.9));
    const labelProgress = clamp01(mapRange(progress, 0.4, 0.6));
    const colorProgress = clamp01(mapRange(progress, 0.6, 0.8));
    const temporaryFadeProgress = clamp01(mapRange(progress, 0.2, 0.6));
    const newsTickerProgress = clamp01(mapRange(progress, 0.75, 0.9));

    container.style.setProperty('--headline-progress', String(headlineProgress));
    container.style.setProperty('--label-progress', String(labelProgress));
    container.style.setProperty('--color-progress', String(colorProgress));
    container.style.setProperty('--temp-fade-progress', String(temporaryFadeProgress));
    container.style.setProperty('--ticker-progress', String(newsTickerProgress));

    // Update each concept element position via CSS variables
    conceptPositions.forEach(({ concept, chaos, clarity }) => {
      const element = container.querySelector(`[data-concept-id="${concept.id}"]`) as HTMLElement;
      if (!element) return;

      const p = progress;
      const x = chaos.x + (clarity.x - chaos.x) * p;
      const y = chaos.y + (clarity.y - chaos.y) * p;
      const rotation = chaos.rotation * (1 - p);
      const translateX = chaos.translateX + (clarity.translateX - chaos.translateX) * p;

      element.style.setProperty('--pos-x', `${x}%`);
      element.style.setProperty('--pos-y', `${y}%`);
      element.style.setProperty('--rotation', `${rotation}deg`);
      element.style.setProperty('--translate-x', `${translateX}%`);

      // Opacity based on temporary status
      if (concept.temporary) {
        const fadeProgress = temporaryFadeProgress;
        const opacity = lerp(1, 0, fadeProgress);
        const scale = lerp(1, 0.7, fadeProgress);
        element.style.setProperty('--opacity', String(opacity));
        element.style.setProperty('--scale', String(scale));
      } else {
        const opacity = lerp(0.6, 1, progress);
        element.style.setProperty('--opacity', String(opacity));
        element.style.setProperty('--scale', '1');
      }
    });

    // Update category labels
    Object.entries(groupedConcepts).forEach(([category, pieces]) => {
      const labelElement = container.querySelector(`[data-label-category="${category}"]`) as HTMLElement;
      if (!labelElement || !pieces[0]) return;

      const categoryPos = getOrganizedPosition(pieces[0], 0, isMobile);
      const labelChaosPos = getRandomPosition(pieces[0].id - 100, isMobile);
      const labelClarityPos = { x: categoryPos.x, y: categoryPos.y - 6 };

      const labelEase = easeInOutCubic(labelProgress);
      const labelX = labelChaosPos.x + (labelClarityPos.x - labelChaosPos.x) * labelEase;
      const labelY = labelChaosPos.y + (labelClarityPos.y - labelChaosPos.y) * labelEase;
      const labelRotation = labelChaosPos.rotation * (1 - labelEase);
      const labelTranslateInterp = labelChaosPos.translateX + (categoryPos.translateX - labelChaosPos.translateX) * Math.min(1, progress * 2);

      labelElement.style.setProperty('--label-x', `${labelX}%`);
      labelElement.style.setProperty('--label-y', `${labelY}%`);
      labelElement.style.setProperty('--label-rotation', `${labelRotation}deg`);
      labelElement.style.setProperty('--label-translate', `${labelTranslateInterp}%`);
      labelElement.style.setProperty('--label-opacity', String(lerp(0.7, 1, smoothStep(0.2, 0.5, progress))));
      labelElement.style.setProperty('--label-scale', String(lerp(1, 1.05, smoothStep(0.6, 0.8, progress))));
    });

    // Headline opacity
    const headlineChaosOpacity = lerp(1, 0, smoothStep(0.5, 0.8, headlineProgress));
    const headlineClarityOpacity = lerp(0, 1, smoothStep(0.5, 0.8, headlineProgress));
    container.style.setProperty('--chaos-headline-opacity', String(headlineChaosOpacity));
    container.style.setProperty('--clarity-headline-opacity', String(headlineClarityOpacity));

    // Paragraph animation
    const paragraphOpacity = smoothStep(0.65, 0.8, progress);
    const paragraphY = lerp(20, 0, mapRange(progress, 0.65, 0.8));
    container.style.setProperty('--paragraph-opacity', String(paragraphOpacity));
    container.style.setProperty('--paragraph-y', `${paragraphY}px`);

    // News ticker
    container.style.setProperty('--ticker-opacity', String(newsTickerProgress));
    container.style.setProperty('--ticker-y', `${lerp(30, 0, newsTickerProgress)}px`);
  }, [conceptPositions, groupedConcepts, isMobile]);

  // Batched progress updates via RAF
  const scheduleUpdate = useCallback(() => {
    if (rafIdRef.current !== null) return;

    rafIdRef.current = requestAnimationFrame(() => {
      const delta = accumulatedDeltaRef.current;
      accumulatedDeltaRef.current = 0;
      rafIdRef.current = null;

      const newProgress = clamp01(progressRef.current + delta / PROGRESS_DIVISOR);
      progressRef.current = newProgress;

      // Update all CSS variables (GPU-accelerated)
      updateAnimationState(newProgress);

      // Only update React state for discrete visibility changes
      const newShowClarity = newProgress > 0.8;
      const newShowTicker = newProgress > 0.75;
      const newShowScrollHint = newProgress < 0.4;
      const newIsComplete = newProgress >= 1;

      setUiState(prev => {
        if (
          prev.showClarity !== newShowClarity ||
          prev.showTicker !== newShowTicker ||
          prev.showScrollHint !== newShowScrollHint ||
          prev.isComplete !== newIsComplete
        ) {
          return {
            showClarity: newShowClarity,
            showTicker: newShowTicker,
            showScrollHint: newShowScrollHint,
            isComplete: newIsComplete,
          };
        }
        return prev;
      });
    });
  }, [PROGRESS_DIVISOR, updateAnimationState]);

  const handleProgress = useCallback((delta: number, _direction: 'up' | 'down') => {
    accumulatedDeltaRef.current += delta;
    scheduleUpdate();
  }, [scheduleUpdate]);

  const { sectionRef, isLocked } = useScrollLock({
    lockThreshold: 0,
    headerOffset: 60,
    onProgress: handleProgress,
    isComplete: uiState.isComplete,
    canReverseExit: true,
    enabled: true,
  });

  // Initialize CSS variables
  useEffect(() => {
    if (containerRef.current) {
      updateAnimationState(0);
    }
  }, [updateAnimationState]);

  // Cleanup RAF on unmount
  useEffect(() => {
    return () => {
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
      }
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="w-full bg-background relative overflow-hidden min-h-screen"
    >
      <div 
        ref={containerRef}
        className="w-full max-w-7xl mx-auto px-4 md:px-6 py-16 md:py-32 chaos-clarity-container"
      >
        {/* Sticky header block */}
        <div className="sticky top-0 z-20 bg-background/95 backdrop-blur-sm border-b border-border/40 pt-4 pb-6 md:pt-6 md:pb-8">
          <div className="text-center">
            <div className="relative h-[3.5rem] md:h-[4.5rem] lg:h-[5.5rem]">
              {/* Chaos headline */}
              <h2
                className="absolute inset-0 flex items-center justify-center text-2xl md:text-4xl lg:text-5xl font-bold text-foreground text-balance chaos-headline"
                style={{ opacity: 'var(--chaos-headline-opacity, 1)' }}
              >
                {CHAOS_HEADLINE}
              </h2>

              {/* Clarity headline */}
              <h2
                className="absolute inset-0 flex items-center justify-center text-2xl md:text-4xl lg:text-5xl font-bold text-foreground text-balance clarity-headline"
                style={{ opacity: 'var(--clarity-headline-opacity, 0)' }}
              >
                {CLARITY_HEADLINE}
              </h2>
            </div>

            {/* Desktop paragraph */}
            <p
              className="hidden md:block text-base md:text-lg text-foreground/70 mt-4 leading-relaxed chaos-paragraph"
              style={{ 
                opacity: 'var(--paragraph-opacity, 0)',
                transform: 'translateY(var(--paragraph-y, 20px))'
              }}
            >
              This is the critical missing piece before you deploy a six-figure
              consultant, and improves your confidence and decision making
              <br />
              ready for when you embark on a full AI strategy or transformation.
            </p>

            {/* Mobile paragraph */}
            <p
              className="md:hidden text-sm text-foreground/70 mt-3 leading-relaxed chaos-paragraph"
              style={{ 
                opacity: 'var(--paragraph-opacity, 0)',
                transform: 'translateY(var(--paragraph-y, 20px))'
              }}
            >
              The critical clarity step before deploying expensive consultants.
            </p>
          </div>
        </div>

        {/* Main animation canvas */}
        <div className="relative h-[500px] md:h-[600px] w-full max-w-[min(calc(100vw-2rem),56rem)] mx-auto mt-10 md:mt-16 overflow-hidden">
          {Object.entries(groupedConcepts).map(([category, categoryPieces]) => {
            const cat = category as Category;
            const colorProgress = clamp01(mapRange(progressRef.current, 0.6, 0.8));
            const labelColor = getCategoryColor(cat, colorProgress, true);

            return (
              <div key={category}>
                {/* Category label - CSS variable driven */}
                <div
                  data-label-category={category}
                  className={`absolute text-xs md:text-sm font-bold uppercase tracking-wider whitespace-nowrap chaos-label ${labelColor}`}
                  style={{
                    left: 'var(--label-x, 50%)',
                    top: 'var(--label-y, 50%)',
                    transform: 'translate(var(--label-translate, -50%), -50%) rotate(var(--label-rotation, 0deg)) scale(var(--label-scale, 1))',
                    opacity: 'var(--label-opacity, 0.7)',
                  }}
                >
                  {category}
                </div>

                {/* Category concepts - CSS variable driven */}
                {categoryPieces.map((concept) => {
                  const itemColor = getCategoryColor(cat, colorProgress, false);

                  return (
                    <div
                      key={concept.id}
                      data-concept-id={concept.id}
                      className={`absolute text-xs md:text-sm px-2 md:px-3 py-1 md:py-1.5 rounded-md bg-muted/50 border border-border/30 whitespace-nowrap chaos-concept ${itemColor}`}
                      style={{
                        left: 'var(--pos-x, 50%)',
                        top: 'var(--pos-y, 50%)',
                        transform: 'translate(var(--translate-x, -50%), -50%) rotate(var(--rotation, 0deg)) scale(var(--scale, 1))',
                        opacity: 'var(--opacity, 1)',
                        maxWidth: isMobile ? "35vw" : "auto",
                      }}
                    >
                      {concept.label}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>

        {/* AI News Ticker */}
        <div
          className="mt-12 md:mt-20 chaos-ticker"
          style={{
            opacity: 'var(--ticker-opacity, 0)',
            transform: 'translateY(var(--ticker-y, 30px))',
          }}
        >
          <div className="text-center mb-4 md:mb-6">
            <p className="text-sm md:text-base font-medium text-muted-foreground">
              {getCurrentMonthYear()} - Latest Business AI Headlines
            </p>
          </div>
          <AINewsTicker />
        </div>

        {/* Scroll hint */}
        {isLocked && uiState.showScrollHint && (
          <div
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-30 text-sm text-muted-foreground flex items-center gap-2 animate-fade-in"
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
          </div>
        )}
      </div>
    </section>
  );
};

export default ChaosToClarity;

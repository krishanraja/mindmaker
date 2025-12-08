import { useRef, useCallback } from 'react';

interface UseThrottledProgressOptions {
  divisor: number;
  onProgressChange?: (progress: number) => void;
}

/**
 * A hook that batches scroll progress updates using requestAnimationFrame
 * to reduce React re-renders and improve scroll animation performance.
 * 
 * Returns a ref-based progress value and a CSS variable updater for GPU-accelerated animations.
 */
export const useThrottledProgress = (options: UseThrottledProgressOptions) => {
  const { divisor, onProgressChange } = options;
  
  // Progress stored in ref to avoid React re-renders
  const progressRef = useRef(0);
  const accumulatedDeltaRef = useRef(0);
  const rafIdRef = useRef<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
  
  // Schedule batched updates via RAF
  const scheduleUpdate = useCallback(() => {
    if (rafIdRef.current !== null) return; // Already scheduled
    
    rafIdRef.current = requestAnimationFrame(() => {
      const delta = accumulatedDeltaRef.current;
      accumulatedDeltaRef.current = 0;
      rafIdRef.current = null;
      
      const newProgress = clamp01(progressRef.current + delta / divisor);
      progressRef.current = newProgress;
      
      // Update CSS variable for GPU-accelerated animations
      if (containerRef.current) {
        containerRef.current.style.setProperty('--animation-progress', String(newProgress));
      }
      
      // Notify for discrete state changes only
      onProgressChange?.(newProgress);
    });
  }, [divisor, onProgressChange]);
  
  // Handler to be passed to useScrollLock
  const handleProgress = useCallback((delta: number, _direction: 'up' | 'down') => {
    accumulatedDeltaRef.current += delta;
    scheduleUpdate();
  }, [scheduleUpdate]);
  
  // Get current progress without causing re-render
  const getProgress = useCallback(() => progressRef.current, []);
  
  // Set progress directly (for initialization or reset)
  const setProgress = useCallback((value: number) => {
    progressRef.current = clamp01(value);
    if (containerRef.current) {
      containerRef.current.style.setProperty('--animation-progress', String(progressRef.current));
    }
    onProgressChange?.(progressRef.current);
  }, [onProgressChange]);
  
  // Cleanup RAF on unmount
  const cleanup = useCallback(() => {
    if (rafIdRef.current !== null) {
      cancelAnimationFrame(rafIdRef.current);
      rafIdRef.current = null;
    }
  }, []);
  
  return {
    progressRef,
    containerRef,
    handleProgress,
    getProgress,
    setProgress,
    cleanup,
  };
};

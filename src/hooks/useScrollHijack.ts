/**
 * @file useScrollHijack Hook
 * @description Defense-in-depth scroll hijacking with 8 protection layers
 * 
 * Layers implemented:
 * - Layer 1: HTML-level CSS (index.html)
 * - Layer 2: CSS Layer Priority (index.css @layer scroll-hijack)
 * - Layer 3: IntersectionObserver Detection
 * - Layer 4: Sentinel Element
 * - Layer 5: Multi-Event Blocking (wheel, touch, keyboard, programmatic)
 * - Layer 6: Instant Position Lock (body fixed)
 * - Layer 7: Animation Progress Smoothing
 * - Layer 8: Graceful Fast-Forward (escape velocity)
 * 
 * @dependencies None (standalone hook)
 */

import { useState, useEffect, useRef, useCallback, RefObject } from 'react';

// ============================================================
// TYPES
// ============================================================

interface UseScrollHijackOptions {
  /** Reference to the sentinel element (placed above target section) */
  sentinelRef: RefObject<HTMLElement>;
  /** Reference to the main section being hijacked */
  sectionRef: RefObject<HTMLElement>;
  /** Callback for animation progress updates */
  onProgress: (progress: number, delta: number, direction: 'up' | 'down') => void;
  /** Whether the animation is complete (triggers release) */
  isComplete: boolean;
  /** Progress divisor for converting scroll delta to 0-1 progress */
  progressDivisor?: number;
  /** Enable/disable the hook */
  enabled?: boolean;
  /** Maximum progress change per frame (prevents skipping) */
  maxDeltaPerFrame?: number;
  /** Escape velocity threshold (fast scroll = intent to skip) */
  escapeVelocityThreshold?: number;
  /** Callback when escape velocity detected */
  onEscapeVelocity?: () => void;
}

interface UseScrollHijackReturn {
  /** Whether scroll is currently hijacked */
  isLocked: boolean;
  /** Current animation progress (0-1) */
  progress: number;
  /** Force skip to completion */
  skipToEnd: () => void;
  /** Force reset to beginning */
  reset: () => void;
}

// ============================================================
// CONSTANTS
// ============================================================

const CSS_CLASS_LOCKED = 'scroll-hijack-locked';
const CSS_CLASS_LEGACY = 'scroll-locked';

// Keyboard keys that should be blocked during scroll hijack
const BLOCKED_KEYS = new Set([
  'ArrowUp', 'ArrowDown',
  'PageUp', 'PageDown',
  'Home', 'End',
  ' ', // Space
]);

// ============================================================
// UTILITIES
// ============================================================

const clamp = (value: number, min: number, max: number) => 
  Math.min(max, Math.max(min, value));

const lerp = (start: number, end: number, t: number) => 
  start + (end - start) * t;

// ============================================================
// MAIN HOOK
// ============================================================

export const useScrollHijack = (options: UseScrollHijackOptions): UseScrollHijackReturn => {
  const {
    sentinelRef,
    sectionRef,
    onProgress,
    isComplete,
    progressDivisor = 600,
    enabled = true,
    maxDeltaPerFrame = 0.08, // Max 8% progress per frame
    escapeVelocityThreshold = 15, // pixels/ms
    onEscapeVelocity,
  } = options;

  // ============================================================
  // STATE
  // ============================================================
  
  const [isLocked, setIsLocked] = useState(false);
  const progressRef = useRef(0);
  const [progress, setProgress] = useState(0);
  
  // ============================================================
  // REFS (avoid re-renders, maintain state across events)
  // ============================================================
  
  // Position lock
  const savedScrollYRef = useRef(0);
  const isLockedRef = useRef(false);
  
  // Velocity tracking
  const lastWheelTimeRef = useRef(0);
  const lastTouchYRef = useRef(0);
  const lastTouchTimeRef = useRef(0);
  const velocityRef = useRef(0);
  const velocityHistoryRef = useRef<number[]>([]);
  
  // Delta accumulation
  const accumulatedDeltaRef = useRef(0);
  const rafIdRef = useRef<number | null>(null);
  
  // Cooldown management
  const releaseCooldownRef = useRef(false);
  const cooldownTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  
  // Callback refs (avoid stale closures)
  const onProgressRef = useRef(onProgress);
  const onEscapeVelocityRef = useRef(onEscapeVelocity);
  const isCompleteRef = useRef(isComplete);
  
  // ============================================================
  // KEEP REFS IN SYNC
  // ============================================================
  
  useEffect(() => {
    onProgressRef.current = onProgress;
  }, [onProgress]);
  
  useEffect(() => {
    onEscapeVelocityRef.current = onEscapeVelocity;
  }, [onEscapeVelocity]);
  
  useEffect(() => {
    isCompleteRef.current = isComplete;
  }, [isComplete]);

  // ============================================================
  // LAYER 6: INSTANT POSITION LOCK
  // ============================================================
  
  const lockBody = useCallback(() => {
    if (isLockedRef.current) return;
    
    // Save current scroll position
    savedScrollYRef.current = window.scrollY;
    
    // Apply CSS classes (Layer 2 kicks in)
    document.documentElement.classList.add(CSS_CLASS_LOCKED);
    document.documentElement.classList.add(CSS_CLASS_LEGACY);
    
    // Set body top to maintain visual position
    document.body.style.top = `-${savedScrollYRef.current}px`;
    
    isLockedRef.current = true;
    setIsLocked(true);
  }, []);
  
  const unlockBody = useCallback(() => {
    if (!isLockedRef.current) return;
    
    // Remove CSS classes
    document.documentElement.classList.remove(CSS_CLASS_LOCKED);
    document.documentElement.classList.remove(CSS_CLASS_LEGACY);
    
    // Clear body top
    document.body.style.top = '';
    
    // Restore scroll position
    window.scrollTo(0, savedScrollYRef.current);
    
    isLockedRef.current = false;
    setIsLocked(false);
    
    // Set cooldown to prevent immediate re-lock
    releaseCooldownRef.current = true;
    if (cooldownTimerRef.current) {
      clearTimeout(cooldownTimerRef.current);
    }
    cooldownTimerRef.current = setTimeout(() => {
      releaseCooldownRef.current = false;
    }, 500);
  }, []);

  // ============================================================
  // LAYER 7 & 8: PROGRESS UPDATE WITH SMOOTHING & ESCAPE VELOCITY
  // ============================================================
  
  const updateProgress = useCallback((rawDelta: number, direction: 'up' | 'down') => {
    // Calculate progress delta with smoothing (Layer 7)
    const normalizedDelta = rawDelta / progressDivisor;
    const clampedDelta = clamp(normalizedDelta, -maxDeltaPerFrame, maxDeltaPerFrame);
    
    // Update progress
    const newProgress = clamp(progressRef.current + clampedDelta, 0, 1);
    
    // Only update if changed
    if (newProgress !== progressRef.current) {
      progressRef.current = newProgress;
      setProgress(newProgress);
      onProgressRef.current(newProgress, clampedDelta, direction);
    }
  }, [progressDivisor, maxDeltaPerFrame]);
  
  const scheduleProgressUpdate = useCallback(() => {
    if (rafIdRef.current !== null) return;
    
    rafIdRef.current = requestAnimationFrame(() => {
      const delta = accumulatedDeltaRef.current;
      accumulatedDeltaRef.current = 0;
      rafIdRef.current = null;
      
      if (Math.abs(delta) < 0.5) return; // Ignore tiny movements
      
      const direction = delta > 0 ? 'down' : 'up';
      updateProgress(delta, direction);
    });
  }, [updateProgress]);

  // ============================================================
  // LAYER 8: ESCAPE VELOCITY DETECTION
  // ============================================================
  
  const checkEscapeVelocity = useCallback(() => {
    // Calculate average velocity from history
    if (velocityHistoryRef.current.length < 3) return false;
    
    const avgVelocity = velocityHistoryRef.current.reduce((a, b) => a + b, 0) 
      / velocityHistoryRef.current.length;
    
    if (avgVelocity > escapeVelocityThreshold) {
      // User is scrolling very fast - they want to skip
      if (onEscapeVelocityRef.current) {
        onEscapeVelocityRef.current();
      }
      return true;
    }
    return false;
  }, [escapeVelocityThreshold]);
  
  const updateVelocity = useCallback((delta: number, timeDelta: number) => {
    if (timeDelta <= 0) return;
    
    const velocity = Math.abs(delta) / timeDelta;
    velocityRef.current = velocity;
    
    // Keep velocity history for smoothing
    velocityHistoryRef.current.push(velocity);
    if (velocityHistoryRef.current.length > 5) {
      velocityHistoryRef.current.shift();
    }
    
    // Check for escape velocity
    checkEscapeVelocity();
  }, [checkEscapeVelocity]);

  // ============================================================
  // LAYER 5: MULTI-EVENT BLOCKING
  // ============================================================
  
  // Wheel handler
  const handleWheel = useCallback((e: WheelEvent) => {
    if (!isLockedRef.current) return;
    
    e.preventDefault();
    e.stopPropagation();
    
    const now = performance.now();
    const timeDelta = now - lastWheelTimeRef.current;
    lastWheelTimeRef.current = now;
    
    // Update velocity tracking
    updateVelocity(e.deltaY, timeDelta);
    
    // Accumulate delta for RAF batching
    accumulatedDeltaRef.current += e.deltaY;
    scheduleProgressUpdate();
  }, [updateVelocity, scheduleProgressUpdate]);
  
  // Touch handlers
  const handleTouchStart = useCallback((e: TouchEvent) => {
    lastTouchYRef.current = e.touches[0].clientY;
    lastTouchTimeRef.current = performance.now();
  }, []);
  
  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (!isLockedRef.current) return;
    
    e.preventDefault();
    e.stopPropagation();
    
    const currentY = e.touches[0].clientY;
    const delta = lastTouchYRef.current - currentY; // Inverted for natural feel
    const now = performance.now();
    const timeDelta = now - lastTouchTimeRef.current;
    
    lastTouchYRef.current = currentY;
    lastTouchTimeRef.current = now;
    
    // Update velocity tracking
    updateVelocity(delta, timeDelta);
    
    // Accumulate delta for RAF batching
    accumulatedDeltaRef.current += delta;
    scheduleProgressUpdate();
  }, [updateVelocity, scheduleProgressUpdate]);
  
  // Keyboard handler
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!isLockedRef.current) return;
    
    if (BLOCKED_KEYS.has(e.key)) {
      e.preventDefault();
      e.stopPropagation();
      
      // Convert key to scroll delta
      let delta = 0;
      switch (e.key) {
        case 'ArrowDown':
        case ' ':
          delta = 100;
          break;
        case 'ArrowUp':
          delta = -100;
          break;
        case 'PageDown':
          delta = 400;
          break;
        case 'PageUp':
          delta = -400;
          break;
        case 'End':
          delta = 1000;
          break;
        case 'Home':
          delta = -1000;
          break;
      }
      
      accumulatedDeltaRef.current += delta;
      scheduleProgressUpdate();
    }
  }, [scheduleProgressUpdate]);
  
  // Prevent programmatic scroll during lock
  const handleScroll = useCallback(() => {
    if (!isLockedRef.current) return;
    
    // Force scroll position back
    if (Math.abs(window.scrollY - savedScrollYRef.current) > 1) {
      window.scrollTo(0, savedScrollYRef.current);
    }
  }, []);
  
  // History navigation handler
  const handlePopState = useCallback(() => {
    if (isLockedRef.current) {
      // Prevent navigation during scroll hijack
      window.scrollTo(0, savedScrollYRef.current);
    }
  }, []);

  // ============================================================
  // LAYER 3 & 4: INTERSECTION OBSERVER DETECTION
  // ============================================================
  
  useEffect(() => {
    if (!enabled) return;
    
    const sentinel = sentinelRef.current;
    const section = sectionRef.current;
    if (!sentinel || !section) return;
    
    // IntersectionObserver for sentinel (anticipatory detection)
    const sentinelObserver = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        
        // Sentinel entering viewport = prepare for hijack
        if (entry.isIntersecting && !isCompleteRef.current && !releaseCooldownRef.current) {
          // Check if we're scrolling down (sentinel should be above section)
          const sectionRect = section.getBoundingClientRect();
          
          // Only lock if section is close to viewport top
          if (sectionRect.top <= 150 && sectionRect.top >= -50) {
            lockBody();
          }
        }
      },
      {
        root: null,
        rootMargin: '100px 0px 0px 0px', // Trigger 100px before reaching viewport
        threshold: 0,
      }
    );
    
    // Secondary observer on section itself (backup detection)
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        
        if (entry.isIntersecting && !isCompleteRef.current && !releaseCooldownRef.current && !isLockedRef.current) {
          // Backup lock trigger if sentinel missed
          const rect = entry.boundingClientRect;
          if (rect.top <= 80 && rect.top >= -20) {
            lockBody();
          }
        }
      },
      {
        root: null,
        rootMargin: '-80px 0px 0px 0px',
        threshold: 0.1,
      }
    );
    
    sentinelObserver.observe(sentinel);
    sectionObserver.observe(section);
    
    return () => {
      sentinelObserver.disconnect();
      sectionObserver.disconnect();
    };
  }, [enabled, sentinelRef, sectionRef, lockBody]);

  // ============================================================
  // EVENT LISTENER MANAGEMENT
  // ============================================================
  
  useEffect(() => {
    if (!enabled) return;
    
    // Add event listeners with proper options
    window.addEventListener('wheel', handleWheel, { passive: false, capture: true });
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: false, capture: true });
    window.addEventListener('keydown', handleKeyDown, { capture: true });
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('popstate', handlePopState);
    
    return () => {
      window.removeEventListener('wheel', handleWheel, { capture: true } as EventListenerOptions);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove, { capture: true } as EventListenerOptions);
      window.removeEventListener('keydown', handleKeyDown, { capture: true } as EventListenerOptions);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('popstate', handlePopState);
      
      // Cleanup RAF
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }
      
      // Cleanup cooldown timer
      if (cooldownTimerRef.current) {
        clearTimeout(cooldownTimerRef.current);
      }
    };
  }, [enabled, handleWheel, handleTouchStart, handleTouchMove, handleKeyDown, handleScroll, handlePopState]);

  // ============================================================
  // RELEASE ON COMPLETION
  // ============================================================
  
  useEffect(() => {
    if (isComplete && isLockedRef.current) {
      unlockBody();
    }
  }, [isComplete, unlockBody]);

  // ============================================================
  // CLEANUP ON UNMOUNT
  // ============================================================
  
  useEffect(() => {
    return () => {
      // Always cleanup scroll lock on unmount
      if (isLockedRef.current) {
        document.documentElement.classList.remove(CSS_CLASS_LOCKED);
        document.documentElement.classList.remove(CSS_CLASS_LEGACY);
        document.body.style.top = '';
      }
    };
  }, []);

  // ============================================================
  // PUBLIC API
  // ============================================================
  
  const skipToEnd = useCallback(() => {
    progressRef.current = 1;
    setProgress(1);
    onProgressRef.current(1, 1, 'down');
  }, []);
  
  const reset = useCallback(() => {
    progressRef.current = 0;
    setProgress(0);
    velocityHistoryRef.current = [];
    accumulatedDeltaRef.current = 0;
    onProgressRef.current(0, 0, 'up');
  }, []);

  return {
    isLocked,
    progress,
    skipToEnd,
    reset,
  };
};

export default useScrollHijack;

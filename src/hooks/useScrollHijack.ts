/**
 * @file useScrollHijack Hook v2
 * @description BULLETPROOF scroll hijacking with continuous monitoring
 * 
 * Key architectural changes from v1:
 * - CONTINUOUS scroll monitoring (not just IntersectionObserver)
 * - SNAP-TO-POSITION before lock engages
 * - Configurable targetOffset for precise positioning
 * - Proper reset logic for re-engagement
 * 
 * @dependencies None (standalone hook)
 */

import { useState, useEffect, useRef, useCallback, RefObject } from 'react';

// ============================================================
// TYPES
// ============================================================

interface UseScrollHijackOptions {
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
  /** Target offset from viewport top when locked (default: 0) */
  targetOffset?: number;
  /** Buffer zone for triggering (how close to targetOffset before lock) */
  triggerBuffer?: number;
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

// ============================================================
// MAIN HOOK
// ============================================================

export const useScrollHijack = (options: UseScrollHijackOptions): UseScrollHijackReturn => {
  const {
    sectionRef,
    onProgress,
    isComplete,
    progressDivisor = 600,
    enabled = true,
    maxDeltaPerFrame = 0.08,
    escapeVelocityThreshold = 15,
    onEscapeVelocity,
    targetOffset = 0,
    triggerBuffer = 100,
  } = options;

  // ============================================================
  // STATE
  // ============================================================
  
  const [isLocked, setIsLocked] = useState(false);
  const progressRef = useRef(0);
  const [progress, setProgress] = useState(0);
  
  // ============================================================
  // REFS
  // ============================================================
  
  // Position lock
  const savedScrollYRef = useRef(0);
  const isLockedRef = useRef(false);
  const targetScrollYRef = useRef(0);
  
  // Velocity tracking
  const lastWheelTimeRef = useRef(0);
  const lastTouchYRef = useRef(0);
  const lastTouchTimeRef = useRef(0);
  const velocityRef = useRef(0);
  const velocityHistoryRef = useRef<number[]>([]);
  
  // Delta accumulation
  const accumulatedDeltaRef = useRef(0);
  const rafIdRef = useRef<number | null>(null);
  
  // State management
  const releaseCooldownRef = useRef(false);
  const cooldownTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hasExitedViewportRef = useRef(false);
  
  // Callback refs
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
  // LOCK/UNLOCK FUNCTIONS
  // ============================================================
  
  const lockBody = useCallback((scrollY: number) => {
    if (isLockedRef.current) return;
    
    // Save the EXACT scroll position we want to maintain
    savedScrollYRef.current = scrollY;
    
    // Apply CSS classes
    document.documentElement.classList.add(CSS_CLASS_LOCKED);
    document.documentElement.classList.add(CSS_CLASS_LEGACY);
    
    // Set body top to maintain visual position
    document.body.style.top = `-${scrollY}px`;
    
    isLockedRef.current = true;
    setIsLocked(true);
    
    // Reset progress tracking for fresh start
    velocityHistoryRef.current = [];
    accumulatedDeltaRef.current = 0;
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
    }, 300);
  }, []);

  // ============================================================
  // PROGRESS UPDATE WITH SMOOTHING
  // ============================================================
  
  const updateProgress = useCallback((rawDelta: number, direction: 'up' | 'down') => {
    const normalizedDelta = rawDelta / progressDivisor;
    const clampedDelta = clamp(normalizedDelta, -maxDeltaPerFrame, maxDeltaPerFrame);
    
    const newProgress = clamp(progressRef.current + clampedDelta, 0, 1);
    
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
      
      if (Math.abs(delta) < 0.5) return;
      
      const direction = delta > 0 ? 'down' : 'up';
      updateProgress(delta, direction);
    });
  }, [updateProgress]);

  // ============================================================
  // ESCAPE VELOCITY DETECTION
  // ============================================================
  
  const checkEscapeVelocity = useCallback(() => {
    if (velocityHistoryRef.current.length < 3) return false;
    
    const avgVelocity = velocityHistoryRef.current.reduce((a, b) => a + b, 0) 
      / velocityHistoryRef.current.length;
    
    if (avgVelocity > escapeVelocityThreshold) {
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
    
    velocityHistoryRef.current.push(velocity);
    if (velocityHistoryRef.current.length > 5) {
      velocityHistoryRef.current.shift();
    }
    
    checkEscapeVelocity();
  }, [checkEscapeVelocity]);

  // ============================================================
  // EVENT HANDLERS
  // ============================================================
  
  const handleWheel = useCallback((e: WheelEvent) => {
    if (!isLockedRef.current) return;
    
    e.preventDefault();
    e.stopPropagation();
    
    const now = performance.now();
    const timeDelta = now - lastWheelTimeRef.current;
    lastWheelTimeRef.current = now;
    
    updateVelocity(e.deltaY, timeDelta);
    
    accumulatedDeltaRef.current += e.deltaY;
    scheduleProgressUpdate();
  }, [updateVelocity, scheduleProgressUpdate]);
  
  const handleTouchStart = useCallback((e: TouchEvent) => {
    lastTouchYRef.current = e.touches[0].clientY;
    lastTouchTimeRef.current = performance.now();
  }, []);
  
  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (!isLockedRef.current) return;
    
    e.preventDefault();
    e.stopPropagation();
    
    const currentY = e.touches[0].clientY;
    const delta = lastTouchYRef.current - currentY;
    const now = performance.now();
    const timeDelta = now - lastTouchTimeRef.current;
    
    lastTouchYRef.current = currentY;
    lastTouchTimeRef.current = now;
    
    updateVelocity(delta, timeDelta);
    
    accumulatedDeltaRef.current += delta;
    scheduleProgressUpdate();
  }, [updateVelocity, scheduleProgressUpdate]);
  
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!isLockedRef.current) return;
    
    if (BLOCKED_KEYS.has(e.key)) {
      e.preventDefault();
      e.stopPropagation();
      
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
  
  const handlePopState = useCallback(() => {
    if (isLockedRef.current) {
      window.scrollTo(0, savedScrollYRef.current);
    }
  }, []);

  // ============================================================
  // CONTINUOUS SCROLL MONITORING - THE KEY FIX
  // ============================================================
  
  const handleScroll = useCallback(() => {
    if (!enabled) return;
    
    const section = sectionRef.current;
    if (!section) return;
    
    const rect = section.getBoundingClientRect();
    const sectionTop = rect.top;
    const scrollY = window.scrollY;
    
    // If locked, force scroll position back (prevent any drift)
    if (isLockedRef.current) {
      if (Math.abs(scrollY - savedScrollYRef.current) > 1) {
        window.scrollTo(0, savedScrollYRef.current);
      }
      return;
    }
    
    // Skip if in cooldown or already complete
    if (releaseCooldownRef.current) return;
    if (isCompleteRef.current && !hasExitedViewportRef.current) return;
    
    // Calculate the ideal scroll position for locking
    // This is where the section top = targetOffset
    const sectionTopFromDocumentTop = scrollY + sectionTop;
    const idealScrollY = sectionTopFromDocumentTop - targetOffset;
    
    // Check if section is in the lock trigger zone
    // Lock when section top is between targetOffset and targetOffset + triggerBuffer
    const isInTriggerZone = sectionTop <= (targetOffset + triggerBuffer) && sectionTop >= (targetOffset - triggerBuffer);
    
    // Check if we're scrolling down into the section
    const isApproachingSection = sectionTop <= (targetOffset + triggerBuffer * 2) && sectionTop > targetOffset;
    
    if (isInTriggerZone || isApproachingSection) {
      // SNAP to the ideal position, then lock
      if (Math.abs(scrollY - idealScrollY) > 2) {
        // Need to snap first
        window.scrollTo({
          top: idealScrollY,
          behavior: 'instant'
        });
        // Lock after snap settles
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            if (!isLockedRef.current && !releaseCooldownRef.current) {
              lockBody(idealScrollY);
            }
          });
        });
      } else {
        // Already at ideal position, lock immediately
        lockBody(idealScrollY);
      }
    }
    
    // Track if section has exited viewport (scrolled past)
    // This allows re-engagement when scrolling back up
    if (rect.bottom < 0) {
      hasExitedViewportRef.current = true;
    } else if (rect.top > window.innerHeight) {
      hasExitedViewportRef.current = true;
      // Reset isComplete when section is fully out of view (above viewport)
      // This allows re-engagement when user scrolls back down
    }
  }, [enabled, sectionRef, targetOffset, triggerBuffer, lockBody]);

  // ============================================================
  // EFFECT: SET UP EVENT LISTENERS
  // ============================================================
  
  useEffect(() => {
    if (!enabled) return;
    
    // CRITICAL: Use scroll event for CONTINUOUS monitoring
    // This is what was missing in v1 - IntersectionObserver alone is not enough
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Event blocking (only active when locked)
    window.addEventListener('wheel', handleWheel, { passive: false, capture: true });
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: false, capture: true });
    window.addEventListener('keydown', handleKeyDown, { capture: true });
    window.addEventListener('popstate', handlePopState);
    
    // Initial check in case page loads with section already in view
    handleScroll();
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('wheel', handleWheel, { capture: true } as EventListenerOptions);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove, { capture: true } as EventListenerOptions);
      window.removeEventListener('keydown', handleKeyDown, { capture: true } as EventListenerOptions);
      window.removeEventListener('popstate', handlePopState);
      
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }
      
      if (cooldownTimerRef.current) {
        clearTimeout(cooldownTimerRef.current);
      }
    };
  }, [enabled, handleScroll, handleWheel, handleTouchStart, handleTouchMove, handleKeyDown, handlePopState]);

  // ============================================================
  // EFFECT: RELEASE ON COMPLETION
  // ============================================================
  
  useEffect(() => {
    if (isComplete && isLockedRef.current) {
      unlockBody();
    }
  }, [isComplete, unlockBody]);

  // ============================================================
  // EFFECT: CLEANUP ON UNMOUNT
  // ============================================================
  
  useEffect(() => {
    return () => {
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
    hasExitedViewportRef.current = false;
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

/**
 * @file useScrollHijack Hook v4
 * @description BULLETPROOF scroll hijacking with seamless boundary exit
 * 
 * Key architectural changes:
 * - v2: Body fixed positioning (caused blank screen bug)
 * - v3: Overflow-based lock with RAF position maintenance (fixed blank screen)
 * - v4: Boundary-based auto-release (fixes "stuck" UX issue)
 * 
 * The v3 bug: Users got "stuck" at boundaries because:
 * - Exit only happened at 100% progress
 * - No exit at 0% when scrolling up
 * - Escape velocity threshold was too high (12px/ms)
 * - Extra scroll delta at boundaries was lost
 * 
 * v4 fix: Accumulate "overflow" scroll delta at boundaries.
 * Once overflow exceeds threshold, release lock and let user continue.
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
  /** Escape velocity threshold (fast scroll = intent to skip) - v4: lowered default */
  escapeVelocityThreshold?: number;
  /** Callback when escape velocity detected */
  onEscapeVelocity?: () => void;
  /** Target offset from viewport top when locked (default: 0) */
  targetOffset?: number;
  /** Buffer zone for triggering (how close to targetOffset before lock) */
  triggerBuffer?: number;
  /** v4: Overflow threshold - how much extra scroll at boundary triggers release (default: 150px) */
  overflowThreshold?: number;
  /** v4: Callback when released at boundary (top or bottom) */
  onBoundaryRelease?: (boundary: 'top' | 'bottom') => void;
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
    // v4: Lowered from 15 to 8 - more forgiving escape velocity
    escapeVelocityThreshold = 8,
    onEscapeVelocity,
    targetOffset = 0,
    triggerBuffer = 100,
    // v4: New boundary release options
    overflowThreshold = 150,
    onBoundaryRelease,
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
  
  // Position lock - v3: NO body.style.top manipulation
  const savedScrollYRef = useRef(0);
  const isLockedRef = useRef(false);
  const positionMaintenanceRafRef = useRef<number | null>(null);
  
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
  
  // v4: Boundary overflow tracking
  const overflowDeltaRef = useRef(0);
  const boundaryHitRef = useRef<'top' | 'bottom' | null>(null);
  
  // Callback refs
  const onProgressRef = useRef(onProgress);
  const onEscapeVelocityRef = useRef(onEscapeVelocity);
  const isCompleteRef = useRef(isComplete);
  const onBoundaryReleaseRef = useRef(onBoundaryRelease);
  
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
  
  useEffect(() => {
    onBoundaryReleaseRef.current = onBoundaryRelease;
  }, [onBoundaryRelease]);

  // ============================================================
  // POSITION MAINTENANCE LOOP (v3 - replaces body fixed positioning)
  // ============================================================
  
  const startPositionMaintenance = useCallback(() => {
    const maintainPosition = () => {
      if (!isLockedRef.current) return;
      
      // Force scroll position back to saved position
      // This runs every frame to prevent ANY drift
      if (Math.abs(window.scrollY - savedScrollYRef.current) > 0) {
        window.scrollTo(0, savedScrollYRef.current);
      }
      
      positionMaintenanceRafRef.current = requestAnimationFrame(maintainPosition);
    };
    
    positionMaintenanceRafRef.current = requestAnimationFrame(maintainPosition);
  }, []);
  
  const stopPositionMaintenance = useCallback(() => {
    if (positionMaintenanceRafRef.current !== null) {
      cancelAnimationFrame(positionMaintenanceRafRef.current);
      positionMaintenanceRafRef.current = null;
    }
  }, []);

  // ============================================================
  // LOCK/UNLOCK FUNCTIONS (v3 - overflow-based, no body repositioning)
  // ============================================================
  
  const lockBody = useCallback((scrollY: number) => {
    if (isLockedRef.current) return;
    
    // Save the EXACT scroll position we want to maintain
    savedScrollYRef.current = scrollY;
    
    // Apply CSS classes (these now only set overflow:hidden, NOT position:fixed)
    document.documentElement.classList.add(CSS_CLASS_LOCKED);
    document.documentElement.classList.add(CSS_CLASS_LEGACY);
    
    // v3: NO body.style.top manipulation - this was causing the blank screen!
    // Instead, we use RAF to maintain scroll position
    
    isLockedRef.current = true;
    setIsLocked(true);
    
    // Start the position maintenance loop
    startPositionMaintenance();
    
    // Reset progress tracking for fresh start
    velocityHistoryRef.current = [];
    accumulatedDeltaRef.current = 0;
    
    // v4: Reset overflow tracking
    overflowDeltaRef.current = 0;
    boundaryHitRef.current = null;
  }, [startPositionMaintenance]);
  
  const unlockBody = useCallback(() => {
    if (!isLockedRef.current) return;
    
    // Stop position maintenance first
    stopPositionMaintenance();
    
    // Remove CSS classes
    document.documentElement.classList.remove(CSS_CLASS_LOCKED);
    document.documentElement.classList.remove(CSS_CLASS_LEGACY);
    
    // v3: No body.style.top to clear
    
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
  }, [stopPositionMaintenance]);

  // ============================================================
  // v4: BOUNDARY RELEASE FUNCTION
  // ============================================================
  
  const releaseBoundary = useCallback((boundary: 'top' | 'bottom') => {
    if (!isLockedRef.current) return;
    
    // Call boundary release callback if provided
    if (onBoundaryReleaseRef.current) {
      onBoundaryReleaseRef.current(boundary);
    }
    
    // Unlock the body
    unlockBody();
    
    // Reset overflow tracking
    overflowDeltaRef.current = 0;
    boundaryHitRef.current = null;
  }, [unlockBody]);

  // ============================================================
  // PROGRESS UPDATE WITH SMOOTHING + v4 BOUNDARY OVERFLOW TRACKING
  // ============================================================
  
  const updateProgress = useCallback((rawDelta: number, direction: 'up' | 'down') => {
    const normalizedDelta = rawDelta / progressDivisor;
    const clampedDelta = clamp(normalizedDelta, -maxDeltaPerFrame, maxDeltaPerFrame);
    
    const currentProgress = progressRef.current;
    const newProgress = clamp(currentProgress + clampedDelta, 0, 1);
    
    // v4: Track overflow at boundaries
    // When at a boundary and user keeps scrolling in that direction,
    // accumulate the "overflow" delta. Once it exceeds threshold, release.
    
    // Check if we're AT a boundary
    const atTopBoundary = newProgress === 0;
    const atBottomBoundary = newProgress === 1;
    
    // Check if user is trying to scroll PAST the boundary
    const scrollingPastTop = atTopBoundary && rawDelta < 0; // At 0%, scrolling up
    const scrollingPastBottom = atBottomBoundary && rawDelta > 0; // At 100%, scrolling down
    
    if (scrollingPastTop) {
      // User is at top boundary, trying to scroll up (exit upward)
      if (boundaryHitRef.current !== 'top') {
        // First time hitting this boundary, reset overflow
        boundaryHitRef.current = 'top';
        overflowDeltaRef.current = 0;
      }
      // Accumulate overflow (use absolute value since rawDelta is negative)
      overflowDeltaRef.current += Math.abs(rawDelta);
      
      // Check if overflow threshold reached
      if (overflowDeltaRef.current >= overflowThreshold) {
        releaseBoundary('top');
        return; // Don't update progress, we're releasing
      }
    } else if (scrollingPastBottom) {
      // User is at bottom boundary, trying to scroll down (exit downward)
      if (boundaryHitRef.current !== 'bottom') {
        // First time hitting this boundary, reset overflow
        boundaryHitRef.current = 'bottom';
        overflowDeltaRef.current = 0;
      }
      // Accumulate overflow
      overflowDeltaRef.current += rawDelta;
      
      // Check if overflow threshold reached
      if (overflowDeltaRef.current >= overflowThreshold) {
        releaseBoundary('bottom');
        return; // Don't update progress, we're releasing
      }
    } else {
      // Not at a boundary or scrolling away from boundary - reset overflow tracking
      if (boundaryHitRef.current !== null) {
        boundaryHitRef.current = null;
        overflowDeltaRef.current = 0;
      }
    }
    
    // Update progress if changed
    if (newProgress !== currentProgress) {
      progressRef.current = newProgress;
      setProgress(newProgress);
      onProgressRef.current(newProgress, clampedDelta, direction);
    }
  }, [progressDivisor, maxDeltaPerFrame, overflowThreshold, releaseBoundary]);
  
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
      // Stop position maintenance RAF
      if (positionMaintenanceRafRef.current !== null) {
        cancelAnimationFrame(positionMaintenanceRafRef.current);
        positionMaintenanceRafRef.current = null;
      }
      
      if (isLockedRef.current) {
        document.documentElement.classList.remove(CSS_CLASS_LOCKED);
        document.documentElement.classList.remove(CSS_CLASS_LEGACY);
        // v3: No body.style.top to clear
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

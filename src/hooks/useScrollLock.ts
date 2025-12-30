import { useState, useEffect, useRef, RefObject } from 'react';

interface UseScrollLockOptions {
  lockThreshold: number;
  headerOffset?: number;
  onProgress: (delta: number, direction: 'up' | 'down') => void;
  isComplete: boolean;
  canReverseExit?: boolean;
  enabled?: boolean;
  titleRef?: RefObject<HTMLElement>; // Reference to title element for title-based triggering
  titleOffset?: number; // Offset from top when title should trigger (default: 30px)
}

interface UseScrollLockReturn {
  sectionRef: RefObject<HTMLElement>;
  isLocked: boolean;
}

export const useScrollLock = (options: UseScrollLockOptions): UseScrollLockReturn => {
  const sectionRef = useRef<HTMLElement>(null);
  const [isLocked, setIsLocked] = useState(false);
  
  // Refs to avoid dependency array issues and reduce re-renders
  const onProgressRef = useRef(options.onProgress);
  const touchStartYRef = useRef(0);
  const scrollPositionRef = useRef(0);
  const releaseCooldownRef = useRef(false);
  const isCompleteRef = useRef(options.isComplete);
  const canReverseExitRef = useRef(options.canReverseExit ?? false);
  const lastScrollCheckRef = useRef(0);
  const lastWheelTimeRef = useRef(0);
  const velocityRef = useRef(0);
  const lastDeltaRef = useRef(0);
  const scrollLockRafRef = useRef<number | null>(null);
  
  // Keep refs updated (these don't cause re-renders)
  useEffect(() => {
    onProgressRef.current = options.onProgress;
  }, [options.onProgress]);
  
  useEffect(() => {
    isCompleteRef.current = options.isComplete;
  }, [options.isComplete]);

  useEffect(() => {
    canReverseExitRef.current = options.canReverseExit ?? false;
  }, [options.canReverseExit]);

  useEffect(() => {
    const enabled = options.enabled ?? true;
    if (!enabled) return;

    // Throttled wheel handler - batches via onProgress which already uses RAF
    const handleWheel = (e: WheelEvent) => {
      if (!isLocked) return;
      
      e.preventDefault();
      e.stopPropagation();
      
      const now = performance.now();
      const timeDelta = now - lastWheelTimeRef.current;
      const deltaY = e.deltaY;
      
      // Calculate velocity (pixels per millisecond)
      if (timeDelta > 0) {
        const currentVelocity = Math.abs(deltaY) / timeDelta;
        // Smooth velocity with exponential moving average
        velocityRef.current = velocityRef.current * 0.7 + currentVelocity * 0.3;
      }
      
      // Smooth rapid delta changes to prevent jitter
      const smoothedDelta = lastDeltaRef.current * 0.3 + deltaY * 0.7;
      lastDeltaRef.current = smoothedDelta;
      
      const direction = smoothedDelta > 0 ? 'down' : 'up';
      
      // FIX (a): Pass delta with correct sign for bidirectional support
      // Negative delta for scroll up, positive for scroll down
      onProgressRef.current(smoothedDelta, direction);
      
      lastWheelTimeRef.current = now;
    };

    const handleTouchStart = (e: TouchEvent) => {
      touchStartYRef.current = e.touches[0].clientY;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isLocked) return;
      e.preventDefault();
      e.stopPropagation();
      
      const now = performance.now();
      const currentY = e.touches[0].clientY;
      const delta = touchStartYRef.current - currentY;
      const timeDelta = now - lastWheelTimeRef.current;
      
      // Calculate velocity for touch events too
      if (timeDelta > 0) {
        const currentVelocity = Math.abs(delta) / timeDelta;
        velocityRef.current = velocityRef.current * 0.7 + currentVelocity * 0.3;
      }
      
      // Smooth touch deltas
      const smoothedDelta = lastDeltaRef.current * 0.3 + delta * 0.7;
      lastDeltaRef.current = smoothedDelta;
      
      touchStartYRef.current = currentY;
      
      const direction = smoothedDelta > 0 ? 'down' : 'up';
      
      // FIX (a): Pass delta directly for bidirectional support
      onProgressRef.current(smoothedDelta, direction);
      
      lastWheelTimeRef.current = now;
    };

    // Throttled scroll check - only check every 16ms (60fps)
    const handleScroll = () => {
      const now = performance.now();
      if (now - lastScrollCheckRef.current < 16) return;
      lastScrollCheckRef.current = now;
      
      // Don't check during cooldown
      if (releaseCooldownRef.current) return;
      
      const section = sectionRef.current;
      if (!section) return;

      const rect = section.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const lockThreshold = options.lockThreshold ?? 0;
      
      // Title-based triggering: if titleRef is provided, use title position
      // Otherwise fall back to section-based triggering
      let shouldLock = false;
      
      if (options.titleRef?.current) {
        const titleRect = options.titleRef.current.getBoundingClientRect();
        const titleOffset = options.titleOffset ?? 30; // Default: trigger when title is 30px from top
        
        // Trigger when title is near (but not at) the top of viewport
        // Title should be between 0 and titleOffset pixels from top
        shouldLock = titleRect.top <= titleOffset && 
                     titleRect.top >= 0 && // Not past top
                     rect.bottom > viewportHeight * 0.3 && 
                     !isCompleteRef.current;
      } else {
        // Fallback to section-based triggering
        const triggerPoint = -(30 + lockThreshold);
        shouldLock = rect.top <= triggerPoint && 
                     rect.bottom > viewportHeight * 0.3 && 
                     !isCompleteRef.current;
      }
      
      // After lock, snap so section top is flush with viewport top
      const snapOffset = 0; // Section top will be flush with viewport top

      if (shouldLock && !isLocked) {
        // Snap to position where section top is flush with viewport top
        const idealScrollY = window.scrollY + rect.top - snapOffset;
        
        setIsLocked(true);
        scrollPositionRef.current = idealScrollY;
        // Snap so section top is flush with viewport top
        window.scrollTo(0, idealScrollY);
        document.documentElement.classList.add('scroll-locked');
      }
      
      // Maintain scroll position during lock to prevent drift
      // Use RAF for smooth, stable position maintenance, especially during fast scrolling
      if (isLocked && !releaseCooldownRef.current) {
        // Cancel any pending RAF
        if (scrollLockRafRef.current !== null) {
          cancelAnimationFrame(scrollLockRafRef.current);
        }
        
        scrollLockRafRef.current = requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;
          const drift = Math.abs(currentScrollY - scrollPositionRef.current);
          
          // More aggressive locking during fast scrolling (high velocity)
          const threshold = velocityRef.current > 2 ? 0.5 : 1;
          
          if (drift > threshold) {
            // Smoothly restore position to prevent jitter
            window.scrollTo({
              top: scrollPositionRef.current,
              behavior: 'auto' // Instant for stability
            });
          }
          
          scrollLockRafRef.current = null;
        });
      }
    };
    
    // Attach listeners with appropriate passive flags
    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('scroll', handleScroll);
      // Cleanup RAF
      if (scrollLockRafRef.current !== null) {
        cancelAnimationFrame(scrollLockRafRef.current);
        scrollLockRafRef.current = null;
      }
      // Reset velocity on cleanup
      velocityRef.current = 0;
      lastDeltaRef.current = 0;
    };
  }, [isLocked, options.lockThreshold, options.enabled, options.headerOffset, options.titleRef, options.titleOffset]);

  // Separate effect for release logic
  useEffect(() => {
    if (options.isComplete && isLocked) {
      // Release lock only when scrolling forward completes
      setIsLocked(false);
      
      // Set cooldown to prevent immediate re-lock
      releaseCooldownRef.current = true;
      
      // Remove scroll lock class
      document.documentElement.classList.remove('scroll-locked');
      
      // FIX (d): Ensure no scroll position jump by maintaining current position
      const currentScrollY = window.scrollY;
      
      // Restore scroll position after a frame
      requestAnimationFrame(() => {
        window.scrollTo(0, currentScrollY);
        
        // Clear cooldown after scroll restoration settles
        setTimeout(() => {
          releaseCooldownRef.current = false;
        }, 300);
      });
    }
  }, [options.isComplete, isLocked]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      document.documentElement.classList.remove('scroll-locked');
    };
  }, []);

  return { sectionRef, isLocked };
};

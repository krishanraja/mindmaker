import { useState, useEffect, useRef, RefObject } from 'react';

interface UseScrollLockOptions {
  lockThreshold: number;
  headerOffset?: number;
  onProgress: (delta: number, direction: 'up' | 'down') => void;
  isComplete: boolean;
  canReverseExit?: boolean;
  enabled?: boolean;
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
      
      const direction = e.deltaY > 0 ? 'down' : 'up';
      
      // FIX (a): Pass delta with correct sign for bidirectional support
      // Negative delta for scroll up, positive for scroll down
      onProgressRef.current(e.deltaY, direction);
      
      lastWheelTimeRef.current = performance.now();
    };

    const handleTouchStart = (e: TouchEvent) => {
      touchStartYRef.current = e.touches[0].clientY;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isLocked) return;
      e.preventDefault();
      e.stopPropagation();
      
      const currentY = e.touches[0].clientY;
      const delta = touchStartYRef.current - currentY;
      touchStartYRef.current = currentY;
      
      const direction = delta > 0 ? 'down' : 'up';
      
      // FIX (a): Pass delta directly for bidirectional support
      onProgressRef.current(delta, direction);
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
      
      // Use section's rect.top directly - trigger after section has scrolled PAST the viewport top
      // lockThreshold controls how far past (negative = section top above viewport)
      // Default: -30 means section top must be 30px above viewport before locking
      const triggerPoint = -(30 + lockThreshold);
      
      const shouldLock = rect.top <= triggerPoint && 
                         rect.bottom > viewportHeight * 0.3 && 
                         !isCompleteRef.current;
      
      // After lock, snap so section top is just barely above viewport (minimal overshoot)
      const snapOffset = -10; // Section top will be 10px above viewport (slightly past)

      if (shouldLock && !isLocked) {
        // Snap to position where section top is at snapOffset (slightly above viewport)
        const idealScrollY = window.scrollY + rect.top - snapOffset;
        
        setIsLocked(true);
        scrollPositionRef.current = idealScrollY;
        // Snap so section top is just past viewport top
        window.scrollTo(0, idealScrollY);
        document.documentElement.classList.add('scroll-locked');
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
    };
  }, [isLocked, options.lockThreshold, options.enabled, options.headerOffset]);

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

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
  
  // Refs to avoid dependency array issues
  const onProgressRef = useRef(options.onProgress);
  const touchStartYRef = useRef(0);
  const scrollPositionRef = useRef(0);
  const releaseCooldownRef = useRef(false);
  const isCompleteRef = useRef(options.isComplete);
  const canReverseExitRef = useRef(options.canReverseExit ?? false);
  
  // Keep refs updated
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

    const handleWheel = (e: WheelEvent) => {
      if (!isLocked) return;
      e.preventDefault();
      e.stopPropagation();
      const direction = e.deltaY > 0 ? 'down' : 'up';
      onProgressRef.current(e.deltaY, direction);
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
      onProgressRef.current(delta, direction);
    };

    const handleScroll = () => {
      // Don't check during cooldown
      if (releaseCooldownRef.current) return;
      
      const section = sectionRef.current;
      if (!section) return;

      const rect = section.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const headerOffset = options.headerOffset ?? 60;
      
      // Lock when section is approaching viewport top with headerOffset breathing room
      const shouldLock = rect.top <= headerOffset && 
                         rect.bottom > viewportHeight * 0.3 && 
                         !isCompleteRef.current;

      if (shouldLock && !isLocked) {
        setIsLocked(true);
        // Calculate ideal scroll position where header has breathing room
        const idealScrollY = window.scrollY + rect.top - headerOffset;
        scrollPositionRef.current = idealScrollY;
        // Snap to ideal position immediately for bulletproof positioning
        window.scrollTo(0, idealScrollY);
        document.documentElement.classList.add('scroll-locked');
      }
    };
    
    // Attach listeners
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
  }, [isLocked, options.lockThreshold, options.enabled]);

  // Separate effect for release logic
  useEffect(() => {
    if (options.isComplete && isLocked) {
      // Release lock
      setIsLocked(false);
      
      // Set cooldown to prevent immediate re-lock
      releaseCooldownRef.current = true;
      
      // Remove scroll lock class
      document.documentElement.classList.remove('scroll-locked');
      
      // Restore scroll position after a frame
      requestAnimationFrame(() => {
        window.scrollTo(0, scrollPositionRef.current);
        
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

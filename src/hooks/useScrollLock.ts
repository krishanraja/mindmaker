import { useState, useEffect, useRef, RefObject } from 'react';

interface UseScrollLockOptions {
  lockThreshold: number;
  onProgress: (delta: number) => void;
  isComplete: boolean;
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
  
  // Keep refs updated
  useEffect(() => {
    onProgressRef.current = options.onProgress;
  }, [options.onProgress]);
  
  useEffect(() => {
    isCompleteRef.current = options.isComplete;
  }, [options.isComplete]);

  useEffect(() => {
    const enabled = options.enabled ?? true;
    if (!enabled) return;

    const handleWheel = (e: WheelEvent) => {
      if (!isLocked) return;
      e.preventDefault();
      e.stopPropagation();
      onProgressRef.current(e.deltaY);
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
      onProgressRef.current(delta);
    };

    const handleScroll = () => {
      // Don't check during cooldown
      if (releaseCooldownRef.current) return;
      
      const section = sectionRef.current;
      if (!section) return;

      const rect = section.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      
      const shouldLock = rect.top <= 0 && 
                         rect.bottom > viewportHeight * 0.3 && 
                         !isCompleteRef.current;

      if (shouldLock && !isLocked) {
        setIsLocked(true);
        scrollPositionRef.current = window.scrollY;
        document.body.style.overflow = 'hidden';
        document.body.style.position = 'fixed';
        document.body.style.top = `-${scrollPositionRef.current}px`;
        document.body.style.width = '100%';
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
      
      // Reset body styles
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      
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
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
    };
  }, []);

  return { sectionRef, isLocked };
};

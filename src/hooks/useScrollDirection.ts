/**
 * @file useScrollDirection Hook
 * @description Tracks scroll direction using requestAnimationFrame for performance.
 *              Returns isHidden boolean for header hide/reveal behavior.
 * @dependencies None (standalone hook)
 * @returns { isHidden: boolean }
 * 
 * Usage:
 *   const { isHidden } = useScrollDirection({ threshold: 10 });
 *   // Apply transform: translateY(${isHidden ? '-100%' : '0'}) to header
 * 
 * Options:
 *   - threshold: Minimum scroll distance to trigger direction change (default: 10px)
 *   - disabled: Disable scroll tracking (e.g., when mobile menu is open)
 */

import { useState, useEffect, useRef, useCallback } from 'react';

interface UseScrollDirectionOptions {
  /** Minimum scroll distance to trigger direction change (default: 10px) */
  threshold?: number;
  /** Disable scroll tracking (e.g., when mobile menu is open) */
  disabled?: boolean;
}

export const useScrollDirection = (options: UseScrollDirectionOptions = {}) => {
  const { threshold = 10, disabled = false } = options;
  
  const [isHidden, setIsHidden] = useState(false);
  const lastScrollY = useRef(0);
  const ticking = useRef(false);

  const updateScrollDirection = useCallback(() => {
    const scrollY = window.scrollY;
    const diff = scrollY - lastScrollY.current;
    
    // Only update if we've scrolled past threshold
    if (Math.abs(diff) < threshold) {
      ticking.current = false;
      return;
    }
    
    // At top of page, always show
    if (scrollY < threshold) {
      setIsHidden(false);
    } else if (diff > 0) {
      // Scrolling down
      setIsHidden(true);
    } else {
      // Scrolling up
      setIsHidden(false);
    }
    
    lastScrollY.current = scrollY;
    ticking.current = false;
  }, [threshold]);

  useEffect(() => {
    if (disabled) return;
    
    const handleScroll = () => {
      if (!ticking.current) {
        requestAnimationFrame(updateScrollDirection);
        ticking.current = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [disabled, updateScrollDirection]);

  return { isHidden };
};

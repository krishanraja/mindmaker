import { useState, useEffect, useRef } from 'react';

interface UseScrollTriggerOptions {
  threshold?: number;
  rootMargin?: string;
}

export const useScrollTrigger = (options: UseScrollTriggerOptions = {}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [hasTriggered, setHasTriggered] = useState(false);
  const elementRef = useRef<HTMLElement>(null);
  
  const { threshold = 0.3, rootMargin = '0px' } = options;

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasTriggered) {
          // Add delay for surprise effect
          setTimeout(() => {
            setIsVisible(true);
            setHasTriggered(true);
          }, 500);
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(element);

    return () => {
      observer.unobserve(element);
    };
  }, [threshold, rootMargin, hasTriggered]);

  const resetTrigger = () => {
    setHasTriggered(false);
    setIsVisible(false);
  };

  return { elementRef, isVisible, hasTriggered, resetTrigger };
};
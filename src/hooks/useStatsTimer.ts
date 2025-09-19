import { useEffect, useRef, useCallback } from 'react';

interface StatConfig {
  key: string;
  updateInterval: number; // milliseconds
  callback: () => void;
}

interface UseStatsTimerOptions {
  isActive: boolean;
  configs: StatConfig[];
}

export const useStatsTimer = ({ isActive, configs }: UseStatsTimerOptions) => {
  const intervalRefs = useRef<Map<string, NodeJS.Timeout>>(new Map());

  const clearAllIntervals = useCallback(() => {
    intervalRefs.current.forEach((intervalId) => {
      clearInterval(intervalId);
    });
    intervalRefs.current.clear();
  }, []);

  const startTimer = useCallback((config: StatConfig) => {
    // Clear existing interval for this stat if any
    const existingInterval = intervalRefs.current.get(config.key);
    if (existingInterval) {
      clearInterval(existingInterval);
    }

    // Start new interval
    const intervalId = setInterval(() => {
      config.callback();
    }, config.updateInterval);

    intervalRefs.current.set(config.key, intervalId);
  }, []);

  const stopTimer = useCallback((key: string) => {
    const intervalId = intervalRefs.current.get(key);
    if (intervalId) {
      clearInterval(intervalId);
      intervalRefs.current.delete(key);
    }
  }, []);

  // Main effect to manage all timers
  useEffect(() => {
    if (isActive) {
      // Start all configured timers
      configs.forEach((config) => {
        startTimer(config);
      });
    } else {
      // Clear all timers when inactive
      clearAllIntervals();
    }

    // Cleanup on unmount or dependency change
    return () => {
      clearAllIntervals();
    };
  }, [isActive, configs, startTimer, clearAllIntervals]);

  return {
    startTimer,
    stopTimer,
    clearAllIntervals
  };
};

export const getTimeBasedInterval = (baseInterval: number): number => {
  const now = new Date();
  const hour = now.getHours();
  const day = now.getDay(); // 0 = Sunday, 6 = Saturday
  
  let multiplier = 1;
  
  // Business hours (9 AM - 5 PM) get faster updates
  if (hour >= 9 && hour <= 17) {
    multiplier = 0.3; // 70% faster
  }
  
  // Peak hours (10 AM - 2 PM) get even faster
  if (hour >= 10 && hour <= 14) {
    multiplier = 0.2; // 80% faster
  }
  
  // Evening hours (6 PM - 11 PM) are moderately slower but still active
  if (hour >= 18 && hour <= 23) {
    multiplier = 0.8; // Only 20% slower
  }
  
  // Late night/early morning (12 AM - 8 AM) are slower but not too slow
  if (hour >= 0 && hour <= 8) {
    multiplier = 1.2; // Only 20% slower
  }
  
  // Weekends are slightly slower but still active
  if (day === 0 || day === 6) {
    multiplier *= 1.2;
  }
  
  // Ensure minimum responsiveness - never slower than 1.5x base interval
  return Math.min(Math.max(baseInterval * multiplier, baseInterval * 0.15), baseInterval * 1.5);
};

// Utility function to add realistic randomization
export const addRandomVariation = (baseValue: number, variationPercent: number = 25): number => {
  const variation = baseValue * (variationPercent / 100);
  const randomOffset = (Math.random() - 0.5) * 2 * variation;
  return Math.round(baseValue + randomOffset);
};
import { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import { useStatsTimer, getTimeBasedInterval, addRandomVariation } from './useStatsTimer';
import { useOpenAIContext } from './useOpenAIContext';

interface CounterState {
  aiTrainingSearches: number;
  aiReplaceSearches: number;
  unpreparedPercentage: number;
}

interface CounterData {
  key: string;
  value: number;
  label: string;
  icon: any;
  color: string;
  bgColor: string;
  pulse: boolean;
  suffix?: string;
}

interface UseRealisticCountersOptions {
  isVisible: boolean;
}

const STORAGE_KEY = 'realistic_counters_state';
const HOURLY_RESET_KEY = 'last_hourly_reset';

// Base realistic starting values
const getInitialCounters = (): CounterState => {
  const now = new Date();
  const hour = now.getHours();
  const isWeekend = now.getDay() === 0 || now.getDay() === 6;
  
  // Adjust base values based on time
  const weekendMultiplier = isWeekend ? 0.6 : 1;
  const hourMultiplier = hour >= 9 && hour <= 17 ? 1.2 : 0.7;
  
  return {
    aiTrainingSearches: Math.round(2847 * weekendMultiplier * hourMultiplier),
    aiReplaceSearches: Math.round((800 + Math.random() * 700) * weekendMultiplier * hourMultiplier),
    unpreparedPercentage: 73.2 + (Math.random() * 2 - 1) // ±1% variation
  };
};

export const useRealisticCounters = ({ isVisible }: UseRealisticCountersOptions) => {
  const { marketSentiment } = useOpenAIContext();
  const [counters, setCounters] = useState<CounterState>(getInitialCounters);
  const lastUpdateTime = useRef<number>(Date.now());
  const hourlyResetRef = useRef<number>(new Date().getHours());

  // Load and save state from localStorage
  const loadSavedState = useCallback((): CounterState | null => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        const age = Date.now() - parsed.timestamp;
        
        // If data is less than 10 minutes old, use it
        if (age < 10 * 60 * 1000) {
          return parsed.counters;
        }
      }
    } catch (error) {
      console.error('Error loading saved counter state:', error);
    }
    return null;
  }, []);

  const saveState = useCallback((state: CounterState) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        counters: state,
        timestamp: Date.now()
      }));
    } catch (error) {
      console.error('Error saving counter state:', error);
    }
  }, []);

  // Check for hourly reset
  const checkHourlyReset = useCallback(() => {
    const currentHour = new Date().getHours();
    const lastResetHour = parseInt(localStorage.getItem(HOURLY_RESET_KEY) || '0');
    
    if (currentHour !== lastResetHour) {
      console.log('Hourly reset triggered');
      localStorage.setItem(HOURLY_RESET_KEY, currentHour.toString());
      
      // Reset aiReplaceSearches with new hourly baseline
      setCounters(prev => ({
        ...prev,
        aiReplaceSearches: Math.round(800 + Math.random() * 700)
      }));
    }
  }, []);

  // Calculate realistic increments for AI Training Searches
  const updateAiTrainingSearches = useCallback(() => {
    const now = Date.now();
    const timeSinceLastUpdate = now - lastUpdateTime.current;
    lastUpdateTime.current = now;
    
    const currentTime = new Date();
    const hour = currentTime.getHours();
    const isWeekend = currentTime.getDay() === 0 || currentTime.getDay() === 6;
    
    // Determine base increment (larger for visual impact)
    let baseIncrement = 120;
    
    if (hour >= 9 && hour <= 11 || hour >= 14 && hour <= 16 || hour >= 19 && hour <= 21) {
      // Peak hours
      baseIncrement *= 2.5;
    } else if (hour >= 9 && hour <= 17) {
      // Business hours
      baseIncrement *= 1.8;
    } else if (hour >= 6 && hour <= 23) {
      // Regular hours
      baseIncrement *= 1.2;
    } else {
      // Late night/early morning
      baseIncrement *= 0.6;
    }
    
    // Apply weekend multiplier
    if (isWeekend) {
      baseIncrement *= 0.7;
    }
    
    // Apply OpenAI market sentiment
    baseIncrement *= marketSentiment.trainingInterestMultiplier;
    
    // Add realistic randomization (±50%)
    const increment = Math.max(0, addRandomVariation(baseIncrement, 50));
    
    // Debug logging
    if (process.env.NODE_ENV === 'development') {
      console.log(`🧠 AI Training update: +${Math.round(increment)} (multiplier: ${marketSentiment.trainingInterestMultiplier.toFixed(2)})`);
    }
    
    setCounters(prev => ({
      ...prev,
      aiTrainingSearches: prev.aiTrainingSearches + Math.round(increment)
    }));
  }, [marketSentiment.trainingInterestMultiplier]);

  // Calculate realistic increments for AI Replace Searches
  const updateAiReplaceSearches = useCallback(() => {
    const currentTime = new Date();
    const hour = currentTime.getHours();
    const isWeekend = currentTime.getDay() === 0 || currentTime.getDay() === 6;
    
    // Base increment - larger for visual impact
    let baseIncrement = 50;
    
    // Peak anxiety times
    if (hour >= 9 && hour <= 17) {
      // Business hours - higher anxiety
      baseIncrement *= 2.2;
    } else if (hour >= 6 && hour <= 22) {
      // Regular hours
      baseIncrement *= 1.5;
    } else {
      // Late night - still some activity
      baseIncrement *= 0.8;
    }
    
    // Apply weekend multiplier
    if (isWeekend) {
      baseIncrement *= 0.7;
    }
    
    // Apply OpenAI market sentiment (anxiety multiplier)
    baseIncrement *= marketSentiment.aiAnxietyMultiplier;
    
    // Add high randomization for anxiety bursts
    const increment = Math.max(0, addRandomVariation(baseIncrement, 70));
    
    // Sometimes no searches (10% chance, reduced from higher)
    if (Math.random() < 0.1) {
      return;
    }
    
    // Debug logging
    if (process.env.NODE_ENV === 'development') {
      console.log(`😰 AI Replace update: +${Math.round(increment)} (multiplier: ${marketSentiment.aiAnxietyMultiplier.toFixed(2)})`);
    }
    
    setCounters(prev => ({
      ...prev,
      aiReplaceSearches: prev.aiReplaceSearches + Math.round(increment)
    }));
  }, [marketSentiment.aiAnxietyMultiplier]);

  // Calculate realistic changes for Unprepared Percentage
  const updateUnpreparedPercentage = useCallback(() => {
    const currentTime = new Date();
    const hour = currentTime.getHours();
    
    // Very slow increase during business hours, almost no change otherwise
    if (hour >= 9 && hour <= 17) {
      const increment = Math.random() < 0.15 ? 0.01 : 0;
      setCounters(prev => ({
        ...prev,
        unpreparedPercentage: Math.min(85, prev.unpreparedPercentage + increment)
      }));
    }
  }, []);

  // Initialize counters from saved state or defaults
  useEffect(() => {
    const savedState = loadSavedState();
    if (savedState) {
      console.log('Loaded saved counter state');
      setCounters(savedState);
    }
    checkHourlyReset();
  }, []); // Empty dependency - only run once on mount

  // Save state whenever counters change
  useEffect(() => {
    saveState(counters);
  }, [counters, saveState]);

  // Set up timers with consistent 1-2 second intervals for visual impact
  // Memoize to prevent recreation on every render
  const timerConfigs = useMemo(() => [
    {
      key: 'aiTrainingSearches',
      updateInterval: 1000, // 1 second for real-time visual updates
      callback: updateAiTrainingSearches
    },
    {
      key: 'aiReplaceSearches',
      updateInterval: 1000, // 1 second for real-time visual updates
      callback: updateAiReplaceSearches
    },
    {
      key: 'unpreparedPercentage',
      updateInterval: 120000, // 2 minutes (reduced from 3)
      callback: updateUnpreparedPercentage
    },
    {
      key: 'hourlyCheck',
      updateInterval: 60000, // 1 minute
      callback: checkHourlyReset
    }
  ], [updateAiTrainingSearches, updateAiReplaceSearches, updateUnpreparedPercentage, checkHourlyReset]);

  useStatsTimer({
    isActive: isVisible,
    configs: timerConfigs
  });

  // Format numbers for display - stat-specific formatting for real-time impact
  const formatNumber = useCallback((num: number): string => {
    return num.toLocaleString();
  }, []);

  // Return formatted counter data
  const getCounterData = useCallback((): CounterData[] => [
    {
      key: 'aiTrainingSearches',
      value: Math.round(counters.aiTrainingSearches),
      label: 'AI training searches now',
      icon: 'Search', // Will be mapped to actual icon in component
      color: 'text-destructive',
      bgColor: 'bg-destructive/10',
      pulse: true
    },
    {
      key: 'aiReplaceSearches',
      value: Math.round(counters.aiReplaceSearches),
      label: '"Will AI replace me" searches',
      icon: 'Search',
      color: 'text-primary',
      bgColor: 'bg-primary/10',
      pulse: true
    },
    {
      key: 'unpreparedPercentage',
      value: Math.round(counters.unpreparedPercentage),
      label: 'Workers unprepared for AI',
      icon: 'Brain',
      color: 'text-accent',
      bgColor: 'bg-accent/10',
      pulse: false,
      suffix: '%'
    }
  ], [counters]);

  // Memoize counterData to prevent unnecessary re-renders
  const counterData = useMemo(() => getCounterData(), [counters, getCounterData]);

  return {
    counters,
    counterData,
    formatNumber,
    marketSentiment
  };
};
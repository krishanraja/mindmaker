import { useState, useCallback } from 'react';

export interface FrictionMapData {
  problem: string;
  currentState: string;
  aiEnabledState: string;
  timeSaved: number;
  toolRecommendations: string[];
  generatedAt: Date;
}

export const useFrictionMap = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [frictionMap, setFrictionMap] = useState<FrictionMapData | null>(null);

  const generateFrictionMap = useCallback(async (problem: string) => {
    setIsGenerating(true);
    
    // Simulate AI generation (in production, this would call Lovable AI)
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const hoursPerWeek = Math.floor(Math.random() * 4) + 3; // 3-6 hours
    
    const map: FrictionMapData = {
      problem,
      currentState: `Manual ${problem.toLowerCase()} process - time-intensive, error-prone, relies on individual expertise`,
      aiEnabledState: `AI-assisted system with automation, validation, and insights built-in`,
      timeSaved: hoursPerWeek,
      toolRecommendations: [
        'Claude/ChatGPT for initial analysis',
        'Custom GPT for your specific workflow',
        'Zapier/Make.com for automation',
      ],
      generatedAt: new Date(),
    };
    
    setFrictionMap(map);
    setIsGenerating(false);
    
    // Save to localStorage
    localStorage.setItem('mindmaker-friction-map', JSON.stringify(map));
    
    return map;
  }, []);

  const clearFrictionMap = useCallback(() => {
    setFrictionMap(null);
    localStorage.removeItem('mindmaker-friction-map');
  }, []);

  return {
    frictionMap,
    isGenerating,
    generateFrictionMap,
    clearFrictionMap,
  };
};

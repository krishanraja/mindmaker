import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface NewsHeadline {
  title: string;
  source: string;
}

interface AINewsResponse {
  headlines: NewsHeadline[];
  timestamp: string;
  fallback?: boolean;
}

const CACHE_KEY = 'ai_news_cache';
const CACHE_DURATION = 15 * 60 * 1000; // 15 minutes

const FALLBACK_HEADLINES: NewsHeadline[] = [
  { title: "GPT-5 demonstrates breakthrough in reasoning and planning", source: "OpenAI" },
  { title: "Gemini 3.0 Pro achieves new benchmark in multimodal AI", source: "Google DeepMind" },
  { title: "Claude 4 sets new standard for AI safety and accuracy", source: "Anthropic" },
  { title: "Microsoft Copilot integration drives enterprise productivity gains", source: "Microsoft" },
  { title: "Meta's Llama 4 challenges proprietary AI models", source: "Meta AI" },
  { title: "AI adoption surges across Fortune 500 with 80% implementation rate", source: "Industry Report" },
  { title: "Midjourney V7 revolutionizes creative AI with photorealistic generation", source: "Midjourney" },
  { title: "Amazon Bedrock expands AI capabilities for enterprises", source: "AWS" },
  { title: "AI agents automate complex workflows across industries", source: "McKinsey Research" },
  { title: "Regulatory frameworks evolve as AI deployment accelerates", source: "Policy Update" },
  { title: "NVIDIA announces next-gen chips for enterprise AI workloads", source: "NVIDIA" },
  { title: "EU AI Act implementation begins with compliance deadlines set", source: "European Commission" },
  { title: "AI-powered fraud detection reduces financial losses by 60%", source: "Finance Today" },
  { title: "Healthcare AI diagnostic accuracy surpasses human specialists", source: "Medical Journal" },
  { title: "Enterprise AI spending projected to reach $300B by 2026", source: "Gartner" },
  { title: "AI security vulnerabilities prompt new safety standards", source: "Cybersecurity Report" },
  { title: "Fortune 500 CEOs cite AI literacy as top strategic priority", source: "Executive Survey" },
  { title: "AI talent war intensifies with median salaries exceeding $200K", source: "Tech Hiring" },
  { title: "Major AI acquisitions reshape competitive landscape", source: "M&A Analysis" },
  { title: "Quantum-AI hybrid systems show promise for drug discovery", source: "Nature Research" }
];

export const useAINewsTicker = () => {
  const [headlines, setHeadlines] = useState<NewsHeadline[]>(FALLBACK_HEADLINES);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        // Check cache first
        const cached = localStorage.getItem(CACHE_KEY);
        if (cached) {
          const { data, timestamp } = JSON.parse(cached);
          const age = Date.now() - timestamp;
          
          if (age < CACHE_DURATION) {
            console.log('Using cached AI news');
            setHeadlines(data.headlines);
            return;
          }
        }

        // Fetch fresh headlines in background
        console.log('Fetching fresh AI news in background...');
        const { data, error: fetchError } = await supabase.functions.invoke('get-ai-news');

        if (fetchError) {
          console.error('Error fetching AI news:', fetchError);
          throw fetchError;
        }

        const newsData = data as AINewsResponse;
        
        // Seamlessly update headlines
        setHeadlines(newsData.headlines);
        
        // Cache the results
        localStorage.setItem(CACHE_KEY, JSON.stringify({
          data: newsData,
          timestamp: Date.now()
        }));

      } catch (err) {
        console.error('Error in useAINewsTicker:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch news');
        // Keep showing fallback headlines on error
      }
    };

    fetchNews();
  }, []);

  return { headlines, isLoading, error };
};

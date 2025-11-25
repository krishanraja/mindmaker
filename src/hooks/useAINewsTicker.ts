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
const CACHE_DURATION = 60 * 60 * 1000; // 1 hour

export const useAINewsTicker = () => {
  const [headlines, setHeadlines] = useState<NewsHeadline[]>([]);
  const [isLoading, setIsLoading] = useState(true);
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
            setIsLoading(false);
            return;
          }
        }

        console.log('Fetching fresh AI news...');
        const { data, error: fetchError } = await supabase.functions.invoke('get-ai-news');

        if (fetchError) {
          console.error('Error fetching AI news:', fetchError);
          throw fetchError;
        }

        const newsData = data as AINewsResponse;
        setHeadlines(newsData.headlines);
        
        // Cache the results
        localStorage.setItem(CACHE_KEY, JSON.stringify({
          data: newsData,
          timestamp: Date.now()
        }));

        setIsLoading(false);
      } catch (err) {
        console.error('Error in useAINewsTicker:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch news');
        
        // Use fallback headlines
        const fallbackHeadlines: NewsHeadline[] = [
          { title: "OpenAI announces major advancement in reasoning capabilities", source: "OpenAI" },
          { title: "Google DeepMind's Gemini 2.0 achieves breakthrough performance", source: "Google DeepMind" },
          { title: "Anthropic's Claude 4 sets new standard for AI safety", source: "Anthropic" },
          { title: "Microsoft integrates advanced AI across enterprise suite", source: "Microsoft" },
          { title: "Meta releases open-source model rivaling proprietary systems", source: "Meta AI" },
          { title: "AI adoption accelerates across Fortune 500 companies", source: "Industry Report" }
        ];
        
        setHeadlines(fallbackHeadlines);
        setIsLoading(false);
      }
    };

    fetchNews();
  }, []);

  return { headlines, isLoading, error };
};

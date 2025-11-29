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
  { title: "[HOT TAKE] Most AI pilots fail because they solve vendor problems, not yours", source: "Operator Intel" },
  { title: "[SIGNAL] EU AI Act compliance deadlines forcing enterprise re-architecture", source: "Policy Watch" },
  { title: "[OPERATOR] 3 AI workflows that paid back in 30 days - and 5 that never will", source: "Operator Intel" },
  { title: "[WATCH] AI talent costs falling as supply catches up - hiring window opening", source: "Talent Market" },
  { title: "[HOT TAKE] The 'AI strategy deck' industry is worth $0 to your P&L", source: "Operator Intel" },
  { title: "[SIGNAL] OpenAI enterprise pricing signals end of cheap experimentation era", source: "Pricing Analysis" },
  { title: "[OPERATOR] Why your AI vendor demo worked but production deployment failed", source: "Operator Intel" },
  { title: "[WATCH] Healthcare AI approval bottleneck creating competitive moats", source: "FDA Watch" },
  { title: "[HOT TAKE] 90% of 'AI-powered' enterprise software is wrapper marketing", source: "Operator Intel" },
  { title: "[SIGNAL] Google Cloud AI credits expiring - expect enterprise churn wave", source: "Cloud Intel" },
  { title: "[OPERATOR] The 4-hour AI build that replaced a $50K SaaS contract", source: "Operator Intel" },
  { title: "[WATCH] China AI chip workarounds outpacing export controls", source: "Geopolitics" },
  { title: "[HOT TAKE] AI literacy > AI tools. Most leaders have it backwards", source: "Operator Intel" },
  { title: "[SIGNAL] Microsoft Copilot adoption stalling in enterprises without AI training", source: "Enterprise Data" },
  { title: "[OPERATOR] Fine-tuned small models beating GPT-4 for specific business tasks", source: "Operator Intel" },
  { title: "[WATCH] AI-native startups eating into consulting firm revenue", source: "Market Shift" },
  { title: "[HOT TAKE] Your AI vendor's roadmap is their strategy, not yours", source: "Operator Intel" },
  { title: "[SIGNAL] Insurance industry AI claims processing hitting 80%+ automation", source: "Industry Report" },
  { title: "[OPERATOR] The real cost of 'free' AI tools - data lock-in and switching pain", source: "Operator Intel" },
  { title: "[WATCH] SEC scrutiny of AI-related earnings claims increasing", source: "Regulatory" }
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

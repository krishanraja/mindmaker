import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface NewsHeadline {
  title: string;
  source: string;
}

interface AINewsResponse {
  headlines: NewsHeadline[];
  timestamp: string;
  provider?: 'lovable' | 'openai' | 'fallback';
  fallback?: boolean;
}

const CACHE_KEY = 'ai_news_cache';
const CACHE_DURATION = 15 * 60 * 1000; // 15 minutes

const FALLBACK_HEADLINES: NewsHeadline[] = [
  { title: "Claude 4 beats SDRs at cold email writing", source: "Model Report" },
  { title: "Prompt engineer salaries down 40% as tools simplify", source: "Workforce Watch" },
  { title: "Vibe-coded CRM replaces Salesforce at 50-person co", source: "Builder Daily" },
  { title: "GPT-5 passes bar exam, 12K paralegals at risk", source: "The Shift" },
  { title: "New job: AI Output Editor. 50K openings by 2026", source: "Workforce Watch" },
  { title: "Gemini 3 Pro generates production React in one shot", source: "Model Report" },
  { title: "3-person team ships $2M ARR product using only AI", source: "Builder Daily" },
  { title: "Customer support teams shrink 60% industry-wide", source: "The Shift" },
  { title: "Cursor + Claude saves devs 20hrs/week", source: "Operator Intel" },
  { title: "AI Ops Manager: fastest growing role in tech 2026", source: "Workforce Watch" },
  { title: "Bookkeepers face 80% job loss by end of 2026", source: "The Shift" },
  { title: "Lovable hits 100K apps built, avg time: 4 hours", source: "Builder Daily" },
  { title: "Mistral Large 3 beats GPT-4 on coding benchmarks", source: "Model Report" },
  { title: "Marketing teams now 2 people + AI, not 12", source: "The Shift" },
  { title: "Best hack: voice memos to action items via AI", source: "Operator Intel" },
  { title: "Junior dev hiring down 35% at Fortune 500", source: "Workforce Watch" },
  { title: "No-code founder builds $500K business in 6 months", source: "Builder Daily" },
  { title: "Data entry roles: 90% automated by Q2 2026", source: "The Shift" },
  { title: "Claude Artifacts now rival Figma for quick mockups", source: "Model Report" },
  { title: "AI fluency now required for 40% of job postings", source: "Workforce Watch" }
];

// Safe cache loading with validation
const loadCache = (): AINewsResponse | null => {
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    if (!cached) return null;
    
    const parsed = JSON.parse(cached);
    const { data, timestamp } = parsed;
    
    // Validate cache structure
    if (!data?.headlines || !Array.isArray(data.headlines) || data.headlines.length === 0) {
      console.warn('Invalid cache structure, clearing');
      localStorage.removeItem(CACHE_KEY);
      return null;
    }
    
    // Check cache age
    if (Date.now() - timestamp > CACHE_DURATION) {
      console.log('Cache expired');
      return null;
    }
    
    return data;
  } catch (err) {
    console.error('Cache read error:', err);
    localStorage.removeItem(CACHE_KEY); // Clear corrupted cache
    return null;
  }
};

export const useAINewsTicker = () => {
  const [headlines, setHeadlines] = useState<NewsHeadline[]>(FALLBACK_HEADLINES);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        // Check cache first
        const cachedData = loadCache();
        if (cachedData) {
          console.log('✅ Using cached AI news');
          if (cachedData.provider) {
            console.log(`Provider: ${cachedData.provider}`);
          }
          setHeadlines(cachedData.headlines);
          return;
        }

        // Fetch fresh headlines
        console.log('🔄 Fetching fresh AI news...');
        const { data, error: fetchError } = await supabase.functions.invoke('get-ai-news');

        if (fetchError) {
          console.error('Error fetching AI news:', fetchError);
          throw fetchError;
        }

        const newsData = data as AINewsResponse;
        
        // Log provider info
        if (newsData.provider) {
          console.log(`✅ AI News Provider: ${newsData.provider}`);
        }
        if (newsData.fallback) {
          console.warn('⚠️ Using fallback headlines');
        }
        
        // Validate response
        if (!newsData.headlines || newsData.headlines.length === 0) {
          console.warn('Empty headlines received, keeping fallback');
          return;
        }
        
        // Update headlines
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

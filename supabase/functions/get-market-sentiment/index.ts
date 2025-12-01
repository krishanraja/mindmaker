import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface MarketSentimentResponse {
  aiAnxietyMultiplier: number;
  trainingInterestMultiplier: number;
  newsContext: string;
  timestamp: number;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const requestId = Math.random().toString(36).substring(7);
  console.log(`[${requestId}] ===== MARKET SENTIMENT REQUEST START =====`);

  try {
    const openaiApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openaiApiKey) {
      console.error(`[${requestId}] OPENAI_API_KEY not configured`);
      throw new Error('OpenAI API key not configured');
    }

    console.log(`[${requestId}] Requesting market sentiment from OpenAI...`);

    const prompt = `Based on current AI and job market trends today (${new Date().toISOString().split('T')[0]}), analyze the sentiment and provide a JSON response with:

1. aiAnxietyMultiplier (0.7-1.5): How anxious people currently are about AI replacing jobs
   - 0.7-0.9: Low anxiety (positive AI news, job growth)
   - 0.9-1.1: Normal anxiety levels
   - 1.1-1.5: High anxiety (layoffs, negative AI coverage)

2. trainingInterestMultiplier (0.8-1.4): Current interest level in AI training/upskilling
   - 0.8-0.9: Lower interest (market stability)
   - 0.9-1.1: Normal interest levels
   - 1.1-1.4: High interest (uncertainty, skill gaps)

3. newsContext (string): Brief 1-sentence context explaining the adjustment

Consider factors like:
- Recent tech layoffs or hiring announcements
- New AI product launches or capabilities
- Government AI policies or regulations
- Economic indicators affecting job market
- Educational institution AI program announcements

Respond ONLY with valid JSON in this exact format:
{"aiAnxietyMultiplier": 1.2, "trainingInterestMultiplier": 1.1, "newsContext": "Recent layoffs in tech sector increasing AI replacement concerns"}`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { 
            role: 'system', 
            content: 'You are an expert market analyst specializing in AI adoption and workforce trends. Provide accurate, data-driven sentiment analysis.' 
          },
          { role: 'user', content: prompt }
        ],
        max_tokens: 200,
        temperature: 0.3,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    const aiResponse = data.choices[0]?.message?.content;

    if (!aiResponse) {
      throw new Error('No response from OpenAI');
    }

    console.log('Raw OpenAI response:', aiResponse);

    // Parse the JSON response
    let marketSentiment: MarketSentimentResponse;
    try {
      const parsed = JSON.parse(aiResponse.trim());
      marketSentiment = {
        aiAnxietyMultiplier: Math.max(0.7, Math.min(1.5, parsed.aiAnxietyMultiplier || 1.0)),
        trainingInterestMultiplier: Math.max(0.8, Math.min(1.4, parsed.trainingInterestMultiplier || 1.0)),
        newsContext: parsed.newsContext || 'Current market conditions influencing AI adoption trends',
        timestamp: Date.now()
      };
    } catch (parseError) {
      console.error('Failed to parse OpenAI response:', parseError);
      // Fallback to neutral values
      marketSentiment = {
        aiAnxietyMultiplier: 1.0,
        trainingInterestMultiplier: 1.0,
        newsContext: 'Standard market conditions',
        timestamp: Date.now()
      };
    }

    console.log(`[${requestId}] Processed market sentiment:`, marketSentiment);
    console.log(`[${requestId}] ===== MARKET SENTIMENT REQUEST SUCCESS =====`);

    return new Response(JSON.stringify(marketSentiment), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error(`[${requestId}] ===== MARKET SENTIMENT REQUEST ERROR =====`);
    console.error(`[${requestId}] Error:`, error);
    
    // Return fallback neutral sentiment on error
    const fallbackSentiment = {
      aiAnxietyMultiplier: 1.0,
      trainingInterestMultiplier: 1.0,
      newsContext: 'Unable to fetch current market data',
      timestamp: Date.now()
    };

    return new Response(JSON.stringify(fallbackSentiment), {
      status: 200, // Return 200 so app doesn't break
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
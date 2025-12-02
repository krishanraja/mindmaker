import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface NewsHeadline {
  title: string;
  source: string;
}

interface Provider {
  name: 'newsapi' | 'lovable' | 'openai' | 'fallback';
  key?: string;
}

// Provider cascade: NewsAPI → Lovable AI → OpenAI → Static Fallback
const getProvider = (): Provider => {
  const NEWSAPI_KEY = Deno.env.get('NEWSAPI_KEY');
  const LOVABLE_KEY = Deno.env.get('LOVABLE_API_KEY');
  const OPENAI_KEY = Deno.env.get('OPENAI_API_KEY');
  
  if (NEWSAPI_KEY) {
    console.log('✅ Using NewsAPI.org (Plan A - Real News)');
    return { name: 'newsapi', key: NEWSAPI_KEY };
  }
  
  if (LOVABLE_KEY) {
    console.log('⚠️ NewsAPI unavailable, using LOVABLE AI (Plan B)');
    return { name: 'lovable', key: LOVABLE_KEY };
  }
  
  if (OPENAI_KEY) {
    console.log('⚠️ NewsAPI & Lovable unavailable, using OPENAI (Plan C)');
    return { name: 'openai', key: OPENAI_KEY };
  }
  
  console.error('❌ No API keys available, returning static fallback (Plan D)');
  return { name: 'fallback' };
};

const AI_SYSTEM_PROMPT = `You are a business news analyst for C-level executives. Generate REAL, CREDIBLE news headlines about AI's impact on business TODAY.

CRITICAL RULES:
1. Headlines must sound like ACTUAL news from CURRENT business press
2. Be HYPER-SPECIFIC: Name real companies, sectors, concrete numbers when possible
3. Focus on BUSINESS IMPACT: strategy, operations, competition, workforce, ROI
4. Keep headlines CONCISE: 8-12 words maximum
5. Vary sources: WSJ, FT, Bloomberg, McKinsey, BCG, HBR, Gartner, MIT Tech Review
6. Mix sentiment: opportunities AND challenges/warnings
7. NO FLUFF - every headline must deliver concrete information
8. NO future tense - use present tense only
9. NO generic AI hype - be specific about what's actually happening

TOPICS TO COVER (pick 5-7 from these):
- Major companies announcing AI strategy shifts or investments
- Specific industries being disrupted with concrete examples
- C-suite roles evolving (CDO, CTO, CAIO emergence)
- Workforce transformation with real data (roles eliminated/created)
- AI regulation impacting business decisions
- Competitive advantage case studies with metrics
- ROI/productivity data from AI adoption
- Failed AI implementations and lessons learned
- Talent war for AI skills with salary data

FORMAT: Return ONLY a valid JSON array:
[{"title": "headline text here", "source": "Source Name"}]

QUALITY EXAMPLES:
"JPMorgan deploys AI to automate 50% of code review" - Bloomberg
"UK mandates AI impact assessments for 1000+ employee firms" - Financial Times
"Manufacturing sees 23% productivity gain from AI adoption" - McKinsey
"Goldman Sachs cuts 1,800 junior analyst roles after AI rollout" - WSJ
"Walmart's AI supply chain saves $2B annually" - Harvard Business Review`;

// Extract content from AI responses
const extractContent = (data: any): string | null => {
  try {
    return data?.choices?.[0]?.message?.content || null;
  } catch {
    return null;
  }
};

// Parse JSON from AI responses
const parseHeadlines = (content: string): NewsHeadline[] => {
  try {
    const parsed = JSON.parse(content);
    if (Array.isArray(parsed)) return parsed;
    if (parsed.headlines) return parsed.headlines;
    if (parsed.news) return parsed.news;
  } catch {}
  
  // Extract JSON from markdown code blocks
  const match = content.match(/\[[\s\S]*?\]/);
  if (match) {
    try { 
      return JSON.parse(match[0]); 
    } catch {}
  }
  
  return [];
};

// Validate headlines quality
const validateHeadlines = (headlines: any[]): NewsHeadline[] => {
  return headlines
    .filter(h => 
      h && 
      typeof h.title === 'string' && 
      h.title.length > 15 &&
      typeof h.source === 'string' && 
      h.source.length > 0
    )
    .slice(0, 10);
};

const STATIC_FALLBACK: NewsHeadline[] = [
  { title: "Microsoft reports 30% productivity gain from AI assistants", source: "Bloomberg" },
  { title: "Financial services automate 40% of compliance tasks", source: "Financial Times" },
  { title: "AI-driven supply chains reduce costs by $50B annually", source: "McKinsey" },
  { title: "Healthcare AI misdiagnosis rates prompt FDA review", source: "WSJ" },
  { title: "Fortune 500 CEOs prioritize AI literacy in 2025", source: "Harvard Business Review" },
  { title: "Retail chains deploy AI to optimize inventory management", source: "Gartner" },
  { title: "AI ethics officers become standard C-suite role", source: "MIT Tech Review" },
  { title: "Manufacturing adopts AI predictive maintenance at scale", source: "BCG" },
  { title: "Legal sector sees 25% of junior roles automated", source: "Financial Times" },
  { title: "Enterprise AI spending reaches $200B in 2024", source: "Gartner" }
];

// Fetch from NewsAPI.org
const fetchNewsAPI = async (apiKey: string): Promise<NewsHeadline[]> => {
  console.log('Fetching real news from NewsAPI.org...');
  
  const queries = [
    'artificial intelligence business',
    'AI enterprise adoption',
    'AI workplace transformation'
  ];
  
  const randomQuery = queries[Math.floor(Math.random() * queries.length)];
  
  const url = `https://newsapi.org/v2/everything?` + new URLSearchParams({
    q: randomQuery,
    language: 'en',
    sortBy: 'relevancy',
    pageSize: '10',
    apiKey: apiKey,
    domains: 'wsj.com,ft.com,bloomberg.com,hbr.org,technologyreview.com'
  });
  
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error(`NewsAPI error: ${response.status}`);
  }
  
  const data = await response.json();
  
  if (!data.articles || data.articles.length === 0) {
    throw new Error('No articles returned from NewsAPI');
  }
  
  const headlines: NewsHeadline[] = data.articles
    .filter((article: any) => article.title && article.source?.name)
    .map((article: any) => ({
      title: article.title.split(' - ')[0].trim(), // Remove source suffix if present
      source: article.source.name
    }))
    .slice(0, 8);
  
  console.log(`✅ Retrieved ${headlines.length} real news headlines`);
  return headlines;
};

// Fetch from AI providers (Lovable or OpenAI)
const fetchAIHeadlines = async (provider: 'lovable' | 'openai', apiKey: string): Promise<NewsHeadline[]> => {
  console.log(`Generating AI headlines via ${provider}...`);
  
  const config = provider === 'lovable' 
    ? {
        endpoint: 'https://ai.gateway.lovable.dev/v1/chat/completions',
        model: 'google/gemini-2.5-flash'
      }
    : {
        endpoint: 'https://api.openai.com/v1/chat/completions',
        model: 'gpt-4o-mini'
      };
  
  const response = await fetch(config.endpoint, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: config.model,
      messages: [
        { role: 'system', content: AI_SYSTEM_PROMPT },
        { 
          role: 'user', 
          content: `Generate 6 credible AI business news headlines for ${new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}. Focus on concrete business impact with specific companies or data points where possible.` 
        }
      ],
      temperature: 0.3,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error(`${provider} API error:`, response.status, errorText);
    throw new Error(`${provider} API error: ${response.status}`);
  }

  const data = await response.json();
  const content = extractContent(data);
  
  if (!content) {
    throw new Error('No content in AI response');
  }

  const headlines = parseHeadlines(content);
  const validHeadlines = validateHeadlines(headlines);

  if (validHeadlines.length === 0) {
    throw new Error('No valid headlines generated');
  }

  console.log(`✅ Generated ${validHeadlines.length} headlines via ${provider}`);
  return validHeadlines;
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const provider = getProvider();
    let headlines: NewsHeadline[] = [];
    let providerUsed = provider.name;
    let isFallback = false;
    
    // Plan A: NewsAPI
    if (provider.name === 'newsapi') {
      try {
        headlines = await fetchNewsAPI(provider.key!);
      } catch (error) {
        console.error('NewsAPI failed, attempting fallback:', error);
        
        // Fallback to Lovable AI
        const lovableKey = Deno.env.get('LOVABLE_API_KEY');
        if (lovableKey) {
          console.log('⚠️ Falling back to Lovable AI (Plan B)');
          try {
            headlines = await fetchAIHeadlines('lovable', lovableKey);
            providerUsed = 'lovable';
          } catch (lovableError) {
            console.error('Lovable AI also failed:', lovableError);
            
            // Fallback to OpenAI
            const openaiKey = Deno.env.get('OPENAI_API_KEY');
            if (openaiKey) {
              console.log('⚠️ Falling back to OpenAI (Plan C)');
              try {
                headlines = await fetchAIHeadlines('openai', openaiKey);
                providerUsed = 'openai';
              } catch (openaiError) {
                console.error('OpenAI also failed, using static fallback:', openaiError);
                headlines = STATIC_FALLBACK;
                providerUsed = 'fallback';
                isFallback = true;
              }
            } else {
              headlines = STATIC_FALLBACK;
              providerUsed = 'fallback';
              isFallback = true;
            }
          }
        } else {
          headlines = STATIC_FALLBACK;
          providerUsed = 'fallback';
          isFallback = true;
        }
      }
    }
    
    // Plan B: Lovable AI
    else if (provider.name === 'lovable') {
      try {
        headlines = await fetchAIHeadlines('lovable', provider.key!);
      } catch (error) {
        console.error('Lovable AI failed, attempting fallback:', error);
        
        const openaiKey = Deno.env.get('OPENAI_API_KEY');
        if (openaiKey) {
          console.log('⚠️ Falling back to OpenAI (Plan C)');
          try {
            headlines = await fetchAIHeadlines('openai', openaiKey);
            providerUsed = 'openai';
          } catch (openaiError) {
            console.error('OpenAI also failed, using static fallback:', openaiError);
            headlines = STATIC_FALLBACK;
            providerUsed = 'fallback';
            isFallback = true;
          }
        } else {
          headlines = STATIC_FALLBACK;
          providerUsed = 'fallback';
          isFallback = true;
        }
      }
    }
    
    // Plan C: OpenAI
    else if (provider.name === 'openai') {
      try {
        headlines = await fetchAIHeadlines('openai', provider.key!);
      } catch (error) {
        console.error('OpenAI failed, using static fallback:', error);
        headlines = STATIC_FALLBACK;
        providerUsed = 'fallback';
        isFallback = true;
      }
    }
    
    // Plan D: Static fallback
    else {
      console.log('📋 Using static fallback headlines (no API keys configured)');
      headlines = STATIC_FALLBACK;
      isFallback = true;
    }

    return new Response(
      JSON.stringify({
        headlines,
        timestamp: new Date().toISOString(),
        provider: providerUsed,
        fallback: isFallback,
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );

  } catch (error) {
    console.error('Fatal error, returning static fallback:', error);
    
    return new Response(
      JSON.stringify({
        headlines: STATIC_FALLBACK,
        timestamp: new Date().toISOString(),
        provider: 'fallback',
        fallback: true,
        error: error instanceof Error ? error.message : 'Unknown error',
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  }
});

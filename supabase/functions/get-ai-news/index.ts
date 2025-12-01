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
  name: 'lovable' | 'openai' | 'fallback';
  key?: string;
  endpoint?: string;
  model?: string;
}

// Provider cascade: Lovable AI → OpenAI → Fallback
const getProvider = (): Provider => {
  const LOVABLE_KEY = Deno.env.get('LOVABLE_API_KEY');
  const OPENAI_KEY = Deno.env.get('OPENAI_API_KEY');
  
  if (LOVABLE_KEY) {
    console.log('✅ Using LOVABLE AI (Plan A)');
    return {
      name: 'lovable',
      key: LOVABLE_KEY,
      endpoint: 'https://ai.gateway.lovable.dev/v1/chat/completions',
      model: 'google/gemini-2.5-flash'
    };
  }
  
  if (OPENAI_KEY) {
    console.log('⚠️ LOVABLE_API_KEY missing, using OPENAI (Plan B)');
    return {
      name: 'openai',
      key: OPENAI_KEY,
      endpoint: 'https://api.openai.com/v1/chat/completions',
      model: 'gpt-4o-mini'
    };
  }
  
  console.error('❌ No API keys available, returning fallback (Plan C)');
  return { name: 'fallback' };
};

const SYSTEM_PROMPT = `You are a sharp AI industry analyst writing punchy headlines for builders, operators, and forward-thinking executives. Your audience: people who build with AI, not just read about it.

Generate 20 headlines about AI's impact on work, business, and building - focused on 2026 and beyond.

Required mix (aim for 3-4 of each):
- **Model Watch**: New model capabilities, benchmark results, what X model is now good at
- **Workforce Shift**: Jobs emerging, roles disappearing, how teams are adapting
- **Productivity**: Time-saving hacks, automation wins, workflow breakthroughs
- **Vibe Coding**: No-code/low-code wins, business apps built in hours, AI-assisted development
- **Rising Players**: AI startups gaining traction, new tools worth watching
- **Labor Displacement**: What got automated this month, roles under pressure

Style rules:
- MAX 50 characters per headline (punchy, scannable)
- Present tense, active voice
- NO buzzwords: "revolutionary", "game-changing", "transform"
- NO brackets like [SIGNAL] or [HOT TAKE]
- Specific > vague: "GPT-5 beats lawyers at contract review" not "AI improves legal work"

Sources to use: Operator Intel, AI Insider, The Shift, Model Report, Builder Daily, Workforce Watch

Format: JSON array [{"title": "headline max 50 chars", "source": "Source Name"}]`;

// Safe content extraction
const extractContent = (data: any): string | null => {
  try {
    return data?.choices?.[0]?.message?.content || null;
  } catch {
    return null;
  }
};

// Safe JSON parsing with multiple strategies
const parseHeadlines = (content: string): NewsHeadline[] => {
  // Strategy 1: Direct parse
  try {
    const parsed = JSON.parse(content);
    if (Array.isArray(parsed)) return parsed;
    if (parsed.headlines) return parsed.headlines;
    if (parsed.news) return parsed.news;
  } catch {}
  
  // Strategy 2: Extract JSON from markdown code blocks
  const match = content.match(/\[[\s\S]*?\]/);
  if (match) {
    try { 
      return JSON.parse(match[0]); 
    } catch {}
  }
  
  return [];
};

// Validate headlines
const validateHeadlines = (headlines: any[]): NewsHeadline[] => {
  return headlines
    .filter(h => 
      h && 
      typeof h.title === 'string' && 
      h.title.length > 15 &&
      typeof h.source === 'string' && 
      h.source.length > 0
    )
    .slice(0, 20);
};

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

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const provider = getProvider();
    
    // Plan C: Return fallback immediately if no API keys
    if (provider.name === 'fallback') {
      console.log('📋 Returning fallback headlines (no API keys configured)');
      return new Response(
        JSON.stringify({
          headlines: FALLBACK_HEADLINES,
          timestamp: new Date().toISOString(),
          provider: 'fallback',
          fallback: true,
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      );
    }

    console.log(`Generating AI news briefing via ${provider.name}...`);

    const response = await fetch(provider.endpoint!, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${provider.key}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: provider.model,
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: 'Generate 20 AI business news headlines.' }
        ],
        temperature: 0.8,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`${provider.name} API error:`, response.status, errorText);
      throw new Error(`${provider.name} API error: ${response.status}`);
    }

    const data = await response.json();
    const content = extractContent(data);
    
    if (!content) {
      throw new Error('No content in AI response');
    }

    console.log('AI response received, parsing headlines...');
    
    const headlines = parseHeadlines(content);
    const validHeadlines = validateHeadlines(headlines);

    if (validHeadlines.length === 0) {
      throw new Error('No valid headlines generated');
    }

    console.log(`✅ Generated ${validHeadlines.length} headlines via ${provider.name}`);

    return new Response(
      JSON.stringify({
        headlines: validHeadlines,
        timestamp: new Date().toISOString(),
        provider: provider.name,
        fallback: false,
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );

  } catch (error) {
    console.error('Error generating AI news:', error);
    
    return new Response(
      JSON.stringify({
        headlines: FALLBACK_HEADLINES,
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

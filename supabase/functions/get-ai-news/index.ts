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

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      console.error('LOVABLE_API_KEY not configured');
      throw new Error('API key not configured');
    }

    console.log('Fetching AI news from Lovable AI...');

    // Get today's date for context
    const today = new Date().toLocaleDateString('en-US', { 
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' 
    });

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          {
            role: 'system',
            content: `You are Krish Raja's AI intelligence analyst - an operator with 20+ years building $100M+ businesses. You don't report news. You interpret signals.

Your perspective:
- Cut through vendor theatre - what actually matters vs marketing
- Operator lens - what this means for P&L, not just tech
- Contrarian when warranted - call out hype, flag real shifts
- Action-oriented - what should leaders DO about this

Tone: Direct, confident, slightly provocative. No corporate buzzwords. No "revolutionary" or "transformative". Speak like a trusted advisor who's seen it all.`
          },
          {
            role: 'user',
            content: `Generate 20 AI intelligence briefings as of ${today}. Mix these types:

**SIGNAL** (What's actually changing)
- Real shifts in enterprise adoption patterns
- Regulatory moves that affect deployment
- Infrastructure bottlenecks or breakthroughs

**HOT TAKE** (Contrarian perspective)  
- Why a hyped announcement doesn't matter
- What everyone's missing about a trend
- Vendor claims vs reality

**OPERATOR INTEL** (Practical implications)
- Cost structure changes affecting build-vs-buy
- Skills/hiring market shifts
- Implementation patterns that work

**WATCH LIST** (Early signals)
- Under-the-radar developments
- Second-order effects of major news
- Competitive dynamics playing out

Format each as:
- title: Sharp, opinionated, 60-80 chars. Start with signal type in brackets.
- source: Attribution or "Operator Intel" for analysis

Examples:
{"title": "[HOT TAKE] GPT-5 benchmarks impressive, enterprise use cases still unclear", "source": "Operator Intel"}
{"title": "[SIGNAL] Microsoft quietly deprecating Copilot features that don't drive engagement", "source": "The Information"}
{"title": "[WATCH] Mid-tier companies outperforming on AI ROI vs Fortune 100", "source": "McKinsey Data"}
{"title": "[OPERATOR] Fine-tuning costs dropped 80% - build beats buy for most workflows", "source": "Operator Intel"}

Return ONLY a JSON array with this exact structure:
[{"title": "headline text", "source": "source name"}]

No additional text, explanations, or markdown. Just the JSON array.`
          }
        ]
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Lovable AI API error:', response.status, errorText);
      throw new Error(`Lovable AI API error: ${response.status}`);
    }

    const data = await response.json();
    console.log('Lovable AI response received');
    
    const content = data.choices[0].message.content;
    
    // Parse the JSON - Gemini returns it directly as array
    let headlines: NewsHeadline[] = [];
    try {
      // Try direct parse first
      headlines = JSON.parse(content);
    } catch {
      // If that fails, try extracting from object
      const parsedContent = JSON.parse(content);
      if (parsedContent.headlines) {
        headlines = parsedContent.headlines;
      } else if (Array.isArray(parsedContent)) {
        headlines = parsedContent;
      } else if (parsedContent.news) {
        headlines = parsedContent.news;
      }
    }

    // Validate and ensure we have proper format
    const validHeadlines = headlines
      .filter(h => h.title && h.source)
      .slice(0, 20);

    if (validHeadlines.length === 0) {
      throw new Error('No valid headlines generated');
    }

    console.log(`Generated ${validHeadlines.length} headlines`);

    return new Response(
      JSON.stringify({ 
        headlines: validHeadlines,
        timestamp: new Date().toISOString()
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Error in get-ai-news function:', error);
    
    // Return fallback headlines on error
    const fallbackHeadlines: NewsHeadline[] = [
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

    return new Response(
      JSON.stringify({ 
        headlines: fallbackHeadlines,
        timestamp: new Date().toISOString(),
        fallback: true
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});

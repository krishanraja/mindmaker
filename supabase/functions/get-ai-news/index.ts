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
    const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
    if (!OPENAI_API_KEY) {
      console.error('OPENAI_API_KEY not configured');
      throw new Error('API key not configured');
    }

    console.log('Fetching AI news from OpenAI...');

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are an AI news curator. Generate realistic, impactful AI news headlines that sound like they could be from today. Focus on major developments from companies like OpenAI, Google (Gemini), Anthropic (Claude), Microsoft, Meta, etc. Make them sound professional and newsworthy.'
          },
          {
            role: 'user',
            content: 'Generate 6 major AI news headlines from today that would matter to business leaders. Format as JSON array with "title" and "source" fields. Examples: "ChatGPT Operator impresses with autonomous web browsing capabilities" (OpenAI), "Gemini 2.0 sets new benchmark in multimodal reasoning" (Google DeepMind), "Claude 4 achieves breakthrough in coding accuracy" (Anthropic).'
          }
        ],
        temperature: 0.8,
        response_format: { type: "json_object" }
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenAI API error:', response.status, errorText);
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    console.log('OpenAI response received');
    
    const content = data.choices[0].message.content;
    const parsedContent = JSON.parse(content);
    
    // Extract headlines array from various possible formats
    let headlines: NewsHeadline[] = [];
    if (parsedContent.headlines) {
      headlines = parsedContent.headlines;
    } else if (Array.isArray(parsedContent)) {
      headlines = parsedContent;
    } else if (parsedContent.news) {
      headlines = parsedContent.news;
    }

    // Validate and ensure we have proper format
    const validHeadlines = headlines
      .filter(h => h.title && h.source)
      .slice(0, 6);

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
      { title: "OpenAI announces major advancement in reasoning capabilities", source: "OpenAI" },
      { title: "Google DeepMind's Gemini 2.0 achieves breakthrough performance", source: "Google DeepMind" },
      { title: "Anthropic's Claude 4 sets new standard for AI safety", source: "Anthropic" },
      { title: "Microsoft integrates advanced AI across enterprise suite", source: "Microsoft" },
      { title: "Meta releases open-source model rivaling proprietary systems", source: "Meta AI" },
      { title: "AI adoption accelerates across Fortune 500 companies", source: "Industry Report" }
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

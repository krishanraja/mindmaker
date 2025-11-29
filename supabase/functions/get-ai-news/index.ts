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
            content: 'You are an AI news curator that generates concise, impactful headlines about recent developments in artificial intelligence. Focus on topics that business executives and strategic leaders care about: enterprise adoption, regulation, competitive positioning, investment trends, and operational impact.'
          },
          {
            role: 'user',
            content: `Generate 20 diverse AI news headlines as of ${today}. Cover these business-critical categories:

1. Enterprise AI Adoption (Microsoft, Salesforce, SAP implementations)
2. AI Regulation & Policy (EU AI Act, US Executive Orders, compliance)
3. AI in Finance (Trading algorithms, risk management, fraud detection)
4. AI in Healthcare (Diagnostics, drug discovery, clinical workflows)
5. Frontier Models (OpenAI GPT-5, Google Gemini, Anthropic Claude, Meta Llama)
6. AI Infrastructure (NVIDIA, cloud providers, compute trends)
7. AI Security & Safety (Alignment research, red teaming, vulnerabilities)
8. AI Productivity Tools (Copilots, workflow automation, enterprise software)
9. AI Talent & Workforce (Skills gap, hiring trends, upskilling)
10. AI Investment (Funding rounds, valuations, M&A activity)

Each headline must be:
- Concise (under 80 characters)
- Current and relevant to ${today}
- Business-focused with strategic implications
- From credible sources

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

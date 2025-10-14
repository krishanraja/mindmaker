import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages } = await req.json();
    const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
    
    if (!OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY is not configured');
    }

    const systemPrompt = `You are Krish, an AI strategy advisor and founder of MindMaker. You're having a casual, helpful conversation with someone interested in AI transformation.

About you:
- You help organizations navigate AI transformation with practical guidance
- Your expertise spans AI literacy, strategic integration, and product strategy
- You've developed the MindMaker methodology for AI transformation
- You work with leadership teams and staff across organizations

Your conversational style:
- Talk naturally like you're having coffee with someone
- Be warm, approachable, and genuinely interested in their situation
- Ask follow-up questions to understand their needs better
- Share insights conversationally, not as bullet points
- Use "I" and "we" naturally (e.g., "I help companies..." or "We could explore...")
- Keep responses conversational length (2-4 sentences usually)
- Only go into detailed explanations when specifically asked

When relevant to the conversation:
- You can mention your work in AI literacy, leadership alignment, product strategy, or finding AI opportunities
- If someone seems interested in working together, you can naturally suggest: "Would you like to book a time to chat more? Here's my calendar: https://calendly.com/krish-raja/mindmaker-meeting"
- Share real insights from your experience, not generic advice

Important: Have a real conversation. Don't list services unless explicitly asked. Don't give a sales pitch. Just be helpful and human.`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          ...messages,
        ],
        temperature: 0.8,
        max_tokens: 800,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('OpenAI API error:', response.status, error);
      throw new Error('Failed to get response from AI');
    }

    const data = await response.json();
    const assistantMessage = data.choices[0].message.content;

    return new Response(
      JSON.stringify({ message: assistantMessage }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error in chat-with-krish function:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'An error occurred' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});

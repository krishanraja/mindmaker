/**
 * @file chat-with-krish Edge Function
 * @description AI chatbot powered by Vertex AI with RAG (Retrieval Augmented Generation)
 *              using the Mindmaker methodology corpus. Supports both main chat and Try It Widget modes.
 * @dependencies Google Cloud Service Account, Vertex AI API
 * @secrets GOOGLE_SERVICE_ACCOUNT_KEY
 * 
 * Request:
 *   POST { messages: Array<{role: string, content: string}>, widgetMode?: 'tryit' | undefined }
 * 
 * Response:
 *   { message: string, metadata: { model: string, cached: boolean, fallback: boolean } }
 * 
 * Error Handling:
 *   - Always returns 200 with fallback message on error (anti-fragile design)
 *   - Retry logic with exponential backoff
 *   - Comprehensive RAG diagnostic logging
 */

import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";
import { createLogger, extractRequestContext } from '../_shared/logger.ts';
import { createMindmakerVertexClient } from '../_shared/vertex-client.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Input validation schema
const messageSchema = z.object({
  role: z.enum(['user', 'assistant', 'system']),
  content: z.string().min(1).max(10000),
});

const chatRequestSchema = z.object({
  messages: z.array(messageSchema).min(1).max(50),
  widgetMode: z.enum(['tryit']).optional(),
});

// Predictable response shape
interface ChatResponse {
  message: string;
  metadata?: {
    model: string;
    cached: boolean;
    fallback: boolean;
    retried?: boolean;
  };
}

// Fallback message for all failure scenarios
const FALLBACK_MESSAGE = `I'm having trouble connecting right now. Here's what I'd normally help with:

1. **Builder Session** - 60 minutes, one real problem → AI friction map + draft systems
   [Book now](/#book)

2. **30-Day Builder Sprint** - Build 3-5 working AI systems around your work
   [Learn more](/builder-sprint)

3. **AI Leadership Lab** - Executive team transformation (4 hours)
   [Learn more](/leadership-lab)

4. **Partner Program** - Portfolio-wide AI enablement
   [Learn more](/partner-program)`;

// ============================================================================
// KRISH VOICE SYSTEM PROMPTS
// ============================================================================

/**
 * Anti-slop guardrails - Words and patterns Krish never uses
 */
const ANTI_SLOP_RULES = `
## VOICE GUARDRAILS - WHAT KRISH NEVER SAYS
- NEVER use: "leverage", "synergy", "utilize", "drive value", "stakeholders", "paradigm shift", "best practices", "low-hanging fruit", "circle back", "deep dive"
- NEVER give generic advice that could apply to anyone ("focus on your goals", "be strategic")
- NEVER hedge with "I think maybe..." - be direct
- NEVER use corporate buzzwords or consultant-speak
- If you can't be specific, ask ONE clarifying question instead of giving fluff
- ALWAYS reference something specific from their input - prove you read it
- NEVER start responses with "Great question!" or similar platitudes
`;

/**
 * Krish's distinctive voice patterns
 */
const KRISH_VOICE = `
## KRISH'S VOICE
You speak like Krish - a straight-talking product strategist with 16 years of experience. Your voice is:

1. **Direct, no hedging**: "Here's the thing..." not "I think maybe we should consider..."
2. **Challenge assumptions**: "Why do you assume X? Let's strip that back."
3. **First-principles framing**: "What's the fundamental problem you're actually solving?"
4. **Specific and actionable**: "Do X by Friday" not "Consider doing X at some point"
5. **Slight irreverence**: "Most AI training is theatre - you leave with slides, not systems"
6. **Confidence without arrogance**: You know what works because you've done it 90+ times

Examples of Krish's voice:
- "Here's what I'd actually do..."
- "Look, most people overcomplicate this..."
- "The real question isn't X, it's Y..."
- "I've seen this 50 times - here's the pattern..."
- "Cut the noise. What you actually need is..."
`;

/**
 * Try It Widget system prompt (short, punchy responses)
 */
const TRYIT_SYSTEM_PROMPT = `You are Krish, founder of Mindmaker. The user has an AI decision challenge. Your job is to cut through their confusion in 3-5 sentences.

${KRISH_VOICE}

${ANTI_SLOP_RULES}

## MINDMAKER METHODOLOGY - Pick ONE Framework Per Response

1. **A/B Framing**: Flip the decision. "An 80% success rate is also 20% failure. Which framing changes your decision?"
2. **Dialectical Reasoning**: "Strongest case FOR? Strongest case AGAINST? Now, what synthesis captures both?"
3. **Mental Contrasting (WOOP)**: "What's the wish? The best outcome? The real obstacle? Your plan?"
4. **Reflective Equilibrium**: "Does this actually align with what your org says it values?"
5. **First-Principles**: "Strip the assumptions. Why do you need X? Ask 'why' five times."

## RESPONSE FORMAT
- **3-5 sentences maximum** (this is a taste, not a meal)
- Apply ONE framework to their specific problem
- Give ONE insight they haven't thought of
- End with ONE specific next step + link
- Bold the key insight

## EXAMPLE RESPONSE
"**First-principles question: why a chatbot?** You said customer resolution, but that's a solution, not the problem. The problem is response time. That opens other paths—smart FAQs, AI triage before human handoff, or yes, a chatbot. [Book a Builder Session](/#book) and we'll map which actually removes work."

REMEMBER: Sound like a senior advisor, not a marketing bot. Be willing to push back. Cite their specific words.`;

/**
 * Main chat system prompt (conversational, helpful)
 */
const CHAT_SYSTEM_PROMPT = `You are Krish, founder of Mindmaker. You help non-technical leaders build AI systems without code.

${KRISH_VOICE}

${ANTI_SLOP_RULES}

## WHAT MINDMAKER DOES
We don't train—we build. Leaders bring real problems, leave with working AI systems.
- "AI literacy is compounding leadership performance—using AI to think better, faster, and more creatively."
- "We build working systems, not strategy decks."
- "Leaders learn by building, not by listening."

## PROGRAMS & OUTCOMES (cite real numbers)
- **Builder Session** (60 min, $348): 1 AI friction map + 1-2 draft systems. Saves 2-5 hrs/week.
- **Builder Sprint** (30 days, $2098): 3-5 working systems + Builder Dossier + 90-day roadmap. Saves 8-15 hrs/week.
- **Leadership Lab** (half/full day, $7000+): Shared language, 90-day pilot charter, 2 decisions run through AI.
- **Partner Program** (6-12 months): Portfolio-wide AI enablement for VCs/advisors.

## TARGET LEADERS
CEOs, COOs, GMs, CCOs, CPOs with P&L responsibility, 10+ years leadership, who need to build the future—not delegate it.

## RESPONSE RULES
1. **Keep it short**: 1-3 sentences for simple questions
2. **Be direct**: Give answers, not questions
3. **Every response includes a link**: Always point somewhere [like this](/#book)
4. **Apply frameworks when relevant**: Use the Five Cognitive Frameworks for decision questions
5. **Never ask follow-up questions**: Give actionable answers immediately

## RESPONSE PATTERNS

**"How does this work?"**
→ "We help leaders build AI systems hands-on—working systems, not strategy decks. [Try the friction map](/) to see it in action, or [book a Builder Session](/#book) to solve your specific problem in 60 minutes."

**"I want to learn more"**
→ "Three paths: [Try the AI tools](/) to test our approach, [book a Builder Session](/#book) for your specific problem, or [see the Builder Sprint](/builder-sprint) to build 3-5 systems in 30 days."

**"Is this for me?"**
→ "Built for senior leaders with P&L responsibility who need AI literacy that compounds their performance. If you're making AI strategy decisions and don't want to delegate the learning, this is for you. [Book a session](/#book)."

**AI decision questions**
→ Apply one of the Five Cognitive Frameworks, give a specific insight, then link to [Book a Builder Session](/#book).

**"I'm overwhelmed by AI"**
→ "Most leaders are—you're seeing noise, not signal. Start simple: what's the one workflow draining most of your time? That's where AI actually helps. [Try our friction map tool](/) to identify it, or [book a Builder Session](/#book) to map it in 60 minutes."

## THE FIVE COGNITIVE FRAMEWORKS (Use when relevant)
1. **A/B Framing**: Reframe positively AND negatively to expose bias
2. **Dialectical Reasoning**: Thesis-antithesis-synthesis for better decisions
3. **Mental Contrasting (WOOP)**: Wish → Outcome → Obstacle → Plan
4. **Reflective Equilibrium**: Align with organizational values
5. **First-Principles Thinking**: Strip assumptions, find fundamentals

REMEMBER: You're Krish—direct, practical, zero fluff. Reference their specific words. If you can't be specific, ask ONE clarifying question instead of giving generic advice.`;

// ============================================================================
// MAIN HANDLER
// ============================================================================

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const { requestId, sessionId } = extractRequestContext(req);
  const logger = createLogger('chat-with-krish', requestId, sessionId);
  
  logger.info('Chat request started');
  
  try {
    const body = await req.json();
    
    // Validate input
    const parseResult = chatRequestSchema.safeParse(body);
    if (!parseResult.success) {
      logger.warn('Validation failed', { errors: parseResult.error.flatten() });
      return new Response(
        JSON.stringify({ error: 'Invalid input', details: parseResult.error.flatten().fieldErrors }),
        { status: 400, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      );
    }
    
    const { messages, widgetMode } = parseResult.data;
    const isTryItWidget = widgetMode === 'tryit';
    logger.info('Request validated', { widgetMode, messageCount: messages.length, isTryItWidget });

    // Get service account credentials
    const serviceAccountJson = Deno.env.get('GOOGLE_SERVICE_ACCOUNT_KEY');
    
    if (!serviceAccountJson) {
      console.error('GOOGLE_SERVICE_ACCOUNT_KEY not configured');
      throw new Error('Service configuration error');
    }

    let serviceAccount;
    try {
      serviceAccount = JSON.parse(serviceAccountJson);
    } catch (error) {
      console.error('Failed to parse service account JSON:', error);
      throw new Error('Invalid service account configuration');
    }

    // Validate service account structure
    if (!serviceAccount.private_key || !serviceAccount.client_email) {
      console.error('Invalid service account structure');
      throw new Error('Invalid service account configuration');
    }

    // Select system prompt based on mode
    const systemPrompt = isTryItWidget ? TRYIT_SYSTEM_PROMPT : CHAT_SYSTEM_PROMPT;

    // Create robust Vertex client and call
    const vertexClient = createMindmakerVertexClient();
    logger.info('Calling Vertex AI with robust client');

    const result = await vertexClient.call({
      messages: messages.map(m => ({ role: m.role as 'user' | 'assistant' | 'system', content: m.content })),
      systemInstruction: systemPrompt,
      temperature: 0.8,
      maxOutputTokens: isTryItWidget ? 1024 : 2048,
      useRag: true,
      similarityTopK: 8, // Increased for more context
      vectorDistanceThreshold: 0.4, // Decreased for higher relevance
    }, serviceAccount);

    logger.info('Vertex AI response received', { 
      responseLength: result.content.length,
      cached: result.cached,
      retried: result.retried,
      hasGrounding: !!result.groundingMetadata,
    });

    const response: ChatResponse = {
      message: result.content,
      metadata: {
        model: vertexClient.config.model,
        cached: result.cached,
        fallback: false,
        retried: result.retried,
      },
    };

    logger.info('Chat request completed successfully');
    return new Response(
      JSON.stringify(response),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    logger.error('Chat request failed', { error: error instanceof Error ? error.message : String(error) });
    
    // Always return a usable response, never break the UI
    const errorResponse: ChatResponse = {
      message: FALLBACK_MESSAGE,
      metadata: {
        model: 'gemini-2.5-flash',
        cached: false,
        fallback: true,
      },
    };

    return new Response(
      JSON.stringify(errorResponse),
      {
        status: 200, // Return 200 to avoid breaking the UI
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});

import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Predictable response shape
interface ChatResponse {
  message: string;
  metadata?: {
    model: string;
    cached: boolean;
    fallback: boolean;
  };
}

// Fallback message for all failure scenarios
const FALLBACK_MESSAGE = `I'm having trouble connecting right now. Here's what I'd normally help with:

1. **Builder Session** - 60 minutes, one real problem → AI friction map + draft systems
   [Book now](https://calendly.com/krish-raja/mindmaker-meeting)

2. **30-Day Builder Sprint** - Build 3-5 working AI systems around your work
   [Learn more](/builder-sprint)

3. **AI Leadership Lab** - Executive team transformation (4 hours)
   [Learn more](/leadership-lab)

4. **Partner Program** - Portfolio-wide AI enablement
   [Learn more](/partner-program)`;

// Token cache (in-memory, expires after 50 minutes)
let cachedToken: { token: string; expiresAt: number } | null = null;

// Generate RS256-signed JWT for Google service account
async function generateJWT(serviceAccount: any): Promise<string> {
  const header = {
    alg: 'RS256',
    typ: 'JWT',
  };

  const now = Math.floor(Date.now() / 1000);
  const payload = {
    iss: serviceAccount.client_email,
    scope: 'https://www.googleapis.com/auth/cloud-platform',
    aud: 'https://oauth2.googleapis.com/token',
    exp: now + 3600,
    iat: now,
  };

  const encodedHeader = btoa(JSON.stringify(header)).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
  const encodedPayload = btoa(JSON.stringify(payload)).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
  const unsignedToken = `${encodedHeader}.${encodedPayload}`;

  // Import the private key
  const privateKey = serviceAccount.private_key;
  const pemHeader = '-----BEGIN PRIVATE KEY-----';
  const pemFooter = '-----END PRIVATE KEY-----';
  const pemContents = privateKey.substring(pemHeader.length, privateKey.length - pemFooter.length).trim();
  const binaryDer = Uint8Array.from(atob(pemContents), c => c.charCodeAt(0));

  const cryptoKey = await crypto.subtle.importKey(
    'pkcs8',
    binaryDer,
    {
      name: 'RSASSA-PKCS1-v1_5',
      hash: 'SHA-256',
    },
    false,
    ['sign']
  );

  // Sign the token
  const signature = await crypto.subtle.sign(
    'RSASSA-PKCS1-v1_5',
    cryptoKey,
    new TextEncoder().encode(unsignedToken)
  );

  const encodedSignature = btoa(String.fromCharCode(...new Uint8Array(signature)))
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');

  return `${unsignedToken}.${encodedSignature}`;
}

// Exchange JWT for access token
async function getAccessToken(serviceAccount: any): Promise<string> {
  // Check cache first
  if (cachedToken && cachedToken.expiresAt > Date.now()) {
    console.log('Using cached access token');
    return cachedToken.token;
  }

  console.log('Generating new access token');
  const jwt = await generateJWT(serviceAccount);

  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: jwt,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Token exchange failed:', response.status, errorText);
    throw new Error(`Failed to exchange JWT for access token: ${response.status}`);
  }

  const data = await response.json();
  const token = data.access_token;

  // Cache for 50 minutes (tokens expire at 60)
  cachedToken = {
    token,
    expiresAt: Date.now() + 50 * 60 * 1000,
  };

  return token;
}

// Extract content from Vertex AI response with guards
function extractContent(response: any): string {
  try {
    const content = response?.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!content || typeof content !== 'string' || content.trim() === '') {
      console.warn('Empty or invalid content in Vertex AI response:', JSON.stringify(response));
      return FALLBACK_MESSAGE;
    }
    
    return content;
  } catch (error) {
    console.error('Error extracting content:', error);
    return FALLBACK_MESSAGE;
  }
}

// Call Vertex AI with RAG
async function callVertexAI(messages: any[], accessToken: string, isTryItWidget: boolean = false): Promise<string> {
  const PROJECT_ID = 'gen-lang-client-0174430158';
  const LOCATION = 'us-east1';
  const MODEL = 'gemini-2.5-flash';
  const RAG_CORPUS_ID = '6917529027641081856';

  const endpoint = `https://${LOCATION}-aiplatform.googleapis.com/v1/projects/${PROJECT_ID}/locations/${LOCATION}/publishers/google/models/${MODEL}:generateContent`;

  // Convert messages to Gemini format
  const contents = messages.map(msg => ({
    role: msg.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: msg.content }],
  }));

  const requestBody = {
    contents,
    tools: {
      retrieval: {
        disable_attribution: false,
        vertex_rag_store: {
          rag_resources: {
            rag_corpus: `projects/${PROJECT_ID}/locations/${LOCATION}/ragCorpora/${RAG_CORPUS_ID}`,
          },
          similarity_top_k: 5,
          vector_distance_threshold: 0.5,
        },
      },
    },
    generation_config: {
      temperature: 0.8,
      max_output_tokens: isTryItWidget ? 400 : 800,
    },
  };

  console.log('=== VERTEX AI RAG REQUEST ===');
  console.log('Endpoint:', endpoint);
  console.log('Request body:', JSON.stringify(requestBody, null, 2));
  
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Vertex AI error:', response.status, errorText);

    if (response.status === 429) {
      return 'I\'m currently experiencing high traffic. Please try again in a moment or [book a session directly](https://calendly.com/krish-raja/mindmaker-meeting).';
    }
    
    if (response.status === 402) {
      return 'Service temporarily unavailable. Please [book a session directly](https://calendly.com/krish-raja/mindmaker-meeting).';
    }

    if (response.status === 401) {
      console.error('Authentication failed - token may be expired');
      cachedToken = null; // Clear cache
      throw new Error('Authentication failed');
    }

    throw new Error(`Vertex AI request failed: ${response.status}`);
  }

  const data = await response.json();
  
  console.log('=== VERTEX AI RESPONSE RECEIVED ===');
  console.log('Response status:', response.status);
  console.log('Full response keys:', Object.keys(data));
  console.log('Candidates count:', data.candidates?.length || 0);
  
  // COMPREHENSIVE RAG DIAGNOSTIC LOGGING
  console.log('=== RAG DIAGNOSTIC START ===');
  
  // Check for grounding metadata at correct path: data.candidates[0].groundingMetadata (camelCase)
  const candidate = data.candidates?.[0];
  
  if (candidate?.groundingMetadata) {
    console.log('✅ RAG is working - groundingMetadata found');
    console.log('Full grounding metadata:', JSON.stringify(candidate.groundingMetadata, null, 2));
    
    // Log retrieval queries (camelCase)
    if (candidate.groundingMetadata.retrievalQueries) {
      console.log('Retrieval queries used:', candidate.groundingMetadata.retrievalQueries);
    }
    
    // Log grounding chunks (actual corpus content retrieved)
    if (candidate.groundingMetadata.groundingChunks) {
      console.log(`Retrieved ${candidate.groundingMetadata.groundingChunks.length} chunks from corpus`);
      candidate.groundingMetadata.groundingChunks.forEach((chunk: any, idx: number) => {
        console.log(`\nChunk ${idx + 1}:`);
        console.log('  Source:', chunk.retrievedContext?.title || 'Unknown');
        console.log('  Content preview:', chunk.retrievedContext?.text?.substring(0, 200) || 'No text');
        console.log('  Relevance score:', chunk.relevanceScore || 'N/A');
      });
    }
    
    // Log grounding supports (how corpus was used in response)
    if (candidate.groundingMetadata.groundingSupports) {
      console.log('\nGrounding supports:', candidate.groundingMetadata.groundingSupports.length);
    }
  } else {
    console.warn('❌ No groundingMetadata found - RAG is NOT working');
    console.log('Full candidate structure:', JSON.stringify(candidate ? Object.keys(candidate) : 'No candidate', null, 2));
    console.log('Full response structure:', JSON.stringify(Object.keys(data), null, 2));
  }
  
  console.log('=== RAG DIAGNOSTIC END ===');
  
  return extractContent(data);
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, widgetMode } = await req.json();
    
    if (!messages || !Array.isArray(messages)) {
      throw new Error('Invalid messages format');
    }
    
    const isTryItWidget = widgetMode === 'tryit';
    console.log('Widget mode:', widgetMode, 'isTryItWidget:', isTryItWidget);

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

    // System prompt based on context
    const systemPrompt = isTryItWidget 
      ? `You are Krish, founder of Mindmaker. The user has a specific AI decision challenge.

CRITICAL INSTRUCTIONS:
1. ALWAYS pull specific insights from the Mindmaker methodology corpus - cite frameworks, approaches, or principles
2. Your response MUST be 3-4 sentences maximum
3. Provide ONE unique insight from Mindmaker's approach (use RAG content)
4. Give ONE concrete next step with a clickable link
5. Use **bold** for emphasis, never use markdown headers (no ###)
6. Format ALL links as [text](url) for clickability
7. Sound like Krish: direct, practical, zero fluff

RESPONSE STRUCTURE:
[Brief acknowledgment + one Mindmaker insight from corpus] [One practical action they can take] [Link to next step: either Builder Session https://calendly.com/krish-raja/mindmaker-meeting OR a relevant pathway page]

EXAMPLE:
"**This is a classic build vs buy tension.** From our friction mapping approach: start by mapping where the chatbot actually removes work versus adds coordination overhead. Most teams skip this and regret it. **Next step:** [Try our friction mapping tool](/) to visualize the hidden costs, or [book a Builder Session](https://calendly.com/krish-raja/mindmaker-meeting) to map your specific case in 60 minutes."`
      : `You are Krish, founder of Mindmaker. You help non-technical leaders build AI systems without code.

CORE PHILOSOPHY:
Be incredibly helpful and direct. Don't ask follow-up questions—give actionable answers immediately and point to the right next step.

WHAT MINDMAKER DOES:
We turn non-technical leaders into no-code AI builders. Build working AI systems around your real work—no code, no waiting for IT.

YOUR STYLE:
- Ultra-concise (1-3 sentences max)
- Direct, practical, zero fluff
- Give answers, not questions
- Point to specific actions/pages immediately
- Skip small talk and theory

WHEN USERS ASK ABOUT:

**"How does this work?" / "What do you do?"**
→ "We help leaders build AI systems hands-on. [Try the interactive AI decision tool](/) or [book a 60-min Builder Session](https://calendly.com/krish-raja/mindmaker-meeting) to map your first system."

**"I want to learn more"**
→ "Three paths: [Try the AI tool on this page](/) to test our approach, [book a Builder Session](https://calendly.com/krish-raja/mindmaker-meeting) for your specific problem, or [see the 30-Day Sprint](/builder-sprint) to build 3-5 systems."

**"What programs do you offer?"**
→ "Start with a [Builder Session](https://calendly.com/krish-raja/mindmaker-meeting) (60 min, one problem → friction map + systems). Then [30-Day Sprint](/builder-sprint) ($5-8K, build 3-5 systems), [Leadership Lab](/leadership-lab) ($10-20K, executive teams), or [Partner Program](/partner-program) (portfolio-wide)."

**"Is this for me?" / "Who is this for?"**
→ "Built for CEOs, GMs, and senior leaders with P&L responsibility who need to build the future, not delegate it. If you make decisions about AI strategy, this is for you. [Book a session](https://calendly.com/krish-raja/mindmaker-meeting)."

**"What's the first step?"**
→ "[Book a Builder Session](https://calendly.com/krish-raja/mindmaker-meeting)—bring one real problem, leave with a friction map + 1-2 draft systems you can use immediately."

**"How much does it cost?"**
→ "Builder Session: minimal hold. 30-Day Sprint: $5-8K. Leadership Lab: $10-20K. Partner Program: custom. [Book a call](https://calendly.com/krish-raja/mindmaker-meeting) to discuss."

**Pricing/Value questions**
→ Give direct answer + "[See full details](/builder-sprint)" or "[Book a call](https://calendly.com/krish-raja/mindmaker-meeting)"

**General AI questions**
→ Brief answer (1 sentence) + "Want to apply this to your work? [Try the tool](/) or [book a session](https://calendly.com/krish-raja/mindmaker-meeting)."

**Specific tool/technical questions**
→ Quick answer + direct them to Builder Session for hands-on help

CRITICAL RULES:
1. Never ask "What industry are you in?" or "Tell me more about..." - just give helpful info and point to action
2. Every response should include at least ONE clickable link
3. Maximum 3 sentences unless explaining a program
4. Always format links as [text](url)
5. Default action is ALWAYS Builder Session for first-timers
6. Skip questions like "How can I help?" - be direct about what they should do

EXAMPLES:

User: "I'm overwhelmed by AI"
You: "Most leaders are. [Try our AI decision tool](/)—input a challenge, get instant clarity. Or [book a Builder Session](https://calendly.com/krish-raja/mindmaker-meeting) to map your specific situation."

User: "What's a Builder Session?"
You: "60 minutes: bring one real problem, we map where AI removes friction and draft 1-2 systems you can use today. [Book here](https://calendly.com/krish-raja/mindmaker-meeting)."

User: "How is this different from training?"
You: "We don't train—we build. You leave with working systems, not slides. [See the 30-Day Sprint](/builder-sprint) or [try the tool](/) now."`;

    // Add system message
    const fullMessages = [
      { role: 'system', content: systemPrompt },
      ...messages,
    ];

    // Get access token and call Vertex AI
    const accessToken = await getAccessToken(serviceAccount);
    const assistantMessage = await callVertexAI(fullMessages, accessToken, isTryItWidget);

    const response: ChatResponse = {
      message: assistantMessage,
      metadata: {
        model: 'gemini-2.5-flash',
        cached: cachedToken !== null,
        fallback: assistantMessage === FALLBACK_MESSAGE,
      },
    };

    return new Response(
      JSON.stringify(response),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error in chat-with-krish function:', error);
    
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

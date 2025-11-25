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
async function callVertexAI(messages: any[], accessToken: string): Promise<string> {
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
    tools: [
      {
        retrieval: {
          vertex_rag_store: {
            rag_corpora: [`projects/${PROJECT_ID}/locations/${LOCATION}/ragCorpora/${RAG_CORPUS_ID}`],
            similarity_top_k: 5,
          },
        },
      },
    ],
    generation_config: {
      temperature: 0.8,
      max_output_tokens: 800,
    },
  };

  console.log('Calling Vertex AI:', endpoint);
  
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
  return extractContent(data);
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages } = await req.json();
    
    if (!messages || !Array.isArray(messages)) {
      throw new Error('Invalid messages format');
    }

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

    // System prompt (Krish persona)
    const systemPrompt = `You are Krish, founder of Mindmaker. You help non-technical leaders become no-code builders of AI-enabled systems.

WHAT MINDMAKER DOES:
Mindmaker turns non-technical leaders into no-code AI builders. We help CEOs, GMs, and executives build working AI systems around their real work—without writing code or waiting for IT.

WHO IT'S FOR:
CEO, GM, CCO, CPO, CMO, CRO, COO—leaders with P&L responsibility who need to design the future, not delegate it.

YOUR TONE:
Direct, practical, zero fluff. You talk about building working systems, not theory. You're empathetic but don't waste time. You're the skeptical advisor who tells the truth.

CORE PRODUCTS YOU RECOMMEND:

1. **Builder Session** (60 minutes)
   - Entry product, $free to low
   - One real leadership problem → AI friction map + 1-2 draft systems
   - Leave with: Written follow-up with prompts
   - Link: [Book Builder Session](https://calendly.com/krish-raja/mindmaker-meeting)

2. **30-Day Builder Sprint** (Individual leaders)
   - $5-8K USD
   - 4 weeks: Intake → Mirror → Systems → Team → Charter
   - Build 3-5 working workflows around your real work
   - Deliverables: 4 sessions, Builder Dossier, metrics, optional clips
   - Link: [View 30-Day Sprint](/builder-sprint)

3. **AI Leadership Lab** (Executive teams)
   - $10-20K USD
   - 4 hours for 6-12 executives
   - Run 2 real decisions: old way vs AI-enabled way
   - Leave with: 90-day pilot charter, exec summary deck, team snapshot
   - Link: [View Leadership Lab](/leadership-lab)

4. **Partner Program** (VC/advisor portfolio work)
   - Retainer or revenue share, custom
   - 4 phases: Portfolio scan → First wave → Standing program → Benchmark rollout
   - Link: [View Partner Program](/partner-program)

CONVERSATIONAL APPROACH:
1. Ask what problem they're trying to solve
2. Get concrete about their role and constraints
3. Point them to Builder Session first (it's the entry point)
4. If they're ready for more, explain Sprint/Lab/Partners
5. Always tie to real outcomes: systems built, decisions run, money saved

CRITICAL RULES:
- Be genuinely helpful first, qualify second
- Use direct, practical language—no vendor speak
- Talk about real outcomes: working systems, faster decisions, less waste
- Keep responses concise (2-4 sentences) unless giving detailed explanations
- Format links as markdown [text](url)
- Build on conversation history—don't repeat questions
- Always point to Builder Session as the entry point`;

    // Add system message
    const fullMessages = [
      { role: 'system', content: systemPrompt },
      ...messages,
    ];

    // Get access token and call Vertex AI
    const accessToken = await getAccessToken(serviceAccount);
    const assistantMessage = await callVertexAI(fullMessages, accessToken);

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

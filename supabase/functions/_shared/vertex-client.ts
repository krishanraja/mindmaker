/**
 * @file Robust Vertex AI Client
 * @description Centralized Vertex AI client with retry logic, token management,
 *              and error handling. Used across all AI-powered edge functions.
 */

// Token cache (in-memory, expires after 50 minutes)
let cachedToken: { token: string; expiresAt: number } | null = null;

// Constants
const TOKEN_CACHE_DURATION = 50 * 60 * 1000; // 50 minutes
const REQUEST_TIMEOUT = 30000; // 30 seconds
const MAX_RETRIES = 2;
const RETRY_DELAY = 2000; // 2 seconds

export interface VertexConfig {
  projectId: string;
  location: string;
  model: string;
  ragCorpusId?: string;
}

export interface VertexMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface VertexRequestOptions {
  messages: VertexMessage[];
  systemInstruction?: string;
  temperature?: number;
  maxOutputTokens?: number;
  useRag?: boolean;
  similarityTopK?: number;
  vectorDistanceThreshold?: number;
}

export interface VertexResponse {
  content: string;
  groundingMetadata?: any;
  cached: boolean;
  retried: boolean;
}

/**
 * Generate RS256-signed JWT for Google service account
 */
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

  const privateKey = serviceAccount.private_key;
  const pemHeader = '-----BEGIN PRIVATE KEY-----';
  const pemFooter = '-----END PRIVATE KEY-----';
  const pemContents = privateKey
    .replace(pemHeader, '')
    .replace(pemFooter, '')
    .replace(/\\n/g, '')
    .replace(/\n/g, '')
    .replace(/\r/g, '')
    .replace(/\s/g, '')
    .trim();

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

/**
 * Get access token with caching and proactive refresh
 */
export async function getAccessToken(serviceAccount: any, forceRefresh = false): Promise<string> {
  // Check cache first (unless force refresh)
  if (!forceRefresh && cachedToken && cachedToken.expiresAt > Date.now()) {
    console.log('[VertexClient] Using cached access token');
    return cachedToken.token;
  }

  console.log('[VertexClient] Generating new access token');
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
    console.error('[VertexClient] Token exchange failed:', response.status, errorText);
    throw new Error(`Token exchange failed: ${response.status}`);
  }

  const data = await response.json();
  cachedToken = {
    token: data.access_token,
    expiresAt: Date.now() + TOKEN_CACHE_DURATION,
  };

  return cachedToken.token;
}

/**
 * Clear the token cache (call on auth failure)
 */
export function clearTokenCache(): void {
  cachedToken = null;
}

/**
 * Sleep helper for retry delay
 */
function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Fetch with timeout
 */
async function fetchWithTimeout(
  url: string,
  options: RequestInit,
  timeout: number
): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);
  
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    return response;
  } finally {
    clearTimeout(timeoutId);
  }
}

/**
 * Call Vertex AI with retry logic and error handling
 */
export async function callVertexAI(
  config: VertexConfig,
  options: VertexRequestOptions,
  serviceAccount: any
): Promise<VertexResponse> {
  const { projectId, location, model, ragCorpusId } = config;
  const {
    messages,
    systemInstruction,
    temperature = 0.8,
    maxOutputTokens = 2048,
    useRag = true,
    similarityTopK = 8, // Increased from 5 for more context
    vectorDistanceThreshold = 0.4, // Decreased from 0.5 for higher relevance
  } = options;

  const endpoint = `https://${location}-aiplatform.googleapis.com/v1/projects/${projectId}/locations/${location}/publishers/google/models/${model}:generateContent`;

  // Build request body
  const contents = messages
    .filter(msg => msg.role !== 'system')
    .map(msg => ({
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: msg.content }],
    }));

  const requestBody: any = {
    contents,
    generation_config: {
      temperature,
      max_output_tokens: maxOutputTokens,
    },
  };

  // Add RAG if enabled and corpus ID provided
  if (useRag && ragCorpusId) {
    requestBody.tools = {
      retrieval: {
        disable_attribution: false,
        vertex_rag_store: {
          rag_resources: [{
            rag_corpus: `projects/${projectId}/locations/${location}/ragCorpora/${ragCorpusId}`,
          }],
          similarity_top_k: similarityTopK,
          vector_distance_threshold: vectorDistanceThreshold,
        },
      },
    };
  }

  // Add system instruction
  if (systemInstruction) {
    requestBody.systemInstruction = {
      parts: [{ text: systemInstruction }]
    };
  }

  let lastError: Error | null = null;
  let retried = false;

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      // Get token (force refresh on retry after 401)
      const forceRefresh = attempt > 0 && lastError?.message?.includes('401');
      const accessToken = await getAccessToken(serviceAccount, forceRefresh);

      console.log(`[VertexClient] Attempt ${attempt + 1}/${MAX_RETRIES + 1}`);

      const response = await fetchWithTimeout(
        endpoint,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestBody),
        },
        REQUEST_TIMEOUT
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`[VertexClient] API error ${response.status}:`, errorText);

        // Handle specific status codes
        if (response.status === 401) {
          clearTokenCache();
          lastError = new Error(`401 Authentication failed`);
          if (attempt < MAX_RETRIES) {
            retried = true;
            await sleep(RETRY_DELAY);
            continue;
          }
        }

        if (response.status === 429) {
          throw new Error('Rate limit exceeded');
        }

        if (response.status === 402) {
          throw new Error('Service quota exceeded');
        }

        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();

      // Extract content
      const candidate = data?.candidates?.[0];
      const content = candidate?.content?.parts?.[0]?.text;

      if (!content || typeof content !== 'string' || content.trim() === '') {
        throw new Error('Empty response from Vertex AI');
      }

      // Log RAG metadata if present
      if (candidate?.groundingMetadata) {
        console.log('[VertexClient] RAG grounding active, chunks retrieved:', 
          candidate.groundingMetadata.groundingChunks?.length || 0);
      }

      return {
        content,
        groundingMetadata: candidate?.groundingMetadata,
        cached: cachedToken !== null,
        retried,
      };

    } catch (error: any) {
      lastError = error;
      console.error(`[VertexClient] Attempt ${attempt + 1} failed:`, error.message);

      // Don't retry on certain errors
      if (error.message?.includes('Rate limit') || error.message?.includes('quota')) {
        throw error;
      }

      if (attempt < MAX_RETRIES) {
        retried = true;
        await sleep(RETRY_DELAY * (attempt + 1)); // Exponential backoff
      }
    }
  }

  throw lastError || new Error('All retry attempts failed');
}

/**
 * Create a configured Vertex client for Mindmaker
 */
export function createMindmakerVertexClient() {
  const config: VertexConfig = {
    projectId: 'gen-lang-client-0174430158',
    location: 'us-east1',
    model: 'gemini-2.5-flash',
    ragCorpusId: '6917529027641081856',
  };

  return {
    config,
    call: (options: VertexRequestOptions, serviceAccount: any) => 
      callVertexAI(config, options, serviceAccount),
  };
}


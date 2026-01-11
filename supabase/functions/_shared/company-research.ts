/**
 * Company research utilities
 * Handles multi-source company research with fallbacks
 */

import { ensureString } from './validation.ts';
import { fetchWithTimeout } from './timeout.ts';
import { retryWithBackoff } from './retry.ts';

export interface CompanyResearch {
  companyName: string;
  industry: string;
  companySize: string;
  latestNews: string;
  suggestedScope: string;
  confidence: 'high' | 'medium' | 'low';
  source?: string; // Which data source provided this
}

export interface ResearchOptions {
  domain: string;
  jobTitle?: string;
  googleAIApiKey?: string;
  useCache?: boolean;
  cacheClient?: any; // Supabase client for cache
}

/**
 * Default/fallback research data
 */
export function getDefaultResearch(domain: string): CompanyResearch {
  return {
    companyName: ensureString(domain, "Unknown Company"),
    industry: "Unknown",
    companySize: "unknown",
    latestNews: "Unable to verify company information",
    suggestedScope: "Discovery call to understand specific needs",
    confidence: "low",
    source: "default"
  };
}

/**
 * Research company using Gemini API with Google Search grounding
 */
export async function researchWithGemini(
  domain: string,
  jobTitle: string,
  apiKey: string
): Promise<CompanyResearch | null> {
  try {
    console.log(`[CompanyResearch] Starting Gemini research for: ${domain}`);
    
    // Improved prompt - prohibits "Unknown" and requires best-guess answers
    const researchPrompt = `You are a business intelligence analyst. Research the company with domain "${domain}".

TASK: Find accurate, current information about this company. The person's job title is "${jobTitle}".

CRITICAL REQUIREMENTS:
- You MUST provide a best-guess answer for ALL fields - never return "Unknown"
- Use Google Search to find current, accurate information
- For well-known companies (Tesla, Google, Microsoft, etc.), you MUST return accurate data
- For less-known companies, make your best educated guess based on available information
- companySize must be one of: startup, smb, mid-market, enterprise
  * startup = 1-50 employees
  * smb = 51-500 employees
  * mid-market = 501-5000 employees
  * enterprise = 5000+ employees

REQUIRED OUTPUT - Return ONLY a valid JSON object with NO additional text, markdown, or explanation:
{
  "companyName": "Full official company name (e.g., 'Tesla, Inc.' not 'tesla.com')",
  "industry": "Primary industry sector (e.g., 'Electric Vehicles & Clean Energy')",
  "companySize": "One of: startup, smb, mid-market, enterprise",
  "latestNews": "One sentence about recent company news, product launch, or announcement",
  "suggestedScope": "One sentence suggesting how AI/automation training could help this company",
  "confidence": "high, medium, or low based on data quality"
}

EXAMPLES OF GOOD RESPONSES:
{
  "companyName": "Tesla, Inc.",
  "industry": "Electric Vehicles & Clean Energy",
  "companySize": "enterprise",
  "latestNews": "Tesla announced expansion of Supercharger network to 50,000 stations globally",
  "suggestedScope": "AI training for manufacturing and supply chain optimization",
  "confidence": "high"
}

Return ONLY the JSON object, no markdown code blocks, no explanation text.`;

    // Build request body - use responseMimeType for structured JSON output
    const requestBody: any = {
      contents: [{
        parts: [{
          text: researchPrompt
        }]
      }],
      tools: [{
        googleSearchRetrieval: {} // Enable Google Search grounding
      }],
      generationConfig: {
        temperature: 0.3,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 1024,
        // Request JSON output format (Gemini 1.5 Pro supports this)
        responseMimeType: "application/json"
      }
    };

    // Retry with exponential backoff for transient failures
    const response = await retryWithBackoff(
      async () => {
        return await fetchWithTimeout(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${apiKey}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(requestBody),
          },
          30000 // 30 second timeout
        );
      },
      {
        maxRetries: 2, // 1 initial + 2 retries = 3 total attempts
        initialDelayMs: 1000,
        maxDelayMs: 5000,
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[CompanyResearch] Gemini API error (${response.status}):`, errorText);
      
      // Don't throw on 4xx errors (client errors) - these are permanent
      if (response.status >= 400 && response.status < 500) {
        console.error(`[CompanyResearch] Client error - not retrying`);
        return null;
      }
      
      throw new Error(`Gemini API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log(`[CompanyResearch] Gemini raw response received`);

    // Extract text from Gemini response - check multiple possible paths
    let responseText = "";
    if (data.candidates?.[0]?.content?.parts?.[0]?.text) {
      responseText = data.candidates[0].content.parts[0].text;
    } else if (data.candidates?.[0]?.content?.parts) {
      // Sometimes text is in multiple parts
      responseText = data.candidates[0].content.parts.map((p: any) => p.text || "").join("");
    }

    // Check for safety filters or blocked content
    const candidate = data.candidates?.[0];
    if (candidate?.finishReason && candidate.finishReason !== 'STOP') {
      console.warn(`[CompanyResearch] Response blocked - finishReason: ${candidate.finishReason}`);
      if (candidate.safetyRatings) {
        console.warn(`[CompanyResearch] Safety ratings:`, candidate.safetyRatings);
      }
    }

    if (!responseText || responseText.trim() === '') {
      console.warn(`[CompanyResearch] Empty response from Gemini API`);
      return null;
    }

    console.log(`[CompanyResearch] Response text length: ${responseText.length}`);

    // Parse JSON response - with structured output, should be clean JSON
    let parsed: any = null;
    try {
      // Try direct parse first (structured output should return clean JSON)
      parsed = JSON.parse(responseText.trim());
    } catch (parseError) {
      // Fallback: Remove markdown code blocks if present
      let jsonText = responseText.replace(/```json\s*/gi, '').replace(/```\s*/g, '').trim();
      
      // Try to find JSON object
      const jsonMatch = jsonText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        try {
          parsed = JSON.parse(jsonMatch[0]);
        } catch (e) {
          console.error(`[CompanyResearch] Failed to parse JSON:`, e);
          // Try regex extraction as last resort
          const nameMatch = responseText.match(/"companyName"\s*:\s*"([^"]+)"/i);
          const industryMatch = responseText.match(/"industry"\s*:\s*"([^"]+)"/i);
          const sizeMatch = responseText.match(/"companySize"\s*:\s*"([^"]+)"/i);
          const newsMatch = responseText.match(/"latestNews"\s*:\s*"([^"]+)"/i);
          
          if (nameMatch || industryMatch || sizeMatch) {
            parsed = {
              companyName: nameMatch ? nameMatch[1] : undefined,
              industry: industryMatch ? industryMatch[1] : undefined,
              companySize: sizeMatch ? sizeMatch[1] : undefined,
              latestNews: newsMatch ? newsMatch[1] : undefined,
            };
          } else {
            throw new Error('Could not extract JSON from response');
          }
        }
      } else {
        throw new Error('No JSON object found in response');
      }
    }

    // Validate and build research object
    if (!parsed || typeof parsed !== 'object') {
      console.error(`[CompanyResearch] Invalid parsed data:`, parsed);
      return null;
    }

    // Ensure all required fields with fallbacks
    const research: CompanyResearch = {
      companyName: ensureString(parsed.companyName, domain || "Unknown Company"),
      industry: ensureString(parsed.industry, "Technology"), // Default to generic instead of "Unknown"
      companySize: ensureString(parsed.companySize, "smb"), // Default to smb instead of "unknown"
      latestNews: ensureString(parsed.latestNews, "Company information verified"),
      suggestedScope: ensureString(parsed.suggestedScope, "Discovery call to understand specific AI/automation needs"),
      confidence: (parsed.confidence === 'high' || parsed.confidence === 'medium' || parsed.confidence === 'low') 
        ? parsed.confidence 
        : 'medium',
      source: 'gemini'
    };

    // Prohibit "Unknown" values - replace with best guesses
    if (research.industry.toLowerCase() === 'unknown') {
      research.industry = "Technology"; // Generic fallback
      research.confidence = 'low';
    }
    if (research.companySize.toLowerCase() === 'unknown') {
      research.companySize = "smb"; // Generic fallback
      research.confidence = 'low';
    }

    console.log(`[CompanyResearch] ✅ Successfully researched:`, {
      companyName: research.companyName,
      industry: research.industry,
      companySize: research.companySize,
      confidence: research.confidence
    });

    return research;

  } catch (error) {
    console.error(`[CompanyResearch] Error researching with Gemini:`, error);
    return null;
  }
}

/**
 * Check cache for existing research
 */
export async function getCachedResearch(
  domain: string,
  cacheClient: any
): Promise<CompanyResearch | null> {
  if (!cacheClient) return null;

  try {
    const { data, error } = await cacheClient
      .from('company_research_cache')
      .select('*')
      .eq('domain', domain.toLowerCase())
      .eq('expires_at', '>', new Date().toISOString())
      .single();

    if (error || !data) {
      return null;
    }

    console.log(`[CompanyResearch] Cache hit for domain: ${domain}`);
    return data.research_data as CompanyResearch;
  } catch (error) {
    console.error(`[CompanyResearch] Cache lookup error:`, error);
    return null;
  }
}

/**
 * Save research to cache
 */
export async function saveResearchToCache(
  domain: string,
  research: CompanyResearch,
  cacheClient: any,
  ttlDays: number = 30
): Promise<void> {
  if (!cacheClient) return;

  try {
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + ttlDays);

    await cacheClient
      .from('company_research_cache')
      .upsert({
        domain: domain.toLowerCase(),
        research_data: research,
        expires_at: expiresAt.toISOString(),
        updated_at: new Date().toISOString(),
      });

    console.log(`[CompanyResearch] Cached research for domain: ${domain}`);
  } catch (error) {
    console.error(`[CompanyResearch] Cache save error:`, error);
    // Don't throw - caching failure shouldn't break the flow
  }
}

/**
 * Main research function with caching and fallbacks
 */
export async function researchCompany(options: ResearchOptions): Promise<CompanyResearch> {
  const { domain, jobTitle = '', googleAIApiKey, useCache = true, cacheClient } = options;

  // Check cache first
  if (useCache && cacheClient) {
    const cached = await getCachedResearch(domain, cacheClient);
    if (cached) {
      return cached;
    }
  }

  // Try Gemini API if key is available
  if (googleAIApiKey) {
    const geminiResult = await researchWithGemini(domain, jobTitle, googleAIApiKey);
    if (geminiResult) {
      // Save to cache
      if (useCache && cacheClient) {
        await saveResearchToCache(domain, geminiResult, cacheClient);
      }
      return geminiResult;
    }
  }

  // Fallback to default
  console.warn(`[CompanyResearch] Using default research for domain: ${domain}`);
  const defaultResearch = getDefaultResearch(domain);
  
  // Save default to cache with shorter TTL (1 day) to avoid repeated API calls for unknown companies
  if (useCache && cacheClient) {
    await saveResearchToCache(domain, defaultResearch, cacheClient, 1);
  }
  
  return defaultResearch;
}

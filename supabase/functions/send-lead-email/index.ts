/**
 * @file send-lead-email Edge Function
 * @description Processes lead submissions with AI-powered company research and sends
 *              enriched lead notification emails via Resend with retry logic.
 * @dependencies Resend API, Google AI (Gemini) API
 * @secrets RESEND_API_KEY, GOOGLE_AI_API_KEY
 * 
 * Request:
 *   POST { name, email, jobTitle, selectedProgram, commitmentLevel, audienceType, pathType, sessionData }
 * 
 * Response:
 *   { success: true } or { error: string }
 * 
 * Features:
 *   - Company research via Gemini with Google Search grounding (skipped for personal email domains)
 *   - Structured output for reliable parsing
 *   - Exponential backoff retry (3 attempts)
 *   - Session engagement data included in email
 *   - Commitment level prominently displayed
 */

import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { createLogger, extractRequestContext } from '../_shared/logger.ts';
import { fetchWithTimeout } from '../_shared/timeout.ts';
import { extractDomain, validateEnvVars, ensureString } from '../_shared/validation.ts';

// Validate required environment variables at startup
const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const googleAIApiKey = Deno.env.get("GOOGLE_AI_API_KEY");

const envValidation = validateEnvVars({
  RESEND_API_KEY: RESEND_API_KEY,
});

if (!envValidation.isValid) {
  console.error("CRITICAL: Missing required environment variables:", envValidation.missing);
  // Don't throw here - we'll handle it in the handler to return proper error response
}

// Initialize Supabase client for database operations
// In Supabase Edge Functions, these are available via environment variables
// SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY should be set in Supabase dashboard
const getSupabaseClient = () => {
  const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
  const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
  
  if (!supabaseUrl || !supabaseServiceKey) {
    console.warn("Supabase credentials not available - database insert will be skipped");
    console.warn("Required env vars: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY");
    return null;
  }
  
  return createClient(supabaseUrl, supabaseServiceKey);
};

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// HTML escape helper to prevent XSS in email content
const escapeHtml = (str: string | undefined | null): string => {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
};

// Input validation schemas
const sessionDataSchema = z.object({
  frictionMap: z.object({
    problem: z.string().max(1000),
    timeSaved: z.number(),
    toolRecommendations: z.array(z.string()),
    generatedAt: z.string(),
  }).optional(),
  portfolioBuilder: z.object({
    selectedTasks: z.array(z.object({
      name: z.string(),
      hours: z.number(),
      savings: z.number(),
    })),
    totalTimeSaved: z.number(),
    totalCostSavings: z.number(),
  }).optional(),
  assessment: z.object({
    profileType: z.string(),
    profileDescription: z.string(),
    recommendedProduct: z.string(),
  }).optional(),
  tryItWidget: z.object({
    challenges: z.array(z.object({
      input: z.string(),
      response: z.string(),
      timestamp: z.string(),
    })),
  }).optional(),
  pagesVisited: z.array(z.string()).default([]),
  timeOnSite: z.number().default(0),
  scrollDepth: z.number().default(0),
});

const leadRequestSchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name too long"),
  email: z.string().email("Invalid email format").max(255, "Email too long"),
  jobTitle: z.string().max(100, "Job title too long").default(""),
  selectedProgram: z.string().max(50).default("not-sure"),
  commitmentLevel: z.string().max(20).optional(), // e.g., "1hr", "3hr", "4wk", "90d"
  audienceType: z.string().max(20).optional(), // "individual" or "team"
  pathType: z.string().max(20).optional(), // "build" or "orchestrate" (for individual)
  sessionData: sessionDataSchema.default({
    pagesVisited: [],
    timeOnSite: 0,
    scrollDepth: 0,
  }),
});

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Validate and sanitize RESEND_API_KEY early - fail fast if missing
    if (!RESEND_API_KEY || RESEND_API_KEY.trim() === '') {
      console.error("CRITICAL: RESEND_API_KEY is not configured");
      return new Response(
        JSON.stringify({ error: "Email service configuration error. Please contact support." }),
        { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Sanitize API key: trim whitespace and validate format
    const sanitizedApiKey = RESEND_API_KEY.trim();
    if (!sanitizedApiKey.startsWith('re_')) {
      console.error("CRITICAL: RESEND_API_KEY format invalid (should start with 're_')");
      console.error("API key first 10 chars:", sanitizedApiKey.substring(0, 10));
      return new Response(
        JSON.stringify({ error: "Email service configuration error. Please contact support." }),
        { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Log API key info (for debugging, not full key)
    console.log("API key configured:", {
      present: true,
      length: sanitizedApiKey.length,
      startsWith: sanitizedApiKey.substring(0, 3),
      format: "valid"
    });

    const body = await req.json();
    
    // Validate input
    const parseResult = leadRequestSchema.safeParse(body);
    if (!parseResult.success) {
      console.error("Validation failed:", parseResult.error.flatten());
      return new Response(
        JSON.stringify({ error: "Invalid input", details: parseResult.error.flatten().fieldErrors }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }
    
    const { name, email, jobTitle, selectedProgram, commitmentLevel, audienceType, pathType, sessionData } = parseResult.data;
    console.log("Processing lead:", { name, email, jobTitle, commitmentLevel, audienceType, pathType });

    // Safely extract domain from email
    const domain = extractDomain(email);
    if (!domain) {
      console.error("Invalid email format - cannot extract domain:", email);
      return new Response(
        JSON.stringify({ error: "Invalid email format" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }
    
    // Calculate engagement score early (needed for database insert)
    const engagementFactors = [
      sessionData.frictionMap ? 25 : 0,
      sessionData.portfolioBuilder && sessionData.portfolioBuilder.selectedTasks.length > 0 ? 25 : 0,
      sessionData.assessment ? 20 : 0,
      sessionData.tryItWidget && sessionData.tryItWidget.challenges.length > 0 ? 15 : 0,
      Math.min(sessionData.timeOnSite / 180 * 10, 10), // Max 10 points for 3+ min
      Math.min(sessionData.scrollDepth / 100 * 5, 5), // Max 5 points for 100% scroll
    ];
    const engagementScore = Math.round(engagementFactors.reduce((a, b) => a + b, 0));
    
    // Research company using Gemini with Google Search grounding
    // Ensure companyName is always a string (never undefined)
    let companyResearch = {
      companyName: ensureString(domain, "Unknown Company"),
      industry: "Unknown",
      companySize: "unknown",
      latestNews: "Unable to verify company information",
      suggestedScope: "Discovery call to understand specific needs",
      confidence: "low"
    };

    // Personal email domains to skip
    const personalDomains = ["gmail.com", "yahoo.com", "hotmail.com", "outlook.com", "icloud.com", "me.com", "protonmail.com", "aol.com"];
    const isPersonalEmail = personalDomains.some(pd => domain.toLowerCase().includes(pd));

    // Log AI research status for debugging
    if (!googleAIApiKey) {
      console.warn("⚠️ GOOGLE_AI_API_KEY not configured - company research will be skipped");
      console.warn("To enable AI company research, add GOOGLE_AI_API_KEY to Supabase Edge Function secrets");
    } else if (isPersonalEmail) {
      console.log("Personal email domain detected - skipping company research");
    } else {
      console.log("AI company research enabled for domain:", domain);
    }

    if (googleAIApiKey && domain && !isPersonalEmail) {
      try {
        console.log("Starting Gemini company research for:", domain);
        
        // More explicit prompt with better JSON formatting instructions
        const researchPrompt = `You are a business intelligence analyst. Research the company with domain "${domain}".

TASK: Find accurate, current information about this company. The person's job title is "${jobTitle}".

REQUIRED OUTPUT - Return ONLY a valid JSON object with NO additional text:
{
  "companyName": "Full official company name (e.g., 'Tesla, Inc.' not 'tesla.com')",
  "industry": "Primary industry sector (e.g., 'Electric Vehicles & Clean Energy')",
  "companySize": "One of: startup, smb, mid-market, enterprise",
  "latestNews": "One sentence about recent company news, product launch, or announcement",
  "suggestedScope": "One sentence suggesting how AI/automation training could help this company",
  "confidence": "high, medium, or low based on data quality"
}

RULES:
- Use Google Search to find current, accurate information
- For well-known companies (Tesla, Google, Microsoft, etc.), you MUST return accurate data
- companySize: startup=1-50, smb=51-500, mid-market=501-5000, enterprise=5000+
- If truly unknown, use "Unknown" but try hard to find real data first
- Return ONLY the JSON object, no markdown, no explanation`;

        // Use timeout wrapper for Gemini API (30 second timeout)
        const response = await fetchWithTimeout(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${googleAIApiKey}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
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
              }
            }),
          },
          30000 // 30 second timeout
        );

        if (!response.ok) {
          const errorText = await response.text();
          console.error("Gemini API error:", errorText);
          throw new Error(`Gemini API error: ${response.status}`);
        }

        const data = await response.json();
        console.log("Gemini research raw response:", JSON.stringify(data, null, 2));

        // Extract text from Gemini response - check multiple possible paths
        let responseText = "";
        if (data.candidates?.[0]?.content?.parts?.[0]?.text) {
          responseText = data.candidates[0].content.parts[0].text;
        } else if (data.candidates?.[0]?.content?.parts) {
          // Sometimes text is in multiple parts
          responseText = data.candidates[0].content.parts.map((p: any) => p.text || "").join("");
        }
        
        console.log("Gemini response text:", responseText);
        
        if (responseText) {
          // Try to extract JSON from the response (handle code blocks or plain JSON)
          let jsonText = responseText;
          
          // Remove markdown code blocks if present
          jsonText = jsonText.replace(/```json\s*/gi, '').replace(/```\s*/g, '').trim();
          
          // Try to find JSON object - be more aggressive
          const jsonMatch = jsonText.match(/\{[\s\S]*?\}/);
          if (jsonMatch) {
            try {
              const parsed = JSON.parse(jsonMatch[0]);
              console.log("Parsed JSON from Gemini:", parsed);
              
              companyResearch = {
                companyName: ensureString(parsed.companyName, domain || "Unknown Company"),
                industry: ensureString(parsed.industry, "Unknown"),
                companySize: ensureString(parsed.companySize, "unknown"),
                latestNews: ensureString(parsed.latestNews, "Unable to verify company information"),
                suggestedScope: ensureString(parsed.suggestedScope, "Discovery call to understand specific needs"),
                confidence: ensureString(parsed.confidence, "low")
              };
              console.log("✅ Successfully parsed company research:", companyResearch);
            } catch (parseError) {
              console.error("Failed to parse Gemini JSON response:", parseError);
              console.error("Attempted to parse:", jsonMatch[0]);
              
              // Fallback: Try to extract key fields with regex
              const nameMatch = responseText.match(/"companyName"\s*:\s*"([^"]+)"/i);
              const industryMatch = responseText.match(/"industry"\s*:\s*"([^"]+)"/i);
              const sizeMatch = responseText.match(/"companySize"\s*:\s*"([^"]+)"/i);
              const newsMatch = responseText.match(/"latestNews"\s*:\s*"([^"]+)"/i);
              
              if (nameMatch) companyResearch.companyName = ensureString(nameMatch[1], domain || "Unknown Company");
              if (industryMatch) companyResearch.industry = ensureString(industryMatch[1], "Unknown");
              if (sizeMatch) companyResearch.companySize = ensureString(sizeMatch[1], "unknown");
              if (newsMatch) companyResearch.latestNews = ensureString(newsMatch[1], "Unable to verify company information");
              
              console.log("Extracted via regex fallback:", companyResearch);
            }
          } else {
            console.warn("No JSON object found in Gemini response, trying regex extraction");
            // Try to extract any useful information
            const nameMatch = responseText.match(/(?:company\s*(?:name)?|companyName)\s*[:\-]\s*["']?([A-Z][^"'\n,]+)/i);
            if (nameMatch && nameMatch[1]) {
              companyResearch.companyName = ensureString(nameMatch[1].trim(), domain || "Unknown Company");
              console.log("Extracted company name via fallback:", companyResearch.companyName);
            }
          }
        } else {
          console.warn("Empty response from Gemini API - check API key and quota");
        }
      } catch (error) {
        console.error("Error researching company with Gemini:", error);
        console.error("Domain was:", domain);
      }
    } else {
      // Log why research was skipped
      if (!googleAIApiKey) {
        console.log("Company research skipped: GOOGLE_AI_API_KEY not set");
      } else if (!domain) {
        console.log("Company research skipped: No domain extracted");
      } else if (isPersonalEmail) {
        console.log("Company research skipped: Personal email domain");
      }
    }

    // Build comprehensive email
    const programLabels: Record<string, string> = {
      "for-you": "For You (Individual)",
      "for-team": "For Your Leadership Team",
      "for-portfolio": "For Your Business Portfolio",
      "not-sure": "Not sure yet",
      "build": "Build with AI",
      "orchestrate": "Orchestrate AI",
      "team": "Team Alignment",
      "individual": "Individual",
    };

    // Commitment level labels
    const commitmentLabels: Record<string, string> = {
      "1hr": "1 Hour Session",
      "3hr": "3 Hour Session",
      "4wk": "4 Week Program",
      "90d": "90 Day Program",
    };

    // Build session type label - ensure it's never undefined
    let sessionTypeLabel = programLabels[selectedProgram] || selectedProgram || "Not specified";
    if (audienceType === "individual" && pathType) {
      const pathLabel = programLabels[pathType] || pathType || "Individual";
      const commitmentLabel = commitmentLevel ? (commitmentLabels[commitmentLevel] || commitmentLevel) : "Not specified";
      sessionTypeLabel = `${pathLabel} - ${commitmentLabel}`;
    } else if (audienceType === "team") {
      const commitmentLabel = commitmentLevel ? (commitmentLabels[commitmentLevel] || commitmentLevel) : "Not specified";
      sessionTypeLabel = `Team Alignment - ${commitmentLabel}`;
    } else if (commitmentLevel) {
      const commitmentLabel = commitmentLabels[commitmentLevel] || commitmentLevel;
      sessionTypeLabel = `${sessionTypeLabel} - ${commitmentLabel}`;
    }
    
    // Final safety check
    if (!sessionTypeLabel || sessionTypeLabel === 'undefined') {
      sessionTypeLabel = "Not specified";
    }

    // Calculate engagement level from already-computed engagementScore
    const engagementLevel = engagementScore >= 70 ? 'Hot 🔥' : engagementScore >= 40 ? 'Warm ☀️' : 'New 🌱';

    const timeMinutes = Math.floor(sessionData.timeOnSite / 60);
    const timeSeconds = sessionData.timeOnSite % 60;

    // Final safety check: Ensure companyResearch.companyName is ALWAYS a string
    // This prevents any "Cannot read properties of undefined (reading 'replace')" errors
    companyResearch.companyName = ensureString(companyResearch.companyName, domain || "Unknown Company");
    companyResearch.industry = ensureString(companyResearch.industry, "Unknown");
    companyResearch.companySize = ensureString(companyResearch.companySize, "unknown");
    companyResearch.latestNews = ensureString(companyResearch.latestNews, "Unable to verify company information");
    companyResearch.suggestedScope = ensureString(companyResearch.suggestedScope, "Discovery call to understand specific needs");
    companyResearch.confidence = ensureString(companyResearch.confidence, "low");

    // Insert lead to database FIRST (before email send)
    // This ensures we capture the lead even if email fails
    let leadId: string | null = null;
    const supabaseClient = getSupabaseClient();
    
    if (supabaseClient) {
      try {
        const { data: leadData, error: dbError } = await supabaseClient
          .from('leads')
          .insert({
            name,
            email,
            job_title: jobTitle,
            selected_program: selectedProgram,
            commitment_level: commitmentLevel,
            audience_type: audienceType,
            path_type: pathType,
            session_data: sessionData,
            company_research: companyResearch,
            engagement_score: engagementScore,
          })
          .select()
          .single();

        if (dbError) {
          console.error('Database insert error:', dbError);
          // Continue with email send even if DB fails - don't block the flow
        } else {
          leadId = leadData?.id || null;
          console.log('Lead saved to database:', leadId);
        }
      } catch (dbErr) {
        console.error('Database insert exception:', dbErr);
        // Continue with email send even if DB fails
      }
    } else {
      console.warn('Supabase client not available - skipping database insert');
    }

    // Build email HTML - Clean Minimal Apple-Style Design
    // High contrast, excellent readability, professional
    let emailHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', Roboto, sans-serif; line-height: 1.5; color: #1d1d1f; max-width: 600px; margin: 0 auto; padding: 0; background-color: #f5f5f7;">
  
  <!-- Outer Container -->
  <div style="background: #ffffff; margin: 20px; border-radius: 20px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.08);">
    
    <!-- Header -->
    <div style="background: #1d1d1f; padding: 40px 32px; text-align: center;">
      <p style="color: #86868b; margin: 0 0 8px 0; font-size: 11px; text-transform: uppercase; letter-spacing: 1.5px; font-weight: 600;">New Lead</p>
      <h1 style="color: #ffffff; margin: 0; font-size: 32px; font-weight: 700; letter-spacing: -0.5px;">${escapeHtml(name)}</h1>
      <p style="color: #a1a1a6; margin: 8px 0 0 0; font-size: 17px; font-weight: 400;">${escapeHtml(jobTitle || 'Role not specified')}</p>
    </div>
    
    <!-- Contact Email - HIGH CONTRAST -->
    <div style="background: #0071e3; padding: 24px 32px; text-align: center;">
      <p style="color: rgba(255,255,255,0.7); margin: 0 0 6px 0; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; font-weight: 600;">Contact Email</p>
      <a href="mailto:${escapeHtml(email)}" style="color: #ffffff; font-size: 20px; font-weight: 600; text-decoration: none; word-break: break-all;">${escapeHtml(email)}</a>
    </div>
    
    <!-- Main Content -->
    <div style="padding: 32px;">
      
      <!-- Company Card -->
      <div style="background: #f5f5f7; border-radius: 12px; padding: 24px; margin-bottom: 20px;">
        <h2 style="color: #1d1d1f; margin: 0 0 16px 0; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Company Intelligence</h2>
        
        <div style="margin-bottom: 12px;">
          <span style="color: #86868b; font-size: 13px; font-weight: 500;">Company</span>
          <p style="color: #1d1d1f; margin: 4px 0 0 0; font-size: 17px; font-weight: 600;">${escapeHtml(companyResearch.companyName)}</p>
        </div>
        
        <div style="margin-bottom: 12px;">
          <span style="color: #86868b; font-size: 13px; font-weight: 500;">Industry</span>
          <p style="color: #1d1d1f; margin: 4px 0 0 0; font-size: 15px; font-weight: 500;">${escapeHtml(companyResearch.industry)}</p>
        </div>
        
        <div style="margin-bottom: ${companyResearch.latestNews && companyResearch.latestNews !== 'Unable to verify company information' ? '12px' : '0'};">
          <span style="color: #86868b; font-size: 13px; font-weight: 500;">Size</span>
          <p style="color: #1d1d1f; margin: 4px 0 0 0; font-size: 15px; font-weight: 500; text-transform: capitalize;">${escapeHtml(companyResearch.companySize)}</p>
        </div>
        
        ${companyResearch.latestNews && companyResearch.latestNews !== 'Unable to verify company information' ? `
        <div>
          <span style="color: #86868b; font-size: 13px; font-weight: 500;">Recent News</span>
          <p style="color: #1d1d1f; margin: 4px 0 0 0; font-size: 14px; font-weight: 400; line-height: 1.5;">${escapeHtml(companyResearch.latestNews)}</p>
        </div>
        ` : ''}
        
        ${companyResearch.confidence && companyResearch.confidence !== 'low' ? `
        <div style="margin-top: 16px; padding-top: 16px; border-top: 1px solid #d2d2d7;">
          <span style="display: inline-block; background: ${companyResearch.confidence === 'high' ? '#34c759' : '#ff9500'}; color: #ffffff; padding: 4px 10px; border-radius: 6px; font-size: 11px; font-weight: 600; text-transform: uppercase;">AI Confidence: ${escapeHtml(companyResearch.confidence)}</span>
        </div>
        ` : ''}
      </div>

      <!-- Program Interest -->
      ${commitmentLevel || sessionTypeLabel !== 'Not specified' ? `
      <div style="background: #1d1d1f; border-radius: 12px; padding: 24px; margin-bottom: 20px;">
        <h2 style="color: #86868b; margin: 0 0 12px 0; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Program Interest</h2>
        ${commitmentLevel ? `
        <p style="color: #ffffff; margin: 0 0 4px 0; font-size: 24px; font-weight: 700;">${escapeHtml(commitmentLabels[commitmentLevel] || commitmentLevel)}</p>
        ` : ''}
        <p style="color: #a1a1a6; margin: 0; font-size: 15px; font-weight: 500;">${escapeHtml(sessionTypeLabel)}</p>
      </div>
      ` : ''}
    `;

    // Add session engagement data - only if there's meaningful data
    const hasEngagementData = sessionData.frictionMap || 
      (sessionData.portfolioBuilder && sessionData.portfolioBuilder.selectedTasks.length > 0) ||
      sessionData.assessment ||
      (sessionData.tryItWidget && sessionData.tryItWidget.challenges.length > 0);
    
    if (hasEngagementData) {
      emailHtml += `
      <!-- Session Activity -->
      <div style="background: #f5f5f7; border-radius: 12px; padding: 24px; margin-bottom: 20px;">
        <h2 style="color: #1d1d1f; margin: 0 0 16px 0; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Session Activity</h2>
      `;
      
      if (sessionData.frictionMap) {
        emailHtml += `
        <div style="background: #ffffff; border-radius: 8px; padding: 16px; margin-bottom: 12px;">
          <p style="color: #1d1d1f; margin: 0 0 8px 0; font-size: 14px; font-weight: 600;">Friction Map Tool</p>
          <p style="color: #86868b; margin: 0 0 4px 0; font-size: 13px;">Problem: "${escapeHtml(sessionData.frictionMap.problem)}"</p>
          <p style="color: #1d1d1f; margin: 0; font-size: 13px; font-weight: 500;">Potential savings: ${sessionData.frictionMap.timeSaved}h/week</p>
        </div>
        `;
      }

      if (sessionData.portfolioBuilder && sessionData.portfolioBuilder.selectedTasks.length > 0) {
        emailHtml += `
        <div style="background: #ffffff; border-radius: 8px; padding: 16px; margin-bottom: 12px;">
          <p style="color: #1d1d1f; margin: 0 0 8px 0; font-size: 14px; font-weight: 600;">Portfolio Builder</p>
          <p style="color: #1d1d1f; margin: 0 0 4px 0; font-size: 13px;"><strong>${sessionData.portfolioBuilder.totalTimeSaved}h/week</strong> time savings</p>
          <p style="color: #34c759; margin: 0; font-size: 13px; font-weight: 600;">$${sessionData.portfolioBuilder.totalCostSavings.toLocaleString()}/month potential</p>
        </div>
        `;
      }

      if (sessionData.assessment) {
        emailHtml += `
        <div style="background: #ffffff; border-radius: 8px; padding: 16px; margin-bottom: 12px;">
          <p style="color: #1d1d1f; margin: 0 0 8px 0; font-size: 14px; font-weight: 600;">Assessment Completed</p>
          <p style="color: #86868b; margin: 0 0 4px 0; font-size: 13px;">Profile: ${escapeHtml(sessionData.assessment.profileType)}</p>
          <p style="color: #1d1d1f; margin: 0; font-size: 13px;">Recommended: ${escapeHtml(sessionData.assessment.recommendedProduct)}</p>
        </div>
        `;
      }

      if (sessionData.tryItWidget && sessionData.tryItWidget.challenges.length > 0) {
        const lastChallenge = sessionData.tryItWidget.challenges[sessionData.tryItWidget.challenges.length - 1];
        emailHtml += `
        <div style="background: #ffffff; border-radius: 8px; padding: 16px;">
          <p style="color: #1d1d1f; margin: 0 0 8px 0; font-size: 14px; font-weight: 600;">Try It Widget (${sessionData.tryItWidget.challenges.length}x)</p>
          <p style="color: #86868b; margin: 0; font-size: 13px; font-style: italic;">"${escapeHtml(lastChallenge.input.substring(0, 100))}${lastChallenge.input.length > 100 ? '...' : ''}"</p>
        </div>
        `;
      }
      
      emailHtml += `</div>`;
    }

    // Add closing sections to email
    emailHtml += `
      <!-- Engagement Metrics -->
      <div style="display: flex; justify-content: space-between; padding: 20px 0; border-top: 1px solid #d2d2d7;">
        <div style="text-align: center; flex: 1;">
          <p style="color: #86868b; margin: 0; font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px;">Engagement</p>
          <p style="color: #1d1d1f; margin: 6px 0 0 0; font-size: 18px; font-weight: 600;">${engagementLevel}</p>
        </div>
        <div style="text-align: center; flex: 1; border-left: 1px solid #d2d2d7; border-right: 1px solid #d2d2d7;">
          <p style="color: #86868b; margin: 0; font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px;">Score</p>
          <p style="color: #1d1d1f; margin: 6px 0 0 0; font-size: 18px; font-weight: 600;">${engagementScore}/100</p>
        </div>
        <div style="text-align: center; flex: 1;">
          <p style="color: #86868b; margin: 0; font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px;">Time on Site</p>
          <p style="color: #1d1d1f; margin: 6px 0 0 0; font-size: 18px; font-weight: 600;">${timeMinutes}:${timeSeconds.toString().padStart(2, '0')}</p>
        </div>
      </div>
    </div>
    
    <!-- Footer -->
    <div style="text-align: center; padding: 20px 32px;">
      <p style="margin: 0; color: #86868b; font-size: 12px;">Lead captured at <a href="https://www.themindmaker.ai" style="color: #0071e3; text-decoration: none;">themindmaker.ai</a></p>
    </div>
  </div>
</body>
</html>
    `;

    // Send email with retry logic
    let emailSent = false;
    let lastError: Error | null = null;
    const maxRetries = 3;
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        console.log(`Email send attempt ${attempt}/${maxRetries}`);
        
        // Log request details for debugging
        const requestBody = {
          from: 'Mindmaker Leads <leads@themindmaker.ai>',
          to: ['krish@themindmaker.ai'],
          reply_to: email,
          subject: `🎯 Lead: ${name} from ${companyResearch.companyName} - ${sessionTypeLabel}`,
          html: emailHtml,
        };
        
        console.log("Resend API request details:", {
          url: 'https://api.resend.com/emails',
          method: 'POST',
          hasApiKey: !!sanitizedApiKey,
          apiKeyLength: sanitizedApiKey.length,
          apiKeyPrefix: sanitizedApiKey.substring(0, 5),
          from: requestBody.from,
          to: requestBody.to,
          subjectLength: requestBody.subject.length,
          htmlLength: requestBody.html.length
        });
        
        // CRITICAL FIX: Use regular fetch instead of fetchWithTimeout
        // Working functions (send-contact-email, send-leadership-insights-email) use regular fetch
        // The AbortController signal in fetchWithTimeout may interfere with Resend API authentication
        const emailResponse = await fetch(
          'https://api.resend.com/emails',
          {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${sanitizedApiKey}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),
          }
        );

        if (!emailResponse.ok) {
          const errorText = await emailResponse.text();
          
          // Enhanced error logging for debugging
          console.error("Resend API error details:", {
            status: emailResponse.status,
            statusText: emailResponse.statusText,
            errorBody: errorText,
            attempt: attempt,
            requestHeaders: {
              'Authorization': `Bearer ${sanitizedApiKey.substring(0, 5)}...`,
              'Content-Type': 'application/json'
            },
            responseHeaders: Object.fromEntries(emailResponse.headers.entries())
          });
          
          lastError = new Error(`Resend API error (${emailResponse.status}): ${errorText}`);
          console.error(`Email send attempt ${attempt} failed:`, lastError.message);
          
          // Exponential backoff: 1s, 2s, 4s
          if (attempt < maxRetries) {
            const backoffMs = Math.pow(2, attempt - 1) * 1000;
            console.log(`Retrying in ${backoffMs}ms...`);
            await new Promise(resolve => setTimeout(resolve, backoffMs));
            continue;
          }
          
          throw lastError;
        }

        const emailData = await emailResponse.json();
        console.log("Email sent successfully:", emailData);
        emailSent = true;
        
        // Update lead record with email status
        if (leadId && supabaseClient) {
          try {
            await supabaseClient
              .from('leads')
              .update({ 
                email_sent: true,
                email_sent_at: new Date().toISOString()
              })
              .eq('id', leadId);
            console.log('Lead email status updated:', leadId);
          } catch (updateErr) {
            console.error('Failed to update lead email status:', updateErr);
            // Don't fail the whole request if update fails
          }
        }
        
        break;
        
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));
        console.error(`Email attempt ${attempt} error:`, lastError);
        
        if (attempt < maxRetries) {
          const backoffMs = Math.pow(2, attempt - 1) * 1000;
          console.log(`Network error, retrying in ${backoffMs}ms...`);
          await new Promise(resolve => setTimeout(resolve, backoffMs));
        }
      }
    }
    
    if (!emailSent) {
      console.error("CRITICAL: Email failed after all retry attempts");
      throw new Error(`Email delivery failed after ${maxRetries} attempts: ${lastError?.message || 'Unknown error'}`);
    }

    return new Response(JSON.stringify({ 
      success: true, 
      leadId: leadId 
    }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("Error in send-lead-email function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
};

serve(handler);

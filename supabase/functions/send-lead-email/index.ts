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

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const googleAIApiKey = Deno.env.get("GOOGLE_AI_API_KEY");

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

    // Extract domain from email
    const domain = email.split("@")[1];
    
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
    let companyResearch = {
      companyName: domain,
      industry: "Unknown",
      companySize: "unknown",
      latestNews: "Unable to verify company information",
      suggestedScope: "Discovery call to understand specific needs",
      confidence: "low"
    };

    // Personal email domains to skip
    const personalDomains = ["gmail.com", "yahoo.com", "hotmail.com", "outlook.com", "icloud.com", "me.com", "protonmail.com", "aol.com"];
    const isPersonalEmail = personalDomains.some(pd => domain.toLowerCase().includes(pd));

    if (googleAIApiKey && domain && !isPersonalEmail) {
      try {
        const researchPrompt = `You are a business research assistant. Research the company associated with the email domain "${domain}" and the person's job title "${jobTitle}".

Please provide the following information:
1. The actual company name (not just the domain)
2. The industry/sector they operate in
3. Company size category: startup (1-50 employees), smb (51-500), mid-market (501-5000), enterprise (5000+), or unknown
4. Their most recent significant business news from the past 6 months (acquisition, funding round, product launch, leadership change, expansion, partnership, etc.). If no recent news found, say "No recent significant news found"
5. Based on their interest in "${selectedProgram}" and commitment level "${commitmentLevel || 'not specified'}", suggest a one-sentence scope of work that would be relevant to their business needs

IMPORTANT: Use Google Search to find current, accurate information. If you cannot find reliable information, explicitly state "Unable to verify" rather than making assumptions.

Format your response as a JSON object with these exact keys:
{
  "companyName": "string",
  "industry": "string",
  "companySize": "startup|smb|mid-market|enterprise|unknown",
  "latestNews": "string (one sentence)",
  "suggestedScope": "string (one sentence)",
  "confidence": "high|medium|low"
}`;

        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${googleAIApiKey}`, {
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
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error("Gemini API error:", errorText);
          throw new Error(`Gemini API error: ${response.status}`);
        }

        const data = await response.json();
        console.log("Gemini research response:", JSON.stringify(data, null, 2));

        // Extract text from Gemini response
        const responseText = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
        
        if (responseText) {
          // Try to extract JSON from the response (handle code blocks or plain JSON)
          let jsonText = responseText;
          
          // Remove markdown code blocks if present
          jsonText = jsonText.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim();
          
          // Try to find JSON object
          const jsonMatch = jsonText.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            try {
              const parsed = JSON.parse(jsonMatch[0]);
              companyResearch = {
                companyName: parsed.companyName || domain,
                industry: parsed.industry || "Unknown",
                companySize: parsed.companySize || "unknown",
                latestNews: parsed.latestNews || "Unable to verify company information",
                suggestedScope: parsed.suggestedScope || "Discovery call to understand specific needs",
                confidence: parsed.confidence || "low"
              };
              console.log("Successfully parsed company research:", companyResearch);
            } catch (parseError) {
              console.error("Failed to parse Gemini JSON response:", parseError);
              console.error("Response text:", responseText);
              // Try to extract information from text if JSON parsing fails
              const companyMatch = responseText.match(/companyName["\s:]+"([^"]+)"/i) || 
                                  responseText.match(/company["\s:]+"([^"]+)"/i) ||
                                  responseText.match(/company["\s:]+([A-Z][^,\.\n]+)/i);
              if (companyMatch && companyMatch[1]) {
                companyResearch.companyName = companyMatch[1].trim();
                console.log("Extracted company name from text:", companyResearch.companyName);
              }
            }
          } else {
            console.warn("No JSON object found in Gemini response");
            // Try basic text extraction
            const companyMatch = responseText.match(/(?:company|companyName)[\s:]+([A-Z][^,\.\n]+)/i);
            if (companyMatch && companyMatch[1]) {
              companyResearch.companyName = companyMatch[1].trim();
            }
          }
        } else {
          console.warn("Empty response from Gemini API");
        }
      } catch (error) {
        console.error("Error researching company with Gemini:", error);
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

    // Calculate engagement score (0-100)
    const engagementFactors = [
      sessionData.frictionMap ? 25 : 0,
      sessionData.portfolioBuilder && sessionData.portfolioBuilder.selectedTasks.length > 0 ? 25 : 0,
      sessionData.assessment ? 20 : 0,
      sessionData.tryItWidget && sessionData.tryItWidget.challenges.length > 0 ? 15 : 0,
      Math.min(sessionData.timeOnSite / 180 * 10, 10), // Max 10 points for 3+ min
      Math.min(sessionData.scrollDepth / 100 * 5, 5), // Max 5 points for 100% scroll
    ];
    const engagementScore = Math.round(engagementFactors.reduce((a, b) => a + b, 0));
    const engagementLevel = engagementScore >= 70 ? 'Hot 🔥' : engagementScore >= 40 ? 'Warm ☀️' : 'New 🌱';

    const timeMinutes = Math.floor(sessionData.timeOnSite / 60);
    const timeSeconds = sessionData.timeOnSite % 60;

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

    // Build email HTML with CEO-grade premium design and high contrast
    // AI-AGENT READABLE: Structured data markers for easy parsing
    let emailHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif; line-height: 1.6; color: #0e1a2b; max-width: 700px; margin: 0 auto; padding: 0; background-color: #f7f7f5;">
  <!-- AI-AGENT DATA START -->
  <!-- LEAD_NAME: ${escapeHtml(name)} -->
  <!-- LEAD_EMAIL: ${escapeHtml(email)} -->
  <!-- LEAD_JOB_TITLE: ${escapeHtml(jobTitle || 'Not specified')} -->
  <!-- COMMITMENT_LEVEL: ${commitmentLevel || 'Not specified'} -->
  <!-- AUDIENCE_TYPE: ${audienceType || 'Not specified'} -->
  <!-- PATH_TYPE: ${pathType || 'Not specified'} -->
  <!-- SESSION_TYPE: ${escapeHtml(sessionTypeLabel)} -->
  <!-- COMPANY_NAME: ${escapeHtml(companyResearch.companyName)} -->
  <!-- COMPANY_INDUSTRY: ${escapeHtml(companyResearch.industry)} -->
  <!-- COMPANY_SIZE: ${escapeHtml(companyResearch.companySize)} -->
  <!-- COMPANY_NEWS: ${escapeHtml(companyResearch.latestNews)} -->
  <!-- SUGGESTED_SCOPE: ${escapeHtml(companyResearch.suggestedScope)} -->
  <!-- ENGAGEMENT_SCORE: ${engagementScore}/100 -->
  <!-- ENGAGEMENT_LEVEL: ${engagementLevel} -->
  <!-- AI-AGENT DATA END -->
  
  <!-- Premium Dark Header with High Contrast -->
  <div style="background: linear-gradient(135deg, #0e1a2b 0%, #1a2b3d 100%); padding: 40px 32px; border-radius: 0;">
    <div style="text-align: center;">
      <p style="color: #7ef4c2; margin: 0 0 12px 0; font-size: 11px; text-transform: uppercase; letter-spacing: 2px; font-weight: 700;">NEW LEAD ALERT</p>
      <h1 style="color: #ffffff; margin: 0; font-size: 36px; font-weight: 800; letter-spacing: -0.5px;">${escapeHtml(name)}</h1>
      <p style="color: #ffffff; margin: 12px 0 0 0; font-size: 18px; font-weight: 500; opacity: 1;">${escapeHtml(jobTitle || 'Role not specified')} at ${escapeHtml(companyResearch.companyName)}</p>
    </div>
    
    <!-- High Contrast Stats Cards -->
    <div style="display: flex; justify-content: center; gap: 20px; margin-top: 32px; flex-wrap: wrap;">
      <div style="background: rgba(126, 244, 194, 0.15); border: 2px solid #7ef4c2; border-radius: 12px; padding: 16px 20px; text-align: center; min-width: 120px;">
        <p style="color: #7ef4c2; margin: 0; font-size: 10px; text-transform: uppercase; letter-spacing: 1px; font-weight: 700;">ENGAGEMENT</p>
        <p style="color: #ffffff; margin: 8px 0 0 0; font-size: 24px; font-weight: 800;">${engagementLevel}</p>
      </div>
      <div style="background: rgba(255, 255, 255, 0.1); border: 2px solid rgba(255, 255, 255, 0.3); border-radius: 12px; padding: 16px 20px; text-align: center; min-width: 120px;">
        <p style="color: #ffffff; margin: 0; font-size: 10px; text-transform: uppercase; letter-spacing: 1px; font-weight: 700;">SCORE</p>
        <p style="color: #ffffff; margin: 8px 0 0 0; font-size: 24px; font-weight: 800;">${engagementScore}/100</p>
      </div>
      <div style="background: rgba(255, 255, 255, 0.1); border: 2px solid rgba(255, 255, 255, 0.3); border-radius: 12px; padding: 16px 20px; text-align: center; min-width: 140px;">
        <p style="color: #ffffff; margin: 0; font-size: 10px; text-transform: uppercase; letter-spacing: 1px; font-weight: 700;">INTEREST</p>
        <p style="color: #ffffff; margin: 8px 0 0 0; font-size: 16px; font-weight: 700; line-height: 1.3;">${escapeHtml(sessionTypeLabel)}</p>
      </div>
    </div>
  </div>
  
  <!-- White Content Section -->
  <div style="background: #ffffff; padding: 40px 32px;">
    <!-- Commitment Level - Most Prominent (if available) -->
    ${commitmentLevel ? `
    <div style="background: linear-gradient(135deg, #7ef4c2 0%, #5dd4a8 100%); border-radius: 16px; padding: 32px; margin-bottom: 32px; border: 3px solid #0e1a2b; box-shadow: 0 4px 12px rgba(14, 26, 43, 0.15);">
      <div style="display: flex; align-items: center; margin-bottom: 12px;">
        <span style="font-size: 24px; margin-right: 12px;">⏱️</span>
        <h2 style="color: #0e1a2b; margin: 0; font-size: 16px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px;">COMMITMENT LEVEL</h2>
      </div>
      <p style="color: #0e1a2b; margin: 0; font-size: 32px; font-weight: 900; line-height: 1.2;">${escapeHtml(commitmentLabels[commitmentLevel] || commitmentLevel)}</p>
      ${audienceType ? `<p style="color: #0e1a2b; margin: 12px 0 0 0; font-size: 16px; font-weight: 600; opacity: 1;">${audienceType === 'individual' ? (pathType ? `${programLabels[pathType] || pathType}` : 'Individual Program') : 'Team Alignment Program'}</p>` : ''}
    </div>
    ` : ''}

    <!-- Company Intelligence - Primary Section with High Contrast -->
    <div style="background: #f7f7f5; border-radius: 16px; padding: 32px; margin-bottom: 32px; border: 2px solid #0e1a2b; box-shadow: 0 2px 8px rgba(14, 26, 43, 0.08);">
      <div style="display: flex; align-items: center; margin-bottom: 24px;">
        <span style="font-size: 24px; margin-right: 12px;">🔍</span>
        <h2 style="color: #0e1a2b; margin: 0; font-size: 18px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px;">COMPANY INTELLIGENCE</h2>
      </div>
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="padding: 16px 0; color: #0e1a2b; font-size: 13px; width: 140px; vertical-align: top; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px;">Company:</td>
          <td style="padding: 16px 0; color: #0e1a2b; font-size: 16px; font-weight: 700;">${escapeHtml(companyResearch.companyName)}</td>
        </tr>
        <tr>
          <td style="padding: 16px 0; color: #0e1a2b; font-size: 13px; vertical-align: top; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px;">Industry:</td>
          <td style="padding: 16px 0; color: #0e1a2b; font-size: 15px; font-weight: 500;">${escapeHtml(companyResearch.industry)}</td>
        </tr>
        <tr>
          <td style="padding: 16px 0; color: #0e1a2b; font-size: 13px; vertical-align: top; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px;">Size:</td>
          <td style="padding: 16px 0; color: #0e1a2b; font-size: 15px;">
            <span style="background: #7ef4c2; color: #0e1a2b; padding: 6px 16px; border-radius: 20px; font-size: 13px; font-weight: 700; text-transform: capitalize; border: 2px solid #0e1a2b;">${escapeHtml(companyResearch.companySize)}</span>
          </td>
        </tr>
        <tr>
          <td style="padding: 16px 0; color: #0e1a2b; font-size: 13px; vertical-align: top; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px;">Latest News:</td>
          <td style="padding: 16px 0; color: #0e1a2b; font-size: 15px; line-height: 1.6; font-weight: 400;">${escapeHtml(companyResearch.latestNews)}</td>
        </tr>
        <tr>
          <td style="padding: 16px 0; color: #0e1a2b; font-size: 13px; vertical-align: top; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px;">Suggested Scope:</td>
          <td style="padding: 16px 0; color: #0e1a2b; font-size: 15px; line-height: 1.6; font-weight: 500; font-style: italic;">"${escapeHtml(companyResearch.suggestedScope)}"</td>
        </tr>
        <tr>
          <td style="padding: 16px 0; color: #0e1a2b; font-size: 13px; vertical-align: top; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px;">Confidence:</td>
          <td style="padding: 16px 0; font-size: 15px;">
            <span style="background: ${companyResearch.confidence === 'high' ? '#22c55e' : companyResearch.confidence === 'medium' ? '#f59e0b' : '#ef4444'}; color: #ffffff; padding: 6px 16px; border-radius: 20px; font-size: 13px; font-weight: 700; text-transform: uppercase; border: 2px solid ${companyResearch.confidence === 'high' ? '#16a34a' : companyResearch.confidence === 'medium' ? '#d97706' : '#dc2626'};">${escapeHtml(companyResearch.confidence)}</span>
          </td>
        </tr>
      </table>
    </div>
    `;

    // Add session engagement data
    if (sessionData.frictionMap) {
      emailHtml += `
    <div style="background: #fff8e6; border-radius: 12px; padding: 24px; margin-bottom: 24px; border-left: 4px solid #f59e0b;">
      <h3 style="color: #92400e; margin: 0 0 12px 0; font-size: 14px; font-weight: 600;">🗺️ Used Friction Map Tool</h3>
      <p style="margin: 0 0 8px 0; color: #451a03; font-size: 14px;"><strong>Problem:</strong> "${escapeHtml(sessionData.frictionMap.problem)}"</p>
      <p style="margin: 0 0 8px 0; color: #451a03; font-size: 14px;"><strong>Potential Savings:</strong> ${sessionData.frictionMap.timeSaved}h/week</p>
      <p style="margin: 0; color: #451a03; font-size: 14px;"><strong>Tools:</strong> ${sessionData.frictionMap.toolRecommendations.map(t => escapeHtml(t)).join(", ")}</p>
    </div>
      `;
    }

    if (sessionData.portfolioBuilder && sessionData.portfolioBuilder.selectedTasks.length > 0) {
      const tasks = sessionData.portfolioBuilder.selectedTasks.map(t => 
        `${escapeHtml(t.name)} (${t.hours}h/week)`
      ).join(", ");
      emailHtml += `
    <div style="background: #e8f5f0; border-radius: 12px; padding: 24px; margin-bottom: 24px; border-left: 4px solid #7ef4c2;">
      <h3 style="color: #0e1a2b; margin: 0 0 12px 0; font-size: 14px; font-weight: 600;">📊 Used Portfolio Builder</h3>
      <p style="margin: 0 0 8px 0; color: #0e1a2b; font-size: 14px;"><strong>Tasks:</strong> ${tasks}</p>
      <p style="margin: 0 0 8px 0; color: #0e1a2b; font-size: 14px;"><strong>Time Savings:</strong> ${sessionData.portfolioBuilder.totalTimeSaved}h/week</p>
      <p style="margin: 0; color: #0e1a2b; font-size: 14px;"><strong>Cost Savings:</strong> $${sessionData.portfolioBuilder.totalCostSavings.toLocaleString()}/month</p>
    </div>
      `;
    }

    if (sessionData.assessment) {
      emailHtml += `
    <div style="background: #eff6ff; border-radius: 12px; padding: 24px; margin-bottom: 24px; border-left: 4px solid #3b82f6;">
      <h3 style="color: #1e40af; margin: 0 0 12px 0; font-size: 14px; font-weight: 600;">✅ Completed Assessment</h3>
      <p style="margin: 0 0 8px 0; color: #1e3a8a; font-size: 14px;"><strong>Profile:</strong> ${escapeHtml(sessionData.assessment.profileType)}</p>
      <p style="margin: 0 0 8px 0; color: #1e3a8a; font-size: 14px;">${escapeHtml(sessionData.assessment.profileDescription)}</p>
      <p style="margin: 0; color: #1e3a8a; font-size: 14px;"><strong>Recommended:</strong> ${escapeHtml(sessionData.assessment.recommendedProduct)}</p>
    </div>
      `;
    }

    if (sessionData.tryItWidget && sessionData.tryItWidget.challenges.length > 0) {
      const lastChallenge = sessionData.tryItWidget.challenges[sessionData.tryItWidget.challenges.length - 1];
      emailHtml += `
    <div style="background: #fdf4ff; border-radius: 12px; padding: 24px; margin-bottom: 24px; border-left: 4px solid #a855f7;">
      <h3 style="color: #7e22ce; margin: 0 0 12px 0; font-size: 14px; font-weight: 600;">💡 Used Try It Widget (${sessionData.tryItWidget.challenges.length}x)</h3>
      <p style="margin: 0 0 8px 0; color: #581c87; font-size: 14px;"><strong>Last Challenge:</strong> "${escapeHtml(lastChallenge.input)}"</p>
      <p style="margin: 0; color: #581c87; font-size: 13px; font-style: italic;">"${escapeHtml(lastChallenge.response.substring(0, 200))}..."</p>
    </div>
      `;
    }

    <!-- Session Analytics - Only if meaningful -->
    ${sessionData.timeOnSite > 60 || sessionData.scrollDepth > 30 ? `
    <div style="background: #f7f7f5; border-radius: 16px; padding: 28px; margin-bottom: 32px; border: 2px solid #e5e5e3;">
      <h3 style="color: #0e1a2b; margin: 0 0 20px 0; font-size: 14px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px;">📈 SESSION ANALYTICS</h3>
      <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; text-align: center;">
        <div>
          <p style="color: #0e1a2b; margin: 0; font-size: 11px; text-transform: uppercase; font-weight: 700; letter-spacing: 0.5px;">Time on Site</p>
          <p style="color: #0e1a2b; margin: 8px 0 0 0; font-size: 24px; font-weight: 800;">${timeMinutes}:${timeSeconds.toString().padStart(2, '0')}</p>
        </div>
        <div>
          <p style="color: #0e1a2b; margin: 0; font-size: 11px; text-transform: uppercase; font-weight: 700; letter-spacing: 0.5px;">Scroll Depth</p>
          <p style="color: #0e1a2b; margin: 8px 0 0 0; font-size: 24px; font-weight: 800;">${sessionData.scrollDepth}%</p>
        </div>
        <div>
          <p style="color: #0e1a2b; margin: 0; font-size: 11px; text-transform: uppercase; font-weight: 700; letter-spacing: 0.5px;">Pages</p>
          <p style="color: #0e1a2b; margin: 8px 0 0 0; font-size: 24px; font-weight: 800;">${sessionData.pagesVisited.length || 1}</p>
        </div>
      </div>
      ${sessionData.pagesVisited.length > 0 ? `
      <p style="color: #0e1a2b; margin: 20px 0 0 0; font-size: 13px; font-weight: 500;"><strong>Journey:</strong> ${sessionData.pagesVisited.join(" → ")}</p>
      ` : ''}
    </div>
    ` : ''}
  </div>
  
  <!-- Footer -->
  <div style="text-align: center; padding: 32px; background: #0e1a2b; color: #ffffff;">
    <p style="margin: 0; color: #7ef4c2; font-size: 12px; font-weight: 600;">Lead captured at <a href="https://www.themindmaker.ai" style="color: #7ef4c2; text-decoration: none;">themindmaker.ai</a></p>
    <p style="margin: 12px 0 0 0; color: rgba(255,255,255,0.7); font-size: 11px;">© ${new Date().getFullYear()} Mindmaker LLC</p>
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
        
        const emailResponse = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${RESEND_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: 'Mindmaker Leads <leads@themindmaker.ai>',
            to: ['krish@themindmaker.ai'],
            reply_to: email, // Allow replying directly to the lead
            subject: `🎯 Lead: ${name} from ${companyResearch.companyName} - ${sessionTypeLabel}`,
            html: emailHtml,
          }),
        });

        if (!emailResponse.ok) {
          const errorText = await emailResponse.text();
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

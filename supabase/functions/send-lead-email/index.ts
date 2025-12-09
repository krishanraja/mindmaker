/**
 * @file send-lead-email Edge Function
 * @description Processes lead submissions with AI-powered company research and sends
 *              enriched lead notification emails via Resend with retry logic.
 * @dependencies Resend API, OpenAI API
 * @secrets RESEND_API_KEY, OPENAI_API_KEY
 * 
 * Request:
 *   POST { name, email, jobTitle, selectedProgram, sessionData }
 * 
 * Response:
 *   { success: true } or { error: string }
 * 
 * Features:
 *   - Company research via OpenAI (skipped for personal email domains)
 *   - Structured function calling for reliable output
 *   - Exponential backoff retry (3 attempts)
 *   - Session engagement data included in email
 */

import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";
import { createLogger, extractRequestContext } from '../_shared/logger.ts';

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const openAIApiKey = Deno.env.get("OPENAI_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// HTML escape helper to prevent XSS in email content
const escapeHtml = (str: string): string => {
  return str
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
    
    const { name, email, jobTitle, selectedProgram, sessionData } = parseResult.data;
    console.log("Processing lead:", { name, email, jobTitle });

    // Extract domain from email
    const domain = email.split("@")[1];
    
    // Research company using OpenAI with structured output
    let companyResearch = {
      companyName: domain,
      industry: "Unknown",
      companySize: "unknown",
      latestNews: "Unable to verify company information",
      suggestedScope: "Discovery call to understand specific needs",
      confidence: "low"
    };

    if (openAIApiKey && domain && !domain.includes("gmail") && !domain.includes("yahoo") && !domain.includes("hotmail")) {
      try {
        const researchPrompt = `Based on the email domain "${domain}" and the person's job title "${jobTitle}":

1. Identify the company name
2. Find their most recent significant business news (acquisition, funding, product launch, leadership change, expansion, etc.)
3. Based on their interest in "${selectedProgram}" suggest a one-sentence scope of work that would be relevant to their business needs.

If you cannot find reliable, current information, say "Unable to verify" rather than making assumptions.`;

        const response = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${openAIApiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "gpt-4o-mini",
            messages: [
              { role: "system", content: "You are a business research assistant. Provide accurate, current information or state when information cannot be verified." },
              { role: "user", content: researchPrompt }
            ],
            tools: [{
              type: "function",
              function: {
                name: "company_research",
                description: "Return structured company research",
                parameters: {
                  type: "object",
                  properties: {
                    companyName: { type: "string" },
                    industry: { type: "string" },
                    companySize: { type: "string", enum: ["startup", "smb", "mid-market", "enterprise", "unknown"] },
                    latestNews: { type: "string", description: "One sentence about their latest significant news or 'Unable to verify'" },
                    suggestedScope: { type: "string", description: "One sentence scope of work suggestion" },
                    confidence: { type: "string", enum: ["high", "medium", "low"] }
                  },
                  required: ["companyName", "latestNews", "suggestedScope", "confidence"]
                }
              }
            }],
            tool_choice: { type: "function", function: { name: "company_research" } }
          }),
        });

        const data = await response.json();
        console.log("OpenAI research response:", data);

        if (data.choices?.[0]?.message?.tool_calls?.[0]?.function?.arguments) {
          companyResearch = JSON.parse(data.choices[0].message.tool_calls[0].function.arguments);
        }
      } catch (error) {
        console.error("Error researching company:", error);
      }
    }

    // Build comprehensive email
    const programLabels: Record<string, string> = {
      "for-you": "For You (Individual)",
      "for-team": "For Your Leadership Team",
      "for-portfolio": "For Your Business Portfolio",
      "not-sure": "Not sure yet"
    };

    let emailHtml = `
      <h1>🎯 New Lead from TheMindMaker.ai</h1>
      
      <h2>Lead Details</h2>
      <ul>
        <li><strong>Name:</strong> ${escapeHtml(name)}</li>
        <li><strong>Job Title:</strong> ${escapeHtml(jobTitle)}</li>
        <li><strong>Email:</strong> ${escapeHtml(email)}</li>
        <li><strong>Interest:</strong> ${escapeHtml(programLabels[selectedProgram] || selectedProgram)}</li>
      </ul>

      <h2>🔍 Company Research</h2>
      <ul>
        <li><strong>Company:</strong> ${escapeHtml(companyResearch.companyName)}</li>
        <li><strong>Domain:</strong> ${escapeHtml(domain)}</li>
        <li><strong>Industry:</strong> ${escapeHtml(companyResearch.industry)}</li>
        <li><strong>Size:</strong> ${escapeHtml(companyResearch.companySize)}</li>
        <li><strong>Recent News:</strong> ${escapeHtml(companyResearch.latestNews)}</li>
        <li><strong>Suggested Scope:</strong> ${escapeHtml(companyResearch.suggestedScope)}</li>
        <li><strong>Confidence:</strong> ${escapeHtml(companyResearch.confidence)}</li>
      </ul>
    `;

    // Add session engagement data
    if (sessionData.frictionMap) {
      emailHtml += `
        <h2>🗺️ Friction Map (Used)</h2>
        <ul>
          <li><strong>Problem:</strong> "${escapeHtml(sessionData.frictionMap.problem)}"</li>
          <li><strong>Estimated Time Savings:</strong> ${sessionData.frictionMap.timeSaved}h/week</li>
          <li><strong>Tools Recommended:</strong> ${sessionData.frictionMap.toolRecommendations.map(t => escapeHtml(t)).join(", ")}</li>
        </ul>
      `;
    }

    if (sessionData.portfolioBuilder && sessionData.portfolioBuilder.selectedTasks.length > 0) {
      const tasks = sessionData.portfolioBuilder.selectedTasks.map(t => 
        `${escapeHtml(t.name)} (${t.hours}h/week)`
      ).join(", ");
      emailHtml += `
        <h2>📊 Portfolio Builder (Used)</h2>
        <ul>
          <li><strong>Tasks Selected:</strong> ${tasks}</li>
          <li><strong>Total Time Savings:</strong> ${sessionData.portfolioBuilder.totalTimeSaved}h/week</li>
          <li><strong>Total Cost Savings:</strong> $${sessionData.portfolioBuilder.totalCostSavings.toLocaleString()}/month</li>
        </ul>
      `;
    }

    if (sessionData.assessment) {
      emailHtml += `
        <h2>✅ Assessment (Completed)</h2>
        <ul>
          <li><strong>Profile Type:</strong> ${escapeHtml(sessionData.assessment.profileType)}</li>
          <li><strong>Description:</strong> ${escapeHtml(sessionData.assessment.profileDescription)}</li>
          <li><strong>Recommended Product:</strong> ${escapeHtml(sessionData.assessment.recommendedProduct)}</li>
        </ul>
      `;
    }

    if (sessionData.tryItWidget && sessionData.tryItWidget.challenges.length > 0) {
      const lastChallenge = sessionData.tryItWidget.challenges[sessionData.tryItWidget.challenges.length - 1];
      emailHtml += `
        <h2>💡 Try It Widget (Used ${sessionData.tryItWidget.challenges.length}x)</h2>
        <ul>
          <li><strong>Most Recent Challenge:</strong> "${escapeHtml(lastChallenge.input)}"</li>
          <li><strong>Response:</strong> "${escapeHtml(lastChallenge.response.substring(0, 150))}..."</li>
        </ul>
      `;
    }

    // Engagement signals
    const timeMinutes = Math.floor(sessionData.timeOnSite / 60);
    const timeSeconds = sessionData.timeOnSite % 60;
    emailHtml += `
      <h2>📈 Engagement Signals</h2>
      <ul>
        <li><strong>Pages Visited:</strong> ${sessionData.pagesVisited.join(", ") || "Homepage only"}</li>
        <li><strong>Time on Site:</strong> ${timeMinutes}m ${timeSeconds}s</li>
        <li><strong>Scroll Depth:</strong> ${sessionData.scrollDepth}%</li>
      </ul>
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
            from: 'MindMaker Leads <onboarding@resend.dev>',
            to: ['krish@themindmaker.ai'],
            subject: `🎯 Lead: ${name} from ${companyResearch.companyName} - ${programLabels[selectedProgram]}`,
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

    return new Response(JSON.stringify({ success: true }), {
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

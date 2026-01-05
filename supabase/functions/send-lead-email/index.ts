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

    let emailHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif; line-height: 1.6; color: #1a1a1a; max-width: 700px; margin: 0 auto; padding: 0; background-color: #f7f7f5;">
  <div style="background: linear-gradient(135deg, #0e1a2b 0%, #1a2b3d 100%); padding: 32px 24px;">
    <div style="text-align: center;">
      <p style="color: #7ef4c2; margin: 0 0 8px 0; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">New Lead Alert</p>
      <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 700;">${escapeHtml(name)}</h1>
      <p style="color: rgba(255,255,255,0.8); margin: 8px 0 0 0; font-size: 16px;">${escapeHtml(jobTitle || 'Role not specified')} at ${escapeHtml(companyResearch.companyName)}</p>
    </div>
    <div style="display: flex; justify-content: center; gap: 24px; margin-top: 24px;">
      <div style="text-align: center;">
        <p style="color: rgba(255,255,255,0.6); margin: 0; font-size: 11px; text-transform: uppercase;">Engagement</p>
        <p style="color: #7ef4c2; margin: 4px 0 0 0; font-size: 18px; font-weight: 700;">${engagementLevel}</p>
      </div>
      <div style="text-align: center;">
        <p style="color: rgba(255,255,255,0.6); margin: 0; font-size: 11px; text-transform: uppercase;">Score</p>
        <p style="color: #ffffff; margin: 4px 0 0 0; font-size: 18px; font-weight: 700;">${engagementScore}/100</p>
      </div>
      <div style="text-align: center;">
        <p style="color: rgba(255,255,255,0.6); margin: 0; font-size: 11px; text-transform: uppercase;">Interest</p>
        <p style="color: #ffffff; margin: 4px 0 0 0; font-size: 18px; font-weight: 700;">${escapeHtml(programLabels[selectedProgram] || selectedProgram)}</p>
      </div>
    </div>
  </div>
  
  <div style="background: #ffffff; padding: 32px 24px;">
    <!-- Quick Actions -->
    <div style="text-align: center; margin-bottom: 32px; padding-bottom: 24px; border-bottom: 1px solid #e5e5e3;">
      <a href="mailto:${escapeHtml(email)}" style="display: inline-block; background: #0e1a2b; color: #ffffff; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: 600; font-size: 14px; margin-right: 8px;">Email ${escapeHtml(name.split(' ')[0])}</a>
      <a href="https://www.linkedin.com/search/results/all/?keywords=${encodeURIComponent(name + ' ' + companyResearch.companyName)}" style="display: inline-block; background: #0077b5; color: #ffffff; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: 600; font-size: 14px;">Find on LinkedIn</a>
    </div>

    <!-- Company Research -->
    <div style="background: #f7f7f5; border-radius: 12px; padding: 24px; margin-bottom: 24px;">
      <h2 style="color: #0e1a2b; margin: 0 0 16px 0; font-size: 16px; font-weight: 600; display: flex; align-items: center;">
        <span style="margin-right: 8px;">🔍</span> Company Intelligence
      </h2>
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="padding: 10px 0; color: #666; font-size: 13px; width: 120px; vertical-align: top;">Company</td>
          <td style="padding: 10px 0; color: #0e1a2b; font-size: 13px; font-weight: 600;">${escapeHtml(companyResearch.companyName)}</td>
        </tr>
        <tr>
          <td style="padding: 10px 0; color: #666; font-size: 13px; vertical-align: top;">Industry</td>
          <td style="padding: 10px 0; color: #0e1a2b; font-size: 13px;">${escapeHtml(companyResearch.industry)}</td>
        </tr>
        <tr>
          <td style="padding: 10px 0; color: #666; font-size: 13px; vertical-align: top;">Size</td>
          <td style="padding: 10px 0; color: #0e1a2b; font-size: 13px;"><span style="background: #e8f5f0; color: #0e1a2b; padding: 3px 10px; border-radius: 10px; font-size: 12px;">${escapeHtml(companyResearch.companySize)}</span></td>
        </tr>
        <tr>
          <td style="padding: 10px 0; color: #666; font-size: 13px; vertical-align: top;">Latest News</td>
          <td style="padding: 10px 0; color: #0e1a2b; font-size: 13px;">${escapeHtml(companyResearch.latestNews)}</td>
        </tr>
        <tr>
          <td style="padding: 10px 0; color: #666; font-size: 13px; vertical-align: top;">Suggested Scope</td>
          <td style="padding: 10px 0; color: #0e1a2b; font-size: 13px; font-style: italic;">"${escapeHtml(companyResearch.suggestedScope)}"</td>
        </tr>
        <tr>
          <td style="padding: 10px 0; color: #666; font-size: 13px; vertical-align: top;">Confidence</td>
          <td style="padding: 10px 0; font-size: 13px;">
            <span style="background: ${companyResearch.confidence === 'high' ? '#22c55e' : companyResearch.confidence === 'medium' ? '#f59e0b' : '#ef4444'}; color: #fff; padding: 3px 10px; border-radius: 10px; font-size: 11px; text-transform: uppercase;">${escapeHtml(companyResearch.confidence)}</span>
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

    // Engagement signals
    emailHtml += `
    <div style="background: #f7f7f5; border-radius: 12px; padding: 24px;">
      <h3 style="color: #0e1a2b; margin: 0 0 16px 0; font-size: 14px; font-weight: 600;">📈 Session Analytics</h3>
      <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; text-align: center;">
        <div>
          <p style="color: #666; margin: 0; font-size: 11px; text-transform: uppercase;">Time on Site</p>
          <p style="color: #0e1a2b; margin: 4px 0 0 0; font-size: 20px; font-weight: 700;">${timeMinutes}:${timeSeconds.toString().padStart(2, '0')}</p>
        </div>
        <div>
          <p style="color: #666; margin: 0; font-size: 11px; text-transform: uppercase;">Scroll Depth</p>
          <p style="color: #0e1a2b; margin: 4px 0 0 0; font-size: 20px; font-weight: 700;">${sessionData.scrollDepth}%</p>
        </div>
        <div>
          <p style="color: #666; margin: 0; font-size: 11px; text-transform: uppercase;">Pages</p>
          <p style="color: #0e1a2b; margin: 4px 0 0 0; font-size: 20px; font-weight: 700;">${sessionData.pagesVisited.length || 1}</p>
        </div>
      </div>
      ${sessionData.pagesVisited.length > 0 ? `
      <p style="color: #666; margin: 16px 0 0 0; font-size: 12px;"><strong>Pages:</strong> ${sessionData.pagesVisited.join(" → ")}</p>
      ` : ''}
    </div>
  </div>
  
  <div style="text-align: center; padding: 24px; color: #999; font-size: 12px;">
    <p style="margin: 0;">Lead captured at <a href="https://www.themindmaker.ai" style="color: #666;">themindmaker.ai</a></p>
    <p style="margin: 8px 0 0 0;">© ${new Date().getFullYear()} Mindmaker LLC</p>
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

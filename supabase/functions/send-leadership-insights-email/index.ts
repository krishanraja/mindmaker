import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
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

// Input validation schema
const leadershipInsightsSchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name too long"),
  email: z.string().email("Invalid email format").max(255, "Email too long"),
  department: z.string().optional(),
  aiFocus: z.string().optional(),
  results: z.object({
    score: z.number(),
    tier: z.string(),
    percentile: z.number(),
    strengths: z.array(z.string()),
    growthAreas: z.array(z.string()),
    strategicInsights: z.array(z.string()),
    promptTemplates: z.array(z.string()),
    actionPlan: z.array(z.string()),
  }).optional(),
});

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    
    // Validate input
    const parseResult = leadershipInsightsSchema.safeParse(body);
    if (!parseResult.success) {
      console.error("Validation failed:", parseResult.error.flatten());
      return new Response(
        JSON.stringify({ error: "Invalid input", details: parseResult.error.flatten().fieldErrors }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }
    
    const { name, email, department, aiFocus, results } = parseResult.data;

    console.log("Processing leadership insights submission:", { name, email, department, aiFocus });

    // Generate email content
    const resultsHtml = results ? `
      <div style="background: #f7f7f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h2 style="color: #0e1a2b; margin-bottom: 16px;">Your AI Leadership Score: ${results.score}/100</h2>
        <p style="color: #666; margin-bottom: 8px;"><strong>Tier:</strong> ${escapeHtml(results.tier)}</p>
        <p style="color: #666; margin-bottom: 8px;"><strong>Percentile:</strong> Top ${100 - results.percentile}% of executives</p>
      </div>

      <h3 style="color: #0e1a2b; margin-top: 24px;">Your Strengths</h3>
      <ul style="color: #333; padding-left: 20px;">
        ${results.strengths.map(s => `<li>${escapeHtml(s)}</li>`).join('')}
      </ul>

      <h3 style="color: #0e1a2b; margin-top: 24px;">Growth Opportunities</h3>
      <ul style="color: #333; padding-left: 20px;">
        ${results.growthAreas.map(g => `<li>${escapeHtml(g)}</li>`).join('')}
      </ul>

      <h3 style="color: #0e1a2b; margin-top: 24px;">Strategic Insights</h3>
      <ol style="color: #333; padding-left: 20px;">
        ${results.strategicInsights.map(i => `<li style="margin-bottom: 8px;">${escapeHtml(i)}</li>`).join('')}
      </ol>

      <h3 style="color: #0e1a2b; margin-top: 24px;">AI Prompt Templates for You</h3>
      ${results.promptTemplates.map((p, i) => `
        <div style="background: #fff; border: 1px solid #e5e5e3; padding: 12px; border-radius: 4px; margin: 8px 0;">
          <strong>Prompt ${i + 1}:</strong><br>
          <code style="color: #0e1a2b; font-size: 13px;">${escapeHtml(p)}</code>
        </div>
      `).join('')}

      <h3 style="color: #0e1a2b; margin-top: 24px;">Your 90-Day Action Plan</h3>
      <ol style="color: #333; padding-left: 20px;">
        ${results.actionPlan.map(a => `<li style="margin-bottom: 8px;">${escapeHtml(a)}</li>`).join('')}
      </ol>
    ` : '';

    // Send email to user with their results
    const userEmailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "MindMaker AI Insights <onboarding@resend.dev>",
        to: [email],
        subject: `${name}, Your AI Leadership Benchmark Results`,
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
          </head>
          <body style="font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #0e1a2b; margin-bottom: 8px;">Your AI Leadership Insights</h1>
              <p style="color: #666;">Personalized for ${escapeHtml(name)}</p>
            </div>

            ${resultsHtml}

            <div style="background: linear-gradient(135deg, #0e1a2b, #1a2b3d); color: white; padding: 24px; border-radius: 8px; margin-top: 32px; text-align: center;">
              <h3 style="margin-bottom: 12px;">Ready to Accelerate Your AI Journey?</h3>
              <p style="margin-bottom: 16px; opacity: 0.9;">Book a 1:1 Builder Session with Krish to build your first AI system in 60 minutes.</p>
              <a href="https://www.themindmaker.ai/#book" style="display: inline-block; background: #7ef4c2; color: #0e1a2b; padding: 12px 24px; border-radius: 4px; text-decoration: none; font-weight: 600;">Book Your Session →</a>
            </div>

            <hr style="border: none; border-top: 1px solid #e5e5e3; margin: 32px 0;">
            <p style="color: #666; font-size: 12px; text-align: center;">
              You received this email because you completed the AI Leadership Benchmark at themindmaker.ai<br>
              <a href="https://www.themindmaker.ai" style="color: #0e1a2b;">www.themindmaker.ai</a>
            </p>
          </body>
          </html>
        `,
      }),
    });

    if (!userEmailResponse.ok) {
      const error = await userEmailResponse.text();
      console.error("Failed to send user email:", error);
      // Continue to send notification to Krish even if user email fails
    }

    // Send notification email to Krish
    const notificationEmailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "MindMaker Leads <leads@themindmaker.ai>",
        to: ["krish@themindmaker.ai"],
        subject: `New AI Leadership Benchmark: ${name} (${results?.tier || 'Unknown'})`,
        html: `
          <h1>New Leadership Insights Submission</h1>
          <p><strong>Name:</strong> ${escapeHtml(name)}</p>
          <p><strong>Email:</strong> ${escapeHtml(email)}</p>
          <p><strong>Department:</strong> ${department ? escapeHtml(department) : 'Not specified'}</p>
          <p><strong>AI Focus:</strong> ${aiFocus ? escapeHtml(aiFocus) : 'Not specified'}</p>
          
          ${results ? `
          <h2>Results</h2>
          <p><strong>Score:</strong> ${results.score}/100</p>
          <p><strong>Tier:</strong> ${escapeHtml(results.tier)}</p>
          <p><strong>Percentile:</strong> Top ${100 - results.percentile}%</p>
          
          <h3>Strengths</h3>
          <ul>${results.strengths.map(s => `<li>${escapeHtml(s)}</li>`).join('')}</ul>
          
          <h3>Growth Areas</h3>
          <ul>${results.growthAreas.map(g => `<li>${escapeHtml(g)}</li>`).join('')}</ul>
          ` : ''}
          
          <hr>
          <p style="color: #666; font-size: 12px;">Sent from the AI Leadership Benchmark at leaders.themindmaker.ai</p>
        `,
      }),
    });

    if (!notificationEmailResponse.ok) {
      const error = await notificationEmailResponse.text();
      throw new Error(`Resend API error: ${error}`);
    }

    const result = await notificationEmailResponse.json();
    console.log("Emails sent successfully:", result);

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-leadership-insights-email function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);

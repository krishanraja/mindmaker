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

    // Determine tier color
    const getTierColor = (tier: string) => {
      if (tier.includes('Visionary') || tier.includes('Advanced')) return '#22c55e';
      if (tier.includes('Strategic') || tier.includes('Developing')) return '#f59e0b';
      return '#ef4444';
    };

    // Generate user email content
    const userEmailHtml = results ? `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif; line-height: 1.6; color: #1a1a1a; max-width: 600px; margin: 0 auto; padding: 0; background-color: #f7f7f5;">
  <!-- Header -->
  <div style="background: linear-gradient(135deg, #0e1a2b 0%, #1a2b3d 100%); padding: 40px 24px; text-align: center;">
    <p style="color: #7ef4c2; margin: 0 0 8px 0; font-size: 12px; text-transform: uppercase; letter-spacing: 2px;">AI Leadership Benchmark</p>
    <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 700;">Your Results Are In</h1>
    <p style="color: rgba(255,255,255,0.8); margin: 12px 0 0 0; font-size: 16px;">Personalized for ${escapeHtml(name)}</p>
  </div>
  
  <div style="background: #ffffff; padding: 32px 24px;">
    <!-- Score Card -->
    <div style="background: linear-gradient(135deg, #f7f7f5 0%, #e8f5f0 100%); border-radius: 16px; padding: 32px; text-align: center; margin-bottom: 32px;">
      <p style="color: #666; margin: 0 0 8px 0; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">Your AI Leadership Score</p>
      <div style="font-size: 72px; font-weight: 800; color: #0e1a2b; margin: 0; line-height: 1;">${results.score}</div>
      <p style="color: #666; margin: 4px 0 16px 0; font-size: 14px;">out of 100</p>
      <div style="display: inline-block; background: ${getTierColor(results.tier)}; color: #ffffff; padding: 8px 20px; border-radius: 20px; font-size: 14px; font-weight: 600;">${escapeHtml(results.tier)}</div>
      <p style="color: #666; margin: 16px 0 0 0; font-size: 14px;">Top <strong>${100 - results.percentile}%</strong> of executives assessed</p>
    </div>

    <!-- Strengths -->
    <div style="margin-bottom: 28px;">
      <h2 style="color: #0e1a2b; margin: 0 0 16px 0; font-size: 18px; font-weight: 600; display: flex; align-items: center;">
        <span style="display: inline-block; width: 24px; height: 24px; background: #22c55e; border-radius: 50%; margin-right: 10px; text-align: center; line-height: 24px; font-size: 12px;">✓</span>
        Your Strengths
      </h2>
      ${results.strengths.map(s => `
      <div style="background: #f0fdf4; border-left: 3px solid #22c55e; padding: 12px 16px; margin-bottom: 8px; border-radius: 0 8px 8px 0;">
        <p style="margin: 0; color: #166534; font-size: 14px;">${escapeHtml(s)}</p>
      </div>
      `).join('')}
    </div>

    <!-- Growth Areas -->
    <div style="margin-bottom: 28px;">
      <h2 style="color: #0e1a2b; margin: 0 0 16px 0; font-size: 18px; font-weight: 600; display: flex; align-items: center;">
        <span style="display: inline-block; width: 24px; height: 24px; background: #f59e0b; border-radius: 50%; margin-right: 10px; text-align: center; line-height: 24px; font-size: 12px;">↑</span>
        Growth Opportunities
      </h2>
      ${results.growthAreas.map(g => `
      <div style="background: #fffbeb; border-left: 3px solid #f59e0b; padding: 12px 16px; margin-bottom: 8px; border-radius: 0 8px 8px 0;">
        <p style="margin: 0; color: #92400e; font-size: 14px;">${escapeHtml(g)}</p>
      </div>
      `).join('')}
    </div>

    <!-- Strategic Insights -->
    <div style="margin-bottom: 28px;">
      <h2 style="color: #0e1a2b; margin: 0 0 16px 0; font-size: 18px; font-weight: 600;">Strategic Insights</h2>
      ${results.strategicInsights.map((insight, i) => `
      <div style="display: flex; margin-bottom: 12px;">
        <div style="width: 28px; height: 28px; background: #0e1a2b; color: #fff; border-radius: 50%; text-align: center; line-height: 28px; font-size: 12px; font-weight: 600; flex-shrink: 0; margin-right: 12px;">${i + 1}</div>
        <p style="margin: 0; color: #333; font-size: 14px; padding-top: 4px;">${escapeHtml(insight)}</p>
      </div>
      `).join('')}
    </div>

    <!-- Prompt Templates -->
    <div style="background: #f7f7f5; border-radius: 12px; padding: 24px; margin-bottom: 28px;">
      <h2 style="color: #0e1a2b; margin: 0 0 16px 0; font-size: 18px; font-weight: 600;">🎯 AI Prompt Templates for You</h2>
      <p style="color: #666; margin: 0 0 16px 0; font-size: 13px;">Copy and paste these into ChatGPT or Claude:</p>
      ${results.promptTemplates.map((p, i) => `
      <div style="background: #ffffff; border: 1px solid #e5e5e3; padding: 16px; border-radius: 8px; margin-bottom: 12px;">
        <p style="color: #666; margin: 0 0 8px 0; font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px;">Prompt ${i + 1}</p>
        <code style="color: #0e1a2b; font-size: 13px; line-height: 1.5; display: block; white-space: pre-wrap;">${escapeHtml(p)}</code>
      </div>
      `).join('')}
    </div>

    <!-- 90-Day Action Plan -->
    <div style="margin-bottom: 28px;">
      <h2 style="color: #0e1a2b; margin: 0 0 16px 0; font-size: 18px; font-weight: 600;">📅 Your 90-Day Action Plan</h2>
      ${results.actionPlan.map((action, i) => `
      <div style="display: flex; align-items: flex-start; margin-bottom: 12px; padding: 12px; background: ${i % 2 === 0 ? '#fafafa' : '#fff'}; border-radius: 8px;">
        <div style="width: 24px; height: 24px; border: 2px solid #7ef4c2; border-radius: 50%; margin-right: 12px; flex-shrink: 0;"></div>
        <p style="margin: 0; color: #333; font-size: 14px;">${escapeHtml(action)}</p>
      </div>
      `).join('')}
    </div>

    <!-- CTA -->
    <div style="background: linear-gradient(135deg, #0e1a2b 0%, #1a2b3d 100%); color: white; padding: 32px 24px; border-radius: 12px; text-align: center;">
      <h3 style="margin: 0 0 12px 0; font-size: 20px; font-weight: 600;">Ready to Accelerate Your AI Journey?</h3>
      <p style="margin: 0 0 20px 0; opacity: 0.9; font-size: 14px;">Book a 1:1 Builder Session with Krish to build your first working AI system in 60 minutes.</p>
      <a href="https://www.themindmaker.ai/#book" style="display: inline-block; background: #7ef4c2; color: #0e1a2b; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: 700; font-size: 14px;">Book Your Session →</a>
    </div>
  </div>
  
  <div style="text-align: center; padding: 24px; color: #999; font-size: 12px;">
    <p style="margin: 0;">You completed the AI Leadership Benchmark at <a href="https://www.themindmaker.ai" style="color: #666;">themindmaker.ai</a></p>
    <p style="margin: 8px 0 0 0;">© ${new Date().getFullYear()} Mindmaker LLC</p>
  </div>
</body>
</html>
    ` : `
<!DOCTYPE html>
<html>
<body style="font-family: -apple-system, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
  <h1>Thank you for your interest!</h1>
  <p>Hi ${escapeHtml(name)},</p>
  <p>We received your submission but couldn't generate detailed results. Please try the assessment again or reach out to us directly.</p>
  <a href="https://www.themindmaker.ai/#book">Book a Session</a>
</body>
</html>
    `;

    // Send email to user with their results
    const userEmailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "Mindmaker AI Insights <insights@themindmaker.ai>",
        to: [email],
        subject: `${escapeHtml(name)}, Your AI Leadership Score: ${results?.score || 'N/A'}/100`,
        html: userEmailHtml,
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
        from: "Mindmaker Leads <leads@themindmaker.ai>",
        to: ["krish@themindmaker.ai"],
        reply_to: email,
        subject: `📊 New Benchmark: ${escapeHtml(name)} scored ${results?.score || 'N/A'}/100 (${results?.tier || 'Unknown'})`,
        html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif; line-height: 1.6; color: #1a1a1a; max-width: 600px; margin: 0 auto; padding: 0; background-color: #f7f7f5;">
  <div style="background: linear-gradient(135deg, #0e1a2b 0%, #1a2b3d 100%); padding: 32px 24px;">
    <div style="text-align: center;">
      <p style="color: #7ef4c2; margin: 0 0 8px 0; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">AI Leadership Benchmark</p>
      <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 700;">${escapeHtml(name)}</h1>
      <p style="color: rgba(255,255,255,0.8); margin: 8px 0 0 0; font-size: 14px;">${department ? escapeHtml(department) : 'Department not specified'}</p>
    </div>
    ${results ? `
    <div style="display: flex; justify-content: center; gap: 32px; margin-top: 24px;">
      <div style="text-align: center;">
        <p style="color: rgba(255,255,255,0.6); margin: 0; font-size: 11px; text-transform: uppercase;">Score</p>
        <p style="color: #7ef4c2; margin: 4px 0 0 0; font-size: 28px; font-weight: 700;">${results.score}/100</p>
      </div>
      <div style="text-align: center;">
        <p style="color: rgba(255,255,255,0.6); margin: 0; font-size: 11px; text-transform: uppercase;">Tier</p>
        <p style="color: #ffffff; margin: 4px 0 0 0; font-size: 18px; font-weight: 600;">${escapeHtml(results.tier)}</p>
      </div>
      <div style="text-align: center;">
        <p style="color: rgba(255,255,255,0.6); margin: 0; font-size: 11px; text-transform: uppercase;">Percentile</p>
        <p style="color: #ffffff; margin: 4px 0 0 0; font-size: 18px; font-weight: 600;">Top ${100 - results.percentile}%</p>
      </div>
    </div>
    ` : ''}
  </div>
  
  <div style="background: #ffffff; padding: 24px;">
    <div style="text-align: center; margin-bottom: 24px; padding-bottom: 24px; border-bottom: 1px solid #e5e5e3;">
      <a href="mailto:${escapeHtml(email)}" style="display: inline-block; background: #0e1a2b; color: #ffffff; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: 600; font-size: 14px; margin-right: 8px;">Email ${escapeHtml(name.split(' ')[0])}</a>
      <a href="https://www.linkedin.com/search/results/all/?keywords=${encodeURIComponent(name)}" style="display: inline-block; background: #0077b5; color: #ffffff; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: 600; font-size: 14px;">Find on LinkedIn</a>
    </div>

    <div style="background: #f7f7f5; border-radius: 12px; padding: 20px; margin-bottom: 20px;">
      <h3 style="color: #0e1a2b; margin: 0 0 12px 0; font-size: 14px; font-weight: 600;">Contact Details</h3>
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="padding: 6px 0; color: #666; font-size: 13px; width: 100px;">Email</td>
          <td style="padding: 6px 0; color: #0e1a2b; font-size: 13px;"><a href="mailto:${escapeHtml(email)}" style="color: #0e1a2b;">${escapeHtml(email)}</a></td>
        </tr>
        <tr>
          <td style="padding: 6px 0; color: #666; font-size: 13px;">Department</td>
          <td style="padding: 6px 0; color: #0e1a2b; font-size: 13px;">${department ? escapeHtml(department) : 'Not specified'}</td>
        </tr>
        <tr>
          <td style="padding: 6px 0; color: #666; font-size: 13px;">AI Focus</td>
          <td style="padding: 6px 0; color: #0e1a2b; font-size: 13px;">${aiFocus ? escapeHtml(aiFocus) : 'Not specified'}</td>
        </tr>
      </table>
    </div>

    ${results ? `
    <div style="margin-bottom: 20px;">
      <h3 style="color: #22c55e; margin: 0 0 12px 0; font-size: 14px; font-weight: 600;">✓ Strengths</h3>
      <ul style="margin: 0; padding-left: 20px; color: #333; font-size: 13px;">
        ${results.strengths.map(s => `<li style="margin-bottom: 4px;">${escapeHtml(s)}</li>`).join('')}
      </ul>
    </div>

    <div style="margin-bottom: 20px;">
      <h3 style="color: #f59e0b; margin: 0 0 12px 0; font-size: 14px; font-weight: 600;">↑ Growth Areas</h3>
      <ul style="margin: 0; padding-left: 20px; color: #333; font-size: 13px;">
        ${results.growthAreas.map(g => `<li style="margin-bottom: 4px;">${escapeHtml(g)}</li>`).join('')}
      </ul>
    </div>
    ` : ''}
  </div>
  
  <div style="text-align: center; padding: 20px; color: #999; font-size: 12px;">
    <p style="margin: 0;">AI Leadership Benchmark at <a href="https://www.themindmaker.ai" style="color: #666;">themindmaker.ai</a></p>
  </div>
</body>
</html>
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

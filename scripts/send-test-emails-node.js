/**
 * Node.js script to send all test emails
 * Run with: node scripts/send-test-emails-node.js
 * 
 * Requires SUPABASE_URL and SUPABASE_ANON_KEY environment variables
 */

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_PUBLISHABLE_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error("Error: SUPABASE_URL and SUPABASE_ANON_KEY must be set as environment variables");
  console.error("Example: SUPABASE_URL=https://xxx.supabase.co SUPABASE_ANON_KEY=xxx node scripts/send-test-emails-node.js");
  process.exit(1);
}

const testLeads = [
  {
    name: "Krish Raja",
    email: "krish@tesla.com",
    jobTitle: "CEO",
    selectedProgram: "initial-consult",
    description: "Main Page - Book Your Initial Consult (Bottom)"
  },
  {
    name: "Krish Raja",
    email: "krish@tesla.com",
    jobTitle: "CEO",
    selectedProgram: "initial-consult",
    description: "Main Page - Book Session (Top Nav)"
  },
  {
    name: "Krish Raja",
    email: "krish@tesla.com",
    jobTitle: "CTO",
    selectedProgram: "build",
    commitmentLevel: "1hr",
    audienceType: "individual",
    pathType: "build",
    description: "Product Ladder - Individual → Build → 1 Hour"
  },
  {
    name: "Krish Raja",
    email: "krish@tesla.com",
    jobTitle: "VP Engineering",
    selectedProgram: "orchestrate",
    commitmentLevel: "4wk",
    audienceType: "individual",
    pathType: "orchestrate",
    description: "Product Ladder - Individual → Orchestrate → 4 Week"
  },
  {
    name: "Krish Raja",
    email: "krish@tesla.com",
    jobTitle: "Chief Product Officer",
    selectedProgram: "build",
    commitmentLevel: "90d",
    audienceType: "individual",
    pathType: "build",
    description: "Product Ladder - Individual → Build → 90 Day"
  },
  {
    name: "Krish Raja",
    email: "krish@tesla.com",
    jobTitle: "COO",
    selectedProgram: "team",
    commitmentLevel: "3hr",
    audienceType: "team",
    description: "Product Ladder - Team → 3 Hour"
  },
  {
    name: "Krish Raja",
    email: "krish@tesla.com",
    jobTitle: "CMO",
    selectedProgram: "team",
    commitmentLevel: "4wk",
    audienceType: "team",
    description: "Product Ladder - Team → 4 Week"
  },
  {
    name: "Krish Raja",
    email: "krish@tesla.com",
    jobTitle: "CRO",
    selectedProgram: "team",
    commitmentLevel: "90d",
    audienceType: "team",
    description: "Product Ladder - Team → 90 Day"
  },
  {
    name: "Krish Raja",
    email: "krish@tesla.com",
    jobTitle: "Executive Director",
    selectedProgram: "build",
    commitmentLevel: "1hr",
    audienceType: "individual",
    pathType: "build",
    description: "Individual Page - Sticky CTA (build, 1hr)"
  },
  {
    name: "Krish Raja",
    email: "krish@tesla.com",
    jobTitle: "General Manager",
    selectedProgram: "orchestrate",
    commitmentLevel: "4wk",
    audienceType: "individual",
    pathType: "orchestrate",
    description: "Individual Page - Nav Book Session (orchestrate, 4wk)"
  },
  {
    name: "Krish Raja",
    email: "krish@tesla.com",
    jobTitle: "VP Operations",
    selectedProgram: "team",
    commitmentLevel: "4wk",
    audienceType: "team",
    description: "Team Page - Sticky CTA (4wk)"
  },
  {
    name: "Krish Raja",
    email: "krish@tesla.com",
    jobTitle: "Chief Strategy Officer",
    selectedProgram: "team",
    commitmentLevel: "90d",
    audienceType: "team",
    description: "Team Page - Nav Book Session (90d)"
  },
  {
    name: "Krish Raja",
    email: "krish@tesla.com",
    jobTitle: "Founder",
    selectedProgram: "consultation-booking",
    description: "ConsultationBooking Component"
  },
  {
    name: "Krish Raja",
    email: "krish@tesla.com",
    jobTitle: "Board Member",
    selectedProgram: "builder-assessment",
    description: "Builder Assessment CTA"
  },
  {
    name: "Krish Raja",
    email: "krish@tesla.com",
    jobTitle: "Advisor",
    selectedProgram: "friction-map",
    description: "Friction Map Builder CTA"
  },
  {
    name: "Krish Raja",
    email: "krish@tesla.com",
    jobTitle: "Investor",
    selectedProgram: "portfolio-builder",
    description: "Portfolio Builder CTA"
  },
  {
    name: "Krish Raja",
    email: "krish@tesla.com",
    jobTitle: "CEO",
    selectedProgram: "build",
    commitmentLevel: "1hr",
    audienceType: "individual",
    pathType: "build",
    description: "BlogPost - CTA Button (with build qualification)"
  },
  {
    name: "Krish Raja",
    email: "krish@tesla.com",
    jobTitle: "COO",
    selectedProgram: "orchestrate",
    commitmentLevel: "4wk",
    audienceType: "individual",
    pathType: "orchestrate",
    description: "Contact Page - Quick Book CTA (with orchestrate qualification)"
  },
  {
    name: "Krish Raja",
    email: "krish@tesla.com",
    jobTitle: "CMO",
    selectedProgram: "team",
    commitmentLevel: "90d",
    audienceType: "team",
    description: "Contact Page - Success Message CTA (with team qualification)"
  },
  {
    name: "Krish Raja",
    email: "krish@tesla.com",
    jobTitle: "VP Product",
    selectedProgram: "build",
    commitmentLevel: "90d",
    audienceType: "individual",
    pathType: "build",
    description: "BuilderEconomy - CTA Button (with build qualification)"
  },
  {
    name: "Krish Raja",
    email: "krish@tesla.com",
    jobTitle: "CTO",
    selectedProgram: "ai-decision-helper",
    commitmentLevel: "1hr",
    audienceType: "individual",
    pathType: "build",
    description: "AI Decision Helper - Book Session CTA (with build qualification)"
  },
  {
    name: "Krish Raja",
    email: "krish@tesla.com",
    jobTitle: "Founder",
    selectedProgram: "builder-assessment",
    commitmentLevel: "4wk",
    audienceType: "individual",
    pathType: "build",
    description: "Builder Assessment - Learn More CTA (with build qualification)"
  },
  {
    name: "Krish Raja",
    email: "krish@tesla.com",
    jobTitle: "General Manager",
    selectedProgram: "friction-map",
    commitmentLevel: "90d",
    audienceType: "individual",
    pathType: "build",
    description: "Friction Map Builder - Build 4 More CTA (with build qualification)"
  },
  {
    name: "Krish Raja",
    email: "krish@tesla.com",
    jobTitle: "CEO",
    selectedProgram: "initial-consult",
    description: "Navigation - Book Session (no qualification - should show full form)"
  },
  {
    name: "Krish Raja",
    email: "krish@tesla.com",
    jobTitle: "VP Strategy",
    selectedProgram: "initial-consult",
    commitmentLevel: "1hr",
    audienceType: "individual",
    pathType: "orchestrate",
    description: "Navigation - Book Session (with orchestrate qualification)"
  },
  {
    name: "Krish Raja",
    email: "krish@tesla.com",
    jobTitle: "Chief Innovation Officer",
    selectedProgram: "team",
    commitmentLevel: "3hr",
    audienceType: "team",
    description: "Navigation - Book Session (with team qualification)"
  }
];

async function sendTestEmail(lead) {
  try {
    const response = await fetch(`${SUPABASE_URL}/functions/v1/send-lead-email`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${SUPABASE_ANON_KEY}`,
        "apikey": SUPABASE_ANON_KEY,
      },
      body: JSON.stringify({
        name: lead.name,
        email: lead.email,
        jobTitle: lead.jobTitle,
        selectedProgram: lead.selectedProgram,
        commitmentLevel: lead.commitmentLevel,
        audienceType: lead.audienceType,
        pathType: lead.pathType,
        sessionData: {
          pagesVisited: ["/", "/#products"],
          timeOnSite: 180,
          scrollDepth: 70,
        }
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    return { success: true, lead, data };
  } catch (error) {
    return { success: false, lead, error: error.message };
  }
}

async function main() {
  console.log("🚀 Sending test emails for all CTA paths...\n");
  console.log(`Total test scenarios: ${testLeads.length}\n`);
  console.log(`Supabase URL: ${SUPABASE_URL}\n`);
  
  let successCount = 0;
  let errorCount = 0;
  
  for (let i = 0; i < testLeads.length; i++) {
    const lead = testLeads[i];
    console.log(`[${i + 1}/${testLeads.length}] Sending: ${lead.description}`);
    
    const result = await sendTestEmail(lead);
    
    if (result.success) {
      successCount++;
      console.log(`   ✅ Success - Lead ID: ${result.data?.leadId || "N/A"}`);
    } else {
      errorCount++;
      console.log(`   ❌ Error: ${result.error}`);
    }
    console.log("");
    
    // Small delay between emails to avoid rate limiting
    if (i < testLeads.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 1500));
    }
  }
  
  console.log("=".repeat(50));
  console.log(`✅ Complete: ${successCount} succeeded, ${errorCount} failed`);
  console.log(`📧 Check inbox at krish@themindmaker.ai for ${successCount} emails`);
  console.log("=".repeat(50));
}

main().catch(console.error);

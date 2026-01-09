/**
 * Script to send test emails for all CTA paths
 * Run with: deno run --allow-net scripts/send-test-emails.ts
 */

const SUPABASE_URL = Deno.env.get("SUPABASE_URL") || "";
const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY") || "";

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error("Error: SUPABASE_URL and SUPABASE_ANON_KEY must be set");
  Deno.exit(1);
}

interface TestLead {
  name: string;
  email: string;
  jobTitle: string;
  selectedProgram: string;
  commitmentLevel?: string;
  audienceType?: "individual" | "team";
  pathType?: "build" | "orchestrate";
  description: string;
}

const testLeads: TestLead[] = [
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
  }
];

async function sendTestEmail(lead: TestLead): Promise<void> {
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
    console.log(`✅ ${lead.description}`);
    console.log(`   Lead ID: ${data.leadId || "N/A"}`);
    console.log(`   Status: ${data.success ? "Success" : "Failed"}`);
    console.log("");
  } catch (error) {
    console.error(`❌ ${lead.description}`);
    console.error(`   Error: ${error instanceof Error ? error.message : String(error)}`);
    console.log("");
  }
}

async function main() {
  console.log("🚀 Sending test emails for all CTA paths...\n");
  console.log(`Total test scenarios: ${testLeads.length}\n`);
  
  for (let i = 0; i < testLeads.length; i++) {
    const lead = testLeads[i];
    console.log(`[${i + 1}/${testLeads.length}] Sending: ${lead.description}`);
    await sendTestEmail(lead);
    
    // Small delay between emails to avoid rate limiting
    if (i < testLeads.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
  
  console.log("✅ All test emails sent!");
  console.log(`📧 Check inbox at krish@themindmaker.ai for ${testLeads.length} emails`);
}

main().catch(console.error);

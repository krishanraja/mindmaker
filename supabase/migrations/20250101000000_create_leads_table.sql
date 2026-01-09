-- Create leads table for persistent lead capture
-- This ensures all leads are saved even if email fails

CREATE TABLE IF NOT EXISTS public.leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  job_title TEXT,
  selected_program TEXT,
  commitment_level TEXT,
  audience_type TEXT,
  path_type TEXT,
  session_data JSONB DEFAULT '{}'::jsonb,
  company_research JSONB,
  engagement_score INTEGER,
  email_sent BOOLEAN DEFAULT false,
  email_sent_at TIMESTAMPTZ,
  calendly_opened BOOLEAN DEFAULT false,
  calendly_opened_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes for common queries
CREATE INDEX IF NOT EXISTS idx_leads_email ON public.leads(email);
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON public.leads(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_leads_email_sent ON public.leads(email_sent);
CREATE INDEX IF NOT EXISTS idx_leads_selected_program ON public.leads(selected_program);

-- Enable RLS (Row Level Security)
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

-- Drop policies if they exist, then create them
DROP POLICY IF EXISTS "Service role can insert leads" ON public.leads;
CREATE POLICY "Service role can insert leads"
  ON public.leads
  FOR INSERT
  TO service_role
  WITH CHECK (true);

DROP POLICY IF EXISTS "Service role can update leads" ON public.leads;
CREATE POLICY "Service role can update leads"
  ON public.leads
  FOR UPDATE
  TO service_role
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "Service role can select leads" ON public.leads;
CREATE POLICY "Service role can select leads"
  ON public.leads
  FOR SELECT
  TO service_role
  USING (true);

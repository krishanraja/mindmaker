-- Create company research cache table
-- Caches company research results to reduce API calls and improve performance

CREATE TABLE IF NOT EXISTS public.company_research_cache (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  domain TEXT NOT NULL UNIQUE,
  research_data JSONB NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Index for fast lookups by domain
CREATE INDEX IF NOT EXISTS idx_company_research_cache_domain ON public.company_research_cache(domain);
-- Index for expiration cleanup
CREATE INDEX IF NOT EXISTS idx_company_research_cache_expires_at ON public.company_research_cache(expires_at);

-- Enable RLS (Row Level Security)
ALTER TABLE public.company_research_cache ENABLE ROW LEVEL SECURITY;

-- Drop policies if they exist, then create them
DROP POLICY IF EXISTS "Service role can manage cache" ON public.company_research_cache;
CREATE POLICY "Service role can manage cache"
  ON public.company_research_cache
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Function to clean up expired cache entries (optional - can be run periodically)
CREATE OR REPLACE FUNCTION cleanup_expired_research_cache()
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  DELETE FROM public.company_research_cache
  WHERE expires_at < now();
END;
$$;

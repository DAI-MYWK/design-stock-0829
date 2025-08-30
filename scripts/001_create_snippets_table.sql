-- Create snippets table for storing code snippets
CREATE TABLE IF NOT EXISTS public.snippets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  section TEXT NOT NULL,
  company_name TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  html_code TEXT,
  css_code TEXT,
  js_code TEXT,
  preview_image_url TEXT,
  github_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create an index on section for faster filtering
CREATE INDEX IF NOT EXISTS idx_snippets_section ON public.snippets(section);

-- Create an index on tags for faster tag-based searches
CREATE INDEX IF NOT EXISTS idx_snippets_tags ON public.snippets USING GIN(tags);

-- Create an index on company_name for faster company searches
CREATE INDEX IF NOT EXISTS idx_snippets_company ON public.snippets(company_name);

-- Create a function to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create a trigger to automatically update updated_at on row updates
DROP TRIGGER IF EXISTS update_snippets_updated_at ON public.snippets;
CREATE TRIGGER update_snippets_updated_at
    BEFORE UPDATE ON public.snippets
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

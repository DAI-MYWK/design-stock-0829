-- Enable Row Level Security on snippets table
ALTER TABLE public.snippets ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow public read access" ON public.snippets;
DROP POLICY IF EXISTS "Allow authenticated insert" ON public.snippets;
DROP POLICY IF EXISTS "Allow authenticated update" ON public.snippets;
DROP POLICY IF EXISTS "Allow authenticated delete" ON public.snippets;

-- Create RLS policies for secure access
-- Allow anyone to read snippets (for public viewing)
CREATE POLICY "Allow public read access" ON public.snippets
    FOR SELECT USING (true);

-- Allow authenticated users to insert snippets (for admin functionality)
CREATE POLICY "Allow authenticated insert" ON public.snippets
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Allow authenticated users to update snippets
CREATE POLICY "Allow authenticated update" ON public.snippets
    FOR UPDATE USING (auth.role() = 'authenticated');

-- Allow authenticated users to delete snippets
CREATE POLICY "Allow authenticated delete" ON public.snippets
    FOR DELETE USING (auth.role() = 'authenticated');

-- Grant necessary permissions
GRANT SELECT ON public.snippets TO anon;
GRANT ALL ON public.snippets TO authenticated;
GRANT ALL ON public.snippets TO service_role;

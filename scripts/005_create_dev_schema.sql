-- 開発用Supabaseプロジェクトのスキーマ作成
-- このスクリプトを新しく作成した開発用Supabaseで実行してください

-- Create snippets table if it doesn't exist
CREATE TABLE IF NOT EXISTS snippets (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  section TEXT NOT NULL,
  company_name TEXT,
  tags TEXT[] DEFAULT '{}',
  html_code TEXT,
  css_code TEXT,
  js_code TEXT,
  preview_image_url TEXT,
  github_url TEXT,
  public_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_snippets_section ON snippets(section);
CREATE INDEX IF NOT EXISTS idx_snippets_tags ON snippets USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_snippets_company ON snippets(company_name);
CREATE INDEX IF NOT EXISTS idx_snippets_public_url ON snippets(public_url);

-- Create a function to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create a trigger to automatically update updated_at on row updates
DROP TRIGGER IF EXISTS update_snippets_updated_at ON snippets;
CREATE TRIGGER update_snippets_updated_at
    BEFORE UPDATE ON snippets
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Add comments to describe columns
COMMENT ON COLUMN snippets.id IS 'Unique identifier for the snippet';
COMMENT ON COLUMN snippets.title IS 'Title of the design snippet';
COMMENT ON COLUMN snippets.section IS 'Section category (e.g., ヒーローセクション, 料金・価格)';
COMMENT ON COLUMN snippets.company_name IS 'Name of the company featured in the snippet';
COMMENT ON COLUMN snippets.tags IS 'Array of tags for categorization';
COMMENT ON COLUMN snippets.html_code IS 'HTML code of the snippet';
COMMENT ON COLUMN snippets.css_code IS 'CSS code of the snippet';
COMMENT ON COLUMN snippets.js_code IS 'JavaScript code of the snippet';
COMMENT ON COLUMN snippets.preview_image_url IS 'URL of the preview image';
COMMENT ON COLUMN snippets.github_url IS 'URL to the GitHub repository';
COMMENT ON COLUMN snippets.public_url IS 'URL where the design snippet is publicly available or deployed';
COMMENT ON COLUMN snippets.created_at IS 'Timestamp when the snippet was created';
COMMENT ON COLUMN snippets.updated_at IS 'Timestamp when the snippet was last updated';

-- Enable Row Level Security (RLS)
ALTER TABLE snippets ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows all operations for now (adjust as needed)
CREATE POLICY "Allow all operations on snippets" ON snippets
  FOR ALL USING (true);

-- Grant necessary permissions
GRANT ALL ON snippets TO anon;
GRANT ALL ON snippets TO authenticated;
GRANT ALL ON snippets TO service_role;

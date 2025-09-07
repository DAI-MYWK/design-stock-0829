-- Add public_url column to snippets table
ALTER TABLE snippets ADD COLUMN IF NOT EXISTS public_url TEXT;

-- Add comment to describe the column
COMMENT ON COLUMN snippets.public_url IS 'URL where the design snippet is publicly available or deployed';

-- Create an index for potential future searches
CREATE INDEX IF NOT EXISTS idx_snippets_public_url ON snippets(public_url);

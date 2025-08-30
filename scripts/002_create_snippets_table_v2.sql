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
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert sample data for testing
INSERT INTO snippets (title, section, company_name, tags, html_code, css_code, js_code, preview_image_url) VALUES
('サンプルヒーローセクション', 'ヒーローセクション', 'テスト会社', ARRAY['レスポンシブ', 'モダン'], 
 '<div class="hero"><h1>Welcome</h1></div>', 
 '.hero { background: #f0f0f0; padding: 2rem; }', 
 'console.log("Hero loaded");',
 '/placeholder.svg?height=200&width=300'
),
('料金表サンプル', '料金・価格', 'サンプル株式会社', ARRAY['テーブル', '3カラム'], 
 '<div class="pricing"><h2>Pricing</h2></div>', 
 '.pricing { display: grid; gap: 1rem; }', 
 '',
 '/placeholder.svg?height=200&width=300'
);

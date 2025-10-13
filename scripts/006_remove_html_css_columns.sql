-- TypeScript専用スニペット管理システムへの移行
-- HTML/CSSカラムを削除してTypeScriptコードのみに集約

-- html_codeカラムを削除
ALTER TABLE snippets DROP COLUMN IF EXISTS html_code;

-- css_codeカラムを削除
ALTER TABLE snippets DROP COLUMN IF EXISTS css_code;

-- js_codeカラムにコメントを追加（TypeScriptコードとして使用）
COMMENT ON COLUMN snippets.js_code IS 'TypeScript/TSX code of the component';

-- 確認用クエリ
-- SELECT column_name, data_type, is_nullable
-- FROM information_schema.columns
-- WHERE table_name = 'snippets'
-- ORDER BY ordinal_position;


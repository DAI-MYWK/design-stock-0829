# 開発環境セットアップガイド

このガイドでは、本番環境と分離された開発環境を構築する手順を説明します。

## 📋 セットアップ手順

### 1. 開発用Supabaseプロジェクトの作成

1. [Supabaseダッシュボード](https://supabase.com/dashboard)にアクセス
2. 「New Project」をクリック
3. プロジェクト名を入力（例: `design-stock-dev`）
4. データベースパスワードを設定
5. リージョンを選択（本番と同じリージョン推奨）
6. 「Create new project」をクリック

### 2. 開発用データベースのスキーマ作成

1. Supabaseダッシュボードで「SQL Editor」を開く
2. `scripts/005_create_dev_schema.sql`の内容をコピー&ペースト
3. 「RUN」をクリックして実行

### 3. 環境変数の設定

1. Supabaseダッシュボードで「Settings」→「API」を開く
2. 以下の値を確認:
   - Project URL
   - anon public key
   - service_role key

3. 環境変数ファイルを作成:
```bash
cp env.template .env.local
```

4. `.env.local`に開発用Supabaseの設定を入力:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-dev-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-dev-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-dev-service-role-key
```

### 4. 本番データの複製

#### 4.1 本番データのエクスポート

1. 現在のVercel環境変数を一時的に取得
2. 本番の環境変数を設定してエクスポートを実行:

```bash
# 本番環境変数を設定（Vercelから取得）
export NEXT_PUBLIC_SUPABASE_URL="本番のURL"
export SUPABASE_SERVICE_ROLE_KEY="本番のサービスロールキー"

# データをエクスポート
node scripts/export-data.js
```

#### 4.2 開発環境へのインポート

1. `.env.local`の開発用設定が有効になっていることを確認
2. エクスポートしたデータをインポート:

```bash
# 開発環境でのインポート（.env.localの設定を使用）
node scripts/import-data.js snippets-export-YYYY-MM-DD.json
```

### 5. 開発用Vercelプロジェクトの作成

1. [Vercelダッシュボード](https://vercel.com/dashboard)にアクセス
2. 「New Project」をクリック
3. 同じリポジトリを選択
4. プロジェクト名を変更（例: `design-stock-dev`）
5. 環境変数を設定:
   - `NEXT_PUBLIC_SUPABASE_URL`: 開発用SupabaseのURL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: 開発用のanon key
   - `SUPABASE_SERVICE_ROLE_KEY`: 開発用のservice role key

### 6. testブランチの作成とデプロイ

```bash
# 変更をコミット
git add .
git commit -m "feat: 公開URL項目を追加 & 開発環境セットアップ"

# testブランチを作成
git checkout -b test

# リモートにpush
git push -u origin test
```

## 🔧 開発の流れ

### 日常の開発

1. **ローカル開発**: `.env.local`の開発用Supabaseを使用
```bash
pnpm dev
```

2. **testブランチでのテスト**: 開発用Vercelに自動デプロイ

3. **本番デプロイ**: mainブランチにマージして本番Vercelにデプロイ

### データベースの管理

- **開発環境**: 自由にテスト・変更可能
- **本番環境**: 慎重な運用が必要

### 環境の分離状況

| 項目 | 開発環境 | 本番環境 |
|------|----------|----------|
| Supabaseプロジェクト | 新規作成 | 既存 |
| Vercelプロジェクト | 新規作成 | 既存 |
| データベース | 複製された独立DB | 本番DB |
| ブランチ | test/develop | main |

## 🚨 重要な注意点

1. **環境変数の管理**
   - `.env.local`は開発用
   - Vercelの環境変数は本番用と開発用で分離
   - 間違えて本番DBに接続しないよう注意

2. **データの同期**
   - 本番データの変更を開発環境に反映する場合は手動でエクスポート/インポート
   - 開発環境のデータは本番には反映されない

3. **スキーマ変更**
   - スキーマ変更は両環境で個別に実行が必要
   - マイグレーションスクリプトを活用

## 📁 関連ファイル

- `env.template`: 環境変数のテンプレート
- `scripts/005_create_dev_schema.sql`: 開発用スキーマ作成
- `scripts/export-data.js`: データエクスポートスクリプト
- `scripts/import-data.js`: データインポートスクリプト
- `scripts/004_add_public_url_column.sql`: 本番用public_url追加マイグレーション

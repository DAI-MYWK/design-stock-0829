export interface Snippet {
  id: string
  title: string
  section: string
  company_name: string
  tags: string[]
  js_code?: string  // TypeScript/TSX code
  preview_image_url?: string
  github_url?: string
  gist_url?: string
  memo?: string
  public_url?: string
  created_at: string
  updated_at: string
}

export const SECTIONS = [
  "ヘッダー",
  "ヒーローセクション",
  "会社概要",
  "サービス紹介",
  "料金・価格",
  "事例・実績",
  "お客様の声",
  "よくある質問",
  "お問い合わせ",
  "フッター",
] as const

export type Section = (typeof SECTIONS)[number]

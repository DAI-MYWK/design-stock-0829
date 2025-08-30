export interface Snippet {
  id: string
  title: string
  section: string
  company_name: string
  tags: string[]
  html_code?: string
  css_code?: string
  js_code?: string
  preview_image_url?: string
  github_url?: string
  created_at: string
  updated_at: string
}

export const SECTIONS = [
  "ヒーローセクション",
  "会社概要",
  "サービス紹介",
  "料金・価格",
  "事例・実績",
  "お客様の声",
  "よくある質問",
  "お問い合わせ",
] as const

export type Section = (typeof SECTIONS)[number]

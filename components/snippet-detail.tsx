"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Copy, Download, ExternalLink, Calendar, Building } from "lucide-react"
import type { Snippet } from "@/lib/types"
import { useState } from "react"
import Link from "next/link"

interface SnippetDetailProps {
  snippet: Snippet
}

export function SnippetDetail({ snippet }: SnippetDetailProps) {
  const [copiedType, setCopiedType] = useState<string | null>(null)

  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedType(type)
      setTimeout(() => setCopiedType(null), 2000)
    } catch (err) {
      console.error("Failed to copy:", err)
    }
  }

  const downloadFile = (content: string, filename: string) => {
    const blob = new Blob([content], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link href="/" className="text-sm text-muted-foreground hover:text-primary">
            ← 一覧に戻る
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Preview and Info */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">{snippet.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="aspect-video bg-muted rounded-lg overflow-hidden">
                  <img
                    src={
                      snippet.preview_image_url || "/placeholder.svg?height=300&width=400&query=code snippet preview"
                    }
                    alt={snippet.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <Building className="h-4 w-4 text-muted-foreground" />
                    <span>{snippet.company_name}</span>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>更新: {new Date(snippet.updated_at).toLocaleDateString("ja-JP")}</span>
                  </div>

                  <div>
                    <Badge variant="outline" className="mb-2">
                      {snippet.section}
                    </Badge>
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {snippet.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right: URLs and Memo */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">リンク・詳細情報</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* GitHub URL */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <div className="text-base font-bold text-foreground">GitHub URL</div>
                    {snippet.github_url && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => copyToClipboard(snippet.github_url!, "GitHub URL")}
                        className="h-6 px-2 text-xs"
                      >
                        <Copy className="h-3 w-3 mr-1" />
                        {copiedType === "GitHub URL" ? "コピー済み" : "コピー"}
                      </Button>
                    )}
                  </div>
                  {snippet.github_url ? (
                    <div className="text-sm bg-muted/50 p-3 rounded-lg">
                      <a 
                        href={snippet.github_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 underline break-all"
                      >
                        {snippet.github_url}
                      </a>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">GitHub URLが登録されていません</p>
                  )}
                </div>

                {/* Gist URL */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <div className="text-base font-bold text-foreground">Gistのコマンド</div>
                    {snippet.gist_url && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => copyToClipboard(snippet.gist_url!, "Gistのコマンド")}
                        className="h-6 px-2 text-xs"
                      >
                        <Copy className="h-3 w-3 mr-1" />
                        {copiedType === "Gistのコマンド" ? "コピー済み" : "コピー"}
                      </Button>
                    )}
                  </div>
                  {snippet.gist_url ? (
                    <div className="text-sm bg-muted/50 p-3 rounded-lg">
                      <a 
                        href={snippet.gist_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 underline break-all"
                      >
                        {snippet.gist_url}
                      </a>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">Gistのコマンドが登録されていません</p>
                  )}
                </div>

                {/* Public URL */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <div className="text-base font-bold text-foreground">公開URL</div>
                    {snippet.public_url && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => copyToClipboard(snippet.public_url!, "公開URL")}
                        className="h-6 px-2 text-xs"
                      >
                        <Copy className="h-3 w-3 mr-1" />
                        {copiedType === "公開URL" ? "コピー済み" : "コピー"}
                      </Button>
                    )}
                  </div>
                  {snippet.public_url ? (
                    <Button variant="outline" size="sm" className="w-full bg-transparent" asChild>
                      <a href={snippet.public_url} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-4 w-4 mr-2" />
                        デモサイトを見る
                      </a>
                    </Button>
                  ) : (
                    <p className="text-sm text-muted-foreground">公開URLが登録されていません</p>
                  )}
                </div>

                {/* Memo */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <div className="text-base font-bold text-foreground">メモ欄</div>
                    {snippet.memo && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => copyToClipboard(snippet.memo!, "メモ欄")}
                        className="h-6 px-2 text-xs"
                      >
                        <Copy className="h-3 w-3 mr-1" />
                        {copiedType === "メモ欄" ? "コピー済み" : "コピー"}
                      </Button>
                    )}
                  </div>
                  <div className="text-sm bg-muted/50 p-3 rounded-lg whitespace-pre-wrap">
                    {snippet.memo || "メモが登録されていません"}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Bottom: TypeScript Code Section */}
        <div className="mt-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">TypeScript Code</CardTitle>
              {snippet.js_code && (
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => copyToClipboard(snippet.js_code!, "TypeScript")}>
                    <Copy className="h-3 w-3 mr-1" />
                    {copiedType === "TypeScript" ? "コピー済み" : "コピー"}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => downloadFile(snippet.js_code!, `${snippet.title}.tsx`)}
                  >
                    <Download className="h-3 w-3 mr-1" />
                    ダウンロード
                  </Button>
                </div>
              )}
            </CardHeader>
            <CardContent>
              {snippet.js_code ? (
                <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
                  <code>{snippet.js_code}</code>
                </pre>
              ) : (
                <p className="text-muted-foreground text-sm">TypeScriptコードが登録されていません</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
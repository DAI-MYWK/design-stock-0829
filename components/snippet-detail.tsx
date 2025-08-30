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
          {/* Preview and Info */}
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

                  {snippet.github_url && (
                    <Button variant="outline" size="sm" className="w-full bg-transparent" asChild>
                      <a href={snippet.github_url} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-4 w-4 mr-2" />
                        GitHub で見る
                      </a>
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Code Sections */}
          <div className="lg:col-span-2 space-y-6">
            {/* HTML */}
            {snippet.html_code && (
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-base">HTML</CardTitle>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => copyToClipboard(snippet.html_code!, "HTML")}>
                      <Copy className="h-3 w-3 mr-1" />
                      {copiedType === "HTML" ? "コピー済み" : "コピー"}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => downloadFile(snippet.html_code!, `${snippet.title}-html.html`)}
                    >
                      <Download className="h-3 w-3 mr-1" />
                      ダウンロード
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
                    <code>{snippet.html_code}</code>
                  </pre>
                </CardContent>
              </Card>
            )}

            {/* CSS */}
            {snippet.css_code && (
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-base">CSS</CardTitle>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => copyToClipboard(snippet.css_code!, "CSS")}>
                      <Copy className="h-3 w-3 mr-1" />
                      {copiedType === "CSS" ? "コピー済み" : "コピー"}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => downloadFile(snippet.css_code!, `${snippet.title}-styles.css`)}
                    >
                      <Download className="h-3 w-3 mr-1" />
                      ダウンロード
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
                    <code>{snippet.css_code}</code>
                  </pre>
                </CardContent>
              </Card>
            )}

            {/* JavaScript */}
            {snippet.js_code && (
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-base">JavaScript</CardTitle>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => copyToClipboard(snippet.js_code!, "JavaScript")}>
                      <Copy className="h-3 w-3 mr-1" />
                      {copiedType === "JavaScript" ? "コピー済み" : "コピー"}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => downloadFile(snippet.js_code!, `${snippet.title}-script.js`)}
                    >
                      <Download className="h-3 w-3 mr-1" />
                      ダウンロード
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
                    <code>{snippet.js_code}</code>
                  </pre>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

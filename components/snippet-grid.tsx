"use client"

import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Copy, ExternalLink, Calendar } from "lucide-react"
import { useEffect, useState, useMemo } from "react"
import type { Snippet } from "@/lib/types"
import Link from "next/link"

interface SnippetGridProps {
  selectedCategory: string
}

export function SnippetGrid({ selectedCategory }: SnippetGridProps) {
  const [snippets, setSnippets] = useState<Snippet[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const filteredSnippets = useMemo(() => {
    console.log("[v0] Filtering snippets:", { selectedCategory, totalSnippets: snippets.length })
    console.log(
      "[v0] Available sections in data:",
      snippets.map((s) => s.section),
    )

    if (selectedCategory === "all") {
      return snippets
    }
    const filtered = snippets.filter((snippet) => snippet.section === selectedCategory)
    console.log("[v0] Filtered results:", { count: filtered.length, category: selectedCategory })
    return filtered
  }, [snippets, selectedCategory])

  useEffect(() => {
    async function fetchSnippets() {
      try {
        const response = await fetch("/api/snippets")
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const data = await response.json()
        setSnippets(data || [])
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch snippets")
      } finally {
        setLoading(false)
      }
    }

    fetchSnippets()
  }, [])

  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text)
      // TODO: Add toast notification
      console.log(`${type} copied to clipboard`)
    } catch (err) {
      console.error("Failed to copy:", err)
    }
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="p-0">
                <div className="aspect-video bg-muted rounded-t-lg" />
              </CardHeader>
              <CardContent className="p-4">
                <div className="space-y-2">
                  <div className="h-4 bg-muted rounded" />
                  <div className="h-3 bg-muted rounded w-2/3" />
                  <div className="h-3 bg-muted rounded w-1/2" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="text-center text-muted-foreground">
          <p>エラーが発生しました: {error}</p>
        </div>
      </div>
    )
  }

  if (filteredSnippets.length === 0 && !loading && !error) {
    return (
      <div className="p-6">
        <div className="text-center text-muted-foreground">
          <p>{selectedCategory === "all" ? "スニペットが見つかりません" : "このカテゴリにはスニペットがありません"}</p>
          <p className="text-sm mt-2">管理者画面からスニペットを追加してください</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredSnippets.map((snippet) => (
          <Card key={snippet.id} className="group hover:shadow-lg transition-all duration-200 hover:scale-[1.02]">
            <CardHeader className="p-0">
              <Link href={`/snippet/${snippet.id}`}>
                <div className="aspect-video bg-muted rounded-t-lg overflow-hidden cursor-pointer">
                  <img
                    src={
                      snippet.preview_image_url || "/placeholder.svg?height=200&width=300&query=code snippet preview"
                    }
                    alt={snippet.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                  />
                </div>
              </Link>
            </CardHeader>

            <CardContent className="p-4">
              <div className="space-y-2">
                <Link href={`/snippet/${snippet.id}`}>
                  <h3 className="font-semibold text-sm line-clamp-2 text-balance hover:text-primary cursor-pointer">
                    {snippet.title}
                  </h3>
                </Link>

                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Calendar className="h-3 w-3" />
                  <span>{new Date(snippet.updated_at).toLocaleDateString("ja-JP")}</span>
                </div>

                <p className="text-xs text-muted-foreground line-clamp-1">{snippet.company_name}</p>

                <div className="flex flex-wrap gap-1">
                  {snippet.tags.slice(0, 2).map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs px-2 py-0">
                      {tag}
                    </Badge>
                  ))}
                  {snippet.tags.length > 2 && (
                    <Badge variant="outline" className="text-xs px-2 py-0">
                      +{snippet.tags.length - 2}
                    </Badge>
                  )}
                </div>
              </div>
            </CardContent>

            <CardFooter className="p-4 pt-0 flex gap-2">
              <Link href={`/snippet/${snippet.id}`} className="flex-1">
                <Button size="sm" variant="outline" className="w-full gap-2 bg-transparent">
                  <Copy className="h-3 w-3" />
                  詳細・コピー
                </Button>
              </Link>
              {snippet.github_url && (
                <Button size="sm" variant="ghost" className="px-2" asChild>
                  <a href={snippet.github_url} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </Button>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}

"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Edit, Trash2, X, ArrowLeft } from "lucide-react"
import type { Snippet } from "@/lib/types"

const SECTIONS = [
  "ヘッダー",
  "ヒーローセクション",
  "会社概要セクション",
  "サービス紹介セクション",
  "料金・価格セクション",
  "事例セクション",
  "お客様の声セクション",
  "よくある質問セクション",
  "お問い合わせセクション",
  "フッター",
]

const COMMON_TAGS = [
  "スライダー",
  "写真3枚以上",
  "アニメーション",
  "レスポンシブ",
  "モーダル",
  "フォーム",
  "カルーセル",
  "パララックス",
  "グラデーション",
  "アイコン",
]

export default function AdminPage() {
  const [snippets, setSnippets] = useState<Snippet[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [editingSnippet, setEditingSnippet] = useState<Snippet | null>(null)
  const [isUploadingImage, setIsUploadingImage] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    section: "",
    company_name: "",
    tags: [] as string[],
    js_code: "",
    preview_image_url: "",
    github_url: "",
    gist_url: "",
    memo: "",
    public_url: "",
  })

  useEffect(() => {
    fetchSnippets()
  }, [])

  const fetchSnippets = async () => {
    try {
      const response = await fetch("/api/snippets")
      if (!response.ok) throw new Error("Failed to fetch snippets")
      const data = await response.json()
      setSnippets(data || [])
    } catch (error) {
      console.error("Error fetching snippets:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const method = editingSnippet ? "PUT" : "POST"
      const url = editingSnippet ? `/api/snippets/${editingSnippet.id}` : "/api/snippets"

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) throw new Error("Failed to save snippet")

      resetForm()
      fetchSnippets()
    } catch (error) {
      console.error("Error saving snippet:", error)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("このスニペットを削除しますか？")) return

    try {
      const response = await fetch(`/api/snippets/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) throw new Error("Failed to delete snippet")
      fetchSnippets()
    } catch (error) {
      console.error("Error deleting snippet:", error)
    }
  }

  const handleEdit = (snippet: Snippet) => {
    setEditingSnippet(snippet)
    setFormData({
      title: snippet.title,
      section: snippet.section,
      company_name: snippet.company_name,
      tags: snippet.tags,
      js_code: snippet.js_code || "",
      preview_image_url: snippet.preview_image_url || "",
      github_url: snippet.github_url || "",
      gist_url: snippet.gist_url || "",
      memo: snippet.memo || "",
      public_url: snippet.public_url || "",
    })
  }

  const resetForm = () => {
    setEditingSnippet(null)
    setFormData({
      title: "",
      section: "",
      company_name: "",
      tags: [],
      js_code: "",
      preview_image_url: "",
      github_url: "",
      gist_url: "",
      memo: "",
      public_url: "",
    })
  }

  const addTag = (tag: string) => {
    if (!formData.tags.includes(tag)) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, tag],
      }))
    }
  }

  const removeTag = (tag: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((t) => t !== tag),
    }))
  }

  const handleImageUpload = async (file: File) => {
    setIsUploadingImage(true)
    try {
      const canvas = document.createElement("canvas")
      const ctx = canvas.getContext("2d")
      const img = new Image()

      return new Promise<void>((resolve, reject) => {
        img.onload = () => {
          const maxWidth = 800
          const maxHeight = 600
          let { width, height } = img

          if (width > maxWidth) {
            height = (height * maxWidth) / width
            width = maxWidth
          }

          if (height > maxHeight) {
            width = (width * maxHeight) / height
            height = maxHeight
          }

          canvas.width = width
          canvas.height = height
          ctx?.drawImage(img, 0, 0, width, height)

          const dataUrl = canvas.toDataURL("image/jpeg", 0.8)

          setFormData((prev) => ({
            ...prev,
            preview_image_url: dataUrl,
          }))

          resolve()
        }

        img.onerror = () => reject(new Error("画像の読み込みに失敗しました"))
        img.src = URL.createObjectURL(file)
      })
    } catch (error) {
      console.error("Image upload error:", error)
      alert("画像のアップロードに失敗しました")
    } finally {
      setIsUploadingImage(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-gray-600">読み込み中...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4 mb-2">
            <Link href="/">
              <Button variant="outline" size="sm" className="flex items-center gap-2 bg-transparent">
                <ArrowLeft className="w-4 h-4" />
                一覧画面に戻る
              </Button>
            </Link>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">管理者画面</h1>
          <p className="text-gray-600">コードスニペットの追加・編集・削除</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <Tabs defaultValue="form" className="space-y-6">
          <TabsList>
            <TabsTrigger value="form">
              <Plus className="w-4 h-4 mr-2" />
              {editingSnippet ? "スニペット編集" : "スニペット追加"}
            </TabsTrigger>
            <TabsTrigger value="list">
              <Edit className="w-4 h-4 mr-2" />
              スニペット一覧
            </TabsTrigger>
          </TabsList>

          <TabsContent value="form">
            <Card>
              <CardHeader>
                <CardTitle>{editingSnippet ? "スニペットを編集" : "新しいスニペットを追加"}</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="title">タイトル</Label>
                      <Input
                        id="title"
                        value={formData.title}
                        onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                        placeholder="例: モダンなヒーローセクション"
                        className="placeholder:text-gray-400"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="section">セクション</Label>
                      <Select
                        value={formData.section}
                        onValueChange={(value) => setFormData((prev) => ({ ...prev, section: value }))}
                        required
                      >
                        <SelectTrigger className="placeholder:text-gray-400">
                          <SelectValue placeholder="セクションを選択" className="placeholder:text-gray-400" />
                        </SelectTrigger>
                        <SelectContent>
                          {SECTIONS.map((section) => (
                            <SelectItem key={section} value={section}>
                              {section}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="company">会社名</Label>
                      <Input
                        id="company"
                        value={formData.company_name}
                        onChange={(e) => setFormData((prev) => ({ ...prev, company_name: e.target.value }))}
                        placeholder="例: 株式会社サンプル"
                        className="placeholder:text-gray-400"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="github">GitHub URL（任意）</Label>
                      <Input
                        id="github"
                        value={formData.github_url}
                        onChange={(e) => setFormData((prev) => ({ ...prev, github_url: e.target.value }))}
                        placeholder="https://github.com/..."
                        className="placeholder:text-gray-400"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="gist">GistのURL（任意）</Label>
                      <Input
                        id="gist"
                        value={formData.gist_url}
                        onChange={(e) => setFormData((prev) => ({ ...prev, gist_url: e.target.value }))}
                        placeholder="https://gist.github.com/..."
                        className="placeholder:text-gray-400"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="public_url">公開URL（任意）</Label>
                      <Input
                        id="public_url"
                        value={formData.public_url}
                        onChange={(e) => setFormData((prev) => ({ ...prev, public_url: e.target.value }))}
                        placeholder="https://example.com/..."
                        className="placeholder:text-gray-400"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="memo">メモ欄（任意）</Label>
                      <Textarea
                        id="memo"
                        value={formData.memo}
                        onChange={(e) => setFormData((prev) => ({ ...prev, memo: e.target.value }))}
                        placeholder="補足情報やメモを入力..."
                        className="min-h-[80px] placeholder:text-gray-400"
                        rows={3}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>タグ</Label>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {formData.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                          {tag}
                          <X className="w-3 h-3 cursor-pointer" onClick={() => removeTag(tag)} />
                        </Badge>
                      ))}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {COMMON_TAGS.filter((tag) => !formData.tags.includes(tag)).map((tag) => (
                        <Button key={tag} type="button" variant="outline" size="sm" onClick={() => addTag(tag)}>
                          + {tag}
                        </Button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="preview">プレビュー画像</Label>
                    <div className="space-y-4">
                      <div className="flex items-center gap-4">
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0]
                            if (file) {
                              handleImageUpload(file)
                            }
                          }}
                          className="flex-1"
                          disabled={isUploadingImage}
                        />
                        {isUploadingImage && (
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-emerald-600"></div>
                            リサイズ中...
                          </div>
                        )}
                      </div>

                      <div className="text-sm text-gray-600">または</div>
                      <Input
                        type="url"
                        value={formData.preview_image_url.startsWith("data:") ? "" : formData.preview_image_url}
                        onChange={(e) => setFormData((prev) => ({ ...prev, preview_image_url: e.target.value }))}
                        placeholder="画像URLを直接入力"
                        className="flex-1 placeholder:text-gray-400"
                      />

                      {formData.preview_image_url && (
                        <div className="mt-2">
                          <img
                            src={formData.preview_image_url || "/placeholder.svg"}
                            alt="Preview"
                            className="w-32 h-24 object-cover rounded border"
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="js">TypeScriptコード</Label>
                    <Textarea
                      id="js"
                      value={formData.js_code}
                      onChange={(e) => setFormData((prev) => ({ ...prev, js_code: e.target.value }))}
                      placeholder="TypeScript/TSXコードを貼り付け..."
                      className="min-h-[400px] font-mono text-sm placeholder:text-gray-400"
                    />
                  </div>

                  <div className="flex gap-4">
                    <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700">
                      {editingSnippet ? "更新" : "保存"}
                    </Button>
                    {editingSnippet && (
                      <Button type="button" variant="outline" onClick={resetForm}>
                        キャンセル
                      </Button>
                    )}
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="list">
            <div className="space-y-4">
              {snippets.map((snippet) => (
                <Card key={snippet.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold text-lg">{snippet.title}</h3>
                          <Badge variant="outline">{snippet.section}</Badge>
                        </div>
                        <p className="text-gray-600 mb-2">{snippet.company_name}</p>
                        <div className="flex flex-wrap gap-1 mb-2">
                          {snippet.tags.map((tag) => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                        <p className="text-sm text-gray-500">
                          作成: {new Date(snippet.created_at).toLocaleDateString("ja-JP")}
                          {snippet.updated_at !== snippet.created_at && (
                            <span> / 更新: {new Date(snippet.updated_at).toLocaleDateString("ja-JP")}</span>
                          )}
                        </p>
                      </div>
                      <div className="flex gap-2 ml-4">
                        <Button variant="outline" size="sm" onClick={() => handleEdit(snippet)}>
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(snippet.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

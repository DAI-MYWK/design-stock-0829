import { GET } from "@/app/api/snippets/[id]/route"
import { notFound } from "next/navigation"
import { SnippetDetail } from "@/components/snippet-detail"
import { NextRequest } from "next/server"

interface SnippetPageProps {
  params: Promise<{ id: string }>
}

export default async function SnippetPage({ params }: SnippetPageProps) {
  try {
    const { id } = await params
    console.log("[v0] Fetching snippet with ID:", id)

    const mockRequest = new NextRequest(`http://localhost:3000/api/snippets/${id}`)
    const response = await GET(mockRequest, { params: { id } })

    console.log("[v0] Response status:", response.status)

    if (!response.ok) {
      console.error("[v0] API response not ok:", response.status)
      notFound()
    }

    const snippet = await response.json()
    console.log("[v0] Retrieved snippet:", snippet ? "found" : "not found")

    if (!snippet) {
      console.error("[v0] Snippet is null or undefined")
      notFound()
    }

    return <SnippetDetail snippet={snippet} />
  } catch (error) {
    console.error("[v0] Error fetching snippet:", error)
    console.error("[v0] Error details:", error instanceof Error ? error.message : "Unknown error")
    notFound()
  }
}

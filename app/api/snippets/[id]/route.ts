import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    console.log("[v0] Starting GET request for single snippet:", params.id)

    const supabaseUrl = process.env.SUPABASE_URL
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !supabaseKey) {
      console.error("[v0] Missing Supabase environment variables")
      return NextResponse.json({ error: "サーバー設定エラーです" }, { status: 500 })
    }

    const url = `${supabaseUrl}/rest/v1/snippets?id=eq.${params.id}&select=*`

    console.log("[v0] Making request to:", url)

    const response = await fetch(url, {
      headers: {
        apikey: supabaseKey,
        Authorization: `Bearer ${supabaseKey}`,
        "Content-Type": "application/json",
        Prefer: "return=representation",
      },
    })

    console.log("[v0] Response status:", response.status)

    if (!response.ok) {
      console.error("[v0] Supabase API error:", response.status, response.statusText)
      return NextResponse.json({ error: "データの取得に失敗しました" }, { status: response.status })
    }

    const data = await response.json()
    console.log("[v0] Retrieved data:", data.length, "items")

    if (!data || data.length === 0) {
      return NextResponse.json({ error: "スニペットが見つかりません" }, { status: 404 })
    }

    return NextResponse.json(data[0])
  } catch (error) {
    console.error("[v0] API error:", error)
    return NextResponse.json({ error: "サーバーエラーが発生しました" }, { status: 500 })
  }
}

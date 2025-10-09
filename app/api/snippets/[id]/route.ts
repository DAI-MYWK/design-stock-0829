import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    console.log("[v0] Starting GET request for single snippet:", id)

    const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseKey) {
      console.error("[v0] Missing Supabase environment variables")
      return NextResponse.json({ error: "サーバー設定エラーです" }, { status: 500 })
    }

    const url = `${supabaseUrl}/rest/v1/snippets?id=eq.${id}&select=*`

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

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    console.log("[v0] Starting PUT request for snippet:", id)

    const supabaseUrl = process.env.SUPABASE_URL
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !supabaseKey) {
      console.error("[v0] Missing Supabase environment variables")
      return NextResponse.json({ error: "サーバー設定エラーです" }, { status: 500 })
    }

    const body = await request.json()
    console.log("[v0] Request body received:", Object.keys(body))

    const url = `${supabaseUrl}/rest/v1/snippets?id=eq.${id}`

    const response = await fetch(url, {
      method: "PATCH",
      headers: {
        apikey: supabaseKey,
        Authorization: `Bearer ${supabaseKey}`,
        "Content-Type": "application/json",
        Prefer: "return=representation",
      },
      body: JSON.stringify(body),
    })

    console.log("[v0] PUT Response status:", response.status)

    if (!response.ok) {
      const errorText = await response.text()
      console.error("[v0] Update error:", response.status, errorText)
      return NextResponse.json({ error: "更新に失敗しました" }, { status: response.status })
    }

    const data = await response.json()
    return NextResponse.json(data[0] || {})
  } catch (error) {
    console.error("[v0] PUT API error:", error)
    return NextResponse.json({ error: "サーバーエラーが発生しました" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    console.log("[v0] Starting DELETE request for snippet:", id)

    const supabaseUrl = process.env.SUPABASE_URL
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !supabaseKey) {
      console.error("[v0] Missing Supabase environment variables")
      return NextResponse.json({ error: "サーバー設定エラーです" }, { status: 500 })
    }

    const url = `${supabaseUrl}/rest/v1/snippets?id=eq.${id}`

    const response = await fetch(url, {
      method: "DELETE",
      headers: {
        apikey: supabaseKey,
        Authorization: `Bearer ${supabaseKey}`,
        "Content-Type": "application/json",
      },
    })

    console.log("[v0] DELETE Response status:", response.status)

    if (!response.ok) {
      const errorText = await response.text()
      console.error("[v0] Delete error:", response.status, errorText)
      return NextResponse.json({ error: "削除に失敗しました" }, { status: response.status })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] DELETE API error:", error)
    return NextResponse.json({ error: "サーバーエラーが発生しました" }, { status: 500 })
  }
}

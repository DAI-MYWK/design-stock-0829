import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    console.log("[v0] Starting GET request for snippets")

    const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    console.log("[v0] Environment check:", {
      hasUrl: !!supabaseUrl,
      hasKey: !!supabaseKey,
      urlPrefix: supabaseUrl?.substring(0, 20) + "...",
    })

    if (!supabaseUrl || !supabaseKey) {
      console.error("[v0] Missing environment variables")
      return NextResponse.json({ error: "Missing Supabase configuration" }, { status: 500 })
    }

    const { searchParams } = new URL(request.url)
    const section = searchParams.get("section")

    // Build Supabase REST API URL
    let apiUrl = `${supabaseUrl}/rest/v1/snippets?select=*&order=created_at.desc`

    if (section && section !== "all") {
      apiUrl += `&section=eq.${encodeURIComponent(section)}`
    }

    console.log("[v0] Making request to:", apiUrl)

    const response = await fetch(apiUrl, {
      method: "GET",
      headers: {
        apikey: supabaseKey,
        Authorization: `Bearer ${supabaseKey}`,
        "Content-Type": "application/json",
      },
    })

    console.log("[v0] Response status:", response.status)
    console.log("[v0] Response headers:", Object.fromEntries(response.headers.entries()))

    if (!response.ok) {
      const errorText = await response.text()
      console.error("[v0] Supabase API error:", response.status, errorText)
      return NextResponse.json({ error: `Database error: ${response.status}` }, { status: 500 })
    }

    const data = await response.json()
    console.log("[v0] Retrieved data:", data?.length || 0, "items")

    return NextResponse.json(data || [])
  } catch (error) {
    console.error("[v0] API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log("[v0] Starting POST request for snippets")

    const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    console.log("[v0] POST Environment check:", {
      hasUrl: !!supabaseUrl,
      hasKey: !!supabaseKey,
      urlPrefix: supabaseUrl?.substring(0, 20) + "...",
    })

    if (!supabaseUrl || !supabaseKey) {
      console.error("[v0] Missing environment variables for POST")
      return NextResponse.json({ error: "Missing Supabase configuration" }, { status: 500 })
    }

    const body = await request.json()
    console.log("[v0] Request body received:", Object.keys(body))

    const bodyString = JSON.stringify(body)
    const payloadSize = Buffer.byteLength(bodyString, "utf8")
    console.log("[v0] Payload size:", payloadSize, "bytes")

    // Limit payload to 1MB to prevent Supabase errors
    if (payloadSize > 1024 * 1024) {
      console.error("[v0] Payload too large:", payloadSize)
      return NextResponse.json(
        {
          error: "データサイズが大きすぎます。コードを短くするか、画像URLを使用してください。",
        },
        { status: 413 },
      )
    }

    const apiUrl = `${supabaseUrl}/rest/v1/snippets`
    console.log("[v0] Making POST request to:", apiUrl)

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        apikey: supabaseKey,
        Authorization: `Bearer ${supabaseKey}`,
        "Content-Type": "application/json",
        Prefer: "return=representation",
      },
      body: bodyString,
    })

    console.log("[v0] POST Response status:", response.status)
    console.log("[v0] POST Response headers:", Object.fromEntries(response.headers.entries()))

    const responseText = await response.text()
    console.log("[v0] Raw response:", responseText.substring(0, 200) + "...")

    if (!response.ok) {
      if (responseText.includes("Request Entity Too Large") || responseText.includes("FUNCTION_PAYLOAD_TOO_LARGE")) {
        return NextResponse.json(
          {
            error: "データサイズが大きすぎます。コードを短くするか、画像URLを使用してください。",
          },
          { status: 413 },
        )
      }

      console.error("[v0] Insert error:", response.status, responseText)
      return NextResponse.json(
        {
          error: `データベースエラー: ${response.status}`,
        },
        { status: response.status },
      )
    }

    let data
    try {
      data = JSON.parse(responseText)
      console.log("[v0] Parsed response successfully")
    } catch (parseError) {
      console.error("[v0] JSON parse error:", parseError)
      console.error("[v0] Response was:", responseText)
      return NextResponse.json({ error: "データベースからの応答が無効です" }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("[v0] API error:", error)
    return NextResponse.json({ error: "内部サーバーエラー" }, { status: 500 })
  }
}

export interface SupabaseClient {
  from: (table: string) => SupabaseQueryBuilder
}

export interface SupabaseQueryBuilder {
  select: (columns?: string) => SupabaseQueryBuilder
  insert: (data: any) => SupabaseQueryBuilder
  update: (data: any) => SupabaseQueryBuilder
  delete: () => SupabaseQueryBuilder
  eq: (column: string, value: any) => SupabaseQueryBuilder
  order: (column: string, options?: { ascending?: boolean }) => SupabaseQueryBuilder
  limit: (count: number) => SupabaseQueryBuilder
}

class SupabaseQueryBuilderImpl implements SupabaseQueryBuilder {
  private table: string
  private selectColumns = "*"
  private filters: string[] = []
  private orderBy = ""
  private limitCount: number | null = null
  private method: "GET" | "POST" | "PATCH" | "DELETE" = "GET"
  private data: any = null
  private useServiceRole: boolean

  constructor(table: string, useServiceRole = true) {
    this.table = table
    this.useServiceRole = useServiceRole
  }

  select(columns = "*"): SupabaseQueryBuilder {
    this.selectColumns = columns
    this.method = "GET"
    return this
  }

  insert(data: any): SupabaseQueryBuilder {
    this.data = data
    this.method = "POST"
    return this
  }

  update(data: any): SupabaseQueryBuilder {
    this.data = data
    this.method = "PATCH"
    return this
  }

  delete(): SupabaseQueryBuilder {
    this.method = "DELETE"
    return this
  }

  eq(column: string, value: any): SupabaseQueryBuilder {
    this.filters.push(`${column}=eq.${value}`)
    return this
  }

  order(column: string, options?: { ascending?: boolean }): SupabaseQueryBuilder {
    const direction = options?.ascending === false ? "desc" : "asc"
    this.orderBy = `${column}.${direction}`
    return this
  }

  limit(count: number): SupabaseQueryBuilder {
    this.limitCount = count
    return this
  }

  async then(resolve: (value: any) => void, reject?: (reason: any) => void) {
    try {
      const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
      const supabaseKey = this.useServiceRole
        ? process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
        : process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

      if (!supabaseUrl || !supabaseKey) {
        throw new Error("Supabase environment variables not configured")
      }

      let url = `${supabaseUrl}/rest/v1/${this.table}`
      const headers: Record<string, string> = {
        apikey: supabaseKey,
        Authorization: `Bearer ${supabaseKey}`,
        "Content-Type": "application/json",
        Prefer: "return=representation",
      }

      // Add query parameters
      const params = new URLSearchParams()
      if (this.method === "GET") {
        params.append("select", this.selectColumns)
      }
      if (this.filters.length > 0) {
        this.filters.forEach((filter) => {
          const [key, value] = filter.split("=")
          params.append(key, value)
        })
      }
      if (this.orderBy) {
        params.append("order", this.orderBy)
      }
      if (this.limitCount) {
        params.append("limit", this.limitCount.toString())
      }

      if (params.toString()) {
        url += `?${params.toString()}`
      }

      const options: RequestInit = {
        method: this.method,
        headers,
      }

      if (this.data && (this.method === "POST" || this.method === "PATCH")) {
        options.body = JSON.stringify(this.data)
      }

      const response = await fetch(url)

      if (!response.ok) {
        throw new Error(`Supabase API error: ${response.status} ${response.statusText}`)
      }

      const result = await response.json()
      resolve({ data: result, error: null })
    } catch (error) {
      if (reject) {
        reject({ data: null, error })
      } else {
        resolve({ data: null, error })
      }
    }
  }
}

class SupabaseServerClientImpl implements SupabaseClient {
  from(table: string): SupabaseQueryBuilder {
    return new SupabaseQueryBuilderImpl(table, true)
  }
}

export async function createClient(): Promise<SupabaseClient> {
  const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error(
      "Missing Supabase environment variables. Please check your environment variables in Project Settings.",
    )
  }

  return new SupabaseServerClientImpl()
}

export { createClient as createServerClient }

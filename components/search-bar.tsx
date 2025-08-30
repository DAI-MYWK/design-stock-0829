"use client"

import { Search, Filter } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export function SearchBar() {
  return (
    <div className="flex items-center gap-4 flex-1 max-w-2xl">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="コードスニペットを検索..."
          className="pl-10 bg-muted/50 border-border focus:bg-background"
        />
      </div>

      <Button variant="outline" size="sm" className="gap-2 bg-transparent">
        <Filter className="h-4 w-4" />
        フィルター
      </Button>
    </div>
  )
}

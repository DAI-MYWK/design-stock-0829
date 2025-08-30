"use client"

import { Sidebar } from "@/components/sidebar"
import { SnippetGrid } from "@/components/snippet-grid"
import { SearchBar } from "@/components/search-bar"
import { Suspense, useState } from "react"

export default function HomePage() {
  const [selectedCategory, setSelectedCategory] = useState("all")

  return (
    <div className="flex h-screen bg-background">
      <Sidebar selectedCategory={selectedCategory} onCategoryChange={setSelectedCategory} />

      <main className="flex-1 flex flex-col overflow-hidden">
        <div className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="flex h-16 items-center px-6">
            <SearchBar />
          </div>
        </div>

        <div className="flex-1 overflow-auto">
          <Suspense fallback={<div className="p-6">Loading snippets...</div>}>
            <SnippetGrid selectedCategory={selectedCategory} />
          </Suspense>
        </div>
      </main>
    </div>
  )
}

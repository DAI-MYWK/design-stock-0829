"use client"

import { cn } from "@/lib/utils"
import Link from "next/link"
import { Home, Zap, DollarSign, Briefcase, FileText, Users, HelpCircle, Mail, ChevronRight, Menu, MoreHorizontal, Award } from "lucide-react"

const sections = [
  { id: "all", name: "すべて", icon: Home },
  { id: "ヘッダー", name: "ヘッダー", icon: Menu },
  { id: "ヒーローセクション", name: "ヒーローセクション", icon: Zap },
  { id: "会社概要セクション", name: "会社概要セクション", icon: Briefcase },
  { id: "サービス紹介セクション", name: "サービス紹介セクション", icon: FileText },
  { id: "料金・価格セクション", name: "料金・価格セクション", icon: DollarSign },
  { id: "事例セクション", name: "事例セクション", icon: Award },
  { id: "お客様の声セクション", name: "お客様の声セクション", icon: Users },
  { id: "よくある質問セクション", name: "よくある質問セクション", icon: HelpCircle },
  { id: "お問い合わせセクション", name: "お問い合わせセクション", icon: Mail },
  { id: "フッター", name: "フッター", icon: MoreHorizontal },
]

interface SidebarProps {
  selectedCategory: string
  onCategoryChange: (category: string) => void
}

export function Sidebar({ selectedCategory, onCategoryChange }: SidebarProps) {
  return (
    <div className="w-64 bg-sidebar border-r border-sidebar-border flex flex-col">
      <div className="p-6 border-b border-sidebar-border">
        <h1 className="text-xl font-semibold text-sidebar-foreground">Code Stock</h1>
        <p className="text-sm text-muted-foreground mt-1">デザインコード管理</p>
      </div>

      <nav className="flex-1 p-3">
        <div className="space-y-1">
          {sections.map((section) => {
            const Icon = section.icon
            const isActive = selectedCategory === section.id

            return (
              <button
                key={section.id}
                onClick={() => onCategoryChange(section.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2 text-sm rounded-lg transition-colors",
                  "hover:bg-sidebar-accent/10 hover:text-sidebar-accent-foreground",
                  isActive && "bg-sidebar-accent text-sidebar-accent-foreground",
                )}
              >
                <Icon className="h-5 w-5 flex-shrink-0" />
                <span className="flex-1 text-left">{section.name}</span>
                {isActive && <ChevronRight className="h-4 w-4" />}
              </button>
            )
          })}
        </div>
      </nav>

      <div className="p-3 border-t border-sidebar-border">
        <Link
          href="/admin"
          className="w-full flex items-center gap-3 px-3 py-2 text-sm rounded-lg transition-colors hover:bg-sidebar-accent/10 hover:text-sidebar-accent-foreground"
        >
          <FileText className="h-5 w-5" />
          <span>管理者画面</span>
        </Link>
      </div>
    </div>
  )
}

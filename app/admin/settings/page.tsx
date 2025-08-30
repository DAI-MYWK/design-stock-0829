"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Settings, Shield, Globe } from "lucide-react"

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState({
    ipRestrictionEnabled: false,
    allowedIPs: "",
    adminPassword: "",
    siteName: "コードスニペット管理",
    siteDescription: "デザイン制作会社のソースコードストック",
  })

  const handleSave = () => {
    // TODO: Save settings to database or config
    console.log("Settings saved:", settings)
    alert("設定を保存しました")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center gap-2">
            <Settings className="w-6 h-6 text-emerald-600" />
            <h1 className="text-2xl font-bold text-gray-900">システム設定</h1>
          </div>
          <p className="text-gray-600">アプリケーションの設定を管理</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        {/* IP制限設定 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-emerald-600" />
              IPアドレス制限
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="ip-restriction">IPアドレス制限を有効にする</Label>
                <p className="text-sm text-gray-600">指定したIPアドレスからのみアクセスを許可します</p>
              </div>
              <Switch
                id="ip-restriction"
                checked={settings.ipRestrictionEnabled}
                onCheckedChange={(checked) => setSettings((prev) => ({ ...prev, ipRestrictionEnabled: checked }))}
              />
            </div>

            {settings.ipRestrictionEnabled && (
              <div className="space-y-2">
                <Label htmlFor="allowed-ips">許可するIPアドレス</Label>
                <Textarea
                  id="allowed-ips"
                  value={settings.allowedIPs}
                  onChange={(e) => setSettings((prev) => ({ ...prev, allowedIPs: e.target.value }))}
                  placeholder="192.168.1.100&#10;203.0.113.0/24&#10;2001:db8::/32"
                  className="min-h-[100px]"
                />
                <p className="text-sm text-gray-500">1行に1つずつIPアドレスまたはCIDR記法で入力してください</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* サイト設定 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="w-5 h-5 text-emerald-600" />
              サイト設定
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="site-name">サイト名</Label>
              <Input
                id="site-name"
                value={settings.siteName}
                onChange={(e) => setSettings((prev) => ({ ...prev, siteName: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="site-description">サイト説明</Label>
              <Input
                id="site-description"
                value={settings.siteDescription}
                onChange={(e) => setSettings((prev) => ({ ...prev, siteDescription: e.target.value }))}
              />
            </div>
          </CardContent>
        </Card>

        {/* 管理者設定 */}
        <Card>
          <CardHeader>
            <CardTitle>管理者設定</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="admin-password">管理者パスワード（変更する場合のみ）</Label>
              <Input
                id="admin-password"
                type="password"
                value={settings.adminPassword}
                onChange={(e) => setSettings((prev) => ({ ...prev, adminPassword: e.target.value }))}
                placeholder="新しいパスワードを入力"
              />
              <p className="text-sm text-gray-500">空欄の場合は現在のパスワードが維持されます</p>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button onClick={handleSave} className="bg-emerald-600 hover:bg-emerald-700">
            設定を保存
          </Button>
        </div>
      </div>
    </div>
  )
}

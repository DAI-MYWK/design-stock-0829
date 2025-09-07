/**
 * Supabaseからデータをエクスポートするスクリプト
 * 使用方法: node scripts/export-data.js
 */

async function exportData() {
  // 環境変数を確認
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Supabase環境変数が設定されていません')
    console.log('以下の環境変数を設定してください:')
    console.log('- NEXT_PUBLIC_SUPABASE_URL (または SUPABASE_URL)')
    console.log('- SUPABASE_SERVICE_ROLE_KEY (または NEXT_PUBLIC_SUPABASE_ANON_KEY)')
    console.log('\n現在のVercelプロジェクトから環境変数を取得してください。')
    process.exit(1)
  }

  try {
    console.log('🔍 Supabaseからデータを取得中...')
    console.log(`📍 URL: ${supabaseUrl.substring(0, 30)}...`)

    // スニペットデータを取得
    const response = await fetch(`${supabaseUrl}/rest/v1/snippets?select=*&order=created_at.desc`, {
      method: 'GET',
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }

    const snippets = await response.json()
    console.log(`✅ ${snippets.length}件のスニペットを取得しました`)

    // 現在の日時でファイル名を生成
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').split('T')[0]
    const filename = `snippets-export-${timestamp}.json`

    // ファイルシステムを使用してエクスポート
    const fs = require('fs')
    const path = require('path')
    
    const exportData = {
      export_info: {
        timestamp: new Date().toISOString(),
        count: snippets.length,
        source: 'production'
      },
      snippets: snippets
    }

    const exportPath = path.join(__dirname, filename)
    fs.writeFileSync(exportPath, JSON.stringify(exportData, null, 2))

    console.log(`💾 データをエクスポートしました: ${exportPath}`)
    console.log('\n📋 エクスポートされたデータ:')
    snippets.forEach((snippet, index) => {
      console.log(`${index + 1}. ${snippet.title} (${snippet.section})`)
    })

    return exportData
  } catch (error) {
    console.error('❌ エクスポートに失敗しました:', error.message)
    process.exit(1)
  }
}

// スクリプトが直接実行された場合
if (require.main === module) {
  exportData()
}

module.exports = { exportData }

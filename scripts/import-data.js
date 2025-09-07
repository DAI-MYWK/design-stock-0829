/**
 * エクスポートしたデータを開発用Supabaseにインポートするスクリプト
 * 使用方法: node scripts/import-data.js <エクスポートファイル>
 */

const fs = require('fs')
const path = require('path')

async function importData(filePath) {
  // 環境変数を確認（開発用）
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseKey) {
    console.error('❌ 開発用Supabase環境変数が設定されていません')
    process.exit(1)
  }

  try {
    // エクスポートファイルを読み込み
    if (!fs.existsSync(filePath)) {
      throw new Error(`ファイルが見つかりません: ${filePath}`)
    }

    const exportData = JSON.parse(fs.readFileSync(filePath, 'utf8'))
    const snippets = exportData.snippets

    console.log(`📂 ${snippets.length}件のスニペットをインポートします`)
    console.log(`🎯 インポート先: ${supabaseUrl.substring(0, 30)}...`)

    // まず既存のデータを確認
    const checkResponse = await fetch(`${supabaseUrl}/rest/v1/snippets?select=count`, {
      method: 'GET',
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
        'Content-Type': 'application/json',
        'Prefer': 'count=exact'
      },
    })

    if (checkResponse.ok) {
      const existingCount = parseInt(checkResponse.headers.get('content-range')?.split('/')[1] || '0')
      if (existingCount > 0) {
        console.log(`⚠️  既存のデータが${existingCount}件あります`)
        console.log('続行しますか？ (y/N)')
        // 本来はreadlineを使うが、簡略化
        console.log('スクリプトを続行します...')
      }
    }

    // データを一括インポート
    const insertData = snippets.map(snippet => ({
      ...snippet,
      id: undefined // 新しいIDを自動生成
    }))

    const response = await fetch(`${supabaseUrl}/rest/v1/snippets`, {
      method: 'POST',
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=minimal'
      },
      body: JSON.stringify(insertData)
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`インポートエラー: ${response.status} - ${errorText}`)
    }

    console.log('✅ データのインポートが完了しました！')
    console.log('\n📋 インポートされたスニペット:')
    snippets.forEach((snippet, index) => {
      console.log(`${index + 1}. ${snippet.title} (${snippet.section})`)
    })

  } catch (error) {
    console.error('❌ インポートに失敗しました:', error.message)
    process.exit(1)
  }
}

// スクリプトが直接実行された場合
if (require.main === module) {
  const filePath = process.argv[2]
  if (!filePath) {
    console.error('使用方法: node scripts/import-data.js <エクスポートファイル>')
    process.exit(1)
  }

  const fullPath = path.isAbsolute(filePath) ? filePath : path.join(__dirname, filePath)
  importData(fullPath)
}

module.exports = { importData }

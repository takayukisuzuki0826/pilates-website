#!/bin/bash
# Vercel デプロイ用スクリプト
# 事前: vercel login を実行すること（npx vercel login）
# 事前: Resend API キー・INSTRUCTOR_EMAIL・ADMIN_PASSWORD を用意すること

set -e
cd "$(dirname "$0")/.."

echo "=== Vercel デプロイ ==="
echo "※ 初回は npx vercel login でログインしてください"
echo "※ 環境変数は Vercel ダッシュボードで設定してください（SETUP_COMPLETE.md 参照）"
echo ""

npm_config_cache="$(pwd)/.npm-cache" npx vercel --prod --yes

echo ""
echo "=== 完了 ==="

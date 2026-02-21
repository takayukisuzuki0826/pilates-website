#!/bin/bash
# ローカル開発用 .env.local を準備
cd "$(dirname "$0")/.."

if [[ -f ".env.local" ]]; then
  echo ".env.local は既に存在します。上書きしません。"
  exit 0
fi

if [[ ! -f ".setup-keys/env-generated.txt" ]]; then
  echo "Error: .setup-keys/env-generated.txt がありません。"
  exit 1
fi

cp .env.local.example .env.local
cat .setup-keys/env-generated.txt >> .env.local
echo ""
echo ".env.local を作成しました。"
echo "RESEND_API_KEY, INSTRUCTOR_EMAIL, ADMIN_PASSWORD を編集して追加してください。"

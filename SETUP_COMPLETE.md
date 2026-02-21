# セットアップ完了レポート

自動で以下を実施しました。

---

## 実施済み

### 1. Google Cloud (GCP)
- **プロジェクト**: `pilates-website-vtj`
- **API**: Calendar API, Sheets API, Drive API を有効化
- **サービスアカウント**: `pilates-booking@pilates-website-vtj.iam.gserviceaccount.com`
- **キー**: `.setup-keys/sa-key.json`（Base64 は env-generated.txt に出力済み）

### 2. Google カレンダー
- **予約カレンダー作成済み**
- **ID**: `86ca77d3b10340ff36e983ec63e99190388e712e5658ed0cf74d413831b7f98b@group.calendar.google.com`
- サービスアカウントがオーナーなので共有不要

### 3. Google スプレッドシート
- **作成済み**: [pilates-website-data](https://docs.google.com/spreadsheets/d/142LQAv0N3MkfRBFHFtkhNl-pJO5NstViIxMou7C6gI8/edit)
- **シート**: customers, bookings, lesson_notes（ヘッダー行あり）
- サービスアカウントと共有済み

### 4. GitHub
- **リポジトリ**: https://github.com/takayukisuzuki0826/pilates-website
- main ブランチに push 済み

### 5. プロジェクト名
- `package.json` の name を `pilates-website` に変更済み

---

## あなたがやること

### 1. Resend の設定
1. https://resend.com でアカウント作成
2. API Keys → Create API Key
3. キーをコピー

### 2. Vercel でデプロイ
1. https://vercel.com にログイン
2. **Add New** → **Project**
3. **Import** で `takayukisuzuki0826/pilates-website` を選択
4. **Environment Variables** で以下を追加:

| 変数名 | 値 | 取得元 |
|--------|-----|--------|
| GOOGLE_SERVICE_ACCOUNT_KEY_BASE64 | （長い文字列） | `.setup-keys/env-generated.txt` の1行目 |
| GOOGLE_CALENDAR_ID_BOOKING | `86ca77d3b10340ff36e983ec63e99190388e712e5658ed0cf74d413831b7f98b@group.calendar.google.com` | 上記 |
| GOOGLE_SHEETS_ID | `142LQAv0N3MkfRBFHFtkhNl-pJO5NstViIxMou7C6gI8` | 上記 |
| CRON_SECRET | `9c76a28caf5039a0287b19840e3761d0e7834931e4f448ef8a9cf3c097be6b1b` | 上記 |
| RESEND_API_KEY | （Resend で取得） | Resend ダッシュボード |
| RESEND_FROM | `onboarding@resend.dev` | テスト用（本番は独自ドメイン） |
| INSTRUCTOR_EMAIL | あなたのメール | 失敗通知の宛先 |
| ADMIN_PASSWORD | 任意の強力なパスワード | 管理画面用 |
| NEXT_PUBLIC_SITE_URL | （デプロイ後に設定） | 例: `https://pilates-website.vercel.app` |

5. **Deploy** をクリック

### 3. デプロイ後の設定
- デプロイ完了後、表示された URL を `NEXT_PUBLIC_SITE_URL` に設定
- **Redeploy** を実行

---

## 環境変数ファイルの場所

`.setup-keys/env-generated.txt` に Google 関連の値が入っています。
**このファイルは Git にコミットされません**（.gitignore で除外済み）。

---

## ローカルで試す場合

```bash
cp .env.local.example .env.local
# .env.local に .setup-keys/env-generated.txt の値をコピー
# RESEND_API_KEY, INSTRUCTOR_EMAIL, ADMIN_PASSWORD を追加
npm run dev
```

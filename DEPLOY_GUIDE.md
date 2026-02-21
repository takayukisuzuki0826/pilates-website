# pilates-website デプロイ完全ガイド

リンクを開くところから、環境構築・デプロイまで一通り手順をまとめています。

---

## 目次

1. [Vercel にログイン](#1-vercel-にログイン)
2. [GitHub にリポジトリを用意](#2-github-にリポジトリを用意)
3. [Google Cloud の設定](#3-google-cloud-の設定)
4. [Google カレンダーの準備](#4-google-カレンダーの準備)
5. [Google スプレッドシートの準備](#5-google-スプレッドシートの準備)
6. [Resend の設定](#6-resend-の設定)
7. [Vercel でプロジェクト作成・デプロイ](#7-vercel-でプロジェクト作成デプロイ)
8. [環境変数を設定](#8-環境変数を設定)
9. [動作確認](#9-動作確認)

---

## 1. Vercel にログイン

1. ブラウザで **https://vercel.com** を開く
2. 右上の **「Log in」** をクリック
3. **GitHub** でログイン（推奨）
   - 「Continue with GitHub」→ 認証画面で許可
4. ログイン後、ダッシュボード（https://vercel.com/dashboard）が表示されればOK

---

## 2. GitHub にリポジトリを用意

### 2-1. GitHub にログイン

- https://github.com にアクセスしてログイン

### 2-2. 新規リポジトリ作成

1. 右上 **「+」** → **「New repository」**
2. 設定例：
   - **Repository name**: `pilates-website`
   - **Description**: （任意）ピラティススタジオのウェブサイト
   - **Public** を選択
   - **「Create repository」** をクリック

### 2-3. ローカルから push

ターミナルで以下を実行（パスは自分の環境に合わせて変更）：

```bash
cd "/Users/takayukisuzuki/VYPER JAPAN Dropbox/Suzuki Takayuki/VYPER-Dev/pilates-booking"

# Git 初期化（まだの場合）
git init

# リモート追加（YOUR_USERNAME を自分の GitHub ユーザー名に変更）
git remote add origin https://github.com/YOUR_USERNAME/pilates-website.git

# 全ファイルを追加
git add .

# .env.local は絶対にコミットしない（.gitignore に含まれているか確認）
git status   # .env.local が表示されないことを確認

# 初回コミット
git commit -m "Initial commit: pilates-website"

# main ブランチに push
git branch -M main
git push -u origin main
```

※ `.env.local` が `git status` に出る場合は、`.gitignore` に `.env.local` が含まれているか確認してください。

---

## 3. Google Cloud の設定

### 3-1. Google Cloud Console を開く

1. **https://console.cloud.google.com** を開く
2. Google アカウントでログイン

### 3-2. プロジェクト作成

1. 画面上部のプロジェクト選択ドロップダウンをクリック
2. **「新しいプロジェクト」** をクリック
3. **プロジェクト名**: `pilates-website`（任意）
4. **「作成」** をクリック
5. 作成したプロジェクトを選択

### 3-3. API を有効化

1. 左メニュー **「API とサービス」** → **「ライブラリ」**
2. **「Google Calendar API」** を検索 → クリック → **「有効にする」**
3. 戻って **「Google Sheets API」** を検索 → クリック → **「有効にする」**

### 3-4. サービスアカウント作成

1. 左メニュー **「API とサービス」** → **「認証情報」**
2. **「認証情報を作成」** → **「サービス アカウント」**
3. **サービス アカウント名**: `pilates-booking`（任意）
4. **「作成して続行」** → ロールはスキップ → **「完了」**
5. 作成したサービスアカウントをクリック
6. **「キー」** タブ → **「鍵を追加」** → **「新しい鍵を作成」**
7. **JSON** を選択 → **「作成」**
8. JSON ファイルがダウンロードされる（**このファイルは厳重に保管、Git にコミットしない**）

### 3-5. サービスアカウントキーを Base64 に変換

ターミナルで実行（`path/to/your-key.json` をダウンロードした JSON のパスに変更）：

```bash
base64 -i path/to/your-key.json | tr -d '\n' | pbcopy
```

これで Base64 文字列がクリップボードにコピーされます。後で `GOOGLE_SERVICE_ACCOUNT_KEY_BASE64` に貼り付けます。

---

## 4. Google カレンダーの準備

### 4-1. 予約用カレンダーを作成

1. **https://calendar.google.com** を開く
2. 左サイドバー **「他のカレンダー」** の横 **「+」** → **「新しいカレンダーを作成」**
3. **名前**: `予約カレンダー`（任意）
4. **「カレンダーを作成」** をクリック

### 4-2. カレンダー ID を取得

1. 作成したカレンダー名をクリック
2. **「設定と共有」** をクリック
3. 下にスクロールして **「カレンダーの統合」** セクション
4. **「カレンダー ID」** をコピー（例: `xxxxx@group.calendar.google.com`）

→ これを `GOOGLE_CALENDAR_ID_BOOKING` に設定します。

### 4-3. サービスアカウントにカレンダーを共有

1. 同じ「設定と共有」画面で **「特定のユーザーやグループと共有」** をクリック
2. **メールアドレス** に、サービスアカウントのメール（JSON 内の `client_email`、例: `pilates-booking@project-id.iam.gserviceaccount.com`）を入力
3. 権限を **「予定の変更、共有設定の管理」** に設定
4. **「送信」** をクリック

### 4-4. 個人カレンダー（オプション）

自分の予定と重ならないようにしたい場合：

1. 自分の Google カレンダー（メイン）の **「設定と共有」** を開く
2. **「カレンダー ID」** をコピー
3. `GOOGLE_CALENDAR_ID_PERSONAL` に設定

※設定しない場合は空のままでOK。予約カレンダーだけが使われます。

---

## 5. Google スプレッドシートの準備

### 5-1. 新規スプレッドシート作成

1. **https://sheets.google.com** を開く
2. **「空白」** で新規作成
3. ファイル名を `pilates-website-data` などに変更

### 5-2. シート（タブ）を 3 つ作成

デフォルトの「シート1」をリネームし、2 つ追加します。

| タブ名 | 用途 |
|--------|------|
| `customers` | 顧客一覧 |
| `bookings` | 予約一覧 |
| `lesson_notes` | レッスンメモ |

### 5-3. ヘッダー行を入力

**customers シート**（1行目）:
| A | B | C | D | E | F | G |
|---|---|---|---|---|---|---|
| customerId | name | email | phone | firstVisit | totalVisits | memo |

**bookings シート**（1行目）:
| A | B | C | D | E | F | G | H |
|---|---|---|---|---|---|---|---|
| bookingId | customerId | date | startTime | status | calendarEventId | cancelToken | createdAt |

**lesson_notes シート**（1行目）:
| A | B | C | D | E | F |
|---|---|---|---|---|---|
| noteId | customerId | date | content | nextAction | createdAt |

### 5-4. サービスアカウントに共有

1. スプレッドシート右上 **「共有」** をクリック
2. サービスアカウントのメール（`client_email`）を追加
3. 権限 **「編集者」** を選択
4. **「送信」** をクリック

### 5-5. スプレッドシート ID を取得

ブラウザの URL を確認：
```
https://docs.google.com/spreadsheets/d/【ここがID】/edit
```

`/d/` と `/edit` の間の文字列が **スプレッドシート ID** です。→ `GOOGLE_SHEETS_ID` に設定します。

---

## 6. Resend の設定

### 6-1. アカウント作成

1. **https://resend.com** を開く
2. **「Sign Up」** でアカウント作成（メールアドレス or GitHub）

### 6-2. API キー取得

1. ログイン後、**「API Keys」** を開く
2. **「Create API Key」** をクリック
3. 名前を入力（例: `pilates-website`）→ **「Add」**
4. 表示された API キーをコピー（**一度しか表示されないので必ず保存**）

→ `RESEND_API_KEY` に設定します。

### 6-3. 送信元ドメイン

**すぐ試す場合（テスト用）**:
- Resend のデフォルトドメイン `onboarding@resend.dev` が使えます
- `RESEND_FROM` を `onboarding@resend.dev` に設定
- ※受信先は、Resend に登録したメールアドレスに限定される場合があります

**本番運用**:
1. Resend の **「Domains」** で自分のドメインを追加
2. DNS レコード（SPF, DKIM など）を設定
3. 検証後、`RESEND_FROM` を `noreply@yourdomain.com` などに変更

---

## 7. Vercel でプロジェクト作成・デプロイ

### 7-1. 新規プロジェクトをインポート

1. **https://vercel.com/dashboard** を開く
2. **「Add New...」** → **「Project」**
3. **「Import Git Repository」** で GitHub の `pilates-website` を選択
4. 表示されない場合は **「Configure GitHub App」** でリポジトリアクセスを許可

### 7-2. プロジェクト設定

| 項目 | 値 |
|------|-----|
| Project Name | `pilates-website` |
| Framework Preset | Next.js（自動検出） |
| Root Directory | `./`（そのまま） |
| Build Command | `next build`（そのまま） |
| Output Directory | `.next`（そのまま） |

**「Deploy」** はまだ押さない。先に環境変数を設定します。

---

## 8. 環境変数を設定

### 8-1. 環境変数画面を開く

1. プロジェクトインポート画面で **「Environment Variables」** を展開
2. または、デプロイ後に **プロジェクト** → **「Settings」** → **「Environment Variables」**

### 8-2. 以下を追加

| 変数名 | 値 | 備考 |
|--------|-----|------|
| `GOOGLE_SERVICE_ACCOUNT_KEY_BASE64` | （Base64 文字列） | 3-5 でコピーしたもの |
| `GOOGLE_CALENDAR_ID_BOOKING` | 予約カレンダーの ID | 4-2 で取得 |
| `GOOGLE_CALENDAR_ID_PERSONAL` | 個人カレンダー ID | オプション、空でも可 |
| `GOOGLE_SHEETS_ID` | スプレッドシート ID | 5-5 で取得 |
| `RESEND_API_KEY` | Resend の API キー | 6-2 で取得 |
| `RESEND_FROM` | `onboarding@resend.dev` または `noreply@yourdomain.com` | テスト時は前者 |
| `INSTRUCTOR_EMAIL` | インストラクターのメール | 失敗通知の宛先 |
| `ADMIN_PASSWORD` | 任意の強力なパスワード | 管理画面用、`admin123` は変更必須 |
| `CRON_SECRET` | ランダム文字列 | `openssl rand -hex 32` で生成 |
| `NEXT_PUBLIC_SITE_URL` | デプロイ後の URL | 初回は空でOK、後で設定 |

### 8-3. CRON_SECRET の生成

```bash
openssl rand -hex 32
```

出力された文字列を `CRON_SECRET` に設定します。

### 8-4. デプロイ実行

1. 環境変数をすべて追加したら **「Deploy」** をクリック
2. ビルドが完了するまで待つ（数分）
3. 完了後、`https://pilates-website-xxxxx.vercel.app` のような URL が表示される

### 8-5. 本番 URL を環境変数に反映

1. デプロイ後の URL をコピー（例: `https://pilates-website.vercel.app`）
2. **Settings** → **Environment Variables** で `NEXT_PUBLIC_SITE_URL` を追加または更新
3. **「Redeploy」** で再デプロイ（環境変数変更後は再デプロイが必要）

---

## 9. 動作確認

### 9-1. トップページ

- デプロイ URL を開く
- トップページが表示され、「レッスンを予約する」ボタンがあることを確認

### 9-2. 予約フロー

1. **「レッスンを予約する」** または **「/booking」** にアクセス
2. カレンダーで日付を選択
3. 空き枠が表示されることを確認（カレンダーに予定がなければ 10:00〜15:00 が空き）
4. 枠を選択 → フォーム入力（名前・メール・電話）
5. **「予約する」** で確定
6. 完了画面が表示される
7. メールが届く（Resend の送信先に）
8. Google カレンダーに予約が入っていることを確認
9. スプレッドシートの `customers` と `bookings` にデータが入っていることを確認

### 9-3. 管理画面

1. **「/admin」** にアクセス
2. Basic 認証が求められる → ユーザー名 `admin`、パスワードは `ADMIN_PASSWORD` で設定した値
3. 本日・明日の予約一覧が表示されることを確認

### 9-4. キャンセル

1. 予約確認メール内の **「キャンセルはこちら」** リンクをクリック
2. キャンセル画面が表示され、キャンセル実行できることを確認

---

## トラブルシューティング

| 現象 | 確認ポイント |
|------|--------------|
| 空き枠が表示されない | カレンダー共有が正しいか、`GOOGLE_CALENDAR_ID_BOOKING` が正しいか |
| 予約でエラー | ブラウザの開発者ツール（Network）で API のエラー内容を確認 |
| メールが届かない | Resend の送信ログ、`RESEND_FROM` がテスト用ドメインか確認 |
| 管理画面に入れない | `ADMIN_PASSWORD` が正しく設定されているか、再デプロイしたか |
| Sheets に書き込まれない | スプレッドシートの共有、`GOOGLE_SHEETS_ID`、シート名（customers, bookings, lesson_notes）を確認 |

---

## リンク一覧

| サービス | URL |
|----------|-----|
| Vercel | https://vercel.com |
| GitHub | https://github.com |
| Google Cloud Console | https://console.cloud.google.com |
| Google カレンダー | https://calendar.google.com |
| Google スプレッドシート | https://sheets.google.com |
| Resend | https://resend.com |

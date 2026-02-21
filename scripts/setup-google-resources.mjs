#!/usr/bin/env node
/**
 * Google Calendar と Google Sheets を自動作成するスクリプト
 * サービスアカウントキーを使用
 */
import { google } from "googleapis";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const KEY_PATH = join(__dirname, "../.setup-keys/sa-key.json");

const key = JSON.parse(readFileSync(KEY_PATH, "utf8"));
const auth = new google.auth.GoogleAuth({
  credentials: key,
  scopes: [
    "https://www.googleapis.com/auth/calendar",
    "https://www.googleapis.com/auth/spreadsheets",
    "https://www.googleapis.com/auth/drive",
  ],
});

async function main() {
  const calendar = google.calendar({ version: "v3", auth });
  const sheets = google.sheets({ version: "v4", auth });

  // 1. カレンダー作成
  const calRes = await calendar.calendars.insert({
    requestBody: {
      summary: "予約カレンダー",
      description: "ピラティスレッスン予約用",
      timeZone: "Asia/Tokyo",
    },
  });
  const calendarId = calRes.data.id;
  console.log("✓ カレンダー作成:", calendarId);

  // 2. スプレッドシート作成
  const createRes = await sheets.spreadsheets.create({
    requestBody: {
      properties: { title: "pilates-website-data" },
      sheets: [
        {
          properties: { title: "customers" },
          data: [{
            startRow: 0,
            startColumn: 0,
            rowData: [{
              values: [
                { userEnteredValue: { stringValue: "customerId" } },
                { userEnteredValue: { stringValue: "name" } },
                { userEnteredValue: { stringValue: "email" } },
                { userEnteredValue: { stringValue: "phone" } },
                { userEnteredValue: { stringValue: "firstVisit" } },
                { userEnteredValue: { stringValue: "totalVisits" } },
                { userEnteredValue: { stringValue: "memo" } },
              ],
            }],
          }],
        },
        {
          properties: { title: "bookings" },
          data: [{
            startRow: 0,
            startColumn: 0,
            rowData: [{
              values: [
                { userEnteredValue: { stringValue: "bookingId" } },
                { userEnteredValue: { stringValue: "customerId" } },
                { userEnteredValue: { stringValue: "date" } },
                { userEnteredValue: { stringValue: "startTime" } },
                { userEnteredValue: { stringValue: "status" } },
                { userEnteredValue: { stringValue: "calendarEventId" } },
                { userEnteredValue: { stringValue: "cancelToken" } },
                { userEnteredValue: { stringValue: "createdAt" } },
              ],
            }],
          }],
        },
        {
          properties: { title: "lesson_notes" },
          data: [{
            startRow: 0,
            startColumn: 0,
            rowData: [{
              values: [
                { userEnteredValue: { stringValue: "noteId" } },
                { userEnteredValue: { stringValue: "customerId" } },
                { userEnteredValue: { stringValue: "date" } },
                { userEnteredValue: { stringValue: "content" } },
                { userEnteredValue: { stringValue: "nextAction" } },
                { userEnteredValue: { stringValue: "createdAt" } },
              ],
            }],
          }],
        },
      ],
    },
  });
  const spreadsheetId = createRes.data.spreadsheetId;
  console.log("✓ スプレッドシート作成:", spreadsheetId);

  // 3. Base64 キー生成
  const keyBase64 = Buffer.from(readFileSync(KEY_PATH)).toString("base64");

  console.log("\n=== 環境変数（Vercel に設定） ===\n");
  console.log("GOOGLE_SERVICE_ACCOUNT_KEY_BASE64=" + keyBase64);
  console.log("GOOGLE_CALENDAR_ID_BOOKING=" + calendarId);
  console.log("GOOGLE_SHEETS_ID=" + spreadsheetId);
  console.log("\n※ GOOGLE_CALENDAR_ID_PERSONAL は空でOK（個人カレンダーと重複チェックしない場合）");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

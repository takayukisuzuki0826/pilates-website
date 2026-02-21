#!/usr/bin/env node
/**
 * ユーザー認証（ADC）でスプレッドシートを作成し、サービスアカウントと共有
 */
import { google } from "googleapis";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const KEY_PATH = join(__dirname, "../.setup-keys/sa-key.json");

async function main() {
  // ユーザー認証（gcloud auth application-default login）
  const auth = new google.auth.GoogleAuth({
    scopes: [
      "https://www.googleapis.com/auth/spreadsheets",
      "https://www.googleapis.com/auth/drive",
    ],
  });

  const sheets = google.sheets({ version: "v4", auth });
  const drive = google.drive({ version: "v3", auth });

  const key = JSON.parse(readFileSync(KEY_PATH, "utf8"));
  const saEmail = key.client_email;

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

  // サービスアカウントと共有
  await drive.permissions.create({
    fileId: spreadsheetId,
    requestBody: {
      type: "user",
      role: "writer",
      emailAddress: saEmail,
    },
  });
  console.log("✓ サービスアカウントと共有完了:", saEmail);

  const keyBase64 = Buffer.from(readFileSync(KEY_PATH)).toString("base64");
  console.log("\n=== GOOGLE_SHEETS_ID ===");
  console.log(spreadsheetId);
  console.log("\n※ 既存の setup-google-resources.mjs で取得したカレンダーID・Base64キーと合わせて Vercel に設定してください");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

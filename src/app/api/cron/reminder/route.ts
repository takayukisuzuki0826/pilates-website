import { NextRequest, NextResponse } from "next/server";
import { google } from "googleapis";
import { JWT } from "google-auth-library";
import { patchEventPrivateProperties } from "@/lib/google-calendar";
import { sendReminder } from "@/lib/resend";

export const dynamic = "force-dynamic";

function getAuth(): JWT {
  const keyJson = JSON.parse(
    Buffer.from(process.env.GOOGLE_SERVICE_ACCOUNT_KEY_BASE64!, "base64").toString()
  );
  return new JWT({
    email: keyJson.client_email,
    key: keyJson.private_key,
    scopes: ["https://www.googleapis.com/auth/calendar"],
  });
}

export async function GET(req: NextRequest) {
  // 1. 認証チェック
  const authHeader = req.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (!cronSecret) {
    return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
  }

  if (authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const calendar = google.calendar({ version: "v3", auth: getAuth() });

    // 2. 翌日の予約イベントを取得
    const now = new Date();
    // 翌日 00:00 JST
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toLocaleDateString("sv-SE", { timeZone: "Asia/Tokyo" });
    const timeMin = new Date(`${tomorrowStr}T00:00:00+09:00`);
    const timeMax = new Date(`${tomorrowStr}T23:59:59+09:00`);

    const res = await calendar.events.list({
      calendarId: process.env.GOOGLE_CALENDAR_ID_BOOKING!,
      timeMin: timeMin.toISOString(),
      timeMax: timeMax.toISOString(),
      singleEvents: true,
      orderBy: "startTime",
    });

    const events = res.data.items ?? [];
    let sent = 0;
    let skipped = 0;

    // 3. 各イベントについてリマインダー送信
    for (const event of events) {
      const props = event.extendedProperties?.private ?? {};

      // 既に送信済み
      if (props.reminderSentAt) {
        skipped++;
        continue;
      }

      // 必要な情報がない場合スキップ
      if (!props.customerEmail || !props.customerName || !props.accessToken) {
        skipped++;
        continue;
      }

      const eventStart = new Date(event.start?.dateTime || "");
      const startTime = `${String(eventStart.getHours()).padStart(2, "0")}:${String(eventStart.getMinutes()).padStart(2, "0")}`;

      try {
        await sendReminder({
          name: props.customerName,
          email: props.customerEmail,
          date: tomorrowStr,
          startTime,
          accessToken: props.accessToken,
        });

        // 送信済みフラグを書き込む
        await patchEventPrivateProperties(event.id!, {
          reminderSentAt: new Date().toISOString(),
        });

        sent++;
      } catch (error) {
        console.error(`Reminder failed for event ${event.id}:`, error);
      }
    }

    return NextResponse.json({
      success: true,
      date: tomorrowStr,
      totalEvents: events.length,
      sent,
      skipped,
    });
  } catch (error) {
    console.error("Reminder cron error:", error);
    return NextResponse.json(
      { error: "リマインダー処理中にエラーが発生しました" },
      { status: 500 }
    );
  }
}

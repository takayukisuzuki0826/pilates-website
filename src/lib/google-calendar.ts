import { google, calendar_v3 } from "googleapis";
import { JWT } from "google-auth-library";
import { CONFIG } from "./config";
import type { Slot, BookingData } from "./types";

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

function getCalendar(): calendar_v3.Calendar {
  return google.calendar({ version: "v3", auth: getAuth() });
}

/**
 * 指定日の空きスロットを返す
 */
export async function getAvailableSlots(date: string): Promise<Slot[]> {
  const calendar = getCalendar();
  const bookingCalId = process.env.GOOGLE_CALENDAR_ID_BOOKING!;
  const personalCalId = process.env.GOOGLE_CALENDAR_ID_PERSONAL;

  // タイムゾーン付きの日付範囲
  const dayStart = new Date(`${date}T00:00:00+09:00`);
  const dayEnd = new Date(`${date}T23:59:59+09:00`);

  // 30日先チェック
  const now = new Date();
  const maxDate = new Date(now.getTime() + CONFIG.BOOKING_WINDOW_DAYS * 24 * 60 * 60 * 1000);
  if (dayStart > maxDate) {
    return [];
  }

  // 過去日チェック
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  if (dayEnd < todayStart) {
    return [];
  }

  // FreeBusy API
  const calendarIds = [{ id: bookingCalId }];
  if (personalCalId) {
    calendarIds.push({ id: personalCalId });
  }

  const freeBusyRes = await calendar.freebusy.query({
    requestBody: {
      timeMin: dayStart.toISOString(),
      timeMax: dayEnd.toISOString(),
      timeZone: CONFIG.TIMEZONE,
      items: calendarIds,
    },
  });

  // busy区間をまとめる
  const busySlots: { start: Date; end: Date }[] = [];
  const calendars = freeBusyRes.data.calendars ?? {};
  for (const calId of Object.keys(calendars)) {
    const busy = calendars[calId]?.busy ?? [];
    for (const b of busy) {
      if (b.start && b.end) {
        busySlots.push({ start: new Date(b.start), end: new Date(b.end) });
      }
    }
  }

  // スロット生成
  const slots: Slot[] = [];
  for (let hour = CONFIG.BUSINESS_HOURS.start; hour < CONFIG.BUSINESS_HOURS.end; hour++) {
    const startTime = `${String(hour).padStart(2, "0")}:00`;
    const endTime = `${String(hour + 1).padStart(2, "0")}:00`;

    const slotStart = new Date(`${date}T${startTime}:00+09:00`);
    const slotEnd = new Date(`${date}T${endTime}:00+09:00`);

    // busy区間と重なるか
    const isBusy = busySlots.some(
      (b) => b.start < slotEnd && b.end > slotStart
    );

    // 予約締切チェック（開始2時間前まで）
    const deadlineMs = slotStart.getTime() - CONFIG.BOOKING_DEADLINE_HOURS * 60 * 60 * 1000;
    const isPastDeadline = now.getTime() > deadlineMs;

    slots.push({
      startTime,
      endTime,
      available: !isBusy && !isPastDeadline,
    });
  }

  return slots;
}

/**
 * 二重送信チェック（idempotency）
 */
export async function checkIdempotency(
  clientRequestId: string
): Promise<calendar_v3.Schema$Event | null> {
  const calendar = getCalendar();
  const res = await calendar.events.list({
    calendarId: process.env.GOOGLE_CALENDAR_ID_BOOKING!,
    privateExtendedProperty: [`clientRequestId=${clientRequestId}`],
    timeMin: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    timeMax: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString(),
    maxResults: 1,
    singleEvents: true,
  });
  return res.data.items?.[0] ?? null;
}

/**
 * 予約イベントをGoogleカレンダーに作成
 */
export async function createBookingEvent(
  data: BookingData
): Promise<calendar_v3.Schema$Event> {
  const calendar = getCalendar();

  const startDateTime = `${data.date}T${data.startTime}:00+09:00`;
  const endHour = parseInt(data.startTime.split(":")[0]) + 1;
  const endDateTime = `${data.date}T${String(endHour).padStart(2, "0")}:00:00+09:00`;

  const res = await calendar.events.insert({
    calendarId: process.env.GOOGLE_CALENDAR_ID_BOOKING!,
    requestBody: {
      summary: `【予約】${data.name}`,
      description: [
        `予約ID: ${data.bookingId}`,
        `お名前: ${data.name}`,
        `メール: ${data.email}`,
        `電話: ${data.phone}`,
        data.message ? `連絡事項: ${data.message}` : "",
        data.isFirstVisit ? "初回" : "リピーター",
      ]
        .filter(Boolean)
        .join("\n"),
      start: {
        dateTime: startDateTime,
        timeZone: CONFIG.TIMEZONE,
      },
      end: {
        dateTime: endDateTime,
        timeZone: CONFIG.TIMEZONE,
      },
      extendedProperties: {
        private: {
          bookingId: data.bookingId,
          clientRequestId: data.clientRequestId,
          customerName: data.name,
          customerEmail: data.email,
          customerPhone: data.phone,
          accessToken: data.accessToken,
          cancelToken: data.cancelToken,
          source: "web",
          createdAt: new Date().toISOString(),
        },
      },
    },
  });

  return res.data;
}

/**
 * トークンでイベントを検索
 */
export async function findEventByToken(
  tokenKey: "accessToken" | "cancelToken",
  tokenValue: string
): Promise<calendar_v3.Schema$Event | null> {
  const calendar = getCalendar();
  const res = await calendar.events.list({
    calendarId: process.env.GOOGLE_CALENDAR_ID_BOOKING!,
    privateExtendedProperty: [`${tokenKey}=${tokenValue}`],
    timeMin: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    timeMax: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString(),
    maxResults: 1,
    singleEvents: true,
  });
  return res.data.items?.[0] ?? null;
}

/**
 * イベント削除（キャンセル用）
 */
export async function deleteEvent(eventId: string): Promise<void> {
  const calendar = getCalendar();
  await calendar.events.delete({
    calendarId: process.env.GOOGLE_CALENDAR_ID_BOOKING!,
    eventId,
  });
}

/**
 * イベントのprivate propertiesを更新（既存とマージ）
 */
export async function patchEventPrivateProperties(
  eventId: string,
  updates: Record<string, string>
): Promise<void> {
  const calendar = getCalendar();
  const ev = await calendar.events.get({
    calendarId: process.env.GOOGLE_CALENDAR_ID_BOOKING!,
    eventId,
  });
  const existing = ev.data.extendedProperties?.private ?? {};
  await calendar.events.patch({
    calendarId: process.env.GOOGLE_CALENDAR_ID_BOOKING!,
    eventId,
    requestBody: {
      extendedProperties: {
        private: { ...existing, ...updates },
      },
    },
  });
}

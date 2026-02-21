import { Resend } from "resend";

function getResend(): Resend {
  return new Resend(process.env.RESEND_API_KEY);
}

const SITE_URL = () => process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
const FROM = () => process.env.RESEND_FROM || "noreply@example.com";
const INSTRUCTOR_EMAIL = () => process.env.INSTRUCTOR_EMAIL || "";

/** 日付を日本語フォーマットに */
function formatDateJa(dateStr: string): string {
  const d = new Date(dateStr + "T00:00:00+09:00");
  const days = ["日", "月", "火", "水", "木", "金", "土"];
  const month = d.getMonth() + 1;
  const day = d.getDate();
  const dayOfWeek = days[d.getDay()];
  return `${month}月${day}日（${dayOfWeek}）`;
}

/** ICSファイル生成 */
function generateICS(date: string, startTime: string): string {
  const hour = parseInt(startTime.split(":")[0]);
  const dateClean = date.replace(/-/g, "");
  const dtStart = `${dateClean}T${String(hour).padStart(2, "0")}0000`;
  const dtEnd = `${dateClean}T${String(hour + 1).padStart(2, "0")}0000`;
  const uid = `${date}-${startTime}@pilates-studio`;

  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Studio//Booking//JP",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VTIMEZONE",
    "TZID:Asia/Tokyo",
    "BEGIN:STANDARD",
    "DTSTART:19700101T000000",
    "TZOFFSETFROM:+0900",
    "TZOFFSETTO:+0900",
    "END:STANDARD",
    "END:VTIMEZONE",
    "BEGIN:VEVENT",
    `DTSTART;TZID=Asia/Tokyo:${dtStart}`,
    `DTEND;TZID=Asia/Tokyo:${dtEnd}`,
    `UID:${uid}`,
    "SUMMARY:ピラティスレッスン",
    "DESCRIPTION:ピラティスレッスンのご予約",
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
}

/** 予約確認メール送信 */
export async function sendBookingConfirmation(params: {
  name: string;
  email: string;
  date: string;
  startTime: string;
  accessToken: string;
  cancelToken: string;
}): Promise<void> {
  const resend = getResend();
  const { name, email, date, startTime, accessToken, cancelToken } = params;

  const dateJa = formatDateJa(date);
  const accessUrl = `${SITE_URL()}/access?token=${accessToken}`;
  const cancelUrl = `${SITE_URL()}/cancel?token=${cancelToken}`;
  const icsContent = generateICS(date, startTime);

  await resend.emails.send({
    from: FROM(),
    to: email,
    subject: `ご予約ありがとうございます - ${dateJa} ${startTime}`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #3d3830;">
        <h2 style="color: #2c7963;">${name}様、ご予約ありがとうございます</h2>

        <div style="background: #f0f9f6; border-radius: 12px; padding: 20px; margin: 20px 0;">
          <p style="margin: 0; font-size: 18px; font-weight: bold;">
            ${dateJa} ${startTime}〜
          </p>
        </div>

        <h3 style="color: #2c7963;">スタジオの場所・道順</h3>
        <p>
          <a href="${accessUrl}" style="color: #3a967b;">
            こちらからご確認いただけます
          </a>
          <br>
          <span style="font-size: 12px; color: #8e8278;">※ レッスン48時間前からレッスン当日まで閲覧可能です</span>
        </p>

        <h3 style="color: #2c7963;">お持ち物</h3>
        <ul>
          <li>動きやすい服装</li>
          <li>タオル</li>
          <li>お飲み物</li>
        </ul>

        <h3 style="color: #2c7963;">キャンセルについて</h3>
        <p>
          レッスン開始の24時間前までキャンセル可能です。<br>
          <a href="${cancelUrl}" style="color: #3a967b;">キャンセルはこちら</a>
        </p>

        <hr style="border: none; border-top: 1px solid #dedad4; margin: 30px 0;">

        <p style="font-size: 12px; color: #8e8278;">
          ご不明な点がございましたらお気軽にご連絡ください。<br>
          お会いできることを楽しみにしております。
        </p>
      </div>
    `,
    attachments: [
      {
        filename: "pilates-lesson.ics",
        content: Buffer.from(icsContent).toString("base64"),
        contentType: "text/calendar",
      },
    ],
  });
}

/** キャンセル確認メール送信 */
export async function sendCancelConfirmation(params: {
  name: string;
  email: string;
  date: string;
  startTime: string;
}): Promise<void> {
  const resend = getResend();
  const { name, email, date, startTime } = params;
  const dateJa = formatDateJa(date);

  await resend.emails.send({
    from: FROM(),
    to: email,
    subject: `キャンセルを受け付けました - ${dateJa} ${startTime}`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #3d3830;">
        <h2 style="color: #2c7963;">${name}様</h2>
        <p>以下のご予約のキャンセルを受け付けました。</p>

        <div style="background: #f8f7f5; border-radius: 12px; padding: 20px; margin: 20px 0;">
          <p style="margin: 0; font-size: 18px;">
            ${dateJa} ${startTime}〜
          </p>
        </div>

        <p>
          またのご予約をお待ちしております。<br>
          <a href="${SITE_URL()}/booking" style="color: #3a967b;">別の日時で予約する</a>
        </p>
      </div>
    `,
  });
}

/** 前日リマインダーメール送信 */
export async function sendReminder(params: {
  name: string;
  email: string;
  date: string;
  startTime: string;
  accessToken: string;
}): Promise<void> {
  const resend = getResend();
  const { name, email, date, startTime, accessToken } = params;
  const dateJa = formatDateJa(date);
  const accessUrl = `${SITE_URL()}/access?token=${accessToken}`;

  await resend.emails.send({
    from: FROM(),
    to: email,
    subject: `明日のレッスンのお知らせ - ${dateJa} ${startTime}`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #3d3830;">
        <h2 style="color: #2c7963;">${name}様</h2>
        <p>明日のレッスンのご案内です。</p>

        <div style="background: #f0f9f6; border-radius: 12px; padding: 20px; margin: 20px 0;">
          <p style="margin: 0; font-size: 18px; font-weight: bold;">
            ${dateJa} ${startTime}〜
          </p>
        </div>

        <h3 style="color: #2c7963;">スタジオの場所・道順</h3>
        <p>
          <a href="${accessUrl}" style="color: #3a967b;">
            こちらからご確認いただけます
          </a>
        </p>

        <p>お気をつけてお越しください。お会いできるのを楽しみにしております。</p>
      </div>
    `,
  });
}

/** インストラクター宛て失敗通知 */
export async function sendFailureNotification(
  subject: string,
  detail: string
): Promise<void> {
  const instructorEmail = INSTRUCTOR_EMAIL();
  if (!instructorEmail) {
    console.error("INSTRUCTOR_EMAIL not set. Cannot send failure notification.");
    return;
  }

  const resend = getResend();
  await resend.emails.send({
    from: FROM(),
    to: instructorEmail,
    subject: `[要対応] ${subject}`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #c83a3a;">[要対応] ${subject}</h2>
        <pre style="background: #f8f7f5; padding: 16px; border-radius: 8px; white-space: pre-wrap;">${detail}</pre>
        <p style="font-size: 12px; color: #8e8278;">
          このメールはシステムから自動送信されています。
        </p>
      </div>
    `,
  });
}

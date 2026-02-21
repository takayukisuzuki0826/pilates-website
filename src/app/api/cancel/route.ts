import { NextRequest, NextResponse } from "next/server";
import { findEventByToken, deleteEvent } from "@/lib/google-calendar";
import { updateBookingStatus } from "@/lib/google-sheets";
import { sendCancelConfirmation, sendFailureNotification } from "@/lib/resend";
import { CONFIG } from "@/lib/config";

export async function POST(req: NextRequest) {
  let body: { cancelToken?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "不正なリクエストです" }, { status: 400 });
  }

  const { cancelToken } = body;
  if (!cancelToken) {
    return NextResponse.json({ error: "トークンが必要です" }, { status: 400 });
  }

  try {
    // 1. Calendarイベント検索
    const event = await findEventByToken("cancelToken", cancelToken);
    if (!event || !event.id) {
      return NextResponse.json({ error: "予約が見つかりません" }, { status: 404 });
    }

    // 2. キャンセル期限チェック
    const eventStart = new Date(event.start?.dateTime || "");
    const now = new Date();
    const deadlineMs = eventStart.getTime() - CONFIG.CANCEL_DEADLINE_HOURS * 60 * 60 * 1000;
    if (now.getTime() > deadlineMs) {
      return NextResponse.json(
        { error: "キャンセル期限を過ぎています。直接ご連絡ください。" },
        { status: 400 }
      );
    }

    const props = event.extendedProperties?.private ?? {};
    const customerName = props.customerName || "";
    const customerEmail = props.customerEmail || "";
    const bookingId = props.bookingId || "";

    // 日付情報を取得
    const date = eventStart.toISOString().split("T")[0];
    const startTime = `${String(eventStart.getHours()).padStart(2, "0")}:${String(eventStart.getMinutes()).padStart(2, "0")}`;

    // 3. Calendarイベント削除
    await deleteEvent(event.id);

    // 4. Sheets bookingsのstatus更新（ベストエフォート）
    if (bookingId) {
      try {
        await updateBookingStatus(bookingId, "cancelled");
      } catch (sheetsError) {
        console.error("Sheets update error:", sheetsError);
        try {
          await sendFailureNotification(
            "キャンセル時Sheets更新失敗",
            `予約ID: ${bookingId}\n名前: ${customerName}\nCalendarからは削除済み。Sheetsのstatus手動更新が必要です。`
          );
        } catch {
          console.error("Failed to send failure notification");
        }
      }
    }

    // 5. キャンセル確認メール送信
    if (customerEmail) {
      try {
        await sendCancelConfirmation({
          name: customerName,
          email: customerEmail,
          date,
          startTime,
        });
      } catch (emailError) {
        console.error("Cancel email error:", emailError);
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Cancel error:", error);
    return NextResponse.json(
      { error: "キャンセル処理中にエラーが発生しました" },
      { status: 500 }
    );
  }
}

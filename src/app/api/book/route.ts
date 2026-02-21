import { NextRequest, NextResponse } from "next/server";
import { nanoid } from "nanoid";
import {
  checkIdempotency,
  getAvailableSlots,
  createBookingEvent,
} from "@/lib/google-calendar";
import {
  findCustomerByEmail,
  createCustomer,
  createBooking,
  updateCustomerVisits,
} from "@/lib/google-sheets";
import { sendBookingConfirmation, sendFailureNotification } from "@/lib/resend";
import type { BookRequestBody } from "@/lib/types";

export async function POST(req: NextRequest) {
  let body: BookRequestBody;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "不正なリクエストです" }, { status: 400 });
  }

  const { clientRequestId, date, startTime, name, email, phone, message, honeypot, isFirstVisit } = body;

  // 1. 入力バリデーション
  if (!name || name.length < 1 || name.length > 50) {
    return NextResponse.json({ error: "お名前は1〜50文字で入力してください" }, { status: 400 });
  }
  if (!email || !email.includes("@")) {
    return NextResponse.json({ error: "メールアドレスが正しくありません" }, { status: 400 });
  }
  const phoneClean = phone?.replace(/[-\s]/g, "") ?? "";
  if (!phone || !/^[\d-]+$/.test(phone) || phoneClean.length < 10 || phoneClean.length > 15) {
    return NextResponse.json({ error: "電話番号が正しくありません" }, { status: 400 });
  }
  if (!clientRequestId || !date || !startTime) {
    return NextResponse.json({ error: "必須パラメータが不足しています" }, { status: 400 });
  }

  // honeypot: botに学習させないため200を返す
  if (honeypot) {
    return NextResponse.json({ success: true, bookingId: "bk_dummy", date, startTime });
  }

  try {
    // 2. 二重送信チェック
    const existing = await checkIdempotency(clientRequestId);
    if (existing) {
      const props = existing.extendedProperties?.private ?? {};
      return NextResponse.json({
        success: true,
        bookingId: props.bookingId,
        date,
        startTime,
      });
    }

    // 3. FreeBusy再チェック
    const slots = await getAvailableSlots(date);
    const targetSlot = slots.find((s) => s.startTime === startTime);
    if (!targetSlot?.available) {
      return NextResponse.json(
        { error: "申し訳ございません。選択された時間帯は既に予約が入っています。" },
        { status: 409 }
      );
    }

    // 4. トークン生成
    const accessToken = crypto.randomUUID();
    const cancelToken = crypto.randomUUID();
    const bookingId = "bk_" + nanoid();

    // 5. Googleカレンダーイベント作成（★予約成立）
    const event = await createBookingEvent({
      clientRequestId,
      bookingId,
      date,
      startTime,
      name,
      email,
      phone,
      message,
      isFirstVisit,
      accessToken,
      cancelToken,
    });

    // 6. Google Sheets書き込み（ベストエフォート）
    let customerId = "";
    try {
      let customer = await findCustomerByEmail(email);
      if (customer) {
        customerId = customer.customerId;
        await updateCustomerVisits(customerId);
      } else {
        customerId = "cust_" + nanoid();
        await createCustomer({
          customerId,
          name,
          email,
          phone,
          firstVisit: date,
          totalVisits: 1,
          memo: "",
        });
      }

      await createBooking({
        bookingId,
        customerId,
        date,
        startTime,
        status: "confirmed",
        calendarEventId: event.id!,
        cancelToken,
        createdAt: new Date().toISOString(),
      });
    } catch (sheetsError) {
      console.error("Sheets write error:", sheetsError);
      try {
        await sendFailureNotification(
          "Sheets書き込み失敗",
          `予約ID: ${bookingId}\n名前: ${name}\nメール: ${email}\nカレンダーには予約済み。Sheetsの手動追加が必要です。`
        );
      } catch {
        console.error("Failed to send failure notification");
      }
    }

    // 7. 確認メール送信（ベストエフォート）
    try {
      await sendBookingConfirmation({
        name,
        email,
        date,
        startTime,
        accessToken,
        cancelToken,
      });
    } catch (emailError) {
      console.error("Email send error:", emailError);
      try {
        await sendFailureNotification(
          "確認メール送信失敗",
          `予約ID: ${bookingId}\n名前: ${name}\nメール: ${email}\n確認メールの再送が必要です。`
        );
      } catch {
        console.error("Failed to send failure notification");
      }
    }

    // 8. 成功レスポンス
    return NextResponse.json({
      success: true,
      bookingId,
      date,
      startTime,
    });
  } catch (error) {
    console.error("Booking error:", error);
    return NextResponse.json(
      { error: "予約処理中にエラーが発生しました。しばらくしてからもう一度お試しください。" },
      { status: 500 }
    );
  }
}

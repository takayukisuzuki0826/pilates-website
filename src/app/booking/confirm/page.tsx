"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface BookingData {
  clientRequestId: string;
  date: string;
  startTime: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  isFirstVisit: boolean;
  honeypot: string;
}

export default function BookingConfirmPage() {
  const router = useRouter();
  const [data, setData] = useState<BookingData | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const stored = sessionStorage.getItem("bookingData");
    if (!stored) {
      router.replace("/booking");
      return;
    }
    setData(JSON.parse(stored));
  }, [router]);

  const formatDateJa = (dateStr: string) => {
    const d = new Date(dateStr + "T00:00:00+09:00");
    const days = ["日", "月", "火", "水", "木", "金", "土"];
    return `${d.getMonth() + 1}月${d.getDate()}日（${days[d.getDay()]}）`;
  };

  async function handleConfirm() {
    if (!data || submitting) return;
    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (!res.ok) {
        setError(result.error || "予約に失敗しました。もう一度お試しください。");
        setSubmitting(false);
        return;
      }

      // 完了画面へ
      sessionStorage.setItem(
        "bookingResult",
        JSON.stringify({
          date: data.date,
          startTime: data.startTime,
          bookingId: result.bookingId,
        })
      );
      sessionStorage.removeItem("bookingData");
      router.push("/booking/done");
    } catch {
      setError("通信エラーが発生しました。もう一度お試しください。");
      setSubmitting(false);
    }
  }

  if (!data) {
    return (
      <div className="max-w-lg mx-auto px-4 py-16 text-center">
        <div className="animate-spin w-6 h-6 border-2 border-primary-500 border-t-transparent rounded-full mx-auto" />
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-8 md:py-12">
      <h1 className="text-2xl font-bold text-neutral-800 mb-2 text-center">予約内容の確認</h1>
      <p className="text-neutral-500 text-sm text-center mb-8">
        以下の内容でよろしければ「予約する」ボタンを押してください
      </p>

      <div className="bg-white rounded-2xl shadow-sm border border-neutral-200 p-6 space-y-4">
        <div className="bg-primary-50 rounded-xl p-4">
          <p className="text-primary-800 font-semibold text-lg">
            {formatDateJa(data.date)} {data.startTime}〜
          </p>
        </div>

        <dl className="space-y-3">
          <div className="flex flex-col sm:flex-row sm:gap-4">
            <dt className="text-sm font-medium text-neutral-500 sm:w-28 flex-shrink-0">お名前</dt>
            <dd className="text-neutral-800">{data.name}</dd>
          </div>
          <div className="flex flex-col sm:flex-row sm:gap-4">
            <dt className="text-sm font-medium text-neutral-500 sm:w-28 flex-shrink-0">メール</dt>
            <dd className="text-neutral-800">{data.email}</dd>
          </div>
          <div className="flex flex-col sm:flex-row sm:gap-4">
            <dt className="text-sm font-medium text-neutral-500 sm:w-28 flex-shrink-0">電話番号</dt>
            <dd className="text-neutral-800">{data.phone}</dd>
          </div>
          {data.message && (
            <div className="flex flex-col sm:flex-row sm:gap-4">
              <dt className="text-sm font-medium text-neutral-500 sm:w-28 flex-shrink-0">連絡事項</dt>
              <dd className="text-neutral-800 whitespace-pre-wrap">{data.message}</dd>
            </div>
          )}
          <div className="flex flex-col sm:flex-row sm:gap-4">
            <dt className="text-sm font-medium text-neutral-500 sm:w-28 flex-shrink-0">初めて</dt>
            <dd className="text-neutral-800">{data.isFirstVisit ? "はい" : "いいえ"}</dd>
          </div>
        </dl>
      </div>

      {error && (
        <div className="mt-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
          {error}
        </div>
      )}

      <div className="mt-6 flex flex-col gap-3">
        <button
          onClick={handleConfirm}
          disabled={submitting}
          className="w-full bg-primary-500 hover:bg-primary-600 disabled:bg-neutral-300 text-white py-3 rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
        >
          {submitting ? (
            <>
              <span className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
              予約処理中...
            </>
          ) : (
            "予約する"
          )}
        </button>
        <button
          onClick={() => router.back()}
          disabled={submitting}
          className="w-full text-neutral-600 hover:text-neutral-800 py-3 rounded-xl text-sm transition-colors"
        >
          戻って修正する
        </button>
      </div>
    </div>
  );
}

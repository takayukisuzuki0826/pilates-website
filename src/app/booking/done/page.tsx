"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface BookingResult {
  date: string;
  startTime: string;
  bookingId: string;
}

export default function BookingDonePage() {
  const router = useRouter();
  const [result, setResult] = useState<BookingResult | null>(null);

  useEffect(() => {
    const stored = sessionStorage.getItem("bookingResult");
    if (!stored) {
      router.replace("/booking");
      return;
    }
    setResult(JSON.parse(stored));
    sessionStorage.removeItem("bookingResult");
  }, [router]);

  const formatDateJa = (dateStr: string) => {
    const d = new Date(dateStr + "T00:00:00+09:00");
    const days = ["日", "月", "火", "水", "木", "金", "土"];
    return `${d.getMonth() + 1}月${d.getDate()}日（${days[d.getDay()]}）`;
  };

  if (!result) {
    return (
      <div className="max-w-lg mx-auto px-4 py-16 text-center">
        <div className="animate-spin w-6 h-6 border-2 border-primary-500 border-t-transparent rounded-full mx-auto" />
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-8 md:py-16">
      <div className="text-center">
        <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <h1 className="text-2xl font-bold text-neutral-800 mb-2">
          ご予約ありがとうございます
        </h1>
        <p className="text-neutral-600 mb-8">
          予約が確定しました
        </p>

        <div className="bg-primary-50 rounded-2xl p-6 mb-8">
          <p className="text-primary-800 font-semibold text-xl">
            {formatDateJa(result.date)} {result.startTime}〜
          </p>
        </div>

        <div className="bg-neutral-50 rounded-2xl p-6 text-left text-sm text-neutral-600 space-y-3">
          <p>
            確認メールをお送りしました。5分以内に届かない場合は迷惑メールフォルダをご確認ください。
          </p>
          <p>
            届かない場合は、お手数ですがお電話またはメールにてご連絡ください。
          </p>
          <div className="pt-2 border-t border-neutral-200 space-y-1 text-neutral-500 text-xs">
            {/* 連絡先をここに入力 */}
            <p>メール：info@example.com</p>
            <p>電話：090-XXXX-XXXX</p>
          </div>
        </div>

        <Link
          href="/"
          className="inline-block mt-8 text-primary-600 hover:text-primary-700 text-sm font-medium transition-colors"
        >
          トップページに戻る
        </Link>
      </div>
    </div>
  );
}

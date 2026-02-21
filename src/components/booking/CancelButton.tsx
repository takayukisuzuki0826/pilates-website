"use client";

import { useState } from "react";
import Link from "next/link";

interface CancelButtonProps {
  cancelToken: string;
}

export default function CancelButton({ cancelToken }: CancelButtonProps) {
  const [state, setState] = useState<"idle" | "submitting" | "done" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleCancel() {
    if (state === "submitting") return;
    setState("submitting");

    try {
      const res = await fetch("/api/cancel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cancelToken }),
      });

      if (!res.ok) {
        const data = await res.json();
        setErrorMessage(data.error || "キャンセルに失敗しました。");
        setState("error");
        return;
      }

      setState("done");
    } catch {
      setErrorMessage("通信エラーが発生しました。もう一度お試しください。");
      setState("error");
    }
  }

  if (state === "done") {
    return (
      <div className="space-y-6">
        <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto">
          <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-neutral-800">キャンセルを受け付けました</h2>
        <p className="text-neutral-600 text-sm">
          確認メールをお送りしましたのでご確認ください。
        </p>
        <Link
          href="/booking"
          className="inline-block bg-primary-500 hover:bg-primary-600 text-white px-6 py-3 rounded-full font-medium transition-colors"
        >
          別の日時で予約する
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {state === "error" && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
          {errorMessage}
        </div>
      )}

      <button
        onClick={handleCancel}
        disabled={state === "submitting"}
        className="w-full bg-red-500 hover:bg-red-600 disabled:bg-neutral-300 text-white py-3 rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
      >
        {state === "submitting" ? (
          <>
            <span className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
            キャンセル処理中...
          </>
        ) : (
          "キャンセルする"
        )}
      </button>

      <Link
        href="/"
        className="block text-neutral-500 hover:text-neutral-700 text-sm transition-colors"
      >
        キャンセルしない
      </Link>
    </div>
  );
}

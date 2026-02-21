"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface LessonNoteFormProps {
  customerId: string;
}

export default function LessonNoteForm({ customerId }: LessonNoteFormProps) {
  const router = useRouter();
  const today = new Date().toLocaleDateString("sv-SE", { timeZone: "Asia/Tokyo" });

  const [date, setDate] = useState(today);
  const [content, setContent] = useState("");
  const [nextAction, setNextAction] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!content.trim()) return;

    setSubmitting(true);
    setMessage(null);

    try {
      const res = await fetch("/api/admin/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customerId, date, content, nextAction }),
      });

      if (!res.ok) {
        setMessage({ type: "error", text: "保存に失敗しました" });
        setSubmitting(false);
        return;
      }

      setMessage({ type: "success", text: "保存しました" });
      setContent("");
      setNextAction("");
      setSubmitting(false);
      router.refresh();
    } catch {
      setMessage({ type: "error", text: "通信エラーが発生しました" });
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-neutral-50 rounded-xl p-4 space-y-3">
      <h3 className="text-sm font-semibold text-neutral-700">レッスン記録を追加</h3>

      <div>
        <label htmlFor="noteDate" className="block text-xs text-neutral-500 mb-1">日付</label>
        <input
          type="date"
          id="noteDate"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-300"
        />
      </div>

      <div>
        <label htmlFor="noteContent" className="block text-xs text-neutral-500 mb-1">
          レッスン内容・メモ <span className="text-red-400">*</span>
        </label>
        <textarea
          id="noteContent"
          rows={3}
          required
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-300 resize-none"
          placeholder="レッスン内容やお客様の状態など"
        />
      </div>

      <div>
        <label htmlFor="noteNextAction" className="block text-xs text-neutral-500 mb-1">
          次回への申し送り
        </label>
        <textarea
          id="noteNextAction"
          rows={2}
          value={nextAction}
          onChange={(e) => setNextAction(e.target.value)}
          className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-300 resize-none"
          placeholder="次回のレッスンで注意することなど"
        />
      </div>

      {message && (
        <div
          className={`text-xs px-3 py-2 rounded-lg ${
            message.type === "success" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
          }`}
        >
          {message.text}
        </div>
      )}

      <button
        type="submit"
        disabled={submitting || !content.trim()}
        className="w-full bg-primary-500 hover:bg-primary-600 disabled:bg-neutral-300 text-white py-2 rounded-lg text-sm font-medium transition-colors"
      >
        {submitting ? "保存中..." : "保存"}
      </button>
    </form>
  );
}

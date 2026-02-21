"use client";

import { useState } from "react";

interface BookingFormProps {
  onSubmit: (data: {
    name: string;
    email: string;
    phone: string;
    message: string;
    isFirstVisit: boolean;
    honeypot: string;
  }) => void;
}

export default function BookingForm({ onSubmit }: BookingFormProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [isFirstVisit, setIsFirstVisit] = useState(true);
  const [honeypot, setHoneypot] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSubmit({ name, email, phone, message, isFirstVisit, honeypot });
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-neutral-200 p-4 md:p-6">
      <h3 className="text-lg font-semibold text-neutral-800 mb-4">お客様情報</h3>

      <div className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-neutral-700 mb-1">
            お名前 <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            id="name"
            required
            maxLength={50}
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-3 border border-neutral-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-transparent transition"
            placeholder="山田 太郎"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-neutral-700 mb-1">
            メールアドレス <span className="text-red-400">*</span>
          </label>
          <input
            type="email"
            id="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 border border-neutral-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-transparent transition"
            placeholder="example@email.com"
          />
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-neutral-700 mb-1">
            電話番号 <span className="text-red-400">*</span>
          </label>
          <input
            type="tel"
            id="phone"
            required
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full px-4 py-3 border border-neutral-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-transparent transition"
            placeholder="090-1234-5678"
          />
        </div>

        <div>
          <label htmlFor="message" className="block text-sm font-medium text-neutral-700 mb-1">
            連絡事項（任意）
          </label>
          <textarea
            id="message"
            rows={3}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full px-4 py-3 border border-neutral-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-transparent transition resize-none"
            placeholder="身体の不調やご要望などがあればご記入ください"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            初めてのご予約ですか？
          </label>
          <div className="flex gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="firstVisit"
                checked={isFirstVisit}
                onChange={() => setIsFirstVisit(true)}
                className="w-4 h-4 text-primary-500 focus:ring-primary-300"
              />
              <span className="text-sm text-neutral-700">はい</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="firstVisit"
                checked={!isFirstVisit}
                onChange={() => setIsFirstVisit(false)}
                className="w-4 h-4 text-primary-500 focus:ring-primary-300"
              />
              <span className="text-sm text-neutral-700">いいえ</span>
            </label>
          </div>
        </div>

        {/* Honeypot field - hidden from users */}
        <div style={{ display: "none" }} aria-hidden="true">
          <label htmlFor="website">Website</label>
          <input
            type="text"
            id="website"
            name="website"
            tabIndex={-1}
            autoComplete="off"
            value={honeypot}
            onChange={(e) => setHoneypot(e.target.value)}
          />
        </div>
      </div>

      <button
        type="submit"
        className="w-full mt-6 bg-primary-500 hover:bg-primary-600 text-white py-3 rounded-xl font-medium transition-colors"
      >
        確認画面へ
      </button>
    </form>
  );
}

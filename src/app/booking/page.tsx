"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import Calendar from "@/components/booking/Calendar";
import SlotPicker from "@/components/booking/SlotPicker";
import BookingForm from "@/components/booking/BookingForm";
import type { Slot } from "@/lib/types";

export default function BookingPage() {
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [slots, setSlots] = useState<Slot[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [clientRequestId, setClientRequestId] = useState("");

  useEffect(() => {
    setClientRequestId(crypto.randomUUID());
  }, []);

  const handleDateSelect = useCallback(async (date: string) => {
    setSelectedDate(date);
    setSelectedSlot(null);
    setShowForm(false);
    setLoadingSlots(true);

    try {
      const res = await fetch(`/api/availability?date=${date}`);
      const data = await res.json();
      setSlots(data.slots || []);
    } catch {
      setSlots([]);
    } finally {
      setLoadingSlots(false);
    }
  }, []);

  const handleSlotSelect = useCallback((startTime: string) => {
    setSelectedSlot(startTime);
    setShowForm(true);
  }, []);

  const handleFormSubmit = useCallback(
    (formData: {
      name: string;
      email: string;
      phone: string;
      message: string;
      isFirstVisit: boolean;
      honeypot: string;
    }) => {
      // 確認画面へデータを渡す（sessionStorage経由）
      const bookingData = {
        clientRequestId,
        date: selectedDate,
        startTime: selectedSlot,
        ...formData,
      };
      sessionStorage.setItem("bookingData", JSON.stringify(bookingData));
      router.push("/booking/confirm");
    },
    [clientRequestId, selectedDate, selectedSlot, router]
  );

  /** 選択日の日本語表記 */
  const formatDateJa = (dateStr: string) => {
    const d = new Date(dateStr + "T00:00:00+09:00");
    const days = ["日", "月", "火", "水", "木", "金", "土"];
    return `${d.getMonth() + 1}月${d.getDate()}日（${days[d.getDay()]}）`;
  };

  return (
    <div className="max-w-lg mx-auto px-4 py-8 md:py-12">
      <h1 className="text-2xl font-bold text-neutral-800 mb-2 text-center">ご予約</h1>
      <p className="text-neutral-500 text-sm text-center mb-8">
        ご希望の日時をお選びください
      </p>

      <div className="space-y-6">
        {/* Step 1: Calendar */}
        <Calendar selectedDate={selectedDate} onDateSelect={handleDateSelect} />

        {/* Step 2: Slot Picker */}
        {selectedDate && (
          <div>
            <p className="text-sm text-neutral-600 mb-3">
              <span className="font-medium">{formatDateJa(selectedDate)}</span> の空き状況
            </p>
            <SlotPicker
              slots={slots}
              selectedSlot={selectedSlot}
              onSlotSelect={handleSlotSelect}
              loading={loadingSlots}
            />
          </div>
        )}

        {/* Step 3: Booking Form */}
        {showForm && selectedDate && selectedSlot && (
          <div>
            <div className="bg-primary-50 rounded-xl p-4 mb-4">
              <p className="text-sm text-primary-800 font-medium">
                {formatDateJa(selectedDate)} {selectedSlot}〜
              </p>
            </div>
            <BookingForm onSubmit={handleFormSubmit} />
          </div>
        )}
      </div>
    </div>
  );
}

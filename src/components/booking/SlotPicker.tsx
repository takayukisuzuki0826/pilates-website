"use client";

import type { Slot } from "@/lib/types";

interface SlotPickerProps {
  slots: Slot[];
  selectedSlot: string | null;
  onSlotSelect: (startTime: string) => void;
  loading: boolean;
}

export default function SlotPicker({ slots, selectedSlot, onSlotSelect, loading }: SlotPickerProps) {
  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-neutral-200 p-6">
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin w-6 h-6 border-2 border-primary-500 border-t-transparent rounded-full" />
          <span className="ml-3 text-neutral-500 text-sm">空き状況を確認中...</span>
        </div>
      </div>
    );
  }

  if (slots.length === 0) {
    return null;
  }

  const hasAvailable = slots.some((s) => s.available);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-neutral-200 p-4 md:p-6">
      <h3 className="text-lg font-semibold text-neutral-800 mb-4">時間を選択</h3>
      {!hasAvailable ? (
        <p className="text-neutral-500 text-sm text-center py-4">
          この日は空きがありません。他の日付をお選びください。
        </p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {slots.map((slot) => (
            <button
              key={slot.startTime}
              onClick={() => slot.available && onSlotSelect(slot.startTime)}
              disabled={!slot.available}
              className={`
                py-3 px-4 rounded-xl text-sm font-medium transition-all
                ${
                  selectedSlot === slot.startTime
                    ? "bg-primary-500 text-white shadow-sm"
                    : slot.available
                    ? "bg-neutral-50 hover:bg-primary-50 text-neutral-700 border border-neutral-200"
                    : "bg-neutral-100 text-neutral-400 cursor-not-allowed line-through"
                }
              `}
            >
              {slot.startTime}〜{slot.endTime}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

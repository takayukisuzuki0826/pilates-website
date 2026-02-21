"use client";

import { useState, useMemo } from "react";
import { CONFIG } from "@/lib/config";

interface CalendarProps {
  selectedDate: string | null;
  onDateSelect: (date: string) => void;
}

export default function Calendar({ selectedDate, onDateSelect }: CalendarProps) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());

  const maxDate = useMemo(() => {
    const d = new Date(today);
    d.setDate(d.getDate() + CONFIG.BOOKING_WINDOW_DAYS);
    return d;
  }, []);

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();

  const days = useMemo(() => {
    const result: (number | null)[] = [];
    for (let i = 0; i < firstDayOfMonth; i++) result.push(null);
    for (let d = 1; d <= daysInMonth; d++) result.push(d);
    return result;
  }, [daysInMonth, firstDayOfMonth]);

  function isSelectable(day: number): boolean {
    const date = new Date(currentYear, currentMonth, day);
    date.setHours(0, 0, 0, 0);
    return date >= today && date <= maxDate;
  }

  function formatDate(day: number): string {
    const m = String(currentMonth + 1).padStart(2, "0");
    const d = String(day).padStart(2, "0");
    return `${currentYear}-${m}-${d}`;
  }

  function prevMonth() {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  }

  function nextMonth() {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  }

  const canGoPrev = (() => {
    const prevMonthDate = new Date(currentYear, currentMonth, 0);
    return prevMonthDate >= today;
  })();

  const canGoNext = (() => {
    const nextMonthDate = new Date(currentYear, currentMonth + 1, 1);
    return nextMonthDate <= maxDate;
  })();

  const monthNames = [
    "1月", "2月", "3月", "4月", "5月", "6月",
    "7月", "8月", "9月", "10月", "11月", "12月",
  ];

  const dayNames = ["日", "月", "火", "水", "木", "金", "土"];

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-neutral-200 p-4 md:p-6">
      {/* Month Navigation */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={prevMonth}
          disabled={!canGoPrev}
          className="p-2 rounded-lg hover:bg-neutral-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          aria-label="前月"
        >
          <svg className="w-5 h-5 text-neutral-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h2 className="text-lg font-semibold text-neutral-800">
          {currentYear}年 {monthNames[currentMonth]}
        </h2>
        <button
          onClick={nextMonth}
          disabled={!canGoNext}
          className="p-2 rounded-lg hover:bg-neutral-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          aria-label="翌月"
        >
          <svg className="w-5 h-5 text-neutral-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Day Headers */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {dayNames.map((name, i) => (
          <div
            key={name}
            className={`text-center text-xs font-medium py-2 ${
              i === 0 ? "text-red-400" : i === 6 ? "text-blue-400" : "text-neutral-500"
            }`}
          >
            {name}
          </div>
        ))}
      </div>

      {/* Days Grid */}
      <div className="grid grid-cols-7 gap-1">
        {days.map((day, idx) => {
          if (day === null) {
            return <div key={`empty-${idx}`} />;
          }

          const dateStr = formatDate(day);
          const selectable = isSelectable(day);
          const isSelected = selectedDate === dateStr;
          const isToday = dateStr === formatDate(today.getDate()) &&
            currentMonth === today.getMonth() &&
            currentYear === today.getFullYear();
          const dayOfWeek = new Date(currentYear, currentMonth, day).getDay();

          return (
            <button
              key={dateStr}
              onClick={() => selectable && onDateSelect(dateStr)}
              disabled={!selectable}
              className={`
                aspect-square flex items-center justify-center rounded-lg text-sm transition-all
                ${
                  isSelected
                    ? "bg-primary-500 text-white font-bold shadow-sm"
                    : selectable
                    ? "hover:bg-primary-50 cursor-pointer"
                    : "text-neutral-300 cursor-not-allowed"
                }
                ${isToday && !isSelected ? "ring-2 ring-primary-300" : ""}
                ${!isSelected && selectable && dayOfWeek === 0 ? "text-red-500" : ""}
                ${!isSelected && selectable && dayOfWeek === 6 ? "text-blue-500" : ""}
              `}
            >
              {day}
            </button>
          );
        })}
      </div>
    </div>
  );
}

import Link from "next/link";
import { getBookingsByDate, getCustomer } from "@/lib/google-sheets";
import { getLessonNotesByCustomer } from "@/lib/google-sheets";

export const metadata = {
  title: "管理画面",
};

export const dynamic = "force-dynamic";

function getTodayStr(): string {
  return new Date().toLocaleDateString("sv-SE", { timeZone: "Asia/Tokyo" });
}

function getTomorrowStr(): string {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d.toLocaleDateString("sv-SE", { timeZone: "Asia/Tokyo" });
}

function formatDateJa(dateStr: string): string {
  const d = new Date(dateStr + "T00:00:00+09:00");
  const days = ["日", "月", "火", "水", "木", "金", "土"];
  return `${d.getMonth() + 1}月${d.getDate()}日（${days[d.getDay()]}）`;
}

export default async function AdminPage() {
  const today = getTodayStr();
  const tomorrow = getTomorrowStr();

  const [todayBookings, tomorrowBookings] = await Promise.all([
    getBookingsByDate(today),
    getBookingsByDate(tomorrow),
  ]);

  // 顧客情報と最新レッスンメモを取得
  const enrichBookings = async (bookings: Awaited<ReturnType<typeof getBookingsByDate>>) => {
    return Promise.all(
      bookings
        .sort((a, b) => a.startTime.localeCompare(b.startTime))
        .map(async (booking) => {
          const customer = await getCustomer(booking.customerId);
          let lastNote = "";
          if (booking.customerId) {
            const notes = await getLessonNotesByCustomer(booking.customerId);
            if (notes.length > 0) {
              const sorted = notes.sort((a, b) => b.date.localeCompare(a.date));
              lastNote = sorted[0].nextAction || sorted[0].content || "";
            }
          }
          return { ...booking, customer, lastNote };
        })
    );
  };

  const todayEnriched = await enrichBookings(todayBookings);
  const tomorrowEnriched = await enrichBookings(tomorrowBookings);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-neutral-800">管理画面</h1>
        <Link
          href="/admin/customers"
          className="text-primary-600 hover:text-primary-700 text-sm font-medium"
        >
          顧客一覧 →
        </Link>
      </div>

      {/* 本日の予約 */}
      <section className="mb-10">
        <h2 className="text-lg font-semibold text-neutral-800 mb-4">
          本日の予約 — {formatDateJa(today)}
        </h2>
        {todayEnriched.length === 0 ? (
          <div className="bg-neutral-50 rounded-xl p-6 text-center text-neutral-500">
            本日の予約はありません
          </div>
        ) : (
          <div className="space-y-3">
            {todayEnriched.map((b) => (
              <div key={b.bookingId} className="bg-white border border-neutral-200 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center gap-3">
                <div className="flex-shrink-0">
                  <span className="text-lg font-bold text-primary-700">{b.startTime}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/admin/customers/${b.customerId}`}
                      className="font-medium text-neutral-800 hover:text-primary-600"
                    >
                      {b.customer?.name || "不明"}
                    </Link>
                    <span className="text-xs text-neutral-500 bg-neutral-100 px-2 py-0.5 rounded-full">
                      {b.customer?.totalVisits || 0}回目
                    </span>
                  </div>
                  {b.lastNote && (
                    <p className="text-xs text-neutral-500 mt-1 truncate">
                      前回メモ：{b.lastNote}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 明日の予約 */}
      {tomorrowEnriched.length > 0 && (
        <section>
          <h2 className="text-lg font-semibold text-neutral-800 mb-4">
            明日の予約 — {formatDateJa(tomorrow)}
          </h2>
          <div className="space-y-3">
            {tomorrowEnriched.map((b) => (
              <div key={b.bookingId} className="bg-white border border-neutral-200 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center gap-3">
                <div className="flex-shrink-0">
                  <span className="text-lg font-bold text-primary-700">{b.startTime}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/admin/customers/${b.customerId}`}
                      className="font-medium text-neutral-800 hover:text-primary-600"
                    >
                      {b.customer?.name || "不明"}
                    </Link>
                    <span className="text-xs text-neutral-500 bg-neutral-100 px-2 py-0.5 rounded-full">
                      {b.customer?.totalVisits || 0}回目
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

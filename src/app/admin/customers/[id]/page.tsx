import Link from "next/link";
import {
  getCustomer,
  getBookingsByCustomer,
  getLessonNotesByCustomer,
} from "@/lib/google-sheets";
import LessonNoteForm from "@/components/admin/LessonNoteForm";

export const metadata = {
  title: "顧客詳細",
};

export const dynamic = "force-dynamic";

export default async function CustomerDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const customer = await getCustomer(id);

  if (!customer) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-16 text-center">
        <h1 className="text-xl font-bold text-neutral-800 mb-4">顧客が見つかりません</h1>
        <Link href="/admin/customers" className="text-primary-600 hover:text-primary-700 text-sm">
          ← 顧客一覧に戻る
        </Link>
      </div>
    );
  }

  const [bookings, notes] = await Promise.all([
    getBookingsByCustomer(id),
    getLessonNotesByCustomer(id),
  ]);

  const sortedBookings = [...bookings].sort((a, b) => b.date.localeCompare(a.date));
  const sortedNotes = [...notes].sort((a, b) => b.date.localeCompare(a.date));

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <Link href="/admin/customers" className="text-primary-600 hover:text-primary-700 text-sm mb-6 inline-block">
        ← 顧客一覧
      </Link>

      {/* Customer Info */}
      <div className="bg-white border border-neutral-200 rounded-xl p-6 mb-8">
        <h1 className="text-2xl font-bold text-neutral-800 mb-4">{customer.name}</h1>
        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div>
            <dt className="text-neutral-500">メール</dt>
            <dd className="text-neutral-800">{customer.email}</dd>
          </div>
          <div>
            <dt className="text-neutral-500">電話</dt>
            <dd className="text-neutral-800">{customer.phone}</dd>
          </div>
          <div>
            <dt className="text-neutral-500">初回来店</dt>
            <dd className="text-neutral-800">{customer.firstVisit}</dd>
          </div>
          <div>
            <dt className="text-neutral-500">累計来店回数</dt>
            <dd className="text-neutral-800">{customer.totalVisits}回</dd>
          </div>
          {customer.memo && (
            <div className="sm:col-span-2">
              <dt className="text-neutral-500">メモ</dt>
              <dd className="text-neutral-800 whitespace-pre-wrap">{customer.memo}</dd>
            </div>
          )}
        </dl>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Booking History */}
        <section>
          <h2 className="text-lg font-semibold text-neutral-800 mb-4">来店履歴</h2>
          {sortedBookings.length === 0 ? (
            <p className="text-neutral-500 text-sm bg-neutral-50 rounded-xl p-4">来店履歴なし</p>
          ) : (
            <div className="space-y-2">
              {sortedBookings.map((b) => (
                <div
                  key={b.bookingId}
                  className="bg-white border border-neutral-200 rounded-lg px-4 py-3 flex items-center justify-between"
                >
                  <div>
                    <span className="text-sm font-medium text-neutral-800">{b.date}</span>
                    <span className="text-neutral-500 text-sm ml-2">{b.startTime}〜</span>
                  </div>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full ${
                      b.status === "confirmed"
                        ? "bg-green-100 text-green-700"
                        : b.status === "cancelled"
                        ? "bg-red-100 text-red-600"
                        : "bg-neutral-100 text-neutral-600"
                    }`}
                  >
                    {b.status === "confirmed" ? "確定" : b.status === "cancelled" ? "キャンセル" : "完了"}
                  </span>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Lesson Notes */}
        <section>
          <h2 className="text-lg font-semibold text-neutral-800 mb-4">レッスン記録</h2>

          <LessonNoteForm customerId={id} />

          {sortedNotes.length === 0 ? (
            <p className="text-neutral-500 text-sm bg-neutral-50 rounded-xl p-4 mt-4">レッスン記録なし</p>
          ) : (
            <div className="space-y-3 mt-4">
              {sortedNotes.map((n) => (
                <div key={n.noteId} className="bg-white border border-neutral-200 rounded-lg p-4">
                  <p className="text-xs text-neutral-500 mb-2">{n.date}</p>
                  <p className="text-sm text-neutral-700 whitespace-pre-wrap">{n.content}</p>
                  {n.nextAction && (
                    <div className="mt-2 pt-2 border-t border-neutral-100">
                      <p className="text-xs text-primary-600 font-medium">次回への申し送り</p>
                      <p className="text-sm text-neutral-600">{n.nextAction}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

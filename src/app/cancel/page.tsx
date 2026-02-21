import { findEventByToken } from "@/lib/google-calendar";
import { CONFIG } from "@/lib/config";
import CancelButton from "@/components/booking/CancelButton";

export const metadata = {
  title: "キャンセル",
  robots: "noindex, nofollow",
};

export const dynamic = "force-dynamic";

export default async function CancelPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;

  if (!token) {
    return (
      <div className="max-w-lg mx-auto px-4 py-16 text-center">
        <h1 className="text-xl font-bold text-neutral-800 mb-4">ページが見つかりません</h1>
        <p className="text-neutral-600 text-sm">このURLは無効です。</p>
      </div>
    );
  }

  const event = await findEventByToken("cancelToken", token);

  if (!event) {
    return (
      <div className="max-w-lg mx-auto px-4 py-16 text-center">
        <h1 className="text-xl font-bold text-neutral-800 mb-4">予約が見つかりません</h1>
        <p className="text-neutral-600 text-sm leading-relaxed">
          この予約は既にキャンセル済みか、存在しません。
        </p>
      </div>
    );
  }

  // キャンセル期限チェック
  const eventStart = new Date(event.start?.dateTime || "");
  const now = new Date();
  const deadlineMs = eventStart.getTime() - CONFIG.CANCEL_DEADLINE_HOURS * 60 * 60 * 1000;
  const isPastDeadline = now.getTime() > deadlineMs;

  // 日本語フォーマット
  const days = ["日", "月", "火", "水", "木", "金", "土"];
  const month = eventStart.getMonth() + 1;
  const day = eventStart.getDate();
  const dayOfWeek = days[eventStart.getDay()];
  const hours = String(eventStart.getHours()).padStart(2, "0");
  const minutes = String(eventStart.getMinutes()).padStart(2, "0");
  const dateDisplay = `${month}月${day}日（${dayOfWeek}） ${hours}:${minutes}`;

  if (isPastDeadline) {
    return (
      <div className="max-w-lg mx-auto px-4 py-16 text-center">
        <h1 className="text-xl font-bold text-neutral-800 mb-4">キャンセル期限を過ぎています</h1>
        <p className="text-neutral-600 text-sm leading-relaxed">
          レッスン開始の{CONFIG.CANCEL_DEADLINE_HOURS}時間前を過ぎたため、
          <br />
          オンラインでのキャンセルはできません。
        </p>
        <p className="text-neutral-500 text-sm mt-4">
          キャンセルをご希望の場合は、直接ご連絡ください。
        </p>
        <div className="mt-4 text-neutral-500 text-xs">
          <p>メール：info@example.com</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-8 md:py-16">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-neutral-800 mb-2">予約のキャンセル</h1>
        <p className="text-neutral-500 text-sm mb-8">
          以下の予約をキャンセルしますか？
        </p>

        <div className="bg-neutral-50 rounded-2xl p-6 mb-8">
          <p className="text-neutral-800 font-semibold text-xl">{dateDisplay}〜</p>
        </div>

        <CancelButton cancelToken={token} />
      </div>
    </div>
  );
}

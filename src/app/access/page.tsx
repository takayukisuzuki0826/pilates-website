import { findEventByToken } from "@/lib/google-calendar";
import { CONFIG } from "@/lib/config";

export const metadata = {
  title: "アクセス",
  robots: "noindex, nofollow",
};

export const dynamic = "force-dynamic";

export default async function AccessPage({
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

  const event = await findEventByToken("accessToken", token);

  if (!event) {
    return (
      <div className="max-w-lg mx-auto px-4 py-16 text-center">
        <h1 className="text-xl font-bold text-neutral-800 mb-4">ページが見つかりません</h1>
        <p className="text-neutral-600 text-sm">この予約は見つかりませんでした。</p>
      </div>
    );
  }

  // 有効期限チェック
  const eventStart = new Date(event.start?.dateTime || "");
  const eventEnd = new Date(event.end?.dateTime || "");
  const now = new Date();

  const validFrom = new Date(eventStart.getTime() - CONFIG.ACCESS_TOKEN_VALID_BEFORE_HOURS * 60 * 60 * 1000);

  if (now < validFrom || now > eventEnd) {
    return (
      <div className="max-w-lg mx-auto px-4 py-16 text-center">
        <h1 className="text-xl font-bold text-neutral-800 mb-4">有効期限外です</h1>
        <p className="text-neutral-600 text-sm leading-relaxed">
          このリンクは有効期限外です。
          <br />
          ご不明な場合はご連絡ください。
        </p>
        <div className="mt-6 text-neutral-500 text-xs">
          <p>メール：info@example.com</p>
        </div>
      </div>
    );
  }

  // 日本語フォーマット
  const days = ["日", "月", "火", "水", "木", "金", "土"];
  const month = eventStart.getMonth() + 1;
  const day = eventStart.getDate();
  const dayOfWeek = days[eventStart.getDay()];
  const hours = String(eventStart.getHours()).padStart(2, "0");
  const minutes = String(eventStart.getMinutes()).padStart(2, "0");

  return (
    <div className="max-w-lg mx-auto px-4 py-8 md:py-12">
      <h1 className="text-2xl font-bold text-neutral-800 mb-2 text-center">スタジオへのアクセス</h1>
      <p className="text-neutral-500 text-sm text-center mb-8">
        {month}月{day}日（{dayOfWeek}） {hours}:{minutes}〜 のレッスン
      </p>

      <div className="space-y-6">
        {/* Address */}
        <div className="bg-white rounded-2xl shadow-sm border border-neutral-200 p-6">
          <h2 className="text-lg font-semibold text-neutral-800 mb-3">住所</h2>
          <p className="text-neutral-700 leading-relaxed">
            {/* 住所をここに入力 */}
            〒000-0000
            <br />
            東京都○○区○○ 0-0-0
            <br />
            ○○マンション 000号室
          </p>
        </div>

        {/* Directions */}
        <div className="bg-white rounded-2xl shadow-sm border border-neutral-200 p-6">
          <h2 className="text-lg font-semibold text-neutral-800 mb-3">最寄り駅からの道順</h2>
          <ol className="list-decimal list-inside space-y-2 text-neutral-600 text-sm leading-relaxed">
            {/* 道順をここに入力 */}
            <li>○○駅の○○出口を出て右に進みます</li>
            <li>○○の交差点を左折します</li>
            <li>○○を通り過ぎた先の右手にあるマンションです</li>
            <li>エントランスから○階へお上がりください</li>
          </ol>
        </div>

        {/* Entry Guide */}
        <div className="bg-white rounded-2xl shadow-sm border border-neutral-200 p-6">
          <h2 className="text-lg font-semibold text-neutral-800 mb-3">入口のご案内</h2>
          <p className="text-neutral-600 text-sm leading-relaxed">
            {/* 入口案内をここに入力 */}
            オートロックのインターホンで「○○○」を押してください。
            お部屋は○階の○○○号室です。
          </p>
        </div>

        {/* Contact */}
        <div className="bg-warm-50 rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-neutral-800 mb-3">当日のご連絡先</h2>
          <p className="text-neutral-600 text-sm">
            迷われた場合や遅れる場合は、お気軽にご連絡ください。
          </p>
          <div className="mt-3 space-y-1 text-neutral-700 text-sm">
            {/* 連絡先をここに入力 */}
            <p>電話：090-XXXX-XXXX</p>
          </div>
        </div>
      </div>

      <p className="text-neutral-400 text-xs text-center mt-8">
        このページは予約された方のみ閲覧可能です。URLの共有はお控えください。
      </p>
    </div>
  );
}

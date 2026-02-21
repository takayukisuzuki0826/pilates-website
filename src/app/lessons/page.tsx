import Link from "next/link";

export const metadata = {
  title: "レッスン・料金",
};

export default function LessonsPage() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-b from-primary-50 to-white py-16 md:py-24">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-neutral-800 mb-4">レッスン内容・料金</h1>
          <p className="text-neutral-600 text-lg">
            あなたの目的に合わせたプログラム
          </p>
        </div>
      </section>

      {/* Lesson Types */}
      <section className="py-16">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-neutral-800 mb-8">レッスン内容</h2>
          <div className="space-y-6">
            <div className="bg-white border border-neutral-200 rounded-2xl p-6 md:p-8">
              <h3 className="text-lg font-semibold text-primary-700 mb-3">マットピラティス</h3>
              <p className="text-neutral-600 text-sm leading-relaxed">
                マットの上で行うピラティスの基本プログラム。自分の体重を使って体幹を鍛え、姿勢改善や柔軟性の向上を目指します。初めての方にもおすすめのプログラムです。
              </p>
            </div>
            <div className="bg-white border border-neutral-200 rounded-2xl p-6 md:p-8">
              <h3 className="text-lg font-semibold text-primary-700 mb-3">姿勢改善プログラム</h3>
              <p className="text-neutral-600 text-sm leading-relaxed">
                デスクワークやスマートフォンの使用で崩れがちな姿勢を整えるプログラム。肩こりや腰痛の予防・改善にも効果が期待できます。お一人おひとりの姿勢の癖を分析し、最適なエクササイズをご提案します。
              </p>
            </div>
            <div className="bg-white border border-neutral-200 rounded-2xl p-6 md:p-8">
              <h3 className="text-lg font-semibold text-primary-700 mb-3">コンディショニング</h3>
              <p className="text-neutral-600 text-sm leading-relaxed">
                身体の不調がある方向けのプログラム。痛みや不調の原因にアプローチし、日常生活を快適に過ごせる身体づくりをサポートします。医師の診断を受けている方は、事前にお知らせください。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Price */}
      <section className="py-16 bg-neutral-50">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-neutral-800 mb-8">料金表</h2>
          <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
            <table className="w-full">
              <thead>
                <tr className="bg-primary-50">
                  <th className="text-left px-6 py-4 text-sm font-semibold text-neutral-800">メニュー</th>
                  <th className="text-right px-6 py-4 text-sm font-semibold text-neutral-800">料金（税込）</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                <tr>
                  <td className="px-6 py-4">
                    <div className="font-medium text-neutral-800">体験レッスン</div>
                    <div className="text-neutral-500 text-xs mt-1">初回限定・60分</div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className="text-lg font-bold text-primary-600">¥○,○○○</span>
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4">
                    <div className="font-medium text-neutral-800">プライベートレッスン</div>
                    <div className="text-neutral-500 text-xs mt-1">60分</div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className="text-lg font-bold text-neutral-800">¥○,○○○</span>
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4">
                    <div className="font-medium text-neutral-800">回数券（5回）</div>
                    <div className="text-neutral-500 text-xs mt-1">有効期限3ヶ月</div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className="text-lg font-bold text-neutral-800">¥○○,○○○</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-neutral-500 text-xs mt-4">
            ※ 料金は変更になる場合がございます。
          </p>
        </div>
      </section>

      {/* Flow */}
      <section className="py-16">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-neutral-800 mb-8">レッスンの流れ</h2>
          <div className="space-y-6">
            {[
              { step: "1", title: "カウンセリング", desc: "お身体の状態や目的、気になることなどをお伺いします。（初回は15分程度）" },
              { step: "2", title: "ウォームアップ", desc: "呼吸法を中心に、身体を温めていきます。" },
              { step: "3", title: "メインエクササイズ", desc: "お客様の状態に合わせたピラティスエクササイズを行います。" },
              { step: "4", title: "クールダウン", desc: "ストレッチで身体を整え、レッスンの振り返りを行います。" },
            ].map((item) => (
              <div key={item.step} className="flex gap-4 items-start">
                <div className="w-10 h-10 bg-primary-500 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
                  {item.step}
                </div>
                <div>
                  <h3 className="font-semibold text-neutral-800 mb-1">{item.title}</h3>
                  <p className="text-neutral-600 text-sm">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Things to Bring */}
      <section className="py-16 bg-warm-50">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-neutral-800 mb-6">持ち物</h2>
          <ul className="space-y-3 text-neutral-600">
            <li className="flex items-start gap-3">
              <span className="text-primary-500 mt-1">&#10003;</span>
              動きやすい服装（更衣スペースあり）
            </li>
            <li className="flex items-start gap-3">
              <span className="text-primary-500 mt-1">&#10003;</span>
              タオル
            </li>
            <li className="flex items-start gap-3">
              <span className="text-primary-500 mt-1">&#10003;</span>
              お飲み物
            </li>
            <li className="flex items-start gap-3">
              <span className="text-primary-500 mt-1">&#10003;</span>
              靴下（滑り止め付きがおすすめ）
            </li>
          </ul>
          <p className="text-neutral-500 text-xs mt-4">
            ※ マットはスタジオにご用意しています。
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-primary-50 py-16">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold text-neutral-800 mb-4">まずは体験レッスンから</h2>
          <p className="text-neutral-600 mb-8">
            ピラティスが初めての方も大歓迎です。
          </p>
          <Link
            href="/booking"
            className="inline-block bg-primary-500 hover:bg-primary-600 text-white px-8 py-4 rounded-full text-lg font-medium transition-colors"
          >
            予約する
          </Link>
        </div>
      </section>
    </div>
  );
}

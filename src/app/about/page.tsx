import Link from "next/link";

export const metadata = {
  title: "スタジオ紹介",
};

export default function AboutPage() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-b from-primary-50 to-white py-16 md:py-24">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-neutral-800 mb-4">スタジオ紹介</h1>
          <p className="text-neutral-600 text-lg">
            身体と心を整える、あなただけの空間
          </p>
        </div>
      </section>

      {/* Concept */}
      <section className="py-16">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-neutral-800 mb-6">コンセプト</h2>
          <div className="space-y-4 text-neutral-600 leading-relaxed">
            <p>
              当スタジオは、「一人ひとりの身体に向き合う」をコンセプトに、完全予約制のプライベートレッスンを提供しています。
            </p>
            <p>
              大人数のグループレッスンでは見落とされがちな、お一人おひとりの身体の癖や課題に丁寧にアプローチ。ピラティスを通じて、日常生活をより快適に過ごせる身体づくりをサポートします。
            </p>
            <p>
              初めての方から経験者まで、それぞれのレベルや目的に合わせたプログラムをご用意しています。「身体を動かすのが苦手」「運動経験がない」という方も、安心してお越しください。
            </p>
          </div>
        </div>
      </section>

      {/* Instructor */}
      <section className="py-16 bg-neutral-50">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-neutral-800 mb-6">インストラクター</h2>
          <div className="bg-white rounded-2xl p-8 shadow-sm">
            <div className="flex flex-col md:flex-row gap-6 items-start">
              <div className="w-24 h-24 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0 mx-auto md:mx-0">
                <svg className="w-12 h-12 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-neutral-800 mb-1 text-center md:text-left">
                  {/* インストラクター名をここに入力 */}
                  インストラクター名
                </h3>
                <p className="text-primary-600 text-sm mb-4 text-center md:text-left">ピラティスインストラクター</p>
                <div className="space-y-3 text-neutral-600 text-sm leading-relaxed">
                  <p>
                    {/* 経歴・資格をここに入力 */}
                    ピラティス指導歴○年。○○資格保有。これまでに○○名以上の方を指導してきました。
                  </p>
                  <p>
                    {/* メッセージをここに入力 */}
                    一人ひとりの身体と向き合い、「今日来てよかった」と思っていただけるレッスンを心がけています。身体の不調や姿勢のお悩みなど、お気軽にご相談ください。
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Studio Info */}
      <section className="py-16">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-neutral-800 mb-6">スタジオ情報</h2>
          <div className="bg-warm-50 rounded-2xl p-8">
            <dl className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:gap-4">
                <dt className="font-medium text-neutral-800 sm:w-32 flex-shrink-0">場所</dt>
                <dd className="text-neutral-600">○○駅徒歩○分のプライベートスタジオ</dd>
              </div>
              <div className="flex flex-col sm:flex-row sm:gap-4">
                <dt className="font-medium text-neutral-800 sm:w-32 flex-shrink-0">営業時間</dt>
                <dd className="text-neutral-600">10:00〜16:00（完全予約制）</dd>
              </div>
              <div className="flex flex-col sm:flex-row sm:gap-4">
                <dt className="font-medium text-neutral-800 sm:w-32 flex-shrink-0">定休日</dt>
                <dd className="text-neutral-600">不定休</dd>
              </div>
            </dl>
            <p className="text-neutral-500 text-xs mt-6">
              ※ 住所の詳細はご予約確定後にメールでお知らせいたします。
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-primary-50 py-16">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold text-neutral-800 mb-4">レッスンのご予約</h2>
          <p className="text-neutral-600 mb-8">
            体験レッスンも受付中です。お気軽にお問い合わせください。
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

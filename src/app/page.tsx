import Link from "next/link";

export default function HomePage() {
  return (
    <div className="bg-white">
      {/* Test Mode Alert */}
      <div className="bg-neutral-900 text-white text-xs py-2 px-4 text-center font-medium tracking-wide">
        ⚠️ 現在は仮運用のテストページです。実際の予約は行われません。
      </div>

      {/* Hero Section */}
      <section className="relative pt-24 pb-32 md:pt-40 md:pb-48 overflow-hidden">
        <div className="max-w-5xl mx-auto px-6 relative z-10">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-6xl font-light text-neutral-900 leading-[1.1] mb-8 tracking-tight">
              心と身体を整える、
              <br />
              <span className="font-normal">あなただけのピラティス。</span>
            </h1>
            <p className="text-neutral-500 text-lg md:text-xl leading-relaxed mb-12 max-w-xl font-light">
              完全予約制のプライベート空間で、一人ひとりの身体に寄り添うマンツーマンレッスン。
              静寂の中で、本来の自分を取り戻す時間をお届けします。
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/booking"
                className="inline-flex items-center justify-center bg-neutral-900 text-white px-8 py-4 rounded-lg text-base font-medium transition-all hover:bg-neutral-700 hover:shadow-lg"
              >
                レッスンを予約する
              </Link>
              <Link
                href="/about"
                className="inline-flex items-center justify-center bg-white text-neutral-900 border border-neutral-200 px-8 py-4 rounded-lg text-base font-medium transition-all hover:bg-neutral-50 hover:border-neutral-300"
              >
                スタジオについて
              </Link>
            </div>
          </div>
        </div>
        
        {/* Decorative background element */}
        <div className="absolute top-0 right-0 w-1/2 h-full bg-neutral-50 -z-10 hidden lg:block" />
      </section>

      {/* Features */}
      <section className="py-24 bg-white">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-16">
            <div className="space-y-4">
              <div className="w-12 h-12 flex items-center justify-center rounded-lg bg-primary-50 text-primary-600 mb-6">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-medium text-neutral-900">完全マンツーマン</h3>
              <p className="text-neutral-500 leading-relaxed font-light">
                お一人おひとりの骨格や筋肉の付き方、その日の体調に合わせてレッスンをカスタマイズ。グループレッスンでは味わえない、きめ細やかな指導を体験してください。
              </p>
            </div>
            <div className="space-y-4">
              <div className="w-12 h-12 flex items-center justify-center rounded-lg bg-primary-50 text-primary-600 mb-6">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              </div>
              <h3 className="text-xl font-medium text-neutral-900">洗練されたプライベート空間</h3>
              <p className="text-neutral-500 leading-relaxed font-light">
                他人の目を気にすることなく、自分自身の身体と向き合える静かな空間。白を基調とした清潔感のあるスタジオで、心身ともにリラックスしていただけます。
              </p>
            </div>
            <div className="space-y-4">
              <div className="w-12 h-12 flex items-center justify-center rounded-lg bg-primary-50 text-primary-600 mb-6">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-medium text-neutral-900">スマートな予約システム</h3>
              <p className="text-neutral-500 leading-relaxed font-light">
                24時間いつでもオンラインで予約可能。空き状況が一目でわかり、ご自身のスケジュールに合わせて柔軟にレッスンを組み込むことができます。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-neutral-50">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-light text-neutral-900 mb-6">Start Your Journey</h2>
          <p className="text-neutral-500 mb-10 font-light">
            まずは体験レッスンから。
            <br />
            ピラティスが初めての方も、経験者の方も、お待ちしております。
          </p>
          <Link
            href="/booking"
            className="inline-flex items-center justify-center bg-primary-600 text-white px-10 py-4 rounded-lg text-base font-medium transition-all hover:bg-primary-700 hover:shadow-lg"
          >
            予約カレンダーを見る
          </Link>
        </div>
      </section>
    </div>
  );
}

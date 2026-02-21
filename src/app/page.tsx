import Link from "next/link";

export default function HomePage() {
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-primary-50 to-white py-20 md:py-32">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-5xl font-bold text-neutral-900 leading-tight mb-6">
            あなただけの
            <br className="md:hidden" />
            ピラティス時間
          </h1>
          <p className="text-neutral-600 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
            完全予約制のプライベートスタジオで、
            <br className="hidden md:block" />
            一人ひとりの身体に合わせたマンツーマンレッスンをお届けします。
          </p>
          <Link
            href="/booking"
            className="inline-block bg-primary-500 hover:bg-primary-600 text-white px-8 py-4 rounded-full text-lg font-medium transition-colors shadow-md hover:shadow-lg"
          >
            レッスンを予約する
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 md:py-24">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center text-neutral-800 mb-12">
            スタジオの特徴
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-neutral-800 mb-2">完全マンツーマン</h3>
              <p className="text-neutral-600 text-sm leading-relaxed">
                お一人おひとりの身体の状態やご要望に合わせて、レッスン内容をカスタマイズ。グループレッスンでは難しい細やかなアプローチが可能です。
              </p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-warm-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-warm-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-neutral-800 mb-2">プライベート空間</h3>
              <p className="text-neutral-600 text-sm leading-relaxed">
                他のお客様を気にすることなく、リラックスした雰囲気の中でレッスンを受けていただけます。初めての方も安心してお越しください。
              </p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-neutral-800 mb-2">柔軟なスケジュール</h3>
              <p className="text-neutral-600 text-sm leading-relaxed">
                オンラインで24時間いつでも予約可能。ご都合の良い日時をお選びいただけます。キャンセルも前日まで受け付けています。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-primary-50 py-16">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold text-neutral-800 mb-4">まずは体験レッスンから</h2>
          <p className="text-neutral-600 mb-8">
            ピラティスが初めての方も大歓迎。お気軽にご予約ください。
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

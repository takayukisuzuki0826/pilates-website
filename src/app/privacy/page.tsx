export const metadata = {
  title: "プライバシーポリシー",
};

export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold text-neutral-800 mb-8 text-center">プライバシーポリシー</h1>

      <div className="prose prose-neutral max-w-none space-y-8 text-sm leading-relaxed text-neutral-600">
        <section>
          <h2 className="text-lg font-semibold text-neutral-800 mb-3">1. 個人情報の収集について</h2>
          <p>
            当スタジオでは、予約の受付およびレッスンの提供にあたり、以下の個人情報を収集させていただく場合がございます。
          </p>
          <ul className="list-disc list-inside space-y-1 mt-2">
            <li>お名前</li>
            <li>メールアドレス</li>
            <li>電話番号</li>
            <li>お身体の状態に関する情報（任意でご記入いただいた場合）</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-neutral-800 mb-3">2. 個人情報の利用目的</h2>
          <p>収集した個人情報は、以下の目的で利用いたします。</p>
          <ul className="list-disc list-inside space-y-1 mt-2">
            <li>レッスンの予約確認・変更・キャンセルのご連絡</li>
            <li>レッスン前日のリマインダーメール送信</li>
            <li>スタジオの場所に関するご案内</li>
            <li>レッスン内容の記録・改善</li>
            <li>お問い合わせへの対応</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-neutral-800 mb-3">3. 個人情報の第三者提供</h2>
          <p>
            お客様の個人情報を、ご本人の同意なく第三者に提供することはありません。
            ただし、法令に基づく場合を除きます。
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-neutral-800 mb-3">4. 個人情報の管理</h2>
          <p>
            お客様の個人情報は、不正アクセス・紛失・漏えい等を防止するため、適切なセキュリティ対策を講じて管理いたします。
            予約データはGoogle Calendarおよびスプレッドシートに保存され、アクセスはインストラクターのみに限定されています。
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-neutral-800 mb-3">5. 住所情報の取り扱い</h2>
          <p>
            当スタジオは個人宅で運営しているため、住所はWebサイト上に公開しておりません。
            ご予約確定後に、メールにてスタジオの場所をご案内いたします。
            住所情報はレッスン前後の限られた時間のみ閲覧可能で、検索エンジンにインデックスされないよう設定しています。
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-neutral-800 mb-3">6. Cookie（クッキー）について</h2>
          <p>
            当サイトでは、予約機能の提供に必要な最低限のCookieを使用する場合があります。
            トラッキング目的のCookieは使用しておりません。
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-neutral-800 mb-3">7. お問い合わせ</h2>
          <p>
            個人情報の取り扱いに関するお問い合わせは、下記までご連絡ください。
          </p>
          <p className="mt-2">
            {/* メールアドレスをここに入力 */}
            メール：info@example.com
          </p>
        </section>

        <p className="text-neutral-500 text-xs mt-8">
          制定日：2026年○月○日
        </p>
      </div>
    </div>
  );
}

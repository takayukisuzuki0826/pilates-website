import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-neutral-50 border-t border-neutral-200 mt-auto">
      <div className="max-w-5xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-primary-700 font-semibold text-lg mb-3">Pilates Studio</h3>
            <p className="text-neutral-600 text-sm leading-relaxed">
              一人ひとりに寄り添う
              <br />
              プライベートピラティススタジオ
            </p>
          </div>

          <div>
            <h4 className="text-neutral-800 font-medium mb-3 text-sm">メニュー</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-neutral-600 hover:text-primary-600 text-sm transition-colors">
                  スタジオ紹介
                </Link>
              </li>
              <li>
                <Link href="/lessons" className="text-neutral-600 hover:text-primary-600 text-sm transition-colors">
                  レッスン・料金
                </Link>
              </li>
              <li>
                <Link href="/booking" className="text-neutral-600 hover:text-primary-600 text-sm transition-colors">
                  ご予約
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-neutral-800 font-medium mb-3 text-sm">その他</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/privacy" className="text-neutral-600 hover:text-primary-600 text-sm transition-colors">
                  プライバシーポリシー
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-neutral-200 mt-8 pt-6 text-center">
          <p className="text-neutral-500 text-xs">&copy; {new Date().getFullYear()} Pilates Studio. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

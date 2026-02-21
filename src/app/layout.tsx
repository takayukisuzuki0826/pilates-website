import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: {
    default: "Pilates Studio | プライベートピラティス",
    template: "%s | Pilates Studio",
  },
  description: "一人ひとりに寄り添うプライベートピラティススタジオ。完全予約制のマンツーマンレッスンで、あなたに合ったピラティスを。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}

"use client";

import Link from "next/link";
import { useState } from "react";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-white/90 backdrop-blur-sm border-b border-neutral-200 sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="text-xl font-semibold text-primary-700 tracking-wide">
          Pilates Studio
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6">
          <Link href="/about" className="text-neutral-700 hover:text-primary-600 transition-colors text-sm">
            スタジオ紹介
          </Link>
          <Link href="/lessons" className="text-neutral-700 hover:text-primary-600 transition-colors text-sm">
            レッスン・料金
          </Link>
          <Link
            href="/booking"
            className="bg-primary-500 hover:bg-primary-600 text-white px-5 py-2 rounded-full text-sm font-medium transition-colors"
          >
            予約する
          </Link>
        </nav>

        {/* Mobile menu button */}
        <button
          className="md:hidden p-2 text-neutral-600"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="メニュー"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {isMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <nav className="md:hidden bg-white border-t border-neutral-100 px-4 py-4 space-y-3">
          <Link
            href="/about"
            className="block text-neutral-700 hover:text-primary-600 py-2"
            onClick={() => setIsMenuOpen(false)}
          >
            スタジオ紹介
          </Link>
          <Link
            href="/lessons"
            className="block text-neutral-700 hover:text-primary-600 py-2"
            onClick={() => setIsMenuOpen(false)}
          >
            レッスン・料金
          </Link>
          <Link
            href="/booking"
            className="block bg-primary-500 hover:bg-primary-600 text-white px-5 py-3 rounded-full text-center font-medium transition-colors"
            onClick={() => setIsMenuOpen(false)}
          >
            予約する
          </Link>
        </nav>
      )}
    </header>
  );
}

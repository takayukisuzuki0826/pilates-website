"use client";

import Link from "next/link";
import { useState } from "react";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-neutral-100 sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-6 h-20 flex items-center justify-between">
        <Link href="/" className="text-lg font-medium text-neutral-900 tracking-wider">
          PILATES STUDIO
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8">
          <Link href="/about" className="text-neutral-500 hover:text-neutral-900 transition-colors text-sm font-medium">
            About
          </Link>
          <Link href="/lessons" className="text-neutral-500 hover:text-neutral-900 transition-colors text-sm font-medium">
            Lessons
          </Link>
          <Link
            href="/booking"
            className="bg-neutral-900 hover:bg-neutral-800 text-white px-5 py-2.5 rounded-md text-sm font-medium transition-all"
          >
            Book Now
          </Link>
        </nav>

        {/* Mobile menu button */}
        <button
          className="md:hidden p-2 text-neutral-900"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="メニュー"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {isMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <nav className="md:hidden bg-white border-t border-neutral-100 px-6 py-6 space-y-4 h-screen">
          <Link
            href="/about"
            className="block text-lg font-medium text-neutral-900 py-2 border-b border-neutral-100"
            onClick={() => setIsMenuOpen(false)}
          >
            About
          </Link>
          <Link
            href="/lessons"
            className="block text-lg font-medium text-neutral-900 py-2 border-b border-neutral-100"
            onClick={() => setIsMenuOpen(false)}
          >
            Lessons
          </Link>
          <Link
            href="/booking"
            className="block bg-neutral-900 text-white px-5 py-4 rounded-lg text-center font-medium mt-8"
            onClick={() => setIsMenuOpen(false)}
          >
            Book Now
          </Link>
        </nav>
      )}
    </header>
  );
}

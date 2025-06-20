'use client'; // Menandakan ini adalah Client Component

import Link from 'next/link';
import { useState } from 'react';

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="glass-header sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">
        {/* Menggunakan Link dari next/link untuk navigasi internal */}
        <Link href="/" className="text-xl font-bold text-white">
          Bima Akbar
        </Link>
        <div className="hidden md:flex items-center space-x-8 text-sm font-semibold">
          <Link href="/#blog" className="text-gray-300 hover:text-white transition-colors">Blog</Link>
          <Link href="/#music" className="text-gray-300 hover:text-white transition-colors">Musik</Link>
          <Link href="/#affiliate" className="text-gray-300 hover:text-white transition-colors">Rekomendasi</Link>
          <Link href="/#tentang" className="block py-3 px-4 text-sm text-gray-300 hover:bg-neutral-800">Tentang</Link>
        </div>
        <div className="md:hidden">
          <button
            id="menu-btn"
            className="text-white focus:outline-none"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <i className="ri-menu-3-line text-2xl"></i>
          </button>
        </div>
      </nav>
      {/* Mobile Menu */}
      <div
        id="mobile-menu"
        className={`md:hidden bg-neutral-900/90 backdrop-blur-sm absolute w-full shadow-lg ${isMobileMenuOpen ? '' : 'hidden'}`}
      >
        <Link href="/#blog" className="block py-3 px-4 text-sm text-gray-300 hover:bg-neutral-800" onClick={() => setIsMobileMenuOpen(false)}>Blog</Link>
        <Link href="/#music" className="block py-3 px-4 text-sm text-gray-300 hover:bg-neutral-800" onClick={() => setIsMobileMenuOpen(false)}>Musik</Link>
        <Link href="/#affiliate" className="block py-3 px-4 text-sm text-gray-300 hover:bg-neutral-800" onClick={() => setIsMobileMenuOpen(false)}>Rekomendasi</Link>
        <Link href="/#tentang" className="block py-3 px-4 text-sm text-gray-300 hover:bg-neutral-800" onClick={() => setIsMobileMenuOpen(false)}>Tentang</Link>
      </div>
    </header>
  );
}
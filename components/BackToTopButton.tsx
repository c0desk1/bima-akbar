'use client'; // Menandakan ini adalah Client Component

import { useState, useEffect } from 'react';

export default function BackToTopButton() {
  const [isVisible, setIsVisible] = useState(false);

  // Fungsi untuk menampilkan/menyembunyikan tombol berdasarkan scroll position
  const toggleVisibility = () => {
    if (window.scrollY > 200) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  // Fungsi untuk scroll ke atas
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  // Tambahkan event listener saat komponen dimuat
  useEffect(() => {
    window.addEventListener('scroll', toggleVisibility);
    // Hapus event listener saat komponen di-unmount untuk mencegah memory leak
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []); // [] berarti hanya berjalan sekali saat mount dan unmount

  return (
    <button
      id="back-to-top"
      className={`fixed bottom-6 right-6 bg-indigo-500 text-white w-12 h-12 rounded-full shadow-lg hover:bg-indigo-600 transition-all z-50 justify-center items-center ${isVisible ? 'flex' : 'hidden'}`}
      onClick={scrollToTop}
    >
      <i className="ri-arrow-up-s-line text-2xl"></i>
    </button>
  );
}
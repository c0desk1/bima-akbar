'use client'; // Menandakan ini adalah Client Component

import { useState, useEffect } from 'react';

interface CategoryFiltersProps {
  categories: string[]; // List kategori yang diteruskan dari parent (Server Component)
}

export default function CategoryFilters({ categories }: CategoryFiltersProps) {
  const [activeCategory, setActiveCategory] = useState('all');

  // Efek ini akan berjalan setiap kali `activeCategory` berubah
  useEffect(() => {
    // Ambil semua elemen kartu postingan
    const postCards = document.querySelectorAll('.post-card-item');

    postCards.forEach(card => {
      const cardCategory = card.getAttribute('data-category');
      // Tampilkan atau sembunyikan kartu berdasarkan kategori aktif
      if (activeCategory === 'all' || cardCategory === activeCategory) {
        (card as HTMLElement).style.display = 'block';
      } else {
        (card as HTMLElement).style.display = 'none';
      }
    });
  }, [activeCategory]); // Jalankan ulang efek jika activeCategory berubah

  return (
    <div id="category-filters" className="flex flex-wrap gap-2">
      <button
        className={`category-filter-btn px-3 py-1.5 text-sm font-semibold rounded-full ${activeCategory === 'all' ? 'active bg-indigo-500 text-white' : 'text-gray-300 hover:bg-neutral-700'}`}
        onClick={() => setActiveCategory('all')} // Set kategori aktif ke 'all'
        data-category="all" // Atribut data untuk identifikasi
      >
        Semua
      </button>
      {categories.map(cat => (
        <button
          key={cat} // Key unik untuk setiap item di list React
          className={`category-filter-btn px-3 py-1.5 text-sm font-semibold rounded-full ${activeCategory === cat ? 'active bg-indigo-500 text-white' : 'text-gray-300 hover:bg-neutral-700'}`}
          onClick={() => setActiveCategory(cat)} // Set kategori aktif
          data-category={cat} // Atribut data untuk identifikasi
        >
          {cat}
        </button>
      ))}
    </div>
  );
}
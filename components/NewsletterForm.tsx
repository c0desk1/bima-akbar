'use client'; // Menandakan ini adalah Client Component

import { useState } from 'react';
import { supabase } from '/lib/supabase'; // Impor Supabase client kita

export default function NewsletterForm() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Mencegah refresh halaman
    if (!email.trim()) return;

    setMessage('Memproses...');
    const { error } = await supabase.from('subscribers').insert({ email: email.trim() });

    if (error) {
      // Cek error code 23505 untuk duplicate key (email sudah terdaftar)
      setMessage(error.code === '23505' ? 'Email ini sudah terdaftar!' : 'Gagal mendaftar. Silakan coba lagi.');
      console.error('Newsletter subscription error:', error);
    } else {
      setMessage('Terima kasih telah mendaftar!');
      setEmail(''); // Kosongkan input setelah berhasil
    }
  };

  return (
    <section id="newsletter" className="bg-neutral-900/50 border border-neutral-800 rounded-2xl p-8 md:p-12 flex flex-col lg:flex-row items-center justify-between gap-8">
      <div>
        <h3 className="text-2xl font-bold text-white">Jangan Ketinggalan Update</h3>
        <p className="text-gray-400 mt-2 max-w-lg">Dapatkan notifikasi setiap kali ada konten baru.</p>
      </div>
      <form onSubmit={handleNewsletterSubmit} className="w-full lg:w-auto flex-shrink-0">
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="email"
            id="newsletterEmail"
            required
            placeholder="Masukkan email Anda"
            className="w-full lg:w-80 px-4 py-3 rounded-lg bg-neutral-800 text-white border border-neutral-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={email} // Mengikat input ke state email
            onChange={(e) => setEmail(e.target.value)} // Update state saat input berubah
          />
          <button
            type="submit"
            className="bg-indigo-500 text-white font-semibold py-3 px-6 rounded-lg hover:bg-indigo-600 transition-colors"
          >
            Daftar
          </button>
        </div>
        {/* Menampilkan pesan status */}
        <p id="newsletterMessage" className="text-xs mt-2 h-4 text-center sm:text-left text-indigo-400">{message}</p>
      </form>
    </section>
  );
}
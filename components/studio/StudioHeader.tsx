import Link from 'next/link';
import React from 'react';

export default function StudioHeader() {
  return (
    <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
      <div>
        <Link href="/dashboard" className="text-sm text-slate-400 hover:text-white flex items-center mb-2">
          <i className="ri-arrow-left-s-line mr-1"></i> Kembali ke Dashboard
        </Link>
        <h1 className="text-4xl font-extrabold text-white">Content Studio</h1>
      </div>
      <Link href="/post-add" className="bg-indigo-500 text-white font-bold py-2 px-4 rounded-xl shadow-lg hover:bg-indigo-600 flex items-center mt-4 sm:mt-0">
        <i className="ri-add-circle-fill mr-2"></i>Buat Postingan Baru
      </Link>
    </header>
  );
}
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { supabase } from '/lib/supabase';
import GlassCard from '/components/GlassCard';

interface AffiliateLink {
  id: string;
  product_name: string;
  category: string | null;
  product_url: string;
  product_image_url: string | null;
}

export default function AffiliatesPanel() {
  const [affiliateList, setAffiliateList] = useState<AffiliateLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadAffiliates = useCallback(async () => {
    setLoading(true);
    setError(null);
    const { data, error: fetchError } = await supabase.from('affiliate_links').select('*').order('created_at', { ascending: false });
    if (fetchError) {
      setError('Gagal memuat link afiliasi.');
      console.error('Error fetching affiliate links:', fetchError);
    } else if (data) {
      setAffiliateList(data);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    loadAffiliates();
  }, [loadAffiliates]);

  const handleAddAffiliate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const affiliateData = Object.fromEntries(formData.entries());

    const { error: insertError } = await supabase.from('affiliate_links').insert(affiliateData);
    if (insertError) {
      alert('Gagal menambahkan link afiliasi.');
      console.error('Error adding affiliate link:', insertError);
    } else {
      e.currentTarget.reset(); // Reset form
      loadAffiliates(); // Reload list
    }
  };

  const handleDeleteAffiliate = async (id: string) => {
    if (confirm('Yakin ingin menghapus link afiliasi ini?')) {
      const { error: deleteError } = await supabase.from('affiliate_links').delete().eq('id', id);
      if (deleteError) {
        alert('Gagal menghapus link afiliasi.');
        console.error('Error deleting affiliate link:', deleteError);
      } else {
        loadAffiliates(); // Reload list
      }
    }
  };

  return (
    <GlassCard>
      <h2 className="text-xl font-semibold text-white mb-4">Tambah Link Afiliasi Baru</h2>
      <form id="addAffiliateForm" onSubmit={handleAddAffiliate} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <input name="product_name" required placeholder="Nama Produk" className="form-input p-3" />
        <input name="category" placeholder="Kategori Produk" className="form-input p-3" />
        <input name="product_url" required type="url" placeholder="URL Afiliasi" className="form-input p-3 md:col-span-2" />
        <input name="product_image_url" placeholder="URL Gambar Produk" className="form-input p-3 md:col-span-2" />
        <button type="submit" className="md:col-span-2 bg-indigo-500 text-white font-semibold py-2 px-4 rounded-lg">
          Tambah Link
        </button>
      </form>

      <hr className="border-white/10" />

      <h2 className="text-xl font-semibold text-white mt-6 mb-4">Daftar Link</h2>
      <div id="affiliateList" className="space-y-3">
        {loading ? (
          <p className="text-slate-500">Memuat...</p>
        ) : error ? (
          <p className="text-red-400">{error}</p>
        ) : affiliateList.length === 0 ? (
          <p className="text-slate-500">Belum ada rekomendasi.</p>
        ) : (
          affiliateList.map((item) => (
            <div key={item.id} className="p-3 bg-neutral-800/50 rounded-lg flex justify-between items-center">
              <div className="flex items-center gap-4">
                <Image
                  src={item.product_image_url || 'https://via.placeholder.com/40'}
                  alt={item.product_name}
                  width={40}
                  height={40}
                  className="w-10 h-10 rounded-md object-cover"
                />
                <p className="font-semibold text-white">{item.product_name}</p>
              </div>
              <button onClick={() => handleDeleteAffiliate(item.id)} className="text-slate-500 hover:text-red-500">
                <i className="ri-delete-bin-line"></i>
              </button>
            </div>
          ))
        )}
      </div>
    </GlassCard>
  );
}

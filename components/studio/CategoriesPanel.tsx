'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '/lib/supabase';
import GlassCard from '/components/GlassCard';

interface Category {
  id: string;
  name: string;
}

export default function CategoriesPanel() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadCategories = useCallback(async () => {
    setLoading(true);
    setError(null);
    const { data, error: fetchError } = await supabase.from('categories').select('id, name').order('name');
    if (fetchError) {
      setError('Gagal memuat kategori.');
      console.error('Error fetching categories:', fetchError);
    } else if (data) {
      setCategories(data);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;

    const { error: insertError } = await supabase.from('categories').insert({ name: newCategoryName.trim() });
    if (insertError) {
      alert('Gagal menambahkan kategori.');
      console.error('Error adding category:', insertError);
    } else {
      setNewCategoryName(''); // Clear input
      loadCategories(); // Reload categories
    }
  };

  const handleDeleteCategory = async (id: string) => {
    if (confirm('Yakin ingin hapus kategori ini?')) {
      const { error: deleteError } = await supabase.from('categories').delete().eq('id', id);
      if (deleteError) {
        alert('Gagal menghapus kategori.');
        console.error('Error deleting category:', deleteError);
      } else {
        loadCategories(); // Reload categories
      }
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <GlassCard>
        <h2 className="text-xl font-semibold text-white mb-4">Tambah Kategori</h2>
        <form onSubmit={handleAddCategory} className="flex gap-2">
          <input
            id="newCategoryName"
            type="text"
            required
            placeholder="Nama kategori baru"
            className="flex-grow p-2 bg-neutral-800 text-white rounded-lg outline-none form-input focus:ring-2 focus:ring-indigo-500"
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
          />
          <button type="submit" className="bg-indigo-500 text-white font-semibold p-2 rounded-lg">
            <i className="ri-add-line"></i>
          </button>
        </form>
      </GlassCard>

      <GlassCard>
        <h2 className="text-xl font-semibold text-white mb-4">Daftar Kategori</h2>
        <div id="categoryList" className="space-y-2">
          {loading ? (
            <p className="text-slate-500">Memuat...</p>
          ) : error ? (
            <p className="text-red-400">{error}</p>
          ) : categories.length === 0 ? (
            <p className="text-slate-500">Tidak ada kategori.</p>
          ) : (
            categories.map((cat) => (
              <div key={cat.id} className="p-2 bg-neutral-800/50 rounded-md flex justify-between items-center text-sm">
                <span className="text-slate-300">{cat.name}</span>
                <button onClick={() => handleDeleteCategory(cat.id)} className="text-slate-500 hover:text-red-500">
                  <i className="ri-delete-bin-line"></i>
                </button>
              </div>
            ))
          )}
        </div>
      </GlassCard>
    </div>
  );
}
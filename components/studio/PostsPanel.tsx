'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { supabase } from '/lib/supabase'; // Impor Supabase client
import GlassCard from '/components/GlassCard';

interface Post {
  id: string;
  title: string;
  published: boolean;
  slug: string;
}

export default function PostsPanel() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentFilter, setCurrentFilter] = useState<'all' | 'published' | 'draft'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const loadPosts = useCallback(async () => {
    setLoading(true);
    setError(null);
    let query = supabase.from('posts').select('id, title, published, slug').order('created_at', { ascending: false });

    if (currentFilter === 'published') query = query.eq('published', true);
    if (currentFilter === 'draft') query = query.eq('published', false);
    if (searchTerm) query = query.ilike('title', `%${searchTerm}%`);

    const { data, error: fetchError } = await query;

    if (fetchError) {
      setError('Gagal memuat postingan.');
      console.error('Error fetching posts:', fetchError);
    } else if (data) {
      setPosts(data);
    }
    setLoading(false);
  }, [currentFilter, searchTerm]); // Dependensi untuk useCallback

  useEffect(() => {
    loadPosts();
  }, [loadPosts]); // Panggil loadPosts saat dependensi berubah

  const handleDeletePost = async (id: string) => {
    if (confirm('Yakin ingin hapus postingan ini?')) {
      const { error: deleteError } = await supabase.from('posts').delete().eq('id', id);
      if (deleteError) {
        alert('Gagal menghapus postingan.');
        console.error('Error deleting post:', deleteError);
      } else {
        loadPosts(); // Muat ulang daftar setelah penghapusan
      }
    }
  };

  return (
    <GlassCard>
      <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
        <div id="filter-buttons" className="flex items-center space-x-1 bg-neutral-800 p-1 rounded-lg">
          <button
            data-filter="all"
            className={`filter-btn px-4 py-1.5 text-sm font-semibold rounded-md transition ${currentFilter === 'all' ? 'active bg-indigo-500' : 'text-slate-400'}`}
            onClick={() => setCurrentFilter('all')}
          >
            Semua
          </button>
          <button
            data-filter="published"
            className={`filter-btn px-4 py-1.5 text-sm font-semibold rounded-md transition ${currentFilter === 'published' ? 'active bg-indigo-500' : 'text-slate-400'}`}
            onClick={() => setCurrentFilter('published')}
          >
            Published
          </button>
          <button
            data-filter="draft"
            className={`filter-btn px-4 py-1.5 text-sm font-semibold rounded-md transition ${currentFilter === 'draft' ? 'active bg-indigo-500' : 'text-slate-400'}`}
            onClick={() => setCurrentFilter('draft')}
          >
            Draft
          </button>
        </div>
        <div className="relative">
          <i className="ri-search-line absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"></i>
          <input
            id="searchInput"
            type="search"
            placeholder="Cari postingan..."
            className="w-full md:w-64 pl-10 pr-4 py-2 bg-neutral-800 text-white border border-transparent rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      <div id="postList" className="space-y-3">
        {loading ? (
          <p className="text-center text-slate-500 p-10">Memuat...</p>
        ) : error ? (
          <p className="text-red-400 text-center">{error}</p>
        ) : posts.length === 0 ? (
          <p className="text-slate-500 text-center p-10">Tidak ada postingan.</p>
        ) : (
          posts.map((post) => (
            <div key={post.id} className="p-3 bg-neutral-900/50 rounded-lg flex justify-between items-center">
              <div>
                <p className="font-semibold text-white">{post.title}</p>
                <p className={`text-xs ${post.published ? 'text-green-400' : 'text-amber-400'}`}>
                  {post.published ? 'Published' : 'Draft'}
                </p>
              </div>
              <div className="flex items-center space-x-2 text-lg">
                <a href={`/post/${post.slug}`} target="_blank" rel="noopener noreferrer" title="Lihat Post" className="text-slate-400 hover:text-indigo-400">
                  <i className="ri-eye-line"></i>
                </a>
                <Link href={`/post-add?id=${post.id}`} title="Edit Post" className="text-slate-400 hover:text-indigo-400">
                  <i className="ri-pencil-line"></i>
                </Link>
                <button onClick={() => handleDeletePost(post.id)} title="Hapus Post" className="text-slate-400 hover:text-red-500">
                  <i className="ri-delete-bin-line"></i>
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </GlassCard>
  );
}
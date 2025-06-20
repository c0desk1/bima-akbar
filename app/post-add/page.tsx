'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '/lib/supabase';
import { useRouter, useSearchParams } from 'next/navigation';
import GlassCard from '/components/GlassCard';
import Link from 'next/link';

interface PostFormData {
  title: string;
  content: string; // Misal pakai textarea biasa untuk awal, nanti bisa pakai rich text editor
  thumbnail_url: string;
  category: string;
  published: boolean;
  slug: string;
}

export default function PostAddPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const postId = searchParams.get('id'); // Ambil ID dari URL jika ada
  const [post, setPost] = useState<PostFormData>({
    title: '',
    content: '',
    thumbnail_url: '',
    category: '',
    published: false,
    slug: '',
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);

  useEffect(() => {
    // Load categories
    const loadCategories = async () => {
      const { data, error } = await supabase.from('categories').select('id, name');
      if (data) setCategories(data);
      if (error) console.error("Error loading categories:", error);
    };
    loadCategories();

    // Load post data if editing
    if (postId) {
      const fetchPost = async () => {
        setLoading(true);
        const { data, error } = await supabase.from('posts').select('*').eq('id', postId).single();
        if (data) {
          setPost({
            title: data.title,
            content: data.content,
            thumbnail_url: data.thumbnail_url || '',
            category: data.category || '',
            published: data.published,
            slug: data.slug,
          });
        } else {
          setMessage('Postingan tidak ditemukan.');
          console.error("Error fetching post for edit:", error);
        }
        setLoading(false);
      };
      fetchPost();
    }
  }, [postId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;
    setPost(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));

    // Otomatis generate slug jika title berubah dan ini adalah post baru
    if (name === 'title' && !postId) {
        setPost(prev => ({
            ...prev,
            slug: value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-*|-*$/g, '')
        }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('Menyimpan...');

    let error;
    if (postId) {
      // Update existing post
      ({ error } = await supabase.from('posts').update(post).eq('id', postId));
    } else {
      // Insert new post
      ({ error } = await supabase.from('posts').insert(post));
    }

    if (error) {
      setMessage(`Gagal menyimpan: ${error.message}`);
      console.error('Error saving post:', error);
    } else {
      setMessage('Postingan berhasil disimpan!');
      router.push('/studio'); // Redirect ke halaman studio setelah simpan
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="max-w-screen-xl mx-auto">
        <header className="mb-8">
            <Link href="/studio" className="text-sm text-slate-400 hover:text-white flex items-center mb-2"><i className="ri-arrow-left-s-line mr-1"></i> Kembali ke Content Studio</Link>
            <h1 className="text-4xl font-extrabold text-white">{postId ? 'Edit Postingan' : 'Buat Postingan Baru'}</h1>
        </header>

        <GlassCard>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-1">Judul Postingan</label>
              <input
                type="text"
                id="title"
                name="title"
                value={post.title}
                onChange={handleChange}
                required
                className="form-input w-full p-3"
              />
            </div>
            <div>
                <label htmlFor="slug" className="block text-sm font-medium text-gray-300 mb-1">Slug (URL)</label>
                <input
                    type="text"
                    id="slug"
                    name="slug"
                    value={post.slug}
                    onChange={handleChange}
                    required
                    className="form-input w-full p-3"
                />
                <p className="text-xs text-gray-500 mt-1">Ini akan menjadi bagian dari URL postingan Anda.</p>
            </div>
            <div>
              <label htmlFor="content" className="block text-sm font-medium text-gray-300 mb-1">Konten Postingan</label>
              <textarea
                id="content"
                name="content"
                value={post.content}
                onChange={handleChange}
                rows={15}
                className="form-input w-full p-3"
              ></textarea>
              <p className="text-xs text-gray-500 mt-1">Anda bisa menggunakan HTML dasar di sini.</p>
              {/* Nanti bisa diintegrasikan dengan Rich Text Editor seperti TinyMCE atau QuillJS */}
            </div>
            <div>
              <label htmlFor="thumbnail_url" className="block text-sm font-medium text-gray-300 mb-1">URL Thumbnail</label>
              <input
                type="url"
                id="thumbnail_url"
                name="thumbnail_url"
                value={post.thumbnail_url}
                onChange={handleChange}
                className="form-input w-full p-3"
              />
              <p className="text-xs text-gray-500 mt-1">URL gambar untuk thumbnail postingan.</p>
            </div>
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-300 mb-1">Kategori</label>
              <select
                id="category"
                name="category"
                value={post.category}
                onChange={handleChange}
                className="form-input w-full p-3"
              >
                <option value="">Pilih Kategori</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.name}>{cat.name}</option>
                ))}
              </select>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="published"
                name="published"
                checked={post.published}
                onChange={handleChange}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label htmlFor="published" className="ml-2 block text-sm text-gray-300">Publikasikan</label>
            </div>
            <button
              type="submit"
              className="bg-indigo-500 text-white font-bold py-3 px-6 rounded-lg hover:bg-indigo-600 transition-colors"
              disabled={loading}
            >
              {loading ? 'Menyimpan...' : (postId ? 'Update Postingan' : 'Buat Postingan')}
            </button>
            {message && <p className="mt-4 text-sm text-indigo-400">{message}</p>}
          </form>
        </GlassCard>
      </div>
    </div>
  );
}
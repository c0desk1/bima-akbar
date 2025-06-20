'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { supabase } from '/lib/supabase';
import GlassCard from '/components/GlassCard';

interface MusicRelease {
  id: string;
  song_title: string;
  release_date: string;
  cover_art_url: string | null;
  spotify_url: string | null;
  apple_music_url: string | null;
}

export default function MusicPanel() {
  const [musicList, setMusicList] = useState<MusicRelease[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadMusic = useCallback(async () => {
    setLoading(true);
    setError(null);
    const { data, error: fetchError } = await supabase.from('music_releases').select('*').order('release_date', { ascending: false });
    if (fetchError) {
      setError('Gagal memuat rilisan musik.');
      console.error('Error fetching music releases:', fetchError);
    } else if (data) {
      setMusicList(data);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    loadMusic();
  }, [loadMusic]);

  const handleAddMusic = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const musicData = Object.fromEntries(formData.entries());

    const { error: insertError } = await supabase.from('music_releases').insert(musicData);
    if (insertError) {
      alert('Gagal menambahkan musik.');
      console.error('Error adding music:', insertError);
    } else {
      e.currentTarget.reset(); // Reset form
      loadMusic(); // Reload list
    }
  };

  const handleDeleteMusic = async (id: string) => {
    if (confirm('Yakin ingin hapus rilisan musik ini?')) {
      const { error: deleteError } = await supabase.from('music_releases').delete().eq('id', id);
      if (deleteError) {
        alert('Gagal menghapus musik.');
        console.error('Error deleting music:', deleteError);
      } else {
        loadMusic(); // Reload list
      }
    }
  };

  return (
    <GlassCard>
      <h2 className="text-xl font-semibold text-white mb-4">Tambah Rilisan Musik Baru</h2>
      <form id="addMusicForm" onSubmit={handleAddMusic} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <input name="song_title" required placeholder="Judul Lagu" className="form-input p-3" />
        <input name="release_date" type="date" className="form-input p-3" />
        <input name="cover_art_url" placeholder="URL Cover Art" className="form-input p-3" />
        <input name="spotify_url" type="url" placeholder="URL Spotify" className="form-input p-3" />
        <input name="apple_music_url" type="url" placeholder="URL Apple Music" className="form-input p-3 md:col-span-2" />
        <button type="submit" className="md:col-span-2 bg-indigo-500 text-white font-semibold py-2 px-4 rounded-lg">
          Tambah Musik
        </button>
      </form>

      <hr className="border-white/10" />

      <h2 className="text-xl font-semibold text-white mt-6 mb-4">Daftar Rilisan</h2>
      <div id="musicList" className="space-y-3">
        {loading ? (
          <p className="text-slate-500">Memuat...</p>
        ) : error ? (
          <p className="text-red-400">{error}</p>
        ) : musicList.length === 0 ? (
          <p className="text-slate-500">Belum ada rilisan musik.</p>
        ) : (
          musicList.map((item) => (
            <div key={item.id} className="p-3 bg-neutral-800/50 rounded-lg flex justify-between items-center">
              <div className="flex items-center gap-4">
                <Image
                  src={item.cover_art_url || 'https://via.placeholder.com/40'}
                  alt={item.song_title}
                  width={40}
                  height={40}
                  className="w-10 h-10 rounded-md object-cover"
                />
                <p className="font-semibold text-white">{item.song_title}</p>
              </div>
              <button onClick={() => handleDeleteMusic(item.id)} className="text-slate-500 hover:text-red-500">
                <i className="ri-delete-bin-line"></i>
              </button>
            </div>
          ))
        )}
      </div>
    </GlassCard>
  );
}
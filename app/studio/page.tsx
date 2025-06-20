'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'; // Untuk redirect
import { supabase } from '/lib/supabase'; // Import Supabase client

// Komponen-komponen UI
import StudioHeader from '/components/studio/StudioHeader';
import TabsNavigation from '/components/studio/TabsNavigation';
import PostsPanel from '/components/studio/PostsPanel';
import CategoriesPanel from '/components/studio/CategoriesPanel';
import MusicPanel from '/components/studio/MusicPanel';
import AffiliatesPanel from '/components/studio/AffiliatesPanel';

export default function ContentStudioPage() {
  const [activeTab, setActiveTab] = useState('posts'); // State untuk tab aktif
  const [loadingInitial, setLoadingInitial] = useState(true); // Untuk loading awal
  const router = useRouter(); // Inisialisasi router

  useEffect(() => {
    // Cek sesi Supabase saat komponen dimuat
    const checkSession = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error || !session) {
        // Jika tidak ada sesi, redirect ke halaman login
        router.push('/login'); // Pastikan kamu punya halaman login.tsx
      } else {
        setLoadingInitial(false);
      }
    };
    checkSession();

    // Pastikan fade-in transisi halaman
    const mainContent = document.getElementById('mainContent');
    if (mainContent) {
      mainContent.classList.remove('opacity-0');
    }
  }, [router]); // Dependensi router agar efek berjalan saat router berubah

  if (loadingInitial) {
    // Tampilkan loading spinner atau pesan sementara saat cek sesi
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] text-white">
        <p>Memuat...</p>
      </div>
    );
  }

  return (
    <div id="mainContent" className="min-h-screen p-4 sm:p-6 lg:p-8 transition-opacity duration-500">
      <div className="max-w-screen-xl mx-auto">
        <StudioHeader />

        <TabsNavigation activeTab={activeTab} onTabChange={setActiveTab} />

        <div id="tab-content">
          {activeTab === 'posts' && <PostsPanel />}
          {activeTab === 'categories' && <CategoriesPanel />}
          {activeTab === 'music' && <MusicPanel />}
          {activeTab === 'affiliates' && <AffiliatesPanel />}
        </div>
      </div>
    </div>
  );
}
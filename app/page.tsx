// Next.js components and utilities
import Link from 'next/link';
import Image from 'next/image'; // Gunakan next/image untuk optimasi gambar
import { Suspense } from 'react'; // Untuk fallback loading saat client component di-load
import DOMPurify from 'isomorphic-dompurify';

// Our custom components
import Header from '/components/Header';
import BackToTopButton from '/components/BackToTopButton';
import NewsletterForm from '/components/NewsletterForm';
import CategoryFilters from '/components/CategoryFilters';

// Supabase client
import { supabase } from '/lib/supabase';

// --- Type Definitions (sesuai skema Supabase kamu) ---
interface Post {
  id: string;
  slug: string;
  title: string;
  content: string; // Bisa berisi HTML
  thumbnail_url: string | null;
  category: string | null;
  views: number | null;
  is_featured: boolean | null;
  created_at: string;
}

interface MusicRelease {
  id: string;
  song_title: string;
  cover_art_url: string | null;
  release_date: string;
  spotify_url: string | null;
}

interface AffiliateLink {
  id: string;
  product_name: string;
  product_image_url: string | null;
  product_url: string;
  category: string | null;
}

// Helper function untuk membuat excerpt (kutipan) dari HTML
function createExcerpt(html: string, maxLength = 150): string {
  // Gunakan DOMPurify untuk membersihkan HTML terlebih dahulu
  const sanitizedHtml = DOMPurify.sanitize(html, { USE_PROFILES: { html: true } });

  // Buat elemen div sementara di lingkungan Node.js (Server Component)
  const text = sanitizedHtml.replace(/<[^>]*>/g, '');

  // Ambil text content-nya
  const tempFragment = DOMPurify.sanitize(html, { RETURN_DOM_FRAGMENT: true });
  const extractedText = tempFragment.textContent || '';

  // Potong jika terlalu panjang
  return extractedText.length <= maxLength ? extractedText : extractedText.substring(0, maxLength) + '...';
}

export default async function HomePage() {
  // --- Data Fetching (Server Component) ---
  // Fetch Posts
  const { data: allPosts, error: postsError } = await supabase
    .from('posts')
    .select('*')
    .eq('published', true)
    .order('created_at', { ascending: false });

  let featuredPost: Post | undefined;
  let otherPosts: Post[] = [];

  if (postsError) {
    console.error('Error fetching posts:', postsError);
  } else if (allPosts && allPosts.length > 0) {
    featuredPost = allPosts.find(p => p.is_featured === true) || allPosts[0];
    otherPosts = allPosts.filter(p => p.id !== featuredPost?.id);
  }

  // Fetch Music Releases
  const { data: musicReleases, error: musicError } = await supabase
    .from('music_releases')
    .select('*')
    .order('release_date', { ascending: false });

  if (musicError) {
    console.error('Error fetching music releases:', musicError);
  }

  // Fetch Affiliate Links
  const { data: affiliateLinks, error: affiliateError } = await supabase
    .from('affiliate_links')
    .select('*')
    .order('created_at', { ascending: false });

  if (affiliateError) {
    console.error('Error fetching affiliate links:', affiliateError);
  }

  // Fetch Categories (untuk filter)
  const { data: categories, error: categoriesError } = await supabase
    .from('categories')
    .select('name');

  if (categoriesError) {
    console.error('Error fetching categories:', categoriesError);
  }
  const categoryNames = categories?.map(c => c.name) || [];

  return (
    <>
      <Header />

      <section className="relative py-24 md:py-40 bg-black text-center px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-900/50 to-transparent"></div>
        <div className="relative z-10 max-w-4xl mx-auto">
          <h1 className="text-5xl sm:text-7xl lg:text-8xl font-extrabold text-white leading-tight mb-6 tracking-tighter animate-fade-in-up">Bima Akbar</h1>
          <p className="text-xl sm:text-2xl text-gray-400 mx-auto animate-fade-in-up animation-delay-200">Kreator Digital. Produser Musik.</p>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        <section className="mb-16">
          <form action="/search" method="GET" className="relative"> {/* Ganti action ke path Next.js */}
            <input type="search" name="q" placeholder="Cari artikel, musik, atau produk..." className="w-full pl-5 pr-12 py-4 rounded-full bg-neutral-900 text-white border border-neutral-700 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 bg-indigo-500 text-white w-10 h-10 rounded-full hover:bg-indigo-600 transition-colors">
              <i className="ri-search-line"></i>
            </button>
          </form>
        </section>

        {/* Featured Post Section */}
        {featuredPost && (
          <section id="featured-post" className="mb-20">
            {/* Menggunakan Link dari next/link */}
            <Link href={`/post/${featuredPost.slug}`} className="block group grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div className="overflow-hidden rounded-2xl aspect-video md:aspect-auto">
                {/* Menggunakan Image dari next/image untuk optimasi */}
                <Image
                  src={featuredPost.thumbnail_url || 'https://via.placeholder.com/800x600/18181b/18181b.png'}
                  alt={featuredPost.title}
                  width={800} // Lebar default
                  height={600} // Tinggi default
                  className="post-card-img w-full h-full object-cover transition-transform duration-300"
                  priority // Muat gambar ini lebih awal
                />
              </div>
              <div>
                <p className="font-semibold text-indigo-400 text-sm uppercase">{featuredPost.category || 'Featured'}</p>
                <h3 className="mt-2 text-3xl md:text-4xl font-extrabold text-white group-hover:text-indigo-400 transition-colors">{featuredPost.title}</h3>
                <p className="mt-4 text-gray-400">{createExcerpt(featuredPost.content, 150)}</p>
                <p className="text-xs text-gray-500 mt-4">{featuredPost.views || 0} views</p>
              </div>
            </Link>
          </section>
        )}

        {/* Ad Slot 1 - Ini adalah placeholder. Script iklan langsung di layout.tsx */}
        <div className="ad-slot my-12 flex justify-center w-full h-[90px] text-center p-2">
            <p>Slot Iklan 728x90 (Ini adalah placeholder)</p>
            {/* Real ad scripts are in layout.tsx using <Script> component */}
        </div>

        <section id="blog" className="mb-20">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <h2 className="text-3xl font-bold text-white">Tulisan Terbaru</h2>
            {/* CategoryFilters adalah Client Component, bungkus dengan Suspense */}
            <Suspense fallback={<div>Memuat kategori...</div>}>
                <CategoryFilters categories={categoryNames} />
            </Suspense>
          </div>
          <div id="posts-grid" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {otherPosts.length > 0 ? (
              otherPosts.map(post => (
                <Link href={`/post/${post.slug}`} key={post.id} className="post-card-item bg-neutral-900/50 border border-neutral-800 rounded-2xl overflow-hidden block group" data-category={post.category || 'tanpa-kategori'}>
                  <div className="overflow-hidden h-48">
                    <Image
                      src={post.thumbnail_url || 'https://via.placeholder.com/400x300/18181b/18181b.png'}
                      alt={post.title}
                      width={400}
                      height={300}
                      className="post-card-img w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-6">
                    <h4 className="font-bold text-lg text-white group-hover:text-indigo-400">{post.title}</h4>
                    <p className="text-xs text-gray-500 mt-2">{post.views || 0} views</p>
                  </div>
                </Link>
              ))
            ) : (
              <p className="col-span-full text-center text-slate-500">Tidak ada tulisan lain saat ini.</p>
            )}
          </div>
        </section>

        <section id="music" className="mb-20">
          <h2 className="text-3xl font-bold text-white mb-8">Rilisan Musik</h2>
          <div id="music-grid" className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {musicReleases && musicReleases.length > 0 ? (
              musicReleases.map(music => (
                <a href={music.spotify_url || '#'} target="_blank" rel="noopener noreferrer" key={music.id} className="post-card bg-neutral-900/50 border border-neutral-800 rounded-2xl block group flex items-center gap-4 p-4">
                  <Image
                    src={music.cover_art_url || 'https://via.placeholder.com/64'}
                    alt={music.song_title}
                    width={80} // Width for w-20
                    height={80} // Height for h-20
                    className="w-20 h-20 rounded-md object-cover flex-shrink-0"
                  />
                  <div>
                    <p className="font-semibold text-white group-hover:text-indigo-400">{music.song_title}</p>
                    <p className="text-sm text-gray-500">{new Date(music.release_date).getFullYear()}</p>
                  </div>
                </a>
              ))
            ) : (
              <p className="col-span-full text-center text-slate-500">Belum ada rilisan musik.</p>
            )}
          </div>
        </section>

        <section id="affiliate" className="mb-20">
          <h2 className="text-3xl font-bold text-white mb-8">Rekomendasi Produk</h2>
          <div id="affiliate-grid" className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {affiliateLinks && affiliateLinks.length > 0 ? (
              affiliateLinks.map(item => (
                <a href={item.product_url} target="_blank" rel="noopener noreferrer" key={item.id} className="post-card bg-neutral-900/50 border border-neutral-800 rounded-2xl overflow-hidden block group">
                  <div className="overflow-hidden h-40">
                    <Image
                      src={item.product_image_url || 'https://via.placeholder.com/300'}
                      alt={item.product_name}
                      width={300}
                      height={300}
                      className="post-card-img w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <h4 className="font-semibold text-sm text-white">{item.product_name}</h4>
                    <p className="text-xs text-gray-500">{item.category || ''}</p>
                  </div>
                </a>
              ))
            ) : (
              <p className="col-span-full text-center text-slate-500">Belum ada rekomendasi.</p>
            )}
          </div>
        </section>

        {/* Ad Slot 2 */}
        <div className="ad-slot min-w-[300px] my-12 flex justify-center h-[250px] w-[300px] mx-auto text-center p-2">
            <p>Slot Iklan 300x250 (Ini adalah placeholder)</p>
            {/* Real ad scripts are in layout.tsx using <Script> component */}
        </div>

        <section id="tentang" className="mb-20">
          <div className="bg-neutral-900/50 border border-neutral-800 rounded-2xl p-8 flex flex-col md:flex-row items-center gap-8">
            {/* Menggunakan Image dari next/image */}
            <Image src="/logo.jpg" alt="Bima Akbar" width={128} height={128} className="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover border-4 border-neutral-700" />
            <div>
              <h3 className="text-2xl font-bold text-white">Tentang Saya</h3>
              <p className="mt-2 text-gray-400">Seorang kreator digital dan musik produser. Di sini saya berbagi ide, cerita, dan hal-hal menarik yang saya temukan. Semoga kamu menikmati waktumu di sini.</p>
              <div className="flex gap-4 mt-4 text-xl text-gray-400">
                <a href="https://instagram.com/notmesound" target="_blank" rel="noopener noreferrer" className="hover:text-white" title="Instagram"><i className="ri-instagram-line"></i></a>
                <a href="https://tiktok.com/@bimaakbarmusicc" target="_blank" rel="noopener noreferrer" className="hover:text-white" title="TikTok"><i className="ri-tiktok-line"></i></a>
                <a href="https://youtube.com/@bimaakbarmusic" target="_blank" rel="noopener noreferrer" className="hover:text-white" title="YouTube"><i className="ri-youtube-line"></i></a>
                <a href="https://music.apple.com/ng/artist/bima-akbar/1664218033" target="_blank" rel="noopener noreferrer" className="hover:text-white" title="Apple Music"><i className="ri-apple-line"></i></a>
                <a href="https://open.spotify.com/artist/5ZLO25pWHVvAje7M6rVgUR?si=AdPV97tYSeKBRMCojTs4RQ" target="_blank" rel="noopener noreferrer" className="hover:text-white" title="Spotify"><i className="ri-spotify-line"></i></a>
              </div>
            </div>
          </div>
        </section>

        {/* Newsletter Form adalah Client Component */}
        <NewsletterForm />
      </main>

      <footer className="text-center py-12 border-t border-white/10 mt-20">
        <p className="text-sm text-gray-500">© 2025 Bima Akbar. All Rights Reserved.</p>
      </footer>

      <BackToTopButton />
    </>
  );
}
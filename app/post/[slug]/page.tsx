// src/app/post/[slug]/page.tsx (or app/post/[slug]/page.tsx if no src folder)

import { supabase } from '/lib/supabase';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import DOMPurify from 'isomorphic-dompurify'; // Make sure this is installed: npm install isomorphic-dompurify

import Header from '/components/Header';
import BackToTopButton from '/components/BackToTopButton';

interface Post {
  id: string;
  slug: string;
  title: string;
  content: string; // HTML content
  thumbnail_url: string | null;
  category: string | null;
  views: number | null;
  created_at: string;
}

export async function generateStaticParams() {
  const { data: posts } = await supabase.from('posts').select('slug').eq('published', true);

  return posts?.map((post) => ({
    slug: post.slug,
  })) || [];
}

// PERUBAHAN UTAMA ADA DI BARIS BAWAH INI
export default async function PostPage({ params }: { params: { slug: string } }) {
  // Await the params object before destructuring
  // This is the fix for the "params should be awaited" error
  const { slug } = await params; // <--- UBAH BARIS INI MENJADI `await params;`

  // Fetch post data
  const { data: post, error } = await supabase
    .from('posts')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error || !post) {
    console.error("Error fetching post:", error);
    notFound(); // Next.js built-in 404
  }

  const sanitizedContent = DOMPurify.sanitize(post.content, { USE_PROFILES: { html: true } });

  return (
    <>
      <Header />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 mt-16">
        <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 leading-tight">{post.title}</h1>
        <p className="text-sm text-gray-500 mb-8">
          <span>{post.category || 'Tanpa Kategori'}</span> • <span>{new Date(post.created_at).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}</span> • <span>{post.views || 0} views</span>
        </p>

        {post.thumbnail_url && (
          <div className="mb-8 rounded-lg overflow-hidden">
            <Image
              src={post.thumbnail_url}
              alt={post.title}
              width={1200}
              height={675}
              className="w-full h-auto object-cover"
              priority
            />
          </div>
        )}

        <div className="prose prose-invert max-w-none text-gray-300 leading-relaxed text-lg" dangerouslySetInnerHTML={{ __html: sanitizedContent }}>
        </div>
      </main>
      <BackToTopButton />
    </>
  );
}

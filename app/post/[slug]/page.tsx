import { supabase } from '/lib/supabase'; // Import Supabase client
import { notFound } from 'next/navigation'; // Untuk menampilkan halaman 404
import Image from 'next/image'; // Untuk optimasi gambar
import DOMPurify from 'isomorphic-dompurify'; // Untuk sanitasi HTML

// Komponen layout dan interaktif
import Header from '/components/Header';
import BackToTopButton from '/components/BackToTopButton';

// Type definition untuk Post
interface Post {
  id: string;
  slug: string;
  title: string;
  content: string; // Konten HTML dari postingan
  thumbnail_url: string | null;
  category: string | null;
  views: number | null;
  created_at: string;
}

// Fungsi generateStaticParams (Opsional tapi direkomendasikan untuk blog)
// Ini memungkinkan Next.js untuk pre-render halaman detail post saat build time
export async function generateStaticParams() {
  const { data: posts } = await supabase.from('posts').select('slug').eq('published', true);

  // Return array of { slug: string } objects
  return posts?.map((post) => ({
    slug: post.slug,
  })) || [];
}

type PageProps = {
  params: {
    slug: string
  }
}
export default async function Page({ params }: PageProps) {
  const { slug } = params;

  // Fetch data post berdasarkan slug
  const { data: post, error } = await supabase
    .from('posts')
    .select('*')
    .eq('slug', slug)
    .single(); // Ambil hanya satu hasil

  // Jika ada error atau post tidak ditemukan, tampilkan halaman 404
  if (error || !post) {
    console.error("Error fetching post:", error);
    notFound();
  }

  // Sanitasi konten HTML dari Supabase untuk keamanan (mencegah XSS)
  // DOMPurify akan membersihkan HTML dan hanya menyisakan tag dan atribut yang aman
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
              width={1200} // Sesuaikan dengan ukuran gambar optimal
              height={675} // Sesuaikan dengan rasio aspek gambar
              className="w-full h-auto object-cover"
              priority // Prioritaskan gambar ini untuk loading lebih cepat
            />
          </div>
        )}

        {/* Render konten HTML yang sudah disanitasi */}
        <div className="prose prose-invert max-w-none text-gray-300 leading-relaxed text-lg" dangerouslySetInnerHTML={{ __html: sanitizedContent }}>
          {/* Kelas 'prose' dari Tailwind Typography plugin akan styling konten secara otomatis.
              Jika belum install: npm install -D @tailwindcss/typography */}
        </div>
      </main>
      <BackToTopButton />
    </>
  );
}

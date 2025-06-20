import Link from 'next/link';
import { supabase } from '/lib/supabase'; // Import Supabase client
import { redirect } from 'next/navigation'; // Untuk server-side redirect

// Ini akan menjadi Server Component

export default async function DashboardPage() {
  // Cek sesi Supabase di Server Component
  const { data: { session }, error } = await supabase.auth.getSession();

  if (error || !session) {
    // Jika tidak ada sesi, redirect ke halaman login
    redirect('/login');
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-[#0a0a0a] text-white">
      <h1 className="text-4xl font-extrabold text-white mb-6">Dashboard Admin</h1>
      <p className="text-lg text-gray-400 mb-8">Selamat datang, {session.user.email}!</p>
      <div className="flex flex-col space-y-4">
        <Link href="/studio" className="bg-indigo-500 text-white font-bold py-3 px-6 rounded-lg shadow-lg hover:bg-indigo-600 transition-colors text-center">
          Pergi ke Content Studio
        </Link>
        <button
          onClick={async () => {
            await supabase.auth.signOut();
            redirect('/login');
          }}
          className="bg-red-600 text-white font-bold py-3 px-6 rounded-lg shadow-lg hover:bg-red-700 transition-colors"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
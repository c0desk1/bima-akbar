'use client';

import React, { useState } from 'react';
import { supabase } from '/lib/supabase';
import { useRouter } from 'next/navigation';
import GlassCard from '/components/GlassCard';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setMessage(`Login gagal: ${error.message}`);
      console.error('Login error:', error);
    } else {
      setMessage('Login berhasil! Mengalihkan...');
      router.push('/studio'); // Redirect ke halaman studio setelah login berhasil
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="max-w-md w-full">
        <GlassCard>
          <h2 className="text-3xl font-bold text-white mb-6 text-center">Login ke Content Studio</h2>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">Email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="form-input w-full p-3"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="form-input w-full p-3"
              />
            </div>
            <button
              type="submit"
              className="bg-indigo-500 text-white font-bold py-3 px-6 rounded-lg hover:bg-indigo-600 transition-colors w-full"
              disabled={loading}
            >
              {loading ? 'Memuat...' : 'Login'}
            </button>
            {message && <p className="mt-4 text-sm text-center text-indigo-400">{message}</p>}
          </form>
          <p className="text-sm text-gray-400 text-center mt-6">
            <Link href="/" className="hover:text-white">Kembali ke Beranda</Link>
          </p>
        </GlassCard>
      </div>
    </div>
  );
}
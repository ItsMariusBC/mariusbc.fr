'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLogin() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    });
    setLoading(false);
    if (res.ok) router.push('/admin/dashboard');
    else setError(res.status === 429 ? 'Trop de tentatives, réessaie plus tard.' : 'Mot de passe incorrect.');
  }

  return (
    <div className="min-h-screen bg-[#0f1116] flex items-center justify-center p-4">
      <form onSubmit={onSubmit} className="w-full max-w-sm flex flex-col gap-4 bg-white/5 border border-white/10 rounded-2xl p-8">
        <h1 className="text-white text-xl font-semibold">Admin</h1>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Mot de passe"
          autoFocus
          className="bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white outline-none"
        />
        {error && <p className="text-red-400 text-sm">{error}</p>}
        <button disabled={loading} className="bg-[rgb(157,122,255)] text-white rounded-lg px-4 py-2 font-medium disabled:opacity-50">
          {loading ? '…' : 'Se connecter'}
        </button>
      </form>
    </div>
  );
}

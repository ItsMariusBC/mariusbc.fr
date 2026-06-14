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
    <div className="min-h-screen bg-burgundy flex items-center justify-center p-4">
      <form onSubmit={onSubmit} className="w-full max-w-sm flex flex-col gap-6 border border-bone/20 p-8">
        <h1 className="text-bone text-2xl font-bold uppercase tracking-[0.08em]">Admin</h1>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Mot de passe"
          autoFocus
          className="bg-transparent border border-bone/30 px-4 py-2 text-bone placeholder:text-bone/60 outline-none focus:ring-2 focus:ring-bone focus:border-bone transition-colors"
        />
        {error && <p className="text-bone text-sm">{error}</p>}
        <button
          disabled={loading}
          className="bg-bone text-burgundy uppercase tracking-[0.08em] font-bold px-4 py-2 border border-bone hover:bg-burgundy hover:text-bone transition-colors disabled:opacity-50"
        >
          {loading ? '…' : 'Se connecter'}
        </button>
      </form>
    </div>
  );
}

'use client';

import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Lock } from 'lucide-react';
import { Pinwheel } from '@/components/pinwheel';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function AdminLogin() {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [password, setPassword] = useState('');
  const [reveal, setReveal] = useState(false);
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
    if (res.ok) {
      router.push('/admin/dashboard');
      return;
    }
    setError(
      res.status === 429
        ? 'Trop de tentatives, réessaie plus tard.'
        : 'Mot de passe incorrect.'
    );
    // Refocus + reselect so l'utilisateur peut retaper directement.
    inputRef.current?.focus();
    inputRef.current?.select();
  }

  return (
    <div className="relative flex min-h-[100svh] items-center justify-center overflow-hidden bg-background p-4 text-foreground">
      {/* Fine technical grid in the margins — Swiss texture, never loud. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            'linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />

      <main className="relative w-full max-w-sm">
        {/* Brand mark above the card */}
        <div className="mb-6 flex items-center justify-center gap-2">
          <Pinwheel className="h-6 w-6 text-foreground" />
          <span className="text-sm font-bold uppercase tracking-[0.22em]">mariusbc.fr</span>
        </div>

        <div className="rounded-xl border border-border bg-card text-card-foreground shadow-xl shadow-black/30">
          {/* Header */}
          <div className="border-b border-border px-7 py-6">
            <p className="font-mono text-[0.7rem] uppercase tracking-[0.28em] text-muted-foreground">
              {'// accès restreint'}
            </p>
            <h1 className="mt-1.5 text-2xl font-bold uppercase leading-none tracking-[0.12em]">
              Connexion
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Espace de gestion du site.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={onSubmit} className="flex flex-col gap-4 px-7 py-6" noValidate>
            {error && (
              <p
                role="alert"
                aria-live="assertive"
                className="rounded-md border border-destructive/60 bg-destructive/15 px-3 py-2 text-sm font-medium text-foreground"
              >
                {error}
              </p>
            )}

            <div className="flex flex-col gap-2">
              <Label
                htmlFor="password"
                className="text-xs uppercase tracking-[0.12em] text-muted-foreground"
              >
                Mot de passe
              </Label>
              <div className="relative">
                <Lock className="pointer-events-none absolute inset-y-0 left-3 my-auto h-4 w-4 text-muted-foreground" />
                <Input
                  ref={inputRef}
                  id="password"
                  type={reveal ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  autoFocus
                  autoComplete="current-password"
                  aria-invalid={error ? true : undefined}
                  className="h-11 px-10"
                />
                <button
                  type="button"
                  onClick={() => setReveal((v) => !v)}
                  aria-label={reveal ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
                  aria-pressed={reveal}
                  className="absolute inset-y-0 right-0 flex w-11 items-center justify-center rounded-r-md text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                >
                  {reveal ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="h-11 w-full uppercase tracking-[0.12em]"
            >
              {loading ? 'Connexion…' : 'Se connecter'}
            </Button>
          </form>
        </div>

        <p className="mt-6 text-center font-mono text-[0.7rem] uppercase tracking-[0.2em] text-muted-foreground">
          Marius Biziere Couzinet
        </p>
      </main>
    </div>
  );
}

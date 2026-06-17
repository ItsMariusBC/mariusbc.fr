'use client';

import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff } from 'lucide-react';
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
    <div className="flex min-h-screen items-center justify-center bg-background p-4 text-foreground">
      <main className="w-full max-w-sm">
        {/* Bloc d'en-tête typographique — composition suisse, plat. */}
        <div className="mb-8 border-l-2 border-foreground/30 pl-4">
          <p className="font-mono text-[0.7rem] uppercase tracking-[0.28em] text-muted-foreground">
            {'// 01 — accès restreint'}
          </p>
          <h1 className="mt-2 text-3xl font-bold uppercase leading-none tracking-[0.12em]">
            Admin
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">mariusbc.fr — gestion du site</p>
        </div>

        <form onSubmit={onSubmit} className="flex flex-col gap-4" noValidate>
          {error && (
            <p
              role="alert"
              aria-live="assertive"
              className="rounded-md border border-destructive bg-destructive/15 px-3 py-2 text-sm font-medium text-destructive-foreground"
            >
              {error}
            </p>
          )}

          <div className="flex flex-col gap-2">
            <Label htmlFor="password" className="uppercase tracking-[0.1em] text-muted-foreground">
              Mot de passe
            </Label>
            <div className="relative">
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
                className="h-11 pr-11"
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

          <Button type="submit" disabled={loading} className="h-11 w-full uppercase tracking-[0.1em]">
            {loading ? 'Connexion…' : 'Se connecter'}
          </Button>
        </form>
      </main>
    </div>
  );
}

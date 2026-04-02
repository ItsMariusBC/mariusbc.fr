'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { signIn, useSession } from 'next-auth/react';
import { SparklesText } from '@/components/magicui/sparkles-text';
import { ShinyButton } from '@/components/magicui/shiny-button';
import { Lock, Mail } from 'lucide-react';
import Link from 'next/link';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [adminExists, setAdminExists] = useState<boolean | null>(null);
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    const checkAdminExists = async () => {
      try {
        const response = await fetch('/api/admin-exists');
        const data = await response.json();
        setAdminExists(data.adminExists);
      } catch (error) {
        console.error('Error checking admin existence:', error);
        setAdminExists(false);
      }
    };

    checkAdminExists();
  }, []);

  useEffect(() => {
    if (session) {
      router.push('/admin/dashboard');
    }
  }, [session, router]);

  if (status === 'loading' || adminExists === null) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0f1116] via-[#1a1b26] to-[#0f1116] flex items-center justify-center">
        <div className="text-white/90 text-xl">Chargement...</div>
      </div>
    );
  }

  if (session) {
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError('Email ou mot de passe incorrect');
      } else if (result?.ok) {
        router.push('/admin/dashboard');
      }
    } catch (err) {
      setError('Erreur de connexion');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f1116] via-[#1a1b26] to-[#0f1116] flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.1)_0%,_transparent_65%)]" />

      <div className="w-full max-w-md">
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 shadow-2xl">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 rounded-2xl mb-4">
              <Lock className="w-8 h-8 text-white/90" />
            </div>
            <SparklesText className="text-2xl font-bold text-white/90 mb-2">
              Administration
            </SparklesText>
            <p className="text-white/70">Connectez-vous pour gerer votre site</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-white/90 mb-2">
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-white/50" />
                </div>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="admin@example.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-white/90 mb-2">
                Mot de passe
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-white/50" />
                </div>
                <input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {error && (
              <div className="bg-red-500/20 border border-red-500/30 rounded-xl p-3 text-red-200 text-sm">
                {error}
              </div>
            )}

            <ShinyButton
              type="submit"
              disabled={loading}
              className="w-full text-lg py-3 font-semibold"
              style={{
                "--primary": "rgb(157, 122, 255)",
                "--glow-color": "rgba(157, 122, 255, 0.5)"
              } as React.CSSProperties}
            >
              {loading ? 'Connexion...' : 'Se connecter'}
            </ShinyButton>
          </form>

          {!adminExists && (
            <div className="mt-6 text-center">
              <p className="text-white/60 text-sm">
                Pas encore de compte ?{' '}
                <Link
                  href="/admin/signup"
                  className="text-purple-400 hover:text-purple-300 transition-colors"
                >
                  Creer un compte
                </Link>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

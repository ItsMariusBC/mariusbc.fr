'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ICON_OPTIONS } from '@/lib/dock-icons';
import type { SiteConfig, LinkItem } from '@/lib/config';

export function DashboardEditor({ initial }: { initial: SiteConfig }) {
  const router = useRouter();
  const [contactUrl, setContactUrl] = useState(initial.contactUrl);
  const [links, setLinks] = useState<LinkItem[]>(initial.links);
  const [status, setStatus] = useState('');

  function update(i: number, patch: Partial<LinkItem>) {
    setLinks((prev) => prev.map((l, idx) => (idx === i ? { ...l, ...patch } : l)));
  }
  function remove(i: number) {
    setLinks((prev) => prev.filter((_, idx) => idx !== i));
  }
  function move(i: number, dir: -1 | 1) {
    setLinks((prev) => {
      const next = [...prev];
      const j = i + dir;
      if (j < 0 || j >= next.length) return prev;
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });
  }
  function add() {
    setLinks((prev) => [...prev, { id: crypto.randomUUID(), name: '', icon: 'Globe', url: 'https://', tooltip: '' }]);
  }

  async function save() {
    setStatus('…');
    const res = await fetch('/api/config', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contactUrl, links }),
    });
    if (res.ok) { setStatus('Enregistré'); router.refresh(); }
    else setStatus('Erreur (vérifie les URLs / champs)');
  }

  async function logout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/admin');
  }

  return (
    <div className="min-h-screen bg-[#0f1116] text-white p-6">
      <div className="max-w-2xl mx-auto flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold">Dashboard</h1>
          <button onClick={logout} className="text-sm text-white/60 hover:text-white">Déconnexion</button>
        </div>

        <label className="flex flex-col gap-1">
          <span className="text-sm text-white/60">URL de contact</span>
          <input value={contactUrl} onChange={(e) => setContactUrl(e.target.value)} className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 outline-none" />
        </label>

        <div className="flex flex-col gap-3">
          {links.map((l, i) => (
            <div key={l.id} className="flex flex-wrap gap-2 items-center bg-white/5 border border-white/10 rounded-xl p-3">
              <select value={l.icon} onChange={(e) => update(i, { icon: e.target.value })} className="bg-white/10 border border-white/20 rounded px-2 py-1">
                {ICON_OPTIONS.map((o) => <option key={o.name} value={o.name}>{o.label}</option>)}
              </select>
              <input value={l.name} onChange={(e) => update(i, { name: e.target.value })} placeholder="Nom" className="bg-white/10 border border-white/20 rounded px-2 py-1 flex-1 min-w-24" />
              <input value={l.url} onChange={(e) => update(i, { url: e.target.value })} placeholder="URL" className="bg-white/10 border border-white/20 rounded px-2 py-1 flex-1 min-w-32" />
              <input value={l.tooltip} onChange={(e) => update(i, { tooltip: e.target.value })} placeholder="Tooltip" className="bg-white/10 border border-white/20 rounded px-2 py-1 w-28" />
              <button onClick={() => move(i, -1)} className="px-2 text-white/60 hover:text-white">↑</button>
              <button onClick={() => move(i, 1)} className="px-2 text-white/60 hover:text-white">↓</button>
              <button onClick={() => remove(i)} className="px-2 text-red-400 hover:text-red-300">✕</button>
            </div>
          ))}
        </div>

        <div className="flex gap-3 items-center">
          <button onClick={add} className="bg-white/10 border border-white/20 rounded-lg px-4 py-2">+ Ajouter un lien</button>
          <button onClick={save} className="bg-[rgb(157,122,255)] rounded-lg px-4 py-2 font-medium">Enregistrer</button>
          {status && <span className="text-sm text-white/60">{status}</span>}
        </div>
      </div>
    </div>
  );
}

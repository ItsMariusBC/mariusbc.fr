'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ICON_OPTIONS } from '@/lib/dock-icons';
import type { SiteConfig, LinkItem } from '@/lib/config';

export function DashboardEditor({ initial }: { initial: SiteConfig }) {
  const router = useRouter();
  const [contactUrl, setContactUrl] = useState(initial.contactUrl);
  const [links, setLinks] = useState<LinkItem[]>(initial.links);
  const [images, setImages] = useState<string[]>(initial.images ?? []);
  const [imgInput, setImgInput] = useState('');
  const [status, setStatus] = useState('');

  function addImage() {
    const v = imgInput.trim();
    if (v) { setImages((p) => [...p, v]); setImgInput(''); }
  }
  function removeImage(i: number) {
    setImages((p) => p.filter((_, idx) => idx !== i));
  }

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
      body: JSON.stringify({ contactUrl, links, images }),
    });
    if (res.ok) { setStatus('Enregistré'); router.refresh(); }
    else setStatus('Erreur (vérifie les URLs / champs)');
  }

  async function logout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/admin');
  }

  return (
    <div className="min-h-screen bg-burgundy text-bone p-6">
      <div className="max-w-2xl mx-auto flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold uppercase tracking-[0.08em]">Dashboard</h1>
          <button onClick={logout} className="text-sm uppercase tracking-[0.08em] text-bone/60 hover:text-bone transition-colors">Déconnexion</button>
        </div>

        <label className="flex flex-col gap-2">
          <span className="text-xs uppercase tracking-[0.08em] text-bone/60">URL de contact</span>
          <input value={contactUrl} onChange={(e) => setContactUrl(e.target.value)} className="bg-transparent border border-bone/30 px-3 py-2 text-bone placeholder:text-bone/60 outline-none focus:ring-2 focus:ring-bone focus:border-bone transition-colors" />
        </label>

        <div className="flex flex-col gap-3">
          {links.map((l, i) => (
            <div key={l.id} className="flex flex-wrap gap-2 items-center border border-bone/20 p-3">
              <select value={l.icon} onChange={(e) => update(i, { icon: e.target.value })} className="bg-transparent border border-bone/30 text-bone px-2 py-1 outline-none focus:ring-2 focus:ring-bone focus:border-bone transition-colors [&>option]:bg-burgundy [&>option]:text-bone">
                {ICON_OPTIONS.map((o) => <option key={o.name} value={o.name}>{o.label}</option>)}
              </select>
              <input value={l.name} onChange={(e) => update(i, { name: e.target.value })} placeholder="Nom" className="bg-transparent border border-bone/30 text-bone placeholder:text-bone/60 px-2 py-1 flex-1 min-w-24 outline-none focus:ring-2 focus:ring-bone focus:border-bone transition-colors" />
              <input value={l.url} onChange={(e) => update(i, { url: e.target.value })} placeholder="URL" className="bg-transparent border border-bone/30 text-bone placeholder:text-bone/60 px-2 py-1 flex-1 min-w-32 outline-none focus:ring-2 focus:ring-bone focus:border-bone transition-colors" />
              <input value={l.tooltip} onChange={(e) => update(i, { tooltip: e.target.value })} placeholder="Tooltip" className="bg-transparent border border-bone/30 text-bone placeholder:text-bone/60 px-2 py-1 w-28 outline-none focus:ring-2 focus:ring-bone focus:border-bone transition-colors" />
              <button onClick={() => move(i, -1)} className="px-2 text-bone/60 hover:text-bone transition-colors">↑</button>
              <button onClick={() => move(i, 1)} className="px-2 text-bone/60 hover:text-bone transition-colors">↓</button>
              <button onClick={() => remove(i)} className="px-2 text-bone/60 hover:text-bone transition-colors">✕</button>
            </div>
          ))}
        </div>

        {/* IMAGES / SITES — external URLs for the home Image Trail */}
        <div className="flex flex-col gap-3 border-t border-bone/20 pt-6">
          <span className="text-xs uppercase tracking-[0.08em] text-bone/60">Images / sites (URLs)</span>
          {images.map((src, i) => (
            <div key={i} className="flex items-center gap-3 border border-bone/20 p-2">
              <span className="text-[0.7rem] tabular-nums text-bone/50">{String(i + 1).padStart(2, '0')}</span>
              <span className="flex-1 truncate text-sm text-bone/80">{src}</span>
              <button onClick={() => removeImage(i)} className="px-2 text-bone/60 hover:text-bone transition-colors">✕</button>
            </div>
          ))}
          <div className="flex gap-2">
            <input
              value={imgInput}
              onChange={(e) => setImgInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addImage(); } }}
              placeholder="https://…/screenshot.jpg"
              className="flex-1 bg-transparent border border-bone/30 text-bone placeholder:text-bone/60 px-3 py-2 outline-none focus:ring-2 focus:ring-bone focus:border-bone transition-colors"
            />
            <button onClick={addImage} className="border border-bone/30 text-bone uppercase tracking-[0.08em] px-4 py-2 hover:bg-bone hover:text-burgundy transition-colors">Ajouter</button>
          </div>
        </div>

        <div className="flex gap-3 items-center">
          <button onClick={add} className="border border-bone/30 text-bone uppercase tracking-[0.08em] px-4 py-2 hover:bg-bone hover:text-burgundy transition-colors">+ Ajouter un lien</button>
          <button onClick={save} className="bg-bone text-burgundy uppercase tracking-[0.08em] font-bold border border-bone px-4 py-2 hover:bg-burgundy hover:text-bone transition-colors">Enregistrer</button>
          {status && <span className="text-sm text-bone/60">{status}</span>}
        </div>
      </div>
    </div>
  );
}

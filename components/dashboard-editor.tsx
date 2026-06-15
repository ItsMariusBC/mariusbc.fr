'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ICON_OPTIONS } from '@/lib/dock-icons';
import type { SiteConfig, LinkItem } from '@/lib/config';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

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
    setStatus('Enregistrement…');
    const res = await fetch('/api/config', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contactUrl, links, images }),
    });
    if (res.ok) { setStatus('Enregistré ✓'); router.refresh(); }
    else setStatus('Erreur — vérifie les URLs / champs');
  }

  async function logout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/admin');
  }

  const selectClass =
    'h-9 rounded-md border border-input bg-transparent px-2 text-sm text-foreground outline-none focus-visible:ring-1 focus-visible:ring-ring [&>option]:bg-card [&>option]:text-foreground';

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* HEADER */}
      <header className="sticky top-0 z-10 border-b border-border bg-background/80 backdrop-blur">
        <div className="mx-auto flex max-w-3xl flex-wrap items-center justify-between gap-3 px-6 py-4">
          <div>
            <h1 className="text-lg font-bold uppercase tracking-[0.1em]">Dashboard</h1>
            <p className="text-xs text-muted-foreground">mariusbc.fr</p>
          </div>
          <div className="flex items-center gap-3">
            {status && <span className="text-sm text-muted-foreground">{status}</span>}
            <Button variant="ghost" size="sm" onClick={logout}>Déconnexion</Button>
            <Button size="sm" onClick={save}>Enregistrer</Button>
          </div>
        </div>
      </header>

      <main className="mx-auto flex max-w-3xl flex-col gap-6 px-6 py-8">
        {/* CONTACT */}
        <Card className="border-border bg-card text-card-foreground">
          <CardHeader>
            <CardTitle className="text-base">Contact</CardTitle>
            <CardDescription className="text-muted-foreground">
              Cible du bouton « Contact » (mailto:, tel: ou https://)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Label htmlFor="contactUrl" className="sr-only">URL de contact</Label>
            <Input id="contactUrl" value={contactUrl} onChange={(e) => setContactUrl(e.target.value)} placeholder="mailto:moi@exemple.com" />
          </CardContent>
        </Card>

        {/* LINKS */}
        <Card className="border-border bg-card text-card-foreground">
          <CardHeader>
            <CardTitle className="text-base">Liens</CardTitle>
            <CardDescription className="text-muted-foreground">
              Liens sociaux affichés sur l’accueil ({links.length})
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            {links.map((l, i) => (
              <div key={l.id} className="flex flex-wrap items-center gap-2 rounded-md border border-border p-3">
                <span className="w-6 text-center text-xs tabular-nums text-muted-foreground">{String(i + 1).padStart(2, '0')}</span>
                <select value={l.icon} onChange={(e) => update(i, { icon: e.target.value })} className={selectClass} aria-label="Icône">
                  {ICON_OPTIONS.map((o) => <option key={o.name} value={o.name}>{o.label}</option>)}
                </select>
                <Input value={l.name} onChange={(e) => update(i, { name: e.target.value })} placeholder="Nom" className="h-9 w-28 flex-1" />
                <Input value={l.url} onChange={(e) => update(i, { url: e.target.value })} placeholder="URL" className="h-9 min-w-40 flex-[2]" />
                <Input value={l.tooltip} onChange={(e) => update(i, { tooltip: e.target.value })} placeholder="Tooltip" className="h-9 w-28" />
                <div className="flex items-center">
                  <Button variant="ghost" size="icon" onClick={() => move(i, -1)} aria-label="Monter">↑</Button>
                  <Button variant="ghost" size="icon" onClick={() => move(i, 1)} aria-label="Descendre">↓</Button>
                  <Button variant="ghost" size="icon" onClick={() => remove(i)} aria-label="Supprimer" className="text-destructive hover:text-destructive">✕</Button>
                </div>
              </div>
            ))}
            <div>
              <Button variant="outline" size="sm" onClick={add}>+ Ajouter un lien</Button>
            </div>
          </CardContent>
        </Card>

        {/* IMAGES */}
        <Card className="border-border bg-card text-card-foreground">
          <CardHeader>
            <CardTitle className="text-base">Images / sites</CardTitle>
            <CardDescription className="text-muted-foreground">
              URLs des screenshots affichés en traînée sur l’accueil ({images.length}/12)
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            {images.map((src, i) => (
              <div key={i} className="flex items-center gap-3 rounded-md border border-border p-2">
                <span className="w-6 text-center text-xs tabular-nums text-muted-foreground">{String(i + 1).padStart(2, '0')}</span>
                <span className="flex-1 truncate text-sm">{src}</span>
                <Button variant="ghost" size="icon" onClick={() => removeImage(i)} aria-label="Supprimer" className="text-destructive hover:text-destructive">✕</Button>
              </div>
            ))}
            <div className="flex gap-2">
              <Input
                value={imgInput}
                onChange={(e) => setImgInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addImage(); } }}
                placeholder="https://…/screenshot.jpg"
                className="flex-1"
              />
              <Button variant="outline" onClick={addImage}>Ajouter</Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

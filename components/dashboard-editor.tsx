'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronDown, ChevronUp, Plus, X, Mail } from 'lucide-react';
import { ICON_OPTIONS, ICON_MAP } from '@/lib/dock-icons';
import type { SiteConfig, LinkItem } from '@/lib/config';
import { Pinwheel } from '@/components/pinwheel';
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
          <div className="flex items-center gap-3">
            <Pinwheel className="h-7 w-7 text-foreground" />
            <div>
              <h1 className="text-base font-bold uppercase tracking-[0.12em] leading-none">Dashboard</h1>
              <p className="mt-1 text-xs text-muted-foreground">mariusbc.fr</p>
            </div>
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
            <div className="flex items-center gap-2 rounded-md border border-input pl-3 focus-within:ring-1 focus-within:ring-ring">
              <Mail className="h-4 w-4 shrink-0 text-muted-foreground" />
              <Input
                id="contactUrl"
                value={contactUrl}
                onChange={(e) => setContactUrl(e.target.value)}
                placeholder="mailto:moi@exemple.com"
                className="border-0 focus-visible:ring-0"
              />
            </div>
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
            {links.map((l, i) => {
              const Icon = ICON_MAP[l.icon] ?? ICON_MAP.Globe;
              return (
                <div key={l.id} className="flex flex-wrap items-center gap-2 rounded-md border border-border bg-background/30 p-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-border text-foreground">
                    <Icon className="h-4 w-4" />
                  </span>
                  <select value={l.icon} onChange={(e) => update(i, { icon: e.target.value })} className={selectClass} aria-label="Icône">
                    {ICON_OPTIONS.map((o) => <option key={o.name} value={o.name}>{o.label}</option>)}
                  </select>
                  <Input value={l.name} onChange={(e) => update(i, { name: e.target.value })} placeholder="Nom" className="h-9 w-28 flex-1" />
                  <Input value={l.url} onChange={(e) => update(i, { url: e.target.value })} placeholder="URL" className="h-9 min-w-40 flex-[2]" />
                  <Input value={l.tooltip} onChange={(e) => update(i, { tooltip: e.target.value })} placeholder="Tooltip" className="h-9 w-28" />
                  <div className="ml-auto flex items-center">
                    <Button variant="ghost" size="icon" onClick={() => move(i, -1)} disabled={i === 0} aria-label="Monter"><ChevronUp className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" onClick={() => move(i, 1)} disabled={i === links.length - 1} aria-label="Descendre"><ChevronDown className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" onClick={() => remove(i)} aria-label="Supprimer" className="text-destructive hover:text-destructive"><X className="h-4 w-4" /></Button>
                  </div>
                </div>
              );
            })}
            <div>
              <Button variant="outline" size="sm" onClick={add}><Plus className="h-4 w-4" /> Ajouter un lien</Button>
            </div>
          </CardContent>
        </Card>

        {/* IMAGES */}
        <Card className="border-border bg-card text-card-foreground">
          <CardHeader>
            <CardTitle className="text-base">Images / sites</CardTitle>
            <CardDescription className="text-muted-foreground">
              Screenshots affichés en traînée sur l’accueil ({images.length}/12)
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            {images.length > 0 && (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {images.map((src, i) => (
                  <figure key={i} className="group relative overflow-hidden rounded-md border border-border">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={src} alt="" className="aspect-video w-full bg-muted object-cover" />
                    <button
                      type="button"
                      onClick={() => removeImage(i)}
                      aria-label="Supprimer"
                      className="absolute right-1.5 top-1.5 flex h-6 w-6 items-center justify-center rounded-md bg-background/80 text-foreground opacity-0 transition-opacity hover:bg-destructive group-hover:opacity-100"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                    <figcaption className="truncate px-2 py-1 text-[0.65rem] text-muted-foreground">{src}</figcaption>
                  </figure>
                ))}
              </div>
            )}
            <div className="flex gap-2">
              <Input
                value={imgInput}
                onChange={(e) => setImgInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addImage(); } }}
                placeholder="https://…/screenshot.jpg"
                className="flex-1"
              />
              <Button variant="outline" onClick={addImage}><Plus className="h-4 w-4" /> Ajouter</Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

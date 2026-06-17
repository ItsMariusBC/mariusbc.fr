'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronDown, ChevronUp, Plus, X, Mail, Check, Link2, Image as ImageIcon } from 'lucide-react';
import { ICON_OPTIONS, ICON_MAP } from '@/lib/dock-icons';
import type { SiteConfig, LinkItem } from '@/lib/config';
import { Pinwheel } from '@/components/pinwheel';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const MAX_IMAGES = 12;

type SaveState = { kind: 'idle' | 'saving' | 'ok' | 'error'; message: string };

/** Validation client — miroir léger de l'allowlist serveur (lib/config). */
const CONTACT_SCHEMES = ['mailto:', 'tel:', 'https:', 'http:'];
const WEB_SCHEMES = ['https:', 'http:'];

function schemeOk(value: string, schemes: string[]): boolean {
  const v = value.trim();
  if (!v) return false;
  try {
    return schemes.includes(new URL(v).protocol);
  } catch {
    return false;
  }
}

export function DashboardEditor({ initial }: { initial: SiteConfig }) {
  const router = useRouter();
  const [contactUrl, setContactUrl] = useState(initial.contactUrl);
  const [links, setLinks] = useState<LinkItem[]>(initial.links);
  const [images, setImages] = useState<string[]>(initial.images ?? []);
  const [imgInput, setImgInput] = useState('');
  const [save, setSave] = useState<SaveState>({ kind: 'idle', message: '' });
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // — Dirty state : compare l'état courant à l'instantané initial.
  const dirty = useMemo(
    () => JSON.stringify({ contactUrl, links, images }) !== JSON.stringify({ contactUrl: initial.contactUrl, links: initial.links, images: initial.images ?? [] }),
    [contactUrl, links, images, initial]
  );

  // — Validation inline : champs fautifs marqués + blocage au save.
  const contactInvalid = !schemeOk(contactUrl, CONTACT_SCHEMES);
  const linkErrors = useMemo(
    () => links.map((l) => !schemeOk(l.url, WEB_SCHEMES)),
    [links]
  );
  const imgInvalid = imgInput.trim() !== '' && !schemeOk(imgInput, WEB_SCHEMES);
  const hasErrors = contactInvalid || linkErrors.some(Boolean);

  function addImage() {
    const v = imgInput.trim();
    if (!v || images.length >= MAX_IMAGES || !schemeOk(v, WEB_SCHEMES)) return;
    setImages((p) => [...p, v]);
    setImgInput('');
  }
  function removeImage(i: number) {
    setImages((p) => p.filter((_, idx) => idx !== i));
  }

  function update(i: number, patch: Partial<LinkItem>) {
    setLinks((prev) => prev.map((l, idx) => (idx === i ? { ...l, ...patch } : l)));
  }
  function remove(i: number) {
    setLinks((prev) => prev.filter((_, idx) => idx !== i));
    setConfirmDelete(null);
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

  const doSave = useCallback(async () => {
    if (!dirty || hasErrors) return;
    if (saveTimer.current) clearTimeout(saveTimer.current);
    setSave({ kind: 'saving', message: 'Enregistrement…' });
    const res = await fetch('/api/config', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contactUrl, links, images }),
    });
    if (res.ok) {
      setSave({ kind: 'ok', message: 'Enregistré' });
      router.refresh();
    } else {
      setSave({ kind: 'error', message: 'Erreur — vérifie les URLs / champs' });
    }
    // Auto-effacement du feedback après ~3s (timer nettoyé au démontage).
    saveTimer.current = setTimeout(() => setSave({ kind: 'idle', message: '' }), 3000);
  }, [dirty, hasErrors, contactUrl, links, images, router]);

  // — Raccourci Cmd/Ctrl+S.
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 's') {
        e.preventDefault();
        doSave();
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [doSave]);

  // — Avertissement avant fermeture si modifs non enregistrées.
  useEffect(() => {
    if (!dirty) return;
    function onBeforeUnload(e: BeforeUnloadEvent) {
      e.preventDefault();
      e.returnValue = '';
    }
    window.addEventListener('beforeunload', onBeforeUnload);
    return () => window.removeEventListener('beforeunload', onBeforeUnload);
  }, [dirty]);

  // — Nettoyage du timer au démontage.
  useEffect(() => () => { if (saveTimer.current) clearTimeout(saveTimer.current); }, []);

  async function logout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/admin');
  }

  const selectClass =
    'h-9 rounded-md border border-input bg-transparent px-2 text-sm text-foreground outline-none focus-visible:ring-1 focus-visible:ring-ring [&>option]:bg-card [&>option]:text-foreground';
  const errorRing = 'border-destructive focus-visible:ring-destructive';

  // Libellé d'état dirty pour le header.
  const dirtyLabel = save.kind === 'idle' && !save.message
    ? dirty
      ? 'Modifs non enregistrées'
      : 'Enregistré ✓'
    : save.message;
  const statusColor =
    save.kind === 'ok'
      ? 'text-foreground'
      : save.kind === 'error'
      ? 'text-destructive'
      : dirty
      ? 'text-muted-foreground'
      : 'text-muted-foreground';

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
            <span
              aria-live="polite"
              className={`flex items-center gap-1.5 text-sm ${statusColor}`}
            >
              {save.kind === 'ok' && <Check className="h-4 w-4" />}
              {dirtyLabel}
            </span>
            <Button variant="ghost" size="sm" onClick={logout}>Déconnexion</Button>
            <Button
              size="sm"
              onClick={doSave}
              disabled={!dirty || hasErrors || save.kind === 'saving'}
              title={hasErrors ? 'Corrige les champs en rouge' : !dirty ? 'Aucune modification' : undefined}
            >
              Enregistrer
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto flex max-w-3xl flex-col gap-6 px-6 py-8">
        {/* CONTACT */}
        <Card className="border-border bg-card text-card-foreground">
          <CardHeader>
            <p className="font-mono text-[0.65rem] uppercase tracking-[0.24em] text-muted-foreground">{'// 01'}</p>
            <CardTitle className="text-base uppercase tracking-[0.08em]">Contact</CardTitle>
            <CardDescription className="text-muted-foreground">
              Cible du bouton « Contact » (mailto:, tel: ou https://)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Label htmlFor="contactUrl" className="sr-only">URL de contact</Label>
            <div className={`flex items-center gap-2 rounded-md border pl-3 focus-within:ring-1 focus-within:ring-ring ${contactInvalid ? 'border-destructive focus-within:ring-destructive' : 'border-input'}`}>
              <Mail className="h-4 w-4 shrink-0 text-muted-foreground" />
              <Input
                id="contactUrl"
                value={contactUrl}
                onChange={(e) => setContactUrl(e.target.value)}
                placeholder="mailto:moi@exemple.com"
                aria-invalid={contactInvalid || undefined}
                className="border-0 focus-visible:ring-0"
              />
            </div>
            {contactInvalid && (
              <p className="mt-2 text-xs text-destructive">Schéma attendu : mailto:, tel: ou https://</p>
            )}
          </CardContent>
        </Card>

        {/* LINKS */}
        <Card className="border-border bg-card text-card-foreground">
          <CardHeader>
            <p className="font-mono text-[0.65rem] uppercase tracking-[0.24em] text-muted-foreground">{'// 02'}</p>
            <CardTitle className="text-base uppercase tracking-[0.08em]">Liens</CardTitle>
            <CardDescription className="text-muted-foreground">
              Liens sociaux affichés sur l’accueil ({links.length})
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            {links.length === 0 && (
              <div className="flex flex-col items-center gap-2 rounded-md border border-dashed border-border py-8 text-center">
                <Link2 className="h-6 w-6 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">Aucun lien. Ajoute ton premier lien social.</p>
              </div>
            )}
            {links.map((l, i) => {
              const Icon = ICON_MAP[l.icon] ?? ICON_MAP.Globe;
              const urlBad = linkErrors[i];
              const pendingDelete = confirmDelete === l.id;
              return (
                <div key={l.id} className="flex flex-col gap-2 rounded-md border border-border bg-background/30 p-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-border text-foreground">
                      <Icon className="h-4 w-4" />
                    </span>
                    <select value={l.icon} onChange={(e) => update(i, { icon: e.target.value })} className={selectClass} aria-label="Icône">
                      {ICON_OPTIONS.map((o) => <option key={o.name} value={o.name}>{o.label}</option>)}
                    </select>
                    <Input value={l.name} onChange={(e) => update(i, { name: e.target.value })} placeholder="Nom" aria-label="Nom" className="h-9 min-w-28 flex-1" />
                    <Input value={l.url} onChange={(e) => update(i, { url: e.target.value })} placeholder="https://…" aria-label="URL" aria-invalid={urlBad || undefined} className={`h-9 min-w-40 flex-[2] ${urlBad ? errorRing : ''}`} />
                    <Input value={l.tooltip} onChange={(e) => update(i, { tooltip: e.target.value })} placeholder="Tooltip" aria-label="Tooltip" className="h-9 min-w-28 flex-1" />
                    <div className="ml-auto flex items-center">
                      <Button variant="ghost" size="icon" onClick={() => move(i, -1)} disabled={i === 0} aria-label="Monter"><ChevronUp className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon" onClick={() => move(i, 1)} disabled={i === links.length - 1} aria-label="Descendre"><ChevronDown className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon" onClick={() => setConfirmDelete(pendingDelete ? null : l.id)} aria-label="Supprimer" aria-expanded={pendingDelete} className="text-destructive hover:text-destructive"><X className="h-4 w-4" /></Button>
                    </div>
                  </div>
                  {urlBad && <p className="text-xs text-destructive">URL invalide — http(s) attendu.</p>}
                  {pendingDelete && (
                    <div className="flex items-center justify-between gap-2 rounded-md border border-destructive bg-destructive/10 px-3 py-2 text-sm">
                      <span>Supprimer ce lien ?</span>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm" onClick={() => setConfirmDelete(null)}>Annuler</Button>
                        <Button variant="destructive" size="sm" onClick={() => remove(i)}>Supprimer</Button>
                      </div>
                    </div>
                  )}
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
            <p className="font-mono text-[0.65rem] uppercase tracking-[0.24em] text-muted-foreground">{'// 03'}</p>
            <CardTitle className="text-base uppercase tracking-[0.08em]">Images / sites</CardTitle>
            <CardDescription className="text-muted-foreground">
              Screenshots affichés en traînée sur l’accueil ({images.length}/{MAX_IMAGES})
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            {images.length === 0 ? (
              <div className="flex flex-col items-center gap-2 rounded-md border border-dashed border-border py-8 text-center">
                <ImageIcon className="h-6 w-6 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">Aucune image. Colle une URL ci-dessous.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {images.map((src, i) => (
                  <figure key={i} className="group relative overflow-hidden rounded-md border border-border">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={src} alt="" className="aspect-video w-full bg-muted object-cover" />
                    <button
                      type="button"
                      onClick={() => removeImage(i)}
                      aria-label="Supprimer l’image"
                      className="absolute right-1.5 top-1.5 flex h-6 w-6 items-center justify-center rounded-md bg-background/80 text-foreground opacity-100 transition-opacity hover:bg-destructive focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring sm:opacity-0 sm:group-hover:opacity-100"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                    <figcaption className="truncate px-2 py-1 text-[0.65rem] text-muted-foreground">{src}</figcaption>
                  </figure>
                ))}
              </div>
            )}
            <div className="flex flex-col gap-1">
              <div className="flex gap-2">
                <Input
                  value={imgInput}
                  onChange={(e) => setImgInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addImage(); } }}
                  placeholder="https://…/screenshot.jpg"
                  aria-label="URL de l’image"
                  aria-invalid={imgInvalid || undefined}
                  disabled={images.length >= MAX_IMAGES}
                  className={`flex-1 ${imgInvalid ? errorRing : ''}`}
                />
                <Button variant="outline" onClick={addImage} disabled={imgInvalid || imgInput.trim() === '' || images.length >= MAX_IMAGES}><Plus className="h-4 w-4" /> Ajouter</Button>
              </div>
              {imgInvalid && <p className="text-xs text-destructive">URL invalide — http(s) attendu.</p>}
              {images.length >= MAX_IMAGES && <p className="text-xs text-muted-foreground">Maximum {MAX_IMAGES} images atteint.</p>}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

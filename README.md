<div align="center">

# mariusbc.fr

**Site vitrine personnel** — une page-affiche interactive dans une direction
artistique Swiss / typographique.

![Next.js](https://img.shields.io/badge/Next.js_16-000000?style=flat-square&logo=next.js)
![React](https://img.shields.io/badge/React_19-20232a?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-3178c6?style=flat-square&logo=typescript&logoColor=white)
![Tailwind](https://img.shields.io/badge/Tailwind_4-0b1120?style=flat-square&logo=tailwindcss)
![GSAP](https://img.shields.io/badge/GSAP-0ae448?style=flat-square&logo=greensock&logoColor=black)
![PostHog](https://img.shields.io/badge/PostHog-1d4aff?style=flat-square&logo=posthog&logoColor=white)

</div>

---

## Le projet

Une vitrine au parti pris fort : fond **burgundy** `#8E0320`, encre **bone**
`#E7E4D8`, une seule grotesque (**Archivo**), beaucoup de vide, et un wordmark
**MARIUS** vivant. Le contenu (liens, bouton de contact, screenshots) est piloté
depuis un petit panneau d'administration — sans base de données.

## Stack

| Domaine | Choix |
|---|---|
| **Framework** | Next.js 16 (App Router, sortie `standalone`) · React 19 · TypeScript |
| **Style** | Tailwind CSS 4 (CSS-first) · Archivo (`next/font`, self-hosted) |
| **Animation** | GSAP (timeline d'entrée) · matter-js (Falling Text) · effets canvas maison |
| **UI admin** | shadcn/ui (Card, Button, Input, Label) thémé burgundy/bone |
| **Auth** | `jose` (JWT httpOnly) + `bcryptjs` — admin unique, par mot de passe |
| **Données** | un fichier `config.json` sur volume — pas de base de données |
| **Analytics** | PostHog (reverse-proxy, activé en production) |
| **Tests** | Vitest |

## Highlights

- **MARIUS** en *Text Pressure* — le poids des lettres réagit au curseur (police variable).
- **Falling Text** physique pour la tagline, **Click Spark** au clic, **Noise** grain dans les marges.
- **Image Trail** : les screenshots des réalisations défilent en traînée sur les bords.
- **Entrée orchestrée** en GSAP, harmonisée (fade + montée + stagger), `prefers-reduced-motion`-safe.
- **Dashboard admin** : édition des liens, du contact et des images — aperçus d'icônes & miniatures.
- **Zéro base de données** : tout vit dans un `config.json` versionnable, relu à chaud.

## Structure

```
app/         Routes App Router (accueil · /admin · /api/*)
components/  UI (home-content, dashboard-editor, magicui-like effects, ui/* shadcn)
lib/         config (stockage JSON) · session (auth) · dock-icons · utils
public/      Assets (police variable Archivo)
tests/       Vitest
```

## Direction artistique

> Burgundy `#8E0320` · Bone `#E7E4D8` · Archivo · grille Swiss, négatif généreux, à plat.

<div align="center">
<sub>© Marius BC — Dev · Music · SysAdmin · DevOps</sub>
</div>

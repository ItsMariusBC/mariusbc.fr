<div align="center">

# 🍷 mariusbc.fr

**A personal portfolio — one interactive type-poster in a Swiss art direction.**

![Next.js](https://img.shields.io/badge/Next.js_16-000000?style=flat-square&logo=next.js)
![React](https://img.shields.io/badge/React_19-20232a?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-3178c6?style=flat-square&logo=typescript&logoColor=white)
![Tailwind](https://img.shields.io/badge/Tailwind_4-0b1120?style=flat-square&logo=tailwindcss)
![GSAP](https://img.shields.io/badge/GSAP-0ae448?style=flat-square&logo=greensock&logoColor=black)
![PostHog](https://img.shields.io/badge/PostHog-1d4aff?style=flat-square&logo=posthog&logoColor=white)

</div>

---

## ✦ The project

A portfolio with a strong point of view: a **burgundy** `#8E0320` ground, **bone**
`#E7E4D8` ink, a single grotesk (**Archivo**), generous negative space, and a living
**MARIUS** wordmark. Everything visible — links, the contact button, project
screenshots — is driven from a tiny admin panel. **No database.**

## 🧱 Stack

| Area | Choice |
|---|---|
| 🧩 **Framework** | Next.js 16 (App Router, `standalone` output) · React 19 · TypeScript |
| 🎨 **Styling** | Tailwind CSS 4 (CSS-first) · Archivo (`next/font`, self-hosted) |
| 🎞️ **Motion** | GSAP (entry timeline) · matter-js (Falling Text) · hand-rolled canvas effects |
| 🛠️ **Admin UI** | shadcn/ui (Card · Button · Input · Label), themed burgundy/bone |
| 🔐 **Auth** | `jose` (httpOnly JWT) + `bcryptjs` — single password-based admin |
| 🗂️ **Data** | a single `config.json` on a volume — no database |
| 📈 **Analytics** | PostHog (reverse-proxy, production-only) |
| ✅ **Tests** | Vitest |

## ✨ Highlights

- 🖱️ **MARIUS** in *Text Pressure* — letter weight reacts to the cursor (variable font).
- 🌀 Physics-based **Falling Text** tagline, **Click Spark** on click, **Noise** grain in the margins.
- 🖼️ **Image Trail** — project screenshots streak across the edges as the cursor moves.
- 🎬 Orchestrated **GSAP entry** (fade + rise + stagger), `prefers-reduced-motion`-safe.
- 🧑‍💻 **Admin dashboard** — edit links, contact and images, with icon previews & thumbnails.
- 🪶 **Zero database** — everything lives in a version-friendly `config.json`, read fresh on each request.

## 🗺️ Structure

```
app/         App Router routes (home · /admin · /api/*)
components/  UI (home-content, dashboard-editor, canvas/physics effects, ui/* shadcn)
lib/         config (JSON store) · session (auth) · dock-icons · utils
public/      Assets (Archivo variable font)
tests/       Vitest
```

## 🎨 Art direction

> Burgundy `#8E0320` · Bone `#E7E4D8` · Archivo · Swiss grid, generous negative space, flat.

<div align="center">
<sub>© Marius BC — Dev · Music · SysAdmin · DevOps</sub>
</div>

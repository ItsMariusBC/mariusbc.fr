# mariusbc.fr

Site vitrine personnel (style Linktree) avec un petit panneau d'administration
pour éditer le bouton de contact et les liens du dock.

## Stack

- Next.js 16 (App Router, sortie `standalone`)
- React 19 + TypeScript
- Tailwind CSS 4
- Auth admin : `jose` (JWT) + `bcryptjs`, un seul admin
- Stockage : fichier `config.json` (pas de base de données)
- Tests : Vitest

## Architecture

- Les données (URL de contact + liens) vivent dans un seul fichier JSON
  (`config.json`) sur un volume. Pas de base de données.
- `config.default.json` sert de configuration initiale : copiée vers le volume
  au premier démarrage si le fichier est absent.
- L'admin unique s'authentifie par mot de passe (haché en variable
  d'environnement) ; la session est un cookie JWT signé, httpOnly.

```
app/            Routes App Router (accueil, /admin, /api/*)
components/     Composants UI (home-content, dashboard-editor, magicui/*)
lib/            config.ts (stockage), session.ts (auth), dock-icons.ts, utils.ts
tests/          Tests Vitest
scripts/        hash-password.mjs
public/         Assets statiques
```

## Variables d'environnement

Voir `.env.example`.

| Variable | Rôle |
|---|---|
| `AUTH_SECRET` | Secret de signature de session. `openssl rand -base64 32` |
| `ADMIN_PASSWORD_HASH` | Hash bcrypt du mot de passe admin. `npm run gen:password "motdepasse"` |
| `CONFIG_PATH` | Chemin du `config.json`. Défaut prod : `/app/data/config.json` |

## Développement

```bash
npm install
cp .env.example .env.local        # puis renseigner AUTH_SECRET + ADMIN_PASSWORD_HASH
npm run gen:password "motdepasse" # copier le hash dans .env.local
npm run dev
```

- Accueil : http://localhost:3000
- Admin : http://localhost:3000/admin

## Scripts

| Commande | Effet |
|---|---|
| `npm run dev` | Serveur de développement |
| `npm run build` | Build de production |
| `npm run start` | Sert le build |
| `npm run lint` | ESLint |
| `npm test` | Tests Vitest |
| `npm run gen:password "..."` | Génère un hash bcrypt pour `ADMIN_PASSWORD_HASH` |

## Déploiement (Docker)

```bash
docker build -t mariusbc .
docker run -p 3000:3000 \
  -e AUTH_SECRET=... \
  -e ADMIN_PASSWORD_HASH=... \
  -v mariusbc-data:/app/data \
  mariusbc
```

Monter un volume sur `/app/data` pour persister `config.json` entre les
redéploiements. Définir `AUTH_SECRET` et `ADMIN_PASSWORD_HASH`.

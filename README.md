# Portfolio Marius

Portfolio personnel avec interface d'administration pour gerer le bouton de contact, les icones du dock et les analytics de clic.

## Stack

- Next.js 16 App Router
- React 19 + TypeScript
- NextAuth Credentials
- Prisma 7 avec adaptateur SQLite `better-sqlite3`
- Tailwind CSS 4

## Installation locale

1. Installer les dependances:

```bash
npm install
```

2. Initialiser l'environnement:

```bash
cp .env.example .env
```

3. Generer Prisma et preparer la base:

```bash
npm run db:generate
npm run db:push
npm run db:seed
```

4. Lancer le serveur:

```bash
npm run dev
```

L'application est ensuite disponible sur `http://localhost:3000`.

## Commandes utiles

```bash
npm run dev        # developpement
npm run lint       # lint ESLint
npm run build      # build production
npm run start      # demarrer la build

npm run db:generate
npm run db:push
npm run db:migrate
npm run db:seed
npm run db:studio
```

## Base de donnees

La base locale utilise SQLite via `DATABASE_URL="file:./prisma/dev.db"`. Le schema Prisma couvre:

- `User`, `Account`, `Session`, `VerificationToken` pour NextAuth
- `SiteConfig` pour le bouton de contact
- `DockIcon` pour les liens du dock
- `ClickAnalytics` pour les statistiques

## Admin

- Premiere creation: `http://localhost:3000/admin/signup`
- Connexion: `http://localhost:3000/admin`
- Dashboard: `http://localhost:3000/admin/dashboard`

Le premier compte cree devient administrateur. Les routes d'administration exigent ensuite une session admin.

## Variables d'environnement

Voir [.env.example](/Users/marius.b/Desktop/Perso/Code/mariusbc.fr/.env.example) pour les valeurs attendues, notamment:

- `DATABASE_URL`
- `NEXTAUTH_SECRET`
- `NEXTAUTH_URL`

# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Development
npm run dev          # Start dev server (requires DB running)
npm run build        # Production build
npm run lint         # ESLint check

# Database (run these in order for first-time setup)
npm run docker:dev   # Start PostgreSQL + pgAdmin via docker-compose.dev.yml
npm run db:generate  # Generate Prisma client after schema changes
npm run db:migrate   # Create and apply a new migration (dev only)
npm run db:seed      # Seed the database with initial data
npm run db:studio    # Open Prisma Studio GUI (localhost:5555)

# After modifying prisma/schema.prisma, always run:
npm run db:generate && npm run db:migrate
```

## Environment Variables

Copy `.env.example` to `.env`. Required vars:
- `DATABASE_URL` — PostgreSQL connection string
- `BETTER_AUTH_SECRET` — Secret for session encryption (`openssl rand -base64 32`)
- `NEXTAUTH_URL` — App base URL (e.g. `http://localhost:3000`)

## Architecture

**Next.js 14 App Router** with TypeScript, Tailwind CSS, and PostgreSQL via Prisma.

### Key directories
- `app/` — Pages and API routes (App Router)
- `components/magicui/` — Custom animation components (HyperText, SparklesText, VideoText, ShinyButton, Dock)
- `lib/` — Shared singletons: `auth.ts` (server-side Better Auth), `auth-client.ts` (client-side), `prisma.ts` (Prisma client)
- `prisma/schema.prisma` — DB models: `User`, `Account`, `Session`, `Verification`, `SiteConfig`, `DockIcon`, `ClickAnalytics`

### Auth flow (Better Auth)
- Server config: `lib/auth.ts` — uses Prisma adapter, email+password only, 7-day sessions
- Client config: `lib/auth-client.ts` — exports `signIn`, `signOut`, `signUp`, `useSession`
- API handler: `app/api/auth/[...all]/route.ts`
- Admin signup is restricted to the first user only (checked via `/api/admin-exists`)
- Admin routes: `/admin` (login), `/admin/signup` (first-time setup), `/admin/dashboard`

### Data flow
The homepage (`app/page.tsx`) is a client component that fetches `DockIcon` and `SiteConfig` from the API on load. If the fetch fails, it falls back to hardcoded defaults.

### IconMap — critical duplication
`app/page.tsx` and `app/admin/dashboard/page.tsx` both maintain a local `IconMap` object mapping string names (e.g. `"Github"`) to Lucide React components. When adding a new icon, it must be added to **both files**.

### API routes
- `GET/POST /api/dock-icons` — list active icons, create icon
- `GET/PUT/DELETE /api/dock-icons/[id]` — individual icon CRUD
- `GET/POST /api/site-config` — contact button URL
- `GET/POST /api/analytics` — click tracking (type: `"contact"` | `"dock_icon"`)
- `GET /api/admin-exists` — whether any admin user exists
- `GET /api/health` — health check

### Deployment
- Production: Railway (Docker standalone build via `docker-compose.yml`)
- Local dev DB only: `docker-compose.dev.yml` (PostgreSQL on 5432, pgAdmin on 5050)

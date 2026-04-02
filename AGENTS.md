# Repository Guidelines

## Project Structure & Module Organization
This repository is a Next.js App Router app. Route files live in `app/`, including admin pages in `app/admin/` and API handlers in `app/api/`. Reusable UI lives in `components/`, shared server/client utilities in `lib/`, Prisma schema and seed data in `prisma/`, and static assets in `public/`. Keep new route-specific code close to its route; promote only genuinely shared logic into `components/` or `lib/`.

## Build, Test, and Development Commands
Use `npm run dev` to start the local dev server, `npm run build` to create a production build, and `npm run start` to serve the built app. Run `npm run lint` before opening a PR; ESLint is the main automated quality gate. Database workflows use Prisma: `npm run db:generate`, `npm run db:push`, `npm run db:migrate`, `npm run db:seed`, and `npm run db:studio`.

## Coding Style & Naming Conventions
The codebase uses TypeScript, React function components, and the existing style favors single quotes and semicolons. Follow the current indentation style of 2 spaces. Use `PascalCase` for React components, `camelCase` for variables/functions, and keep route folders aligned with URL structure, for example `app/api/site-config/route.ts`. Prefer colocated files over broad shared folders unless reuse is clear.

## Testing Guidelines
There is no automated test suite configured yet. Until one is added, treat `npm run lint` and a successful `npm run build` as the minimum verification for every change. For API or auth changes, also validate the affected flow manually through the relevant page or endpoint. When adding tests later, place them near the feature or in a local `__tests__/` folder and use descriptive names like `site-config.route.test.ts`.

## Commit & Pull Request Guidelines
Recent history follows short Conventional Commit messages such as `fix: harden security based on audit findings` and `feat: migrate to SQLite + NextAuth`. Keep that format: `<type>: <imperative summary>`. PRs should include a concise description, note any schema or env changes, link the related issue when applicable, and attach screenshots for UI/admin changes.

## Security & Configuration Tips
Do not commit real secrets in `.env`. Start from `.env.example` and document any new variables there. This app uses Prisma with SQLite in the current schema, so call out migration or seed changes clearly in reviews.

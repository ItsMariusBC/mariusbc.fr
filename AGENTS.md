# Repository Guidelines

## Project Structure & Module Organization
Next.js App Router app. Routes live in `app/` (home, `app/admin/`, API handlers in
`app/api/`). UI components in `components/` (`magicui/` holds the animated
primitives). Shared logic in `lib/`: `config.ts` (JSON config storage +
validation), `session.ts` (jose/bcrypt admin auth), `dock-icons.ts` (icon map),
`utils.ts`. Tests in `tests/`. Helper scripts in `scripts/`. Static assets in
`public/`. There is no database — persistent data is a single `config.json` file
(`config.default.json` seeds it on first run).

## Build, Test, and Development Commands
- `npm run dev` — local dev server
- `npm run build` / `npm run start` — production build and serve
- `npm run lint` — ESLint (flat config in `eslint.config.mjs`)
- `npm test` — Vitest suite
- `npm run gen:password "<pw>"` — bcrypt hash for `ADMIN_PASSWORD_HASH`

## Coding Style & Naming Conventions
TypeScript, React function components, 2-space indent, single quotes, semicolons.
`PascalCase` for components, `camelCase` for variables/functions. Keep route
folders aligned with the URL. Prefer colocated code; promote to `components/` or
`lib/` only when reuse is real.

## Testing Guidelines
Vitest. Put unit tests in `tests/` named `<feature>.test.ts`. Route handlers are
testable by importing the exported `GET/POST/PUT` and passing a `NextRequest`.
Always keep `npm test`, `npm run lint`, and `npm run build` green before a PR. For
auth/config changes, also validate the flow manually (`/admin` login → edit →
home reflects it).

## Commit & Pull Request Guidelines
Conventional Commits: `<type>: <imperative summary>` (e.g. `feat: add login
route`). PRs: concise description, note any env changes (`AUTH_SECRET`,
`ADMIN_PASSWORD_HASH`, `CONFIG_PATH`), screenshots for UI/admin changes.

## Security & Configuration Tips
Never commit real secrets — start from `.env.example`. The admin is a single
password hash in env; sessions are signed JWT cookies. All link/contact URLs are
validated against a scheme allowlist (`https/http/mailto/tel`) on write — keep
that boundary intact when touching `lib/config.ts`.

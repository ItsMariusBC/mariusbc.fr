# Dependency Update Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Bring all npm dependencies to their latest versions, handling the several major-version breaking changes along the way.

**Architecture:** Updates are batched from lowest-risk to highest-risk. Since there are no automated tests, every task ends with `npm run build && npm run lint` as the verification gate before committing.

**Tech Stack:** Next.js, React, TypeScript, Tailwind CSS, Prisma, Better Auth, Framer Motion (→ motion), ESLint

---

## Overview of breaking-change upgrades

| Package | Current | Latest | Risk |
|---------|---------|--------|------|
| `@radix-ui/react-tooltip` | 1.0.7 | 1.2.8 | Low |
| `better-auth` | 1.0.1 | 1.4.18 | Low |
| `clsx` | 2.0.0 | 2.1.1 | Low |
| `autoprefixer` / `postcss` / `typescript` / `tsx` | various | latest | Low |
| `bcryptjs` | 2.4.3 | 3.0.3 | Medium |
| `prisma` + `@prisma/client` | 5.7.1 | 7.4.1 | Medium |
| `tailwind-merge` | 1.14.0 | 3.5.0 | Medium |
| `react` + `react-dom` | 18.2.0 | 19.2.4 | High |
| `next` + `eslint-config-next` | 14.2.35 | 16.1.6 | High |
| `framer-motion` → `motion` | 10.16.4 | 12.34.3 | High |
| `tailwindcss` | 3.3.3 | 4.2.0 | High |
| `eslint` | 8.45.0 | 10.0.1 | High |

---

### Task 1: Baseline — install & verify current state

**Goal:** Confirm the project builds cleanly before touching anything.

**Files:** none

**Step 1: Install dependencies**
```bash
npm install
```

**Step 2: Verify baseline build**
```bash
npm run build
```
Expected: build succeeds (warnings are OK, errors are not).

**Step 3: Verify lint**
```bash
npm run lint
```
Expected: no errors (warnings are OK).

**Step 4: Commit the lock file**
```bash
git add package-lock.json
git commit -m "chore: add package-lock.json baseline"
```

---

### Task 2: Low-risk minor/patch upgrades

**Goal:** Update all packages where only minor or patch versions changed — no API changes expected.

**Files:**
- Modify: `package.json`

**Step 1: Update low-risk packages**
```bash
npm install \
  @radix-ui/react-tooltip@latest \
  better-auth@latest \
  clsx@latest \
  lucide-react@latest
```

**Step 2: Update low-risk devDependencies**
```bash
npm install -D \
  autoprefixer@latest \
  postcss@latest \
  typescript@latest \
  tsx@latest
```

**Step 3: Verify build**
```bash
npm run build && npm run lint
```
Expected: no new errors.

**Step 4: Commit**
```bash
git add package.json package-lock.json
git commit -m "chore: update minor/patch dependencies"
```

---

### Task 3: bcryptjs 2 → 3

**Goal:** Update bcryptjs to v3. The package ships ESM in v3; the API (hash/compare) is unchanged.

**Files:**
- Modify: `package.json`

**Step 1: Update bcryptjs and its types**
```bash
npm install bcryptjs@latest
npm install -D @types/bcryptjs@latest
```

**Step 2: Search for any bcryptjs usage in source**
```bash
grep -rn "bcryptjs" app/ lib/ components/ --include="*.ts" --include="*.tsx"
```
> **Note:** `better-auth` handles password hashing internally via its own implementation; direct `bcryptjs` usage in this codebase is likely zero. If grep returns nothing, proceed directly to the build step.

**Step 3: Verify build**
```bash
npm run build && npm run lint
```

**Step 4: Commit**
```bash
git add package.json package-lock.json
git commit -m "chore: upgrade bcryptjs to v3"
```

---

### Task 4: Prisma 5 → 7

**Goal:** Upgrade `prisma` and `@prisma/client` from v5 to v7. Migration guide: https://www.prisma.io/docs/orm/more/upgrade-guides

**Files:**
- Modify: `package.json`
- Modify: `prisma/schema.prisma` (if needed)
- Potentially: `lib/prisma.ts`

**Step 1: Install new Prisma versions**
```bash
npm install @prisma/client@latest
npm install -D prisma@latest
```

**Step 2: Regenerate the Prisma client**
```bash
npm run db:generate
```
Expected: "Generated Prisma Client" message with no errors.

**Step 3: Check for deprecated Prisma APIs**

Run the official codemod (if available):
```bash
npx @prisma/upgrade
```
If the codemod is not available, manually check `lib/prisma.ts` and all `app/api/**/route.ts` files for any usage of deprecated methods. Prisma 7 changes:
- `findUnique` behavior unchanged
- `prisma.$transaction` API unchanged
- Main change: `@prisma/client` is now a separate peer dependency — already handled by the install above.

**Step 4: Verify build**
```bash
npm run build && npm run lint
```

**Step 5: Commit**
```bash
git add package.json package-lock.json prisma/schema.prisma lib/prisma.ts
git commit -m "chore: upgrade Prisma to v7"
```

---

### Task 5: React 18 → 19 and Next.js 14 → 16

**Goal:** These must be upgraded together — Next.js 16 requires React 19.

**Files:**
- Modify: `package.json`
- Possibly: `app/layout.tsx`, `components/*.tsx` (if any deprecated patterns)

**Step 1: Install React 19 and Next.js 16**
```bash
npm install react@latest react-dom@latest next@latest
npm install -D @types/react@latest @types/react-dom@latest eslint-config-next@latest
```

**Step 2: Check for React 19 breaking changes in this codebase**

React 19 removes deprecated APIs. Check for:
```bash
# Check for ReactDOM.render (removed in 19)
grep -rn "ReactDOM.render" app/ components/ --include="*.tsx" --include="*.ts"

# Check for string refs
grep -rn "ref=" app/ components/ --include="*.tsx"

# Check for legacy Context API
grep -rn "contextTypes\|childContextTypes\|getChildContext" app/ components/ --include="*.tsx"
```
This codebase uses the App Router and modern hooks — none of the above should appear.

**Step 3: Check for Next.js 16 breaking changes**

Next.js 14 → 16 migration guide: https://nextjs.org/docs/app/building-your-application/upgrading

Key things to check:
- `app/layout.tsx` metadata exports (format unchanged)
- `next/image`, `next/link` usage (APIs unchanged for App Router)
- Any usage of deprecated `next/headers` async patterns

```bash
grep -rn "import.*next/" app/ --include="*.tsx" --include="*.ts"
```

**Step 4: Verify build**
```bash
npm run build && npm run lint
```
> If there are TypeScript errors related to `React.FC`, note that React 19 types removed `children` from `React.FC` props — components must declare `children: React.ReactNode` explicitly if needed.

**Step 5: Commit**
```bash
git add package.json package-lock.json
git commit -m "chore: upgrade React to v19 and Next.js to v16"
```

---

### Task 6: framer-motion 10 → motion 12

**Goal:** `framer-motion` was renamed to `motion`. Import paths change from `'framer-motion'` to `'motion/react'`.

**Files:**
- Modify: `package.json`
- Modify: `components/magicui/dock.tsx`
- Modify: `components/magicui/hyper-text.tsx`
- Modify: `components/magicui/shiny-button.tsx`
- Modify: `components/magicui/sparkles-text.tsx`

**Step 1: Replace the package**
```bash
npm uninstall framer-motion
npm install motion@latest
```

**Step 2: Update `components/magicui/dock.tsx`**

Find:
```ts
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
```
Replace with:
```ts
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
```

**Step 3: Update `components/magicui/hyper-text.tsx`**

Find:
```ts
import { AnimatePresence, motion, type MotionProps } from "framer-motion";
```
Replace with:
```ts
import { AnimatePresence, motion, type MotionProps } from "motion/react";
```

**Step 4: Update `components/magicui/shiny-button.tsx`**

Find:
```ts
import { motion, type MotionProps, type AnimationProps } from "framer-motion";
```
Replace with:
```ts
import { motion, type MotionProps, type AnimationProps } from "motion/react";
```

**Step 5: Update `components/magicui/sparkles-text.tsx`**

Find:
```ts
import { motion } from "framer-motion";
```
Replace with:
```ts
import { motion } from "motion/react";
```

**Step 6: Verify no remaining framer-motion imports**
```bash
grep -rn "framer-motion" app/ components/ --include="*.tsx" --include="*.ts"
```
Expected: no output.

**Step 7: Verify build**
```bash
npm run build && npm run lint
```

**Step 8: Commit**
```bash
git add package.json package-lock.json components/magicui/
git commit -m "chore: migrate framer-motion → motion v12"
```

---

### Task 7: Tailwind CSS 3 → 4 (+ tailwind-merge 1 → 3)

**Goal:** Tailwind v4 has a completely new architecture — config moves from `tailwind.config.js` to CSS `@theme` blocks. `tailwind-merge` v3 is designed for Tailwind v4 class names.

**Files:**
- Modify: `package.json`
- Modify: `app/globals.css`
- Modify: `postcss.config.js`
- Delete: `tailwind.config.js` (config moves to CSS)
- Possibly: `lib/utils.ts` (if `cn()` uses tailwind-merge)

**Step 1: Install Tailwind v4 and tailwind-merge v3**
```bash
npm install -D tailwindcss@latest
npm install tailwind-merge@latest
```

**Step 2: Check `lib/utils.ts` for tailwind-merge usage**

Read `lib/utils.ts`. If it contains:
```ts
import { twMerge } from "tailwind-merge"
```
The `twMerge` function API is unchanged in v3 — no code change needed.

**Step 3: Update `postcss.config.js`**

Tailwind v4 uses a new PostCSS plugin. Replace the entire file with:
```js
module.exports = {
  plugins: {
    '@tailwindcss/postcss': {},
  },
};
```

Then install the PostCSS plugin:
```bash
npm install -D @tailwindcss/postcss@latest
```

**Step 4: Update `app/globals.css`**

Replace:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```
With:
```css
@import "tailwindcss";

@theme {
  --animate-sparkle: sparkle 1s ease-in-out infinite;

  @keyframes sparkle {
    0% { transform: scale(0) rotate(0deg); opacity: 0; }
    50% { transform: scale(1) rotate(90deg); opacity: 0.7; }
    100% { transform: scale(0) rotate(180deg); opacity: 0; }
  }
}
```

**Step 5: Delete `tailwind.config.js`**
```bash
rm tailwind.config.js
```

The `content` array is no longer needed — Tailwind v4 auto-detects files. The custom keyframe is now expressed in the `@theme` block in globals.css (done in step 4).

**Step 6: Verify build**
```bash
npm run build && npm run lint
```
> If any Tailwind utility classes no longer work, consult https://tailwindcss.com/docs/upgrade-guide — some class names changed (e.g., `shadow-sm` thicknesses changed, `ring` utilities changed). Visually inspect the app.

**Step 7: Start dev server and visually verify the UI**
```bash
npm run dev
```
Open http://localhost:3000 and verify:
- Background gradient renders correctly
- The Dock at the bottom is visible with glassmorphism effect
- "Me contacter" shiny button renders
- Sparkle animation works on the sparkles text
- HyperText animation works on the rotating words

**Step 8: Commit**
```bash
git add package.json package-lock.json app/globals.css postcss.config.js
git rm tailwind.config.js
git commit -m "chore: upgrade Tailwind CSS to v4 and tailwind-merge to v3"
```

---

### Task 8: ESLint 8 → 10

**Goal:** ESLint v9+ uses a new flat config format. `next lint` (from `eslint-config-next`) handles migration automatically when using the Next.js lint setup.

**Files:**
- Modify: `package.json`
- Rename/Modify: `.eslintrc.json` → `eslint.config.mjs`

**Step 1: Check the current `.eslintrc.json`**
```bash
cat .eslintrc.json
```

**Step 2: Install ESLint 10**
```bash
npm install -D eslint@latest
```

**Step 3: Migrate config**

If `next lint` still accepts `.eslintrc.json` with the new version (it may have a compatibility layer), try the build first. If it errors, create `eslint.config.mjs`:

```js
import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({ baseDirectory: __dirname });

const eslintConfig = [
  ...compat.extends("next/core-web-vitals"),
];

export default eslintConfig;
```

Install the compat helper if needed:
```bash
npm install -D @eslint/eslintrc@latest
```

Then delete the old config:
```bash
rm .eslintrc.json
```

**Step 4: Verify lint**
```bash
npm run lint
```

**Step 5: Verify build**
```bash
npm run build
```

**Step 6: Commit**
```bash
git add package.json package-lock.json eslint.config.mjs
git rm .eslintrc.json 2>/dev/null || true
git commit -m "chore: upgrade ESLint to v10 with flat config"
```

---

### Task 9: Final verification

**Step 1: Full clean build**
```bash
rm -rf .next && npm run build
```
Expected: build succeeds with no errors.

**Step 2: Verify dev server end-to-end**
```bash
npm run dev
```
Manually verify:
- [ ] http://localhost:3000 — homepage renders with all animations
- [ ] Dock icons load from the DB (or fallback defaults if no DB)
- [ ] "Me contacter" button works
- [ ] http://localhost:3000/admin — login page renders
- [ ] http://localhost:3000/admin/signup — signup page renders

**Step 3: Final commit**
```bash
git add -A
git commit -m "chore: complete dependency upgrade to all-latest versions"
```

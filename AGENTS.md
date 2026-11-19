<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Stack & layout

- Next.js 16.4.5 App Router + React 19.3.1, strict TypeScript, Tailwind v4 (no `tailwind.config`; tokens/styles live in `app/globals.css`).
- Routes: `app/page.tsx` and the Better Auth catch-all `app/api/auth/[...all]/route.ts`. `app/layout.tsx` wraps everything in `ThemeProvider` (class-based `next-themes`, system default); dark mode toggles via the navbar button (`components/shared/ThemeToggle.tsx`) or the `d` hotkey in `components/theme-provider.tsx`.
- Path alias `@/*` maps to the repo root (there is no `src/`).
- shadcn/ui `base-nova` style, RSC enabled. Add components with `npx shadcn@latest add <name>`; generated files land in `components/ui/` and are imported as `@/components/ui/<name>`.

## Commands (npm)

- `npm run dev` / `npm run build` / `npm run start`
- `npm run lint` — flat ESLint config in `eslint.config.mjs`; no autofix script.
- `npm run typecheck` — `tsc --noEmit`.
- `npm run format` — Prettier `--write`, but **only** `**/*.{ts,tsx}`; CSS/JSON/MD are not formatted by it.
- No test script, test framework, CI workflows, or pre-commit hooks exist here — don't go looking for them.

## Gotchas

- `cn` is the `cn` **npm package**, not a local clsx/tailwind-merge helper. shadcn components import it directly as `import { cn } from "cn"` (see `components/ui/button.tsx`); `lib/utils.ts` is only `export { cn } from "cn"` for `@/lib/utils` imports like the one in `app/layout.tsx`. Don't add auth code or a local `cn` implementation there.
- Auth config lives in `lib/auth.ts` (Mongo adapter + email/password; Google only when `GOOGLE_CLIENT_ID`/`GOOGLE_CLIENT_SECRET` are set); client helpers in `lib/auth-client.ts`. The catch-all route imports `@/lib/auth`.
- `.env` (gitignored; never commit) must define `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`, `NEXT_PUBLIC_BETTER_AUTH_URL` (used by the browser client too), and `BETTER_AUTH_DB_URL`. `BETTER_AUTH_DB_URL` must be a standard `mongodb://` Atlas URI with explicit shard hosts — **not** `mongodb+srv://`: Node's SRV DNS lookup is blocked here and makes Better Auth log index-creation errors. Replica set `atlas-6q7x6k-shard-0`, db `FixMate`.
- Prettier config: no semicolons, double quotes, LF, 2-space indent, `es5` trailing commas, width 80. `prettier-plugin-tailwindcss` sorts utility classes inside `cn(...)`/`cva(...)`.

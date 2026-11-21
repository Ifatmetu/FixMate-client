<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Stack & layout

- Next.js 16.4.5 App Router + React 19.3.1, strict TS, Tailwind v4 (tokens in `app/globals.css`; no `tailwind.config`), shadcn/ui `base-nova` with RSC. Alias `@/*` → repo root; no `src/`.
- Routes: `app/page.tsx` + `components/Home/*` (`dynamic = "force-dynamic"` so `#services` / `#how-it-works` anchors don't shift after hydration), `(auth)/sign-in|sign-up`, `dashboard/{admin,customer,technician,profile}`, `services/[id]`, `how-it-works`, and `app/api/` handlers. `app/api/checkout_sessions/success/page.tsx` is a UI page despite living under `app/api/`.
- `app/layout.tsx` is the global shell (fonts, Navbar/Footer, theme, top-right toaster); keep `suppressHydrationWarning` on `<html>`. Theme is class-based `next-themes`, system default, toggled by `components/shared/ThemeToggle.tsx` or the `d` hotkey in `components/theme-provider.tsx`.
- Add shadcn components with `npx shadcn@latest add <name>`; they land in `components/ui/` and import as `@/components/ui/<name>`. `components/ui/button.tsx` is the only primitive today and is Base UI-based — don't swap it for a raw `<button>` without a reason.

## Two-tier backend (easy to miss)

- A separate API server at `NEXT_PUBLIC_API_URL` (default `http://localhost:5000`) owns services, bookings and payments; dashboard/admin work fails with 502 when it isn't running.
- Public reads use `next.config.ts` rewrites (`/api/server/services/...`, `/api/server/bookings`); the home page fetches `${NEXT_PUBLIC_API_URL}/services/approved` directly.
- Authenticated handlers under `app/api/{admin,customer,technician}/` follow `requireApiRole([...])` + `proxyApi(...)` from `lib/api-server.ts`. Derive `customerId` / `technicianId` from the session, never from the request body; null roles are treated as `customer`.

## Auth & payments

- `lib/auth.ts` is server-only Better Auth config: Mongo db `FixMate`, email/password, `admin()` plugin owns `user.role` (default `customer`); Google is registered only when both `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` are set. `lib/auth-client.ts` exports `authClient`, `signIn`, `signUp`, `signOut`, `useSession`; `app/api/auth/[...all]/route.ts` is just `toNextJsHandler(auth)`.
- `app/(auth)/sign-in|sign-up/page.tsx` are Server Components that read `searchParams` and pass a sanitized `redirectPath` (`lib/redirect.ts`) to the client `SignInForm` / `SignUpForm`. Keep `useSearchParams` out of those client forms — Next 16 fails the production build on it.
- Sign-up sends `phone`, `area` and `signupRole` (`customer` | `technician`). The `user.create` before-hook whitelists `signupRole` into `user.role` and can never grant `admin`; `signupRole` is write-only (`returned: false`). `.github/copilot-instructions.md` is stale where it says these fields aren't persisted.
- `lib/stripe.ts` throws at import if `STRIPE_SECRET_KEY` is missing; `/api/stripe/webhook` also needs `STRIPE_WEBHOOK_SECRET`. `lib/checkout.ts` `fulfillPaidBooking` relies on the backend returning 409 for duplicate payments (webhook and success page both call it). `STRIPE_MINIMUM_BDT` defaults to 100.

## Commands

- `npm run dev` / `build` / `start`, `npm run lint`, `npm run typecheck`, `npm run format` (Prettier `--write` on `**/*.{ts,tsx}` only).
- Focused lint: `npx eslint <path>`. Type validation must be project-wide `npm run typecheck` (path aliases + Next JSX config); don't use `npx tsc --noEmit <file>`.
- `npm run make-admin -- you@example.com` loads `.env` and sets `user.role = "admin"` in the `FixMate` db; the account must exist first.
- No test script, CI workflow, or pre-commit hooks — don't invent test results.

## Environment & style gotchas

- `.env` is gitignored; never commit it. Used by code: `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL` (or `NEXT_PUBLIC_BETTER_AUTH_URL`), `NEXT_PUBLIC_BETTER_AUTH_URL` for the browser client, `BETTER_AUTH_DB_URL`, `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `NEXT_PUBLIC_API_URL`.
- `BETTER_AUTH_DB_URL` must be a plain `mongodb://` Atlas URI with explicit shard hosts — **not** `mongodb+srv://`: SRV DNS lookup is blocked here and causes index-creation errors. Replica set `atlas-6q7x6k-shard-0`, db `FixMate`.
- `cn` is the `cn` npm package (`import { cn } from "cn"`); `lib/utils.ts` only re-exports it for existing `@/lib/utils` imports. Don't add a local clsx/tailwind-merge implementation or auth code there.
- Prettier: no semicolons, double quotes, LF, 2 spaces, `es5` trailing commas, width 80; `prettier-plugin-tailwindcss` sorts classes inside `cn(...)` / `cva(...)`.

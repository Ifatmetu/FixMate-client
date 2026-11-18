# FixMate Client Copilot Instructions

## Project

- Next.js 16 App Router application using React 19 and strict TypeScript.
- Styling uses Tailwind CSS v4 and shadcn/ui (`base-nova`, RSC-enabled).
- Better Auth provides email/password and optional Google authentication through MongoDB.
- Package commands use npm and `package-lock.json`.

## Build, lint, typecheck, and format

```powershell
npm install
npm run dev
npm run build
npm run start
npm run lint
npm run typecheck
npm run format
```

- `npm run format` rewrites only `**/*.{ts,tsx}`. Do not run it for CSS or JSON files.
- Run a focused lint check for a changed file with `npx eslint <path>`.
- Do not use `npx tsc --noEmit <file>` as a substitute for the project typecheck: project-wide path aliases and Next.js JSX configuration are defined in `tsconfig.json`. Use `npm run typecheck` for type validation.
- There is currently no test runner or test script. Do not report a test result that was not run.

## Local environment

- Keep `.env*` out of commits.
- Required server auth configuration:
  - `BETTER_AUTH_DB_URL`: MongoDB connection string.
  - `NEXT_PUBLIC_BETTER_AUTH_URL`: canonical Better Auth base URL, used by both the server config and browser auth client.
- Optional Google auth:
  - `GOOGLE_CLIENT_ID`
  - `GOOGLE_CLIENT_SECRET`
- `lib/auth.ts` is the MongoDB/Better Auth server configuration. It creates a MongoDB database named `FixMate`; it throws if `BETTER_AUTH_DB_URL` is missing.
- Google authentication is registered only when both Google environment variables are present.

## Architecture

- `app/layout.tsx` is the global shell: fonts, Tailwind global CSS, theme provider, navbar, and toast container.
- `app/page.tsx` renders the home page and `components/Home/Hero.tsx`.
- Route pages live under `app/`; current auth routes are `(auth)/sign-in` and `(auth)/sign-up`.
- The catch-all `app/api/auth/[...all]/route.ts` exports Better Auth's Next.js `GET` and `POST` handlers.
- `lib/auth.ts` owns server-side auth configuration and the MongoDB adapter.
- `lib/auth-client.ts` owns browser auth configuration and exports `authClient`, plus `signIn`, `signUp`, and `useSession`.
- Shared navigation and theme components live under `components/shared/`; reusable UI primitives live under `components/ui/`.
- Theme behavior is class-based (`dark` on `<html>`), system-aware, and toggled both by `ThemeToggle` and the `d` hotkey. Preserve `suppressHydrationWarning` on the root `<html>` when changing the theme shell.

## Framework and formatting conventions

- This is not an older Next.js API surface. The installed Next.js 16.4.5 App Router behavior takes precedence over general training knowledge. Consult `node_modules/next/dist/docs/` for relevant App Router APIs before introducing or changing framework behavior.
- Use the `@/*` alias for repository-root imports.
- Mark components with `"use client"` only when they use browser APIs or React state/hooks.
- Server state and auth secrets belong in server modules such as `lib/auth.ts`; never expose MongoDB credentials or auth secrets through client components or `NEXT_PUBLIC_*` variables unless they are deliberately intended for the browser.
- Keep route handlers thin and delegate auth to the existing Better Auth catch-all.
- Prettier conventions are no semicolons, double quotes, 2-space indentation, LF, ES5 trailing commas, and 80-character width.
- Prettier's Tailwind plugin sorts Tailwind classes inside `cn(...)` and `cva(...)`.

## UI conventions

- Tailwind v4 theme tokens and CSS variables live in `app/globals.css`; there is no `tailwind.config.*`.
- Use semantic shadcn/Tailwind tokens such as `bg-background`, `text-foreground`, `text-muted-foreground`, and `border-border` for neutral surfaces.
- The existing FixMate brand palette uses blue `#1D4ED8` / `#1E3A8A` and orange `#F97316` / `#EA580C`; preserve these patterns across matching UI surfaces.
- Add shadcn components with `npx shadcn@latest add <name>`; generated components belong in `components/ui/` and should be imported through `@/components/ui/<name>`.
- `cn` is the `cn` npm package, imported directly as `import { cn } from "cn"`. `lib/utils.ts` re-exports it only for existing `@/lib/utils` imports.
- The shadcn button primitive is Base UI-based. Do not replace it with a plain HTML `<button>` without a requirement to diverge from the shared component system.
- Use `react-hot-toast` for user-facing auth/action feedback, matching the existing success/error patterns and the global top-right toast configuration.

## Authentication conventions

- Use `authClient` from `lib/auth-client.ts` for browser-side email/password and social authentication.
- On successful sign-in or sign-up navigation, use `router.push(...)` and `router.refresh()` where established in the auth pages.
- Email sign-up is allowed only through the Better Auth standard fields; `phone`, `area`, and `role` are currently collected in the sign-up UI but are not persisted by the default Better Auth configuration.
- Do not add those custom fields to `authClient.signUp.email(...)` until `lib/auth.ts` explicitly defines their server-side schema and acceptance rules.
- Google sign-in and sign-up are the same Better Auth social flow; callback URLs should currently point to `/`.

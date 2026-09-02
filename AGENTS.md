# Repository Guidelines

## Project Structure & Module Organization
Logotham is a Next.js 16 App Router app. Pages and server actions live in `app/`. Shared UI belongs to `components/`—`logo/` for the editor chrome, `ui/` for Radix wrappers, and `feedback-*` for dialogs. Helpers sit in `lib/` (Redis stats, icon catalogs) and cached JSON payloads go under `data/`. Global styles stay in `app/globals.css`, static assets in `public/`, and maintenance scripts in `scripts/` alongside standalone helpers like `check-icons-export.ts`.

**Important:** Files should not exceed 300 lines of code. If a file grows larger, split it into smaller, logical sub-components or helper modules.

## Build, Test, and Development Commands
- `bun run dev` — launches the local Next dev server on port 3000 with hot reload.
- `bun run build` — produces the production bundle used by Vercel.
- `bun run start` — serves the output of `next build` for smoke testing.
- `bun run lint` — runs the flat ESLint config (`eslint.config.mjs`) across the project.
- `bun run icons:list` — regenerates the icon catalog used by the logo builder (keeps `data/` in sync).

## Coding Style & Naming Conventions
Use TypeScript throughout. Keep React components as PascalCase arrow functions (`components/FeedbackPrompt.tsx`) and default to two-space indentation. Shared Tailwind variants belong in helper utilities or `class-variance-authority` objects. Co-locate reusable logic in `hooks/` and lean on primitives inside `components/ui/*`. ESLint (flat config via `eslint.config.mjs`) is authoritative—run it before every push.

## Testing Guidelines
Automated tests are not wired up yet, so every PR must list manual verification steps (e.g., “create logo, export PNG”). When you add logic that benefits from tests, co-locate `.test.ts(x)` files beside the module and use Vitest + React Testing Library (preferred stack once introduced); focus first on pure utilities under `lib/`. Until Playwright smoke tests are added, regression-check `/`, `/about`, and `/changelog` in both themes.

## Commit & Pull Request Guidelines
Follow the Conventional Commit prefixes already in the log (`feat:`, `refactor:`, `fix:`). Summaries stay under 72 characters; use optional scopes for clarity (`feat(logo-sidebar): add shadows`). Pull requests should link an issue when possible, describe the change set, include manual test notes, and attach before/after screenshots for UI updates in light and dark mode. Run lint/build locally and rebase on `main` before requesting review.

## Security & Configuration Tips
Secrets for Upstash Redis (`UPSTASH_REDIS_REST_URL/TOKEN`) belong in `.env.local`—never commit them. `lib/site-stats.ts` falls back to `data/site-stats.json`, so refresh that file whenever icon inventory changes. When adding analytics or feedback features, rely on server actions or route handlers to shield credentials from the browser.

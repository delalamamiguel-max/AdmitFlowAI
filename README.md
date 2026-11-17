# AdmitFlowAI

A browser-based admissions workflow prototype for rehab and sober-living operators, with an intake pipeline, SLA indicators, reports and facility/personnel matching interfaces.

## Purpose and status

The current implementation is a local prototype, not a production multi-tenant admissions service. It stores leads, users, client settings and sample data in browser `localStorage`; the lock screen uses mock authentication. Role-specific pages and client-side checks do not establish a server-enforced security boundary.

Implemented UI includes representative/admin/super-admin surfaces, intake forms, lead editing, reports, SLA timers and rule/weight-based matching. The name does not imply a connected AI model: no LLM provider integration is tracked. [PRD.md](PRD.md) is a dated requirements document; its Firebase/Firestore, cloud authentication, automated email, closed-browser push and compliance claims are not proof of implemented or validated behavior.

Reviewed November 17, 2026 against `main` at `cefd11f9e1953a3d5c77d71e14d71cd67696da99`. This review describes the tracked source, not verified production behavior. Current hosting, commercial readiness and the next owner-approved milestone remain unverified.

## Repository map

| Path | Responsibility |
|---|---|
| [src/app/](src/app/) | Public entry/layout and application routes under `/app` |
| [src/app/app/](src/app/app/) | Pipeline, reports, admin, super-admin and matchmaker pages |
| [src/components/](src/components/) | Lock screen, intake, lead cards/modals, matching and reports |
| [src/lib/store.tsx](src/lib/store.tsx) | React context, local persistence, sample data and state mutations |
| [src/lib/crypto.ts](src/lib/crypto.ts) | Browser Web Crypto key derivation and payload encryption helpers |
| [src/lib/phi-guard.ts](src/lib/phi-guard.ts) and [src/lib/sla.ts](src/lib/sla.ts) | Text heuristics and SLA calculations |
| [public/manifest.json](public/manifest.json), [public/sw.js](public/sw.js) | PWA metadata, caching and local notification handlers |
| [PRD.md](PRD.md) | Product intent, phased scope and unvalidated assumptions |

## Architecture and integrations

One Next.js 16 App Router application uses React 19, TypeScript, custom CSS and Lucide. `ClientProviders` installs the local `LeadProvider`; the app layout renders the lock screen until local state is unlocked. The intake form encrypts selected payload fields through Web Crypto before storing a lead; operational fields and other store records are separate. This is not evidence that all local data is encrypted.

The tracked manifest has no Firebase SDK, database client, payment provider or messaging SDK, and no application API routes are tracked. The service worker caches successful same-origin GET responses and handles local messages; that alone does not implement remote push delivery. Data is browser-specific, with no demonstrated cross-device synchronization or server recovery.

## Setup and environments

For future authorized prototype development, use Node.js/npm compatible with the pinned Next.js version, install with `npm ci`, and start with `npm run dev`. The default development URL is [localhost:3000](http://localhost:3000). No root Node-version pin, environment template or runtime environment variables are tracked.

Use a disposable browser profile and fictional data only. Opening the prototype can initialize browser-local sample records and register a service worker. Do not treat a mock sign-in as identity verification, reuse a real password, connect real patient data, or provision the PRD's proposed backend as part of README work.

## Safe commands

For documentation work, inspect the repository without starting the application:

```sh
git status --short --branch
git ls-tree -r --name-only HEAD
git diff --check
git diff -- README.md
git diff --cached --name-only
```

Use an isolated documentation branch and stage only `README.md`. The package commands described elsewhere are for separately authorized development; none needs to run for a README edit. Preserve existing work and do not run installs, builds, tests, provider requests or deployment commands during documentation maintenance.

## Testing and validation

The manifest defines `dev`, `build` (`next build`), `start` (`next start`) and `lint` (`eslint`). No test suite, standalone typecheck script or CI workflow is tracked. Root `fix_*.py`, `patch_*.py`, `rename_pipeline.py`, `style_dashboard_icons.py` and `update_dashboard.py` are source-rewriting utilities, not validation commands; do not execute them as setup or repair shortcuts.

This README pass checked document structure, relative links, original-link preservation and README-only diffs. No application tests, lint, type checks, builds, browser flows or live services were run.

## Deployment and rollback

No provider-specific deployment configuration, canonical domain or staging-to-production workflow is tracked. `next.config.ts` contains default configuration. `build`/`start` describe a Next.js server lifecycle, but no build was performed here and the application is not certified for production use.

A future code rollback must also consider browser-local data and service-worker caches; restoring server code does not restore deleted local records. No backup/recovery mechanism for those records is established in this tree.

README changes can still trigger hosting automation when pushed. Keep this documentation branch local until publication is approved with a confirmed no-deployment path. No settings, deployments, merges or databases are changed by this documentation pass. For a documentation rollback, propose a reviewed revert of the README commit.

## Risks and guardrails

- Keep real patient, clinical, insurance and personal data out of the prototype and this public repository. Preserve existing fixtures during documentation work.
- Mock authentication, browser storage, encryption helpers and regex checks are not a validated access-control or compliance system. The PRD's regulatory-scope assertions require separate qualified review; do not repeat them as an achieved property.
- Matching output is prototype logic, not validated treatment suitability or clinical guidance. Reports reflect the local dataset, not verified business results.
- Never publish passphrases, private records or authenticated traces. No database, provider or production configuration changes are authorized by README maintenance.

## Related documentation

- [PRD](PRD.md): historical product requirements; compare each proposed integration with source.
- [AGENTS.md](AGENTS.md) and [CLAUDE.md](CLAUDE.md): framework guidance before code changes. No tracked `.agents/skills` directory is present.
- [Package scripts](package.json), [Next.js configuration](next.config.ts) and [ESLint configuration](eslint.config.mjs).

The application was bootstrapped with `create-next-app`. No root license file or separate operations runbook is tracked; this edit does not add a license.

### Framework references retained from the starter

The original framework links are preserved for background; generic starter instructions do not establish this project's deployed behavior.

- [Next.js](https://nextjs.org)
- [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app)
- [http://localhost:3000](http://localhost:3000)
- [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts)
- [Geist](https://vercel.com/font)
- [Next.js Documentation](https://nextjs.org/docs)
- [Learn Next.js](https://nextjs.org/learn)
- [the Next.js GitHub repository](https://github.com/vercel/next.js)
- [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme)
- [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying)

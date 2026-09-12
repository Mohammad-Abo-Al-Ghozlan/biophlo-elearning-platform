# BIOPHLO E-learning Platform

Production-oriented, frontend-only implementation of the BIOPHLO learning platform. It contains the complete 134-page product surface defined in the supplied page plan: 37 public pages, 25 learner pages, and 72 administration pages.

## Run locally

```bash
npm install
npm run dev
```

Open `http://127.0.0.1:4173` (or the next port printed by Vite).

## Quality checks

```bash
npm run verify:routes
npm run typecheck
npm run lint
npm run build
npm run preview
```

## Architecture

- React 19, TypeScript, Vite, and React Router
- Shared public, learner, and administration shells
- Typed route inventory in `src/data/pageInventory.ts`
- Reusable modal, toast, navigation, table, form, and status patterns
- Local browser persistence for interactive drafts and preferences
- Responsive layouts and keyboard-accessible interactive controls
- Static bundled assets; no API server, database, authentication service, or other backend code

The landing page follows the supplied BIOPHLO reference composition and content from hero through footer. Internal product areas use the same teal, amber, and navy visual system while prioritizing dense real-world workflows such as course curriculum, pricing, publishing, learner progress, billing, media, security, support, and reporting.

## Frontend-only behavior

Forms, editing actions, filters, notifications, course progress, preferences, and administrative workflows behave locally. Persistence uses `localStorage` where retaining state improves the demonstration. Payment, email, account authentication, file upload, and publishing actions are intentionally simulated in the browser because this repository contains no backend.

## Authors

Developed by the **BIOPHLO Project Development Team**:

- **Mohammad Abo Al Ghozlan**
- **Somaya Al Minawi**
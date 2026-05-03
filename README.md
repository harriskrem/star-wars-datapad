# Star Wars Datapad

A small handheld for the Star Wars galaxy: browse characters and films, mark favourites, and revisit them later. Built as the deliverable for a frontend technical assessment.

> **Live URL:** _to be added once deployed to Vercel_

---

## Quick start

```sh
yarn install
yarn dev          # start the dev server (http://localhost:5173)
yarn test         # run the test suite
yarn typecheck    # tsc -b
yarn lint         # eslint
yarn format       # prettier --write .
yarn build        # production build into dist/
```

Requires **Node 22** (see [`.nvmrc`](./.nvmrc)) and **Yarn 4** via Corepack (`corepack enable`). The `packageManager` field in `package.json` pins Yarn 4.13.

---

## Stack

- **React 19** + **TypeScript** (strict)
- **Vite 8** as the build tool
- **Tailwind CSS v4** + **shadcn/ui** (with Base UI under the hood) + **Lucide** icons
- **React Router v7** for routing
- **TanStack Query** + **Zustand** for state (introduced in later tickets)
- **react-error-boundary** for unhandled-render recovery
- **Vitest** + **React Testing Library** + **vitest-axe** + **MSW** for tests
- **ESLint** (with `jsx-a11y`) + **Prettier** for code quality
- **GitHub Actions** for CI; **Vercel** for hosting

---

## Scope

In scope for the finished product:

- Browse characters and films as paginated, searchable lists.
- Read full detail for any character or film, including links to related items.
- Mark any character or film as a favourite, from any card or detail page.
- Persist favourites in the browser; sync across open tabs; survive page reload.
- See a dedicated favourites destination grouped by type and sorted newest-first.
- Loading skeletons, empty states, inline error states with retry, toast on actions, and a custom 404.
- Responsive from a 360 px viewport up; dark theme.

Deliberately out of scope: planets/species/vehicles/starships as their own browsable pages, light theme, authentication, internationalisation, and offline beyond cached snapshots. (Full list of design decisions lives in the planning docs alongside this repository.)

---

## Architecture

The app is a pure client-side single-page application served as a static bundle. It fetches Star Wars data from [`swapi.info`](https://swapi.info), which serves the same data as the better-known `swapi.dev` but with a valid TLS certificate. Because `swapi.info` returns flat arrays without pagination or search parameters, both pagination and search are implemented client-side over a fetched-once-and-cached list. Favourites are persisted in `localStorage` via Zustand, with cross-tab sync and graceful in-memory fallback when storage is blocked.

Module structure (so far):

- `src/routes/` — route table and URL constants.
- `src/layout/` — top-level layout, header, primary navigation.
- `src/pages/` — the page components mounted by the router.
- `src/components/` — `ui/` for shadcn primitives, `error/` for the global ErrorBoundary.
- `src/lib/` — small utilities (`cn`, etc.).
- `src/test/` — test setup and the `renderWithApp` helper that absorbs provider plumbing.

---

## Testing

```sh
yarn test          # run once
yarn test:watch    # watch mode
```

The suite combines unit tests on hooks/utilities, component tests on UI primitives, and integration tests over MSW-mocked API responses. Accessibility violations on rendered components are caught by `vitest-axe`. End-to-end tests (Playwright) are deliberately out of scope.

---

## Accessibility

- shadcn/ui primitives wrap **Base UI** for keyboard navigation, focus management, and ARIA defaults.
- `eslint-plugin-jsx-a11y` enforces best practices in lint.
- `vitest-axe` runs axe-core against every rendered component in the test suite.
- Animations are gated behind Tailwind's `motion-safe:` variant so they respect `prefers-reduced-motion`.

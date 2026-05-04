# Star Wars Datapad

A small handheld for browsing the Star Wars galaxy. Look up characters and films, favourite the ones you want to come back to.

> **Live URL:** [star-wars-datapad.vercel.app](https://star-wars-datapad.vercel.app/)

---

## Quick start

```sh
yarn install
yarn dev              # start the dev server (http://localhost:5173)
yarn test             # run the test suite
yarn test:watch       # watch mode
yarn test:coverage    # run with coverage report (HTML in coverage/index.html)
yarn typecheck        # tsc -b
yarn lint             # eslint
yarn format           # prettier --write .
yarn build            # production build into dist/
```

Requires Node 20+ and Yarn 4+.

---

## Stack

- React 19 + TypeScript (strict mode) on Vite 8
- Tailwind CSS v4, shadcn/ui (with Base UI primitives), Lucide icons
- React Router v7 for routing, TanStack Query for server state, Zustand (with `persist`) for the favourites store
- react-error-boundary at the app root
- Sonner for toasts
- Vitest, React Testing Library, vitest-axe, and MSW for tests
- ESLint (with `jsx-a11y`) and Prettier

---

## Features

- Paginated, searchable browsing of all 82 characters and 6 films
- Detail page for every character and film, with links to related items
- Favouriting from any card or detail page, persistent across reloads
- Cross-tab sync: toggling a favourite in one tab updates the others
- In-memory fallback when the browser blocks local storage, with a banner so the limitation is visible
- A `/favourites` page grouped by type, ordered newest first, with a "no longer available" indicator for stale entries
- Loading skeletons, empty states, inline error states with retry, success toasts, and a 404 (in-shell for unknown ids, dedicated page for unmatched routes)

---

## Design notes

**Datapad identity.** Dark theme only, uppercase display headings, mono "SECTION" labels above each page title, responsive from 360px up.

**Cross-tab favourite sync.** Zustand's `persist` middleware doesn't sync across tabs by default; a small `storage` event listener covers it.

**Snapshot-in-favourite.** Each favourite stores its name and a few summary fields at the time it's added, so `/favourites` renders without re-fetching. Items that have since disappeared from the API are still recognisable.

**In-memory fallback for blocked storage.** If local storage is unavailable (incognito, strict privacy settings), favourites still work for the session. A persistent banner explains why they won't survive a reload.

---

## A note on the API

The app uses [`swapi.info`](https://swapi.info), not `swapi.dev`. The latter's TLS certificate has been expired for a long time and modern browsers hard-block it; `swapi.info` is the maintained mirror with the same data.

---

## Testing

```sh
yarn test             # run once
yarn test:watch       # watch mode
yarn test:coverage    # with coverage report; open coverage/index.html
```

Mostly integration tests with MSW mocking the API:

- Unit tests for the favourites store, persistence layer, and pure utilities
- Component tests where isolation helps (e.g. `RootErrorBoundary`)
- Integration tests for every page (lists, details, favourites)
- An axe sweep with `vitest-axe` over the home page, both list pages, both detail pages, the favourites page (empty and populated), and the 404

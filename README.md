# Star Wars Datapad

A small handheld for the Star Wars galaxy: browse characters and films, mark favourites you want to revisit, and access them later.

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

Requires **Node 20+** and **Yarn 4+**.

---

## Stack

- **React 19** + **TypeScript** (strict mode) on **Vite 8**
- **Tailwind CSS v4** + **shadcn/ui** (with Base UI primitives) + **Lucide** icons
- **React Router v7** for routing; **TanStack Query** for server state; **Zustand** (with `persist`) for the favourites store
- **react-error-boundary** wrapping the app for unhandled-render recovery
- **Sonner** for toasts
- **Vitest** + **React Testing Library** + **vitest-axe** + **MSW** for tests
- **ESLint** (with `jsx-a11y`) + **Prettier**

---

## Features

- Paginated, searchable browsing of all 82 characters and 6 films
- Detail page for every character and film, including links to related items
- Favouriting from any card or detail page; persistent across page reloads
- Cross-tab sync — toggling a favourite in one tab updates the others
- Graceful degradation when the browser blocks local storage (in-memory fallback + persistent banner)
- Dedicated `/favourites` destination grouped by type, ordered newest-first, with a "no longer available" indicator for stale entries
- Loading skeletons, empty states, inline error states with retry, success toasts, and a distinguished 404 (in-shell for unknown ids, dedicated page for unmatched routes)
- Responsive from 360px viewport up; dark theme

---

## API note: `swapi.info`, not `swapi.dev`

The app fetches Star Wars data from [`swapi.info`](https://swapi.info) rather than the more famous `swapi.dev`. Reason: `swapi.dev`'s TLS certificate is expired, which means browsers hard-block all requests to it (no client-side workaround possible). `swapi.info` is the maintained mirror with the same data and a valid certificate.

---

## Testing

```sh
yarn test             # run once
yarn test:watch       # watch mode
yarn test:coverage    # with coverage report; open coverage/index.html
```

The suite has **54 tests across 12 files**, combining:

- **Unit tests** on the favourites store, persistence layer, and pure utilities
- **Component tests** in isolation where they earn their keep (e.g. `RootErrorBoundary`)
- **Integration tests** over MSW-mocked API responses for every page (lists, details, favourites)
- **An axe sweep** running `vitest-axe` against the home page, both list pages, both detail pages, the favourites page (empty and populated), and the 404

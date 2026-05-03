import { NavLink } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { paths } from '@/routes/paths'
import { selectFavouritesCount, useFavouritesStore } from '@/stores/favouritesStore'

type NavItem = { to: string; label: string }

const items: NavItem[] = [
  { to: paths.characters, label: 'Characters' },
  { to: paths.films, label: 'Films' },
  { to: paths.favourites, label: 'Favourites' },
]

export default function Nav() {
  const favouritesCount = useFavouritesStore(selectFavouritesCount)

  return (
    <nav aria-label="Primary">
      <ul className="flex items-center gap-1 sm:gap-2">
        {items.map((item) => (
          <li key={item.to}>
            <NavLink
              to={item.to}
              className={({ isActive }) =>
                cn(
                  'focus-visible:ring-brand inline-flex items-center gap-1.5 rounded-md px-2 py-1.5 text-sm transition-colors focus-visible:ring-2 focus-visible:outline-none sm:px-3',
                  isActive
                    ? 'text-foreground bg-muted'
                    : 'text-muted-foreground hover:text-foreground',
                )
              }
            >
              {item.label}
              {item.to === paths.favourites && favouritesCount > 0 && (
                <span
                  data-testid="favourites-count-badge"
                  aria-label={`${favouritesCount} favourited`}
                  className="bg-brand text-background inline-flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 font-mono text-xs leading-none font-semibold"
                >
                  {favouritesCount}
                </span>
              )}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  )
}

import { NavLink } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { paths } from '@/routes/paths'

type NavItem = { to: string; label: string }

const items: NavItem[] = [
  { to: paths.characters, label: 'Characters' },
  { to: paths.films, label: 'Films' },
  { to: paths.favourites, label: 'Favourites' },
]

export default function Nav() {
  return (
    <nav aria-label="Primary">
      <ul className="flex items-center gap-1 sm:gap-2">
        {items.map((item) => (
          <li key={item.to}>
            <NavLink
              to={item.to}
              className={({ isActive }) =>
                cn(
                  'focus-visible:ring-brand inline-flex items-center rounded-md px-2 py-1.5 text-sm transition-colors focus-visible:ring-2 focus-visible:outline-none sm:px-3',
                  isActive
                    ? 'text-foreground bg-muted'
                    : 'text-muted-foreground hover:text-foreground',
                )
              }
            >
              {item.label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  )
}

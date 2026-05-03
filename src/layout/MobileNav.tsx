import { useState } from 'react'
import { Menu } from 'lucide-react'
import { NavLink } from 'react-router-dom'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { selectFavouritesCount, useFavouritesStore } from '@/stores/favouritesStore'
import { cn } from '@/lib/utils'
import { paths } from '@/routes/paths'

type NavItem = { to: string; label: string }

const items: NavItem[] = [
  { to: paths.characters, label: 'Characters' },
  { to: paths.films, label: 'Films' },
  { to: paths.favourites, label: 'Favourites' },
]

export default function MobileNav() {
  const [open, setOpen] = useState(false)
  const favouritesCount = useFavouritesStore(selectFavouritesCount)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        render={
          <button
            type="button"
            aria-label="Open menu"
            className="hover:bg-muted focus-visible:ring-brand inline-flex h-10 w-10 items-center justify-center rounded-md transition-colors focus-visible:ring-2 focus-visible:outline-none"
          >
            <Menu className="size-5" />
          </button>
        }
      />
      <SheetContent side="right" className="w-72">
        <SheetHeader>
          <SheetTitle className="font-display text-lg tracking-wide uppercase">Menu</SheetTitle>
          <SheetDescription className="sr-only">
            Primary navigation for the Star Wars Datapad.
          </SheetDescription>
        </SheetHeader>
        <nav aria-label="Primary" className="px-2 pb-4">
          <ul className="flex flex-col gap-1">
            {items.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    cn(
                      'focus-visible:ring-brand flex items-center justify-between rounded-md px-3 py-2 text-base transition-colors focus-visible:ring-2 focus-visible:outline-none',
                      isActive
                        ? 'text-foreground bg-muted'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted/60',
                    )
                  }
                >
                  <span>{item.label}</span>
                  {item.to === paths.favourites && favouritesCount > 0 && (
                    <span
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
      </SheetContent>
    </Sheet>
  )
}

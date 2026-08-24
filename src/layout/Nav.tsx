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
import { navSections } from '@/config/resources'
import { paths } from '@/routes/paths'

/** `bar` is the horizontal desktop nav; `drawer` is the mobile sheet. */
type NavVariant = 'bar' | 'drawer'

const listStyles: Record<NavVariant, string> = {
  bar: 'flex items-center gap-1 sm:gap-2',
  drawer: 'flex flex-col gap-1',
}

const linkStyles: Record<NavVariant, string> = {
  bar: 'inline-flex items-center gap-1.5 px-2 py-1.5 text-sm sm:px-3',
  drawer: 'flex items-center justify-between px-3 py-2 text-base',
}

const idleStyles: Record<NavVariant, string> = {
  bar: 'text-muted-foreground hover:text-foreground',
  drawer: 'text-muted-foreground hover:text-foreground hover:bg-muted/60',
}

function NavList({ variant, onNavigate }: { variant: NavVariant; onNavigate?: () => void }) {
  const favouritesCount = useFavouritesStore(selectFavouritesCount)

  return (
    <ul className={listStyles[variant]}>
      {navSections.map((item) => (
        <li key={item.to}>
          <NavLink
            to={item.to}
            viewTransition
            onClick={onNavigate}
            className={({ isActive }) =>
              cn(
                'focus-ring rounded-md transition-colors',
                linkStyles[variant],
                isActive ? 'text-foreground bg-muted' : idleStyles[variant],
              )
            }
          >
            <span>{item.label}</span>
            {item.to === paths.favourites && favouritesCount > 0 && (
              <span
                // Both variants are always in the DOM (only CSS hides one), so
                // exactly one may carry the testid or getByTestId sees two nodes.
                data-testid={variant === 'bar' ? 'favourites-count-badge' : undefined}
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
  )
}

export default function Nav() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <nav aria-label="Primary" className="hidden md:block">
        <NavList variant="bar" />
      </nav>

      <div className="md:hidden">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger
            render={
              <button
                type="button"
                aria-label="Open menu"
                className="focus-ring hover:bg-muted inline-flex h-10 w-10 items-center justify-center rounded-md transition-colors"
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
            {/* Named "Menu", not "Primary": the bar above already owns that
                landmark name and both are in the tree while the sheet is open. */}
            <nav aria-label="Menu" className="px-2 pb-4">
              <NavList variant="drawer" onNavigate={() => setOpen(false)} />
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </>
  )
}

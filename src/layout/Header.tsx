import { Link } from 'react-router-dom'
import Nav from '@/layout/Nav'
import MobileNav from '@/layout/MobileNav'
import { paths } from '@/routes/paths'

export default function Header() {
  return (
    <header className="border-border/60 bg-background h-16 shrink-0 border-b">
      <div className="mx-auto flex h-full max-w-6xl items-center justify-between gap-3 px-4">
        <Link
          to={paths.home}
          className="focus-visible:ring-brand inline-flex items-baseline gap-1.5 rounded-md focus-visible:ring-2 focus-visible:outline-none"
        >
          <span className="font-display text-lg tracking-wide uppercase sm:text-xl">Star Wars</span>
          <span className="text-muted-foreground hidden font-mono text-xs tracking-widest uppercase sm:inline">
            Datapad
          </span>
        </Link>
        <div className="hidden md:block">
          <Nav />
        </div>
        <div className="md:hidden">
          <MobileNav />
        </div>
      </div>
    </header>
  )
}

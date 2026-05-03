import { Link } from 'react-router-dom'
import Nav from '@/layout/Nav'
import { paths } from '@/routes/paths'

export default function Header() {
  return (
    <header className="border-border/60 bg-background/90 sticky top-0 z-10 border-b backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
        <Link
          to={paths.home}
          className="focus-visible:ring-brand inline-flex items-baseline gap-1.5 rounded-md focus-visible:ring-2 focus-visible:outline-none"
        >
          <span className="text-base font-semibold tracking-tight sm:text-lg">
            Star Wars
          </span>
          <span className="text-muted-foreground font-mono text-xs tracking-widest uppercase">
            Datapad
          </span>
        </Link>
        <Nav />
      </div>
    </header>
  )
}

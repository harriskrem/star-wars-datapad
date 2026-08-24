import { Link } from 'react-router-dom'
import Nav from '@/layout/Nav'
import { paths } from '@/routes/paths'

export default function Header() {
  return (
    <header className="border-border/60 bg-background h-16 shrink-0 border-b">
      <div className="shell-bar">
        <Link
          to={paths.home}
          viewTransition
          className="focus-ring inline-flex items-baseline gap-1.5 rounded-md"
        >
          <span className="font-display text-lg tracking-wide uppercase sm:text-xl">Star Wars</span>
          <span className="kicker hidden sm:inline">Datapad</span>
        </Link>
        <Nav />
      </div>
    </header>
  )
}

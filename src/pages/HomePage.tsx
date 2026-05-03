import { Link } from 'react-router-dom'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useCharacters } from '@/queries/useCharacters'
import { useFilms } from '@/queries/useFilms'
import { selectFavouritesCount, useFavouritesStore } from '@/stores/favouritesStore'
import { paths } from '@/routes/paths'

export default function HomePage() {
  const characters = useCharacters()
  const films = useFilms()
  const favouritesCount = useFavouritesStore(selectFavouritesCount)

  const sections = [
    {
      to: paths.characters,
      title: 'Characters',
      count: characters.data?.length,
      description: 'Browse every character in the canon, search by name, dig into details.',
    },
    {
      to: paths.films,
      title: 'Films',
      count: films.data?.length,
      description: 'The six saga films — episodes, release dates, opening crawls.',
    },
    {
      to: paths.favourites,
      title: 'Favourites',
      count: favouritesCount,
      description: 'Your bookmarked characters and films, persisted in this browser.',
    },
  ]

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-12 px-4 py-12 sm:py-16">
      <header className="flex flex-col gap-4">
        <p className="text-muted-foreground font-mono text-xs tracking-widest uppercase">Datapad</p>
        <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
          A handheld for the Star&nbsp;Wars galaxy.
        </h1>
        <p className="text-muted-foreground max-w-prose text-lg">
          Browse characters and films. Mark favourites you want to revisit. Everything you do here
          lives in this browser.
        </p>
      </header>

      <nav aria-label="Sections" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {sections.map((s) => (
          <Link
            key={s.to}
            to={s.to}
            className="focus-visible:ring-brand group rounded-xl focus-visible:ring-2 focus-visible:outline-none"
          >
            <Card className="group-hover:border-brand/40 h-full transition-colors">
              <CardHeader>
                <CardTitle className="flex items-baseline gap-2 text-2xl">
                  <span className="font-display tracking-wide uppercase">{s.title}</span>
                  {s.count !== undefined && (
                    <span className="text-muted-foreground font-mono text-base">· {s.count}</span>
                  )}
                </CardTitle>
                <CardDescription>{s.description}</CardDescription>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </nav>
    </div>
  )
}

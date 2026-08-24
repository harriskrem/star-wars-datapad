import { Link } from 'react-router-dom'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useCharacters } from '@/queries/useCharacters'
import { useFilms } from '@/queries/useFilms'
import { selectFavouritesCount, useFavouritesStore } from '@/stores/favouritesStore'
import { navSections, resources } from '@/config/resources'
import { paths } from '@/routes/paths'

const descriptions: Record<string, string> = {
  [resources.character.listPath]:
    'Browse every character in the canon, search by name, dig into details.',
  [resources.film.listPath]: 'The six saga films — episodes, release dates, opening crawls.',
  [paths.favourites]: 'Your bookmarked characters and films, persisted in this browser.',
}

export default function HomePage() {
  const characters = useCharacters()
  const films = useFilms()
  const favouritesCount = useFavouritesStore(selectFavouritesCount)

  const counts: Record<string, number | undefined> = {
    [resources.character.listPath]: characters.data?.length,
    [resources.film.listPath]: films.data?.length,
    [paths.favourites]: favouritesCount,
  }

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-12 px-4 py-12 sm:py-16">
      <header className="flex max-w-2xl flex-col gap-6">
        <p className="kicker">Overview</p>
        <h1 className="font-display text-5xl leading-[1.05] tracking-wide text-balance uppercase sm:text-6xl lg:text-7xl">
          A handheld for the Star&nbsp;Wars galaxy.
        </h1>
        <p className="text-muted-foreground max-w-prose text-lg">
          Browse characters and films. Mark favourites you want to revisit. Everything you do here
          lives in this browser.
        </p>
      </header>

      <nav aria-label="Sections" className="card-grid">
        {navSections.map((section) => {
          const count = counts[section.to]
          return (
            <Link
              key={section.to}
              to={section.to}
              viewTransition
              className="group rounded-xl focus-visible:outline-none"
            >
              <Card className="card-glow h-full">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-2xl">
                    <span className="font-display tracking-wide uppercase">{section.label}</span>
                    {!!count && (
                      <span className="text-muted-foreground group-hover:text-brand group-focus-visible:text-brand ease-out-expo font-mono text-base transition-colors duration-200">
                        · {count}
                      </span>
                    )}
                  </CardTitle>
                  <CardDescription>{descriptions[section.to]}</CardDescription>
                </CardHeader>
              </Card>
            </Link>
          )
        })}
      </nav>
    </div>
  )
}

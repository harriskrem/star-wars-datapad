import { Link } from 'react-router-dom'
import { useCharacter } from '@/queries/useCharacters'
import { useFilm } from '@/queries/useFilms'
import { ApiError } from '@/api/types'
import { useFavouritesStore, type Favourite } from '@/stores/favouritesStore'
import EmptyState from '@/components/common/EmptyState'
import FavouriteToggle from '@/components/common/FavouriteToggle'
import { buttonVariants } from '@/components/ui/button'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'
import { toRomanNumeral } from '@/lib/romanNumeral'
import { paths } from '@/routes/paths'

export default function FavouritesPage() {
  const items = useFavouritesStore((s) => s.items)

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-12">
        <header className="mb-8 flex flex-col gap-2">
          <p className="text-muted-foreground font-mono text-xs tracking-widest uppercase">
            Section
          </p>
          <h1 className="font-display text-4xl tracking-wide uppercase sm:text-5xl">Favourites</h1>
        </header>
        <EmptyState
          title="No favourites yet"
          description="Star characters and films you want to revisit."
          cta={
            <Link
              to={paths.characters}
              viewTransition
              className={cn(buttonVariants(), 'h-9 px-4')}
            >
              Browse characters
            </Link>
          }
        />
      </div>
    )
  }

  const sorted = [...items].sort((a, b) => b.addedAt - a.addedAt)
  const characters = sorted.filter((i) => i.type === 'character')
  const films = sorted.filter((i) => i.type === 'film')

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <header className="mb-8 flex flex-col gap-2">
        <p className="text-muted-foreground font-mono text-xs tracking-widest uppercase">Section</p>
        <h1 className="font-display text-4xl tracking-wide uppercase sm:text-5xl">Favourites</h1>
      </header>

      {characters.length > 0 && (
        <FavouritesSection title={`Characters · ${characters.length}`}>
          {characters.map((fav) => (
            <CharacterFavouriteEntry key={fav.id} fav={fav} />
          ))}
        </FavouritesSection>
      )}

      {films.length > 0 && (
        <FavouritesSection title={`Films · ${films.length}`}>
          {films.map((fav) => (
            <FilmFavouriteEntry key={fav.id} fav={fav} />
          ))}
        </FavouritesSection>
      )}
    </div>
  )
}

function FavouritesSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-10 first:mt-0">
      <h2 className="mb-4 text-sm font-semibold tracking-widest uppercase">{title}</h2>
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{children}</ul>
    </section>
  )
}

function CharacterFavouriteEntry({ fav }: { fav: Favourite }) {
  const q = useCharacter(fav.id)
  const isMissing = q.isError && q.error instanceof ApiError && q.error.status === 404
  const name = q.data?.name ?? fav.snapshot.name
  const birthYear = q.data?.birth_year ?? fav.snapshot.birth_year ?? '—'

  return (
    <FavouriteEntryShell
      type="character"
      id={fav.id}
      name={name}
      isMissing={isMissing}
      detailHref={paths.characterDetail(fav.id)}
      snapshot={fav.snapshot}
    >
      <span className="bg-muted text-foreground inline-flex items-center rounded-md px-2 py-0.5 font-mono text-xs">
        {birthYear}
      </span>
    </FavouriteEntryShell>
  )
}

function FilmFavouriteEntry({ fav }: { fav: Favourite }) {
  const q = useFilm(fav.id)
  const isMissing = q.isError && q.error instanceof ApiError && q.error.status === 404
  const name = q.data?.title ?? fav.snapshot.name
  const episodeId = q.data?.episode_id ?? fav.snapshot.episode_id

  return (
    <FavouriteEntryShell
      type="film"
      id={fav.id}
      name={name}
      isMissing={isMissing}
      detailHref={paths.filmDetail(fav.id)}
      snapshot={fav.snapshot}
    >
      {typeof episodeId === 'number' && (
        <span className="bg-muted text-foreground inline-flex items-center rounded-md px-2 py-0.5 font-mono text-xs">
          Episode {toRomanNumeral(episodeId)}
        </span>
      )}
    </FavouriteEntryShell>
  )
}

function FavouriteEntryShell({
  type,
  id,
  name,
  isMissing,
  detailHref,
  snapshot,
  children,
}: {
  type: 'character' | 'film'
  id: string
  name: string
  isMissing: boolean
  detailHref: string
  snapshot: Favourite['snapshot']
  children?: React.ReactNode
}) {
  const cardInner = (
    <Card
      className={cn(
        'relative h-full transition duration-[120ms] ease-out group-hover:shadow-sm group-hover:ring-foreground/30 motion-safe:group-hover:-translate-y-0.5',
        isMissing && 'opacity-70',
      )}
    >
      <div className="absolute top-1 right-1">
        <FavouriteToggle type={type} id={id} itemName={name} snapshot={snapshot} />
      </div>
      <CardHeader>
        <CardTitle className="font-display pr-12 text-xl tracking-wide uppercase">{name}</CardTitle>
        <CardDescription className="flex flex-wrap items-center gap-x-2 gap-y-1 pt-1">
          {children}
          {isMissing && (
            <Tooltip>
              <TooltipTrigger
                render={
                  <span className="border-border text-muted-foreground inline-flex cursor-help items-center rounded-md border px-2 py-0.5 text-xs">
                    No longer available
                  </span>
                }
              />
              <TooltipContent>This item is no longer in the Star Wars database.</TooltipContent>
            </Tooltip>
          )}
        </CardDescription>
      </CardHeader>
    </Card>
  )

  return (
    <li>
      {isMissing ? (
        cardInner
      ) : (
        <Link
          to={detailHref}
          viewTransition
          className="focus-visible:ring-brand group block rounded-xl focus-visible:ring-2 focus-visible:outline-none"
        >
          {cardInner}
        </Link>
      )}
    </li>
  )
}

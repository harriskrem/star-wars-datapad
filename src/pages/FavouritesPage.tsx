import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { useCharacter } from '@/queries/useCharacters'
import { useFilm } from '@/queries/useFilms'
import { isNotFound } from '@/api/types'
import { useFavouritesStore, type Favourite } from '@/stores/favouritesStore'
import ButtonLink from '@/components/common/ButtonLink'
import EmptyState from '@/components/common/EmptyState'
import MetaBadge from '@/components/common/MetaBadge'
import ResourceCard from '@/components/common/ResourceCard'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { toRomanNumeral } from '@/lib/romanNumeral'
import { resources } from '@/config/resources'
import { paths } from '@/routes/paths'

export default function FavouritesPage() {
  const items = useFavouritesStore((s) => s.items)

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-12">
        <FavouritesHeading />
        <EmptyState
          title="No favourites yet"
          description="Star characters and films you want to revisit."
          cta={<ButtonLink to={paths.characters}>Browse characters</ButtonLink>}
        />
      </div>
    )
  }

  const sorted = [...items].sort((a, b) => b.addedAt - a.addedAt)
  const characters = sorted.filter((i) => i.type === 'character')
  const films = sorted.filter((i) => i.type === 'film')

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <FavouritesHeading />

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

function FavouritesHeading() {
  return (
    <header className="mb-8">
      <h1 className="font-display text-4xl tracking-wide uppercase sm:text-5xl">Favourites</h1>
    </header>
  )
}

function FavouritesSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="mt-10 first:mt-0">
      <h2 className="mb-4 text-sm font-semibold tracking-widest uppercase">{title}</h2>
      <ul className="card-grid">{children}</ul>
    </section>
  )
}

// The two entries below exist only because each needs its own query hook —
// everything they render is shared by FavouriteEntry.

function CharacterFavouriteEntry({ fav }: { fav: Favourite }) {
  const q = useCharacter(fav.id)

  return (
    <FavouriteEntry
      fav={fav}
      isMissing={isNotFound(q.error)}
      title={q.data?.name ?? fav.snapshot.name}
    >
      <MetaBadge>{q.data?.birth_year ?? fav.snapshot.birth_year ?? '—'}</MetaBadge>
    </FavouriteEntry>
  )
}

function FilmFavouriteEntry({ fav }: { fav: Favourite }) {
  const q = useFilm(fav.id)
  const episodeId = q.data?.episode_id ?? fav.snapshot.episode_id

  return (
    <FavouriteEntry
      fav={fav}
      isMissing={isNotFound(q.error)}
      title={q.data?.title ?? fav.snapshot.name}
    >
      {typeof episodeId === 'number' && <MetaBadge>Episode {toRomanNumeral(episodeId)}</MetaBadge>}
    </FavouriteEntry>
  )
}

function FavouriteEntry({
  fav,
  title,
  isMissing,
  children,
}: {
  fav: Favourite
  title: string
  isMissing: boolean
  children?: ReactNode
}) {
  const card = (
    <ResourceCard
      type={fav.type}
      id={fav.id}
      title={title}
      snapshot={fav.snapshot}
      titleSize="sm"
      dimmed={isMissing}
    >
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
    </ResourceCard>
  )

  // A missing resource has no detail page worth linking to.
  return (
    <li>
      {isMissing ? (
        card
      ) : (
        <Link
          to={resources[fav.type].detailPath(fav.id)}
          viewTransition
          className="group block rounded-xl focus-visible:outline-none"
        >
          {card}
        </Link>
      )}
    </li>
  )
}

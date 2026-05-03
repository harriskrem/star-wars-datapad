import { Link, useParams } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { useCharacter } from '@/queries/useCharacters'
import { useFilmsByUrls } from '@/queries/useFilms'
import { ApiError } from '@/api/types'
import FavouriteToggle from '@/components/common/FavouriteToggle'
import InShellNotFound from '@/components/common/InShellNotFound'
import ListErrorState from '@/components/common/ListErrorState'
import { Skeleton } from '@/components/ui/skeleton'
import { extractIdFromUrl } from '@/lib/swapiUrl'
import { toRomanNumeral } from '@/lib/romanNumeral'
import { paths } from '@/routes/paths'

export default function CharacterDetailPage() {
  const { id = '' } = useParams<{ id: string }>()
  const { data: character, isLoading, isError, error, refetch } = useCharacter(id)
  const filmQueries = useFilmsByUrls(character?.films ?? [])

  if (isLoading) {
    return <CharacterDetailSkeleton />
  }

  if (isError) {
    if (error instanceof ApiError && error.status === 404) {
      return (
        <InShellNotFound
          resourceName="Character"
          backHref={paths.characters}
          backLabel="Back to characters"
        />
      )
    }
    return (
      <div className="mx-auto max-w-4xl px-4 py-12">
        <ListErrorState onRetry={() => refetch()} title="Couldn't load this character" />
      </div>
    )
  }

  if (!character) return null

  const otherCounts = [
    '1 homeworld',
    character.species.length && `${character.species.length} species`,
    character.vehicles.length && `${character.vehicles.length} vehicles`,
    character.starships.length && `${character.starships.length} starships`,
  ].filter(Boolean)

  return (
    <article className="mx-auto max-w-4xl px-4 py-12">
      <header className="mb-10 flex flex-col gap-3">
        <Link
          to={paths.characters}
          viewTransition
          className="text-muted-foreground hover:text-foreground focus-visible:ring-brand inline-flex w-fit items-center gap-1.5 rounded-sm font-mono text-xs tracking-widest uppercase transition-colors focus-visible:ring-2 focus-visible:outline-none"
        >
          <ArrowLeft className="size-3.5" aria-hidden="true" />
          Characters
        </Link>
        <div className="flex items-start justify-between gap-4">
          <h1 className="font-display text-5xl tracking-wide uppercase sm:text-6xl">
            {character.name}
          </h1>
          <FavouriteToggle
            type="character"
            id={id}
            itemName={character.name}
            snapshot={{ name: character.name, birth_year: character.birth_year }}
            size="lg"
          />
        </div>
        <div className="text-muted-foreground flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
          <span className="bg-muted text-foreground inline-flex items-center rounded-md px-2 py-0.5 font-mono text-xs">
            {character.birth_year}
          </span>
          <span className="capitalize">{character.gender}</span>
        </div>
      </header>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <DetailField label="Height" value={`${character.height} cm`} mono />
        <DetailField label="Mass" value={`${character.mass} kg`} mono />
        <DetailField label="Eye colour" value={character.eye_color} />
        <DetailField label="Hair colour" value={character.hair_color} />
        <DetailField label="Skin colour" value={character.skin_color} />
      </div>

      <section className="mt-10">
        <h2 className="mb-3 text-sm font-semibold tracking-widest uppercase">Films</h2>
        {character.films.length === 0 ? (
          <p className="text-muted-foreground text-sm">No films listed.</p>
        ) : (
          <ul className="flex flex-wrap gap-2">
            {filmQueries.map((q, i) => {
              if (q.isLoading) {
                return (
                  <li key={i}>
                    <Skeleton className="h-7 w-32" />
                  </li>
                )
              }
              if (!q.data) return null
              return (
                <li key={q.data.url}>
                  <Link
                    to={paths.filmDetail(extractIdFromUrl(q.data.url))}
                    viewTransition
                    className="bg-muted hover:bg-muted/70 focus-visible:ring-brand inline-flex items-center gap-1.5 rounded-md px-3 py-1 text-sm transition-colors focus-visible:ring-2 focus-visible:outline-none"
                  >
                    <span className="text-muted-foreground font-mono text-xs">
                      {toRomanNumeral(q.data.episode_id)}
                    </span>
                    <span>{q.data.title}</span>
                  </Link>
                </li>
              )
            })}
          </ul>
        )}
      </section>

      <section className="mt-10">
        <h2 className="mb-3 text-sm font-semibold tracking-widest uppercase">Other related</h2>
        <p className="text-muted-foreground text-sm">
          {otherCounts.join(' · ')} <span className="text-xs">(not browsable in this app)</span>
        </p>
      </section>
    </article>
  )
}

function DetailField({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div>
      <h2 className="text-muted-foreground mb-1 text-xs font-semibold tracking-widest uppercase">
        {label}
      </h2>
      <p className={mono ? 'font-mono text-base' : 'text-base capitalize'}>{value}</p>
    </div>
  )
}

function CharacterDetailSkeleton() {
  return (
    <article className="mx-auto max-w-4xl px-4 py-12">
      <div className="mb-10 flex flex-col gap-3">
        <Skeleton className="h-3 w-28" />
        <Skeleton className="h-12 w-2/3" />
        <Skeleton className="h-4 w-32" />
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-5 w-24" />
          </div>
        ))}
      </div>
      <div className="mt-10 space-y-2">
        <Skeleton className="h-4 w-12" />
        <div className="flex gap-2">
          <Skeleton className="h-7 w-24" />
          <Skeleton className="h-7 w-32" />
          <Skeleton className="h-7 w-28" />
        </div>
      </div>
    </article>
  )
}

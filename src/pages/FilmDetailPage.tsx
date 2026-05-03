import { Link, useParams } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { useFilm } from '@/queries/useFilms'
import { useCharactersByUrls } from '@/queries/useCharacters'
import { ApiError } from '@/api/types'
import FavouriteToggle from '@/components/common/FavouriteToggle'
import InShellNotFound from '@/components/common/InShellNotFound'
import ListErrorState from '@/components/common/ListErrorState'
import { Skeleton } from '@/components/ui/skeleton'
import { extractIdFromUrl } from '@/lib/swapiUrl'
import { toRomanNumeral } from '@/lib/romanNumeral'
import { paths } from '@/routes/paths'

export default function FilmDetailPage() {
  const { id = '' } = useParams<{ id: string }>()
  const { data: film, isLoading, isError, error, refetch } = useFilm(id)
  const characterQueries = useCharactersByUrls(film?.characters ?? [])

  if (isLoading) {
    return <FilmDetailSkeleton />
  }

  if (isError) {
    if (error instanceof ApiError && error.status === 404) {
      return (
        <InShellNotFound resourceName="Film" backHref={paths.films} backLabel="Back to films" />
      )
    }
    return (
      <div className="mx-auto max-w-4xl px-4 py-12">
        <ListErrorState onRetry={() => refetch()} title="Couldn't load this film" />
      </div>
    )
  }

  if (!film) return null

  const otherCounts = [
    film.planets.length && `${film.planets.length} planets`,
    film.species.length && `${film.species.length} species`,
    film.vehicles.length && `${film.vehicles.length} vehicles`,
    film.starships.length && `${film.starships.length} starships`,
  ].filter(Boolean)

  return (
    <article className="mx-auto max-w-4xl px-4 py-12">
      <header className="mb-10 flex flex-col gap-3">
        <Link
          to={paths.films}
          viewTransition
          className="text-muted-foreground hover:text-foreground focus-visible:ring-brand inline-flex w-fit items-center gap-1.5 rounded-sm font-mono text-xs tracking-widest uppercase transition-colors focus-visible:ring-2 focus-visible:outline-none"
        >
          <ArrowLeft className="size-3.5" aria-hidden="true" />
          Films
        </Link>
        <div className="flex items-start justify-between gap-4">
          <h1 className="font-display text-5xl tracking-wide uppercase sm:text-6xl">
            {film.title}
          </h1>
          <FavouriteToggle
            type="film"
            id={id}
            itemName={film.title}
            snapshot={{
              name: film.title,
              episode_id: film.episode_id,
              release_date: film.release_date,
            }}
            size="lg"
          />
        </div>
        <div className="text-muted-foreground flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
          <span className="bg-muted text-foreground inline-flex items-center rounded-md px-2 py-0.5 font-mono text-xs">
            Episode {toRomanNumeral(film.episode_id)}
          </span>
          <span>{film.release_date}</span>
        </div>
      </header>

      <div className="grid gap-10 sm:grid-cols-2">
        <DetailField label="Directed by" value={film.director} />
        <DetailField label="Produced by" value={film.producer} />
      </div>

      <section className="mt-10">
        <h2 className="mb-3 text-sm font-semibold tracking-widest uppercase">Opening crawl</h2>
        <p className="text-muted-foreground font-mono text-sm leading-relaxed whitespace-pre-line">
          {film.opening_crawl}
        </p>
      </section>

      <section className="mt-10">
        <h2 className="mb-3 text-sm font-semibold tracking-widest uppercase">Characters</h2>
        <ul className="flex flex-wrap gap-2">
          {characterQueries.map((q, i) => {
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
                  to={paths.characterDetail(extractIdFromUrl(q.data.url))}
                  viewTransition
                  className="bg-muted hover:bg-muted/70 focus-visible:ring-brand inline-flex items-center rounded-md px-3 py-1 text-sm transition-colors focus-visible:ring-2 focus-visible:outline-none"
                >
                  {q.data.name}
                </Link>
              </li>
            )
          })}
        </ul>
      </section>

      {otherCounts.length > 0 && (
        <section className="mt-10">
          <h2 className="mb-3 text-sm font-semibold tracking-widest uppercase">Other related</h2>
          <p className="text-muted-foreground text-sm">
            {otherCounts.join(' · ')} <span className="text-xs">(not browsable in this app)</span>
          </p>
        </section>
      )}
    </article>
  )
}

function DetailField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <h2 className="text-muted-foreground mb-1 text-xs font-semibold tracking-widest uppercase">
        {label}
      </h2>
      <p className="text-base">{value}</p>
    </div>
  )
}

function FilmDetailSkeleton() {
  return (
    <article className="mx-auto max-w-4xl px-4 py-12">
      <div className="mb-10 flex flex-col gap-3">
        <Skeleton className="h-3 w-20" />
        <Skeleton className="h-12 w-3/4" />
        <Skeleton className="h-4 w-40" />
      </div>
      <div className="grid gap-10 sm:grid-cols-2">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
      </div>
      <div className="mt-10 space-y-2">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-32 w-full" />
      </div>
    </article>
  )
}

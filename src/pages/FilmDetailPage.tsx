import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { useFilm } from '@/queries/useFilms'
import { useCharactersByUrls } from '@/queries/useCharacters'
import { ApiError } from '@/api/types'
import FavouriteToggle from '@/components/common/FavouriteToggle'
import InShellNotFound from '@/components/common/InShellNotFound'
import ListErrorState from '@/components/common/ListErrorState'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import { extractIdFromUrl } from '@/lib/swapiUrl'
import { toRomanNumeral } from '@/lib/romanNumeral'
import { paths } from '@/routes/paths'

const TMDB_POSTER_BASE = 'https://image.tmdb.org/t/p/w500'

const FILM_POSTER_PATHS: Record<string, string> = {
  '1': '/6FfCtAuVAW8XJjZ7eWeLibRLWTw.jpg',
  '2': '/nNAeTmF4CtdSgMDplXTDPOpYzsX.jpg',
  '3': '/jQYlydvHm3kUix1f8prMucrplhm.jpg',
  '4': '/6wkfovpn7Eq8dYNKaG5PY3q2oq6.jpg',
  '5': '/oZNPzxqM2s5DyVWab09NTQScDQt.jpg',
  '6': '/xfSAoBEm9MNBjmlNcDYLvLSMlnq.jpg',
}

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
      <div className="flex justify-center px-4 py-12">
        <div className="flex w-full max-w-4xl flex-col">
          <ListErrorState onRetry={() => refetch()} title="Couldn't load this film" />
        </div>
      </div>
    )
  }

  if (!film) return null

  const posterPath = FILM_POSTER_PATHS[id]
  const posterSrc = posterPath ? `${TMDB_POSTER_BASE}${posterPath}` : null

  return (
    <div className="flex justify-center px-4 py-12">
      <article className="flex w-full max-w-4xl flex-col gap-10">
        <div className="grid gap-8 sm:grid-cols-[minmax(0,220px)_1fr] sm:gap-10">
          <FilmPoster src={posterSrc} title={film.title} className="hidden sm:block" />
          <div className="flex flex-col gap-8">
            <header className="flex flex-col gap-3">
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

            <FilmPoster
              src={posterSrc}
              title={film.title}
              className="w-full max-w-[200px] self-center sm:hidden"
            />

            <div className="grid gap-6 sm:grid-cols-2">
              <DetailField label="Directed by" value={film.director} />
              <DetailField label="Produced by" value={film.producer} />
            </div>
          </div>
        </div>

        <section className="flex flex-col gap-3">
          <h2 className="text-sm font-semibold tracking-widest uppercase">Opening crawl</h2>
          <div className="text-brand flex w-full max-w-lg flex-col gap-4 font-mono text-sm leading-relaxed text-justify [text-align-last:left] hyphens-auto">
            {film.opening_crawl
              .split(/\r?\n\s*\r?\n+/)
              .map((p) => p.replace(/\r?\n/g, ' ').trim())
              .filter(Boolean)
              .map((p, i) => (
                <p key={i}>{p}</p>
              ))}
          </div>
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="text-sm font-semibold tracking-widest uppercase">Characters</h2>
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
      </article>
    </div>
  )
}

function DetailField({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1">
      <h2 className="text-muted-foreground text-xs font-semibold tracking-widest uppercase">
        {label}
      </h2>
      <p className="text-base">{value}</p>
    </div>
  )
}

function FilmPoster({
  src,
  title,
  className,
}: {
  src: string | null
  title: string
  className?: string
}) {
  const [errored, setErrored] = useState(false)
  if (!src || errored) {
    return (
      <div
        className={cn(
          'bg-muted text-muted-foreground flex aspect-[2/3] w-full items-center justify-center rounded-md p-4 text-center font-mono text-xs tracking-widest uppercase',
          className,
        )}
      >
        {title}
      </div>
    )
  }
  return (
    <img
      src={src}
      alt={`${title} poster`}
      loading="lazy"
      decoding="async"
      onError={() => setErrored(true)}
      className={cn('aspect-[2/3] w-full rounded-md object-cover', className)}
    />
  )
}

function FilmDetailSkeleton() {
  return (
    <div className="flex justify-center px-4 py-12">
      <article className="flex w-full max-w-4xl flex-col gap-10">
        <div className="grid gap-8 sm:grid-cols-[minmax(0,220px)_1fr] sm:gap-10">
          <Skeleton className="aspect-[2/3] w-full rounded-md" />
          <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-3">
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-12 w-3/4" />
              <Skeleton className="h-4 w-40" />
            </div>
            <div className="grid gap-6 sm:grid-cols-2">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-32 w-full" />
        </div>
      </article>
    </div>
  )
}

import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { Film } from 'lucide-react'
import { useFilm } from '@/queries/useFilms'
import { useCharactersByUrls } from '@/queries/useCharacters'
import BackLink from '@/components/common/BackLink'
import DetailField from '@/components/common/DetailField'
import DetailPageShell from '@/components/common/DetailPageShell'
import FavouriteToggle from '@/components/common/FavouriteToggle'
import MetaBadge from '@/components/common/MetaBadge'
import RelatedChipList from '@/components/common/RelatedChipList'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import { toRomanNumeral } from '@/lib/romanNumeral'
import { resources } from '@/config/resources'

const resource = resources.film

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
  const query = useFilm(id)
  const characterQueries = useCharactersByUrls(query.data?.characters ?? [])

  const posterPath = FILM_POSTER_PATHS[id]
  const posterSrc = posterPath ? `${TMDB_POSTER_BASE}${posterPath}` : null

  return (
    <DetailPageShell resource={resource} query={query} skeleton={<FilmDetailSkeleton />}>
      {(film) => (
        <>
          <div className="grid gap-8 sm:grid-cols-[minmax(0,220px)_1fr] sm:gap-10">
            <FilmPoster src={posterSrc} title={film.title} className="hidden sm:block" />
            <div className="flex flex-col gap-8">
              <header className="flex flex-col gap-3">
                <BackLink to={resource.listPath}>{resource.plural}</BackLink>
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
                  <MetaBadge>Episode {toRomanNumeral(film.episode_id)}</MetaBadge>
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
            <h2 className="text-sm font-semibold tracking-widest uppercase">
              {resources.character.plural}
            </h2>
            <RelatedChipList
              queries={characterQueries}
              resource={resources.character}
              renderChip={(character) => character.name}
            />
          </section>
        </>
      )}
    </DetailPageShell>
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
  const [loaded, setLoaded] = useState(false)
  const [errored, setErrored] = useState(false)
  const showImage = src && !errored

  return (
    <div
      className={cn('bg-muted relative aspect-[2/3] w-full overflow-hidden rounded-md', className)}
    >
      {showImage ? (
        <Film
          aria-hidden="true"
          className="text-muted-foreground/40 absolute inset-0 m-auto size-12"
          strokeWidth={1.25}
        />
      ) : (
        <span className="text-muted-foreground absolute inset-0 flex items-center justify-center p-4 text-center font-mono text-xs tracking-widest uppercase">
          {title}
        </span>
      )}
      {showImage && (
        <img
          src={src}
          alt={`${title} poster`}
          decoding="async"
          onLoad={() => setLoaded(true)}
          onError={() => setErrored(true)}
          className={cn(
            'absolute inset-0 size-full object-cover transition-opacity duration-700 ease-out',
            loaded ? 'opacity-100' : 'opacity-0',
          )}
        />
      )}
    </div>
  )
}

function FilmDetailSkeleton() {
  return (
    <div className="flex justify-center px-4 py-12">
      <article className="flex w-full max-w-4xl flex-col gap-10">
        <div className="grid gap-8 sm:grid-cols-[minmax(0,220px)_1fr] sm:gap-10">
          <div className="bg-muted hidden aspect-[2/3] w-full rounded-md sm:block" />
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

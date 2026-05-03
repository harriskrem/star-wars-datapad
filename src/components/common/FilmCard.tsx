import type { Film } from '@/api/types'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import FavouriteToggle from '@/components/common/FavouriteToggle'
import { extractIdFromUrl } from '@/lib/swapiUrl'
import { toRomanNumeral } from '@/lib/romanNumeral'

type FilmCardProps = {
  film: Film
}

export default function FilmCard({ film }: FilmCardProps) {
  const id = extractIdFromUrl(film.url)

  return (
    <Card className="relative h-full">
      <div className="absolute top-1 right-1">
        <FavouriteToggle
          type="film"
          id={id}
          itemName={film.title}
          snapshot={{
            name: film.title,
            episode_id: film.episode_id,
            release_date: film.release_date,
          }}
        />
      </div>
      <CardHeader>
        <CardTitle className="font-display pr-12 text-2xl tracking-wide uppercase">
          {film.title}
        </CardTitle>
        <CardDescription className="flex flex-wrap items-center gap-x-2 gap-y-1 pt-1">
          <span className="bg-muted text-foreground inline-flex items-center rounded-md px-2 py-0.5 font-mono text-xs">
            Episode {toRomanNumeral(film.episode_id)}
          </span>
          <span>{film.release_date}</span>
          <span aria-hidden="true">·</span>
          <span>{film.director}</span>
        </CardDescription>
      </CardHeader>
    </Card>
  )
}

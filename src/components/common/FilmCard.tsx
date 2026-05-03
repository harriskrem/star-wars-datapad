import type { Film } from '@/api/types'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { toRomanNumeral } from '@/lib/romanNumeral'

type FilmCardProps = {
  film: Film
}

export default function FilmCard({ film }: FilmCardProps) {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-xl">{film.title}</CardTitle>
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

import type { Film } from '@/api/types'
import MetaBadge from '@/components/common/MetaBadge'
import ResourceCard from '@/components/common/ResourceCard'
import { extractIdFromUrl } from '@/lib/swapiUrl'
import { toRomanNumeral } from '@/lib/romanNumeral'

type FilmCardProps = {
  film: Film
}

export default function FilmCard({ film }: FilmCardProps) {
  return (
    <ResourceCard
      type="film"
      id={extractIdFromUrl(film.url)}
      title={film.title}
      snapshot={{
        name: film.title,
        episode_id: film.episode_id,
        release_date: film.release_date,
      }}
    >
      <MetaBadge>Episode {toRomanNumeral(film.episode_id)}</MetaBadge>
      <span>{film.release_date}</span>
      <span aria-hidden="true">·</span>
      <span>{film.director}</span>
    </ResourceCard>
  )
}

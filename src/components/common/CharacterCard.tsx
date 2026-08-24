import type { Character } from '@/api/types'
import MetaBadge from '@/components/common/MetaBadge'
import ResourceCard from '@/components/common/ResourceCard'
import { extractIdFromUrl } from '@/lib/swapiUrl'

type CharacterCardProps = {
  character: Character
}

export default function CharacterCard({ character }: CharacterCardProps) {
  const filmCount = character.films.length
  const filmLabel = filmCount === 1 ? 'film' : 'films'

  return (
    <ResourceCard
      type="character"
      id={extractIdFromUrl(character.url)}
      title={character.name}
      snapshot={{ name: character.name, birth_year: character.birth_year }}
    >
      {character.birth_year !== 'unknown' && <MetaBadge>{character.birth_year}</MetaBadge>}
      <span className="capitalize">{character.gender}</span>
      <span aria-hidden="true">·</span>
      <span>
        {filmCount} {filmLabel}
      </span>
    </ResourceCard>
  )
}

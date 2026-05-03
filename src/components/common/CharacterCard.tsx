import type { Character } from '@/api/types'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import FavouriteToggle from '@/components/common/FavouriteToggle'
import { extractIdFromUrl } from '@/lib/swapiUrl'

type CharacterCardProps = {
  character: Character
}

export default function CharacterCard({ character }: CharacterCardProps) {
  const filmCount = character.films.length
  const filmLabel = filmCount === 1 ? 'film' : 'films'
  const id = extractIdFromUrl(character.url)

  return (
    <Card className="relative h-full">
      <div className="absolute top-1 right-1">
        <FavouriteToggle
          type="character"
          id={id}
          itemName={character.name}
          snapshot={{ name: character.name, birth_year: character.birth_year }}
        />
      </div>
      <CardHeader>
        <CardTitle className="pr-12 text-xl">{character.name}</CardTitle>
        <CardDescription className="flex flex-wrap items-center gap-x-2 gap-y-1 pt-1">
          <span className="bg-muted text-foreground inline-flex items-center rounded-md px-2 py-0.5 font-mono text-xs">
            {character.birth_year}
          </span>
          <span className="capitalize">{character.gender}</span>
          <span aria-hidden="true">·</span>
          <span>
            {filmCount} {filmLabel}
          </span>
        </CardDescription>
      </CardHeader>
    </Card>
  )
}

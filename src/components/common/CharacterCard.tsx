import type { Character } from '@/api/types'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

type CharacterCardProps = {
  character: Character
}

export default function CharacterCard({ character }: CharacterCardProps) {
  const filmCount = character.films.length
  const filmLabel = filmCount === 1 ? 'film' : 'films'

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-xl">{character.name}</CardTitle>
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

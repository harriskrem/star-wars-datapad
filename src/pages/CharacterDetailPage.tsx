import { useParams } from 'react-router-dom'
import { useCharacter } from '@/queries/useCharacters'
import { useFilmsByUrls } from '@/queries/useFilms'
import BackLink from '@/components/common/BackLink'
import DetailField from '@/components/common/DetailField'
import DetailPageShell from '@/components/common/DetailPageShell'
import FavouriteToggle from '@/components/common/FavouriteToggle'
import MetaBadge from '@/components/common/MetaBadge'
import RelatedChipList from '@/components/common/RelatedChipList'
import { Skeleton } from '@/components/ui/skeleton'
import { toRomanNumeral } from '@/lib/romanNumeral'
import { resources } from '@/config/resources'

const resource = resources.character

export default function CharacterDetailPage() {
  const { id = '' } = useParams<{ id: string }>()
  const query = useCharacter(id)
  const filmQueries = useFilmsByUrls(query.data?.films ?? [])

  return (
    <DetailPageShell resource={resource} query={query} skeleton={<CharacterDetailSkeleton />}>
      {(character) => (
        <>
          <header className="flex flex-col gap-3">
            <BackLink to={resource.listPath}>{resource.plural}</BackLink>
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
              {character.birth_year !== 'unknown' && <MetaBadge>{character.birth_year}</MetaBadge>}
              <span className="capitalize">{character.gender}</span>
            </div>
          </header>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <DetailField label="Height" value={`${character.height} cm`} variant="mono" />
            <DetailField label="Mass" value={`${character.mass} kg`} variant="mono" />
            <DetailField label="Eye colour" value={character.eye_color} variant="capitalize" />
            <DetailField label="Hair colour" value={character.hair_color} variant="capitalize" />
            <DetailField label="Skin colour" value={character.skin_color} variant="capitalize" />
          </div>

          <section className="flex flex-col gap-3">
            <h2 className="text-sm font-semibold tracking-widest uppercase">
              {resources.film.plural}
            </h2>
            {character.films.length === 0 ? (
              <p className="text-muted-foreground text-sm">No films listed.</p>
            ) : (
              <RelatedChipList
                queries={filmQueries}
                resource={resources.film}
                className="gap-1.5"
                renderChip={(film) => (
                  <>
                    <span className="text-muted-foreground font-mono text-xs">
                      {toRomanNumeral(film.episode_id)}
                    </span>
                    <span>{film.title}</span>
                  </>
                )}
              />
            )}
          </section>
        </>
      )}
    </DetailPageShell>
  )
}

function CharacterDetailSkeleton() {
  return (
    <div className="flex justify-center px-4 py-12">
      <article className="flex w-full max-w-4xl flex-col gap-10">
        <div className="flex flex-col gap-3">
          <Skeleton className="h-3 w-28" />
          <Skeleton className="h-12 w-2/3" />
          <Skeleton className="h-4 w-32" />
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex flex-col gap-2">
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-5 w-24" />
            </div>
          ))}
        </div>
        <div className="flex flex-col gap-2">
          <Skeleton className="h-4 w-12" />
          <div className="flex gap-2">
            <Skeleton className="h-7 w-24" />
            <Skeleton className="h-7 w-32" />
            <Skeleton className="h-7 w-28" />
          </div>
        </div>
      </article>
    </div>
  )
}

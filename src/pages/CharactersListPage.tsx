import { useCharacters } from '@/queries/useCharacters'
import CharacterCard from '@/components/common/CharacterCard'
import ResourceListPage from '@/components/common/ResourceListPage'
import { resources } from '@/config/resources'

export default function CharactersListPage() {
  const query = useCharacters()

  return (
    <ResourceListPage
      resource={resources.character}
      query={query}
      matches={(c, q) => c.name.toLowerCase().includes(q)}
      renderCard={(c) => <CharacterCard character={c} />}
    />
  )
}

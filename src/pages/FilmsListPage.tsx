import { useFilms } from '@/queries/useFilms'
import FilmCard from '@/components/common/FilmCard'
import ResourceListPage from '@/components/common/ResourceListPage'
import { resources } from '@/config/resources'

export default function FilmsListPage() {
  const query = useFilms()

  return (
    <ResourceListPage
      resource={resources.film}
      query={query}
      matches={(f, q) => f.title.toLowerCase().includes(q)}
      renderCard={(f) => <FilmCard film={f} />}
    />
  )
}

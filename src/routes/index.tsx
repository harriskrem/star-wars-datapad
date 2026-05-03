import { Route, Routes } from 'react-router-dom'
import RootLayout from '@/layout'
import HomePage from '@/pages/HomePage'
import NotFoundPage from '@/pages/NotFoundPage'
import CharactersListPage from '@/pages/CharactersListPage'
import FilmsListPage from '@/pages/FilmsListPage'
import FilmDetailPage from '@/pages/FilmDetailPage'
import Placeholder from '@/components/common/Placeholder'
import { paths } from '@/routes/paths'

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<RootLayout />}>
        <Route path={paths.home} element={<HomePage />} />
        <Route path={paths.characters} element={<CharactersListPage />} />
        <Route path="/characters/:id" element={<Placeholder title="Character" />} />
        <Route path={paths.films} element={<FilmsListPage />} />
        <Route path="/films/:id" element={<FilmDetailPage />} />
        <Route path={paths.favourites} element={<Placeholder title="Favourites" />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}

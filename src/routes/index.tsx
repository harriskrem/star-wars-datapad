import { createRoutesFromElements, Route } from 'react-router-dom'
import RootLayout from '@/layout'
import HomePage from '@/pages/HomePage'
import NotFoundPage from '@/pages/NotFoundPage'
import CharactersListPage from '@/pages/CharactersListPage'
import CharacterDetailPage from '@/pages/CharacterDetailPage'
import FilmsListPage from '@/pages/FilmsListPage'
import FilmDetailPage from '@/pages/FilmDetailPage'
import FavouritesPage from '@/pages/FavouritesPage'
import { paths } from '@/routes/paths'

export const appRoutes = createRoutesFromElements(
  <Route element={<RootLayout />}>
    <Route path={paths.home} element={<HomePage />} />
    <Route path={paths.characters} element={<CharactersListPage />} />
    {/* The builders generate their own :id patterns, so link and route can't drift. */}
    <Route path={paths.characterDetail(':id')} element={<CharacterDetailPage />} />
    <Route path={paths.films} element={<FilmsListPage />} />
    <Route path={paths.filmDetail(':id')} element={<FilmDetailPage />} />
    <Route path={paths.favourites} element={<FavouritesPage />} />
    <Route path="*" element={<NotFoundPage />} />
  </Route>,
)

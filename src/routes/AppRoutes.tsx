import { Route, Routes } from 'react-router-dom'
import RootLayout from '@/layout/RootLayout'
import HomePage from '@/pages/HomePage'
import NotFoundPage from '@/pages/NotFoundPage'
import CharactersListPage from '@/pages/CharactersListPage'
import FilmsPlaceholder from '@/pages/placeholders/FilmsPlaceholder'
import FavouritesPlaceholder from '@/pages/placeholders/FavouritesPlaceholder'
import { paths } from '@/routes/paths'

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<RootLayout />}>
        <Route path={paths.home} element={<HomePage />} />
        <Route path={paths.characters} element={<CharactersListPage />} />
        <Route path={paths.films} element={<FilmsPlaceholder />} />
        <Route path={paths.favourites} element={<FavouritesPlaceholder />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}

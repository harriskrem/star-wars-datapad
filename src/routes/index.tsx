import { Route, Routes } from 'react-router-dom'
import RootLayout from '@/layout'
import HomePage from '@/pages/HomePage'
import NotFoundPage from '@/pages/NotFoundPage'
import CharactersListPage from '@/pages/CharactersListPage'
import Placeholder from '@/pages/placeholders'
import { paths } from '@/routes/paths'

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<RootLayout />}>
        <Route path={paths.home} element={<HomePage />} />
        <Route path={paths.characters} element={<CharactersListPage />} />
        <Route path={paths.films} element={<Placeholder title="Films" />} />
        <Route path={paths.favourites} element={<Placeholder title="Favourites" />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}

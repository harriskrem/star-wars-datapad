import { useQuery } from '@tanstack/react-query'
import { getFilm, getFilms } from '@/api/films'

const ONE_DAY_MS = 1000 * 60 * 60 * 24

export const filmsQueryKey = ['films'] as const
export const filmQueryKey = (id: string) => ['film', id] as const

export function useFilms() {
  return useQuery({
    queryKey: filmsQueryKey,
    queryFn: getFilms,
    staleTime: ONE_DAY_MS,
  })
}

export function useFilm(id: string) {
  return useQuery({
    queryKey: filmQueryKey(id),
    queryFn: () => getFilm(id),
    staleTime: ONE_DAY_MS,
  })
}

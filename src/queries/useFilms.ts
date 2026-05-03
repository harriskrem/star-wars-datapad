import { useQueries, useQuery } from '@tanstack/react-query'
import { getFilm, getFilms } from '@/api/films'
import { extractIdFromUrl } from '@/lib/swapiUrl'

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

export function useFilmsByUrls(urls: string[]) {
  return useQueries({
    queries: urls.map((url) => {
      const id = extractIdFromUrl(url)
      return {
        queryKey: filmQueryKey(id),
        queryFn: () => getFilm(id),
        staleTime: ONE_DAY_MS,
      }
    }),
  })
}

import { useQueries, useQuery, useQueryClient } from '@tanstack/react-query'
import { getFilm, getFilms } from '@/api/films'
import type { Film } from '@/api/types'
import { extractIdFromUrl } from '@/lib/swapiUrl'
import { ONE_DAY_MS } from '@/lib/time'

// Films change far less often than characters, hence the longer window.
const STALE_TIME = ONE_DAY_MS

export const filmsQueryKey = ['films'] as const
export const filmQueryKey = (id: string) => ['film', id] as const

export function useFilms() {
  return useQuery({
    queryKey: filmsQueryKey,
    queryFn: getFilms,
    staleTime: STALE_TIME,
  })
}

export function useFilm(id: string) {
  const queryClient = useQueryClient()

  return useQuery({
    queryKey: filmQueryKey(id),
    queryFn: () => getFilm(id),
    staleTime: STALE_TIME,
    initialData: () => {
      const cached = queryClient.getQueryData<Film[]>(filmsQueryKey)
      return cached?.find((f) => extractIdFromUrl(f.url) === id)
    },
  })
}

export function useFilmsByUrls(urls: string[]) {
  return useQueries({
    queries: urls.map((url) => {
      const id = extractIdFromUrl(url)
      return {
        queryKey: filmQueryKey(id),
        queryFn: () => getFilm(id),
        staleTime: STALE_TIME,
      }
    }),
  })
}

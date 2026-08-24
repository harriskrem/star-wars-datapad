import { useQueries, useQuery, useQueryClient } from '@tanstack/react-query'
import { getCharacter, getCharacters } from '@/api/characters'
import type { Character } from '@/api/types'
import { extractIdFromUrl } from '@/lib/swapiUrl'
import { ONE_HOUR_MS } from '@/lib/time'

const STALE_TIME = ONE_HOUR_MS

export const charactersQueryKey = ['characters'] as const
export const characterQueryKey = (id: string) => ['character', id] as const

export function useCharacters() {
  return useQuery({
    queryKey: charactersQueryKey,
    queryFn: getCharacters,
    staleTime: STALE_TIME,
  })
}

export function useCharacter(id: string) {
  const queryClient = useQueryClient()

  return useQuery({
    queryKey: characterQueryKey(id),
    queryFn: () => getCharacter(id),
    staleTime: STALE_TIME,
    initialData: () => {
      const cached = queryClient.getQueryData<Character[]>(charactersQueryKey)
      return cached?.find((c) => extractIdFromUrl(c.url) === id)
    },
  })
}

export function useCharactersByUrls(urls: string[]) {
  return useQueries({
    queries: urls.map((url) => {
      const id = extractIdFromUrl(url)
      return {
        queryKey: characterQueryKey(id),
        queryFn: () => getCharacter(id),
        staleTime: STALE_TIME,
      }
    }),
  })
}

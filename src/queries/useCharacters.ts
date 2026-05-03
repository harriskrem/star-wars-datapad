import { useQueries, useQuery } from '@tanstack/react-query'
import { getCharacter, getCharacters } from '@/api/characters'
import { extractIdFromUrl } from '@/lib/swapiUrl'

const ONE_HOUR_MS = 1000 * 60 * 60

export const charactersQueryKey = ['characters'] as const
export const characterQueryKey = (id: string) => ['character', id] as const

export function useCharacters() {
  return useQuery({
    queryKey: charactersQueryKey,
    queryFn: getCharacters,
  })
}

export function useCharactersByUrls(urls: string[]) {
  return useQueries({
    queries: urls.map((url) => {
      const id = extractIdFromUrl(url)
      return {
        queryKey: characterQueryKey(id),
        queryFn: () => getCharacter(id),
        staleTime: ONE_HOUR_MS,
      }
    }),
  })
}

import { useQuery } from '@tanstack/react-query'
import { getCharacters } from '@/api/characters'

export const charactersQueryKey = ['characters'] as const

export function useCharacters() {
  return useQuery({
    queryKey: charactersQueryKey,
    queryFn: getCharacters,
  })
}

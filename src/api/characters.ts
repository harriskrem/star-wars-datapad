import { apiGet } from '@/api/client'
import type { Character } from '@/api/types'

export function getCharacters(): Promise<Character[]> {
  return apiGet<Character[]>('/people')
}

export function getCharacter(id: string | number): Promise<Character> {
  return apiGet<Character>(`/people/${id}`)
}

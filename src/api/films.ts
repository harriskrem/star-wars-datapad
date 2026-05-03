import { apiGet } from '@/api/client'
import type { Film } from '@/api/types'

export function getFilms(): Promise<Film[]> {
  return apiGet<Film[]>('/films')
}

export function getFilm(id: string | number): Promise<Film> {
  return apiGet<Film>(`/films/${id}`)
}

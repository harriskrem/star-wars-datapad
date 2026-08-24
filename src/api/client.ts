import { ApiError } from '@/api/types'

export const BASE_URL = 'https://swapi.info/api'

export async function apiGet<T>(path: string): Promise<T> {
  const url = `${BASE_URL}${path}`

  let response: Response
  try {
    response = await fetch(url)
  } catch {
    throw new ApiError(`Network error fetching ${path}`, 0, url)
  }

  if (!response.ok) {
    throw new ApiError(`Request failed with status ${response.status}`, response.status, url)
  }

  return response.json() as Promise<T>
}

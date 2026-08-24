import { http, HttpResponse } from 'msw'
import { BASE_URL } from '@/api/client'
import { extractIdFromUrl } from '@/lib/swapiUrl'
import people from '@/test/fixtures/people.json'
import films from '@/test/fixtures/films.json'

function findById<T extends { url: string }>(items: T[], id: string): T | undefined {
  return items.find((item) => extractIdFromUrl(item.url) === id)
}

export const handlers = [
  http.get(`${BASE_URL}/people`, () => HttpResponse.json(people)),
  http.get(`${BASE_URL}/people/:id`, ({ params }) => {
    const character = findById(people, String(params.id))
    if (!character) return HttpResponse.json({}, { status: 404 })
    return HttpResponse.json(character)
  }),
  http.get(`${BASE_URL}/films`, () => HttpResponse.json(films)),
  http.get(`${BASE_URL}/films/:id`, ({ params }) => {
    const film = findById(films, String(params.id))
    if (!film) return HttpResponse.json({}, { status: 404 })
    return HttpResponse.json(film)
  }),
]

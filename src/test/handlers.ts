import { http, HttpResponse } from 'msw'
import people from '@/test/fixtures/people.json'
import films from '@/test/fixtures/films.json'

function findById<T extends { url: string }>(items: T[], id: string): T | undefined {
  return items.find((item) => {
    const last = item.url.replace(/\/$/, '').split('/').pop()
    return last === id
  })
}

export const handlers = [
  http.get('https://swapi.info/api/people', () => HttpResponse.json(people)),
  http.get('https://swapi.info/api/people/:id', ({ params }) => {
    const character = findById(people, String(params.id))
    if (!character) return HttpResponse.json({}, { status: 404 })
    return HttpResponse.json(character)
  }),
  http.get('https://swapi.info/api/films', () => HttpResponse.json(films)),
  http.get('https://swapi.info/api/films/:id', ({ params }) => {
    const film = findById(films, String(params.id))
    if (!film) return HttpResponse.json({}, { status: 404 })
    return HttpResponse.json(film)
  }),
]

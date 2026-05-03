import { http, HttpResponse } from 'msw'
import people from '@/test/fixtures/people.json'

export const handlers = [http.get('https://swapi.info/api/people', () => HttpResponse.json(people))]

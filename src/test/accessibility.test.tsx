import { describe, it, expect } from 'vitest'
import { axe } from 'vitest-axe'
import { screen } from '@testing-library/react'
import { renderAppAt } from '@/test/renderWithApp'
import { useFavouritesStore } from '@/stores/favouritesStore'

describe('Accessibility audits across pages', () => {
  it('home page has no accessibility violations', async () => {
    const { container } = renderAppAt('/')
    await screen.findByRole('heading', { level: 1 })
    expect(await axe(container)).toHaveNoViolations()
  })

  it('characters list has no accessibility violations', async () => {
    const { container } = renderAppAt('/characters')
    await screen.findByText('Luke Skywalker')
    expect(await axe(container)).toHaveNoViolations()
  })

  it('character detail has no accessibility violations', async () => {
    const { container } = renderAppAt('/characters/1')
    await screen.findByRole('heading', { level: 1, name: 'Luke Skywalker' })
    expect(await axe(container)).toHaveNoViolations()
  })

  it('films list has no accessibility violations', async () => {
    const { container } = renderAppAt('/films')
    await screen.findByText('A New Hope')
    expect(await axe(container)).toHaveNoViolations()
  })

  it('film detail has no accessibility violations', async () => {
    const { container } = renderAppAt('/films/1')
    await screen.findByRole('heading', { level: 1, name: 'A New Hope' })
    expect(await axe(container)).toHaveNoViolations()
  })

  it('empty favourites page has no accessibility violations', async () => {
    const { container } = renderAppAt('/favourites')
    await screen.findByText('No favourites yet')
    expect(await axe(container)).toHaveNoViolations()
  })

  it('populated favourites page has no accessibility violations', async () => {
    useFavouritesStore.setState({
      schemaVersion: 1,
      items: [
        {
          type: 'character',
          id: '1',
          addedAt: 1000,
          snapshot: { name: 'Luke Skywalker', birth_year: '19BBY' },
        },
        {
          type: 'film',
          id: '1',
          addedAt: 2000,
          snapshot: { name: 'A New Hope', episode_id: 4, release_date: '1977-05-25' },
        },
      ],
    })

    const { container } = renderAppAt('/favourites')
    await screen.findByRole('heading', { name: /Characters · 1/ })
    expect(await axe(container)).toHaveNoViolations()
  })

  it('404 page has no accessibility violations', async () => {
    const { container } = renderAppAt('/totally-fake')
    await screen.findByRole('heading', { level: 1 })
    expect(await axe(container)).toHaveNoViolations()
  })
})

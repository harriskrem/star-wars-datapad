import { describe, it, expect } from 'vitest'
import { screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderAppAt } from '@/test/renderWithApp'
import { useFavouritesStore } from '@/stores/favouritesStore'

function seed(
  items: Parameters<typeof useFavouritesStore.setState>[0] extends infer S
    ? S extends { items: infer I }
      ? I
      : never
    : never,
) {
  useFavouritesStore.setState({ schemaVersion: 1, items })
}

describe('FavouritesPage', () => {
  it('renders the empty state with a CTA when no favourites exist', () => {
    renderAppAt('/favourites')

    expect(screen.getByText('No favourites yet')).toBeInTheDocument()
    expect(screen.getByText('Star characters and films you want to revisit.')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /browse characters/i })).toHaveAttribute(
      'href',
      '/characters',
    )
  })

  it('groups favourites by type with per-type counts in the sub-headings', async () => {
    seed([
      {
        type: 'character',
        id: '1',
        addedAt: 1000,
        snapshot: { name: 'Luke Skywalker', birth_year: '19BBY' },
      },
      {
        type: 'character',
        id: '4',
        addedAt: 2000,
        snapshot: { name: 'Darth Vader', birth_year: '41.9BBY' },
      },
      {
        type: 'film',
        id: '1',
        addedAt: 3000,
        snapshot: { name: 'A New Hope', episode_id: 4, release_date: '1977-05-25' },
      },
    ])

    renderAppAt('/favourites')

    expect(await screen.findByRole('heading', { name: 'Characters · 2' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Films · 1' })).toBeInTheDocument()
  })

  it('orders favourites newest-first within each section', () => {
    seed([
      {
        type: 'character',
        id: '1',
        addedAt: 1000,
        snapshot: { name: 'Luke Skywalker' },
      },
      {
        type: 'character',
        id: '4',
        addedAt: 2000,
        snapshot: { name: 'Darth Vader' },
      },
    ])

    renderAppAt('/favourites')

    const section = screen.getByRole('heading', { name: 'Characters · 2' }).closest('section')!
    const items = within(section).getAllByRole('listitem')
    expect(within(items[0]).getByText('Darth Vader')).toBeInTheDocument()
    expect(within(items[1]).getByText('Luke Skywalker')).toBeInTheDocument()
  })

  it('marks 404 favourites as no-longer-available without auto-removing them', async () => {
    seed([
      {
        type: 'character',
        id: '9999',
        addedAt: 1000,
        snapshot: { name: 'Phantom Character' },
      },
    ])

    renderAppAt('/favourites')

    // Snapshot renders immediately
    expect(screen.getByText('Phantom Character')).toBeInTheDocument()

    // After background revalidation 404s, the badge appears
    expect(await screen.findByText('No longer available')).toBeInTheDocument()

    // Entry is NOT auto-removed — still present in the list
    expect(screen.getByText('Phantom Character')).toBeInTheDocument()
    // Section count still reflects the entry
    expect(screen.getByRole('heading', { name: 'Characters · 1' })).toBeInTheDocument()
  })

  it('removes a favourite when its toggle is clicked', async () => {
    const user = userEvent.setup()
    seed([
      {
        type: 'character',
        id: '1',
        addedAt: 1000,
        snapshot: { name: 'Luke Skywalker', birth_year: '19BBY' },
      },
    ])

    renderAppAt('/favourites')

    expect(screen.getByText('Luke Skywalker')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Remove Luke Skywalker from favourites' }))

    await waitFor(() => {
      expect(screen.queryByText('Luke Skywalker')).not.toBeInTheDocument()
    })
    // Empty state takes over
    expect(screen.getByText('No favourites yet')).toBeInTheDocument()
  })

  it('navigates to the character detail page when clicking a live favourite', async () => {
    const user = userEvent.setup()
    seed([
      {
        type: 'character',
        id: '1',
        addedAt: 1000,
        snapshot: { name: 'Luke Skywalker', birth_year: '19BBY' },
      },
    ])

    renderAppAt('/favourites')

    const lukeLink = screen.getByRole('link', { name: /Luke Skywalker/ })
    expect(lukeLink).toHaveAttribute('href', '/characters/1')

    await user.click(lukeLink)

    await waitFor(() => {
      expect(screen.getByRole('heading', { level: 1, name: 'Luke Skywalker' })).toBeInTheDocument()
    })
  })
})

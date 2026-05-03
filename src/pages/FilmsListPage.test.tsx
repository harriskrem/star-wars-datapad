import { describe, it, expect } from 'vitest'
import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { http, HttpResponse } from 'msw'
import { renderAppAt } from '@/test/renderWithApp'
import { server } from '@/test/server'
import { useFavouritesStore } from '@/stores/favouritesStore'

describe('FilmsListPage', () => {
  it('renders all six films with episode, release date, and director', async () => {
    renderAppAt('/films')

    expect(await screen.findByText('A New Hope')).toBeInTheDocument()
    expect(screen.getByText('The Empire Strikes Back')).toBeInTheDocument()
    expect(screen.getByText('Return of the Jedi')).toBeInTheDocument()
    expect(screen.getByText('The Phantom Menace')).toBeInTheDocument()
    expect(screen.getByText('Attack of the Clones')).toBeInTheDocument()
    expect(screen.getByText('Revenge of the Sith')).toBeInTheDocument()

    // A New Hope details
    expect(screen.getByText('Episode IV')).toBeInTheDocument()
    expect(screen.getAllByText('George Lucas').length).toBeGreaterThan(0)
  })

  it('filters the list by typed query after debounce', async () => {
    const user = userEvent.setup()
    renderAppAt('/films')

    await screen.findByText('A New Hope')

    const input = screen.getByLabelText(/search films/i)
    await user.type(input, 'phantom')

    expect(await screen.findByText('The Phantom Menace')).toBeInTheDocument()
    await waitFor(() => {
      expect(screen.queryByText('A New Hope')).not.toBeInTheDocument()
    })
  })

  it('shows the empty state when no films match the query', async () => {
    const user = userEvent.setup()
    renderAppAt('/films')

    await screen.findByText('A New Hope')

    const input = screen.getByLabelText(/search films/i)
    await user.type(input, 'asdfqwerty')

    expect(await screen.findByText(/nothing matched/i)).toBeInTheDocument()
    expect(screen.getByText(/try a different title/i)).toBeInTheDocument()
  })

  it('toggling a film card adds to favourites and shows a confirmation toast', async () => {
    const user = userEvent.setup()
    renderAppAt('/films')

    await screen.findByText('A New Hope')

    expect(screen.queryByTestId('favourites-count-badge')).not.toBeInTheDocument()

    await user.click(
      screen.getByRole('button', { name: 'Add A New Hope to favourites' }),
    )

    await waitFor(() => {
      expect(screen.getByTestId('favourites-count-badge')).toHaveTextContent('1')
    })
    expect(await screen.findByText('Added to favourites')).toBeInTheDocument()
  })

  it('counts mixed character and film favourites in the nav badge', async () => {
    const user = userEvent.setup()
    // Pre-populate one character favourite (simulates state restored from localStorage on mount).
    useFavouritesStore.setState({
      schemaVersion: 1,
      items: [
        {
          type: 'character',
          id: '1',
          addedAt: Date.now(),
          snapshot: { name: 'Luke Skywalker' },
        },
      ],
    })

    renderAppAt('/films')

    await screen.findByText('A New Hope')
    expect(screen.getByTestId('favourites-count-badge')).toHaveTextContent('1')

    await user.click(
      screen.getByRole('button', { name: 'Add A New Hope to favourites' }),
    )

    await waitFor(() => {
      expect(screen.getByTestId('favourites-count-badge')).toHaveTextContent('2')
    })
  })

  it('shows the inline error state and recovers on retry', async () => {
    server.use(
      http.get('https://swapi.info/api/films', () => HttpResponse.json([], { status: 500 })),
    )

    const user = userEvent.setup()
    renderAppAt('/films')

    expect(await screen.findByRole('alert')).toBeInTheDocument()
    expect(screen.getByText(/couldn't load/i)).toBeInTheDocument()

    server.resetHandlers()

    await user.click(screen.getByRole('button', { name: /try again/i }))

    expect(await screen.findByText('A New Hope')).toBeInTheDocument()
  })
})

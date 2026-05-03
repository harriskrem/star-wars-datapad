import { describe, it, expect } from 'vitest'
import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { http, HttpResponse } from 'msw'
import { renderAppAt } from '@/test/renderWithApp'
import { server } from '@/test/server'

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

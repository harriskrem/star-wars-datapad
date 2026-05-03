import { describe, it, expect } from 'vitest'
import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { http, HttpResponse } from 'msw'
import { renderAppAt } from '@/test/renderWithApp'
import { server } from '@/test/server'

describe('FilmDetailPage', () => {
  it('renders all attributes for A New Hope', async () => {
    renderAppAt('/films/1')

    expect(await screen.findByRole('heading', { level: 1, name: 'A New Hope' })).toBeInTheDocument()
    expect(screen.getByText('Episode IV')).toBeInTheDocument()
    expect(screen.getByText('1977-05-25')).toBeInTheDocument()
    expect(screen.getByText('George Lucas')).toBeInTheDocument()
    expect(screen.getByText(/Gary Kurtz/)).toBeInTheDocument()
    expect(screen.getByText(/It is a period of civil war/)).toBeInTheDocument()
  })

  it('resolves related characters and renders them as links to /characters/:id', async () => {
    renderAppAt('/films/1')

    // Wait for character resolution
    const lukeLink = await screen.findByRole('link', { name: 'Luke Skywalker' })
    expect(lukeLink).toHaveAttribute('href', '/characters/1')

    const c3poLink = screen.getByRole('link', { name: 'C-3PO' })
    expect(c3poLink).toHaveAttribute('href', '/characters/2')
  })

  it('navigates to the character detail page when a character link is clicked', async () => {
    const user = userEvent.setup()
    renderAppAt('/films/1')

    const lukeLink = await screen.findByRole('link', { name: 'Luke Skywalker' })
    await user.click(lukeLink)

    await waitFor(() => {
      expect(screen.getByRole('heading', { level: 1, name: 'Luke Skywalker' })).toBeInTheDocument()
    })
  })

  it('renders the in-shell not-found view for an unknown film id', async () => {
    renderAppAt('/films/9999')

    expect(
      await screen.findByRole('heading', { level: 1, name: /film not found/i }),
    ).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /back to films/i })).toHaveAttribute('href', '/films')
  })

  it('shows the inline error state and recovers on retry for a non-404 failure', async () => {
    server.use(
      http.get('https://swapi.info/api/films/:id', () => HttpResponse.json({}, { status: 500 })),
    )

    const user = userEvent.setup()
    renderAppAt('/films/1')

    expect(await screen.findByRole('alert')).toBeInTheDocument()
    expect(screen.getByText(/couldn't load/i)).toBeInTheDocument()

    server.resetHandlers()

    await user.click(screen.getByRole('button', { name: /try again/i }))

    await waitFor(() => {
      expect(screen.getByRole('heading', { level: 1, name: 'A New Hope' })).toBeInTheDocument()
    })
  })
})

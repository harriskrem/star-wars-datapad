import { describe, it, expect } from 'vitest'
import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { http, HttpResponse } from 'msw'
import { renderAppAt } from '@/test/renderWithApp'
import { server } from '@/test/server'

describe('CharacterDetailPage', () => {
  it('renders all attributes for Luke Skywalker', async () => {
    renderAppAt('/characters/1')

    expect(
      await screen.findByRole('heading', { level: 1, name: 'Luke Skywalker' }),
    ).toBeInTheDocument()
    expect(screen.getByText('19BBY')).toBeInTheDocument()
    expect(screen.getByText('male')).toBeInTheDocument()
    expect(screen.getByText('172 cm')).toBeInTheDocument()
    expect(screen.getByText('77 kg')).toBeInTheDocument()
    expect(screen.getByText('blue')).toBeInTheDocument()
    expect(screen.getByText('blond')).toBeInTheDocument()
    expect(screen.getByText('fair')).toBeInTheDocument()
  })

  it('resolves related films and renders them as links to /films/:id', async () => {
    renderAppAt('/characters/1')

    const newHopeLink = await screen.findByRole('link', { name: /A New Hope/ })
    expect(newHopeLink).toHaveAttribute('href', '/films/1')

    const empireLink = screen.getByRole('link', { name: /The Empire Strikes Back/ })
    expect(empireLink).toHaveAttribute('href', '/films/2')
  })

  it('completes the round-trip film → character → film', async () => {
    const user = userEvent.setup()
    renderAppAt('/films/1')

    // 1. On Film detail (A New Hope)
    expect(await screen.findByRole('heading', { level: 1, name: 'A New Hope' })).toBeInTheDocument()

    // 2. Click Luke → Character detail
    await user.click(await screen.findByRole('link', { name: 'Luke Skywalker' }))
    await waitFor(() => {
      expect(screen.getByRole('heading', { level: 1, name: 'Luke Skywalker' })).toBeInTheDocument()
    })

    // 3. Click "A New Hope" film link → back to film detail
    await user.click(await screen.findByRole('link', { name: /A New Hope/ }))
    await waitFor(() => {
      expect(screen.getByRole('heading', { level: 1, name: 'A New Hope' })).toBeInTheDocument()
    })
  })

  it('renders the in-shell not-found view for an unknown character id', async () => {
    renderAppAt('/characters/9999')

    expect(
      await screen.findByRole('heading', { level: 1, name: /character not found/i }),
    ).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /back to characters/i })).toHaveAttribute(
      'href',
      '/characters',
    )
  })

  it('toggling on the detail page updates the nav badge', async () => {
    const user = userEvent.setup()
    renderAppAt('/characters/1')

    await screen.findByRole('heading', { level: 1, name: 'Luke Skywalker' })

    expect(screen.queryByTestId('favourites-count-badge')).not.toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Add Luke Skywalker to favourites' }))

    await waitFor(() => {
      expect(screen.getByTestId('favourites-count-badge')).toHaveTextContent('1')
    })
  })

  it('shows the inline error state and recovers on retry for a non-404 failure', async () => {
    server.use(
      http.get('https://swapi.info/api/people/:id', () => HttpResponse.json({}, { status: 500 })),
    )

    const user = userEvent.setup()
    renderAppAt('/characters/1')

    expect(await screen.findByRole('alert')).toBeInTheDocument()
    expect(screen.getByText(/couldn't load/i)).toBeInTheDocument()

    server.resetHandlers()

    await user.click(screen.getByRole('button', { name: /try again/i }))

    await waitFor(() => {
      expect(screen.getByRole('heading', { level: 1, name: 'Luke Skywalker' })).toBeInTheDocument()
    })
  })
})

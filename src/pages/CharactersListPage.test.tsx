import { describe, it, expect } from 'vitest'
import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { http, HttpResponse } from 'msw'
import { renderAppAt } from '@/test/renderWithApp'
import { server } from '@/test/server'

describe('CharactersListPage', () => {
  it('renders the first page of characters once loaded', async () => {
    renderAppAt('/characters')

    expect(await screen.findByText('Luke Skywalker')).toBeInTheDocument()
    expect(screen.getByText('C-3PO')).toBeInTheDocument()
    expect(screen.getByText('Obi-Wan Kenobi')).toBeInTheDocument()
    // Page 2 character is not yet visible
    expect(screen.queryByText('Anakin Skywalker')).not.toBeInTheDocument()
  })

  it('navigates to page 2 via the pagination control and updates the visible cards', async () => {
    const user = userEvent.setup()
    renderAppAt('/characters')

    await screen.findByText('Luke Skywalker')

    await user.click(screen.getByRole('button', { name: 'Page 2' }))

    expect(await screen.findByText('Anakin Skywalker')).toBeInTheDocument()
    await waitFor(() => {
      expect(screen.queryByText('Luke Skywalker')).not.toBeInTheDocument()
    })
  })

  it('restores the page from the URL on first render', async () => {
    renderAppAt('/characters?page=2')

    expect(await screen.findByText('Anakin Skywalker')).toBeInTheDocument()
    expect(screen.queryByText('Luke Skywalker')).not.toBeInTheDocument()
  })

  it('marks the active page with aria-current', async () => {
    renderAppAt('/characters?page=3')
    await screen.findByRole('navigation', { name: /pagination/i })

    const activeButton = screen.getByRole('button', { name: 'Page 3' })
    expect(activeButton).toHaveAttribute('aria-current', 'page')
    expect(screen.getByRole('button', { name: 'Page 1' })).not.toHaveAttribute('aria-current')
  })

  it('filters the list by typed query after debounce', async () => {
    const user = userEvent.setup()
    renderAppAt('/characters')

    await screen.findByText('Luke Skywalker')

    const input = screen.getByLabelText(/search characters/i)
    await user.type(input, 'skywalker')

    // After debounce, only Skywalkers remain visible (Luke, Anakin, Shmi)
    expect(await screen.findByText('Anakin Skywalker')).toBeInTheDocument()
    await waitFor(() => {
      expect(screen.queryByText('C-3PO')).not.toBeInTheDocument()
    })
    expect(screen.getByText('Luke Skywalker')).toBeInTheDocument()
    expect(screen.getByText('Shmi Skywalker')).toBeInTheDocument()
  })

  it('shows the empty state when no characters match the query', async () => {
    const user = userEvent.setup()
    renderAppAt('/characters')

    await screen.findByText('Luke Skywalker')

    const input = screen.getByLabelText(/search characters/i)
    await user.type(input, 'asdfqwerty')

    expect(await screen.findByText(/nothing matched/i)).toBeInTheDocument()
    expect(screen.getByText(/try a different name/i)).toBeInTheDocument()
  })

  it('restores the search from the URL with the input populated', async () => {
    renderAppAt('/characters?search=anakin')

    expect(await screen.findByText('Anakin Skywalker')).toBeInTheDocument()
    expect(screen.queryByText('Luke Skywalker')).not.toBeInTheDocument()

    const input = screen.getByLabelText<HTMLInputElement>(/search characters/i)
    expect(input.value).toBe('anakin')
  })

  it('clears the search via the clear button and restores the full list', async () => {
    const user = userEvent.setup()
    renderAppAt('/characters?search=anakin')

    await screen.findByText('Anakin Skywalker')
    expect(screen.queryByText('Luke Skywalker')).not.toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /clear search/i }))

    expect(await screen.findByText('Luke Skywalker')).toBeInTheDocument()
    expect(screen.getByText('C-3PO')).toBeInTheDocument()
  })

  it('shows the inline error state and recovers on retry', async () => {
    server.use(
      http.get('https://swapi.info/api/people', () => HttpResponse.json([], { status: 500 })),
    )

    const user = userEvent.setup()
    renderAppAt('/characters')

    expect(await screen.findByRole('alert')).toBeInTheDocument()
    expect(screen.getByText(/couldn't load/i)).toBeInTheDocument()

    // Restore the success handler before retry.
    server.resetHandlers()

    await user.click(screen.getByRole('button', { name: /try again/i }))

    expect(await screen.findByText('Luke Skywalker')).toBeInTheDocument()
  })
})

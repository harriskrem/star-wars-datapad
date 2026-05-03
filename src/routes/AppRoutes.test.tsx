import { describe, it, expect } from 'vitest'
import { screen } from '@testing-library/react'
import { renderAppAt } from '@/test/renderWithApp'

describe('AppRoutes', () => {
  it('renders the home page at "/"', () => {
    renderAppAt('/')
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(/handheld/i)
  })

  it('renders the characters placeholder at /characters', () => {
    renderAppAt('/characters')
    expect(screen.getByRole('heading', { level: 1, name: 'Characters' })).toBeInTheDocument()
  })

  it('renders the films placeholder at /films', () => {
    renderAppAt('/films')
    expect(screen.getByRole('heading', { level: 1, name: 'Films' })).toBeInTheDocument()
  })

  it('renders the favourites placeholder at /favourites', () => {
    renderAppAt('/favourites')
    expect(screen.getByRole('heading', { level: 1, name: 'Favourites' })).toBeInTheDocument()
  })

  it('renders the 404 page for an unmatched route', () => {
    renderAppAt('/totally-fake')
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(/aren.{1,2}t the pages/i)
  })
})

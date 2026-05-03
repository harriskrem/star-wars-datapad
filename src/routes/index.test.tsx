import { describe, it, expect } from 'vitest'
import { screen } from '@testing-library/react'
import { renderAppAt } from '@/test/renderWithApp'

describe('AppRoutes', () => {
  it('mounts the home page at "/" inside the layout', () => {
    renderAppAt('/')
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(/handheld/i)
  })

  it('renders the 404 page for an unmatched route', () => {
    renderAppAt('/totally-fake')
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(/aren.{1,2}t the pages/i)
  })
})

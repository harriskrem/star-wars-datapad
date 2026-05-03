import { describe, it, expect } from 'vitest'
import { screen } from '@testing-library/react'
import { renderWithApp } from '@/test/renderWithApp'
import NotFoundPage from '@/pages/NotFoundPage'

describe('NotFoundPage', () => {
  it('renders the 404 message and a return-home link', () => {
    renderWithApp(<NotFoundPage />)

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(/aren.{1,2}t the pages/i)
    expect(screen.getByRole('link', { name: /return home/i })).toHaveAttribute('href', '/')
  })
})

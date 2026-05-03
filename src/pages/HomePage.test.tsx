import { describe, it, expect } from 'vitest'
import { axe } from 'vitest-axe'
import { screen } from '@testing-library/react'
import { renderWithApp } from '@/test/renderWithApp'
import HomePage from '@/pages/HomePage'

describe('HomePage', () => {
  it('renders the headline and links to the three sections', () => {
    renderWithApp(<HomePage />)

    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /^characters/i })).toHaveAttribute(
      'href',
      '/characters',
    )
    expect(screen.getByRole('link', { name: /^films/i })).toHaveAttribute('href', '/films')
    expect(screen.getByRole('link', { name: /^favourites/i })).toHaveAttribute(
      'href',
      '/favourites',
    )
  })

  it('has no accessibility violations', async () => {
    const { container } = renderWithApp(<HomePage />)
    expect(await axe(container)).toHaveNoViolations()
  })
})

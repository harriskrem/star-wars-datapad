import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import RootErrorBoundary from '@/components/error/RootErrorBoundary'

function Thrower(): never {
  throw new Error('boom')
}

describe('RootErrorBoundary', () => {
  // React logs to console.error when an error boundary catches; suppress for clean test output.
  let consoleSpy: ReturnType<typeof vi.spyOn>

  beforeEach(() => {
    consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    consoleSpy.mockRestore()
  })

  it('renders the default fallback when a child throws', () => {
    render(
      <RootErrorBoundary>
        <Thrower />
      </RootErrorBoundary>,
    )
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(/something went wrong/i)
    expect(screen.getByRole('button', { name: /try again/i })).toBeInTheDocument()
  })

  it('renders a custom fallback when provided', () => {
    render(
      <RootErrorBoundary fallback={<div>custom-fallback-sentinel</div>}>
        <Thrower />
      </RootErrorBoundary>,
    )
    expect(screen.getByText('custom-fallback-sentinel')).toBeInTheDocument()
  })
})

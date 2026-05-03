import type { ReactElement } from 'react'
import { render, type RenderResult } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import AppRoutes from '@/routes/AppRoutes'

type RenderWithAppOptions = {
  route?: string
}

export function renderWithApp(ui: ReactElement, options: RenderWithAppOptions = {}): RenderResult {
  return render(<MemoryRouter initialEntries={[options.route ?? '/']}>{ui}</MemoryRouter>)
}

export function renderAppAt(route: string): RenderResult {
  return renderWithApp(<AppRoutes />, { route })
}

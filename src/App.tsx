import { BrowserRouter } from 'react-router-dom'
import AppRoutes from '@/routes/AppRoutes'
import RootErrorBoundary from '@/components/error/RootErrorBoundary'

export default function App() {
  return (
    <BrowserRouter>
      <RootErrorBoundary>
        <AppRoutes />
      </RootErrorBoundary>
    </BrowserRouter>
  )
}

import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

type StatusPanelProps = {
  role?: 'alert'
  /** `lg` is the roomier empty-state padding. */
  padding?: 'default' | 'lg'
  children: ReactNode
}

/** The bordered, centred panel behind the empty and error states. */
export default function StatusPanel({ role, padding = 'default', children }: StatusPanelProps) {
  return (
    <div
      role={role}
      className={cn(
        'border-border/60 bg-card/50 flex flex-col items-center gap-3 rounded-lg border text-center',
        padding === 'lg' ? 'p-12' : 'p-8',
      )}
    >
      {children}
    </div>
  )
}

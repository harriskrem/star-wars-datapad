import type { ReactNode } from 'react'

/** The small mono pill used for birth years, episode numbers and the like. */
export default function MetaBadge({ children }: { children: ReactNode }) {
  return (
    <span className="bg-muted text-foreground inline-flex items-center rounded-md px-2 py-0.5 font-mono text-xs">
      {children}
    </span>
  )
}

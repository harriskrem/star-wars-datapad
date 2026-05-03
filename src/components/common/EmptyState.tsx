import type { ReactNode } from 'react'
import type { LucideIcon } from 'lucide-react'

type EmptyStateProps = {
  title: string
  description?: string
  icon?: LucideIcon
  cta?: ReactNode
}

export default function EmptyState({ title, description, icon: Icon, cta }: EmptyStateProps) {
  return (
    <div className="border-border/60 bg-card/50 flex flex-col items-center gap-3 rounded-lg border p-12 text-center">
      {Icon && <Icon className="text-muted-foreground size-8" aria-hidden="true" />}
      <h2 className="text-lg font-semibold">{title}</h2>
      {description && <p className="text-muted-foreground max-w-md text-sm">{description}</p>}
      {cta && <div className="mt-2">{cta}</div>}
    </div>
  )
}

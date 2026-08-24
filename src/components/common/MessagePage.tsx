import type { ReactNode } from 'react'

type MessagePageProps = {
  /** Small mono label above the heading, e.g. "404". */
  eyebrow: string
  title: ReactNode
  description: ReactNode
  action?: ReactNode
  role?: 'alert'
}

/**
 * A full-height centred message: the shape shared by the route-level 404 and
 * the root error boundary's fallback.
 */
export default function MessagePage({
  eyebrow,
  title,
  description,
  action,
  role,
}: MessagePageProps) {
  return (
    <div
      role={role}
      className="mx-auto flex min-h-[60vh] max-w-xl flex-col items-center justify-center gap-6 px-4 py-12 text-center"
    >
      <p className="kicker">{eyebrow}</p>
      <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">{title}</h1>
      <p className="text-muted-foreground">{description}</p>
      {action}
    </div>
  )
}

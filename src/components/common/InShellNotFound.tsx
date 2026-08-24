import ButtonLink from '@/components/common/ButtonLink'

type InShellNotFoundProps = {
  resourceName: string
  backHref: string
  backLabel: string
}

/**
 * The 404 shown inside the app shell when a detail route's id doesn't exist.
 * Uses the display face to sit alongside the detail pages, unlike the
 * route-level NotFoundPage.
 */
export default function InShellNotFound({
  resourceName,
  backHref,
  backLabel,
}: InShellNotFoundProps) {
  return (
    <div className="mx-auto max-w-xl px-4 py-16 text-center">
      <p className="kicker">404</p>
      <h1 className="font-display mt-2 text-4xl tracking-wide uppercase sm:text-5xl">
        {resourceName} not found
      </h1>
      <p className="text-muted-foreground mt-3">
        We couldn&rsquo;t find a {resourceName.toLowerCase()} with that id.
      </p>
      <ButtonLink to={backHref} className="mt-6">
        {backLabel}
      </ButtonLink>
    </div>
  )
}

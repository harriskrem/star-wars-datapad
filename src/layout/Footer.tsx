import type { ReactNode } from 'react'

function ExternalLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="focus-ring hover:text-foreground rounded transition-colors"
    >
      {children}
    </a>
  )
}

export default function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer className="border-border/60 bg-background h-12 shrink-0 border-t">
      <div className="shell-bar kicker">
        <ExternalLink href="https://swapi.info">Data from SWAPI</ExternalLink>
        <small className="text-[length:inherit]">
          © {year}{' '}
          <ExternalLink href="https://github.com/harriskrem/star-wars-datapad">
            Harris Kremmidas
          </ExternalLink>
        </small>
      </div>
    </footer>
  )
}

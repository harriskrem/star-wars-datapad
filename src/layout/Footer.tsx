export default function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer className="border-border/60 bg-background h-12 shrink-0 border-t">
      <div className="text-muted-foreground mx-auto flex h-full max-w-6xl items-center justify-between gap-3 px-4 font-mono text-xs tracking-widest uppercase">
        <a
          href="https://swapi.info"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-foreground focus-visible:ring-brand rounded transition-colors focus-visible:ring-2 focus-visible:outline-none"
        >
          Data from SWAPI
        </a>
        <small className="text-[length:inherit]">
          © {year}{' '}
          <a
            href="https://github.com/harriskrem/star-wars-datapad"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-foreground focus-visible:ring-brand rounded transition-colors focus-visible:ring-2 focus-visible:outline-none"
          >
            Harris Kremmidas
          </a>
        </small>
      </div>
    </footer>
  )
}

import { useId, useMemo, useState } from 'react'
import { RotateCcw } from 'lucide-react'
import { toRomanNumeral } from '@/lib/romanNumeral'

type Props = {
  title: string
  episodeId: number
  text: string
}

export default function OpeningCrawl({ title, episodeId, text }: Props) {
  const [playKey, setPlayKey] = useState(0)
  const labelId = useId()

  const paragraphs = useMemo(
    () =>
      text
        .split(/\r?\n\s*\r?\n+/)
        .map((p) => p.replace(/\r?\n/g, ' ').trim())
        .filter(Boolean),
    [text],
  )

  return (
    <section aria-labelledby={labelId}>
      <div className="mb-3 flex items-center justify-between gap-3">
        <h2 id={labelId} className="text-sm font-semibold tracking-widest uppercase">
          Opening crawl
        </h2>
        <button
          type="button"
          onClick={() => setPlayKey((k) => k + 1)}
          className="text-muted-foreground hover:text-foreground focus-visible:ring-brand inline-flex cursor-pointer items-center gap-1.5 rounded-sm font-mono text-xs tracking-widest uppercase transition-colors focus-visible:ring-2 focus-visible:outline-none motion-reduce:hidden"
        >
          <RotateCcw className="size-3.5" aria-hidden="true" />
          Replay
        </button>
      </div>

      <div className="sw-crawl-stage relative overflow-hidden rounded-lg bg-black motion-safe:aspect-[4/5] sm:motion-safe:aspect-video">
        <div className="sw-crawl-perspective">
          <div className="sw-crawl-warp">
            <div key={`${episodeId}-${playKey}`} className="sw-crawl-scroll">
              <p className="sw-crawl-intro">Episode {toRomanNumeral(episodeId)}</p>
              <h3 className="sw-crawl-title font-display">{title}</h3>
              <div className="sw-crawl-text">
                {paragraphs.map((p, i) => (
                  <p key={i} className="sw-crawl-paragraph">
                    {p}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

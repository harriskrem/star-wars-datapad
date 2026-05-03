export function scrollToTop() {
  if (typeof window === 'undefined') return
  const reducesMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false
  const main = document.getElementById('main')
  main?.scrollTo?.({ top: 0, behavior: reducesMotion ? 'auto' : 'smooth' })
}

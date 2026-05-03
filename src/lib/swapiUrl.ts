export function extractIdFromUrl(url: string): string {
  const trimmed = url.replace(/\/$/, '')
  const last = trimmed.split('/').pop()
  if (!last) throw new Error(`Cannot extract id from URL: ${url}`)
  return last
}

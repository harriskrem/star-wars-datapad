const NUMERALS: ReadonlyArray<readonly [string, number]> = [
  ['M', 1000],
  ['CM', 900],
  ['D', 500],
  ['CD', 400],
  ['C', 100],
  ['XC', 90],
  ['L', 50],
  ['XL', 40],
  ['X', 10],
  ['IX', 9],
  ['V', 5],
  ['IV', 4],
  ['I', 1],
]

export function toRomanNumeral(n: number): string {
  if (!Number.isInteger(n) || n <= 0) return String(n)
  let result = ''
  let remaining = n
  for (const [letters, value] of NUMERALS) {
    while (remaining >= value) {
      result += letters
      remaining -= value
    }
  }
  return result
}

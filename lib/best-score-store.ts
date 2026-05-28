const KEY = 'poop-dodge:best:v1'

export function getBestScore(): number {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return 0
    const parsed = JSON.parse(raw)
    return typeof parsed?.ms === 'number' ? parsed.ms : 0
  } catch {
    return 0
  }
}

export function setBestScore(ms: number): void {
  try {
    localStorage.setItem(KEY, JSON.stringify({ ms }))
  } catch {
    // incognito / quota exceeded — silent fail
  }
}

export function isNewRecord(ms: number): boolean {
  return ms > getBestScore()
}

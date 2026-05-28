import { describe, it, expect, beforeEach, vi } from 'vitest'

describe('best-score-store', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.restoreAllMocks()
  })

  it('returns 0 when no record exists', async () => {
    const { getBestScore } = await import('./best-score-store')
    expect(getBestScore()).toBe(0)
  })

  it('persists and retrieves a score', async () => {
    const { getBestScore, setBestScore } = await import('./best-score-store')
    setBestScore(28450)
    expect(getBestScore()).toBe(28450)
  })

  it('isNewRecord returns true when score is higher', async () => {
    const { setBestScore, isNewRecord } = await import('./best-score-store')
    setBestScore(28450)
    expect(isNewRecord(30000)).toBe(true)
  })

  it('isNewRecord returns false when score is lower', async () => {
    const { setBestScore, isNewRecord } = await import('./best-score-store')
    setBestScore(28450)
    expect(isNewRecord(25000)).toBe(false)
  })

  it('isNewRecord returns false when score is equal', async () => {
    const { setBestScore, isNewRecord } = await import('./best-score-store')
    setBestScore(28450)
    expect(isNewRecord(28450)).toBe(false)
  })

  it('returns 0 safely when localStorage throws', async () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('storage unavailable')
    })
    const { getBestScore } = await import('./best-score-store')
    expect(getBestScore()).toBe(0)
  })
})

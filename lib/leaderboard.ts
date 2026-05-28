import { Redis } from '@upstash/redis'

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
})

const SCORES_KEY = 'poop-dodge:scores'
const TOP_N = 10

export interface ScoreEntry {
  nickname: string
  scoreMs: number
  createdAt: string
}

/** 상위 N개 점수 조회 */
export async function getTopScores(): Promise<ScoreEntry[]> {
  // zrange with rev:true = highest score first
  // @upstash/redis auto-deserializes JSON members → already parsed objects
  const results = await redis.zrange(SCORES_KEY, 0, TOP_N - 1, {
    rev: true,
    withScores: true,
  })

  const entries: ScoreEntry[] = []
  // results: [memberObj, score, memberObj, score, ...]
  for (let i = 0; i < results.length; i += 2) {
    try {
      const member = results[i] as { nickname: string; createdAt: string }
      const scoreMs = Number(results[i + 1])
      if (!member?.nickname || !Number.isFinite(scoreMs)) continue
      entries.push({
        nickname: member.nickname,
        scoreMs,
        createdAt: member.createdAt ?? '',
      })
    } catch {
      // skip malformed entries
    }
  }
  return entries
}

/** 점수 저장 */
export async function saveScore(nickname: string, scoreMs: number): Promise<void> {
  const member = JSON.stringify({
    nickname,
    createdAt: new Date().toISOString(),
  })
  await redis.zadd(SCORES_KEY, { score: scoreMs, member })
}

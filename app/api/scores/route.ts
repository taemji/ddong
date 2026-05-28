import { NextRequest, NextResponse } from 'next/server'
import { getTopScores, saveScore } from '@/lib/leaderboard'

const NICKNAME_MAX_LEN = 12
const NICKNAME_RE = /^[a-zA-Z0-9가-힣\s]{1,12}$/

export async function GET() {
  try {
    const scores = await getTopScores()
    return NextResponse.json({ scores })
  } catch (err) {
    console.error('[scores GET]', err)
    return NextResponse.json({ error: 'Failed to fetch scores' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const nickname = (typeof body.nickname === 'string' ? body.nickname : '').trim()
    const scoreMs = Number(body.scoreMs)

    if (!nickname || !NICKNAME_RE.test(nickname) || nickname.length > NICKNAME_MAX_LEN) {
      return NextResponse.json({ error: 'Invalid nickname' }, { status: 400 })
    }
    if (!Number.isFinite(scoreMs) || scoreMs <= 0 || scoreMs > 3_600_000) {
      return NextResponse.json({ error: 'Invalid score' }, { status: 400 })
    }

    await saveScore(nickname, scoreMs)
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[scores POST]', err)
    return NextResponse.json({ error: 'Failed to save score' }, { status: 500 })
  }
}

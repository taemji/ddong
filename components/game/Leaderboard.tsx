'use client'

import { useEffect, useState } from 'react'
import type { ScoreEntry } from '@/lib/leaderboard'

const fontEn = 'var(--font-pixel-en)'

interface Props {
  highlightMs?: number // 현재 게임 점수 (하이라이트용)
  limit?: number       // 표시할 최대 항목 수 (기본 10)
}

export function Leaderboard({ highlightMs, limit = 10 }: Props) {
  const [scores, setScores] = useState<ScoreEntry[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/scores')
      .then(r => r.json())
      .then(data => setScores((data.scores ?? []).slice(0, limit)))
      .catch(() => setScores([]))
      .finally(() => setLoading(false))
  }, [limit])

  return (
    <div className="w-full flex flex-col gap-1">
      <p
        className="text-white/40 tracking-[0.35em] text-center mb-2"
        style={{ fontFamily: fontEn, fontSize: '8px' }}
      >
        ★ TOP 10 ★
      </p>

      {loading && (
        <p className="text-white/30 text-center" style={{ fontFamily: fontEn, fontSize: '8px' }}>
          LOADING...
        </p>
      )}

      {!loading && scores.length === 0 && (
        <p className="text-white/30 text-center" style={{ fontFamily: fontEn, fontSize: '8px' }}>
          NO SCORES YET
        </p>
      )}

      {scores.map((entry, i) => {
        const isHighlight = highlightMs !== undefined && entry.scoreMs === highlightMs
        return (
          <div
            key={`${entry.nickname}-${entry.createdAt}`}
            className={`flex items-baseline justify-between px-1 py-0.5 ${
              isHighlight ? 'bg-yellow-300/15 rounded' : ''
            }`}
          >
            <span
              className={`tabular-nums ${isHighlight ? 'text-yellow-300' : 'text-white/40'}`}
              style={{ fontFamily: fontEn, fontSize: '8px', minWidth: '16px' }}
            >
              {i + 1}.
            </span>
            <span
              className={`flex-1 mx-2 truncate ${isHighlight ? 'text-yellow-300' : 'text-white/75'}`}
              style={{ fontFamily: fontEn, fontSize: '8px' }}
            >
              {entry.nickname}
            </span>
            <span
              className={`tabular-nums ${isHighlight ? 'text-yellow-300' : 'text-white/60'}`}
              style={{ fontFamily: fontEn, fontSize: '8px' }}
            >
              {(entry.scoreMs / 1000).toFixed(2)}s
            </span>
          </div>
        )
      })}
    </div>
  )
}

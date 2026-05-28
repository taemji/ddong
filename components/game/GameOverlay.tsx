'use client'

import { Button } from '@/components/ui/button'
import type { GamePhase } from '@/types/game'

interface Props {
  phase: GamePhase
  elapsedMs: number
  bestScore: number
  isNewRecord: boolean
  onStart: () => void
  onRestart: () => void
}

function formatTime(ms: number) {
  return (ms / 1000).toFixed(2) + '초'
}

export function GameOverlay({ phase, elapsedMs, bestScore, isNewRecord, onStart, onRestart }: Props) {
  if (phase === 'playing') return null

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-6"
      style={{ background: 'rgba(10,8,20,0.55)', backdropFilter: 'blur(1px)' }}>

      {phase === 'idle' && (
        <>
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-[0.3em] text-white">똥피하기</h1>
            <p className="text-[11px] tracking-[0.6em] text-white/30 mt-2">POOP DODGE</p>
          </div>

          {bestScore > 0 && (
            <p className="text-sm text-white/45 tracking-widest">
              최고기록 &nbsp; {formatTime(bestScore)}
            </p>
          )}

          <Button
            onClick={onStart}
            className="w-44 bg-white/95 text-black hover:bg-white font-bold tracking-widest rounded-sm"
          >
            시 작
          </Button>

          <p className="text-[10px] text-white/25 tracking-wider">
            ← → 방향키 또는 하단 버튼
          </p>
        </>
      )}

      {phase === 'gameover' && (
        <>
          <p className="text-xs tracking-[0.5em] text-white/40 font-medium">GAME OVER</p>

          {isNewRecord && (
            <p className="text-yellow-400/90 text-[11px] tracking-[0.4em] -mt-3">
              ✦ NEW RECORD ✦
            </p>
          )}

          {/* Hero: big time */}
          <div className="text-center -mt-1">
            <p className="text-6xl font-bold text-white tabular-nums leading-none">
              {(elapsedMs / 1000).toFixed(2)}
            </p>
            <p className="text-sm text-white/40 mt-1 tracking-wider">초</p>
          </div>

          {/* Best score — only shown if not new record (avoid redundancy) */}
          {!isNewRecord && (
            <p className="text-sm text-white/35 tracking-widest -mt-2">
              최고기록 {formatTime(bestScore)}
            </p>
          )}
          {isNewRecord && (
            <p className="text-sm text-yellow-400/60 tracking-widest -mt-2">
              새 최고기록 🎉
            </p>
          )}

          <Button
            onClick={onRestart}
            variant="outline"
            className="w-44 border-white/25 text-white/80 hover:bg-white/10 hover:text-white rounded-sm tracking-widest bg-transparent"
          >
            다시 시작
          </Button>
        </>
      )}
    </div>
  )
}

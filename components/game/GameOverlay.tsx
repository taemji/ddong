'use client'

import { PixelButton } from './PixelButton'
import type { GamePhase } from '@/types/game'
import { cn } from '@/lib/utils'

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
            <h1 className="text-4xl font-bold tracking-[0.3em] text-white font-mono">똥피하기</h1>
            <p className="text-[11px] tracking-[0.6em] text-white/30 mt-2 font-mono">POOP DODGE</p>
          </div>

          {bestScore > 0 && (
            <p className="text-sm text-white/45 tracking-widest font-mono">
              최고기록 &nbsp; {formatTime(bestScore)}
            </p>
          )}

          <PixelButton onClick={onStart} variant="filled">
            시 작
          </PixelButton>

          <p className="text-[10px] text-white/25 tracking-wider font-mono">
            ← → 방향키 또는 하단 버튼
          </p>
        </>
      )}

      {phase === 'gameover' && (
        <>
          <p className="text-xs tracking-[0.5em] text-white/40 font-mono font-bold">GAME OVER</p>

          {isNewRecord && (
            <p className="text-yellow-400/90 text-[11px] tracking-[0.4em] -mt-3 font-mono">
              ✦ NEW RECORD ✦
            </p>
          )}

          <div className="text-center -mt-1">
            <p className="text-6xl font-bold text-white tabular-nums leading-none font-mono">
              {(elapsedMs / 1000).toFixed(2)}
            </p>
            <p className="text-sm text-white/40 mt-1 tracking-wider font-mono">초</p>
          </div>

          {!isNewRecord && (
            <p className="text-sm text-white/35 tracking-widest -mt-2 font-mono">
              최고기록 {formatTime(bestScore)}
            </p>
          )}
          {isNewRecord && (
            <p className="text-sm text-yellow-400/60 tracking-widest -mt-2 font-mono">
              새 최고기록 🎉
            </p>
          )}

          <PixelButton onClick={onRestart} variant="outline">
            다시 시작
          </PixelButton>
        </>
      )}
    </div>
  )
}

'use client'

import { Button } from '@/components/ui/button'
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
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-5 bg-black/85 backdrop-blur-sm">
      {phase === 'idle' && (
        <>
          <h1 className="text-3xl font-bold tracking-widest text-white">똥피하기</h1>
          <p className="text-xs tracking-[0.4em] text-white/50">POOP DODGE</p>

          <div className="flex items-center justify-between w-48 px-4 py-2 border border-white/20 rounded bg-white/5">
            <span className="text-xs text-white/60 tracking-wider">최고기록</span>
            <span className="text-lg font-bold text-white">{formatTime(bestScore)}</span>
          </div>

          <Button
            onClick={onStart}
            className="w-48 tracking-widest bg-white text-black hover:bg-white/90 font-bold"
          >
            시 작
          </Button>

          <p className="text-[11px] text-white/40 tracking-wider">
            PC: ← → 방향키 · 모바일: 하단 버튼
          </p>
        </>
      )}

      {phase === 'gameover' && (
        <>
          <h2 className="text-2xl font-bold tracking-[0.3em] text-white">GAME OVER</h2>

          {isNewRecord && (
            <span className="px-4 py-1 border border-yellow-400/60 text-yellow-300 text-sm font-bold tracking-widest bg-yellow-400/10">
              ★ 신기록! ★
            </span>
          )}

          <div className="text-center">
            <p className="text-[11px] text-white/50 tracking-wider mb-1">생존 시간</p>
            <p className="text-4xl font-bold tracking-wider text-white">{formatTime(elapsedMs)}</p>
          </div>

          <div className={cn(
            'text-center px-6 py-2 rounded bg-white/5',
            isNewRecord ? 'border border-yellow-400/40' : 'border border-white/15'
          )}>
            <p className="text-[11px] text-white/50 tracking-wider mb-1">
              최고기록{isNewRecord ? ' (갱신됨)' : ''}
            </p>
            <p className={cn('text-xl font-bold', isNewRecord ? 'text-yellow-300' : 'text-white')}>
              {formatTime(bestScore)}
            </p>
          </div>

          <Button
            onClick={onRestart}
            className="w-48 tracking-widest bg-white text-black hover:bg-white/90 font-bold"
          >
            다시 시작
          </Button>
        </>
      )}
    </div>
  )
}

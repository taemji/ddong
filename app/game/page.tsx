'use client'

import { useEffect, useRef, useState } from 'react'
import { GameCanvas } from '@/components/game/GameCanvas'
import { GameOverlay } from '@/components/game/GameOverlay'
import { MobileControls } from '@/components/game/MobileControls'
import { SoundToggle } from '@/components/game/SoundToggle'
import { useGameEngine } from '@/hooks/useGameEngine'

export default function GamePage() {
  const { state, animFrame, countdownNum, startGame, resetGame, holdLeft, releaseLeft, holdRight, releaseRight } = useGameEngine()
  const [isShaking, setIsShaking] = useState(false)
  const prevPhaseRef = useRef(state.phase)

  useEffect(() => {
    if (prevPhaseRef.current !== 'gameover' && state.phase === 'gameover') {
      setIsShaking(true)
    }
    prevPhaseRef.current = state.phase
  }, [state.phase])

  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen"
      style={{ background: '#0d0d1a' }}
    >
      <div
        className={`relative${isShaking ? ' shake' : ''}`}
        style={{
          width: 'min(calc(100vw - 32px), calc((100vh - 160px) * 320 / 480))',
          aspectRatio: '320 / 480',
        }}
        onAnimationEnd={() => setIsShaking(false)}
      >
        <GameCanvas state={state} animFrame={animFrame} />
        <SoundToggle />
        <GameOverlay
          phase={state.phase}
          elapsedMs={state.elapsedMs}
          bestScore={state.bestScore}
          isNewRecord={state.isNewRecord}
          countdownNum={countdownNum}
          onStart={startGame}
          onRestart={resetGame}
        />
      </div>

      <MobileControls
        phase={state.phase}
        onLeftDown={holdLeft}
        onLeftUp={releaseLeft}
        onRightDown={holdRight}
        onRightUp={releaseRight}
      />
    </div>
  )
}

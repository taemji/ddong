'use client'

import { GameCanvas } from '@/components/game/GameCanvas'
import { GameOverlay } from '@/components/game/GameOverlay'
import { MobileControls } from '@/components/game/MobileControls'
import { useGameEngine } from '@/hooks/useGameEngine'

export default function GamePage() {
  const { state, animFrame, startGame, resetGame, holdLeft, releaseLeft, holdRight, releaseRight } = useGameEngine()

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background">
      <div className="relative">
        <GameCanvas state={state} animFrame={animFrame} />
        <GameOverlay
          phase={state.phase}
          elapsedMs={state.elapsedMs}
          bestScore={state.bestScore}
          isNewRecord={state.isNewRecord}
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

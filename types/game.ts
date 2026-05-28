export type GamePhase = 'idle' | 'playing' | 'gameover'
export type Direction = 'left' | 'right'

export interface Poop {
  id: string
  x: number      // pixel center
  y: number      // 0 = top, 1 = bottom (normalized)
  speed: number  // y increase per second
  size: number   // scale multiplier 0.7–1.5
}

export interface Difficulty {
  speed: number
  maxPoops: number
  spawnInterval: number
}

export interface GameState {
  phase: GamePhase
  characterX: number   // pixel center
  elapsedMs: number
  poops: Poop[]
  bestScore: number
  isNewRecord: boolean
}

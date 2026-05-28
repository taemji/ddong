export type GamePhase = 'idle' | 'playing' | 'gameover'
export type Lane = 1 | 2 | 3 | 4 | 5
export type Direction = 'left' | 'right'

export interface Poop {
  id: string
  lane: Lane
  y: number
  speed: number
}

export interface Difficulty {
  speed: number
  maxPoops: number
  spawnInterval: number
}

export interface GameState {
  phase: GamePhase
  lane: Lane
  elapsedMs: number
  poops: Poop[]
  bestScore: number
  isNewRecord: boolean
}

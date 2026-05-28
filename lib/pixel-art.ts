// Pixel scale: each "pixel" in the sprite map = SCALE canvas pixels
const SCALE = 4

// Color palette
const C = {
  _: null,          // transparent
  S: '#1a1a2e',     // background dark
  G: '#16213e',     // lane separator
  L: '#0f3460',     // lane center tint
  // character
  H: '#f5c842',     // hair / skin highlight
  K: '#e0a020',     // skin
  B: '#3a3aff',     // shirt blue
  T: '#222288',     // shirt dark
  P: '#e8c87a',     // pants
  D: '#5a3e00',     // shoe brown
  // poop
  W: '#7b4a00',     // poop dark
  X: '#a06010',     // poop mid
  Y: '#c08030',     // poop light
  Z: '#d4a060',     // poop highlight
} as const

type Color = typeof C[keyof typeof C]

// Character sprite frames (idle walk cycle — 2 frames)
const CHARACTER_FRAMES: Color[][][] = [
  // Frame 0
  [
    [C._, C.H, C.H, C._],
    [C.K, C.K, C.K, C.K],
    [C.B, C.B, C.B, C.B],
    [C.B, C.T, C.T, C.B],
    [C.P, C._, C._, C.P],
    [C.D, C._, C._, C.D],
  ],
  // Frame 1
  [
    [C._, C.H, C.H, C._],
    [C.K, C.K, C.K, C.K],
    [C.B, C.B, C.B, C.B],
    [C.T, C.B, C.B, C.T],
    [C._, C.P, C.P, C._],
    [C._, C.D, C.D, C._],
  ],
]

// Poop sprite
const POOP_SPRITE: Color[][] = [
  [C._, C._, C.W, C.W, C._, C._],
  [C._, C.W, C.X, C.X, C.W, C._],
  [C.W, C.X, C.Y, C.Z, C.X, C.W],
  [C.W, C.X, C.Y, C.Y, C.X, C.W],
  [C._, C.W, C.X, C.X, C.W, C._],
  [C._, C._, C.W, C.W, C._, C._],
]

function drawSprite(ctx: CanvasRenderingContext2D, sprite: Color[][], x: number, y: number) {
  for (let row = 0; row < sprite.length; row++) {
    for (let col = 0; col < sprite[row].length; col++) {
      const color = sprite[row][col]
      if (!color) continue
      ctx.fillStyle = color
      ctx.fillRect(x + col * SCALE, y + row * SCALE, SCALE, SCALE)
    }
  }
}

export function drawBackground(ctx: CanvasRenderingContext2D, w: number, h: number) {
  ctx.fillStyle = C.S
  ctx.fillRect(0, 0, w, h)

  // Subtle dot grid
  ctx.fillStyle = 'rgba(255,255,255,0.04)'
  for (let x = 0; x < w; x += 12) {
    for (let y = 0; y < h; y += 12) {
      ctx.fillRect(x, y, 1, 1)
    }
  }
}

export function drawLanes(ctx: CanvasRenderingContext2D, w: number, h: number, laneCount: number) {
  const laneW = w / laneCount

  // Center lane subtle highlight
  const centerLane = Math.floor(laneCount / 2)
  ctx.fillStyle = 'rgba(255,255,255,0.03)'
  ctx.fillRect(centerLane * laneW, 0, laneW, h)

  // Lane dividers
  ctx.strokeStyle = 'rgba(255,255,255,0.08)'
  ctx.setLineDash([6, 6])
  ctx.lineWidth = 1
  for (let i = 1; i < laneCount; i++) {
    ctx.beginPath()
    ctx.moveTo(i * laneW, 0)
    ctx.lineTo(i * laneW, h)
    ctx.stroke()
  }
  ctx.setLineDash([])
}

export function drawCharacter(ctx: CanvasRenderingContext2D, x: number, y: number, frame: number) {
  const sprite = CHARACTER_FRAMES[frame % CHARACTER_FRAMES.length]
  const spriteW = sprite[0].length * SCALE
  drawSprite(ctx, sprite, x - spriteW / 2, y)
}

export function drawPoop(ctx: CanvasRenderingContext2D, x: number, y: number) {
  const spriteW = POOP_SPRITE[0].length * SCALE
  drawSprite(ctx, POOP_SPRITE, x - spriteW / 2, y)
}

export const CHAR_HEIGHT = CHARACTER_FRAMES[0].length * SCALE
export const CHAR_WIDTH = CHARACTER_FRAMES[0][0].length * SCALE
export const POOP_HEIGHT = POOP_SPRITE.length * SCALE
export const POOP_WIDTH = POOP_SPRITE[0].length * SCALE

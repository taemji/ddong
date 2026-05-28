const SCALE = 4

const C = {
  _: null,
  S: '#1a1a2e',
  // character
  H: '#f5c842',
  K: '#e0a020',
  B: '#3a3aff',
  T: '#222288',
  P: '#e8c87a',
  D: '#5a3e00',
  // poop — warm reference-matched browns
  W: '#3d1800',   // outline
  X: '#7a3c00',   // body brown
  E: '#f0f0f0',   // eyes + teeth white
  F: '#000000',   // pupil black
} as const

type Color = typeof C[keyof typeof C]

const CHARACTER_FRAMES: Color[][][] = [
  [
    [C._, C.H, C.H, C._],
    [C.K, C.K, C.K, C.K],
    [C.B, C.B, C.B, C.B],
    [C.B, C.T, C.T, C.B],
    [C.P, C._, C._, C.P],
    [C.D, C._, C._, C.D],
  ],
  [
    [C._, C.H, C.H, C._],
    [C.K, C.K, C.K, C.K],
    [C.B, C.B, C.B, C.B],
    [C.T, C.B, C.B, C.T],
    [C._, C.P, C.P, C._],
    [C._, C.D, C.D, C._],
  ],
]

// 13×14 — three-tier coiled poop, eyes on tier 2, smile on tier 1
// Tier 3 (top):    cols 4-8, narrows to tip (rows 0-3) — swirl
// Tier 2 (middle): cols 2-10, 9 wide (rows 5-8) — EYES
// Tier 1 (bottom): cols 0-12, 13 wide (rows 10-13) — SMILE
//       0  1  2  3  4  5  6  7  8  9 10 11 12
const POOP_SPRITE: Color[][] = [
  [C._, C._, C._, C._, C._, C._, C.W, C._, C._, C._, C._, C._, C._],  //  0  tip
  [C._, C._, C._, C._, C._, C.W, C.X, C.W, C._, C._, C._, C._, C._],  //  1  tip curl
  [C._, C._, C._, C._, C.W, C.X, C.X, C.X, C.W, C._, C._, C._, C._],  //  2  tier 3 body
  [C._, C._, C._, C._, C.W, C.X, C.X, C.X, C.W, C._, C._, C._, C._],  //  3  tier 3 base
  [C._, C._, C._, C.W, C.W, C.W, C.W, C.W, C.W, C.W, C._, C._, C._],  //  4  SEAM 1
  [C._, C._, C.W, C.X, C.X, C.X, C.X, C.X, C.X, C.X, C.W, C._, C._],  //  5  tier 2 top
  [C._, C._, C.W, C.X, C.E, C.E, C.X, C.E, C.E, C.X, C.W, C._, C._],  //  6  EYES (mid tier)
  [C._, C._, C.W, C.X, C.E, C.F, C.X, C.E, C.F, C.X, C.W, C._, C._],  //  7  pupils
  [C._, C._, C.W, C.X, C.X, C.X, C.X, C.X, C.X, C.X, C.W, C._, C._],  //  8  tier 2 base
  [C._, C.W, C.W, C.W, C.W, C.W, C.W, C.W, C.W, C.W, C.W, C.W, C._],  //  9  SEAM 2
  [C.W, C.X, C.X, C.X, C.X, C.X, C.X, C.X, C.X, C.X, C.X, C.X, C.W],  // 10  tier 1 widest
  [C.W, C.X, C.X, C.X, C.X, C.X, C.X, C.X, C.X, C.X, C.X, C.X, C.W],  // 11  cheeks
  [C.W, C.X, C.X, C.X, C.X, C.X, C.X, C.X, C.X, C.X, C.X, C.X, C.W],  // 12  body (no mouth)
  [C._, C.W, C.W, C.X, C.X, C.X, C.X, C.X, C.X, C.X, C.W, C.W, C._],  // 13  base
]

function drawSprite(ctx: CanvasRenderingContext2D, sprite: Color[][], x: number, y: number, scale = 1) {
  const px = Math.round(SCALE * scale)
  for (let row = 0; row < sprite.length; row++) {
    for (let col = 0; col < sprite[row].length; col++) {
      const color = sprite[row][col]
      if (!color) continue
      ctx.fillStyle = color
      ctx.fillRect(
        Math.round(x + col * SCALE * scale),
        Math.round(y + row * SCALE * scale),
        px, px,
      )
    }
  }
}

export function drawBackground(ctx: CanvasRenderingContext2D, w: number, h: number) {
  ctx.fillStyle = C.S
  ctx.fillRect(0, 0, w, h)
  ctx.fillStyle = 'rgba(255,255,255,0.04)'
  for (let x = 0; x < w; x += 12) {
    for (let y = 0; y < h; y += 12) {
      ctx.fillRect(x, y, 1, 1)
    }
  }
}

export function drawCharacter(ctx: CanvasRenderingContext2D, x: number, y: number, frame: number) {
  const sprite = CHARACTER_FRAMES[frame % 2]
  const spriteW = sprite[0].length * SCALE
  drawSprite(ctx, sprite, Math.round(x - spriteW / 2), Math.round(y))
}

export function drawPoop(ctx: CanvasRenderingContext2D, x: number, y: number, size = 1) {
  // 13 cols wide — center on column 6 (the swirl tip & body axis)
  const spriteW = POOP_SPRITE[0].length * SCALE * size
  const spriteH = POOP_SPRITE.length * SCALE * size
  drawSprite(ctx, POOP_SPRITE, Math.round(x - spriteW / 2), Math.round(y - spriteH / 2), size)
}

export function drawHUD(ctx: CanvasRenderingContext2D, elapsedMs: number, w: number) {
  const text = (elapsedMs / 1000).toFixed(2) + '초'
  ctx.save()
  ctx.font = 'bold 13px monospace'
  ctx.textAlign = 'right'
  ctx.textBaseline = 'top'
  ctx.fillStyle = 'rgba(0,0,0,0.45)'
  ctx.fillRect(w - 76, 6, 70, 20)
  ctx.fillStyle = 'rgba(255,255,255,0.92)'
  ctx.fillText(text, w - 10, 9)
  ctx.restore()
}

export const CHAR_HEIGHT = CHARACTER_FRAMES[0].length * SCALE
export const CHAR_WIDTH = CHARACTER_FRAMES[0][0].length * SCALE
export const POOP_HEIGHT = POOP_SPRITE.length * SCALE
export const POOP_WIDTH = POOP_SPRITE[0].length * SCALE

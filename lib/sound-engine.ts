/**
 * Procedural sound engine using Web Audio API.
 * No external audio files — all sounds are synthesized.
 */

let ctx: AudioContext | null = null
let muted = false

function getCtx(): AudioContext {
  if (!ctx) ctx = new AudioContext()
  return ctx
}

function beep(
  frequency: number,
  duration: number,
  type: OscillatorType = 'square',
  gainValue = 0.18,
  fadeOut = true,
) {
  if (muted) return
  const ac = getCtx()
  if (ac.state === 'suspended') ac.resume()

  const osc = ac.createOscillator()
  const gain = ac.createGain()

  osc.connect(gain)
  gain.connect(ac.destination)

  osc.type = type
  osc.frequency.setValueAtTime(frequency, ac.currentTime)

  gain.gain.setValueAtTime(gainValue, ac.currentTime)
  if (fadeOut) {
    gain.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + duration)
  }

  osc.start(ac.currentTime)
  osc.stop(ac.currentTime + duration)
}

/** 카운트다운 비프 (3, 2, 1) */
export function playCountdownBeep() {
  beep(880, 0.12, 'square', 0.15)
}

/** GO! 시작음 — 상승 화음 */
export function playGoSound() {
  beep(523, 0.1, 'square', 0.18)
  setTimeout(() => beep(659, 0.1, 'square', 0.18), 80)
  setTimeout(() => beep(784, 0.2, 'square', 0.22), 160)
}

/** 똥 근접 통과 (near miss) — 낮은 삑 */
export function playNearMiss() {
  beep(220, 0.08, 'sine', 0.12)
}

/** 충돌 — 거친 buzz */
export function playCollision() {
  if (muted) return
  const ac = getCtx()
  if (ac.state === 'suspended') ac.resume()

  // Noise burst
  const bufferSize = ac.sampleRate * 0.18
  const buffer = ac.createBuffer(1, bufferSize, ac.sampleRate)
  const data = buffer.getChannelData(0)
  for (let i = 0; i < bufferSize; i++) {
    data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize)
  }
  const source = ac.createBufferSource()
  source.buffer = buffer

  const gain = ac.createGain()
  gain.gain.setValueAtTime(0.35, ac.currentTime)
  gain.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + 0.18)

  source.connect(gain)
  gain.connect(ac.destination)
  source.start()

  // Low thud underneath
  beep(80, 0.2, 'sawtooth', 0.2)
}

/** 게임오버 — 하강 멜로디 */
export function playGameOver() {
  const notes = [523, 415, 330, 262]
  notes.forEach((freq, i) => {
    setTimeout(() => beep(freq, 0.22, 'square', 0.18), i * 160)
  })
}

export function isMuted() {
  return muted
}

export function setMuted(value: boolean) {
  muted = value
  try {
    localStorage.setItem('poop-dodge:muted', JSON.stringify(value))
  } catch {
    // ignore
  }
}

export function loadMutedFromStorage() {
  try {
    const raw = localStorage.getItem('poop-dodge:muted')
    if (raw !== null) muted = JSON.parse(raw) === true
  } catch {
    // ignore
  }
}

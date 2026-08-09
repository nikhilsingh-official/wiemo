type Glow = {
  x: number
  y: number
  size: number
  color: string
  opacity: number
}

type MotionVector = {
  x: number
  y: number
}

type PageBackgroundConfig = {
  name: string
  seed: number
  accentColor: string
  secondaryColor: string
  grid: {
    width: number
    height: number
    angle: number
    opacity: number
  }
  stars: {
    count: number
    minSize: number
    maxSize: number
    minOpacity: number
    maxOpacity: number
  }
  glows: Glow[]
}

export type GeneratedStar = {
  id: number
  x: number
  y: number
  size: number
  opacity: number
  dimOpacity: number
  color: string
  blur: number
  drift: MotionVector
  startOffset: MotionVector
  minScale: number
  maxScale: number
  duration: number
  delay: number
}

type GeneratedPageBackground = PageBackgroundConfig & {
  starsGenerated: GeneratedStar[]
}

// Central tuning for the single background shared by every page.
export const STAR_MOTION = {
  minDrift: 1.5,
  maxDrift: 7,
  minDuration: 7,
  maxDuration: 15,
  minDimRatio: 0.58,
  maxDimRatio: 0.82,
  minScale: 0.78,
  maxScale: 1.16,
  startOffsetRatio: -0.42,
} as const

const SITE_BACKGROUND = {
  name: 'Accelerator field',
  seed: 4409,
  accentColor: 'var(--beam)',
  secondaryColor: 'var(--signal)',
  grid: { width: 52, height: 52, angle: 0, opacity: 0.034 },
  stars: { count: 94, minSize: 1, maxSize: 3, minOpacity: 0.16, maxOpacity: 0.85 },
  glows: [
    { x: 76, y: 20, size: 42, color: 'var(--atlas)', opacity: 0.14 },
    { x: 52, y: 52, size: 22, color: 'var(--signal)', opacity: 0.055 },
  ],
} as const satisfies PageBackgroundConfig

export function createPageBackground(): GeneratedPageBackground {
  const random = createSeededRandom(SITE_BACKGROUND.seed)
  const starsGenerated = Array.from({ length: SITE_BACKGROUND.stars.count }, (_, index) => {
    const position = createStarPosition(random, index)
    const bright = random() > 0.84
    const opacity = mix(
      SITE_BACKGROUND.stars.minOpacity,
      SITE_BACKGROUND.stars.maxOpacity,
      bright ? 0.7 + random() * 0.3 : random()
    )
    const motion = createStarMotion(random)

    return {
      id: index,
      x: clamp(position.x, 1, 99),
      y: clamp(position.y, 1, 99),
      size: mix(
        SITE_BACKGROUND.stars.minSize,
        SITE_BACKGROUND.stars.maxSize,
        bright ? 0.72 + random() * 0.28 : random()
      ),
      opacity,
      dimOpacity: opacity * mix(STAR_MOTION.minDimRatio, STAR_MOTION.maxDimRatio, random()),
      color: random() > 0.78 ? SITE_BACKGROUND.secondaryColor : SITE_BACKGROUND.accentColor,
      blur: bright ? mix(4, 10, random()) : mix(0, 2.5, random()),
      ...motion,
      minScale: mix(STAR_MOTION.minScale, 0.94, random()),
      maxScale: mix(1.02, STAR_MOTION.maxScale, bright ? 0.65 + random() * 0.35 : random()),
      duration: mix(STAR_MOTION.minDuration, STAR_MOTION.maxDuration, random()),
      delay: mix(-STAR_MOTION.maxDuration, 0, random()),
    }
  })

  return {
    ...SITE_BACKGROUND,
    glows: [...SITE_BACKGROUND.glows],
    starsGenerated,
  }
}

function createStarPosition(random: () => number, index: number) {
  const normal = (random() + random() + random() + random() - 2) / 2
  return {
    x: random() * 100,
    y: 52 + normal * (index % 5 === 0 ? 34 : 14),
  }
}

function createStarMotion(random: () => number) {
  const direction = normalizeVector(1, (random() - 0.5) * 0.22)
  const distance = mix(STAR_MOTION.minDrift, STAR_MOTION.maxDrift, random())
  const drift = {
    x: direction.x * distance,
    y: direction.y * distance,
  }

  return {
    drift,
    startOffset: {
      x: drift.x * STAR_MOTION.startOffsetRatio,
      y: drift.y * STAR_MOTION.startOffsetRatio,
    },
  }
}

function createSeededRandom(seed: number) {
  let state = seed || 1
  return () => {
    state = (state + 0x6D2B79F5) | 0
    let value = Math.imul(state ^ (state >>> 15), 1 | state)
    value ^= value + Math.imul(value ^ (value >>> 7), 61 | value)
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296
  }
}

function mix(min: number, max: number, amount: number) {
  return min + (max - min) * amount
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value))
}

function normalizeVector(x: number, y: number) {
  const length = Math.hypot(x, y) || 1
  return { x: x / length, y: y / length }
}

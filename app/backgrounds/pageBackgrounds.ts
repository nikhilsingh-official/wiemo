export type StarDistribution =
  | 'uniform'
  | 'collision'
  | 'constellation'
  | 'aperture'
  | 'beam'
  | 'expansion'
  | 'bridge'
  | 'orbit'
  | 'spectrum'

type Glow = {
  x: number
  y: number
  size: number
  color: string
  opacity: number
}

export type PageBackgroundPreset = {
  name: string
  seed: number
  distribution: StarDistribution
  baseColor: string
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
  color: string
  blur: number
  duration: number
  delay: number
}

export type GeneratedPageBackground = PageBackgroundPreset & {
  path: string
  starsGenerated: GeneratedStar[]
}

const DEFAULT_PRESET: PageBackgroundPreset = {
  name: 'Deep field',
  seed: 101,
  distribution: 'uniform',
  baseColor: '#04060b',
  accentColor: '#33b4ec',
  secondaryColor: '#bde8fb',
  grid: { width: 60, height: 60, angle: 0, opacity: 0.028 },
  stars: { count: 90, minSize: 1, maxSize: 2.5, minOpacity: 0.18, maxOpacity: 0.72 },
  glows: [
    { x: 78, y: 24, size: 44, color: '#0b80c3', opacity: 0.1 },
  ],
}

// Central source of truth for every route's background character.
// Change a preset here to update that page family everywhere it appears.
export const PAGE_BACKGROUND_PRESETS = {
  home: {
    name: 'Particle collision',
    seed: 1103,
    distribution: 'collision',
    baseColor: '#04060b',
    accentColor: '#33b4ec',
    secondaryColor: '#f2b441',
    grid: { width: 64, height: 64, angle: 0, opacity: 0.03 },
    stars: { count: 118, minSize: 1, maxSize: 3.2, minOpacity: 0.18, maxOpacity: 0.84 },
    glows: [
      { x: 50, y: 48, size: 48, color: '#0b80c3', opacity: 0.15 },
      { x: 50, y: 48, size: 18, color: '#f2b441', opacity: 0.08 },
    ],
  },
  about: {
    name: 'People constellation',
    seed: 2207,
    distribution: 'constellation',
    baseColor: '#04060b',
    accentColor: '#bde8fb',
    secondaryColor: '#33b4ec',
    grid: { width: 72, height: 48, angle: 0, opacity: 0.025 },
    stars: { count: 76, minSize: 1, maxSize: 3.6, minOpacity: 0.2, maxOpacity: 0.88 },
    glows: [
      { x: 30, y: 32, size: 38, color: '#0a4e74', opacity: 0.14 },
      { x: 72, y: 66, size: 34, color: '#0b80c3', opacity: 0.09 },
    ],
  },
  gallery: {
    name: 'Camera aperture',
    seed: 3301,
    distribution: 'aperture',
    baseColor: '#04060b',
    accentColor: '#bde8fb',
    secondaryColor: '#f2b441',
    grid: { width: 88, height: 88, angle: 0, opacity: 0.022 },
    stars: { count: 84, minSize: 1, maxSize: 3.8, minOpacity: 0.16, maxOpacity: 0.9 },
    glows: [
      { x: 50, y: 46, size: 58, color: '#0b80c3', opacity: 0.13 },
      { x: 50, y: 46, size: 20, color: '#bde8fb', opacity: 0.06 },
    ],
  },
  timeline: {
    name: 'Accelerator beamline',
    seed: 4409,
    distribution: 'beam',
    baseColor: '#04060b',
    accentColor: '#33b4ec',
    secondaryColor: '#f2b441',
    grid: { width: 52, height: 52, angle: 0, opacity: 0.034 },
    stars: { count: 94, minSize: 1, maxSize: 3, minOpacity: 0.16, maxOpacity: 0.85 },
    glows: [
      { x: 76, y: 20, size: 42, color: '#0b80c3', opacity: 0.14 },
      { x: 52, y: 52, size: 22, color: '#f2b441', opacity: 0.055 },
    ],
  },
  impact: {
    name: 'Expanding reach',
    seed: 5503,
    distribution: 'expansion',
    baseColor: '#04060b',
    accentColor: '#33b4ec',
    secondaryColor: '#bde8fb',
    grid: { width: 46, height: 46, angle: 0, opacity: 0.027 },
    stars: { count: 112, minSize: 1, maxSize: 3.4, minOpacity: 0.18, maxOpacity: 0.84 },
    glows: [
      { x: 50, y: 52, size: 62, color: '#0b80c3', opacity: 0.13 },
    ],
  },
  volunteer: {
    name: 'Collaboration bridge',
    seed: 6607,
    distribution: 'bridge',
    baseColor: '#04060b',
    accentColor: '#bde8fb',
    secondaryColor: '#f2b441',
    grid: { width: 70, height: 70, angle: 45, opacity: 0.024 },
    stars: { count: 86, minSize: 1, maxSize: 3.4, minOpacity: 0.18, maxOpacity: 0.86 },
    glows: [
      { x: 24, y: 50, size: 36, color: '#0b80c3', opacity: 0.11 },
      { x: 76, y: 50, size: 36, color: '#f2b441', opacity: 0.07 },
    ],
  },
  reflections: {
    name: 'Reflection orbit',
    seed: 7703,
    distribution: 'orbit',
    baseColor: '#04060b',
    accentColor: '#33b4ec',
    secondaryColor: '#bde8fb',
    grid: { width: 60, height: 60, angle: 8, opacity: 0.022 },
    stars: { count: 104, minSize: 1, maxSize: 3, minOpacity: 0.16, maxOpacity: 0.8 },
    glows: [
      { x: 50, y: 48, size: 68, color: '#0a4e74', opacity: 0.12 },
    ],
  },
  series: {
    name: 'Learning spectrum',
    seed: 8807,
    distribution: 'spectrum',
    baseColor: '#04060b',
    accentColor: '#33b4ec',
    secondaryColor: '#f2b441',
    grid: { width: 54, height: 72, angle: 0, opacity: 0.026 },
    stars: { count: 108, minSize: 1, maxSize: 3.2, minOpacity: 0.17, maxOpacity: 0.82 },
    glows: [
      { x: 20, y: 24, size: 34, color: '#0b80c3', opacity: 0.1 },
      { x: 80, y: 74, size: 38, color: '#f2b441', opacity: 0.065 },
    ],
  },
} as const satisfies Record<string, PageBackgroundPreset>

const ROUTE_PRESETS: Array<{ matches: (path: string) => boolean, preset: PageBackgroundPreset }> = [
  { matches: path => path === '/', preset: PAGE_BACKGROUND_PRESETS.home },
  { matches: path => path === '/about', preset: PAGE_BACKGROUND_PRESETS.about },
  { matches: path => path === '/gallery', preset: PAGE_BACKGROUND_PRESETS.gallery },
  { matches: path => path === '/timeline', preset: PAGE_BACKGROUND_PRESETS.timeline },
  { matches: path => path === '/total-impact', preset: PAGE_BACKGROUND_PRESETS.impact },
  { matches: path => path === '/volunteer', preset: PAGE_BACKGROUND_PRESETS.volunteer },
  { matches: path => path.startsWith('/blog/reflections'), preset: PAGE_BACKGROUND_PRESETS.reflections },
  { matches: path => path.startsWith('/blog/series'), preset: PAGE_BACKGROUND_PRESETS.series },
]

export function createPageBackground(path: string): GeneratedPageBackground {
  const preset = ROUTE_PRESETS.find(routePreset => routePreset.matches(path))?.preset ?? DEFAULT_PRESET
  const seed = (preset.seed ^ hashString(path)) >>> 0
  const random = createSeededRandom(seed)
  const starsGenerated = Array.from({ length: preset.stars.count }, (_, index) => {
    const position = createStarPosition(preset.distribution, random, index, preset.stars.count)
    const bright = random() > 0.84

    return {
      id: index,
      x: clamp(position.x, 1, 99),
      y: clamp(position.y, 1, 99),
      size: mix(preset.stars.minSize, preset.stars.maxSize, bright ? 0.72 + random() * 0.28 : random()),
      opacity: mix(preset.stars.minOpacity, preset.stars.maxOpacity, bright ? 0.7 + random() * 0.3 : random()),
      color: random() > 0.78 ? preset.secondaryColor : preset.accentColor,
      blur: bright ? mix(4, 10, random()) : mix(0, 2.5, random()),
      duration: mix(4.5, 9, random()),
      delay: mix(-8, 0, random()),
    }
  })

  return {
    ...preset,
    path,
    starsGenerated,
  }
}

function createStarPosition(
  distribution: StarDistribution,
  random: () => number,
  index: number,
  count: number,
) {
  const normal = () => (random() + random() + random() + random() - 2) / 2

  switch (distribution) {
    case 'collision': {
      const fromLeft = index % 2 === 0
      const depth = random()
      return {
        x: fromLeft ? 5 + depth * 45 : 95 - depth * 45,
        y: 50 + normal() * (30 - depth * 22),
      }
    }
    case 'constellation': {
      const anchors = [
        { x: 22, y: 30 }, { x: 38, y: 57 }, { x: 53, y: 38 }, { x: 68, y: 65 }, { x: 82, y: 34 },
      ]
      const anchor = anchors[index % anchors.length]!
      return { x: anchor.x + normal() * 15, y: anchor.y + normal() * 18 }
    }
    case 'aperture': {
      const angle = random() * Math.PI * 2
      const radius = 18 + random() * 34
      return { x: 50 + Math.cos(angle) * radius, y: 48 + Math.sin(angle) * radius * 0.72 }
    }
    case 'beam':
      return { x: random() * 100, y: 52 + normal() * (index % 5 === 0 ? 34 : 14) }
    case 'expansion': {
      const angle = random() * Math.PI * 2
      const radius = Math.sqrt(random()) * 53
      return { x: 50 + Math.cos(angle) * radius, y: 52 + Math.sin(angle) * radius * 0.86 }
    }
    case 'bridge': {
      if (index < count * 0.42) return { x: 22 + normal() * 18, y: 50 + normal() * 30 }
      if (index < count * 0.84) return { x: 78 + normal() * 18, y: 50 + normal() * 30 }
      return { x: 22 + random() * 56, y: 50 + normal() * 7 }
    }
    case 'orbit': {
      const angle = random() * Math.PI * 2
      const radius = 28 + normal() * 16
      return { x: 50 + Math.cos(angle) * radius, y: 48 + Math.sin(angle) * radius * 0.7 }
    }
    case 'spectrum': {
      const band = index % 5
      return { x: random() * 100, y: 14 + band * 18 + normal() * 7 }
    }
    default:
      return { x: random() * 100, y: random() * 100 }
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

function hashString(value: string) {
  let hash = 2166136261
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index)
    hash = Math.imul(hash, 16777619)
  }
  return hash >>> 0
}

function mix(min: number, max: number, amount: number) {
  return min + (max - min) * amount
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value))
}

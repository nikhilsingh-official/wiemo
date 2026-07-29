import type { MorphEvent } from '../three/types'

export interface HeroStage {
  filename: string
  label: string
  headline: string
}

/** The ordered source of truth for every stage shown by the hero canvas and UI. */
export const HERO_STAGES = [
  { filename: 'SpiralGalaxy.glb', label: 'Galaxy', headline: 'galaxies' },
  { filename: 'EarthContinents.glb', label: 'Earth', headline: 'worlds' },
  { filename: 'DNA.glb', label: 'DNA', headline: 'life' },
  { filename: 'Human.glb', label: 'Human', headline: 'you' },
  { filename: 'Fullerene.glb', label: 'Atomic scale', headline: 'matter' },
  { filename: 'CmsCollision.glb', label: 'Collision', headline: 'where we start' },
] as const satisfies readonly HeroStage[]

export type HeroStageFilename = typeof HERO_STAGES[number]['filename']

export const HERO_MODEL_FILENAMES = HERO_STAGES.map(
  (stage) => stage.filename,
)

export const HERO_MODEL_URLS = HERO_STAGES.map(
  (stage) => `/models/${stage.filename}`,
)

const stageByFilename = new Map<string, HeroStage>(
  HERO_STAGES.map((stage) => [stage.filename, stage]),
)

export function getHeroStage(filename: string): HeroStage {
  const stage = stageByFilename.get(filename)
  if (!stage) throw new Error(`Unknown hero stage: ${filename}`)
  return stage
}

export function createInitialHeroMorph(duration: number): MorphEvent {
  const [firstStage, secondStage] = HERO_STAGES
  if (!firstStage || !secondStage) {
    throw new Error('The hero stage directory requires at least two stages.')
  }

  return {
    from: firstStage.filename,
    to: secondStage.filename,
    progress: 0,
    easedProgress: 0,
    elapsed: 0,
    duration,
  }
}

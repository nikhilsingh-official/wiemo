import { HERO_MODEL_FILENAMES } from '../three/heroModels.ts'

export const HERO_OPENING_STAGE_NAME = 'spiral-galaxy'

type HeroModelName = typeof HERO_MODEL_FILENAMES[number]
export type HeroStageName = typeof HERO_OPENING_STAGE_NAME | HeroModelName

export interface HeroStagePresentation {
  label: string
  headline: string
}

export const HERO_STAGE_PRESENTATION = {
  [HERO_OPENING_STAGE_NAME]: { label: 'Galaxy', headline: 'galaxies' },
  'EarthContinents.glb': { label: 'Earth', headline: 'worlds' },
  'DNA.glb': { label: 'DNA', headline: 'life' },
  'Human.glb': { label: 'Human', headline: 'you' },
  'Fullerene.glb': { label: 'Atomic scale', headline: 'matter' },
  'CmsCollision.glb': { label: 'Collision', headline: 'where we start' },
} as const satisfies Record<HeroStageName, HeroStagePresentation>

export function getHeroStagePresentation(stageName: string): HeroStagePresentation {
  return HERO_STAGE_PRESENTATION[stageName as HeroStageName] ?? {
    label: stageName,
    headline: stageName,
  }
}

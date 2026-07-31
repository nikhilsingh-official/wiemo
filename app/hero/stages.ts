export interface HeroStage {
  modelFilename: string
  label: string
  headline: string
}

export const HERO_STAGE = {
  galaxy: {
    modelFilename: 'SpiralGalaxy.glb',
    label: 'Galaxy',
    headline: 'galaxies',
  },
  earth: {
    modelFilename: 'EarthContinents.glb',
    label: 'Earth',
    headline: 'worlds',
  },
  dna: {
    modelFilename: 'DNA.glb',
    label: 'DNA',
    headline: 'life',
  },
  human: {
    modelFilename: 'Human.glb',
    label: 'Human',
    headline: 'you',
  },
  matter: {
    modelFilename: 'Fullerene.glb',
    label: 'Atomic scale',
    headline: 'matter',
  },
  collision: {
    modelFilename: 'CmsCollision.glb',
    label: 'Collision',
    headline: 'where we start',
  },
  about: {
    modelFilename: 'People.glb',
    label: 'People',
    headline: 'people',
  },
  gallery: {
    modelFilename: 'Camera.glb',
    label: 'Camera',
    headline: 'moments',
  },
  blog: {
    modelFilename: 'Speech.glb',
    label: 'Speech',
    headline: 'ideas',
  },
  timeline: {
    modelFilename: 'Hourglass.glb',
    label: 'Hourglass',
    headline: 'time',
  },
  volunteer: {
    modelFilename: 'Handshake.glb',
    label: 'Handshake',
    headline: 'collaboration',
  },
  totalImpact: {
    modelFilename: 'EarthContinents.glb',
    label: 'Total impact',
    headline: 'impact',
  },
} as const satisfies Record<string, HeroStage>

export const HOME_HERO_STAGES = [
  HERO_STAGE.galaxy,
  HERO_STAGE.earth,
  HERO_STAGE.dna,
  HERO_STAGE.human,
  HERO_STAGE.matter,
  HERO_STAGE.collision,
] as const satisfies readonly HeroStage[]

export const HERO_MODEL_FILENAMES = [
  'EarthContinents.glb',
  'DNA.glb',
  'Human.glb',
  'Fullerene.glb',
  'CmsCollision.glb',
] as const

export const HERO_MODEL_URLS = HERO_MODEL_FILENAMES.map(
  (filename) => `/models/${filename}`,
)

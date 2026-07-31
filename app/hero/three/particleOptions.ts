import type { ParticleOptions, ParticleOptionsInput } from './types.ts'

export const DEFAULT_PARTICLE_OPTIONS = Object.freeze({
  modelUrls: Object.freeze([] as string[]),
  modelNames: Object.freeze([] as string[]),
  particleCount: 24_000,
  autoPlay: true,
  morphDuration: 1.8,
  holdDuration: 1.1,
  pointSize: 5.5,
  particleColor: '#65d8ff',
  backgroundColor: '#020308',
  backgroundAlpha: 1,
  driftStrength: 1,
  rotationSpeed: 0.08,
  camera: Object.freeze({
    fov: 42,
    near: 0.1,
    far: 100,
    distance: 9,
  }),
  renderer: Object.freeze({
    alpha: false,
    antialias: false,
    maxPixelRatio: 2,
    powerPreference: 'high-performance',
  }),
  model: Object.freeze({
    center: true,
    size: 5,
  }),
})

/** Merges partial, nested overrides into a complete and independent options object. */
export function defineParticleOptions(overrides: ParticleOptionsInput = {}): ParticleOptions {
  const modelUrls = [...(overrides.modelUrls ?? DEFAULT_PARTICLE_OPTIONS.modelUrls)]
  const modelNames = [...(overrides.modelNames ?? DEFAULT_PARTICLE_OPTIONS.modelNames)]
  if (modelNames.length > 0 && modelNames.length !== modelUrls.length) {
    throw new Error('modelNames must be empty or contain one name for every modelUrl.')
  }

  return {
    ...DEFAULT_PARTICLE_OPTIONS,
    ...overrides,
    modelUrls,
    modelNames,
    camera: {
      ...DEFAULT_PARTICLE_OPTIONS.camera,
      ...overrides.camera,
    },
    renderer: {
      ...DEFAULT_PARTICLE_OPTIONS.renderer,
      ...overrides.renderer,
    },
    model: {
      ...DEFAULT_PARTICLE_OPTIONS.model,
      ...overrides.model,
    },
  }
}

import type { ParticleOptions, ParticleOptionsInput } from './types'

export const DEFAULT_PARTICLE_OPTIONS = Object.freeze({
  modelUrls: Object.freeze([] as string[]),
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
  return {
    ...DEFAULT_PARTICLE_OPTIONS,
    ...overrides,
    modelUrls: [...(overrides.modelUrls ?? DEFAULT_PARTICLE_OPTIONS.modelUrls)],
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

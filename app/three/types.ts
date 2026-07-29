export interface ParticleShape {
  name: string
  positions: Float32Array
  /** Optional per-particle light intensity; defaults to 1. */
  brightness?: Float32Array
}

export interface GltfShapeOptions {
  /** Centre the collected vertices around the origin. */
  center: boolean
  /** Resize the longest side of the model to this many world units. */
  size: number
}

export interface ParticleCameraOptions {
  fov: number
  near: number
  far: number
  distance: number
}

export interface ParticleRendererOptions {
  alpha: boolean
  antialias: boolean
  maxPixelRatio: number
  powerPreference: WebGLPowerPreference
}

/** The single public configuration contract for the canvas and Three.js engine. */
export interface ParticleOptions {
  modelUrls: string[]
  particleCount: number
  autoPlay: boolean
  morphDuration: number
  holdDuration: number
  pointSize: number
  particleColor: string
  backgroundColor: string
  backgroundAlpha: number
  driftStrength: number
  rotationSpeed: number
  camera: ParticleCameraOptions
  renderer: ParticleRendererOptions
  model: GltfShapeOptions
}

export type ParticleOptionsInput = Partial<Omit<ParticleOptions, 'camera' | 'renderer' | 'model'>> & {
  camera?: Partial<ParticleCameraOptions>
  renderer?: Partial<ParticleRendererOptions>
  model?: Partial<GltfShapeOptions>
}

/** Linear and eased progress are both exposed so UI can choose how it synchronizes. */
export interface MorphEvent {
  from: string
  to: string
  progress: number
  easedProgress: number
  elapsed: number
  duration: number
}

export interface ParticleExperienceEvents {
  onMorphStart?: (event: MorphEvent) => void
  onMorphProgress?: (event: MorphEvent) => void
  onMorphComplete?: (event: MorphEvent) => void
}

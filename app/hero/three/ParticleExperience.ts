import {
  PerspectiveCamera,
  Scene,
  Timer,
  WebGLRenderer,
} from 'three'
import { GltfParticleLoader } from './assets/GltfParticleLoader.ts'
import { defineParticleOptions } from './particleOptions.ts'
import { GpuParticleMorph } from './particles/GpuParticleMorph.ts'
import { createDefaultShapes } from './particles/createShapes.ts'
import type {
  GltfShapeOptions,
  ParticleExperienceEvents,
  ParticleOptions,
  ParticleOptionsInput,
  ParticleShape,
} from './types.ts'

/** Owns the Three.js lifecycle and exposes the small public API the UI needs. */
export class ParticleExperience {
  private readonly scene = new Scene()
  private readonly camera: PerspectiveCamera
  private readonly renderer: WebGLRenderer
  private readonly timer = new Timer()
  private readonly loader = new GltfParticleLoader()
  private readonly shapeCache = new Map<string, Promise<ParticleShape>>()
  private readonly particles: GpuParticleMorph
  private readonly resizeObserver: ResizeObserver
  private options: ParticleOptions
  private shapes: ParticleShape[]
  private currentShapeIndex = 0
  private cycleElapsed = 0
  private animationFrame = 0
  private running = false

  constructor(
    private readonly canvas: HTMLCanvasElement,
    options: ParticleOptionsInput = {},
    private readonly events: ParticleExperienceEvents = {},
  ) {
    this.options = defineParticleOptions(options)
    this.shapes = createDefaultShapes(this.options.particleCount)
    this.camera = new PerspectiveCamera(
      this.options.camera.fov,
      1,
      this.options.camera.near,
      this.options.camera.far,
    )

    this.renderer = new WebGLRenderer({
      canvas,
      alpha: this.options.renderer.alpha,
      antialias: this.options.renderer.antialias,
      powerPreference: this.options.renderer.powerPreference,
    })
    this.renderer.setClearColor(this.options.backgroundColor, this.options.backgroundAlpha)
    this.camera.position.set(0, 0, this.options.camera.distance)
    this.timer.connect(document)

    const initialShape = this.shapes[0]
    if (!initialShape) {
      throw new Error('ParticleExperience requires at least one initial shape.')
    }
    this.particles = new GpuParticleMorph(initialShape, {
      pixelRatio: this.getPixelRatio(),
      pointSize: this.options.pointSize,
      color: this.options.particleColor,
      driftStrength: this.options.driftStrength,
    })
    this.scene.add(this.particles.points)

    this.resizeObserver = new ResizeObserver(() => this.resize())
    this.resizeObserver.observe(canvas)
    this.resize()
  }

  start(): void {
    if (this.running) return
    this.running = true
    this.timer.reset()
    this.animationFrame = requestAnimationFrame(this.tick)
  }

  /** Applies non-structural option changes without rebuilding the WebGL scene. */
  configure(options: ParticleOptionsInput): void {
    const nextOptions = defineParticleOptions(options)
    if (nextOptions.particleCount !== this.options.particleCount) {
      throw new Error('Changing particleCount requires a new ParticleExperience.')
    }

    this.options = nextOptions
    this.camera.fov = nextOptions.camera.fov
    this.camera.near = nextOptions.camera.near
    this.camera.far = nextOptions.camera.far
    this.camera.position.z = nextOptions.camera.distance
    this.camera.updateProjectionMatrix()
    this.renderer.setClearColor(nextOptions.backgroundColor, nextOptions.backgroundAlpha)
    this.particles.configure({
      pointSize: nextOptions.pointSize,
      color: nextOptions.particleColor,
      driftStrength: nextOptions.driftStrength,
    })
    this.resize()
  }

  loadGltfShape(
    url: string,
    options: GltfShapeOptions = this.options.model,
    name?: string,
  ): Promise<ParticleShape> {
    const cacheKey = JSON.stringify({ url, options })
    let shape = this.shapeCache.get(cacheKey)
    if (!shape) {
      shape = this.loader.load(url, this.options.particleCount, options)
      this.shapeCache.set(cacheKey, shape)
      void shape.catch(() => {
        if (this.shapeCache.get(cacheKey) === shape) {
          this.shapeCache.delete(cacheKey)
        }
      })
    }

    if (!name) return shape
    return shape.then((loadedShape) => ({
      ...loadedShape,
      name,
    }))
  }

  async loadGltfShapes(
    urls: string[],
    options: GltfShapeOptions = this.options.model,
    names: string[] = [],
  ): Promise<ParticleShape[]> {
    return Promise.all(
      urls.map((url, index) => this.loadGltfShape(url, options, names[index])),
    )
  }

  initializeShapeSequence(shapes: ParticleShape[]): void {
    const firstShape = this.replaceShapeSequence(shapes)
    if (firstShape) this.particles.setShapeImmediately(firstShape)
  }

  transitionToShapeSequence(shapes: ParticleShape[]): void {
    const firstShape = this.replaceShapeSequence(shapes)
    if (firstShape) this.beginMorph(firstShape, this.options.morphDuration)
  }

  morphTo(shape: ParticleShape, duration = this.options.morphDuration): void {
    this.beginMorph(shape, duration)
  }

  dispose(): void {
    this.running = false
    cancelAnimationFrame(this.animationFrame)
    this.resizeObserver.disconnect()
    this.scene.remove(this.particles.points)
    this.particles.dispose()
    this.renderer.dispose()
    this.timer.dispose()
    this.shapeCache.clear()
  }

  private readonly tick = (): void => {
    if (!this.running) return

    this.timer.update()
    const delta = Math.min(this.timer.getDelta(), 0.1)
    const elapsedTime = this.timer.getElapsed()
    const update = this.particles.update(delta, elapsedTime)

    if (update) {
      this.events.onMorphProgress?.(update.event)
      if (update.completed) this.events.onMorphComplete?.(update.event)
    }

    if (this.options.autoPlay && this.shapes.length > 1) {
      this.cycleElapsed += delta
      if (this.cycleElapsed >= this.options.morphDuration + this.options.holdDuration) {
        this.currentShapeIndex = (this.currentShapeIndex + 1) % this.shapes.length
        const nextShape = this.shapes[this.currentShapeIndex]
        if (nextShape) {
          this.beginMorph(nextShape, this.options.morphDuration)
        }
      }
    }

    this.particles.points.rotation.y = elapsedTime * this.options.rotationSpeed
    this.renderer.render(this.scene, this.camera)
    this.animationFrame = requestAnimationFrame(this.tick)
  }

  private beginMorph(shape: ParticleShape, duration: number): void {
    this.cycleElapsed = 0
    const event = this.particles.morphTo(shape, duration)
    this.events.onMorphStart?.(event)
    this.events.onMorphProgress?.(event)
  }

  private replaceShapeSequence(shapes: ParticleShape[]): ParticleShape | undefined {
    if (shapes.length === 0) return undefined
    this.shapes = shapes
    this.currentShapeIndex = 0
    this.cycleElapsed = 0
    return shapes[0]
  }

  private resize(): void {
    const width = Math.max(1, this.canvas.clientWidth)
    const height = Math.max(1, this.canvas.clientHeight)
    const pixelRatio = this.getPixelRatio()

    this.renderer.setPixelRatio(pixelRatio)
    this.renderer.setSize(width, height, false)
    this.camera.aspect = width / height
    this.camera.updateProjectionMatrix()
    this.particles.setPixelRatio(pixelRatio)
  }

  private getPixelRatio(): number {
    return Math.min(window.devicePixelRatio, this.options.renderer.maxPixelRatio)
  }
}

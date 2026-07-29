import {
  BufferAttribute,
  BufferGeometry,
  Color,
  CustomBlending,
  MaxEquation,
  OneFactor,
  Points,
  ShaderMaterial,
} from 'three'
import type { ParticleShape } from '../types'
import { particleFragmentShader, particleVertexShader } from './shaders.ts'
import type { MorphEvent } from '../types'

interface GpuParticleMorphOptions {
  pixelRatio: number
  pointSize: number
  color: string
  driftStrength: number
}

interface MorphUpdate {
  event: MorphEvent
  completed: boolean
}

export class GpuParticleMorph {
  readonly points: Points<BufferGeometry, ShaderMaterial>

  private readonly geometry = new BufferGeometry()
  private readonly material: ShaderMaterial
  private duration = 0
  private elapsed = 0
  private morphing = false
  private currentShapeName: string
  private targetShapeName: string

  constructor(initialShape: ParticleShape, options: GpuParticleMorphOptions) {
    this.currentShapeName = initialShape.name
    this.targetShapeName = initialShape.name
    const particleCount = initialShape.positions.length / 3
    const randomValues = new Float32Array(particleCount)
    for (let index = 0; index < particleCount; index += 1) {
      const sequenceValue = (index + 1) * 0.6180339887498949
      randomValues[index] = sequenceValue - Math.floor(sequenceValue)
    }

    this.geometry.setAttribute('position', new BufferAttribute(initialShape.positions.slice(), 3))
    this.geometry.setAttribute(
      'aTargetPosition',
      new BufferAttribute(initialShape.positions.slice(), 3),
    )
    this.geometry.setAttribute('aRandom', new BufferAttribute(randomValues, 1))
    const initialBrightness = this.getShapeBrightness(initialShape, particleCount)
    this.geometry.setAttribute('aBrightness', new BufferAttribute(initialBrightness.slice(), 1))
    this.geometry.setAttribute('aTargetBrightness', new BufferAttribute(initialBrightness.slice(), 1))

    this.material = new ShaderMaterial({
      vertexShader: particleVertexShader,
      fragmentShader: particleFragmentShader,
      uniforms: {
        uProgress: { value: 0 },
        uPointSize: { value: options.pointSize },
        uPixelRatio: { value: options.pixelRatio },
        uTime: { value: 0 },
        uColor: { value: new Color(options.color) },
        uDriftStrength: { value: options.driftStrength },
      },
      transparent: true,
      depthWrite: true,
      blending: CustomBlending,
      blendEquation: MaxEquation,
      blendSrc: OneFactor,
      blendDst: OneFactor,
      blendEquationAlpha: MaxEquation,
      blendSrcAlpha: OneFactor,
      blendDstAlpha: OneFactor,
    })

    this.points = new Points(this.geometry, this.material)
    this.points.frustumCulled = false
  }

  morphTo(shape: ParticleShape, duration: number): MorphEvent {
    this.assertCompatibleShape(shape)

    // Capture the visible in-between state so interrupted transitions never snap.
    if (this.morphing) this.bakeCurrentPosition()

    const target = this.geometry.getAttribute('aTargetPosition') as BufferAttribute
    target.array.set(shape.positions)
    target.needsUpdate = true
    this.copyShapeBrightness(shape, 'aTargetBrightness')
    this.duration = Math.max(0.01, duration)
    this.elapsed = 0
    this.morphing = true
    this.targetShapeName = shape.name
    this.material.uniforms.uProgress!.value = 0

    return this.createEvent(0)
  }

  /** Replaces both GPU position buffers without displaying a transition. */
  setShapeImmediately(shape: ParticleShape): void {
    const position = this.assertCompatibleShape(shape)
    const target = this.geometry.getAttribute('aTargetPosition') as BufferAttribute
    position.array.set(shape.positions)
    target.array.set(shape.positions)
    position.needsUpdate = true
    target.needsUpdate = true
    this.copyShapeBrightness(shape, 'aBrightness')
    this.copyShapeBrightness(shape, 'aTargetBrightness')
    this.duration = 0
    this.elapsed = 0
    this.morphing = false
    this.currentShapeName = shape.name
    this.targetShapeName = shape.name
    this.material.uniforms.uProgress!.value = 0
  }

  update(delta: number, elapsedTime: number): MorphUpdate | undefined {
    this.material.uniforms.uTime!.value = elapsedTime
    if (!this.morphing) return undefined

    this.elapsed += delta
    const progress = Math.min(this.elapsed / this.duration, 1)
    this.material.uniforms.uProgress!.value = progress

    const event = this.createEvent(progress)
    const completed = progress === 1
    if (completed) {
      this.bakeCurrentPosition()
      this.morphing = false
      this.currentShapeName = this.targetShapeName
    }

    return { event, completed }
  }

  setPixelRatio(pixelRatio: number): void {
    this.material.uniforms.uPixelRatio!.value = pixelRatio
  }

  configure(options: Pick<GpuParticleMorphOptions, 'pointSize' | 'color' | 'driftStrength'>): void {
    this.material.uniforms.uPointSize!.value = options.pointSize
    this.material.uniforms.uColor!.value.set(options.color)
    this.material.uniforms.uDriftStrength!.value = options.driftStrength
  }

  dispose(): void {
    this.geometry.dispose()
    this.material.dispose()
  }

  private bakeCurrentPosition(): void {
    const progress = this.easeInOutCubic(this.material.uniforms.uProgress!.value)
    const elapsedTime = this.material.uniforms.uTime!.value as number
    const arc = Math.sin(progress * Math.PI)
    const position = this.geometry.getAttribute('position') as BufferAttribute
    const target = this.geometry.getAttribute('aTargetPosition') as BufferAttribute
    const brightness = this.geometry.getAttribute('aBrightness') as BufferAttribute
    const targetBrightness = this.geometry.getAttribute('aTargetBrightness') as BufferAttribute
    const random = this.geometry.getAttribute('aRandom') as BufferAttribute
    const fromValues = position.array as Float32Array
    const targetValues = target.array as Float32Array
    const brightnessValues = brightness.array as Float32Array
    const targetBrightnessValues = targetBrightness.array as Float32Array

    for (let index = 0; index < fromValues.length; index += 3) {
      const randomValue = random.getX(index / 3)
      const driftScale = arc
        * (0.18 + randomValue * 0.42)
        * (this.material.uniforms.uDriftStrength!.value as number)

      fromValues[index] = this.mix(fromValues[index]!, targetValues[index]!, progress)
        + Math.sin(randomValue * 41 + elapsedTime * 0.45) * driftScale
      fromValues[index + 1] = this.mix(fromValues[index + 1]!, targetValues[index + 1]!, progress)
        + Math.cos(randomValue * 29 + elapsedTime * 0.35) * driftScale
      fromValues[index + 2] = this.mix(fromValues[index + 2]!, targetValues[index + 2]!, progress)
        + Math.sin(randomValue * 17 + elapsedTime * 0.25) * driftScale
      brightnessValues[index / 3] = this.mix(
        brightnessValues[index / 3]!,
        targetBrightnessValues[index / 3]!,
        progress,
      )
    }

    position.needsUpdate = true
    brightness.needsUpdate = true
    this.material.uniforms.uProgress!.value = 0
  }

  private assertCompatibleShape(shape: ParticleShape): BufferAttribute {
    const position = this.geometry.getAttribute('position') as BufferAttribute
    if (shape.positions.length !== position.array.length) {
      throw new Error('Every particle shape must contain the same number of positions.')
    }
    if (shape.brightness && shape.brightness.length !== position.count) {
      throw new Error('Particle brightness must contain one value per position.')
    }
    return position
  }

  private copyShapeBrightness(
    shape: ParticleShape,
    attributeName: 'aBrightness' | 'aTargetBrightness',
  ): void {
    const attribute = this.geometry.getAttribute(attributeName) as BufferAttribute
    const values = attribute.array as Float32Array
    if (shape.brightness) values.set(shape.brightness)
    else values.fill(1)
    attribute.needsUpdate = true
  }

  private getShapeBrightness(shape: ParticleShape, particleCount: number): Float32Array {
    if (shape.brightness) {
      if (shape.brightness.length !== particleCount) {
        throw new Error('Particle brightness must contain one value per position.')
      }
      return shape.brightness
    }
    return new Float32Array(particleCount).fill(1)
  }

  private easeInOutCubic(value: number): number {
    return value < 0.5
      ? 4 * value * value * value
      : 1 - Math.pow(-2 * value + 2, 3) / 2
  }

  private mix(from: number, to: number, progress: number): number {
    return from + (to - from) * progress
  }

  private createEvent(progress: number): MorphEvent {
    return {
      from: this.currentShapeName,
      to: this.targetShapeName,
      progress,
      easedProgress: this.easeInOutCubic(progress),
      elapsed: Math.min(this.elapsed, this.duration),
      duration: this.duration,
    }
  }
}

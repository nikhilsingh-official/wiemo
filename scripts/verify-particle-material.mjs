import { CustomBlending, MaxEquation, OneFactor } from 'three'
import { GpuParticleMorph } from '../app/three/particles/GpuParticleMorph.ts'

// Duplicate positions model intersecting GLTF surfaces such as segmented joints.
const overlappingShape = {
  name: 'overlapping-surfaces',
  positions: new Float32Array(4_096 * 3),
}
const particles = new GpuParticleMorph(overlappingShape, {
  pixelRatio: 1,
  pointSize: 3,
  color: '#0B80C3',
  driftStrength: 0,
})
const material = particles.points.material

const usesMaximumContribution = material.blending === CustomBlending
  && material.blendEquation === MaxEquation
  && material.blendSrc === OneFactor
  && material.blendDst === OneFactor
  && material.blendEquationAlpha === MaxEquation
  && material.blendSrcAlpha === OneFactor
  && material.blendDstAlpha === OneFactor
  && material.transparent
  && material.depthTest
  && material.depthWrite
console.log(`overlap contribution is bounded: ${usesMaximumContribution}`)
if (!usesMaximumContribution) {
  throw new Error('Overlapping particle surfaces must use maximum-contribution blending.')
}

const hasDedicatedColorVariation = material.vertexShader.includes('vColorVariation = aRandom')
  && material.fragmentShader.includes('mix(shadowColor, highlightColor, vColorVariation)')
console.log(`particle tint has a stable source: ${hasDedicatedColorVariation}`)
if (!hasDedicatedColorVariation) {
  throw new Error('Particle tint must use its own stable random variation.')
}

const hasViewDepthShading = material.vertexShader.includes('vDepthShade')
  && material.vertexShader.includes('viewPosition.z')
  && material.fragmentShader.includes('particleColor * vBrightness * vDepthShade')
console.log(`particle tint conveys view depth: ${hasViewDepthShading}`)
if (!hasViewDepthShading) {
  throw new Error('Particle tint must include a coherent view-space depth cue.')
}

const randomValues = particles.points.geometry.getAttribute('aRandom').array
const bins = new Array(10).fill(0)
for (const value of randomValues) bins[Math.min(9, Math.floor(value * bins.length))] += 1
const expectedPerBin = randomValues.length / bins.length
const hasFullRangeDistribution = bins.every((count) => (
  count > expectedPerBin * 0.9 && count < expectedPerBin * 1.1
))
console.log(`particle tint distribution spans full range: ${hasFullRangeDistribution}`)
if (!hasFullRangeDistribution) {
  throw new Error('Stable particle tint values must be distributed across the full range.')
}

particles.dispose()

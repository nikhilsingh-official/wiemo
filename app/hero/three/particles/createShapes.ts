import type { ParticleShape } from '../types.ts'

export const SPIRAL_GALAXY_PARTICLE_COUNT = 72_000

function random(index: number, salt: number): number {
  const value = Math.sin(index * 12.9898 + salt * 78.233) * 43758.5453
  return value - Math.floor(value)
}

export function createSphereShape(count: number): ParticleShape {
  const positions = new Float32Array(count * 3)
  const goldenAngle = Math.PI * (3 - Math.sqrt(5))

  for (let index = 0; index < count; index += 1) {
    const y = 1 - (index / Math.max(1, count - 1)) * 2
    const radius = Math.sqrt(1 - y * y)
    const angle = goldenAngle * index
    const target = index * 3
    positions[target] = Math.cos(angle) * radius * 2.25
    positions[target + 1] = y * 2.25
    positions[target + 2] = Math.sin(angle) * radius * 2.25
  }

  return { name: 'sphere', positions }
}

export function createTorusShape(count: number): ParticleShape {
  const positions = new Float32Array(count * 3)

  for (let index = 0; index < count; index += 1) {
    const majorAngle = random(index, 1) * Math.PI * 2
    const minorAngle = random(index, 2) * Math.PI * 2
    const majorRadius = 2.15
    const minorRadius = 0.72
    const target = index * 3
    positions[target] = (majorRadius + minorRadius * Math.cos(minorAngle)) * Math.cos(majorAngle)
    positions[target + 1] = minorRadius * Math.sin(minorAngle)
    positions[target + 2] = (majorRadius + minorRadius * Math.cos(minorAngle)) * Math.sin(majorAngle)
  }

  return { name: 'torus', positions }
}

export function createWaveShape(count: number): ParticleShape {
  const positions = new Float32Array(count * 3)
  const aspectWidth = 6.4
  const aspectHeight = 3.6

  for (let index = 0; index < count; index += 1) {
    const x = (random(index, 3) - 0.5) * aspectWidth
    const y = (random(index, 4) - 0.5) * aspectHeight
    const target = index * 3
    positions[target] = x
    positions[target + 1] = y
    positions[target + 2] = Math.sin(x * 1.8) * Math.cos(y * 2.2) * 0.7
  }

  return { name: 'wave', positions }
}

/** Builds the opening galaxy as a continuous point field instead of sampled mesh surfaces. */
export function createSpiralGalaxyShape(count: number): ParticleShape {
  const positions = new Float32Array(count * 3)
  const brightness = new Float32Array(count)
  const maximumRadius = 2.45
  const coreShare = 0.18
  const diskShare = 0.2
  const armCount = 4

  for (let index = 0; index < count; index += 1) {
    const target = index * 3
    const region = random(index, 20)

    if (region < coreShare) {
      const radius = Math.pow(random(index, 21), 1.8) * 0.72
      const angle = random(index, 22) * Math.PI * 2
      const thickness = (random(index, 23) - 0.5) * 0.34 * (1 - radius / 0.9)
      positions[target] = Math.cos(angle) * radius
      positions[target + 1] = Math.sin(angle) * radius * 0.72
      positions[target + 2] = thickness
      brightness[index] = 1.1 + (1 - radius / 0.72) * 0.35
      continue
    }

    const normalizedRadius = Math.pow(random(index, 24), 0.72)
    const radius = 0.28 + normalizedRadius * (maximumRadius - 0.28)

    if (region < coreShare + diskShare) {
      const angle = random(index, 25) * Math.PI * 2
      positions[target] = Math.cos(angle) * radius
      positions[target + 1] = Math.sin(angle) * radius
      positions[target + 2] = (random(index, 26) - 0.5) * 0.1
      brightness[index] = 0.5 + random(index, 27) * 0.2
      continue
    }

    const arm = index % armCount
    const armAngle = arm * Math.PI * 2 / armCount + 0.25 + normalizedRadius * Math.PI * 0.95
    const angularWidth = 0.13 + normalizedRadius * 0.34
    const angle = armAngle + (random(index, 28) - 0.5) * angularWidth
    const radialWidth = 0.07 + normalizedRadius * 0.15
    const variedRadius = radius + (random(index, 29) - 0.5) * radialWidth

    positions[target] = Math.cos(angle) * variedRadius
    positions[target + 1] = Math.sin(angle) * variedRadius
    positions[target + 2] = (random(index, 30) - 0.5) * (0.13 - normalizedRadius * 0.07)
    brightness[index] = 0.78 + random(index, 31) * 0.34
  }

  return { name: 'spiral-galaxy', positions, brightness }
}

export function createDefaultShapes(count: number): ParticleShape[] {
  return [createSphereShape(count), createTorusShape(count), createWaveShape(count)]
}

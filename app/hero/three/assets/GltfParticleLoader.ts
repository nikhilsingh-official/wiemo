import {
  Box3,
  BufferAttribute,
  Mesh,
  Object3D,
  Points,
  SkinnedMesh,
  Vector3,
} from 'three'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import type { GltfShapeOptions, ParticleShape } from '../types.ts'

interface MeshSurface {
  /** Nine XYZ values per triangle, already transformed into world space. */
  triangles: number[]
  triangleAreas: number[]
  area: number
  brightness: number
  density: number
}

interface SampledSurface {
  positions: Float32Array
  brightness: Float32Array
}

interface CollectedSurface {
  meshes: MeshSurface[]
  bounds: Box3
}

interface CollectedPointCloud extends SampledSurface {
  bounds: Box3
}

const MIN_PARTICLES_PER_MESH = 128

/** Converts GLTF triangle surfaces into one consistently sized particle set. */
export class GltfParticleLoader {
  private readonly loader = new GLTFLoader()

  async load(
    url: string,
    particleCount: number,
    options: GltfShapeOptions,
  ): Promise<ParticleShape> {
    const gltf = await this.loader.loadAsync(url)
    return this.createShapeFromScene(gltf.scene, particleCount, options, url.split('/').pop() ?? url)
  }

  /** Converts an already-loaded scene into a particle shape. Also provides a narrow test seam. */
  createShapeFromScene(
    root: Object3D,
    particleCount: number,
    options: GltfShapeOptions,
    name = 'scene',
  ): ParticleShape {
    const pointCloud = this.collectPointCloud(root)
    if (pointCloud.positions.length > 0) {
      const sampled = this.samplePointCloud(pointCloud, particleCount)
      return {
        name,
        positions: this.normalize(
          sampled.positions,
          options.center,
          options.size,
          pointCloud.bounds,
        ),
        brightness: sampled.brightness,
      }
    }

    const surface = this.collectSurface(root)

    if (surface.meshes.length === 0) {
      throw new Error(`GLTF scene "${name}" contains no triangle surfaces.`)
    }

    const sampled = this.sampleSurface(surface.meshes, particleCount)
    const normalized = this.normalize(
      sampled.positions,
      options.center,
      options.size,
      surface.bounds,
    )

    return {
      name,
      positions: normalized,
      brightness: sampled.brightness,
    }
  }

  private collectPointCloud(root: Object3D): CollectedPointCloud {
    root.updateWorldMatrix(true, true)
    const positions: number[] = []
    const brightness: number[] = []
    const bounds = new Box3()
    const point = new Vector3()

    root.traverse((object) => {
      if (!(object instanceof Points)) return
      const sourcePositions = object.geometry.getAttribute('position') as BufferAttribute | undefined
      if (!sourcePositions) return
      const sourceBrightness = object.geometry.getAttribute('_particlebrightness') as BufferAttribute | undefined

      for (let index = 0; index < sourcePositions.count; index += 1) {
        point.fromBufferAttribute(sourcePositions, index).applyMatrix4(object.matrixWorld)
        positions.push(point.x, point.y, point.z)
        brightness.push(sourceBrightness?.getX(index) ?? 1)
        bounds.expandByPoint(point)
      }
    })

    return {
      positions: Float32Array.from(positions),
      brightness: Float32Array.from(brightness),
      bounds,
    }
  }

  private samplePointCloud(source: SampledSurface, particleCount: number): SampledSurface {
    const sourceCount = source.positions.length / 3
    const positions = new Float32Array(particleCount * 3)
    const brightness = new Float32Array(particleCount)
    if (sourceCount === 0) return { positions, brightness }

    for (let index = 0; index < particleCount; index += 1) {
      const sourceIndex = particleCount <= sourceCount
        ? Math.floor(index * sourceCount / particleCount)
        : index % sourceCount
      const sourceOffset = sourceIndex * 3
      const targetOffset = index * 3
      positions[targetOffset] = source.positions[sourceOffset]!
      positions[targetOffset + 1] = source.positions[sourceOffset + 1]!
      positions[targetOffset + 2] = source.positions[sourceOffset + 2]!
      brightness[index] = source.brightness[sourceIndex]!
    }

    return { positions, brightness }
  }

  private collectSurface(root: Object3D): CollectedSurface {
    root.updateWorldMatrix(true, true)
    const meshes: MeshSurface[] = []
    const bounds = new Box3()
    const a = new Vector3()
    const b = new Vector3()
    const c = new Vector3()
    const edgeAB = new Vector3()
    const edgeAC = new Vector3()

    root.traverse((object) => {
      if (!(object instanceof Mesh)) return
      const position = object.geometry.getAttribute('position') as BufferAttribute | undefined
      if (!position) return

      const index = object.geometry.getIndex()
      const triangleCount = Math.floor((index?.count ?? position.count) / 3)
      const triangles: number[] = []
      const triangleAreas: number[] = []
      let totalArea = 0

      for (let triangleIndex = 0; triangleIndex < triangleCount; triangleIndex += 1) {
        const offset = triangleIndex * 3
        const indexA = index ? index.getX(offset) : offset
        const indexB = index ? index.getX(offset + 1) : offset + 1
        const indexC = index ? index.getX(offset + 2) : offset + 2

        this.readWorldVertex(object, position, indexA, a)
        this.readWorldVertex(object, position, indexB, b)
        this.readWorldVertex(object, position, indexC, c)

        const area = edgeAB.subVectors(b, a).cross(edgeAC.subVectors(c, a)).length() * 0.5
        if (area <= Number.EPSILON) continue

        bounds.expandByPoint(a)
        bounds.expandByPoint(b)
        bounds.expandByPoint(c)
        triangles.push(a.x, a.y, a.z, b.x, b.y, b.z, c.x, c.y, c.z)
        triangleAreas.push(area)
        totalArea += area
      }

      const configuredBrightness = object.userData.particleBrightness
      const brightness = typeof configuredBrightness === 'number'
        && Number.isFinite(configuredBrightness)
        ? Math.max(0, configuredBrightness)
        : 1
      const configuredDensity = object.userData.particleDensity
      const density = typeof configuredDensity === 'number'
        && Number.isFinite(configuredDensity)
        ? Math.max(0, configuredDensity)
        : 1
      if (totalArea > 0) {
        meshes.push({ triangles, triangleAreas, area: totalArea, brightness, density })
      }
    })

    return { meshes, bounds }
  }

  private readWorldVertex(
    mesh: Mesh,
    positions: BufferAttribute,
    index: number,
    target: Vector3,
  ): Vector3 {
    target.fromBufferAttribute(positions, index)
    if (mesh instanceof SkinnedMesh) mesh.applyBoneTransform(index, target)
    return target.applyMatrix4(mesh.matrixWorld)
  }

  private sampleSurface(meshes: MeshSurface[], particleCount: number): SampledSurface {
    const positions = new Float32Array(particleCount * 3)
    const brightness = new Float32Array(particleCount)
    const allocations = this.allocateParticles(meshes, particleCount)
    let outputIndex = 0

    for (let meshIndex = 0; meshIndex < meshes.length; meshIndex += 1) {
      const mesh = meshes[meshIndex]!
      const allocation = allocations[meshIndex]!
      const triangleAllocations = this.allocateByArea(mesh.triangleAreas, allocation, 1)

      for (let triangleIndex = 0; triangleIndex < triangleAllocations.length; triangleIndex += 1) {
        const triangleOffset = triangleIndex * 9
        const triangleAllocation = triangleAllocations[triangleIndex]!

        for (let sampleIndex = 0; sampleIndex < triangleAllocation; sampleIndex += 1) {
          // Irrational sequences give deterministic, non-repeating barycentric
          // coordinates without introducing bands from triangle buffer order.
          const sequenceIndex = outputIndex + 1 + meshIndex * 131
          const rootU = Math.sqrt(this.fraction(sequenceIndex * 0.7548776662466927))
          const v = this.fraction(sequenceIndex * 0.5698402909980532)
          const weightA = 1 - rootU
          const weightB = rootU * (1 - v)
          const weightC = rootU * v
          const target = outputIndex * 3

          positions[target] = mesh.triangles[triangleOffset]! * weightA
            + mesh.triangles[triangleOffset + 3]! * weightB
            + mesh.triangles[triangleOffset + 6]! * weightC
          positions[target + 1] = mesh.triangles[triangleOffset + 1]! * weightA
            + mesh.triangles[triangleOffset + 4]! * weightB
            + mesh.triangles[triangleOffset + 7]! * weightC
          positions[target + 2] = mesh.triangles[triangleOffset + 2]! * weightA
            + mesh.triangles[triangleOffset + 5]! * weightB
            + mesh.triangles[triangleOffset + 8]! * weightC
          brightness[outputIndex] = mesh.brightness
          outputIndex += 1
        }
      }
    }

    return { positions, brightness }
  }

  private allocateParticles(meshes: MeshSurface[], particleCount: number): number[] {
    // The fixed floor keeps small meshes legible. Square-root area weighting
    // then gives them a larger share than linear surface area would. A second
    // one-particle triangle floor inside sampleSurface protects fine geometry.
    return this.allocateByArea(
      meshes.map((mesh) => mesh.area * mesh.density * mesh.density),
      particleCount,
      MIN_PARTICLES_PER_MESH,
    )
  }

  private allocateByArea(areas: number[], particleCount: number, maximumMinimum: number): number[] {
    const allocations = new Array<number>(areas.length).fill(0)
    if (particleCount <= 0 || areas.length === 0) return allocations

    const minimum = particleCount >= areas.length
      ? Math.max(1, Math.min(maximumMinimum, Math.floor(particleCount / (areas.length * 2))))
      : 0

    allocations.fill(minimum)
    const allocatedMinimum = minimum * areas.length
    const remaining = particleCount - allocatedMinimum
    if (remaining <= 0) return allocations

    const weights = areas.map((area) => Math.sqrt(area))
    const totalWeight = weights.reduce((sum, weight) => sum + weight, 0)
    const fractions: Array<{ index: number, fraction: number }> = []
    let allocatedWeighted = 0

    for (let index = 0; index < areas.length; index += 1) {
      const exact = totalWeight > 0 ? remaining * weights[index]! / totalWeight : 0
      const whole = Math.floor(exact)
      allocations[index] = allocations[index]! + whole
      allocatedWeighted += whole
      fractions.push({ index, fraction: exact - whole })
    }

    fractions.sort((left, right) => right.fraction - left.fraction || left.index - right.index)
    const undistributed = remaining - allocatedWeighted
    for (let index = 0; index < undistributed; index += 1) {
      const fraction = fractions[index % fractions.length]!
      allocations[fraction.index] = allocations[fraction.index]! + 1
    }

    return allocations
  }

  private normalize(
    vertices: Float32Array,
    center: boolean,
    size: number,
    bounds: Box3,
  ): Float32Array {
    const offset = center ? bounds.getCenter(new Vector3()) : new Vector3()
    const dimensions = bounds.getSize(new Vector3())
    const longestSide = Math.max(dimensions.x, dimensions.y, dimensions.z)
    const scale = longestSide > 0 ? size / longestSide : 1
    const output = new Float32Array(vertices.length)

    for (let index = 0; index < vertices.length; index += 3) {
      output[index] = (vertices[index]! - offset.x) * scale
      output[index + 1] = (vertices[index + 1]! - offset.y) * scale
      output[index + 2] = (vertices[index + 2]! - offset.z) * scale
    }

    return output
  }

  private fraction(value: number): number {
    return value - Math.floor(value)
  }
}

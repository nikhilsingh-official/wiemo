import fs from 'node:fs'
import { Box3, BufferGeometry, Float32BufferAttribute, Mesh, Vector3 } from 'three'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { GltfParticleLoader } from '../app/three/assets/GltfParticleLoader.ts'
import { HERO_MODEL_FILENAMES } from '../app/hero/stages.ts'
import { GpuParticleMorph } from '../app/three/particles/GpuParticleMorph.ts'
import { installNodeGltfShims } from './lib/install-node-gltf-shims.mjs'

installNodeGltfShims()

function countUniquePositions(positions) {
  const uniquePositions = new Set()
  for (let index = 0; index < positions.length; index += 3) {
    uniquePositions.add([
      positions[index].toFixed(6),
      positions[index + 1].toFixed(6),
      positions[index + 2].toFixed(6),
    ].join(','))
  }
  return uniquePositions.size
}

function isSphereLike(mesh) {
  const dimensions = new Box3().setFromObject(mesh).getSize(new Vector3())
  const smallestSide = Math.min(dimensions.x, dimensions.y, dimensions.z)
  const largestSide = Math.max(dimensions.x, dimensions.y, dimensions.z)
  return smallestSide > 0 && largestSide / smallestSide < 1.01
}

const requestedParticles = 256
const requestedModelParticles = 72_000
const minimumUniqueModelPositions = requestedModelParticles - 1_000

const initialShape = {
  name: 'initial',
  positions: new Float32Array([0, 0, 0, 1, 1, 1]),
}
const replacementShape = {
  name: 'replacement',
  positions: new Float32Array([2, 2, 2, 3, 3, 3]),
  brightness: new Float32Array([0.5, 1.5]),
}
const immediateMorph = new GpuParticleMorph(initialShape, {
  pixelRatio: 1,
  pointSize: 1,
  color: '#ffffff',
  driftStrength: 0,
})
immediateMorph.setShapeImmediately(replacementShape)
const immediatePositions = immediateMorph.points.geometry.getAttribute('position').array
if (!replacementShape.positions.every((value, index) => immediatePositions[index] === value)) {
  throw new Error('Immediate shape activation must replace the visible position buffer.')
}
const immediateBrightness = immediateMorph.points.geometry.getAttribute('aBrightness').array
if (!replacementShape.brightness.every((value, index) => immediateBrightness[index] === value)) {
  throw new Error('Immediate shape activation must replace the visible brightness buffer.')
}
immediateMorph.dispose()

const geometry = new BufferGeometry()
geometry.setAttribute('position', new Float32BufferAttribute([
  0, 0, 0,
  1, 0, 0,
  0, 1, 0,
], 3))

const shape = new GltfParticleLoader().createShapeFromScene(
  new Mesh(geometry),
  requestedParticles,
  { center: false, size: 1 },
  'single-triangle-fixture',
)

const uniquePositions = countUniquePositions(shape.positions)
console.log(`unique particle positions: ${uniquePositions} / ${requestedParticles}`)
if (uniquePositions < requestedParticles * 0.9) {
  throw new Error('Low-poly geometry does not receive enough distinct surface samples.')
}

const mixedGeometry = new BufferGeometry()
mixedGeometry.setAttribute('position', new Float32BufferAttribute([
  // Large triangle.
  0, 0, 0,
  1, 0, 0,
  0, 1, 0,
  // Tiny disconnected triangle in the same mesh.
  10, 0, 0,
  10.01, 0, 0,
  10, 0.01, 0,
], 3))

const mixedShape = new GltfParticleLoader().createShapeFromScene(
  new Mesh(mixedGeometry),
  requestedParticles,
  { center: false, size: 10.01 },
  'mixed-area-fixture',
)
const tinyTriangleSamples = Array.from({ length: requestedParticles }, (_, index) => (
  mixedShape.positions[index * 3]
)).filter((x) => x > 9.9).length

console.log(`tiny triangle samples: ${tinyTriangleSamples}`)
if (tinyTriangleSamples < 1) {
  throw new Error('Small triangles must receive a minimum particle allocation.')
}

const modelLoader = new GLTFLoader()
for (const filename of HERO_MODEL_FILENAMES) {
  const bytes = fs.readFileSync(new URL(`../public/models/${filename}`, import.meta.url))
  const buffer = bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength)
  const gltf = await modelLoader.parseAsync(buffer, '')
  if (filename === 'EarthContinents.glb') {
    const ocean = gltf.scene.getObjectByName('earth-ocean')
    const land = gltf.scene.getObjectByName('earth-land')
    if (!(ocean instanceof Mesh) || !(land instanceof Mesh)) {
      throw new Error('The Earth stage must partition one smooth sphere into ocean and land meshes.')
    }
    const earthTriangleCount = [ocean, land].reduce((total, mesh) => (
      total + Math.floor((mesh.geometry.getIndex()?.count ?? mesh.geometry.getAttribute('position').count) / 3)
    ), 0)
    console.log(`Earth triangles: ${earthTriangleCount}`)
    if (earthTriangleCount < 30_000) {
      throw new Error('The Earth stage must use a high-detail sphere with at least 30,000 triangles.')
    }
    const earthLatitudes = new Set()
    for (const mesh of [ocean, land]) {
      const positions = mesh.geometry.getAttribute('position')
      for (let index = 0; index < positions.count; index += 1) {
        earthLatitudes.add(positions.getY(index).toFixed(6))
      }
    }
    const sortedLatitudes = [...earthLatitudes].map(Number).sort((left, right) => left - right)
    const latitudeSteps = sortedLatitudes.slice(1).map((latitude, index) => (
      latitude - sortedLatitudes[index]
    ))
    const latitudeStepRatio = Math.max(...latitudeSteps) / Math.min(...latitudeSteps)
    if (latitudeStepRatio > 1.01) {
      throw new Error('Earth latitude rings must use equal-area spacing to avoid polar hotspots.')
    }
    const oceanBrightness = ocean.userData.particleBrightness
    const landBrightness = land.userData.particleBrightness
    if (typeof oceanBrightness !== 'number' || typeof landBrightness !== 'number'
      || oceanBrightness < 0.6 || landBrightness > 1.25
      || landBrightness <= oceanBrightness || landBrightness / oceanBrightness > 2) {
      throw new Error('Earth land and ocean must use a modest shared-palette brightness contrast.')
    }
    if (land.userData.particleDensity < 1.4 || land.userData.particleDensity > 1.8) {
      throw new Error('Earth land must use controlled sampling density instead of overlapping shells.')
    }
  }
  if (filename === 'CmsCollision.glb') {
    const leftParticle = gltf.scene.getObjectByName('collision-particle-left')
    const rightParticle = gltf.scene.getObjectByName('collision-particle-right')
    if (!(leftParticle instanceof Mesh) || !(rightParticle instanceof Mesh)) {
      throw new Error('The collision stage must contain two particle sphere meshes.')
    }
    if (!isSphereLike(leftParticle) || !isSphereLike(rightParticle)) {
      throw new Error('The collision particle meshes must remain spherical.')
    }
    if (leftParticle.position.x >= 0 || rightParticle.position.x <= 0) {
      throw new Error('The collision particles must approach the centre from opposing sides.')
    }
  }
  if (filename === 'DNA.glb') {
    const ribbons = gltf.scene.getObjectByName('ribbons')
    const nucleotides = gltf.scene.getObjectByName('nucleotides')
    if (!(ribbons instanceof Mesh) || !(nucleotides instanceof Mesh)) {
      throw new Error('The DNA stage must retain the canonical ribbon and nucleotide meshes.')
    }
    const dnaTriangleCount = [ribbons, nucleotides].reduce((total, mesh) => (
      total + Math.floor((mesh.geometry.getIndex()?.count ?? mesh.geometry.getAttribute('position').count) / 3)
    ), 0)
    if (dnaTriangleCount < 10_000) {
      throw new Error('The DNA stage must use the high-detail canonical 1BNA model.')
    }
    const dnaDimensions = new Box3().setFromObject(gltf.scene).getSize(new Vector3())
    if (dnaDimensions.y <= dnaDimensions.x || dnaDimensions.y <= dnaDimensions.z) {
      throw new Error('The DNA helix axis must be presented vertically in the hero.')
    }
    if (ribbons.userData.particleDensity < 1.2) {
      throw new Error('The DNA stage must preserve enough particles for its ribbon silhouette.')
    }
  }
  if (filename === 'Human.glb') {
    const body = gltf.scene.getObjectByName('makehuman-body')
    if (!(body instanceof Mesh)) {
      throw new Error('The human stage must contain only the continuous MakeHuman body mesh.')
    }
    const humanTriangleCount = Math.floor((
      body.geometry.getIndex()?.count ?? body.geometry.getAttribute('position').count
    ) / 3)
    if (humanTriangleCount < 25_000) {
      throw new Error('The human stage must use the high-detail MakeHuman body surface.')
    }
    const humanMeshes = []
    gltf.scene.traverse((object) => {
      if (object instanceof Mesh) humanMeshes.push(object)
    })
    if (humanMeshes.length !== 1) {
      throw new Error('The human stage must exclude helper, joint, clothing, and internal meshes.')
    }
  }
  const modelShape = new GltfParticleLoader().createShapeFromScene(
    gltf.scene,
    requestedModelParticles,
    { center: true, size: 5 },
    filename,
  )
  const uniqueModelPositions = countUniquePositions(modelShape.positions)
  if (filename === 'EarthContinents.glb') {
    const brightness = modelShape.brightness
    if (!brightness || !brightness.some((value) => value < 1) || !brightness.some((value) => value > 1)) {
      throw new Error('The Earth stage must make continents brighter than oceans.')
    }
    const oceanParticles = brightness.filter((value) => value < 1).length
    console.log(`Earth ocean particles: ${oceanParticles} / ${brightness.length}`)
    if (oceanParticles < brightness.length * 0.45 || oceanParticles > brightness.length * 0.55) {
      throw new Error('The Earth stage must keep the ocean surface visibly populated.')
    }
  }
  console.log(`${filename}: ${uniqueModelPositions} unique / ${requestedModelParticles}`)
  if (uniqueModelPositions < minimumUniqueModelPositions) {
    throw new Error(`${filename} does not receive enough distinct surface samples.`)
  }
}

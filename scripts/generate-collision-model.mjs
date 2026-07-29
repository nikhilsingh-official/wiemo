import fs from 'node:fs'
import {
  BufferGeometry,
  Mesh,
  MeshBasicMaterial,
  Scene,
  SphereGeometry,
} from 'three'
import { GLTFExporter } from 'three/addons/exporters/GLTFExporter.js'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js'
import { installNodeGltfShims } from './lib/install-node-gltf-shims.mjs'

const sourceUrl = new URL('./assets/CmsEcalBarrel.glb', import.meta.url)
const outputUrl = new URL('../public/models/CmsCollision.glb', import.meta.url)

installNodeGltfShims()

function geometryInWorldSpace(mesh) {
  let geometry = mesh.geometry.clone()
  geometry.applyMatrix4(mesh.matrixWorld)
  if (geometry.index) geometry = geometry.toNonIndexed()

  for (const attributeName of Object.keys(geometry.attributes)) {
    if (attributeName !== 'position') geometry.deleteAttribute(attributeName)
  }
  geometry.clearGroups()
  return geometry
}

const sourceBytes = fs.readFileSync(sourceUrl)
const sourceBuffer = sourceBytes.buffer.slice(
  sourceBytes.byteOffset,
  sourceBytes.byteOffset + sourceBytes.byteLength,
)
const gltf = await new GLTFLoader().parseAsync(sourceBuffer, '')
gltf.scene.updateWorldMatrix(true, true)

const detectorParts = []
gltf.scene.traverse((object) => {
  if (object instanceof Mesh) detectorParts.push(geometryInWorldSpace(object))
})

const detectorGeometry = mergeGeometries(detectorParts, false)
if (!detectorGeometry) throw new Error('Unable to merge the CMS detector geometry.')

const scene = new Scene()
const material = new MeshBasicMaterial()
const detector = new Mesh(detectorGeometry, material)
detector.name = 'cms-ecal-barrel'
scene.add(detector)

const particleRadius = 0.3
const particleOffset = 0.38
const particleGeometry = new SphereGeometry(particleRadius, 48, 32)
const leftParticle = new Mesh(particleGeometry, material)
leftParticle.name = 'collision-particle-left'
leftParticle.position.x = -particleOffset

const rightParticle = new Mesh(particleGeometry, material)
rightParticle.name = 'collision-particle-right'
rightParticle.position.x = particleOffset
scene.add(leftParticle, rightParticle)

const exported = await new GLTFExporter().parseAsync(scene, {
  binary: true,
  onlyVisible: true,
})
fs.writeFileSync(outputUrl, Buffer.from(exported))
console.log(`Created ${outputUrl.pathname} from the sourced CMS detector plus two collision particles.`)

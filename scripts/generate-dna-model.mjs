import fs from 'node:fs'
import { Box3, Mesh, MeshBasicMaterial, Scene, Vector3 } from 'three'
import { GLTFExporter } from 'three/addons/exporters/GLTFExporter.js'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { installNodeGltfShims } from './lib/install-node-gltf-shims.mjs'

const sourceUrl = new URL('./assets/NIH-1BNA-ribbon.glb', import.meta.url)
const outputUrl = new URL('../public/models/DNA.glb', import.meta.url)

installNodeGltfShims()

const bytes = fs.readFileSync(sourceUrl)
const buffer = bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength)
const source = await new GLTFLoader().parseAsync(buffer, '')
source.scene.updateWorldMatrix(true, true)

const scene = new Scene()
const material = new MeshBasicMaterial()
for (const name of ['ribbons', 'nucleotides']) {
  const sourceMesh = source.scene.getObjectByName(name)
  if (!(sourceMesh instanceof Mesh)) throw new Error(`The NIH DNA source is missing ${name}.`)
  const geometry = sourceMesh.geometry.clone()
  geometry.applyMatrix4(sourceMesh.matrixWorld)
  geometry.rotateX(-Math.PI / 2)
  for (const attributeName of Object.keys(geometry.attributes)) {
    if (attributeName !== 'position') geometry.deleteAttribute(attributeName)
  }
  geometry.clearGroups()
  const mesh = new Mesh(geometry, material)
  mesh.name = name
  if (name === 'ribbons') mesh.userData.particleDensity = 1.3
  scene.add(mesh)
}

const dimensions = new Box3().setFromObject(scene).getSize(new Vector3())
if (dimensions.y <= dimensions.x || dimensions.y <= dimensions.z) {
  throw new Error('The derived DNA must present its helix axis vertically.')
}

const exported = await new GLTFExporter().parseAsync(scene, {
  binary: true,
  onlyVisible: true,
})
fs.writeFileSync(outputUrl, Buffer.from(exported))
console.log(`Created ${outputUrl.pathname} with a vertical 1BNA helix axis.`)

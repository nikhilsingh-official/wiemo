import fs from 'node:fs'
import { Mesh, MeshBasicMaterial, Scene } from 'three'
import { GLTFExporter } from 'three/addons/exporters/GLTFExporter.js'
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js'
import { installNodeGltfShims } from './lib/install-node-gltf-shims.mjs'

const sourceUrl = new URL('./assets/MakeHumanBase.obj', import.meta.url)
const outputUrl = new URL('../public/models/Human.glb', import.meta.url)

installNodeGltfShims()

const source = new OBJLoader().parse(fs.readFileSync(sourceUrl, 'utf8'))
const sourceBody = source.getObjectByName('body')
if (!(sourceBody instanceof Mesh)) {
  throw new Error('The MakeHuman source must contain a body mesh.')
}

const geometry = sourceBody.geometry.clone()
for (const attributeName of Object.keys(geometry.attributes)) {
  if (attributeName !== 'position') geometry.deleteAttribute(attributeName)
}
geometry.clearGroups()

const body = new Mesh(geometry, new MeshBasicMaterial())
body.name = 'makehuman-body'
const scene = new Scene()
scene.add(body)

const exported = await new GLTFExporter().parseAsync(scene, {
  binary: true,
  onlyVisible: true,
})
fs.writeFileSync(outputUrl, Buffer.from(exported))
console.log(`Created ${outputUrl.pathname} from the MakeHuman body group only.`)

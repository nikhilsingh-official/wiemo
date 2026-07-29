import fs from 'node:fs'
import {
  BufferGeometry,
  Float32BufferAttribute,
  Mesh,
  MeshBasicMaterial,
  Scene,
  Vector3,
} from 'three'
import { GLTFExporter } from 'three/addons/exporters/GLTFExporter.js'
import { installNodeGltfShims } from './lib/install-node-gltf-shims.mjs'

const landDataUrl = new URL('./assets/ne_10m_land.geojson', import.meta.url)
const outputUrl = new URL('../public/models/EarthContinents.glb', import.meta.url)
const longitudeSegments = 192
const latitudeSegments = 96
const latitudeBinCount = latitudeSegments * 2
const presentationCenterLongitude = 20
const oceanParticleBrightness = 0.62
const landParticleBrightness = 1.18

installNodeGltfShims()

function normalizeLongitude(longitude) {
  return ((longitude + 180) % 360 + 360) % 360 - 180
}

function latitudeBin(latitude) {
  return Math.max(
    0,
    Math.min(latitudeBinCount - 1, Math.floor((latitude + 90) / 180 * latitudeBinCount)),
  )
}

function createLandEdgeIndex(geoJson) {
  const bins = Array.from({ length: latitudeBinCount }, () => [])
  for (const feature of geoJson.features) {
    const coordinates = feature.geometry.type === 'Polygon'
      ? [feature.geometry.coordinates]
      : feature.geometry.coordinates
    for (const rings of coordinates) {
      for (const ring of rings) {
        for (let current = 0, previous = ring.length - 1; current < ring.length; previous = current++) {
          const [currentLongitude, currentLatitude] = ring[current]
          const [previousLongitude, previousLatitude] = ring[previous]
          if (currentLatitude === previousLatitude) continue
          const edge = {
            currentLongitude,
            currentLatitude,
            previousLongitude,
            previousLatitude,
          }
          const minimumBin = latitudeBin(Math.min(currentLatitude, previousLatitude))
          const maximumBin = latitudeBin(Math.max(currentLatitude, previousLatitude))
          for (let bin = minimumBin; bin <= maximumBin; bin += 1) bins[bin].push(edge)
        }
      }
    }
  }
  return bins
}

const landGeoJson = JSON.parse(fs.readFileSync(landDataUrl, 'utf8'))
const landEdgeIndex = createLandEdgeIndex(landGeoJson)
const intersectionCache = new Map()

function isLand(longitude, latitude) {
  const cacheKey = latitude.toFixed(6)
  let intersections = intersectionCache.get(cacheKey)
  if (!intersections) {
    intersections = []
    for (const edge of landEdgeIndex[latitudeBin(latitude)]) {
      const crossesLatitude = (edge.currentLatitude > latitude)
        !== (edge.previousLatitude > latitude)
      if (!crossesLatitude) continue
      const intersection = (edge.previousLongitude - edge.currentLongitude)
        * (latitude - edge.currentLatitude)
        / (edge.previousLatitude - edge.currentLatitude)
        + edge.currentLongitude
      intersections.push(intersection)
    }
    intersections.sort((left, right) => left - right)
    intersectionCache.set(cacheKey, intersections)
  }

  let low = 0
  let high = intersections.length
  while (low < high) {
    const middle = (low + high) >>> 1
    if (intersections[middle] <= longitude) low = middle + 1
    else high = middle
  }
  return low % 2 === 1
}

function spherePoint(latitude, longitude) {
  const latitudeRadians = latitude * Math.PI / 180
  const longitudeRadians = (longitude - presentationCenterLongitude) * Math.PI / 180
  const latitudeRadius = Math.cos(latitudeRadians)
  return new Vector3(
    latitudeRadius * Math.sin(longitudeRadians),
    Math.sin(latitudeRadians),
    latitudeRadius * Math.cos(longitudeRadians),
  )
}

function triangleLocation(points) {
  const center = points.reduce((sum, point) => sum.add(point), new Vector3()).normalize()
  return {
    latitude: Math.asin(center.y) * 180 / Math.PI,
    longitude: normalizeLongitude(
      Math.atan2(center.x, center.z) * 180 / Math.PI + presentationCenterLongitude,
    ),
  }
}

function addTriangle(targets, a, b, c) {
  const points = [a, b, c]
  const { longitude, latitude } = triangleLocation(points)
  const target = isLand(longitude, latitude) ? targets.land : targets.ocean
  for (const point of points) target.push(point.x, point.y, point.z)
}

function createSphereSurfaces() {
  const targets = { ocean: [], land: [] }
  for (let latitudeIndex = 0; latitudeIndex < latitudeSegments; latitudeIndex += 1) {
    // Even Y spacing makes every band cover the same spherical area. This keeps
    // the sampler's per-triangle floor from concentrating particles at the poles.
    const lowerLatitude = Math.asin(-1 + latitudeIndex * 2 / latitudeSegments) * 180 / Math.PI
    const upperLatitude = Math.asin(-1 + (latitudeIndex + 1) * 2 / latitudeSegments) * 180 / Math.PI
    for (let longitudeIndex = 0; longitudeIndex < longitudeSegments; longitudeIndex += 1) {
      const leftLongitude = -180 + longitudeIndex * 360 / longitudeSegments
      const rightLongitude = -180 + (longitudeIndex + 1) * 360 / longitudeSegments
      const lowerLeft = spherePoint(lowerLatitude, leftLongitude)
      const lowerRight = spherePoint(lowerLatitude, rightLongitude)
      const upperLeft = spherePoint(upperLatitude, leftLongitude)
      const upperRight = spherePoint(upperLatitude, rightLongitude)

      if (latitudeIndex === 0) {
        addTriangle(targets, lowerLeft, upperRight, upperLeft)
      } else if (latitudeIndex === latitudeSegments - 1) {
        addTriangle(targets, lowerLeft, lowerRight, upperLeft)
      } else {
        addTriangle(targets, lowerLeft, lowerRight, upperRight)
        addTriangle(targets, lowerLeft, upperRight, upperLeft)
      }
    }
  }
  return targets
}

function createSurfaceMesh(name, positions, brightness, material, density = 1) {
  const geometry = new BufferGeometry()
  geometry.setAttribute('position', new Float32BufferAttribute(positions, 3))
  const mesh = new Mesh(geometry, material)
  mesh.name = name
  mesh.userData.particleBrightness = brightness
  mesh.userData.particleDensity = density
  return mesh
}

const surfaces = createSphereSurfaces()
const scene = new Scene()
const material = new MeshBasicMaterial()
scene.add(createSurfaceMesh('earth-ocean', surfaces.ocean, oceanParticleBrightness, material))
scene.add(createSurfaceMesh('earth-land', surfaces.land, landParticleBrightness, material, 1.6))

const exported = await new GLTFExporter().parseAsync(scene, {
  binary: true,
  onlyVisible: true,
})
fs.writeFileSync(outputUrl, Buffer.from(exported))
console.log(
  `Created ${outputUrl.pathname} with ${(surfaces.ocean.length + surfaces.land.length) / 9} triangles `
  + `(${surfaces.land.length / 9} land, ${surfaces.ocean.length / 9} ocean).`,
)

import fs from 'node:fs'
import { HERO_MODEL_FILENAMES } from '../app/three/heroModels.ts'
import { createSpiralGalaxyShape } from '../app/three/particles/createShapes.ts'
import {
  HERO_OPENING_STAGE_NAME,
  HERO_STAGE_PRESENTATION,
} from '../app/hero/stagePresentation.ts'

const particleCount = 72_000
const openingShape = createSpiralGalaxyShape(particleCount)
const heroSource = fs.readFileSync(new URL('../app/components/Hero.vue', import.meta.url), 'utf8')
const heroHeaderSource = fs.readFileSync(new URL('../app/components/HeroHeader.vue', import.meta.url), 'utf8')

if (openingShape.name !== 'spiral-galaxy') {
  throw new Error(`Expected the procedural spiral galaxy to open the hero, received ${openingShape.name}.`)
}

if (openingShape.positions.length !== particleCount * 3) {
  throw new Error('The procedural opening shape must fill the complete particle budget.')
}

if (HERO_MODEL_FILENAMES.includes('SolarSystem.glb') || HERO_MODEL_FILENAMES.includes('SpiralGalaxy.glb')) {
  throw new Error('Mesh-based Solar System and spiral galaxy models must remain outside the active sequence.')
}

for (const filename of HERO_MODEL_FILENAMES) {
  const modelUrl = new URL(`../public/models/${filename}`, import.meta.url)
  if (!fs.existsSync(modelUrl)) throw new Error(`Hero model is missing: ${filename}`)
}

if (!heroSource.includes('@morph-progress="trackMorph"')
  || !heroSource.includes('readout--bottom-right')
  || !heroSource.includes('hero__morph-progress')) {
  throw new Error('The hero must show the bottom-right model transition progress readout.')
}

for (const stageName of [HERO_OPENING_STAGE_NAME, ...HERO_MODEL_FILENAMES]) {
  const presentation = HERO_STAGE_PRESENTATION[stageName]
  if (!presentation.label || !presentation.headline) {
    throw new Error(`The hero is missing presentation text for ${stageName}.`)
  }
}

if (!heroSource.includes(':text="headlineText"')
  || !heroHeaderSource.includes('watch(() => props.text')
  || !heroHeaderSource.includes('hero-header__cursor')
  || !heroHeaderSource.includes('aria-live="polite"')
  || !heroHeaderSource.includes('prefers-reduced-motion: reduce')
  || (heroHeaderSource.match(/<h1\b/g) ?? []).length !== 1) {
  throw new Error('The hero headline must type stage-synchronized text with a blinking cursor.')
}

console.log(`opening hero shape: ${openingShape.name}`)

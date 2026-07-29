import fs from 'node:fs'
import {
  getHeroStage,
  getInitialHeroStageTransition,
  HERO_MODEL_FILENAMES,
  HERO_MODEL_URLS,
  HERO_STAGES,
} from '../app/hero/stages.ts'

const [firstStage, secondStage] = HERO_STAGES
const heroSource = fs.readFileSync(new URL('../app/components/Hero.vue', import.meta.url), 'utf8')
const heroHeaderSource = fs.readFileSync(new URL('../app/components/HeroHeader.vue', import.meta.url), 'utf8')

if (!firstStage || !secondStage) {
  throw new Error('The hero stage directory must contain at least two stages.')
}

const initialTransition = getInitialHeroStageTransition()
if (initialTransition.from !== firstStage || initialTransition.to !== secondStage) {
  throw new Error('The initial hero flow must follow the stage directory order.')
}

for (const [index, stage] of HERO_STAGES.entries()) {
  if (!stage.filename || !stage.label || !stage.headline) {
    throw new Error(`Hero stage ${index} must define a filename, label, and headline.`)
  }
  if (HERO_MODEL_URLS[index] !== `/models/${stage.filename}`) {
    throw new Error(`Hero model URL ${index} must be derived from its stage filename.`)
  }
  if (HERO_MODEL_FILENAMES[index] !== stage.filename) {
    throw new Error(`Hero model filename ${index} must follow the stage directory order.`)
  }
  if (getHeroStage(stage.filename) !== stage) {
    throw new Error(`Hero stage lookup must return the directory entry for ${stage.filename}.`)
  }

  const modelUrl = new URL(`../public/models/${stage.filename}`, import.meta.url)
  if (!fs.existsSync(modelUrl)) throw new Error(`Hero model is missing: ${stage.filename}`)
}

if (new Set(HERO_MODEL_FILENAMES).size !== HERO_MODEL_FILENAMES.length) {
  throw new Error('Every hero stage filename must be unique.')
}

if (!heroSource.includes('@morph-progress="trackMorph"')
  || !heroSource.includes('readout--bottom-right')
  || !heroSource.includes('hero__morph-progress')) {
  throw new Error('The hero must show the bottom-right model transition progress readout.')
}

if (!heroSource.includes(':text="headlineText"')
  || !heroHeaderSource.includes('watch(() => props.text')
  || !heroHeaderSource.includes('hero-header__cursor')
  || !heroHeaderSource.includes('aria-live="polite"')
  || !heroHeaderSource.includes('prefers-reduced-motion: reduce')
  || (heroHeaderSource.match(/<h1\b/g) ?? []).length !== 1) {
  throw new Error('The hero headline must type stage-synchronized text with a blinking cursor.')
}

console.log(`opening hero stage: ${firstStage.filename}`)

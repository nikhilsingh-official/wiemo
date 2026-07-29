<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { defineParticleOptions } from '../three/particleOptions'
import { HERO_MODEL_URLS } from '../three/heroModels'
import { createSpiralGalaxyShape } from '../three/particles/createShapes'
import HeroHeader from './HeroHeader.vue'
import { defineTextOptions } from '../text-typing/textOptions'
import {
  getHeroStagePresentation,
  HERO_OPENING_STAGE_NAME,
} from '../hero/stagePresentation'
import type { MorphEvent } from '../three/types'

// Change animation, renderer, camera, model, and visual values here.
// This same object is available to every other element in the hero.

const MORPH_DURATION = 1.8
const HOLD_DURATION = 1.1
const PARTICLE_COUNT = 72_000
const openingShape = createSpiralGalaxyShape(PARTICLE_COUNT)

const particleOptions = reactive(defineParticleOptions({
  // A visual journey from the world around us to the structures inside life.
  modelUrls: [...HERO_MODEL_URLS],
  morphDuration: MORPH_DURATION,
  holdDuration: HOLD_DURATION,
  particleCount: PARTICLE_COUNT,
  pointSize: 2.8,
  particleColor: '#0B80C3',
  backgroundColor: '#000000',
  rotationSpeed: 0.025,
}))

const textOptions = defineTextOptions()

const headlineStage = ref(HERO_OPENING_STAGE_NAME)
const morph = ref<MorphEvent>({
  from: 'spiral-galaxy',
  to: 'EarthContinents.glb',
  progress: 0,
  easedProgress: 0,
  elapsed: 0,
  duration: MORPH_DURATION,
})
const headlineText = computed(() => (
  getHeroStagePresentation(headlineStage.value).headline
))
const morphFrom = computed(() => getHeroStagePresentation(morph.value.from).label)
const morphTo = computed(() => getHeroStagePresentation(morph.value.to).label)
const morphPercent = computed(() => Math.round(morph.value.progress * 100))
const morphProgressStyle = computed(() => ({
  transform: `scaleX(${morph.value.easedProgress})`,
}))

function trackMorph(event: MorphEvent) {
  morph.value = event
  headlineStage.value = event.to
}

</script>

<template>
  <section class="hero" aria-label="Particle forms morphing from galaxies to a collision">
    <HeroHeader
      class="hero__header"
      :text="headlineText"
      :textoptions="textOptions"
    />
    <ParticleCanvas
      class="hero__canvas"
      :options="particleOptions"
      :opening-shape="openingShape"
      @morph-progress="trackMorph"
    />
    <div
      class="readout readout--bottom-right hero__morph-readout"
      aria-label="Particle model transition progress"
    >
      <span class="readout__row">
        <span class="hero__morph-key">From</span>
        {{ morphFrom }}
      </span>
      <span class="readout__row readout__highlight">
        <span class="hero__morph-key">To</span>
        {{ morphTo }}
      </span>
      <span class="hero__morph-progress" aria-hidden="true">
        <span class="hero__morph-progress-bar" :style="morphProgressStyle" />
      </span>
      <span class="readout__row hero__morph-percent">{{ morphPercent }}%</span>
    </div>
  </section>
</template>

<style scoped lang="scss">
.hero {
  position: relative;
  width: 100%;
  height: 100svh;
  min-height: 460px;
  overflow: hidden;
  background: var(--void);
  border-bottom: 1px solid var(--line);
}

.hero__canvas {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}

.hero__header {
  position: absolute;
  left: 15%;
  top: 50%;
  transform: translateY(-50%);
  z-index: 1;
}

.hero__morph-readout {
  width: clamp(150px, 14vw, 210px);
}

.hero__morph-key {
  display: inline-block;
  width: 4.8em;
  color: var(--faint);
}

.hero__morph-progress {
  display: block;
  height: 1px;
  margin-top: 9px;
  overflow: hidden;
  background: var(--deepest);
}

.hero__morph-progress-bar {
  display: block;
  width: 100%;
  height: 100%;
  background: var(--beam);
  box-shadow: 0 0 8px color-mix(in srgb, var(--beam) 70%, transparent);
  transform-origin: left center;
  transition: transform 80ms linear;
}

.hero__morph-percent {
  margin-top: 4px;
  color: var(--faint);
}
</style>

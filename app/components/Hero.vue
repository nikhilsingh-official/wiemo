<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { defineParticleOptions } from '~/hero/three/particleOptions'
import { defineTextOptions } from '~/hero/text-typing/textOptions'
import { HERO_STAGE, type HeroStage } from '~/hero/stages'
import type { MorphEvent } from '~/hero/three/types'

const MORPH_DURATION = 1.8
const HOLD_DURATION = 1.1
const PARTICLE_COUNT = 72_000
const FALLBACK_HERO_STAGE = HERO_STAGE.collision

const route = useRoute()
const isHomePage = computed(() => route.path === '/')
const activeHeroStages = computed<readonly HeroStage[]>(() => {
  const stages = route.meta.heroStages
  return stages?.length ? stages : [FALLBACK_HERO_STAGE]
})

const particleOptions = computed(() => defineParticleOptions({
  modelUrls: activeHeroStages.value.map(
    stage => `/models/${stage.modelFilename}`,
  ),
  modelNames: activeHeroStages.value.map(getParticleStageName),
  autoPlay: activeHeroStages.value.length > 1,
  morphDuration: MORPH_DURATION,
  holdDuration: HOLD_DURATION,
  particleCount: PARTICLE_COUNT,
  pointSize: 2.8,
  particleColor: '#0B80C3',
  backgroundColor: '#000000',
  backgroundAlpha: 0,
  renderer: { alpha: true },
  rotationSpeed: 0.025,
}))

const textOptions = defineTextOptions()

const headlineStage = ref<HeroStage>(getFirstActiveStage())
const morph = ref<MorphEvent>(createSettledMorph(headlineStage.value))
const headlineText = computed(() => headlineStage.value.headline)
const morphFrom = computed(() => getEventStage(morph.value.from).label)
const morphTo = computed(() => getEventStage(morph.value.to).label)
const morphPercent = computed(() => Math.round(morph.value.progress * 100))
const morphProgressStyle = computed(() => ({
  transform: `scaleX(${morph.value.easedProgress})`,
}))
function getParticleStageName(stage: HeroStage): string {
  return stage.modelFilename
}

function getFirstActiveStage(): HeroStage {
  const firstStage = activeHeroStages.value[0]
  if (!firstStage) {
    throw new Error('The hero requires at least one stage.')
  }
  return firstStage
}

function createSettledMorph(stage: HeroStage): MorphEvent {
  const stageName = getParticleStageName(stage)
  return {
    from: stageName,
    to: stageName,
    progress: 1,
    easedProgress: 1,
    elapsed: 0,
    duration: MORPH_DURATION,
  }
}

function getEventStage(stageName: string): HeroStage {
  return activeHeroStages.value.find(
    (stage) => getParticleStageName(stage) === stageName,
  ) ?? headlineStage.value
}

function trackMorph(event: MorphEvent) {
  morph.value = event
  headlineStage.value = getEventStage(event.to)
}

watch(
  activeHeroStages,
  () => {
    const firstStage = getFirstActiveStage()
    headlineStage.value = firstStage
    morph.value = createSettledMorph(firstStage)
  },
  { flush: 'sync' },
)

</script>

<template>
  <section class="hero" aria-label="WIEMO introduction">
    <HeroText
      class="hero__text"
      :headline-text="headlineText"
      :show-brand="isHomePage"
      :text-options="textOptions"
    />
    <ParticleCanvas
      class="hero__canvas"
      aria-hidden="true"
      :options="particleOptions"
      @morph-progress="trackMorph"
    />
    <HeroImpactMetrics />
    <HeroMorphIndicator
      class="hero__morph-readout"
      aria-hidden="true"
      :morph-from="morphFrom"
      :morph-to="morphTo"
      :morph-percent="morphPercent"
      :morph-progress-style="morphProgressStyle"
    />
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

  &::before {
    position: absolute;
    inset: 0;
    z-index: 1;
    background:
      linear-gradient(
        90deg,
        rgb(var(--hero-overlay-rgb) / 78%) 0%,
        rgb(var(--hero-overlay-rgb) / 58%) 28%,
        rgb(var(--hero-overlay-rgb) / 18%) 58%,
        transparent 82%
      );
    content: '';
    pointer-events: none;
  }
}

.hero__canvas {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}

.hero__text {
  position: absolute;
  left: 15%;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  flex-direction: column;
  gap: 10px;
  z-index: 2;
}

.hero__morph-readout {
  width: 210px;
}

@media (max-width: 1500px) {
  .hero__morph-readout {
    width: 14vw;
  }
}

@media (max-width: 1070px) {
  .hero__morph-readout {
    width: 150px;
  }
}

@media (max-width: $breakpoint-small) {
  .hero::before {
    background:
      linear-gradient(
        180deg,
        rgb(var(--hero-overlay-rgb) / 22%) 0%,
        rgb(var(--hero-overlay-rgb) / 82%) 22%,
        rgb(var(--hero-overlay-rgb) / 74%) 68%,
        rgb(var(--hero-overlay-rgb) / 12%) 100%
      );
  }

  .hero__text {
    right: var(--gutter);
    left: var(--gutter);
  }
}
</style>

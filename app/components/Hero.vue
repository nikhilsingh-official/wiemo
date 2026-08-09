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
const activeHeroStages = computed<readonly HeroStage[]>(() => {
  const stages = route.meta.heroStages
  return stages?.length ? stages : [FALLBACK_HERO_STAGE]
})

const particleOptions = computed(() => defineParticleOptions({
  modelUrls: activeHeroStages.value.map(
    (stage) => `/models/${stage.modelFilename}`,
  ),
  modelNames: activeHeroStages.value.map(getParticleStageName),
  autoPlay: activeHeroStages.value.length > 1,
  morphDuration: MORPH_DURATION,
  holdDuration: HOLD_DURATION,
  particleCount: PARTICLE_COUNT,
  pointSize: 2.8,
  particleColor: '#0B80C3',
  backgroundColor: '#000000',
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
const heroAriaLabel = computed(() => {
  const firstStage = activeHeroStages.value[0]
  const lastStage = activeHeroStages.value.at(-1) ?? firstStage
  if (!firstStage || !lastStage) return 'Particle model animation'
  if (firstStage === lastStage) return `Particle form: ${firstStage.label}`
  return `Particle forms cycling from ${firstStage.label} to ${lastStage.label}`
})

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
  <section class="hero" :aria-label="heroAriaLabel">
    <HeroText
      class="hero__text"
      :headline-text="headlineText"
      :text-options="textOptions"
    />
    <ParticleCanvas
      class="hero__canvas"
      :options="particleOptions"
      @morph-progress="trackMorph"
    />
    <HeroImpactMetrics />
    <HeroMorphIndicator
      class="hero__morph-readout"
      aria-label="Particle model transition progress"
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
        rgb(0 0 0 / 78%) 0%,
        rgb(0 0 0 / 58%) 28%,
        rgb(0 0 0 / 18%) 58%,
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
        rgb(0 0 0 / 22%) 0%,
        rgb(0 0 0 / 82%) 22%,
        rgb(0 0 0 / 74%) 68%,
        rgb(0 0 0 / 12%) 100%
      );
  }

  .hero__text {
    right: var(--gutter);
    left: var(--gutter);
  }
}
</style>

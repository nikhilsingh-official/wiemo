<script lang="ts" setup>
import { onBeforeUnmount, ref, watch } from 'vue'
import type { ParticleExperience } from '~/hero/three/ParticleExperience'
import { defineParticleOptions } from '~/hero/three/particleOptions'
import type { MorphEvent, ParticleOptions, ParticleOptionsInput, ParticleShape } from '~/hero/three/types'

const props = withDefaults(
  defineProps<{
    options?: ParticleOptionsInput
  }>(),
  {
    options: () => ({}),
  },
)

const emit = defineEmits<{
  'morph-start': [event: MorphEvent]
  'morph-progress': [event: MorphEvent]
  'morph-complete': [event: MorphEvent]
}>()

const canvas = ref<HTMLCanvasElement | null>(null)
let experience: ParticleExperience | undefined
let activeOptions: ParticleOptions = defineParticleOptions(props.options)
let creationId = 0
let modelLoadId = 0

type ParticleExperienceModule = typeof import('~/hero/three/ParticleExperience')
let experienceModule: Promise<ParticleExperienceModule> | undefined

/**
 * Three.js is ~677 kB, and nothing on the page needs it before hydration.
 * Importing it on demand keeps it out of the entry chunk so the rest of the
 * site becomes interactive while the hero is still being set up.
 */
function loadExperienceModule(): Promise<ParticleExperienceModule> {
  experienceModule ??= import('~/hero/three/ParticleExperience')
  return experienceModule
}

/** Defers work until the browser has finished what first paint depends on. */
function whenIdle(run: () => void): void {
  if (typeof requestIdleCallback === 'function') requestIdleCallback(run, { timeout: 2500 })
  else setTimeout(run, 300)
}

function isCurrentModelLoad(
  targetExperience: ParticleExperience,
  currentCreationId: number,
  currentModelLoadId: number,
): boolean {
  return currentCreationId === creationId
    && currentModelLoadId === modelLoadId
    && targetExperience === experience
}

async function loadModels(options: ParticleOptions) {
  const targetExperience = experience
  if (!targetExperience || options.modelUrls.length === 0) return
  const currentCreationId = creationId
  const currentModelLoadId = ++modelLoadId

  try {
    const modelShapes = await targetExperience.loadGltfShapes(
      options.modelUrls,
      options.model,
      options.modelNames,
    )
    if (!isCurrentModelLoad(targetExperience, currentCreationId, currentModelLoadId)) return
    targetExperience.transitionToShapeSequence(modelShapes)
    targetExperience.start()
  } catch (error) {
    if (!isCurrentModelLoad(targetExperience, currentCreationId, currentModelLoadId)) return
    // Keep the currently active sequence if replacement assets cannot be loaded.
    console.error('Unable to create particle shapes from the supplied GLTFs.', error)
  }
}

async function loadRemainingInitialModels(
  targetExperience: ParticleExperience,
  firstShape: ParticleShape,
  urls: string[],
  names: string[],
  options: ParticleOptions,
  currentCreationId: number,
  currentModelLoadId: number,
): Promise<void> {
  try {
    const remainingShapes = await targetExperience.loadGltfShapes(urls, options.model, names)
    if (!isCurrentModelLoad(targetExperience, currentCreationId, currentModelLoadId)) return
    targetExperience.initializeShapeSequence([firstShape, ...remainingShapes])
  } catch (error) {
    if (!isCurrentModelLoad(targetExperience, currentCreationId, currentModelLoadId)) return
    // Keep the successfully loaded opening shape active if a later stage fails.
    console.error('Unable to load the remaining particle shapes.', error)
  }
}

async function createExperience(options: ParticleOptions): Promise<void> {
  if (!canvas.value) return
  const currentCreationId = ++creationId
  modelLoadId += 1
  const initialModelLoadId = modelLoadId

  const { ParticleExperience } = await loadExperienceModule()
  // A newer creation may have started while three.js was in flight; that one
  // owns the canvas and is responsible for disposing whatever came before.
  if (currentCreationId !== creationId || !canvas.value) return
  experience?.dispose()

  const nextExperience = new ParticleExperience(canvas.value, options, {
    onMorphStart: (event) => emit('morph-start', event),
    onMorphProgress: (event) => emit('morph-progress', event),
    onMorphComplete: (event) => emit('morph-complete', event),
  })
  experience = nextExperience

  if (options.modelUrls.length === 0) {
    nextExperience.start()
    return
  }

  try {
    const firstShape = await nextExperience.loadGltfShape(
      options.modelUrls[0]!,
      options.model,
      options.modelNames[0],
    )
    if (!isCurrentModelLoad(nextExperience, currentCreationId, initialModelLoadId)) return

    nextExperience.initializeShapeSequence([firstShape])
    nextExperience.start()

    const remainingUrls = options.modelUrls.slice(1)
    const remainingNames = options.modelNames.slice(1)
    if (remainingUrls.length > 0) {
      // Claimed now so any later load supersedes this one even while it waits.
      const currentModelLoadId = ++modelLoadId
      // The opening shape is already on screen, and the later stages are several
      // MB. Holding them until the browser is idle keeps them from competing
      // with the fonts, CSS and images that first paint actually needs.
      whenIdle(() => {
        void loadRemainingInitialModels(
          nextExperience,
          firstShape,
          remainingUrls,
          remainingNames,
          options,
          currentCreationId,
          currentModelLoadId,
        )
      })
    }
  } catch (error) {
    if (!isCurrentModelLoad(nextExperience, currentCreationId, initialModelLoadId)) return
    // A model-backed canvas stays empty if its required first model cannot load.
    console.error('Unable to load the initial particle shape.', error)
  }
}

watch(
  canvas,
  (element) => {
    if (element) void createExperience(activeOptions)
  },
  { flush: 'post' },
)

watch(
  () => props.options,
  (options) => {
    const nextOptions = defineParticleOptions(options)
    const requiresRebuild = nextOptions.particleCount !== activeOptions.particleCount
      || nextOptions.renderer.alpha !== activeOptions.renderer.alpha
      || nextOptions.renderer.antialias !== activeOptions.renderer.antialias
      || nextOptions.renderer.powerPreference !== activeOptions.renderer.powerPreference
    const modelsChanged = JSON.stringify(nextOptions.modelUrls) !== JSON.stringify(activeOptions.modelUrls)
      || JSON.stringify(nextOptions.modelNames) !== JSON.stringify(activeOptions.modelNames)
      || JSON.stringify(nextOptions.model) !== JSON.stringify(activeOptions.model)

    activeOptions = nextOptions
    if (requiresRebuild) {
      void createExperience(nextOptions)
      return
    }

    experience?.configure(nextOptions)
    if (modelsChanged) {
      if (nextOptions.modelUrls.length === 0) void createExperience(nextOptions)
      else void loadModels(nextOptions)
    }
  },
  { deep: true },
)

onBeforeUnmount(() => {
  creationId += 1
  modelLoadId += 1
  experience?.dispose()
  experience = undefined
})
</script>

<template>
  <canvas ref="canvas" aria-label="GPU particle morph animation" />
</template>

<style lang="scss" scoped>
canvas {
  display: block;
  width: 100%;
  height: 100%;
  touch-action: none;
}
</style>

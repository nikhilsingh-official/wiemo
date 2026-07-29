<script lang="ts" setup>
import { onBeforeUnmount, ref, watch } from 'vue'
import { ParticleExperience } from '../three/ParticleExperience'
import { defineParticleOptions } from '../three/particleOptions'
import type { MorphEvent, ParticleOptions, ParticleOptionsInput, ParticleShape } from '../three/types'

const props = withDefaults(
  defineProps<{
    options?: ParticleOptionsInput
    openingShape?: ParticleShape
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
    const modelShapes = await targetExperience.loadGltfShapes(options.modelUrls, options.model)
    if (!isCurrentModelLoad(targetExperience, currentCreationId, currentModelLoadId)) return
    const shapes = props.openingShape ? [props.openingShape, ...modelShapes] : modelShapes
    targetExperience.transitionToShapeSequence(shapes)
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
  options: ParticleOptions,
  currentCreationId: number,
  currentModelLoadId: number,
): Promise<void> {
  try {
    const remainingShapes = await targetExperience.loadGltfShapes(urls, options.model)
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
  experience?.dispose()

  const nextExperience = new ParticleExperience(canvas.value, options, {
    onMorphStart: (event) => emit('morph-start', event),
    onMorphProgress: (event) => emit('morph-progress', event),
    onMorphComplete: (event) => emit('morph-complete', event),
  })
  experience = nextExperience

  if (props.openingShape) {
    nextExperience.initializeShapeSequence([props.openingShape])
    nextExperience.start()

    if (options.modelUrls.length > 0) {
      const currentModelLoadId = ++modelLoadId
      void loadRemainingInitialModels(
        nextExperience,
        props.openingShape,
        options.modelUrls,
        options,
        currentCreationId,
        currentModelLoadId,
      )
    }
    return
  }

  if (options.modelUrls.length === 0) {
    nextExperience.start()
    return
  }

  try {
    const firstShape = await nextExperience.loadGltfShape(options.modelUrls[0]!, options.model)
    if (!isCurrentModelLoad(nextExperience, currentCreationId, initialModelLoadId)) return

    nextExperience.initializeShapeSequence([firstShape])
    nextExperience.start()

    const remainingUrls = options.modelUrls.slice(1)
    if (remainingUrls.length > 0) {
      const currentModelLoadId = ++modelLoadId
      void loadRemainingInitialModels(
        nextExperience,
        firstShape,
        remainingUrls,
        options,
        currentCreationId,
        currentModelLoadId,
      )
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

watch(
  () => props.openingShape,
  () => void createExperience(activeOptions),
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

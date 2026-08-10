<script setup lang="ts">
import type { GalleryFrame } from '~/content/gallery'
import { formatFrameId } from '~/content/gallery'

defineOptions({ name: 'GalleryFrame' })

defineProps<{ frame: GalleryFrame }>()

const emit = defineEmits<{
  open: [frameId: number]
}>()

const loaded = ref(false)
const imageElement = ref<HTMLImageElement | null>(null)

onMounted(() => {
  if (imageElement.value?.complete) loaded.value = true
})
</script>

<template>
  <figure
    class="gallery-frame"
    :class="{ 'gallery-frame--loaded': loaded }"
  >
    <button
      class="gallery-frame__button"
      type="button"
      :aria-label="`Open frame ${formatFrameId(frame.id)} from ${frame.sessionName}`"
      @click="emit('open', frame.id)"
    >
      <span class="gallery-frame__loading" aria-hidden="true" />
      <img
        ref="imageElement"
        class="gallery-frame__image"
        :src="frame.src"
        :alt="frame.alt"
        :width="frame.width"
        :height="frame.height"
        loading="lazy"
        decoding="async"
        @load="loaded = true"
      >
      <span class="gallery-frame__focus" aria-hidden="true">
        <span>View frame</span>
        <span>↗</span>
      </span>
    </button>
    <figcaption class="gallery-frame__caption">
      <span>{{ formatFrameId(frame.id) }}</span>
      <span aria-hidden="true">·</span>
      <time v-if="frame.dateTime" :datetime="frame.dateTime">{{ frame.dateLabel }}</time>
      <span v-else>{{ frame.dateLabel }}</span>
    </figcaption>
  </figure>
</template>

<style scoped lang="scss">
.gallery-frame {
  min-width: 0;
}

.gallery-frame__button {
  position: relative;
  display: block;
  width: 100%;
  aspect-ratio: 4 / 3;
  overflow: hidden;
  color: var(--ink);
  background: var(--panel);
  border: 1px solid var(--line);
  cursor: zoom-in;
  transition:
    border-color $transition-fast $transition-ease,
    box-shadow $transition-fast $transition-ease,
    transform $transition-fast $transition-ease;
}

.gallery-frame__image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0;
  filter: saturate(0.88) contrast(1.02);
  transition:
    opacity 420ms ease,
    filter $transition-fast $transition-ease,
    transform 500ms ease;
}

.gallery-frame--loaded .gallery-frame__image {
  opacity: 1;
}

.gallery-frame__loading {
  position: absolute;
  inset: 0;
  background:
    linear-gradient(90deg, transparent 49%, color-mix(in srgb, var(--beam) 12%, transparent) 50%, transparent 51%),
    linear-gradient(transparent 49%, color-mix(in srgb, var(--beam) 12%, transparent) 50%, transparent 51%),
    var(--panel);
  background-size: 25% 25%;
  animation: detector-load 1.4s steps(4, end) infinite;
}

.gallery-frame--loaded .gallery-frame__loading {
  display: none;
}

.gallery-frame__focus {
  position: absolute;
  right: 12px;
  bottom: 12px;
  left: 12px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 9px 11px;
  color: #fff;
  background: rgb(2 9 15 / 76%);
  border: 1px solid rgb(51 180 236 / 42%);
  font-family: $font-mono;
  font-size: 10px;
  letter-spacing: 1.4px;
  line-height: 1;
  text-transform: uppercase;
  opacity: 0;
  transform: translateY(5px);
  transition:
    opacity $transition-fast $transition-ease,
    transform $transition-fast $transition-ease;
}

.gallery-frame__caption {
  display: flex;
  gap: 7px;
  align-items: center;
  padding-top: 10px;
  color: var(--faint);
  font-family: $font-mono;
  font-size: 10px;
  letter-spacing: 1.1px;
  line-height: 1.35;
  text-transform: uppercase;
  transition: color $transition-fast $transition-ease;
}

.gallery-frame:hover .gallery-frame__button {
  border-color: var(--atlas);
  box-shadow: 0 0 0 1px color-mix(in srgb, var(--atlas) 24%, transparent);
}

.gallery-frame:hover .gallery-frame__image {
  filter: saturate(1) contrast(1.02);
  transform: scale(1.015);
}

.gallery-frame:hover .gallery-frame__focus,
.gallery-frame__button:focus-visible .gallery-frame__focus {
  opacity: 1;
  transform: translateY(0);
}

.gallery-frame:hover .gallery-frame__caption {
  color: var(--core);
}

@keyframes detector-load {
  0% { background-position: 0 0; }
  50% { background-position: 25% 25%; }
  100% { background-position: 50% 50%; }
}
</style>

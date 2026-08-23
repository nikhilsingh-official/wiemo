<script setup lang="ts">
import GalleryLightbox from '~/components/gallery/GalleryLightbox.vue'
import GallerySessionLog from '~/components/gallery/GallerySessionLog.vue'
import { GALLERY_FRAMES, GALLERY_SESSIONS } from '~/content/gallery'

const description = 'Explore photographs from WIEMO physics outreach visits with schools and student centres across Bengaluru.'

useSeoMeta({
  title: 'Gallery',
  description,
  ogTitle: 'WIEMO | Gallery',
  ogDescription: description,
  twitterTitle: 'WIEMO | Gallery',
  twitterDescription: description,
})

const activeFrameId = ref<number | null>(null)

const activeFrameIndex = computed(() => GALLERY_FRAMES.findIndex(frame => frame.id === activeFrameId.value))
const activeFrame = computed(() => activeFrameIndex.value >= 0 ? GALLERY_FRAMES[activeFrameIndex.value] ?? null : null)

const openFrame = (frameId: number) => {
  activeFrameId.value = frameId
}

const closeLightbox = () => {
  activeFrameId.value = null
}

const moveFrame = (direction: -1 | 1) => {
  if (!GALLERY_FRAMES.length) return
  const currentIndex = activeFrameIndex.value < 0 ? 0 : activeFrameIndex.value
  const nextIndex = (currentIndex + direction + GALLERY_FRAMES.length) % GALLERY_FRAMES.length
  activeFrameId.value = GALLERY_FRAMES[nextIndex]?.id ?? null
}

</script>

<template>
  <main id="gallery" class="gallery-page">
    <GallerySessionLog
      :sessions="GALLERY_SESSIONS"
      @open="openFrame"
    />

    <GalleryLightbox
      :frame="activeFrame"
      :current-index="activeFrameIndex"
      :total="GALLERY_FRAMES.length"
      @close="closeLightbox"
      @previous="moveFrame(-1)"
      @next="moveFrame(1)"
    />
  </main>
</template>

<style scoped lang="scss">
.gallery-page {
  min-height: 100vh;
}
</style>

<script setup lang="ts">
import { HERO_STAGE } from '~/hero/stages'

definePageMeta({
  heroStages: [HERO_STAGE.gallery],
})
</script>

<template>
  <main class="content-section">
    <div class="wrap gallery-page">
      <p class="eyebrow">Gallery</p>
      <h1>Workshop photos will be added after permissions are confirmed.</h1>
      <p class="lede">
        The source document says not to use the gallery drive yet, so this prototype keeps the gallery as a permission-pending placeholder.
      </p>
    </div>
  </main>
</template>

<style scoped lang="scss">
.gallery-page h1 {
  max-width: 13ch;
  margin-top: 8px;
  font-size: clamp(3rem, 8vw, 6.5rem);
  line-height: 0.9;
}
</style>

<script setup lang="ts">
import { HERO_STAGE } from '~/hero/stages'

definePageMeta({
  heroStages: [HERO_STAGE.gallery],
})
</script>

<template>
  <main class="content-section">
    <div class="wrap gallery-page">
      <h1>Workshop photos will be added after permissions are confirmed.</h1>
      <p class="lede">
        The source document says not to use the gallery drive yet, so this prototype keeps the gallery as a permission-pending placeholder.
      </p>
    </div>
  </main>
</template>

<style scoped lang="scss">
.gallery-page h1 {
  @include responsive-page-heading;

  max-width: 820px;
  margin-top: 8px;
  line-height: 0.9;
}
</style>

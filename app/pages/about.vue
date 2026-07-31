<script setup lang="ts">
import { HERO_STAGE } from '~/hero/stages'

definePageMeta({
  heroStages: [HERO_STAGE.about],
})
</script>

<template>
  <main class="content-section">
    <div class="wrap">
      <h1>About Us</h1>
    </div>
  </main>
</template>

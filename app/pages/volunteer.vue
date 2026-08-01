<script setup lang="ts">
import { SITE_CONTENT } from '~/content/siteContent'
import { HERO_STAGE } from '~/hero/stages'

definePageMeta({
  heroStages: [HERO_STAGE.volunteer],
})
</script>

<template>
  <main class="content-section">
    <div class="wrap volunteer-page">
      <p class="eyebrow">Volunteer</p>
      <h1>Help make physics feel reachable.</h1>
      <p class="lede">
        {{ SITE_CONTENT.initiativeName }} is student-led. This prototype page can later hold volunteer roles, session support needs and contact details.
      </p>
      <NuxtLink class="button button--ghost" to="/about">
        Learn about the mission
      </NuxtLink>
    </div>
  </main>
</template>

<style scoped lang="scss">
.volunteer-page {
  display: grid;
  max-width: 760px;
  gap: 20px;

  h1 {
    max-width: 10ch;
    margin-top: 8px;
    font-size: clamp(3rem, 8vw, 6.5rem);
    line-height: 0.9;
  }

  .button {
    width: fit-content;
  }
}
</style>

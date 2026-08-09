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
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  max-width: 760px;
  gap: 20px;

  h1 {
    @include responsive-page-heading;

    max-width: 640px;
    margin-top: 8px;
    line-height: 0.9;
  }

  .button {
    width: fit-content;
  }
}

</style>

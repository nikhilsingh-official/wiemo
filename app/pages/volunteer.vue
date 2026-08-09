<script setup lang="ts">
import { HERO_STAGE } from '~/hero/stages'

definePageMeta({
  heroStages: [HERO_STAGE.volunteer],
})
</script>

<template>
  <main class="content-section">
    <div class="wrap volunteer-page">
      <header class="volunteer-page__header">
        <p class="volunteer-page__eyebrow">Join the initiative</p>
        <h1>Love physics?</h1>
        <h2>Make an impact with WIEMO.</h2>
      </header>
      <VolunteerForm />
    </div>
  </main>
</template>

<style scoped lang="scss">
.volunteer-page {
  display: flex;
  flex-direction: column;
  gap: 44px;
  max-width: 1180px;

  h1 {
    @include responsive-page-heading;

    line-height: 0.9;
  }

  h2 {
    @include responsive-tertiary-heading;

    margin-top: 14px;
    color: var(--body-copy);
  }
}

.volunteer-page__header {
  max-width: 860px;
}

.volunteer-page__eyebrow {
  margin-bottom: 12px;
  color: var(--beam);
  font-family: $font-mono;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 2px;
  text-transform: uppercase;
}
</style>

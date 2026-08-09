<script setup lang="ts">
import { SITE_CONTENT } from '~/content/siteContent'
import { HERO_STAGE } from '~/hero/stages'

definePageMeta({
  heroStages: [HERO_STAGE.about],
})
</script>

<template>
  <main class="content-section">
    <div class="wrap about-page">
      <header>
        <p class="eyebrow">About us</p>
        <h1>{{ SITE_CONTENT.initiativeName }}</h1>
        <p class="lede">{{ SITE_CONTENT.shortDescription }}</p>
      </header>

      <section class="about-page__mission" aria-label="Mission">
        <p
          v-for="paragraph in SITE_CONTENT.mission"
          :key="paragraph"
        >
          {{ paragraph }}
        </p>
      </section>
    </div>
  </main>
</template>

<style scoped lang="scss">
.about-page {
  display: grid;
  gap: clamp(32px, 6vw, 72px);

  h1 {
    max-width: 11ch;
    margin-top: 8px;
    font-size: clamp(3rem, 8vw, 6.5rem);
    line-height: 0.9;
  }
}

.about-page__mission {
  display: grid;
  max-width: 78ch;
  gap: 22px;
  color: var(--body-copy);
  font-size: clamp(1.05rem, 1.6vw, 1.25rem);
  line-height: 1.85;
}
</style>

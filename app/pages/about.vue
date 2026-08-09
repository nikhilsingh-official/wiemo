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
  display: flex;
  flex-direction: column;
  gap: 72px;

  h1 {
    @include responsive-page-heading;

    max-width: 700px;
    margin-top: 8px;
    line-height: 0.9;
  }
}

.about-page__mission {
  display: flex;
  flex-direction: column;
  max-width: 780px;
  gap: 22px;
  color: var(--body-copy);
  font-size: 20px;
  line-height: 1.85;
}

@media (max-width: 1250px) {
  .about-page__mission {
    font-size: 1.6vw;
  }
}

@media (max-width: 1200px) {
  .about-page {
    gap: 6vw;
  }
}

@media (max-width: 1050px) {
  .about-page__mission {
    font-size: 17px;
  }
}

@media (max-width: 530px) {
  .about-page {
    gap: 32px;
  }
}
</style>

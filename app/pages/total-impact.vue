<script setup lang="ts">
import { SITE_CONTENT } from '~/content/siteContent'
import { HERO_STAGE } from '~/hero/stages'

definePageMeta({
  heroStages: [HERO_STAGE.totalImpact],
})
</script>

<template>
  <main class="content-section">
    <div class="wrap total-impact">
      <header>
        <p class="eyebrow">Total impact</p>
        <h1>Progress toward 1,000 students</h1>
        <p class="lede">{{ SITE_CONTENT.goal }}</p>
      </header>

      <dl class="total-impact__grid">
        <div
          v-for="metric in SITE_CONTENT.impactMetrics"
          :key="metric.label"
          class="total-impact__card"
        >
          <dt>{{ metric.label }}</dt>
          <dd>{{ metric.value }}</dd>
          <p>{{ metric.note }}</p>
        </div>
      </dl>
    </div>
  </main>
</template>

<style scoped lang="scss">
.total-impact {
  display: grid;
  gap: clamp(28px, 5vw, 56px);

  h1 {
    max-width: 12ch;
    font-size: clamp(3rem, 8vw, 6.5rem);
    line-height: 0.9;
  }
}

.total-impact__grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: clamp(16px, 3vw, 24px);
}

.total-impact__card {
  padding: clamp(24px, 4vw, 42px);
  border: 1px solid rgb(189 232 251 / 12%);
  border-radius: 18px;
  background: rgb(8 11 18 / 78%);

  dt {
    color: var(--mute);
    font-family: $font-mono;
    font-size: 0.68rem;
    letter-spacing: 0.14em;
    text-transform: uppercase;
  }

  dd {
    margin-top: 14px;
    color: var(--core);
    font-family: $font-display;
    font-size: clamp(3rem, 9vw, 7rem);
    font-weight: 700;
    line-height: 1;
  }

  p {
    margin-top: 14px;
    color: var(--faint);
  }
}

@media (max-width: 820px) {
  .total-impact__grid {
    grid-template-columns: 1fr;
  }
}
</style>

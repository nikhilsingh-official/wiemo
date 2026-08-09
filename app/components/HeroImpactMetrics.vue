<script setup lang="ts">
import { SITE_CONTENT } from '~/content/siteContent'

</script>

<template>
  <aside class="hero-impact" aria-label="Current impact">
    <p class="hero-impact__label">Prototype impact</p>
    <dl class="hero-impact__grid">
      <div
        v-for="metric in SITE_CONTENT.impactMetrics"
        :key="metric.label"
        class="hero-impact__metric"
      >
        <dt>{{ metric.label }}</dt>
        <dd>{{ metric.value }}</dd>
      </div>
    </dl>
  </aside>
</template>

<style scoped lang="scss">
.hero-impact {
  position: absolute;
  right: var(--gutter);
  bottom: calc(var(--gutter) + 86px);
  z-index: 2;
  width: min(420px, calc(100vw - (var(--gutter) * 2)));
  padding: 16px;
  border: 1px solid rgb(189 232 251 / 12%);
  border-radius: 18px;
  background: rgb(8 11 18 / 42%);
  box-shadow: 0 18px 48px rgb(0 0 0 / 28%);
  backdrop-filter: blur(16px) saturate(132%);
  -webkit-backdrop-filter: blur(16px) saturate(132%);
}

.hero-impact__label {
  margin-bottom: 12px;
  color: var(--mute);
  font-family: $font-mono;
  font-size: 10px;
  letter-spacing: 2px;
  text-transform: uppercase;
}

.hero-impact__grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
}

.hero-impact__metric {
  display: grid;
  gap: 4px;
  padding-top: 10px;
  border-top: 1px solid rgb(51 180 236 / 22%);

  dt {
    color: var(--faint);
    font-family: $font-mono;
    font-size: 10px;
    letter-spacing: 1px;
    line-height: 1.35;
    text-transform: uppercase;
  }

  dd {
    color: var(--core);
    font-family: $font-display;
    font-size: 39px;
    font-weight: 700;
    line-height: 1;
  }
}

@media (max-width: 1300px) {
  .hero-impact__metric dd {
    font-size: 3vw;
  }
}

@media (max-width: 760px) {
  .hero-impact {
    display: none;
  }
}
</style>

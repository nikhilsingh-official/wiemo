<script setup lang="ts">
import { SITE_CONTENT } from '~/content/siteContent'

</script>

<template>
  <aside class="hero-impact" aria-label="Current impact">
    <p class="hero-impact__label">Current impact</p>
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
  border: 1px solid color-mix(in srgb, var(--core) 12%, transparent);
  border-radius: 18px;
  background: color-mix(in srgb, var(--panel) 52%, transparent);
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
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}

.hero-impact__metric {
  display: grid;
  gap: 4px;
  padding-top: 10px;
  border-top: 1px solid color-mix(in srgb, var(--beam) 22%, transparent);

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

// The panel floats over the hero copy from the bottom edge, so a short viewport
// walks it up into the paragraph and then onto the CTA buttons — covering a
// button makes it unclickable, since the panel paints above it. It gets more
// compact first, and only steps aside when even that would still collide.
@media (max-height: 820px) {
  .hero-impact {
    bottom: calc(var(--gutter) + 62px);
    padding: 12px;
  }

  .hero-impact__label {
    margin-bottom: 8px;
  }

  .hero-impact__metric {
    padding-top: 8px;

    dd {
      font-size: 28px;
    }
  }
}

@media (max-height: 700px) {
  .hero-impact {
    display: none;
  }
}
</style>

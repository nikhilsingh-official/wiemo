<script setup lang="ts">
import type { StyleValue } from 'vue'

defineProps<{
  morphFrom: string
  morphTo: string
  morphPercent: number
  morphProgressStyle: StyleValue
}>()
</script>

<template>
  <aside class="readout readout--bottom-right">
    <span class="readout__row">
      <span class="hero__morph-key">From</span>
      {{ morphFrom }}
    </span>
    <span class="readout__row readout__highlight">
      <span class="hero__morph-key">To</span>
      {{ morphTo }}
    </span>
    <span class="hero__morph-progress" aria-hidden="true">
      <span class="hero__morph-progress-bar" :style="morphProgressStyle" />
    </span>
    <span class="readout__row hero__morph-percent">{{ morphPercent }}%</span>
  </aside>
</template>

<style scoped lang="scss">
.hero__morph-key {
  display: inline-block;
  width: 4.8em;
  color: var(--faint);
}

.hero__morph-progress {
  display: block;
  height: 1px;
  margin-top: 9px;
  overflow: hidden;
  background: var(--deepest);
}

.hero__morph-progress-bar {
  display: block;
  width: 100%;
  height: 100%;
  background: var(--beam);
  box-shadow: 0 0 8px color-mix(in srgb, var(--beam) 70%, transparent);
  transform-origin: left center;
  transition: transform 80ms linear;
}

.hero__morph-percent {
  margin-top: 4px;
  color: var(--faint);
}
</style>

<script setup lang="ts">
import type { CSSProperties } from 'vue'
import { createPageBackground } from '~/backgrounds/pageBackgrounds'

const route = useRoute()
const background = computed(() => createPageBackground(route.path))

const backgroundStyle = computed(() => ({
  '--page-background-base': background.value.baseColor,
  '--page-grid-width': `${background.value.grid.width}px`,
  '--page-grid-height': `${background.value.grid.height}px`,
  '--page-grid-angle': `${background.value.grid.angle}deg`,
  '--page-grid-opacity': String(background.value.grid.opacity),
}) as CSSProperties)

function starStyle(star: typeof background.value.starsGenerated[number]) {
  return {
    left: `${star.x}%`,
    top: `${star.y}%`,
    width: `${star.size}px`,
    height: `${star.size}px`,
    opacity: star.opacity,
    backgroundColor: star.color,
    boxShadow: `0 0 ${star.blur}px ${star.color}`,
    animationDuration: `${star.duration}s`,
    animationDelay: `${star.delay}s`,
  }
}

function glowStyle(glow: typeof background.value.glows[number]) {
  return {
    left: `${glow.x}%`,
    top: `${glow.y}%`,
    width: `${glow.size}vw`,
    height: `${glow.size}vw`,
    opacity: glow.opacity,
    background: `radial-gradient(circle, ${glow.color}, transparent 68%)`,
  }
}
</script>

<template>
  <div
    class="page-background"
    :data-background="background.name"
    :style="backgroundStyle"
    aria-hidden="true"
  >
    <div class="page-background__grid" />
    <span
      v-for="(glow, index) in background.glows"
      :key="`glow-${index}`"
      class="page-background__glow"
      :style="glowStyle(glow)"
    />
    <i
      v-for="star in background.starsGenerated"
      :key="`${background.path}-${star.id}`"
      class="page-background__star"
      :style="starStyle(star)"
    />
  </div>
</template>

<style scoped lang="scss">
.page-background {
  position: fixed;
  z-index: 0;
  inset: 0;
  overflow: hidden;
  background: var(--page-background-base);
  pointer-events: none;
}

.page-background__grid {
  position: absolute;
  inset: -32%;
  background-image:
    linear-gradient(rgb(189 232 251 / 100%) 1px, transparent 1px),
    linear-gradient(90deg, rgb(189 232 251 / 100%) 1px, transparent 1px);
  background-size: var(--page-grid-width) var(--page-grid-height);
  opacity: var(--page-grid-opacity);
  transform: rotate(var(--page-grid-angle));
  mask-image: linear-gradient(to bottom, transparent 0%, black 16%, black 84%, transparent 100%);
}

.page-background__glow {
  position: absolute;
  border-radius: 50%;
  transform: translate(-50%, -50%);
  filter: blur(10px);
}

.page-background__star {
  position: absolute;
  border-radius: 50%;
  animation: page-star-breathe ease-in-out infinite alternate;
}

@keyframes page-star-breathe {
  from {
    transform: scale(0.72);
  }

  to {
    transform: scale(1.18);
  }
}
</style>
